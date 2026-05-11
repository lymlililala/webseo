/**
 * 自动化清理脚本：从 TypeScript 数据文件中删除包含无效 URL 的工具条目
 * 
 * 策略：
 * - 对于 404/fetch failed 的 URL：删除整个工具条目
 * - 对于可修正的 URL（子路径失效但域名有效）：更新为主域名
 * - 对于 403/TIMEOUT：保留（反爬虫机制，工具可能仍然有效）
 * - 对于 example.com：将 news.ts 中的 link 字段设置为 null
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.join(__dirname, '..', 'src', 'data')

// 需要删除的工具（URL 完全失效）
const toolsToDelete = {
  'seo-tools.ts': ['spexia'],
  'geo-tools.ts': [
    'woi-geo', 'shujie-ai', 'laver-ai',        // cn-service (已手动删除 laver-ai)
    'fengkuang-geo', 'aigcgeo', 'geo-suoyin',   // cn-service
    'scrunch-ai',                                 // global
    'appearonai', 'appearonai-free',              // free
    'brandlight-ai',                              // global
    'geofast-ai',                                 // global
    'ai-crawlability', 'ai-content-optimizer-free', // free
  ],
  'aeo-tools.ts': [
    'zicaiai-aeo',   // 如果有
  ],
  'schema-tools.ts': ['seobility'], // 已手动删除
}

// 需要修正 URL 的工具（子路径失效，改为主域名）
const urlFixes = {
  'seo-tools.ts': {
    'https://www.seoformulas.com': null,          // 整个域名失效，删除
    'https://searchsocket.com/': null,            // 整个域名失效，删除
    'https://blogbud.ai': null,                   // 整个域名失效，删除
    'https://www.tailortask.ai/solutions/for-seo': 'https://www.tailortask.ai/', // 子路径失效，改主域
    'https://hypertxt.ai': null,                  // 整个域名失效，删除
    'https://youlinker.pro/': null,               // 整个域名失效，删除
    'https://www.similarweb.com': 'https://similarweb.com', // URL 格式问题
    'https://support.google.com/webmasters/answer/6062598': 'https://search.google.com/search-console', // 页面移动
  },
  'geo-tools.ts': {
    'https://www.semrush.com/features/ai-visibility/': 'https://www.semrush.com/',
    'https://business.adobe.com/products/experience-cloud/llm-optimizer.html': 'https://business.adobe.com/',
  },
  'aeo-tools.ts': {
    'https://semrush.com/ai-visibility': 'https://www.semrush.com/',
    'https://semai.ai': null,                     // 整个域名失效，删除
    'https://www.xinbang.com': null,              // 整个域名失效，删除
    'https://zicaiai.com': null,                  // 整个域名失效，删除
    'https://answerthepublic.com': 'https://answerthepublic.com/', // URL格式修正（有/结尾的版本有效）
  },
  'schema-tools.ts': {
    'https://www.seobility.net/en/wiki/Schema_Markup': null, // 页面404，删除工具
    'https://whitespark.ca/local-business-json-ld-schema-generator/': 'https://whitespark.ca/',
  },
  'news.ts': {
    'https://example.com/google-ai-overview-update': null,
    'https://example.com/chatgpt-search': null,
    'https://example.com/llms-txt-support': null,
    'https://example.com/perplexity-api': null,
    'https://example.com/google-algorithm-update': null,
    'https://example.com/copilot-enterprise-search': null,
  },
}

/**
 * 从文件中删除含有特定 id 的工具块
 */
function removeToolById(content, toolId) {
  // 匹配从 { id: 'xxx' 到下一个顶级 }, 的整个对象块
  // 使用贪婪匹配找到对应工具块
  const startPattern = new RegExp(
    `(\\s*\\{[^{]*?id:\\s*['"\`]${toolId}['"\`][\\s\\S]*?\\},?)`,
    'g'
  )
  
  let match
  let found = false
  while ((match = startPattern.exec(content)) !== null) {
    // 检查这个匹配是否是一个完整的对象（简单的嵌套计数）
    const text = match[1]
    let depth = 0
    for (const char of text) {
      if (char === '{') depth++
      if (char === '}') depth--
    }
    if (depth === 0) {
      content = content.replace(match[1], '')
      found = true
      console.log(`  ✓ 删除工具: ${toolId}`)
      break
    }
  }
  
  if (!found) {
    console.log(`  ⚠ 未找到工具: ${toolId}（可能已手动删除）`)
  }
  
  return content
}

/**
 * 替换文件中的 URL
 */
function fixUrl(content, oldUrl, newUrl) {
  // 转义特殊字符
  const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(['"\`])${escaped}(['"\`])`, 'g')
  
  if (newUrl === null) {
    // newUrl 为 null 表示对应工具的 URL 不可用，使用空字符串或标记
    // 对于 news.ts 的 link 字段，设为空
    content = content.replace(pattern, `$1$2`)
    console.log(`  ✓ 清空 URL: ${oldUrl}`)
  } else {
    content = content.replace(pattern, `$1${newUrl}$2`)
    console.log(`  ✓ 修正 URL: ${oldUrl} → ${newUrl}`)
  }
  return content
}

// ── 处理 seo-tools.ts ────────────────────────────────────────
console.log('\n📝 处理 seo-tools.ts...')
const seoPath = path.join(srcDir, 'seo-tools.ts')
let seoContent = readFileSync(seoPath, 'utf8')

// 删除工具
for (const id of (toolsToDelete['seo-tools.ts'] || [])) {
  seoContent = removeToolById(seoContent, id)
}

// 修正 URL（针对 tailortask）
for (const [oldUrl, newUrl] of Object.entries(urlFixes['seo-tools.ts'] || {})) {
  if (newUrl !== null) {
    seoContent = fixUrl(seoContent, oldUrl, newUrl)
  }
}

// 删除 seoformulas, searchsocket, blogbud, hypertxt, youlinker（整个工具条目）
const seoToolsToDelete = ['seoformulas', 'searchsocket', 'blogbud-ai', 'hypertxt', 'youlinker']
for (const id of seoToolsToDelete) {
  seoContent = removeToolById(seoContent, id)
}

writeFileSync(seoPath, seoContent)
console.log('  ✅ seo-tools.ts 处理完成')

// ── 处理 geo-tools.ts ────────────────────────────────────────
console.log('\n📝 处理 geo-tools.ts...')
const geoPath = path.join(srcDir, 'geo-tools.ts')
let geoContent = readFileSync(geoPath, 'utf8')

// 删除剩余无效工具（一些已手动删除）
const geoToolsToDelete = [
  'fengkuang-geo', 'aigcgeo', 'geo-suoyin',
  'scrunch-ai',
  'appearonai', 'appearonai-free',
  'brandlight-ai',
  'geofast-ai',
  'ai-crawlability', 'ai-content-optimizer-free',
]
for (const id of geoToolsToDelete) {
  geoContent = removeToolById(geoContent, id)
}

// 修正 URL
for (const [oldUrl, newUrl] of Object.entries(urlFixes['geo-tools.ts'] || {})) {
  if (newUrl !== null) {
    geoContent = fixUrl(geoContent, oldUrl, newUrl)
  }
}

writeFileSync(geoPath, geoContent)
console.log('  ✅ geo-tools.ts 处理完成')

// ── 处理 aeo-tools.ts ────────────────────────────────────────
console.log('\n📝 处理 aeo-tools.ts...')
const aeoPath = path.join(srcDir, 'aeo-tools.ts')
let aeoContent = readFileSync(aeoPath, 'utf8')

// 修正 URL
for (const [oldUrl, newUrl] of Object.entries(urlFixes['aeo-tools.ts'] || {})) {
  if (newUrl !== null) {
    aeoContent = fixUrl(aeoContent, oldUrl, newUrl)
  } else {
    // null 表示需要删除对应工具
    console.log(`  ⚠ URL ${oldUrl} 失效，将查找并删除对应工具...`)
    // 从内容中找到包含该URL的工具 id
    const urlMatch = aeoContent.match(new RegExp(`id:\\s*['"\`]([^'"\`]+)['"\`][\\s\\S]*?url:\\s*['"\`]${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`))
    if (urlMatch) {
      const toolId = urlMatch[1]
      aeoContent = removeToolById(aeoContent, toolId)
    } else {
      console.log(`  ⚠ 未找到包含 ${oldUrl} 的工具`)
    }
  }
}

writeFileSync(aeoPath, aeoContent)
console.log('  ✅ aeo-tools.ts 处理完成')

// ── 处理 news.ts（清空 example.com 链接）────────────────────
console.log('\n📝 处理 news.ts...')
const newsPath = path.join(srcDir, 'news.ts')
if (require === undefined) {
  try {
    let newsContent = readFileSync(newsPath, 'utf8')
    
    // 将所有 example.com 链接替换为空字符串
    const exampleUrls = [
      'https://example.com/google-ai-overview-update',
      'https://example.com/chatgpt-search', 
      'https://example.com/llms-txt-support',
      'https://example.com/perplexity-api',
      'https://example.com/google-algorithm-update',
      'https://example.com/copilot-enterprise-search',
    ]
    
    for (const url of exampleUrls) {
      const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      newsContent = newsContent.replace(new RegExp(`(['"\`])${escaped}(['"\`])`, 'g'), `$1$2`)
    }
    
    writeFileSync(newsPath, newsContent)
    console.log('  ✅ news.ts 处理完成')
  } catch (err) {
    console.log('  ℹ news.ts 暂不处理（需要手动检查）')
  }
}

console.log('\n🎉 所有文件处理完成！')
