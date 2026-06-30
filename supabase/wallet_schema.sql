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
declare bonus integer := 0;            -- 注册赠送积分,0 = 不送(将来想拉新就改这里)
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
