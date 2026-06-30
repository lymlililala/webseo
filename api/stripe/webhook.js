// api/stripe/webhook.js — Stripe 付款回调:验签 → 幂等发放积分。
// 必须用原始 body 验签,故关闭 Vercel 的 bodyParser(见文件末 config)。
// 服务端密钥:STRIPE_SECRET_KEY、STRIPE_WEBHOOK_SECRET、SUPABASE_SECRET_KEY。
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY || ''

// 读取原始请求体为 Buffer(Stripe 验签要求逐字节一致)
function readRawBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' })
    return
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !whSecret || !SUPABASE_URL || !SUPABASE_SECRET) {
    res.status(500).json({ error: 'server not configured' })
    return
  }

  const stripe = new Stripe(stripeKey)
  const sig = req.headers['stripe-signature']

  let event
  try {
    const raw = await readRawBuffer(req)
    event = stripe.webhooks.constructEvent(raw, sig, whSecret)
  } catch (e) {
    // 验签失败 → 拒绝(可能是伪造请求或密钥不匹配)
    res.status(400).json({ error: `webhook signature failed: ${String(e?.message || e)}` })
    return
  }

  // 只处理"结账完成"。其余事件直接 200 忽略。
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    // 仅在付款已结清时发放(订阅/异步支付场景的保险)
    if (session.payment_status === 'paid' || session.status === 'complete') {
      const admin = createClient(SUPABASE_URL, SUPABASE_SECRET, { auth: { persistSession: false } })
      const { error } = await admin.rpc('fulfill_order', { p_session_id: session.id })
      if (error) {
        // 发放失败 → 返回 500 让 Stripe 重试(fulfill_order 幂等,重试安全)
        res.status(500).json({ error: 'fulfill failed' })
        return
      }
    }
  }

  res.status(200).json({ received: true })
}

// 关闭自动 body 解析,保留原始字节供 Stripe 验签
export const config = {
  api: { bodyParser: false },
}
