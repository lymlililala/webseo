// 3) 合成：逐簇取成员源文全文（中文），DeepSeek 综合提炼 + 翻译，产出一篇全新原创**英文**
//    SEO/数字营销常青指南（Markdown，写入 wseo_articles.content）。
// 用法：node scripts/wechat/3-synthesize.mjs
//       node scripts/wechat/3-synthesize.mjs --limit 2   # 只合成前 2 簇试跑

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { truncate } from './lib/clean-html.mjs'
import { uniqueSlug } from './lib/slug.mjs'
import { loadExistingPosts, isDuplicate } from './lib/dedup.mjs'
import { fetchSources } from './lib/sources.mjs'
import { DATA_DIR } from './lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  return i === -1 ? def : process.argv[i + 1]
}

// meta description 兜底裁剪到 ≤160：按词边界截断，不留半词/省略号。
function clampDesc(s, max = 160) {
  const desc = (s || '').trim()
  if (desc.length <= max) return desc
  const cut = desc.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, '')
}
const LIMIT = arg('--limit', null) ? Number(arg('--limit', null)) : null
const DAYS = Number(arg('--days', 60))

const CLU = join(DATA_DIR, 'clusters.json')
const OUT = join(DATA_DIR, 'drafts.json')
if (!existsSync(CLU)) { console.error('缺少 clusters.json，先跑 2-cluster.mjs'); process.exit(1) }

const sources = await fetchSources({ sinceDays: DAYS })
const bySn = new Map(sources.map(s => [s.sn, s]))
let clusters = JSON.parse(readFileSync(CLU, 'utf8'))
if (LIMIT) clusters = clusters.slice(0, LIMIT)

const ds = new DeepSeek()

const VALID_CATS = new Set(['seo', 'geo', 'aeo', 'tools'])

const SYS = `You are a senior SEO & digital-marketing writer for sgaindex — an English-language site for an international audience of marketers, founders and SEOs (US/UK/EU).
You will be given several Chinese WeChat articles on one topic as REFERENCE MATERIAL. Synthesize them into a brand-new, well-structured, ORIGINAL ENGLISH article.

IRON RULES:
1. This is original synthesis + translation, NOT a literal translation or rewrite of any single source. Never copy/paraphrase any one source paragraph-by-paragraph. Re-organise, distil the consensus, add your own logical framework. The output must read as native English written for an international audience — absolutely no leftover Chinese, no "本文/小编/公众号/原文链接".
2. Make it globally applicable. Translate any China-specific tactics into platform-neutral, Google-first principles (Google/Search Console/GA4, not Baidu/WeChat). Keep concrete, actionable advice; drop China-only platform mechanics unless broadly relevant. Define jargon on first use.
3. Body in GitHub-flavoured Markdown:
   - Sections use ## and ###; bullet points use - ; steps use ordered lists.
   - Start with a 2-3 sentence intro paragraph (no heading), then dive into ## sections. Do NOT add a "Table of contents".
   - Tables use | pipes |. Bold key terms with **...**. Use real, well-known examples where helpful.
   - No fabricated facts: do not invent specific statistics, tool prices, or URLs you are unsure of — describe them qualitatively instead.
   - Be thorough and specific: include concrete sections such as why it matters, step-by-step how-to, tools, common mistakes, and a short checklist or summary. Aim for genuine depth, not padding.
4. Naturally weave in 2-3 internal links as Markdown links to relevant on-site pages, choosing paths ONLY from this whitelist (do NOT invent other paths):
   /seo-nav (SEO tools directory), /geo-nav (AI-search tools), /aeo-nav, /glossary (SEO glossary), /articles (more guides), /tutorials, /ai-checker (AI content detector), /schema-generator, /llms-txt
   e.g. Browse our [SEO tools directory](/seo-nav) or the [SEO glossary](/glossary).
5. Insert 2-3 inline images at natural points in the body (after the intro, then spread through). Use EXACTLY this placeholder syntax — do NOT invent image URLs (real URLs are filled in later):
   ![descriptive alt text](IMG: short comma-separated visual keywords)
   - The IMG keywords name a concrete, photographable business/tech subject for stock-photo search, e.g. (IMG: analytics dashboard charts) or (IMG: team content strategy whiteboard) or (IMG: laptop data graphs). Avoid abstract words.
   - Do not put images inside tables or the FAQ.
6. End the body with a "## FAQ" section containing AT LEAST 3 Q&A pairs relevant to an international reader. Format each pair as: a line **The question?** then the answer on the next line(s). (This drives FAQ rich results.)
7. Body length: 1400-2200 English words. Write a rich, genuinely useful guide.

Return ONLY JSON:
{
 "slug":"clean-lowercase-hyphenated-slug, max 6 words, start with the core topic, NO date, NO random suffix (e.g. technical-seo-audit-checklist)",
 "title":"English title (50-70 chars, compelling, includes the core keyword)",
 "description":"English meta description, STRICTLY 140-158 characters (never exceed 160), one sentence, no trailing ellipsis",
 "content":"full Markdown body (intro paragraph, ## sections, 2-3 ![alt](IMG: ...) placeholders, ends with ## FAQ having >=3 pairs)",
 "tags":["english lowercase tags, prefer on-site tags"],
 "level":"beginner|intermediate|advanced",
 "estimated_minutes":int,
 "category":"seo|geo|aeo|tools"
}`

const drafts = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const doneTopics = new Set(drafts.map(d => d._topic))

// 库内已有文章（wseo_articles）——判重 + slug 唯一性的依据。无库则 null。
const existingPosts = await loadExistingPosts()
if (existingPosts) console.log(`判重库：wseo_articles 已有 ${existingPosts.length} 篇`)
const existingSlugs = new Set([...(existingPosts || []).map(p => p.slug), ...drafts.map(d => d.slug)])
console.log(`开始合成 ${clusters.length} 篇 …\n`)
let skippedDup = 0

for (const c of clusters) {
  if (doneTopics.has(c.topic)) { console.log(`✓ 已合成跳过: ${c.topic}`); continue }
  const members = (c.sources || []).map(s => bySn.get(s.sn)).filter(Boolean)
  if (members.length < 2) { console.log(`✗ 源文不足跳过: ${c.topic}`); continue }

  // 判重：与库内已有文章实质重复则跳过（省合成费 + 防伤 SEO）
  const dup = await isDuplicate(c, existingPosts, ds)
  if (dup.dup) { console.log(`⊘ 判重跳过: ${c.working_title}  [${dup.reason}] ↔ ${dup.match || ''}`); skippedDup++; continue }

  const material = members
    .map((m, i) => `### Source ${i + 1}: ${m.title}（WeChat account: ${m.account}）\n${truncate(m.body_text, 5000)}`)
    .join('\n\n---\n\n')

  const userMsg = `Topic: ${c.topic}\nWorking title: ${c.working_title}\nAngle: ${c.angle}\nSuggested category: ${c.suggested_category}\nSuggested tags: ${(c.suggested_tags || []).join(', ')}\nSuggested level: ${c.suggested_level || 'intermediate'}\n\nReference material (Chinese):\n\n${material}`

  console.log(`合成中: ${c.working_title}  (${members.length} 源文)`)
  try {
    const d = await ds.chatJSON([{ role: 'system', content: SYS }, { role: 'user', content: userMsg }], { maxTokens: 12000, temperature: 0.6 })
    d.slug = uniqueSlug(d.slug || c.working_title, existingSlugs)
    d.description = clampDesc(d.description)
    // 用建议值兜底；category 收敛到合法枚举
    d.category = VALID_CATS.has(d.category) ? d.category : (VALID_CATS.has(c.suggested_category) ? c.suggested_category : 'seo')
    d.level = d.level || c.suggested_level || 'intermediate'
    d.tags = Array.isArray(d.tags) && d.tags.length ? d.tags : (c.suggested_tags || [])
    d.estimated_minutes = d.estimated_minutes || Math.max(5, Math.round((d.content || '').split(/\s+/).length / 200))
    // provenance：记录来源，备查与合规追溯（不入文章，仅留 data/）
    d._topic = c.topic
    d._sources = members.map(m => ({ sn: m.sn, account: m.account, title: m.title, url: m.content_url }))
    drafts.push(d)
    writeFileSync(OUT, JSON.stringify(drafts, null, 2))
    console.log(`  ✓ ${d.slug}  [${d.category}]  ${(d.content || '').length} 字符`)
  } catch (e) {
    console.log(`  ✗ 合成失败: ${e.message}`)
  }
}

console.log(`\n已写入 ${OUT}（共 ${drafts.length} 篇草稿，本次判重跳过 ${skippedDup}）`)
console.log('用量:', ds.costEstimate())
console.log('⚠️  抽查 drafts.json 1-2 篇（原创度/英文质量/字数/FAQ），再跑 4-publish.mjs')
