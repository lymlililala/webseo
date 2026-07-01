// api/run/start.js — 开始一次域名工具运行:校验登录 → 扣积分 → 签发运行令牌。
// 前端拿到令牌后,本次运行内的 /api/namer、/api/serper 调用都带上它才被放行。
import { createClient } from '@supabase/supabase-js'
import { runCost } from '../../src/config/plans.js'
import { signRunToken, creditsEnforced } from '../_runToken.js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const PUBLISHABLE =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''

const VALID_ACTIONS = new Set(['naming', 'autofill', 'rank', 'continue'])

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
  if (!creditsEnforced() || !SUPABASE_URL || !PUBLISHABLE) {
    res.status(500).json({ error: 'server not configured' })
    return
  }

  const authz = req.headers['authorization'] || ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
  if (!token) {
    res.status(401).json({ error: 'login required' })
    return
  }

  let body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(await readRaw(req))
    } catch {
      body = {}
    }
  }
  const action = String(body.action || '')
  if (!VALID_ACTIONS.has(action)) {
    res.status(400).json({ error: 'invalid action' })
    return
  }
  const n = Number(body.n) || 1
  const amount = runCost(action, n)

  // 以用户身份调用 consume_credits(SECURITY DEFINER,内部用 auth.uid() 只扣自己)
  const userClient = createClient(SUPABASE_URL, PUBLISHABLE, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userErr } = await userClient.auth.getUser()
  if (userErr || !userData?.user) {
    res.status(401).json({ error: 'invalid session' })
    return
  }

  const { data: newBalance, error } = await userClient.rpc('consume_credits', {
    p_amount: amount,
    p_reason: `domain.${action}`,
    p_ref: null,
  })
  if (error) {
    // consume_credits 在余额不足时 raise exception
    if (/insufficient/i.test(error.message || '')) {
      res.status(402).json({ error: 'insufficient', amount })
      return
    }
    res.status(500).json({ error: 'charge failed' })
    return
  }

  res.status(200).json({
    token: signRunToken(userData.user.id),
    amount,
    balance: newBalance,
  })
}
