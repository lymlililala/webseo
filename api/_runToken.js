// api/_runToken.js — 运行令牌(HMAC 签名),证明"这次运行已扣费"。
// /api/run/start 扣分成功后签发;/api/namer、/api/serper 校验通过才干活,杜绝白嫖。
// 下划线前缀 ⇒ 不作为路由,仅被其它函数 import。
import crypto from 'crypto'

// 令牌密钥:优先 RUN_TOKEN_SECRET,回退 SUPABASE_SECRET_KEY。都没配则视为"未启用扣费"。
const SECRET = process.env.RUN_TOKEN_SECRET || process.env.SUPABASE_SECRET_KEY || ''
const TTL_MS = 10 * 60 * 1000 // 令牌有效期 10 分钟(覆盖一次运行内的多次 namer/serper 调用)

// 是否启用扣费闸门(后端以密钥是否配置为准,与前端 CREDITS_ENABLED 配合灰度)。
export function creditsEnforced() {
  return !!SECRET
}

export function signRunToken(uid) {
  const payload = Buffer.from(JSON.stringify({ uid, exp: Date.now() + TTL_MS })).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

// 校验令牌:合法且未过期返回 { uid },否则返回 null。
export function verifyRunToken(token) {
  if (!SECRET || typeof token !== 'string' || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expect = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expect)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!uid || !exp || Date.now() > exp) return null
    return { uid }
  } catch {
    return null
  }
}
