// api/stripe/checkout.js — 创建 Stripe Checkout 会话(充值积分)。
// 流程:校验 Supabase 登录 JWT → 校验积分包 → 建 Stripe 会话 → 写 pending 订单 → 返回支付链接。
// 服务端密钥:STRIPE_SECRET_KEY、SUPABASE_SECRET_KEY。绝不下发前端。
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getPack, grantedCredits, CURRENCY } from '../../src/config/plans.js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY || ''

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > 10000) req.destroy()
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' })
    return
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || !SUPABASE_URL || !SUPABASE_SECRET) {
    res.status(500).json({ error: 'server not configured' })
    return
  }

  // 1) 校验登录态:前端在 Authorization 头带 Supabase access_token
  const authz = req.headers['authorization'] || ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
  if (!token) {
    res.status(401).json({ error: 'login required' })
    return
  }
  const admin = createClient(SUPABASE_URL, SUPABASE_SECRET, { auth: { persistSession: false } })
  const { data: userData, error: userErr } = await admin.auth.getUser(token)
  if (userErr || !userData?.user) {
    res.status(401).json({ error: 'invalid session' })
    return
  }
  const user = userData.user

  // 2) 读取并校验积分包
  let body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(await readRaw(req))
    } catch {
      body = {}
    }
  }
  const pack = getPack(body.packId)
  if (!pack) {
    res.status(400).json({ error: 'invalid pack' })
    return
  }
  const totalCredits = grantedCredits(pack)

  // 3) 回跳地址(只接受站内相对路径,防开放重定向)
  const host = req.headers['x-forwarded-host'] || req.headers['host']
  const base = `https://${host}`
  const path = typeof body.returnPath === 'string' && body.returnPath.startsWith('/') ? body.returnPath : '/'
  const sep = path.includes('?') ? '&' : '?'

  // 4) 建 Stripe 会话
  const stripe = new Stripe(stripeKey)
  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: pack.priceCents,
            product_data: { name: `SGAIndex ${totalCredits} credits` },
          },
        },
      ],
      client_reference_id: user.id,
      // 兜底渠道:即使订单表暂缺,webhook 也能从 metadata 复原(当前以订单表为准)
      metadata: { user_id: user.id, pack_id: pack.id, credits: String(totalCredits) },
      success_url: `${base}${path}${sep}credits=success`,
      cancel_url: `${base}${path}${sep}credits=cancel`,
    })
  } catch (e) {
    res.status(502).json({ error: 'stripe error', detail: String(e?.message || e) })
    return
  }

  // 5) 写 pending 订单(webhook 收款后据此幂等发放)
  const { error: orderErr } = await admin.from('wseo_orders').insert({
    user_id: user.id,
    stripe_session_id: session.id,
    pack_id: pack.id,
    credits: totalCredits,
    amount_cents: pack.priceCents,
    currency: CURRENCY,
    status: 'pending',
  })
  if (orderErr) {
    res.status(500).json({ error: 'order create failed' })
    return
  }

  res.status(200).json({ url: session.url })
}
