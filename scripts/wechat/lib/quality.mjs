// 发布前质量闸门 —— 面向**英文** SEO/数字营销合成文章。命中任一硬性问题 → 不过线。
// 借鉴旅游流水线的指纹 + 薄内容 + FAQ 校验，针对英文 SEO 内容改造。

// 已知劣质模板指纹（批量套话/AI 味重的开场白），新内容绝不能命中
const KNOWN_FINGERPRINTS = [
  [/covers everything you need to know/i, 'FP-everything-you-need'],
  [/in (this|the following) (comprehensive )?guide,? (we'?ll|you'?ll|i'?ll)/i, 'FP-in-this-guide'],
  [/whether you'?re a (seasoned|first-time|beginner|small business)/i, 'FP-whether-youre'],
  [/look no further/i, 'FP-look-no-further'],
  [/in conclusion,? (seo|this strategy|digital marketing) (offers|has|is)/i, 'FP-in-conclusion'],
  [/(unlock|unleash|elevate|supercharge|skyrocket) your (seo|traffic|rankings|business|marketing)/i, 'FP-unlock-your'],
  [/as an ai language model/i, 'FP-ai-disclaimer'],
  [/中文|公众号|本文|小编|原文链接/, 'FP-leftover-chinese'] // 残留中文/洗稿痕迹
]

/** FAQ 对计数（正文 ## FAQ 段：≥2 对，问 ≥4 字，答 ≥10 字） */
export function countFaqPairs(markdown) {
  if (!markdown) return 0
  const m = markdown.match(/^##\s*(?:FAQ|Frequently Asked Questions)[^\n]*\n([\s\S]*?)(?=^##\s|^---\s*$|(?![\s\S]))/m)
  if (!m) return 0
  const blocks = m[1].split(/\n{2,}/)
  const pairs = []
  let cur = null
  for (const block of blocks) {
    const b = block.trim()
    if (!b) continue
    const qm = b.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/)
    if (qm) {
      if (cur && cur.a) pairs.push(cur)
      cur = { q: qm[1].replace(/^Q\s*[:：]\s*/i, '').trim(), a: qm[2].trim() }
    } else if (cur) {
      cur.a = (cur.a ? cur.a + ' ' : '') + b
    }
  }
  if (cur && cur.a) pairs.push(cur)
  return pairs.filter(p => p.q.length >= 4 && p.a.length >= 10).length
}

/**
 * 检查一篇合成英文文是否达标。
 * @param {object} draft  { title, content, description, faq }
 * @param {object} [opts] { minChars, requireFaq, requireImages, requireLinks }
 * @returns {{ pass:boolean, reasons:string[], faqPairs:number, len:number }}
 */
export function checkQuality(draft, opts = {}) {
  const minChars = opts.minChars ?? 7000 // 英文 ~1400 词
  const requireFaq = opts.requireFaq ?? true
  const content = draft.content || ''
  const reasons = []

  if (content.length < minChars) reasons.push(`THIN:${content.length}<${minChars}`)
  for (const [re, name] of KNOWN_FINGERPRINTS) if (re.test(content)) reasons.push(`FINGERPRINT:${name}`)

  // FAQ 既可在 frontmatter faq[]，也可在正文 ## FAQ —— 任一达标即可
  const frontmatterFaq = Array.isArray(draft.faq)
    ? draft.faq.filter(f => f && (f.question || '').length >= 4 && (f.answer || '').length >= 10).length
    : 0
  const bodyFaq = countFaqPairs(content)
  const faqPairs = Math.max(frontmatterFaq, bodyFaq)
  if (requireFaq && faqPairs < 2) reasons.push(`FAQ:${faqPairs}<2`)

  if (!draft.title || draft.title.length < 10) reasons.push('TITLE:too-short')
  const desc = draft.description || draft.summary || ''
  if (desc.length < 50) reasons.push('DESC:too-short')
  if (desc.length > 165) reasons.push(`DESC:too-long:${desc.length}`)

  // 英文正文应以拉丁字母为主；残留大量中文 → 疑似翻译不彻底/洗稿
  const cjk = (content.match(/[一-龥]/g) || []).length
  if (cjk > content.length * 0.03) reasons.push(`HIGH-CJK:${cjk}疑似未译彻底`)

  // 配图：SEO 文章配图非必须（默认不强制）；如开启则要求 ≥2 张占位
  const imgPlaceholders = (content.match(/!\[[^\]]*\]\(\s*(?:IMG:|https?:)[^)]*\)/gi) || []).length
  if (opts.requireImages && imgPlaceholders < 2) reasons.push(`IMG:${imgPlaceholders}<2`)

  // 站内链接：须含 ≥1 条站内内链（内链建设 + 降跳出）。匹配本站真实路由前缀。
  const internalLinks = (content.match(/\]\(\/(seo-nav|geo-nav|aeo-nav|glossary|llms-txt|ai-checker|schema-generator|articles|tutorials|news)\b[^)]*\)/gi) || []).length
  const minLinks = opts.minLinks ?? 1
  if (opts.requireLinks !== false && internalLinks < minLinks) reasons.push(`LINKS:${internalLinks}<${minLinks}`)

  return { pass: reasons.length === 0, reasons, faqPairs, len: content.length, images: imgPlaceholders, links: internalLinks }
}
