// 0) 解析 SEO/数字营销公众号名 → wxid。一次性步骤，结果落 accounts.json，人工核对。
// 用法：node scripts/wechat/accounts.mjs
//       node scripts/wechat/accounts.mjs --only "雨果跨境,鸟哥笔记"   # 只解析部分
//
// 注意：cimidata searchAccounts 只返回 nickname/wxid/biz/description，
//       不返回粉丝数/更新频率。"粉丝多、更新勤、质量高"靠下面这份人工精选种子名单
//       保证；本脚本只负责把名字解析成 wxid（含同名号候选，供人工纠错）。
//
// 本站（sgaindex.com）是英文 SEO/数字营销工具站，文章存 Supabase wseo_articles。
// 这批中文源号用于后续「多源综合 + 翻译为原创英文」SEO 指南，覆盖站点四大主题方向：
// Google SEO/技术优化、外贸独立站/跨境、SEO 工具/AI、数字营销/增长。

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { CimiClient } from './cimidata/client.mjs'
import { DATA_DIR, ACCOUNTS_FILE } from './lib/env.mjs'

// 目标公众号 —— SEO/数字营销/出海主题，粉丝多/更新勤/质量高优先。
// 已知重广告/纯导流号不入选；同名号问题留 candidates 供人工核对后改 wxid。
const ACCOUNT_NAMES = [
  // ── Google SEO / 技术 SEO（最贴合 GA4/SEO 选题，权威中文 SEO 号）──
  'Zac的SEO博客', 'SEO每天一贴', '夫唯SEO', '搜外网', '谷歌大叔',
  // ── 外贸独立站 / 跨境电商（粉丝多、更新最勤的头部媒体）──
  '雨果跨境', '焦点商学院', '顾小北的B2C博客', '飞针走绣外贸笔记',
  '外贸G友团', '店匠SHOPLAZZA', 'SHOPLINE', '龙猫出海',
  // ── 出海媒体 / 增长（海外视角，质量高，与本站英文受众契合）──
  '白鲸出海', '志象网', '7点5度', '扬帆出海', 'Morketing',
  // ── 数字营销 / 增长 / 运营（流量/转化/增长方法论）──
  '鸟哥笔记', '运营研究社', '三节课', '梅花网', 'SocialBeta',
  'DoMarketing-营销智库', '增长黑客', '广告门',
  // ── SEO 工具 / AI 营销（工具教程/AI 写作与自动化）──
  '歪猫出海', 'Tk88出海', 'AI营销实验室',
  // ── 垂直 SEO 实战号（discover.mjs 高命中捞出，最贴合本站 SEO 核心）──
  '白杨SEO优化教程', '若凡SEO优化', '独立站与SEO艺术', '孙谦的广告观'
]

const onlyArg = process.argv.find(a => a.startsWith('--only'))
const only = onlyArg ? (onlyArg.split('=')[1] || process.argv[process.argv.indexOf(onlyArg) + 1] || '').split(',').map(s => s.trim()).filter(Boolean) : null
const names = only && only.length ? ACCOUNT_NAMES.filter(n => only.includes(n)) : ACCOUNT_NAMES

mkdirSync(DATA_DIR, { recursive: true })
const OUT = ACCOUNTS_FILE

// 已解析的保留（增量）
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const byName = new Map(existing.map(a => [a.name, a]))

const cimi = new CimiClient({ minIntervalMs: 2500 })
const sleep = ms => new Promise(r => setTimeout(r, ms))

// cimidata 搜索需预热：同名首次常报 1002「没有找到结果，请稍后再试」，重试即可。
async function searchWithRetry(name, tries = 4) {
  let lastErr
  for (let i = 0; i < tries; i++) {
    try {
      const r = await cimi.searchAccounts(name)
      if (r.length) return r
    } catch (e) {
      lastErr = e
      if (e.code !== 1002) throw e // 非「稍后再试」错误直接抛
    }
    await sleep(6000) // 等预热
  }
  if (lastErr) throw lastErr
  return []
}

console.log(`解析 ${names.length} 个 SEO/数字营销公众号 wxid（含重试，较慢）…\n`)

for (const name of names) {
  if (byName.get(name)?.wxid) {
    console.log(`✓ 已有  ${name}  ${byName.get(name).wxid}`)
    continue
  }
  try {
    const accounts = await searchWithRetry(name)
    // 取昵称精确匹配优先，否则第一个
    const exact = accounts.find(a => a.nickname === name)
    const best = exact || accounts[0]
    if (!best) {
      console.log(`✗ 未找到  ${name}`)
      byName.set(name, { name, wxid: null, candidates: [] })
      continue
    }
    byName.set(name, {
      name,
      nickname: best.nickname,
      wxid: best.wxid,
      biz: best.biz,
      description: best.description,
      // 留候选供人工纠错（同名号问题）
      candidates: accounts.slice(0, 5).map(a => ({ nickname: a.nickname, wxid: a.wxid, description: a.description }))
    })
    const flag = exact ? '✓' : '?'
    console.log(`${flag} ${name}  →  ${best.nickname}  ${best.wxid}${exact ? '' : '  (非精确匹配，请核对)'}`)
  } catch (e) {
    console.log(`✗ 出错  ${name}: ${e.message}`)
    byName.set(name, { name, wxid: null, error: e.message })
  }
}

const result = ACCOUNT_NAMES.map(n => byName.get(n)).filter(Boolean)
writeFileSync(OUT, JSON.stringify(result, null, 2))
console.log(`\n已写入 ${OUT}`)
console.log(`成功 ${result.filter(a => a.wxid).length}/${ACCOUNT_NAMES.length}，余额 ${cimi.balance}`)
console.log('⚠️  请打开 accounts.json 核对带 (非精确匹配) 的项，必要时从 candidates 手动改 wxid；')
console.log('    剔除解析错/同名号/低质号后，再跑 1-crawl.mjs。')
