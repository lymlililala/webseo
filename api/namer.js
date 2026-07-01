// api/namer.js — AI 域名起名:把前端请求转发给 deepseek(OpenAI 兼容),SSE 流式回传。
// DEEPSEEK_API_KEY 只在服务端读取,绝不下发前端、绝不进 Git。
// 部署:Vercel 环境变量 DEEPSEEK_API_KEY(标记 Sensitive);本地:.env.local(被 .gitignore 屏蔽)。
import { verifyRunToken, creditsEnforced } from './_runToken.js'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const MODEL = 'deepseek-chat'
const MAX_TOKENS = 2048

// 极简内存限流(best-effort,冷启动会重置):每 IP 每分钟 LIMIT 次,防滥用刷量。
const HITS = new Map()
const WINDOW_MS = 60_000
const LIMIT = 30
function rateLimited(ip) {
  const now = Date.now()
  const rec = HITS.get(ip)
  if (!rec || now - rec.start > WINDOW_MS) {
    HITS.set(ip, { start: now, n: 1 })
    return false
  }
  rec.n++
  return rec.n > LIMIT
}

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > 20000) req.destroy() // body 体量保护
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

  const key = process.env.DEEPSEEK_API_KEY
  if (!key) {
    res.status(500).json({ error: 'server not configured' })
    return
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    res.status(429).json({ error: 'too many requests' })
    return
  }

  // 扣费闸门:启用时必须带有效运行令牌(由 /api/run/start 扣分后签发)。
  if (creditsEnforced() && !verifyRunToken(req.headers['x-run-token'])) {
    res.status(402).json({ error: 'run token required' })
    return
  }

  // 读取 body(Vercel 通常已解析 JSON;兜底手动读)
  let body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(await readRaw(req))
    } catch {
      body = {}
    }
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt : ''
  const messages = Array.isArray(body.messages) ? body.messages : prompt ? [{ role: 'user', content: prompt }] : null
  if (!messages) {
    res.status(400).json({ error: 'missing prompt' })
    return
  }
  if (JSON.stringify(messages).length > 8000) {
    res.status(413).json({ error: 'payload too large' })
    return
  }

  let upstream
  try {
    upstream = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        temperature: typeof body.temperature === 'number' ? Math.min(1.5, Math.max(0, body.temperature)) : 0.9,
        stream: true,
      }),
    })
  } catch {
    res.status(502).json({ error: 'upstream unreachable' })
    return
  }

  if (!upstream.ok || !upstream.body) {
    res.status(502).json({ error: `upstream HTTP ${upstream.status}` })
    return
  }

  // 把 deepseek 的 SSE 流原样透传给前端(前端按 OpenAI delta 解析)
  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
  })
  const reader = upstream.body.getReader()
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  } catch {
    // 上游流中断,直接收尾
  }
  res.end()
}
