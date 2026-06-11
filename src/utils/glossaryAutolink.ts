/**
 * glossaryAutolink — 正文术语自动内链
 *
 * 对已渲染的正文 HTML 做后处理：把英文术语的**首次出现**链接到术语词典对应锚点
 * （/glossary#term-<id>）。用于增强文章/资讯/教程正文内的站内链接密度。
 *
 * 安全规则（避免误链）：
 *   - 仅匹配英文术语（中文术语易过度匹配，不参与）
 *   - 词边界精确匹配，忽略大小写；每个术语每篇最多链一次
 *   - 跳过 <a>/<code>/<pre>/<h1-h6>/<script>/<style>/<button> 内的文本
 *   - 每篇上限 maxLinks（默认 8），避免过度内链
 */
import { glossaryTerms } from '../data/glossary'

interface Entry {
  term: string
  href: string
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 仅英文术语，按长度降序（保证多词/长术语优先匹配，如 "AI Overview" 先于 "AI ..."）
const ENTRIES: Entry[] = glossaryTerms
  .filter((t) => /[A-Za-z]/.test(t.term) && t.term.trim().length >= 2)
  .map((t) => ({ term: t.term.trim(), href: `/glossary#term-${t.id}` }))
  .sort((a, b) => b.term.length - a.term.length)

const HREF_BY_LOWER = new Map<string, string>(ENTRIES.map((e) => [e.term.toLowerCase(), e.href]))

// 组合正则：\b(term1|term2|...)\b，忽略大小写
const COMBINED =
  ENTRIES.length > 0 ? new RegExp('\\b(' + ENTRIES.map((e) => escapeRe(e.term)).join('|') + ')\\b', 'gi') : null

// 跳过这些标签内部的文本
const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'button'])

function linkifyText(text: string, used: Set<string>, counter: { n: number }, maxLinks: number): string {
  if (!COMBINED || counter.n >= maxLinks) return text
  return text.replace(COMBINED, (match) => {
    if (counter.n >= maxLinks) return match
    const key = match.toLowerCase()
    if (used.has(key)) return match
    const href = HREF_BY_LOWER.get(key)
    if (!href) return match
    used.add(key)
    counter.n++
    return `<a href="${href}" class="glossary-autolink" title="View term definition">${match}</a>`
  })
}

/**
 * @param html     已由 marked 渲染好的正文 HTML
 * @param maxLinks 每篇最多自动内链数量（默认 8）
 */
export function autolinkGlossary(html: string, maxLinks = 8): string {
  if (!html || !COMBINED) return html

  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g
  const used = new Set<string>()
  const counter = { n: 0 }
  let skipDepth = 0
  let result = ''
  let lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = tagRe.exec(html)) !== null) {
    const text = html.slice(lastIndex, m.index)
    result += skipDepth > 0 ? text : linkifyText(text, used, counter, maxLinks)

    const closing = m[1] === '/'
    const tag = m[2].toLowerCase()
    const selfClose = m[3] === '/'
    if (SKIP_TAGS.has(tag) && !selfClose) {
      if (closing) {
        if (skipDepth > 0) skipDepth--
      } else {
        skipDepth++
      }
    }
    result += m[0]
    lastIndex = tagRe.lastIndex
  }

  const tail = html.slice(lastIndex)
  result += skipDepth > 0 ? tail : linkifyText(tail, used, counter, maxLinks)
  return result
}
