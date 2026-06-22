// 2b) 关键词聚类（确定性，不走 LLM 多样性聚类）：把每个 GSC 目标词簇的源文直接组成一簇，
//     保证产出的英文文章精准命中目标词（naver / seo dashboard …），而不是被通用聚类稀释。
//     读 keywords.json（成稿元信息）+ data/keyword-manifest.json（cluster→sn，由 1b 写）
//     + 源文库（取正文），产出 data/clusters.json，下游 3-synthesize 原样吃。
//
// 用法：
//   node scripts/wechat/2b-cluster-keywords.mjs --cluster naver --per 6
//   node scripts/wechat/2b-cluster-keywords.mjs --priority-max 2
//   node scripts/wechat/2b-cluster-keywords.mjs            # 全部有 manifest 的簇

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { DATA_DIR } from './lib/env.mjs'
import { fetchSources } from './lib/sources.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}

const ONLY_CLUSTER = arg('--cluster', null)
const PRIORITY_MAX = arg('--priority-max', null) != null ? Number(arg('--priority-max', null)) : null
const PER = Number(arg('--per', 6))          // 每簇取多少篇正文最长的源
const DAYS = Number(arg('--days', 400))       // 搜到的源可能较旧，默认放宽到 400 天
const MIN_BODY = Number(arg('--min-body', 300))

const KEYWORDS_FILE = join(__dir, 'keywords.json')
const MANIFEST_FILE = join(DATA_DIR, 'keyword-manifest.json')
if (!existsSync(KEYWORDS_FILE)) { console.error('缺少 keywords.json'); process.exit(1) }
if (!existsSync(MANIFEST_FILE)) { console.error('缺少 data/keyword-manifest.json，请先跑 1b-crawl-keywords.mjs'); process.exit(1) }

let clusterDefs = JSON.parse(readFileSync(KEYWORDS_FILE, 'utf8')).clusters || []
const manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'))
if (ONLY_CLUSTER) clusterDefs = clusterDefs.filter(c => c.cluster === ONLY_CLUSTER)
if (PRIORITY_MAX != null) clusterDefs = clusterDefs.filter(c => (c.priority ?? 99) <= PRIORITY_MAX)
clusterDefs.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))

// 取源文（含正文），按 sn 索引
const sources = await fetchSources({ sinceDays: DAYS, minBodyLen: MIN_BODY })
const bySn = new Map(sources.map(s => [s.sn, s]))
console.log(`源文库可用（近 ${DAYS} 天、正文≥${MIN_BODY}）：${sources.length} 篇\n`)

const out = []
for (const def of clusterDefs) {
  const a = def.article
  if (!a) { console.log(`✗ ${def.cluster}: keywords.json 缺 article 元信息，跳过`); continue }
  const sns = manifest[def.cluster] || []
  // manifest 命中 ∩ 有正文，按正文长度降序取前 PER 篇
  const members = sns
    .map(sn => bySn.get(sn))
    .filter(Boolean)
    .sort((x, y) => (y.body_text?.length || 0) - (x.body_text?.length || 0))
    .slice(0, PER)
  if (members.length < 2) {
    console.log(`✗ ${def.cluster}: 可用源文 ${members.length} 篇(<2)，跳过。先 1b 采集或放宽 --days/--min-body`)
    continue
  }
  out.push({
    topic: a.topic,
    working_title: a.working_title,
    angle: a.angle,
    source_ids: members.map((_, i) => i),
    suggested_category: a.category,
    suggested_tags: a.tags || [],
    suggested_level: a.level || 'intermediate',
    sources: members.map(s => ({ sn: s.sn, account: s.account, title: s.title })),
    _gsc_targets: def.english_targets // provenance：这篇要顶的 GSC 目标词
  })
  console.log(`· [${a.category}] ${a.working_title}  (${members.length} 源文)`)
}

mkdirSync(DATA_DIR, { recursive: true })
const OUT = join(DATA_DIR, 'clusters.json')
writeFileSync(OUT, JSON.stringify(out, null, 2))
console.log(`\n产出 ${out.length} 个目标词簇 → ${OUT}`)
console.log('下一步：node scripts/wechat/3-synthesize.mjs --days 400   （务必带大 --days，否则旧源被滤掉）')
