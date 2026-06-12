/**
 * prerender-static.mjs
 * 构建后为所有路由生成独立的 HTML 文件（带有唯一的 SEO meta 和正确的 canonical）
 *
 * 包含：
 *   - 静态工具页（seo-nav, geo-nav 等）
 *   - 动态内容页（articles/:id, tutorials/:id, news/:id）
 *     → 从 Supabase 查询所有内容，逐条生成带正确 canonical 的 HTML
 *
 * 运行: node scripts/prerender-static.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const templatePath = path.join(distDir, 'index.html')

// ── 读取 .env.local ──────────────────────────────────────────────────────────
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8')
  for (const line of envContent.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
} catch (_) {
  // CI 环境通过环境变量注入，忽略缺少 .env.local 的错误
}

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found. Run vite build first.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf-8')

const SITE = 'https://sgaindex.com'
const SITE_NAME = 'SGAIndex'
const OG_IMAGE = `${SITE}/og-default.png`

// ── Supabase 客户端 ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// ── 工具函数 ────────────────────────────────────────────────────────────────
function escapeAttr(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── 内链构建 ────────────────────────────────────────────────────────────────
/**
 * 生成详情页爬虫可见的内链 HTML（面包屑 + 相关内容 + 上一篇/下一篇）
 * @param opts.base   内容类型前缀，如 '/articles'
 * @param opts.listName 列表页中文名，如 '文章'
 * @param opts.related 相关项数组 [{ slug, id, title }]
 * @param opts.prev   上一篇 { slug, id, title } | null
 * @param opts.next   下一篇 { slug, id, title } | null
 */
function buildInternalLinks({ base, listName, related, prev, next }) {
  const link = (item, label) => {
    const key = item.slug || item.id
    return `<a href="${base}/${escapeAttr(key)}">${escapeHtml(label ?? item.title)}</a>`
  }
  let html = ''
  // 面包屑
  html += `<a href="/">Home</a><a href="${base}">${escapeHtml(listName)}</a>`
  // 相关内容
  if (related && related.length) {
    html += related.map((r) => link(r)).join('')
  }
  // 上一篇 / 下一篇
  if (prev) html += link(prev, `Previous: ${prev.title}`)
  if (next) html += link(next, `Next: ${next.title}`)
  return html
}

/**
 * 生成 BreadcrumbList JSON-LD
 * @param crumbs [{ name, path? }]，path 缺省表示当前页
 */
function buildBreadcrumbJsonld(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE}${c.path}` } : {}),
    })),
  }
}

/**
 * 对全量数组按 category 分组，并为每条算出相关项与上一/下一项
 * 假设输入数组已按展示顺序（日期倒序或 id 升序）排好
 * @returns Map<index, { related, prev, next }>，按数组下标索引
 */
function computeRelations(list, limit = 6) {
  const byCat = new Map()
  list.forEach((item) => {
    const cat = item.category || '_'
    if (!byCat.has(cat)) byCat.set(cat, [])
    byCat.get(cat).push(item)
  })
  return list.map((item, i) => {
    const key = item.slug || item.id
    const cat = item.category || '_'
    const related = (byCat.get(cat) || []).filter((o) => (o.slug || o.id) !== key).slice(0, limit)
    return {
      related,
      prev: i > 0 ? list[i - 1] : null,
      next: i < list.length - 1 ? list[i + 1] : null,
    }
  })
}

/**
 * 把模板 HTML 替换为指定页面的 SEO 信息
 * @param {object} opts
 *   title        - 完整页面标题（已含品牌名）
 *   description  - 页面描述
 *   canonicalUrl - 完整 canonical URL
 *   h1           - 爬虫可见的 H1 文本
 *   jsonld       - JSON-LD 对象（可选）
 *   ogType       - OG type，默认 'website'
 *   keywords     - 关键词，可选
 */
function buildHtml({ title, description, canonicalUrl, h1, jsonld, ogType = 'website', keywords, internalLinks, breadcrumbJsonld, lang = 'en', altPath }) {
  // 1. 替换 <title> 与 <html lang>
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">`)

  // 2. 移除模板中所有旧的 SEO 标签（防止重复）
  html = html
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="keywords"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<link\s+rel="alternate"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    // 移除模板中内联的 JSON-LD（首页的 Organization + WebSite Schema）
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')

  // 3. 构建新的 SEO meta 块
  const jsonldStr = jsonld
    ? `\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonld, null, 2)}\n    </script>`
    : ''

  const breadcrumbStr = breadcrumbJsonld
    ? `\n    <script type="application/ld+json">\n    ${JSON.stringify(breadcrumbJsonld, null, 2)}\n    </script>`
    : ''

  const keywordsMeta = keywords ? `\n    <meta name="keywords" content="${escapeAttr(keywords)}" />` : ''

  // hreflang alternates(altPath 为无前缀路径，如 / 或 /seo-nav 或 /articles/<slug>）
  let hreflangStr = ''
  if (altPath) {
    const enHref = altPath === '/' ? SITE : `${SITE}${altPath}`
    const zhHref = altPath === '/' ? `${SITE}/zh` : `${SITE}/zh${altPath}`
    hreflangStr =
      `\n    <link rel="alternate" hreflang="en" href="${enHref}" />` +
      `\n    <link rel="alternate" hreflang="zh" href="${zhHref}" />` +
      `\n    <link rel="alternate" hreflang="x-default" href="${enHref}" />`
  }

  const seoBlock = `
    <!-- ═══ 预渲染 SEO（${canonicalUrl}）═══ -->
    <meta name="description" content="${escapeAttr(description)}" />${keywordsMeta}
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" id="canonical-link" />${hreflangStr}
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />${jsonldStr}${breadcrumbStr}
    <!-- ═══════════════════════════════════════════ -->`

  // 4. 注入到 </head> 前
  html = html.replace('</head>', `${seoBlock}\n  </head>`)

  // 5. 在 <div id="app"> 后注入隐藏 H1 + 内链（仅供爬虫；客户端 Vue 渲染后覆盖可见 UI）
  const hiddenStyle =
    'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;pointer-events:none'
  let crawlerBlock = ''
  if (h1) crawlerBlock += `\n    <h1 style="${hiddenStyle}">${escapeHtml(h1)}</h1>`
  if (internalLinks) crawlerBlock += `\n    <nav aria-label="Internal links" style="${hiddenStyle}">${internalLinks}</nav>`
  if (crawlerBlock) {
    html = html.replace('<div id="app"></div>', `<div id="app"></div>${crawlerBlock}`)
  }

  return html
}

/**
 * 写入 HTML 文件，自动创建目录
 */
function writeHtml(routePath, html) {
  if (routePath === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8')
    console.log('  ✅ dist/index.html  (/)')
  } else {
    const dir = path.join(distDir, routePath.slice(1))
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    console.log(`  ✅ dist${routePath}/index.html`)
  }
}

// ── 静态路由配置（英文为默认/规范版本）──────────────────────────────────────
const staticRoutes = [
  {
    path: '/',
    title: 'SGAIndex — SEO/GEO/AEO Tools Directory | AI Search Optimization',
    description:
      'A tools directory for the AI search era: 100+ curated SEO, GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) tools to improve your visibility in Google and AI engines like ChatGPT and Perplexity.',
    h1: 'SEO/GEO/AEO Tools Directory',
    keywords: 'SEO tools,GEO optimization,AEO tools,AI search optimization,Schema structured data,llms.txt',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE,
      description: 'A tools directory for the AI search era — SEO, GEO, AEO and Schema structured-data tools',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE}/seo-nav?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  {
    path: '/seo-nav',
    title: 'SEO Tools Directory — 100+ Curated SEO Tools | SGAIndex',
    description:
      'A curated directory of 100+ SEO tools across keyword research, backlink analysis, technical SEO and content optimization to help you rank higher in Google.',
    h1: 'SEO Tools Directory',
    keywords: 'SEO tools,keyword research tools,backlink analysis,technical SEO,Ahrefs,Semrush',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SEO Tools Directory',
      url: `${SITE}/seo-nav`,
    },
  },
  {
    path: '/geo-nav',
    title: 'GEO Tools Directory — Generative Engine Optimization Tools | SGAIndex',
    description:
      'A directory of 60+ GEO tools to help your content get cited by AI search engines like ChatGPT, Perplexity and Google AI Overviews.',
    h1: 'GEO Tools Directory',
    keywords: 'GEO tools,generative engine optimization,AI search tools,ChatGPT SEO',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'GEO Tools Directory',
      url: `${SITE}/geo-nav`,
    },
  },
  {
    path: '/aeo-nav',
    title: 'AEO Tools Directory — Answer Engine Optimization Tools | SGAIndex',
    description:
      'A directory of 50+ AEO tools to help your content appear in Google featured snippets, AI direct answers and voice search results.',
    h1: 'AEO Tools Directory',
    keywords: 'AEO tools,answer engine optimization,featured snippet optimization,voice search optimization',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AEO Tools Directory',
      url: `${SITE}/aeo-nav`,
    },
  },
  {
    path: '/schema-generator',
    title: 'Schema Structured Data Generator — Free JSON-LD Tool | SGAIndex',
    description:
      'A free Schema structured-data tool supporting Article, FAQ, Product, HowTo and 20+ JSON-LD types with generation and validation.',
    h1: 'Schema Structured Data Generator',
    keywords: 'Schema generator,JSON-LD tool,structured data,FAQ Schema,Article Schema',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SGAIndex Schema Generator',
      url: `${SITE}/schema-generator`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  },
  {
    path: '/ai-checker',
    title: 'AI Visibility Checker — Analyze AI Citations of Your Content | SGAIndex',
    description:
      'Check how your content is cited and how visible it is across major AI models like ChatGPT, Perplexity, Claude and Gemini.',
    h1: 'AI Visibility Checker',
    keywords: 'AI visibility checker,AI citation analysis,GEO checker,ChatGPT visibility',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AI Visibility Checker',
      url: `${SITE}/ai-checker`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    },
  },
  {
    path: '/llms-txt',
    title: 'llms.txt Tools — AI Crawler Site Index Configuration | SGAIndex',
    description:
      'llms.txt generators, validators and templates in one place — build an AI-readable semantic index file for your site to boost AI citation rates.',
    h1: 'llms.txt Tools',
    keywords: 'llms.txt generator,llms.txt tools,AI crawler configuration,AI site index',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'llms.txt Generator',
      url: `${SITE}/llms-txt`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  },
  {
    path: '/glossary',
    title: 'SEO/GEO/AEO Glossary — Search Optimization Terms Explained | SGAIndex',
    description:
      '200+ SEO, GEO and AEO terms explained, covering technical SEO, content optimization and generative engine optimization.',
    h1: 'SEO/GEO/AEO Glossary',
    keywords: 'SEO glossary,GEO terms,AEO definitions,search optimization dictionary,AI SEO glossary',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'SEO/GEO/AEO Glossary',
      url: `${SITE}/glossary`,
    },
  },
  {
    path: '/articles',
    title: 'SEO/GEO/AEO In-Depth Articles — Hands-On Guides | SGAIndex',
    description:
      '60+ in-depth SEO, GEO and AEO articles sharing real-world optimization experience and industry insight for the AI search era.',
    h1: 'SEO/GEO/AEO In-Depth Articles',
    keywords: 'SEO articles,GEO guides,AEO strategy,AI search optimization tutorials',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'SGAIndex Articles',
      url: `${SITE}/articles`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    },
  },
  {
    path: '/tutorials',
    title: 'SEO/GEO/AEO Tutorials — Hands-On Optimization Courses | SGAIndex',
    description:
      'Systematic SEO, GEO and AEO tutorials from beginner to advanced, covering technical SEO, keyword research and GA4 analytics.',
    h1: 'SEO/GEO/AEO Tutorials',
    keywords: 'SEO tutorials,GEO courses,AEO learning,search optimization basics',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'SEO/GEO/AEO Tutorials',
      url: `${SITE}/tutorials`,
    },
  },
  {
    path: '/news',
    title: 'SEO/GEO News — Latest Search Engine & AI Updates | SGAIndex',
    description:
      'Track Google algorithm updates, ChatGPT and Perplexity features, Claude search and the latest AI search industry news.',
    h1: 'Latest Search Engine & AI News',
    keywords: 'SEO news,Google algorithm updates,AI search trends,GEO news',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'SGAIndex News',
      url: `${SITE}/news`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    },
  },
  {
    path: '/faq',
    title: 'FAQ — SEO/GEO/AEO Frequently Asked Questions | SGAIndex',
    description:
      'Answers to common questions about SEO, GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) for the AI search era.',
    h1: 'FAQ — SEO/GEO/AEO',
    keywords: 'SEO FAQ,GEO questions,AEO Q&A,AI search optimization FAQ',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'SEO/GEO/AEO FAQ',
      url: `${SITE}/faq`,
    },
  },
]

// ── 中文版静态路由 meta（/zh/...，title/description/h1 用中文，canonical 自指）──
const zhMeta = {
  '/seo-nav': {
    title: 'SEO 工具导航 — 100+ 精选 SEO 工具 | SGAIndex',
    description: '精选 100+ 款 SEO 工具,涵盖关键词研究、外链分析、技术 SEO 与内容优化,助你在 Google 获得更高排名。',
    h1: 'SEO 工具导航',
  },
  '/geo-nav': {
    title: 'GEO 工具导航 — 生成式引擎优化工具 | SGAIndex',
    description: '精选 60+ 款 GEO 工具,助你的内容被 ChatGPT、Perplexity、Google AI Overviews 等 AI 搜索引擎引用。',
    h1: 'GEO 工具导航',
  },
  '/aeo-nav': {
    title: 'AEO 工具导航 — 答案引擎优化工具 | SGAIndex',
    description: '精选 50+ 款 AEO 工具,助你的内容出现在 Google 精选摘要、AI 直接回答与语音搜索结果中。',
    h1: 'AEO 工具导航',
  },
  '/schema-generator': {
    title: 'Schema 结构化数据生成器 — 免费 JSON-LD 工具 | SGAIndex',
    description: '免费的 Schema 结构化数据工具,支持 Article、FAQ、Product、HowTo 等 20+ 种 JSON-LD 类型的生成与校验。',
    h1: 'Schema 结构化数据生成器',
  },
  '/ai-checker': {
    title: 'AI 可见度检测 — 分析内容的 AI 引用情况 | SGAIndex',
    description: '检测你的内容在 ChatGPT、Perplexity、Claude、Gemini 等主流 AI 模型中的被引用情况与可见度。',
    h1: 'AI 可见度检测',
  },
  '/llms-txt': {
    title: 'llms.txt 工具 — AI 爬虫网站索引配置 | SGAIndex',
    description: 'llms.txt 生成器、校验器与模板一站集合——构建 AI 可读的语义索引文件,提升 AI 引用率。',
    h1: 'llms.txt 工具',
  },
  '/glossary': {
    title: 'SEO/GEO/AEO 术语库 — 搜索优化术语详解 | SGAIndex',
    description: '详解 200+ 条 SEO、GEO、AEO 术语,涵盖技术 SEO、内容优化与生成式引擎优化。',
    h1: 'SEO/GEO/AEO 术语库',
  },
  '/articles': {
    title: 'SEO/GEO/AEO 深度文章 — 实战指南 | SGAIndex',
    description: '60+ 篇 SEO、GEO、AEO 深度文章,分享 AI 搜索时代的实战优化经验与行业洞察。',
    h1: 'SEO/GEO/AEO 深度文章',
  },
  '/tutorials': {
    title: 'SEO/GEO/AEO 教程 — 实操优化课程 | SGAIndex',
    description: '系统的 SEO、GEO、AEO 教程,从入门到进阶,涵盖技术 SEO、关键词研究与 GA4 分析。',
    h1: 'SEO/GEO/AEO 教程',
  },
  '/news': {
    title: 'SEO/GEO 资讯 — 搜索引擎与 AI 最新动态 | SGAIndex',
    description: '追踪 Google 算法更新、ChatGPT 与 Perplexity 功能、Claude 搜索及最新 AI 搜索行业资讯。',
    h1: '搜索引擎与 AI 最新资讯',
  },
  '/faq': {
    title: '常见问题 — SEO/GEO/AEO 问答 | SGAIndex',
    description: '关于 SEO、GEO(生成式引擎优化)与 AEO(答案引擎优化)在 AI 搜索时代的常见问题解答。',
    h1: '常见问题 — SEO/GEO/AEO',
  },
}

// ── 主逻辑 ──────────────────────────────────────────────────────────────────
async function main() {
  let totalCount = 0

  // 1. 静态路由
  console.log('\n📄 生成静态路由 HTML...')
  for (const route of staticRoutes) {
    const canonicalUrl = route.path === '/' ? SITE : `${SITE}${route.path}`
    writeHtml(
      route.path,
      buildHtml({
        title: route.title,
        description: route.description,
        canonicalUrl,
        h1: route.h1,
        jsonld: route.jsonld,
        keywords: route.keywords,
        lang: 'en',
        altPath: route.path,
      })
    )
    totalCount++

    // 同时生成中文版（/zh/...）：中文 title/description/h1 + 自指 canonical + 互指 hreflang
    const zh = zhMeta[route.path]
    if (zh) {
      const zhPath = `/zh${route.path}`
      writeHtml(
        zhPath,
        buildHtml({
          title: zh.title,
          description: zh.description,
          canonicalUrl: `${SITE}${zhPath}`,
          h1: zh.h1,
          jsonld: route.jsonld,
          keywords: route.keywords,
          lang: 'zh',
          altPath: route.path,
        })
      )
      totalCount++
    }
  }

  // 2. 动态路由：文章详情
  console.log('\n📰 从数据库查询文章并预渲染...')
  const { data: articles, error: aErr } = await supabase
    .from('wseo_articles')
    .select('id, slug, title, description, date, author, tags, category, title_zh, description_zh, content_zh')
    .order('date', { ascending: false })

  if (aErr) {
    console.error('  ⚠️  文章查询失败:', aErr.message, '— 跳过文章预渲染')
  } else {
    const list = articles || []
    const relations = computeRelations(list)
    list.forEach((a, i) => {
      const routeKey = a.slug || a.id
      const routePath = `/articles/${routeKey}`
      const canonicalUrl = `${SITE}${routePath}`
      const tags = Array.isArray(a.tags) ? a.tags : []
      const rel = relations[i]
      const hasZh = !!(a.title_zh && a.title_zh.trim())
      writeHtml(
        routePath,
        buildHtml({
          title: `${a.title} | SGAIndex`,
          description: a.description || `${a.title} — SGAIndex article`,
          canonicalUrl,
          h1: a.title,
          ogType: 'article',
          keywords: tags.join(','),
          lang: 'en',
          altPath: hasZh ? routePath : undefined,
          internalLinks: buildInternalLinks({
            base: '/articles',
            listName: 'Articles',
            related: rel.related,
            prev: rel.prev,
            next: rel.next,
          }),
          breadcrumbJsonld: buildBreadcrumbJsonld([
            { name: 'Home', path: '/' },
            { name: 'Articles', path: '/articles' },
            { name: a.title },
          ]),
          jsonld: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: a.title,
            description: a.description || '',
            datePublished: a.date,
            dateModified: a.date,
            author: { '@type': 'Organization', name: a.author || 'SGAIndex', url: SITE },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
            url: canonicalUrl,
          },
        })
      )
      totalCount++
      if (hasZh) {
        const zhPath = `/zh${routePath}`
        const zhCanonical = `${SITE}${zhPath}`
        writeHtml(
          zhPath,
          buildHtml({
            title: `${a.title_zh} | SGAIndex`,
            description: a.description_zh || a.description || `${a.title_zh} — SGAIndex 文章`,
            canonicalUrl: zhCanonical,
            h1: a.title_zh,
            ogType: 'article',
            keywords: tags.join(','),
            lang: 'zh',
            altPath: routePath,
            internalLinks: buildInternalLinks({
              base: '/zh/articles',
              listName: '文章',
              related: rel.related,
              prev: rel.prev,
              next: rel.next,
            }),
            breadcrumbJsonld: buildBreadcrumbJsonld([
              { name: '首页', path: '/zh' },
              { name: '文章', path: '/zh/articles' },
              { name: a.title_zh },
            ]),
            jsonld: {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: a.title_zh,
              description: a.description_zh || '',
              datePublished: a.date,
              dateModified: a.date,
              inLanguage: 'zh-CN',
              author: { '@type': 'Organization', name: a.author || 'SGAIndex', url: SITE },
              publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
              mainEntityOfPage: { '@type': 'WebPage', '@id': zhCanonical },
              url: zhCanonical,
            },
          })
        )
        totalCount++
      }
    })
    console.log(`  → 共生成 ${list.length} 篇文章`)
  }

  // 3. 动态路由：教程详情
  console.log('\n📚 从数据库查询教程并预渲染...')
  const { data: tutorials, error: tErr } = await supabase
    .from('wseo_tutorials')
    .select('id, slug, title, description, tags, category, difficulty, title_zh, description_zh')
    .order('id', { ascending: true })

  if (tErr) {
    console.error('  ⚠️  教程查询失败:', tErr.message, '— 跳过教程预渲染')
  } else {
    const list = tutorials || []
    const relations = computeRelations(list)
    list.forEach((t, i) => {
      const routeKey = t.slug || t.id
      const routePath = `/tutorials/${routeKey}`
      const canonicalUrl = `${SITE}${routePath}`
      const tags = Array.isArray(t.tags) ? t.tags : []
      const rel = relations[i]
      const hasZh = !!(t.title_zh && t.title_zh.trim())
      writeHtml(
        routePath,
        buildHtml({
          title: `${t.title} | SGAIndex Tutorials`,
          description: t.description || `${t.title} — SGAIndex tutorial`,
          canonicalUrl,
          h1: t.title,
          keywords: tags.join(','),
          lang: 'en',
          altPath: hasZh ? routePath : undefined,
          internalLinks: buildInternalLinks({
            base: '/tutorials',
            listName: 'Tutorials',
            related: rel.related,
            prev: rel.prev,
            next: rel.next,
          }),
          breadcrumbJsonld: buildBreadcrumbJsonld([
            { name: 'Home', path: '/' },
            { name: 'Tutorials', path: '/tutorials' },
            { name: t.title },
          ]),
          jsonld: {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: t.title,
            description: t.description || '',
            url: canonicalUrl,
            provider: { '@type': 'Organization', name: SITE_NAME, url: SITE },
          },
        })
      )
      totalCount++
      if (hasZh) {
        const zhPath = `/zh${routePath}`
        const zhCanonical = `${SITE}${zhPath}`
        writeHtml(
          zhPath,
          buildHtml({
            title: `${t.title_zh} | SGAIndex Tutorials`,
            description: t.description_zh || t.description || `${t.title_zh} — SGAIndex 教程`,
            canonicalUrl: zhCanonical,
            h1: t.title_zh,
            keywords: tags.join(','),
            lang: 'zh',
            altPath: routePath,
            internalLinks: buildInternalLinks({
              base: '/zh/tutorials',
              listName: '教程',
              related: rel.related,
              prev: rel.prev,
              next: rel.next,
            }),
            breadcrumbJsonld: buildBreadcrumbJsonld([
              { name: '首页', path: '/zh' },
              { name: '教程', path: '/zh/tutorials' },
              { name: t.title_zh },
            ]),
            jsonld: {
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: t.title_zh,
              description: t.description_zh || '',
              inLanguage: 'zh-CN',
              url: zhCanonical,
              provider: { '@type': 'Organization', name: SITE_NAME, url: SITE },
            },
          })
        )
        totalCount++
      }
    })
    console.log(`  → 共生成 ${list.length} 个教程`)
  }

  // 4. 动态路由：资讯详情
  console.log('\n📡 从数据库查询资讯并预渲染...')
  const { data: news, error: nErr } = await supabase
    .from('wseo_news')
    .select('id, slug, title, description, date, tags, category, title_zh, description_zh, content_zh')
    .order('date', { ascending: false })

  if (nErr) {
    console.error('  ⚠️  资讯查询失败:', nErr.message, '— 跳过资讯预渲染')
  } else {
    const list = news || []
    const relations = computeRelations(list)
    list.forEach((n, i) => {
      const routeKey = n.slug || n.id
      const routePath = `/news/${routeKey}`
      const canonicalUrl = `${SITE}${routePath}`
      const tags = Array.isArray(n.tags) ? n.tags : []
      const rel = relations[i]
      const hasZh = !!(n.title_zh && n.title_zh.trim())
      writeHtml(
        routePath,
        buildHtml({
          title: `${n.title} | SGAIndex News`,
          description: n.description || `${n.title} — SGAIndex news`,
          canonicalUrl,
          h1: n.title,
          ogType: 'article',
          keywords: tags.join(','),
          lang: 'en',
          altPath: hasZh ? routePath : undefined,
          internalLinks: buildInternalLinks({
            base: '/news',
            listName: 'News',
            related: rel.related,
            prev: rel.prev,
            next: rel.next,
          }),
          breadcrumbJsonld: buildBreadcrumbJsonld([
            { name: 'Home', path: '/' },
            { name: 'News', path: '/news' },
            { name: n.title },
          ]),
          jsonld: {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: n.title,
            description: n.description || '',
            datePublished: n.date,
            url: canonicalUrl,
            publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
          },
        })
      )
      totalCount++
      if (hasZh) {
        const zhPath = `/zh${routePath}`
        const zhCanonical = `${SITE}${zhPath}`
        writeHtml(
          zhPath,
          buildHtml({
            title: `${n.title_zh} | SGAIndex News`,
            description: n.description_zh || n.description || `${n.title_zh} — SGAIndex 资讯`,
            canonicalUrl: zhCanonical,
            h1: n.title_zh,
            ogType: 'article',
            keywords: tags.join(','),
            lang: 'zh',
            altPath: routePath,
            internalLinks: buildInternalLinks({
              base: '/zh/news',
              listName: '资讯',
              related: rel.related,
              prev: rel.prev,
              next: rel.next,
            }),
            breadcrumbJsonld: buildBreadcrumbJsonld([
              { name: '首页', path: '/zh' },
              { name: '资讯', path: '/zh/news' },
              { name: n.title_zh },
            ]),
            jsonld: {
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: n.title_zh,
              description: n.description_zh || '',
              datePublished: n.date,
              inLanguage: 'zh-CN',
              url: zhCanonical,
              publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
              mainEntityOfPage: { '@type': 'WebPage', '@id': zhCanonical },
            },
          })
        )
        totalCount++
      }
    })
    console.log(`  → 共生成 ${list.length} 条资讯`)
  }

  // 5. 生成 404.html
  console.log('\n🚫 生成 404.html...')
  const html404 = template
    .replace(/<title>[^<]*<\/title>/, `<title>Page Not Found — ${SITE_NAME}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')
    .replace(
      '</head>',
      `
    <meta name="description" content="The page you're looking for doesn't exist. Return to the SGAIndex homepage to explore SEO, GEO and AEO tools." />
    <meta name="robots" content="noindex, follow" />
  </head>`
    )
  fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8')
  console.log('  ✅ dist/404.html')
  totalCount++

  console.log(`\n🎉 预渲染完成：共生成 ${totalCount} 个 HTML 文件\n`)
}

main().catch((err) => {
  console.error('❌ 预渲染失败:', err)
  process.exit(1)
})
