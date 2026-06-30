-- 通用积分钱包 —— Step 1 数据库结构
-- 在 Supabase 控制台 → SQL Editor 执行一次即可(全部幂等,可重复执行)。
--
-- 设计:
--   wseo_credit_balance  余额表(读快,单行/用户)
--   wseo_credit_ledger   流水账(append-only,审计/对账的事实源)
--   consume_credits()    原子扣费 RPC(余额足才扣,前端可调,只能扣自己)
--   grant_credits()      发放积分 RPC(仅 service_role,给 Stripe webhook 用)
-- 安全:RLS 只允许用户读自己的行;任何写入只走 service_role 或 SECURITY DEFINER 函数。

-- ── 余额表 ────────────────────────────────────────────────
create table if not exists public.wseo_credit_balance (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  balance    integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

-- ── 流水账(余额的事实源,只增不改)────────────────────────
create table if not exists public.wseo_credit_ledger (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  delta      integer not null,                 -- 正=入账,负=扣费
  reason     text not null,                    -- signup_bonus | purchase | consume | refund | adjust
  ref        text,                             -- 关联引用:stripe session / 动作 key / 订单号
  created_at timestamptz not null default now()
);
create index if not exists idx_ledger_user on public.wseo_credit_ledger (user_id, created_at desc);

-- ── RLS:用户只读自己的;不建任何前端 insert/update 策略 ──
alter table public.wseo_credit_balance enable row level security;
alter table public.wseo_credit_ledger  enable row level security;

drop policy if exists "own balance read" on public.wseo_credit_balance;
create policy "own balance read" on public.wseo_credit_balance
  for select using (auth.uid() = user_id);

drop policy if exists "own ledger read" on public.wseo_credit_ledger;
create policy "own ledger read" on public.wseo_credit_ledger
  for select using (auth.uid() = user_id);
-- 无 insert/update/delete 策略 ⇒ anon / authenticated 无法直接写表,
-- 只能经下面的 SECURITY DEFINER 函数或 service_role(绕过 RLS)写入。

-- ── 新用户自动建余额行 + 可选注册赠送积分 ────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare bonus integer := 10;           -- 注册赠送积分,10 = 新用户送 10 分试用(够试 10 次起名)
begin
  insert into public.wseo_credit_balance (user_id, balance)
    values (new.id, bonus)
    on conflict (user_id) do nothing;
  if bonus > 0 then
    insert into public.wseo_credit_ledger (user_id, delta, reason, ref)
      values (new.id, bonus, 'signup_bonus', null);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 原子扣费:余额足才扣,并记一条流水。返回扣后余额;不足则抛异常 ──
-- 用 auth.uid() 锁定当前登录用户 ⇒ 永远只能扣自己的,无越权风险。
create or replace function public.consume_credits(
  p_amount integer,
  p_reason text,
  p_ref    text default null
) returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  new_balance integer;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;

  update public.wseo_credit_balance
    set balance = balance - p_amount, updated_at = now()
    where user_id = uid and balance >= p_amount
    returning balance into new_balance;

  if new_balance is null then raise exception 'insufficient credits'; end if;

  insert into public.wseo_credit_ledger (user_id, delta, reason, ref)
    values (uid, -p_amount, coalesce(p_reason, 'consume'), p_ref);

  return new_balance;
end;
$$;

-- ── 发放积分(购买/退款/人工调整)——仅 service_role 调用 ──
-- 幂等由调用方(Stripe webhook)用 orders 表的唯一约束保证,本函数不去重。
create or replace function public.grant_credits(
  p_user   uuid,
  p_amount integer,
  p_reason text,
  p_ref    text default null
) returns integer
language plpgsql
security definer set search_path = public
as $$
declare new_balance integer;
begin
  insert into public.wseo_credit_balance (user_id, balance)
    values (p_user, p_amount)
    on conflict (user_id)
      do update set balance = wseo_credit_balance.balance + p_amount, updated_at = now()
    returning balance into new_balance;

  insert into public.wseo_credit_ledger (user_id, delta, reason, ref)
    values (p_user, p_amount, coalesce(p_reason, 'grant'), p_ref);

  return new_balance;
end;
$$;

-- ── 执行权限 ──────────────────────────────────────────────
-- consume:登录用户可调(只能扣自己,Step 3 由后端带用户 JWT 调用)
grant execute on function public.consume_credits(integer, text, text) to authenticated;
-- grant:严禁前端,仅 service_role(Stripe webhook 用 service_role key 调用)
revoke execute on function public.grant_credits(uuid, integer, text, text) from anon, authenticated;


-- ════════════════════════════════════════════════════════════
-- Step 2:Stripe 充值 —— 订单表 + 幂等发放
-- ════════════════════════════════════════════════════════════

-- 订单表:checkout 创建时写 pending,webhook 收到付款回调置 paid。
-- stripe_session_id 唯一 ⇒ 天然幂等(重复回调不会重复发分)。
create table if not exists public.wseo_orders (
  id                bigint generated always as identity primary key,
  user_id           uuid not null references auth.users (id) on delete cascade,
  stripe_session_id text not null unique,
  pack_id           text not null,
  credits           integer not null,        -- 本单应发放的总积分(含赠送)
  amount_cents      integer not null,
  currency          text not null default 'usd',
  status            text not null default 'pending',  -- pending | paid
  created_at        timestamptz not null default now(),
  paid_at           timestamptz
);

alter table public.wseo_orders enable row level security;

drop policy if exists "own orders read" on public.wseo_orders;
create policy "own orders read" on public.wseo_orders
  for select using (auth.uid() = user_id);
-- 无 insert/update 策略 ⇒ 仅 service_role / 下面的 SECURITY DEFINER 函数能写。

-- 幂等履约:把 pending 订单置 paid 并发放积分,二者在同一事务内完成。
-- 已 paid 或不存在 ⇒ 返回 0(无副作用),保证 webhook 重放安全。仅 service_role 调用。
create or replace function public.fulfill_order(p_session_id text)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  v_user    uuid;
  v_credits integer;
begin
  update public.wseo_orders
    set status = 'paid', paid_at = now()
    where stripe_session_id = p_session_id and status = 'pending'
    returning user_id, credits into v_user, v_credits;

  if not found then
    return 0;  -- 重复回调或未知 session:幂等空操作
  end if;

  perform public.grant_credits(v_user, v_credits, 'purchase', p_session_id);
  return v_credits;
end;
$$;

revoke execute on function public.fulfill_order(text) from anon, authenticated;
