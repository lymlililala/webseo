// 4) 发布：质量闸门 + DeepSeek 英文自评分 → 过线则配图并写入 Supabase wseo_articles。
//    不过线的不写库（表无 draft 列，写库即前端可见），仅记录到 published.json 待人工复核放行。
// 用法：
//   node scripts/wechat/4-publish.mjs --dry-run          # 只打印评分与判定，不写库
//   node scripts/wechat/4-publish.mjs                    # 实际写库
//   node scripts/wechat/4-publish.mjs --threshold 80 --max-publish 3

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { checkQuality } from './lib/quality.mjs'
import { ImageFinder } from './lib/images.mjs'
import { DATA_DIR } from './lib/env.mjs'
import { getSupabase, ARTICLES_TABLE } from './lib/supabase.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = arg('--dry-run', false) === true
const THRESHOLD = Number(arg('--threshold', 82))
// 单次发布上限：默认 0 = 不限制（过线即全部发布）；传正数则限制，防一次灌水
const rawMax = arg('--max-publish', 0)
const MAX_PUBLISH = (!rawMax || Number(rawMax) <= 0) ? Infinity : Number(rawMax)
// 强制重判：清掉 published.json 里 slug 命中该子串的旧判定，让重合成的草稿被重新评分/发布。
// 与 3-synthesize 的 --redo 配套（先重合成再重判）。
const REDO = arg('--redo', null)

const AUTHOR = 'SGA Index'

/**
 * 把正文里的 ![alt](IMG: keywords) 占位替换为真实图（Pexels/Unsplash 搜，未命中则删占位）。
 * SEO 配图为装饰性，未命中不留 broken 占位、也不塞写死图。
 */
async function resolveImages(content, finder) {
  const matches = [...(content || '').matchAll(/!\[([^\]]*)\]\(\s*IMG:\s*([^)]*)\)/gi)]
  let out = content || ''
  let count = 0
  for (const m of matches) {
    const [whole, alt, kw] = m
    let url = null
    if (finder.enabled) {
      const hit = await finder.find(kw.trim(), alt.trim())
      if (hit) url = hit.url
    }
    if (url) { out = out.replace(whole, `![${alt.trim()}](${url})`); count++ }
    else { out = out.replace(whole + '\n\n', '').replace(whole + '\n', '').replace(whole, '') }
  }
  return { content: out, imageCount: count }
}

const DRAFTS = join(DATA_DIR, 'drafts.json')
const OUT = join(DATA_DIR, 'published.json')
if (!existsSync(DRAFTS)) { console.error('缺少 drafts.json，先跑 3-synthesize.mjs'); process.exit(1) }
const drafts = JSON.parse(readFileSync(DRAFTS, 'utf8'))

const ds = new DeepSeek()
const finder = new ImageFinder()
if (!finder.enabled) console.log('⚠️  未配置 PEXELS_API_KEY / UNSPLASH_ACCESS_KEY，正文图占位将被移除（文章无图）。')

const SCORE_SYS = `You are a strict content quality reviewer for an English SEO / digital-marketing site. Score this article on 4 dimensions (each 0-100) and give an overall:
- originality (reads like original synthesis, not a rewrite/translation patchwork)
- depth (useful, specific, actionable for a marketer/SEO)
- accuracy (no obvious errors / fabricated stats)
- readability (native English, clear structure)
Return ONLY JSON: {"originality":int,"depth":int,"accuracy":int,"readability":int,"overall":int,"issues":["short issue"]}`

const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
if (REDO) {
  const sub = String(REDO).toLowerCase()
  const kept = results.filter((r) => !(r.slug && r.slug.toLowerCase().includes(sub)))
  if (kept.length < results.length) {
    console.log(`↻ --redo "${REDO}"：清掉 ${results.length - kept.length} 条旧判定，将重新评分`)
    results.length = 0
    results.push(...kept)
    writeFileSync(OUT, JSON.stringify(results, null, 2))
  }
}
const donePub = new Set(results.filter(r => r.action && r.action !== 'error').map(r => r.slug))

const sb = DRY ? null : getSupabase()
const today = new Date().toISOString().slice(0, 10)

let pub = 0, draft = 0

for (const d of drafts) {
  if (donePub.has(d.slug)) { console.log(`✓ 已处理跳过 ${d.slug}`); continue }

  // 硬性闸门（SEO 配图非必须，故 requireImages 默认 false）
  const q = checkQuality(d)
  let score = null, decision, reasonText

  if (!q.pass) {
    decision = 'draft'
    reasonText = `闸门未过: ${q.reasons.join(',')}`
  } else {
    // 软性：AI 自评分
    try {
      score = await ds.chatJSON(
        [{ role: 'system', content: SCORE_SYS }, { role: 'user', content: `Title: ${d.title}\n\n${d.content}` }],
        { maxTokens: 600 }
      )
    } catch (e) {
      score = { overall: 0, issues: ['评分失败:' + e.message] }
    }
    decision = (score.overall ?? 0) >= THRESHOLD ? 'publish' : 'draft'
    reasonText = `overall=${score.overall} (阈值${THRESHOLD}) faq=${q.faqPairs} len=${q.len} links=${q.links}`
  }

  // 单次发布上限：已达上限的，过线也转草稿
  if (decision === 'publish' && pub >= MAX_PUBLISH) {
    decision = 'draft'
    reasonText += ` | 超过单次上限 ${MAX_PUBLISH}，转草稿`
  }

  console.log(`${decision === 'publish' ? '🟢 发布' : '🟡 草稿'}  ${d.slug}`)
  console.log(`     ${reasonText}`)
  if (score?.issues?.length) console.log(`     问题: ${score.issues.join('; ')}`)

  let action = decision
  let imageCount = 0

  if (decision === 'publish') {
    // 解析正文图片占位 → 真实图（仅过线文才花配图配额）
    const r = await resolveImages(d.content, finder)
    imageCount = r.imageCount
    const row = {
      slug: d.slug,
      title: d.title,
      description: d.description || d.title,
      content: r.content.trim(),
      author: AUTHOR,
      date: today,
      category: d.category || 'seo',
      tags: Array.isArray(d.tags) ? d.tags : [],
      read_time: d.estimated_minutes || 6,
      updated_at: new Date().toISOString()
    }
    if (!DRY) {
      try {
        // slug 已存在则更新，否则插入（synthesize 已判重，这里防跨运行重复）
        const { data: ex, error: selErr } = await sb.from(ARTICLES_TABLE).select('id').eq('slug', d.slug).maybeSingle()
        if (selErr) throw selErr
        if (ex) {
          const { error } = await sb.from(ARTICLES_TABLE).update(row).eq('id', ex.id)
          if (error) throw error
          action = 'updated'
        } else {
          const { error } = await sb.from(ARTICLES_TABLE).insert(row)
          if (error) throw error
          action = 'inserted'
        }
        console.log(`     ✓ 写库 ${action}  图 ${imageCount} 张`)
      } catch (e) {
        action = 'error'
        console.log(`     ✗ 写库失败: ${e.message}`)
      }
    } else {
      console.log(`     [DRY] 将写库 ${ARTICLES_TABLE}  cat=${row.category} tags=${row.tags.length} read=${row.read_time} 图 ${imageCount}`)
    }
  }

  results.push({
    slug: d.slug,
    title: d.title,
    decision,
    action,
    category: d.category,
    score: score?.overall ?? null,
    quality: q.reasons,
    images: imageCount,
    sources: d._sources?.map(s => s.url)
  })
  if (!DRY) writeFileSync(OUT, JSON.stringify(results, null, 2))
  if (decision === 'publish') pub++; else draft++
}

console.log(`\n${DRY ? '[DRY-RUN] ' : ''}完成：发布 ${pub}，草稿 ${draft}`)
if (!DRY) console.log(`记录写入 ${OUT}（草稿未入库，人工复核后可手动放行）`)
console.log('DeepSeek 用量:', ds.costEstimate())
if (finder.enabled) console.log('配图来源:', finder.stats)
