/**
 * prerender-static.mjs
 * 构建后为核心静态路由生成独立的 HTML 文件（带有唯一的 SEO meta）
 * 运行: node scripts/prerender-static.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const templatePath = path.join(distDir, 'index.html')

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found. Run vite build first.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf-8')

const SITE = 'https://sgaindex.com'
const SITE_NAME = 'SGAIndex'
const OG_IMAGE = `${SITE}/og-default.png`

/** 需要预渲染的静态路由 */
const routes = [
  {
    path: '/seo-nav',
    title: 'SEO工具导航 — 100+主流SEO工具精选',
    description: '精选100+款SEO工具，涵盖关键词研究、外链分析、技术SEO、内容优化、本地SEO等分类，帮助网站提升Google搜索排名。',
    h1: 'SEO工具导航',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SEO工具导航',
      description: '精选100+款SEO工具，涵盖关键词研究、外链分析、技术SEO等分类',
      url: `${SITE}/seo-nav`,
    },
  },
  {
    path: '/geo-nav',
    title: 'GEO工具导航 — 生成式引擎优化工具精选',
    description: '收录60+款GEO工具，帮助网站内容被ChatGPT、Perplexity、Google AI Overview等AI搜索引擎引用。',
    h1: 'GEO工具导航',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'GEO工具导航',
      description: '收录60+款GEO工具，帮助网站内容被AI搜索引擎引用',
      url: `${SITE}/geo-nav`,
    },
  },
  {
    path: '/aeo-nav',
    title: 'AEO工具导航 — 答案引擎优化工具精选',
    description: '收录50+款AEO工具，帮助内容出现在Google精选摘要、AI直接答案和语音搜索结果中。',
    h1: 'AEO工具导航',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AEO工具导航',
      description: '收录50+款AEO工具，帮助内容出现在Google精选摘要和AI答案中',
      url: `${SITE}/aeo-nav`,
    },
  },
  {
    path: '/schema-generator',
    title: 'Schema结构化数据工具 — JSON-LD生成和验证',
    description: '免费Schema结构化数据工具，支持Article、FAQ、Product、HowTo等20+类Schema类型生成和验证。',
    h1: 'Schema结构化数据生成工具',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SGAIndex Schema生成器',
      url: `${SITE}/schema-generator`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    },
  },
  {
    path: '/ai-checker',
    title: 'AI可见度检测工具 — 网站内容AI引用分析',
    description: '检测网站内容在ChatGPT、Perplexity、Claude、Gemini等主流AI大模型中的引用和可见度表现。',
    h1: 'AI可见度检测',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AI可见度检测工具',
      url: `${SITE}/ai-checker`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    },
  },
  {
    path: '/llms-txt',
    title: 'llms.txt工具导航 — AI爬虫网站索引配置',
    description: 'llms.txt生成器、验证器、模板库一站汇集，帮助网站建立AI可读的语义索引文件。',
    h1: 'llms.txt工具导航',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'llms.txt生成工具',
      url: `${SITE}/llms-txt`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    },
  },
  {
    path: '/glossary',
    title: 'SEO/GEO/AEO术语词典 — 搜索优化专业术语解释',
    description: '200+条SEO、GEO、AEO专业术语中英对照解释，涵盖技术SEO、内容优化、生成式引擎优化等领域。',
    h1: 'SEO/GEO/AEO 术语词典',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'SEO/GEO/AEO术语词典',
      url: `${SITE}/glossary`,
    },
  },
  {
    path: '/articles',
    title: 'SEO/GEO/AEO深度文章 — AI搜索时代实操指南',
    description: '收录30+篇SEO、GEO、AEO深度分析文章，分享AI搜索时代的网站优化实战经验。',
    h1: 'SEO/GEO/AEO 深度文章',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'SGAIndex文章中心',
      url: `${SITE}/articles`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    },
  },
  {
    path: '/tutorials',
    title: 'SEO教程 — 从入门到进阶的搜索优化实战指南',
    description: '深入浅出SEO、GEO、AEO实操教程，适合初学者和中级从业者。包含技术SEO设置、关键词研究等实操教程。',
    h1: 'SEO实操教程',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'SEO教程列表',
      url: `${SITE}/tutorials`,
    },
  },
  {
    path: '/news',
    title: 'SEO资讯 — 搜索引擎与AI最新动态',
    description: '跟踪Google算法更新、ChatGPT新功能、Perplexity动态等AI搜索行业最新资讯。',
    h1: '搜索引擎与AI最新资讯',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'SGAIndex搜索资讯',
      url: `${SITE}/news`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    },
  },
]

function buildHtml(route) {
  const fullTitle = `${route.title} | ${SITE_NAME}`
  const canonicalUrl = `${SITE}${route.path}`

  // 替换 <title>
  let html = template.replace(
    /<title>[^<]*<\/title>/,
    `<title>${fullTitle}</title>`
  )

  // 构建 SEO meta 片段
  const seoMeta = `
    <!-- Primary SEO -->
    <meta name="description" content="${escapeAttr(route.description)}" />
    <meta name="robots" content="index, follow" />

    <!-- Canonical -->
    <link rel="canonical" href="${canonicalUrl}" id="canonical-link" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeAttr(fullTitle)}" />
    <meta property="og:description" content="${escapeAttr(route.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:locale" content="zh_CN" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(fullTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(route.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <!-- JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(route.jsonld, null, 2)}
    </script>

    <!-- SEO H1 (hidden, for crawlers) -->
    `

  // 在 </head> 前注入 meta
  html = html.replace('</head>', `${seoMeta}\n  </head>`)

  // 在 <div id="app"> 后注入隐藏的 H1（爬虫可见，用户不可见）
  html = html.replace(
    '<div id="app"></div>',
    `<div id="app"></div>\n    <h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${escapeHtml(route.h1)}</h1>`
  )

  return html
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeHtml(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

let count = 0
for (const route of routes) {
  const outDir = path.join(distDir, route.path.slice(1)) // remove leading /
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'index.html')
  fs.writeFileSync(outPath, buildHtml(route), 'utf-8')
  console.log(`✅ Generated: dist${route.path}/index.html`)
  count++
}

// 生成 404.html（Vercel 会自动用它来响应 404，并返回 404 状态码）
const html404 = template
  .replace(/<title>[^<]*<\/title>/, `<title>页面未找到 — ${SITE_NAME}</title>`)
  .replace(
    '</head>',
    `
    <meta name="description" content="您访问的页面不存在，请返回 SGAIndex 主页继续探索SEO、GEO、AEO工具导航。" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${SITE}/seo-nav" />
    </head>`
  )
const path404 = path.join(distDir, '404.html')
fs.writeFileSync(path404, html404, 'utf-8')
console.log('✅ Generated: dist/404.html')
count++

console.log(`\n🎉 预渲染完成：生成了 ${count} 个静态 HTML 文件`)
