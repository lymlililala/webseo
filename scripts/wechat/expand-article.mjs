// 扩写已有文章：把"薄但主题对"的高展示页扩成有深度的常青指南，并修 meta、加主题集群内链。
// 用次幂已采的中文源做素材（多源综合，非翻译），保留原文框架/语气，输出完整英文 Markdown。
//
// 用法：
//   node scripts/wechat/expand-article.mjs --slug <slug> --cluster <cluster> --dry-run
//   node scripts/wechat/expand-article.mjs --slug <slug> --cluster <cluster> --min-words 1800
//   --links "/articles/a,/articles/b"   额外允许/建议互链的站内文章路径（主题集群）
//
// --dry-run：只写 data/expanded-<slug>.json + 打印体检，不动库。去掉才真正 update wseo_articles。

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { truncate } from './lib/clean-html.mjs'
import { getSupabase } from './lib/supabase.mjs'
import { fetchSources } from './lib/sources.mjs'
import { DATA_DIR } from './lib/env.mjs'
import { readFileSync } from 'node:fs'

const __dir = dirname(fileURLToPath(import.meta.url))
function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}

const SLUG = arg('--slug', null)
const CLUSTER = arg('--cluster', null)
const DRY = arg('--dry-run', false) === true
const MIN_WORDS = Number(arg('--min-words', 1800))
const MIN_FAQ = Number(arg('--min-faq', 4))
const EXTRA_LINKS = String(arg('--links', '') || '').split(',').map(s => s.trim()).filter(Boolean)
if (!SLUG) { console.error('必须 --slug'); process.exit(1) }

const sb = getSupabase()
const { data: art, error } = await sb.from('wseo_articles')
  .select('id,slug,title,description,content,tags,read_time,category').eq('slug', SLUG).single()
if (error || !art) { console.error('找不到文章:', SLUG, error?.message); process.exit(1) }
const origWords = (art.content || '').split(/\s+/).length
console.log(`原文：${art.title}\n  ${origWords} 词 / ${(art.content||'').length} 字符 / meta ${art.description?.length||0} 字`)

// 取该簇中文源（manifest 命中 ∩ 有正文，按正文长度取前 8）
let material = ''
if (CLUSTER) {
  const manifest = JSON.parse(readFileSync(join(DATA_DIR, 'keyword-manifest.json'), 'utf8'))
  const sns = manifest[CLUSTER] || []
  const sources = await fetchSources({ sinceDays: 400, minBodyLen: 300 })
  const bySn = new Map(sources.map(s => [s.sn, s]))
  const members = sns.map(sn => bySn.get(sn)).filter(Boolean)
    .sort((a, b) => (b.body_text?.length || 0) - (a.body_text?.length || 0)).slice(0, 8)
  material = members.map((m, i) => `### Ref ${i + 1}: ${m.title}\n${truncate(m.body_text, 3500)}`).join('\n\n---\n\n')
  console.log(`  参考中文源：${members.length} 篇`)
}

const WHITELIST = '/seo-nav, /geo-nav, /aeo-nav, /glossary, /articles, /tutorials, /ai-checker, /schema-generator, /llms-txt'
const SYS = `You are a senior SEO & digital-marketing editor for sgaindex (English-language site, international audience).
You are given an EXISTING published article (Markdown) that ranks but is too THIN to compete, plus optional Chinese reference material on the same topic.
Task: EXPAND and DEEPEN the existing article into a comprehensive, genuinely useful evergreen guide of at least ${MIN_WORDS} words — WITHOUT losing what already works.

IRON RULES:
1. PRESERVE the article's existing structure, section order, voice, title focus, any ASCII diagrams/tables and existing internal links. Do NOT rewrite from scratch or reorder. Expand IN PLACE: turn terse bullet lists into explained prose, add the "why it matters", concrete real-world examples, step-by-step detail, comparison tables, common mistakes, and a short checklist. Keep all factual claims defensible — never invent specific stats, prices, or URLs.
2. Use the Chinese reference material ONLY as source insight to add depth; synthesize and translate into native English. Absolutely no leftover Chinese, no "本文/小编/公众号".
3. Naturally cover keyword variants the page should rank for (e.g. for an SEO dashboard page: "seo dashboard", "seo monitoring dashboard", "seo analytics dashboard", "custom seo dashboard", "seo reporting dashboard") — woven into headings/prose, never stuffed.
4. Internal links: keep existing ones and ADD 3-5 contextual Markdown links. Allowed targets = these on-site paths ONLY: ${WHITELIST}${EXTRA_LINKS.length ? `, plus these related cluster articles (link to them with descriptive anchors): ${EXTRA_LINKS.join(', ')}` : ''}.
5. Keep / ensure a "## FAQ" section at the end with >=4 Q&A pairs (format: **Question?** then answer on next line). Drives FAQ rich results.
6. Keep existing inline image placeholders; you MAY add 1-2 more using EXACTLY: ![alt](IMG: short visual keywords). Do not invent image URLs.
7. Body in GitHub-flavoured Markdown. Total length >= ${MIN_WORDS} words.

Return ONLY JSON:
{
 "title": "keep or lightly improve (<=70 chars, includes core keyword)",
 "description": "fresh meta description, STRICTLY 140-155 chars, one sentence, no trailing ellipsis",
 "content": "the FULL expanded Markdown body"
}`

const userMsg = `EXISTING ARTICLE (slug: ${art.slug}, category: ${art.category}):
Title: ${art.title}
Current meta: ${art.description}

--- CURRENT BODY ---
${art.content}
--- END BODY ---
${material ? `\n\nCHINESE REFERENCE MATERIAL (for depth only):\n\n${material}` : ''}`

const ds = new DeepSeek()
console.log('\n扩写中（DeepSeek）…')
const d = await ds.chatJSON([{ role: 'system', content: SYS }, { role: 'user', content: userMsg }], { maxTokens: 14000, temperature: 0.5 })

// 取集群互链文章的真实标题做锚文本（用于内链兜底）
const NAV_ANCHORS = {
  '/seo-nav': 'SEO tools directory', '/geo-nav': 'AI-search tools directory',
  '/glossary': 'SEO glossary', '/articles': 'more SEO guides', '/schema-generator': 'schema generator'
}
async function buildLinkTargets() {
  const targets = []
  const artPaths = EXTRA_LINKS.filter(p => p.startsWith('/articles/'))
  if (artPaths.length) {
    const slugs = artPaths.map(p => p.replace('/articles/', ''))
    const { data } = await sb.from('wseo_articles').select('slug,title').in('slug', slugs)
    const t = new Map((data || []).map(r => [r.slug, r.title]))
    for (const p of artPaths) targets.push({ path: p, anchor: t.get(p.replace('/articles/', '')) || 'related guide' })
  }
  // 兜底再加两个导航链接，保证集群外也有站内链
  targets.push({ path: '/glossary', anchor: NAV_ANCHORS['/glossary'] })
  targets.push({ path: '/seo-nav', anchor: NAV_ANCHORS['/seo-nav'] })
  return targets
}

// 集群内链兜底：DeepSeek 常无视内链指令 → 缺则在 FAQ 前注入 "## Related Guides" 块。
const LINK_COUNT_RE = /\]\(\/(seo-nav|geo-nav|aeo-nav|glossary|llms-txt|ai-checker|schema-generator|articles|tutorials|news)\b[^)]*\)/gi
async function ensureClusterLinks(content) {
  if ((content.match(LINK_COUNT_RE) || []).length >= 3) return content
  const targets = await buildLinkTargets()
  const items = targets.map(t => `- [${t.anchor}](${t.path})`).join('\n')
  const block = `## Related Guides\n\nDeepen your SEO dashboard and reporting setup with these companion guides:\n\n${items}\n`
  const faqAt = content.search(/^##\s*(?:FAQ|Frequently)/im)
  return faqAt === -1 ? content + '\n\n' + block : content.slice(0, faqAt) + block + '\n' + content.slice(faqAt)
}
d.content = await ensureClusterLinks(d.content || '')

// 体检
const c = d.content || ''
const words = c.split(/\s+/).length
const cjk = (c.match(/[一-龥]/g) || []).length
const faq = (c.match(/^##\s*(?:FAQ|Frequently)/im)
  ? (c.split(/^##\s*(?:FAQ|Frequently)/im)[1].match(/^\*\*.+\?\*\*/gm) || []).length : 0)
const navLinks = (c.match(/\]\(\/(seo-nav|geo-nav|aeo-nav|glossary|llms-txt|ai-checker|schema-generator|articles|tutorials|news)\b[^)]*\)/gi) || []).length
let desc = (d.description || '').trim()
if (desc.length > 160) desc = desc.slice(0, 155).replace(/[\s,;:.\-–—]+$/, '')
console.log(`\n=== 扩写结果体检 ===`)
console.log(`  词数: ${origWords} → ${words}  (目标≥${MIN_WORDS})`)
console.log(`  中文残留: ${cjk}   FAQ对: ${faq}   站内链接: ${navLinks}   meta: ${desc.length}字`)
console.log(`  新标题: ${d.title}`)
console.log(`  新meta: ${desc}`)

const problems = []
if (words < MIN_WORDS) problems.push(`词数不足 ${words}<${MIN_WORDS}`)
if (words < origWords) problems.push('比原文还短(扩写失败)')
if (cjk > 5) problems.push(`中文残留 ${cjk}`)
if (faq < MIN_FAQ) problems.push(`FAQ ${faq}<${MIN_FAQ}`)
if (navLinks < 2) problems.push(`内链 ${navLinks}<2`)
if (desc.length < 120 || desc.length > 160) problems.push(`meta 长度 ${desc.length}`)
if (problems.length) console.log('  ⚠️ 问题:', problems.join('; '))
else console.log('  ✅ 体检通过')

const readTime = Math.max(5, Math.round(words / 220))
const payload = { id: art.id, slug: art.slug, title: d.title || art.title, description: desc, content: c, read_time: readTime }
const OUT = join(DATA_DIR, `expanded-${SLUG}.json`)
writeFileSync(OUT, JSON.stringify({ ...payload, _orig: { words: origWords, desc: art.description } }, null, 2))
console.log(`\n草稿已存 ${OUT}`)
console.log('用量:', ds.costEstimate())

if (DRY) { console.log('\n[DRY-RUN] 未写库。复核 OK 后去掉 --dry-run 即更新。'); process.exit(0) }
if (problems.length) { console.error('\n✗ 体检未过，拒绝写库。修脚本/重跑或人工放行。'); process.exit(1) }

const { error: upErr } = await sb.from('wseo_articles')
  .update({ title: payload.title, description: payload.description, content: payload.content, read_time: payload.read_time })
  .eq('id', art.id)
if (upErr) { console.error('写库失败:', upErr.message); process.exit(1) }
console.log(`\n✅ 已更新 wseo_articles：${SLUG}  (${origWords}→${words} 词)`)
console.log('记得触发 Vercel 重建以预渲染更新后的页面。')
