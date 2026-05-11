/**
 * 根据 link-check-result.json 的结果，
 * 从数据文件中删除真正无效（404/fetch failed）的工具条目
 * 
 * 注意：403/TIMEOUT 视为反爬虫机制，保留；
 * fetch failed / 404 视为无效，删除
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 读取验证结果
const resultPath = path.join(__dirname, 'link-check-result.json')
const results = JSON.parse(readFileSync(resultPath, 'utf8'))

// 过滤真正无效的 URL（404 和 fetch failed，但不包括 403/TIMEOUT）
const trulyInvalid = new Set(
  results.results
    .filter(r => !r.ok && (r.status === 404 || r.error === 'fetch failed' || r.status === 503))
    .map(r => r.url)
)

// example.com 的链接也视为无效（测试用假链接）
trulyInvalid.add('https://example.com/google-ai-overview-update')
trulyInvalid.add('https://example.com/chatgpt-search')
trulyInvalid.add('https://example.com/llms-txt-support')
trulyInvalid.add('https://example.com/perplexity-api')
trulyInvalid.add('https://example.com/google-algorithm-update')
trulyInvalid.add('https://example.com/copilot-enterprise-search')

console.log('❌ 真正无效的 URL（将被删除或修正）:')
console.log([...trulyInvalid].join('\n'))
console.log(`\n共 ${trulyInvalid.size} 个\n`)

process.exit(0)
