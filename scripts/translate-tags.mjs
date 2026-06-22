// translate-tags.mjs —— 一次性迁移：把 wseo_articles/news/tutorials 的 tags 双语化。
//   tags    → 规整为英文（中文来源标签翻成英文）
//   tags_zh → 中文（JSON 字符串数组，结构同 tags）
// 翻译走 DeepSeek（scripts/wechat/.env 的 DEEPSEEK_API_KEY）；Supabase 用根 .env.local 的 SUPABASE_SECRET_KEY。
//
// 用法：
//   node scripts/translate-tags.mjs            # dry-run：翻译并打印样例，不写库
//   node scripts/translate-tags.mjs --apply    # 写库（PATCH 每行 tags + tags_zh）

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DeepSeek } from './wechat/deepseek.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APPLY = process.argv.includes('--apply')

// ── 读根 .env.local 拿 Supabase 凭证 ──────────────────────────────
for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
}
const SB_URL = process.env.VITE_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SECRET_KEY
const TABLES = ['wseo_articles', 'wseo_news', 'wseo_tutorials']

async function sb(method, pathQuery, body) {
  const res = await fetch(`${SB_URL}/rest/v1/${pathQuery}`, {
    method,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${method} ${pathQuery} → HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return method === 'GET' ? res.json() : null
}

// 一个 tags 字段 → 干净的原子标签数组（拆开逗号拼接的脏数据）
function cleanTags(raw) {
  let arr = raw
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw)
    } catch {
      arr = [raw]
    }
  }
  if (!Array.isArray(arr)) arr = []
  const out = []
  for (const x of arr) String(x).split(/[,，]/).map((s) => s.trim()).filter(Boolean).forEach((s) => out.push(s))
  return [...new Set(out)]
}

const ds = new DeepSeek()

// 批量翻译：返回 { 原标签: { en, zh } }
async function translateBatch(tags) {
  const sys =
    '你是 SEO/数字营销领域的术语翻译。给定一批标签,为每个标签同时给出英文(en)与中文(zh)两种写法。' +
    '规则:品牌名/产品名(如 Ahrefs、DeepSeek、ChatGPT)、通用缩写(SEO、GEO、AEO、API、JSON-LD、llms.txt、E-E-A-T)在两种语言中均保持原样;' +
    '其余描述性短语给出地道翻译。只输出一个 JSON 对象,key 为原标签,value 为 {"en":"...","zh":"..."}。不要任何解释。'
  const obj = await ds.chatJSON([
    { role: 'system', content: sys },
    { role: 'user', content: JSON.stringify(tags) },
  ])
  return obj && typeof obj === 'object' ? obj : {}
}

async function main() {
  console.log(`模式: ${APPLY ? '✍️  APPLY(写库)' : '🔍 DRY-RUN(不写库)'}\n`)

  // 1. 拉所有行
  const rows = {}
  const allTags = new Set()
  for (const tb of TABLES) {
    const data = await sb('GET', `${tb}?select=id,tags`)
    rows[tb] = data.map((r) => ({ id: r.id, tags: cleanTags(r.tags) }))
    rows[tb].forEach((r) => r.tags.forEach((t) => allTags.add(t)))
    console.log(`  ${tb}: ${rows[tb].length} 行`)
  }
  const uniq = [...allTags]
  console.log(`\n唯一原子标签: ${uniq.length} —— 开始翻译...\n`)

  // 2. 分批翻译
  const map = {}
  const BATCH = 20
  for (let i = 0; i < uniq.length; i += BATCH) {
    const batch = uniq.slice(i, i + BATCH)
    try {
      Object.assign(map, await translateBatch(batch))
    } catch (e) {
      console.error(`  ⚠️  批次 ${i / BATCH} 翻译失败:`, e.message)
    }
    process.stdout.write(`\r  已翻译 ${Math.min(i + BATCH, uniq.length)}/${uniq.length}`)
  }
  console.log('\n')

  const enOf = (t) => (map[t]?.en || t).trim()
  const zhOf = (t) => (map[t]?.zh || t).trim()
  const uniqArr = (a) => [...new Set(a.filter(Boolean))]

  // 样例
  console.log('样例翻译:')
  uniq.slice(0, 8).forEach((t) => console.log(`  ${t}  →  en:${enOf(t)} | zh:${zhOf(t)}`))
  console.log('')

  // 3. 写回每行
  let patched = 0
  for (const tb of TABLES) {
    for (const r of rows[tb]) {
      if (!r.tags.length) continue
      const tagsEn = uniqArr(r.tags.map(enOf))
      const tagsZh = uniqArr(r.tags.map(zhOf))
      if (APPLY) {
        await sb('PATCH', `${tb}?id=eq.${r.id}`, {
          tags: JSON.stringify(tagsEn),
          tags_zh: JSON.stringify(tagsZh),
        })
      }
      patched++
    }
    console.log(`  ${tb}: ${APPLY ? '已写回' : '将写回'} ${rows[tb].filter((r) => r.tags.length).length} 行`)
  }

  console.log(`\n${APPLY ? '✅ 完成' : '🔍 DRY-RUN 结束'}：共 ${patched} 行。DeepSeek 用量:`, ds.costEstimate())
  if (!APPLY) console.log('确认无误后加 --apply 写库。')
}

main().catch((e) => {
  console.error('❌ 失败:', e)
  process.exit(1)
})
