/**
 * 链接有效性验证脚本
 * 检测所有工具的 URL 是否有效，并生成报告
 *
 * 使用方式: node scripts/check-links.mjs
 *
 * 会生成两个文件:
 *   - scripts/link-check-result.json  (详细结果)
 *   - scripts/invalid-links.txt       (无效链接列表)
 */

import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'

// 从数据文件中提取所有 URL
// 由于 ts 文件不能直接 require，我们手动提取 URL
const files = [
  '../src/data/seo-tools.ts',
  '../src/data/geo-tools.ts',
  '../src/data/aeo-tools.ts',
  '../src/data/schema-tools.ts',
  '../src/data/glossary.ts',
  '../src/data/news.ts',
  '../src/data/articles.ts',
]

/**
 * 从 TypeScript 源文件提取所有 URL
 */
function extractUrls(filePath) {
  const content = readFileSync(new URL(filePath, import.meta.url), 'utf8')
  const urls = []

  // 匹配 url: 'https://...' 或 url: "https://..."
  const urlPattern = /url:\s*['"`](https?:\/\/[^'"`\s]+)['"`]/g
  let match
  while ((match = urlPattern.exec(content)) !== null) {
    urls.push(match[1])
  }

  // 匹配 link: 'https://...'
  const linkPattern = /link:\s*['"`](https?:\/\/[^'"`\s]+)['"`]/g
  while ((match = linkPattern.exec(content)) !== null) {
    urls.push(match[1])
  }

  return [...new Set(urls)] // 去重
}

/**
 * 检查单个 URL 的有效性
 * @returns {{ url, status, ok, redirectUrl }}
 */
async function checkUrl(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s 超时

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)',
      },
    })
    clearTimeout(timeout)
    return {
      url,
      status: res.status,
      ok: res.status < 400,
      redirectUrl: res.url !== url ? res.url : null,
    }
  } catch (err) {
    clearTimeout(timeout)
    // 如果 HEAD 失败，尝试 GET
    try {
      const controller2 = new AbortController()
      const timeout2 = setTimeout(() => controller2.abort(), 10000)
      const res2 = await fetch(url, {
        method: 'GET',
        signal: controller2.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)',
        },
      })
      clearTimeout(timeout2)
      return {
        url,
        status: res2.status,
        ok: res2.status < 400,
        redirectUrl: res2.url !== url ? res2.url : null,
      }
    } catch (err2) {
      return {
        url,
        status: 0,
        ok: false,
        error: err2.name === 'AbortError' ? 'TIMEOUT' : err2.message,
      }
    }
  }
}

/**
 * 批量检查 URL（并发控制）
 */
async function checkUrlsBatch(urls, concurrency = 5) {
  const results = []
  let i = 0

  async function worker() {
    while (i < urls.length) {
      const idx = i++
      const url = urls[idx]
      process.stdout.write(`\r检查 ${idx + 1}/${urls.length}: ${url.substring(0, 60)}...`)
      const result = await checkUrl(url)
      results[idx] = result
    }
  }

  const workers = Array(concurrency).fill(null).map(() => worker())
  await Promise.all(workers)
  console.log('\n')
  return results
}

// ── 主流程 ────────────────────────────────────────────────────
console.log('🔍 开始提取所有工具链接...\n')

const allUrls = new Map() // url -> [来源文件]
for (const file of files) {
  try {
    const urls = extractUrls(file)
    for (const url of urls) {
      if (!allUrls.has(url)) {
        allUrls.set(url, [])
      }
      allUrls.get(url).push(file.replace('../src/data/', ''))
    }
    console.log(`  ✓ ${file.replace('../src/data/', '')}: ${urls.length} 个链接`)
  } catch (err) {
    console.warn(`  ⚠ 读取 ${file} 失败: ${err.message}`)
  }
}

const uniqueUrls = [...allUrls.keys()]
console.log(`\n📊 共发现 ${uniqueUrls.length} 个唯一链接\n`)
console.log('🌐 开始验证链接有效性（每个链接最多等待 10 秒）...\n')

const results = await checkUrlsBatch(uniqueUrls, 5)

// ── 统计结果 ────────────────────────────────────────────────────
const valid = results.filter((r) => r.ok)
const invalid = results.filter((r) => !r.ok)
const redirected = results.filter((r) => r.ok && r.redirectUrl)

console.log('═══════════════════════════════════')
console.log(`✅ 有效链接: ${valid.length}`)
console.log(`❌ 无效链接: ${invalid.length}`)
console.log(`🔀 重定向链接: ${redirected.length}`)
console.log('═══════════════════════════════════\n')

// 无效链接详情
if (invalid.length > 0) {
  console.log('❌ 无效链接列表:\n')
  for (const r of invalid) {
    const sources = allUrls.get(r.url) || []
    console.log(`  URL: ${r.url}`)
    console.log(`  状态: ${r.status || r.error || 'UNKNOWN'}`)
    console.log(`  来源: ${sources.join(', ')}`)
    console.log()
  }
}

// ── 保存结果 ────────────────────────────────────────────────────
const fullResults = results.map((r) => ({
  ...r,
  sources: allUrls.get(r.url) || [],
}))

const outputPath = new URL('./link-check-result.json', import.meta.url)
writeFileSync(outputPath, JSON.stringify({ 
  checkedAt: new Date().toISOString(),
  total: uniqueUrls.length,
  valid: valid.length,
  invalid: invalid.length,
  redirected: redirected.length,
  results: fullResults,
}, null, 2))
console.log(`📄 详细结果已保存到: scripts/link-check-result.json`)

const invalidPath = new URL('./invalid-links.txt', import.meta.url)
const invalidContent = invalid.map((r) => {
  const sources = allUrls.get(r.url) || []
  return `${r.url}\t状态:${r.status || r.error}\t来源:${sources.join(',')}`
}).join('\n')
writeFileSync(invalidPath, `# 无效链接列表 - 生成时间: ${new Date().toISOString()}\n# 格式: URL\t状态\t来源文件\n\n${invalidContent}`)
console.log(`📄 无效链接列表已保存到: scripts/invalid-links.txt\n`)

// 退出码：有无效链接返回 1，全部有效返回 0
process.exit(invalid.length > 0 ? 1 : 0)
