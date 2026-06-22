// 5) 补译：把缺中文译文的 wseo_articles 用 DeepSeek 译成简体中文，回写 title_zh/description_zh/content_zh。
//    判定口径与预渲染一致：以 content_zh 是否为空作为「未译」标准（title_zh 单独译标题不算齐活）。
//    幂等：只挑 content_zh 为空的行，跑多少次都安全；每晚 CI 跑一次即可持续追平新发文章。
//
// 用法：
//   node scripts/wechat/5-translate.mjs --dry-run         # 只列出待译，不调 LLM、不写库
//   node scripts/wechat/5-translate.mjs                   # 译并写库（默认上限 12 篇/次）
//   node scripts/wechat/5-translate.mjs --limit 6         # 限制本次最多译几篇
//   node scripts/wechat/5-translate.mjs --slug some-slug  # 只译指定 slug（忽略 limit）
//   node scripts/wechat/5-translate.mjs --all             # 不限篇数，一次译完所有缺译
//
// 依赖与 CI 复用：DEEPSEEK_API_KEY（scripts/wechat/.env 或 CI Secret）、
//   VITE_SUPABASE_URL + SUPABASE_SECRET_KEY（根 .env.local 或 CI Secret）。

import { DeepSeek } from './deepseek.mjs'
import { getSupabase, ARTICLES_TABLE } from './lib/supabase.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = arg('--dry-run', false) === true
const ALL = arg('--all', false) === true
const SLUG = typeof arg('--slug', null) === 'string' ? arg('--slug', null) : null
const rawLimit = arg('--limit', 12)
const LIMIT = ALL ? Infinity : Math.max(1, Number(rawLimit) || 12)

// 译文不动的专有名词/标记（与全量翻译工作流保持同一套规则，避免品牌名被译坏）
const KEEP = [
  'GA4', 'Google Analytics', 'Search Console', 'Ahrefs', 'Semrush', 'Moz', 'ChatGPT', 'Perplexity',
  'Claude', 'Gemini', 'Looker Studio', 'BigQuery', 'Schema', 'JSON-LD', 'llms.txt', 'robots.txt',
  'Core Web Vitals', 'E-E-A-T', 'FAQ', 'HowTo', 'DeepSeek', 'Amazon', 'TikTok', 'eMAG', 'Buy Box',
].join(', ')

const TRANSLATE_RULES = `把英文译成自然、地道的简体中文。严格遵守：
- 完整保留 Markdown 结构：标题层级、列表、表格、引用、代码块，原样不动。
- 不翻译、不改写：代码、行内代码、URL、文件路径，以及品牌/产品/标准名（${KEEP} 等）。
- 全文翻译，深度一致：不概括、不省略章节，读起来要像中文原生写作。`

/** 译标题+摘要（短，走 JSON 模式，稳定好解析） */
async function translateMeta(ds, { title, description }) {
  const obj = await ds.chatJSON([
    { role: 'system', content: `你是 SEO/营销领域的专业 EN→ZH 译者。${TRANSLATE_RULES}\n只输出 JSON 对象 {"title_zh","description_zh"}，不要任何解释或代码围栏。` },
    { role: 'user', content: `TITLE:\n${title}\n\nDESCRIPTION:\n${description || ''}` },
  ])
  return {
    title_zh: (obj.title_zh || '').trim(),
    description_zh: (obj.description_zh || '').trim(),
  }
}

/** 译正文（可能很长，走纯文本，避免巨量 Markdown 在 JSON 里转义出错） */
async function translateContent(ds, content) {
  const raw = await ds.chat(
    [
      { role: 'system', content: `你是 SEO/营销领域的专业 EN→ZH 译者。${TRANSLATE_RULES}\n直接输出译好的 Markdown 正文本身，不要加任何前后说明、不要代码围栏包裹整体。` },
      { role: 'user', content },
    ],
    { temperature: 0.3, maxTokens: 8000 },
  )
  // 去掉模型可能整体包裹的 ```markdown ... ``` 围栏
  return raw.replace(/^\s*```(?:markdown|md)?\s*\n?/i, '').replace(/\n?\s*```\s*$/i, '').trim()
}

async function main() {
  const sb = getSupabase()
  const ds = new DeepSeek()

  // 选出缺中文正文的文章（content_zh 为 null 或空串），最新优先
  let q = sb
    .from(ARTICLES_TABLE)
    .select('id,slug,title,description,content,date')
    .or('content_zh.is.null,content_zh.eq.')
    .order('date', { ascending: false })
  if (SLUG) q = sb.from(ARTICLES_TABLE).select('id,slug,title,description,content,date').eq('slug', SLUG)

  const { data: rows, error } = await q
  if (error) throw error

  const pending = SLUG ? (rows || []) : (rows || []).slice(0, LIMIT)
  const totalMissing = (rows || []).length

  if (!pending.length) {
    console.log(`✅ 没有待补译文章（缺中文正文共 ${totalMissing} 篇）。`)
    return
  }
  console.log(`待补译 ${totalMissing} 篇，本次处理 ${pending.length} 篇${ALL ? '（--all）' : `（上限 ${LIMIT}）`}${DRY ? ' — DRY RUN' : ''}：`)
  for (const a of pending) console.log(`  · ${a.slug}  (${a.date || '无日期'})`)
  if (DRY) return

  let done = 0
  const failed = []
  for (const a of pending) {
    if (!a.content || !a.content.trim()) {
      console.log(`⏭️  跳过 ${a.slug}：英文正文为空，无可译内容`)
      failed.push({ slug: a.slug, reason: 'empty content' })
      continue
    }
    try {
      const meta = await translateMeta(ds, a)
      const content_zh = await translateContent(ds, a.content)
      if (!meta.title_zh || !content_zh) throw new Error('译文为空（title_zh 或 content_zh 缺失）')

      const { error: upErr } = await sb
        .from(ARTICLES_TABLE)
        .update({
          title_zh: meta.title_zh,
          description_zh: meta.description_zh || null,
          content_zh,
          updated_at: new Date().toISOString(),
        })
        .eq('id', a.id)
      if (upErr) throw upErr

      done++
      console.log(`🟢 已译 ${a.slug}  (正文 ${content_zh.length} 字)`)
    } catch (e) {
      console.error(`🔴 失败 ${a.slug}：${e.message}`)
      failed.push({ slug: a.slug, reason: e.message })
    }
  }

  console.log(`完成：成功 ${done}，失败 ${failed.length}，剩余未译 ${totalMissing - done}`)
  console.log('DeepSeek 用量:', ds.costEstimate())
  // 有失败不阻断 CI（部分成功也算进度）；全失败才非零退出便于排查
  if (done === 0 && failed.length) process.exit(1)
}

main().catch((e) => {
  console.error('5-translate 致命错误：', e.message)
  process.exit(1)
})
