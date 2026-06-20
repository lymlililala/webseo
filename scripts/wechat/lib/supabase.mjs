// Supabase 客户端封装 —— 供合成流水线写入 wseo_articles、判重查 slug/title 共用。
// 凭证来自项目根 .env.local：VITE_SUPABASE_URL + SUPABASE_SECRET_KEY
//   ① 已注入的 process.env（CI / Vercel）优先；否则 ② 读项目根 .env.local。
// 与前端 src/services/supabase.ts 同一项目、同一表。

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dir = dirname(fileURLToPath(import.meta.url))
// scripts/wechat/lib → 项目根
const ROOT_ENV = join(__dir, '..', '..', '..', '.env.local')

// 从根 .env.local 兜底读取（不覆盖已存在的 process.env）。
function loadRootEnv() {
  try {
    const txt = readFileSync(ROOT_ENV, 'utf8')
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
    }
  } catch {
    // 根 .env.local 不存在（如 CI 用真实环境变量）则跳过
  }
}

function ensureEnv() {
  if (!process.env.SUPABASE_SECRET_KEY || !process.env.VITE_SUPABASE_URL) loadRootEnv()
}

/** 是否具备走 Supabase 的条件。 */
export function hasSupabase() {
  ensureEnv()
  return !!(process.env.SUPABASE_SECRET_KEY && process.env.VITE_SUPABASE_URL)
}

let _client = null

/** 取（懒加载）Supabase 客户端；缺 key 抛错。 */
export function getSupabase() {
  if (_client) return _client
  ensureEnv()
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('缺少 VITE_SUPABASE_URL / SUPABASE_SECRET_KEY（本地放项目根 .env.local）')
  _client = createClient(url, key, { auth: { persistSession: false } })
  return _client
}

/** 合成流水线写入的目标表 */
export const ARTICLES_TABLE = 'wseo_articles'
