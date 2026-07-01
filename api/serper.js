// api/serper.js — Google 撞名检测:把前端请求转发给 Serper,支持多 key 自动故障转移。
// key 来源(按优先级):
//   1) Edge Config 的 SERPER_KEY(可为字符串、逗号分隔串或数组;频繁轮换免重新部署)
//   2) 环境变量 SERPER_KEYS(逗号分隔多个) → 单个 SERPER_KEY(本地/简单部署)
// 某个 key 配额用尽/失效(401/403/429)或上游故障时,自动切换到下一个。
import { get } from '@vercel/edge-config'
import { verifyRunToken, creditsEnforced } from './_runToken.js'

const SERPER_URL = 'https://google.serper.dev/search'
// 触发"换下一个 key"的状态:401 未授权、403 配额耗尽/无效、429 限频
const ROTATE_STATUS = new Set([401, 403, 429])

// 极简内存限流(best-effort,冷启动会重置)
const HITS = new Map()
const WINDOW_MS = 60_000
const LIMIT = 60
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

// 把任意形态(数组 / 逗号或空白分隔串)归一化为去重后的 key 列表
function normalizeKeys(v) {
  if (!v) return []
  const arr = Array.isArray(v) ? v : String(v).split(/[\s,]+/)
  return [...new Set(arr.map((s) => String(s).trim()).filter(Boolean))]
}

// 优先 Edge Config;无连接串或读失败时回退环境变量
async function resolveSerperKeys() {
  try {
    if (process.env.EDGE_CONFIG) {
      const v = await get('SERPER_KEY')
      const list = normalizeKeys(v)
      if (list.length) return list
    }
  } catch {
    // Edge Config 不可用,回退环境变量
  }
  return normalizeKeys(process.env.SERPER_KEYS || process.env.SERPER_KEY)
}

// 记住上次成功的 key 下标,下次从它开始(避免每次都先撞死掉的 key);冷启动重置
let goodIdx = 0

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > 4000) req.destroy()
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

  const keys = await resolveSerperKeys()
  if (!keys.length) {
    res.status(500).json({ error: 'server not configured' })
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

  const q = typeof body.q === 'string' ? body.q.trim().slice(0, 200) : ''
  if (!q) {
    res.status(400).json({ error: 'missing q' })
    return
  }
  const num = Math.min(20, Math.max(1, parseInt(body.num, 10) || 10))
  const payload = JSON.stringify({ q, num })

  // 从上次成功的 key 开始,依次尝试所有 key
  let lastStatus = 0
  for (let off = 0; off < keys.length; off++) {
    const idx = (goodIdx + off) % keys.length
    const key = keys[idx]

    let upstream
    try {
      upstream = await fetch(SERPER_URL, {
        method: 'POST',
        headers: { 'X-API-KEY': key, 'content-type': 'application/json' },
        body: payload,
      })
    } catch {
      lastStatus = 502
      continue // 网络故障 → 试下一个 key
    }

    if (upstream.ok) {
      goodIdx = idx // 记住这个能用的 key
      const text = await upstream.text()
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.status(200).send(text)
      return
    }

    lastStatus = upstream.status
    // 配额/失效/限频 或 上游 5xx → 换下一个 key;其它(如 400 查询本身有问题)直接返回
    if (ROTATE_STATUS.has(upstream.status) || upstream.status >= 500) continue
    res.status(502).json({ error: `upstream HTTP ${upstream.status}` })
    return
  }

  // 所有 key 都失败
  res.status(502).json({ error: `all serper keys exhausted (last HTTP ${lastStatus})` })
}
