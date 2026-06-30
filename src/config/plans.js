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
// eslint-disable-next-line no-unused-vars
export function resolvePlanId(_req) {
  return DEFAULT_PLAN
}

// 把数值夹到上限内(Infinity 表示不限)
export function clampToLimit(value, max) {
  return max === Infinity ? value : Math.min(value, max)
}
