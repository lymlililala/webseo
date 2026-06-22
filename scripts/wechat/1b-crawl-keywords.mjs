// 1b) 关键词采集：用次幂 v3「关键词搜文章」按 GSC 目标词拉中文源 + 正文，
//     写入同一个 data/sources.json（与 1-crawl.mjs 同 schema，按 sn 去重、跨运行增量）。
//     产物可直接喂 2-cluster → 3-synthesize → 4-publish，无需改下游。
//
// 选题来自 scripts/wechat/keywords.json（按 GSC 第6-30名、有展示的词整理）。
//
// 用法：
//   node scripts/wechat/1b-crawl-keywords.mjs --cluster naver           # 只采 naver 簇（试跑）
//   node scripts/wechat/1b-crawl-keywords.mjs --priority-max 2          # 采 priority<=2 的簇
//   node scripts/wechat/1b-crawl-keywords.mjs --max-pages 3             # 每个检索词翻几页(1-5)
//   node scripts/wechat/1b-crawl-keywords.mjs --no-body                 # 只列表不拉正文
//   node scripts/wechat/1b-crawl-keywords.mjs                           # 全部簇

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CimiClient } from './cimidata/client.mjs'
import { htmlToText } from './lib/clean-html.mjs'
import { DATA_DIR } from './lib/env.mjs'
import { existingSns, upsertSources } from './lib/sources.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}

const MAX_PAGES = Math.min(Number(arg('--max-pages', 2)), 5) // v3 搜文最多 5 页
const ONLY_CLUSTER = arg('--cluster', null)
const PRIORITY_MAX = arg('--priority-max', null) != null ? Number(arg('--priority-max', null)) : null
const NO_BODY = arg('--no-body', false) === true

const KEYWORDS_FILE = join(__dir, 'keywords.json')
if (!existsSync(KEYWORDS_FILE)) {
  console.error('缺少 keywords.json（GSC 选题清单）')
  process.exit(1)
}
let clusters = JSON.parse(readFileSync(KEYWORDS_FILE, 'utf8')).clusters || []
if (ONLY_CLUSTER) clusters = clusters.filter(c => c.cluster === ONLY_CLUSTER)
if (PRIORITY_MAX != null) clusters = clusters.filter(c => (c.priority ?? 99) <= PRIORITY_MAX)
clusters.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))

if (!clusters.length) {
  console.error(`没有匹配的簇（--cluster ${ONLY_CLUSTER ?? ''} / --priority-max ${PRIORITY_MAX ?? ''}）`)
  process.exit(1)
}

function snOf(url) {
  const m = url.match(/[?&]sn=([0-9a-f]+)/i)
  return m ? m[1] : url
}
const stripTags = s => (s || '').replace(/<[^>]+>/g, '').trim() // 搜索结果 title 含 <em> 高亮

const seen = await existingSns()
const terms = clusters.flatMap(c => c.cn_terms)
console.log(
  `库中已有 ${seen.size} 篇。采集 ${clusters.length} 个簇 / ${terms.length} 个检索词，` +
  `每词最多 ${MAX_PAGES} 页${NO_BODY ? '，跳过正文' : ''}\n`
)

const cimi = new CimiClient()
const fresh = new Map() // sn -> rec（本次新发现）
// cluster -> Set(sn)：记录每簇命中的全部文章（含库中已有），供 2b 确定性聚类用。
const manifest = new Map()
const addToManifest = (cluster, sn) => {
  if (!manifest.has(cluster)) manifest.set(cluster, new Set())
  manifest.get(cluster).add(sn)
}

for (const c of clusters) {
  let clusterGot = 0
  for (const kw of c.cn_terms) {
    let got = 0
    try {
      for await (const item of cimi.iterSearchArticles(kw, { maxPages: MAX_PAGES })) {
        if (!item.content_url) continue
        const sn = snOf(item.content_url)
        addToManifest(c.cluster, sn) // 命中即记入清单（即便已在库/本次已收）
        if (seen.has(sn) || fresh.has(sn)) continue
        fresh.set(sn, {
          sn,
          account: item.nickname || null,
          wxid: item.usename || null,
          title: stripTags(item.title),
          digest: '',
          content_url: item.content_url,
          published_at: item.published_at || null,
          body_text: '',
          src_cluster: c.cluster,    // 仅本地 provenance，写库时被 upsertSources 忽略
          src_keyword: kw
        })
        got++
      }
    } catch (e) {
      console.log(`  「${kw}」搜索出错: ${e.message}`)
    }
    clusterGot += got
    console.log(`  [${c.cluster}] 「${kw}」新增 ${got} 篇  余额 ${cimi.balance}`)
  }
  console.log(`  → 簇 ${c.cluster} 小计 ${clusterGot} 篇（命中合计 ${manifest.get(c.cluster)?.size || 0}）\n`)
}

// 写 cluster→sn 清单（合并历史，便于多次增量采集后 2b 仍能取到全部成员）
mkdirSync(DATA_DIR, { recursive: true })
const MANIFEST_FILE = join(DATA_DIR, 'keyword-manifest.json')
const prevManifest = existsSync(MANIFEST_FILE) ? JSON.parse(readFileSync(MANIFEST_FILE, 'utf8')) : {}
for (const [cluster, sns] of manifest) {
  prevManifest[cluster] = [...new Set([...(prevManifest[cluster] || []), ...sns])]
}
writeFileSync(MANIFEST_FILE, JSON.stringify(prevManifest, null, 2))

const recs = [...fresh.values()]
let bodyCount = 0

if (!NO_BODY) {
  console.log(`拉取正文 ${recs.length} 篇 …`)
  for (const s of recs) {
    try {
      const html = await cimi.articleBody(s.content_url)
      s.body_text = htmlToText(html)
      bodyCount++
    } catch (e) {
      console.log(`  正文失败 [${s.account}] ${s.title?.slice(0, 20)}: ${e.message}`)
      if (e.code === 5022) s.noText = true // 纯图片/视频卡片，永久无正文，标记后仍入库以免重复拉
    }
    if (bodyCount % 20 === 0 && bodyCount) {
      await upsertSources(recs.filter(r => r.body_text || r.noText))
      console.log(`  …${bodyCount}/${recs.length}  余额 ${cimi.balance}`)
    }
  }
}

const noTextCount = recs.filter(r => r.noText).length
const toWrite = NO_BODY ? recs : recs.filter(r => r.body_text || r.noText)
const written = await upsertSources(toWrite)
console.log(
  `\n写入源文库：${written} 篇（本次新发现 ${recs.length}，拉正文 ${bodyCount}，` +
  `永久无正文 ${noTextCount}），余额 ${cimi.balance}`
)
console.log('下一步：node scripts/wechat/2b-cluster-keywords.mjs  （按目标词确定性聚类）→ 3-synthesize --days 400')
