// 合成前判重 —— 防止生成与站内已有文章重复的选题。
//   ① 归一化 slug/标题精确查（零成本）。
//   ② DeepSeek 近似判重：把候选选题与库内标题列表比对，问是否“实质重复”。
// 数据源 wseo_articles（slug + title）。无 Supabase 时返回 null（仅站内 slug 兜底，永不阻断）。

import { hasSupabase, getSupabase, ARTICLES_TABLE } from './supabase.mjs'
import { slugify } from './slug.mjs'

/** 取库内已有文章的 {slug,title}[]。无库返回 null。 */
export async function loadExistingPosts() {
  if (!hasSupabase()) return null
  const sb = getSupabase()
  const out = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from(ARTICLES_TABLE).select('slug,title').range(from, from + 999)
    if (error) throw new Error(`${ARTICLES_TABLE} 读取失败: ${error.message}`)
    out.push(...data)
    if (data.length < 1000) break
  }
  return out
}

function normTitle(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

/**
 * 判断候选选题是否与库内已有文章重复。
 * @param {object} cluster   { working_title, topic, suggested_category }
 * @param {Array}  existing  loadExistingPosts() 结果（{slug,title}[]）
 * @param {object} ds        DeepSeek 实例（用于近似判重；可空，则仅精确查）
 * @returns {Promise<{dup:boolean, reason?:string, match?:string}>}
 */
export async function isDuplicate(cluster, existing, ds) {
  if (!existing || !existing.length) return { dup: false }
  const candSlug = slugify(cluster.working_title || cluster.topic || '')
  const candNorm = normTitle(cluster.working_title || cluster.topic || '')

  // ① 精确/包含查
  for (const p of existing) {
    if (p.slug === candSlug) return { dup: true, reason: 'slug-exact', match: p.slug }
    const pn = normTitle(p.title)
    if (pn && candNorm && (pn === candNorm)) return { dup: true, reason: 'title-exact', match: p.title }
  }

  // ② DeepSeek 近似判重（仅与标题相近的候选比，省 token）
  if (!ds) return { dup: false }
  const candWords = new Set(candNorm.split(' ').filter(w => w.length > 3))
  const shortlist = existing
    .map(p => ({ p, overlap: normTitle(p.title).split(' ').filter(w => candWords.has(w)).length }))
    .filter(x => x.overlap >= 2)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 30)
    .map(x => x.p.title)
  if (!shortlist.length) return { dup: false }

  const sys = `You are a content de-duplication checker for an English SEO / digital-marketing site (sgaindex). ` +
    `Decide if a PROPOSED new article would substantially duplicate any EXISTING article ` +
    `(same core topic + same angle). A different angle, sub-topic, or audience is NOT a duplicate. ` +
    `Return ONLY JSON: {"duplicate":boolean,"match":"the existing title or empty","why":"short"}`
  const user = `PROPOSED title: ${cluster.working_title}\nPROPOSED topic: ${cluster.topic}\n\n` +
    `EXISTING titles:\n${shortlist.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
  try {
    const r = await ds.chatJSON([{ role: 'system', content: sys }, { role: 'user', content: user }], { maxTokens: 200 })
    if (r && r.duplicate) return { dup: true, reason: `llm:${r.why || 'similar'}`, match: r.match || '' }
  } catch {
    // 判重调用失败不阻断合成（宁可生成、由质量闸门兜底）
  }
  return { dup: false }
}
