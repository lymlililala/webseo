// 套餐限额 —— 单一事实源(框架无关的纯 ESM,前端与 api/ 后端都从这里取)。
//
// 设计意图:把"会按套餐收费/限额"的所有旋钮集中到这里。业务代码只读 getLimits(),
// 不写死任何数字。将来要收费时,只需:
//   1) 在 PLANS 里加 free / pro 档并填上各自数字;
//   2) 把 resolvePlanId() 改成"按登录用户解析套餐"(现在恒返回 default)。
// 业务逻辑(DomainNamerPage / api 函数)一行都不用动。
//
// ⚠️ 当前阶段(仅结构改造):只有一个 default 档,数值全部放开 = 与现有行为完全一致,
// 不对任何用户产生新限制。

// 单个套餐的限额形状:
//   autofillMax       自动凑满"目标可用数 N"的上限
//   rankMax           "已有候选排名"一次可处理的名字数 M 上限
//   tldMax            每个名字同时查询的后缀(TLD)数上限
//   dailyRuns         每日"起名"次数上限(Infinity = 不限)
//   continueRecommend 是否允许"继续推荐"
//   aiSummary         是否提供 AI 综合推荐
export const PLANS = {
  // 当前唯一档:全部放开,等同改造前行为
  default: {
    autofillMax: 30,
    rankMax: Infinity,
    tldMax: Infinity,
    dailyRuns: Infinity,
    continueRecommend: true,
    aiSummary: true,
  },

  // ↓↓↓ 将来收费时取消注释、填数字即可(示例,非当前生效)↓↓↓
  // free: {
  //   autofillMax: 6,
  //   rankMax: 5,
  //   tldMax: 3,
  //   dailyRuns: 3,
  //   continueRecommend: false,
  //   aiSummary: false,
  // },
  // pro: {
  //   autofillMax: 30,
  //   rankMax: 50,
  //   tldMax: 12,
  //   dailyRuns: 100,
  //   continueRecommend: true,
  //   aiSummary: true,
  // },
}

export const DEFAULT_PLAN = 'default'

// 取某个套餐的限额(未知套餐回退 default)
export function getLimits(planId = DEFAULT_PLAN) {
  return PLANS[planId] || PLANS[DEFAULT_PLAN]
}

// 后端:从请求解析当前用户套餐 —— 现在恒为 default。
// TODO(收费阶段):解析登录态/JWT → 查用户套餐 → 返回 'free' | 'pro' | ...
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export function resolvePlanId(_req) {
  return DEFAULT_PLAN
}

// 把数值夹到上限内(Infinity 表示不限)
export function clampToLimit(value, max) {
  return max === Infinity ? value : Math.min(value, max)
}

// ════════════════════════════════════════════════════════════
// 积分付费(Step 2 起)—— 价目表单一事实源
// 改价/加档只动这里;前端购买页与 api/stripe/* 都从这里取。
// ════════════════════════════════════════════════════════════

// 计价货币(Stripe 用),小写,符合 Stripe currency 规范。
export const CURRENCY = 'usd'

// 支付总开关:false = 隐藏"购买积分"入口(支付渠道未就绪时)。
// 积分仍可通过注册赠送 / 后台 grant_credits 发放。将来接通 PayPal 等改 true 即可。
export const PAYMENT_ENABLED = false

// 每个动作消耗几分(Step 3 接入扣费时由后端读取,key 用 "功能.动作")。
// 通用钱包:将来别的页面加付费功能,在这里加一行 + 该页调用扣费 API 即可。
export const COSTS = {
  'domain.naming': 1, // 一次"AI 起名"(返回一批候选 + 域名/撞名查询)
  'domain.rank': 1, // 一次"已有候选排名"批量查询
  'domain.autofill': 1, // 一次"自动凑满"
}

// 积分包:priceCents 是该档支付金额(美分);credits 为基础分,bonus 为赠送分,
// 实际发放 = credits + bonus(见 grantedCredits)。popular=true 给该档加高亮徽章。
export const PACKS = [
  { id: 'starter', priceCents: 500, credits: 100, bonus: 0 },
  { id: 'popular', priceCents: 2000, credits: 500, bonus: 100, popular: true },
  { id: 'pro', priceCents: 5000, credits: 1500, bonus: 500 },
]

// 某个积分包实际发放的总分(基础 + 赠送)。
export function grantedCredits(pack) {
  return (pack?.credits || 0) + (pack?.bonus || 0)
}

// 按 id 取积分包(后端校验用,未知 id 返回 undefined)。
export function getPack(id) {
  return PACKS.find((p) => p.id === id)
}
