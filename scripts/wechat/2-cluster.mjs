// 2) 聚类：DeepSeek 对源文池语义聚类，产出适合写英文 SEO/数字营销常青指南的主题簇（每簇 3-6 篇）。
// 数据源：data/sources.json（读最近 N 天，无需重爬）。
// 用法：node scripts/wechat/2-cluster.mjs --days 60 --max-clusters 8

import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { DATA_DIR } from './lib/env.mjs'
import { fetchSources } from './lib/sources.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  return i === -1 ? def : process.argv[i + 1]
}
const MAX_CLUSTERS = Number(arg('--max-clusters', 8))
const DAYS = Number(arg('--days', 60))

mkdirSync(DATA_DIR, { recursive: true })
const OUT = join(DATA_DIR, 'clusters.json')

const sources = await fetchSources({ sinceDays: DAYS, minBodyLen: 300 })
console.log(`读取源文最近 ${DAYS} 天：${sources.length} 篇（本地 sources.json）`)
// 给模型的精简清单（不含全文，省 token）
const list = sources.map((s, i) => ({ id: i, account: s.account, title: s.title, digest: (s.digest || '').slice(0, 80) }))

// 站内真实标签词（向其靠拢，便于站内内链聚合 + 与现有文章一致）
const PILLAR_TAGS = [
  // 核心 SEO
  'technical SEO', 'on-page SEO', 'off-page SEO', 'link building', 'keyword research',
  'content marketing', 'local SEO', 'international SEO', 'ecommerce SEO', 'site speed',
  'core web vitals', 'crawling', 'indexing', 'structured data', 'schema',
  // 数据/工具
  'Google Analytics', 'GA4', 'Search Console', 'SEO tools', 'Semrush', 'Ahrefs', 'Python SEO',
  // 出海/独立站/营销
  'Shopify', 'independent site', 'cross-border ecommerce', 'DTC', 'Google Ads', 'Facebook Ads',
  'email marketing', 'social media', 'conversion rate', 'growth',
  // AI 搜索（geo/aeo）
  'GEO', 'AEO', 'AI search', 'ChatGPT', 'LLM optimization', 'answer engine'
]

const ds = new DeepSeek()

const sys = `You are a senior editor at sgaindex — an English-language SEO & digital-marketing site for an international (US/UK/EU) audience of marketers, founders and SEOs.
Below is a batch of articles crawled from Chinese SEO / cross-border-ecommerce / digital-marketing WeChat accounts (title + digest only, in Chinese).
Task: cluster them by topic into themes that can each be written up as an EVERGREEN English how-to / strategy guide.

Requirements:
1. Each cluster picks 3-6 semantically related source articles that complement each other (give their ids).
2. Exclude: time-sensitive news, product promotions/ads, recruitment, event recaps, anything China-only or with no lasting value to an international SEO/marketing reader (don't force weak clusters).
3. Prefer evergreen, globally-applicable angles: SEO how-tos, keyword/content strategy, technical SEO, analytics (GA4/Search Console), link building, ecommerce/independent-site growth, paid ads, conversion, and AI-search optimization (GEO/AEO). Translate China-specific tactics into platform-neutral principles (e.g. Google, not Baidu).
4. Tags should map to these on-site tags where relevant: ${PILLAR_TAGS.join(', ')}.
5. Category MUST be one of: seo | geo | aeo | tools  (geo = Generative Engine Optimization / AI-search; aeo = Answer Engine Optimization; tools = tool tutorials/reviews; everything else = seo).
6. At most ${MAX_CLUSTERS} clusters. Quality over quantity.

Return ONLY JSON:
{"clusters":[{
  "topic":"short English topic name",
  "working_title":"proposed English article title (compelling, specific, not clickbait)",
  "angle":"what makes this article distinct / what the reader gets (one sentence)",
  "source_ids":[array of ints],
  "suggested_category":"seo|geo|aeo|tools",
  "suggested_tags":["english lowercase tags, prefer the on-site tags above"],
  "suggested_level":"beginner|intermediate|advanced"
}]}`

console.log(`对 ${list.length} 篇源文聚类（最多 ${MAX_CLUSTERS} 簇）…`)
const out = await ds.chatJSON(
  [{ role: 'system', content: sys }, { role: 'user', content: JSON.stringify(list) }],
  { maxTokens: 4000 }
)

const clusters = (out.clusters || []).filter(c => Array.isArray(c.source_ids) && c.source_ids.length >= 2)
// 回填源文引用（sn / title），供下一步取全文
for (const c of clusters) {
  c.sources = c.source_ids.map(id => sources[id]).filter(Boolean).map(s => ({ sn: s.sn, account: s.account, title: s.title }))
}

writeFileSync(OUT, JSON.stringify(clusters, null, 2))
console.log(`\n产出 ${clusters.length} 个主题簇 → ${OUT}`)
for (const c of clusters) console.log(`  · [${c.suggested_category}] ${c.working_title}  (${c.source_ids.length} 源文)`)
console.log('用量:', ds.costEstimate())
console.log('⚠️  请打开 clusters.json 审一遍主题归并是否合理，再跑 3-synthesize.mjs')
