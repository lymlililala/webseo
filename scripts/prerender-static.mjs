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
function buildHtml({ title, description, canonicalUrl, h1, jsonld, ogType = 'website', keywords }) {
  // 1. 替换 <title>
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)

  // 2. 移除模板中所有旧的 SEO 标签（防止重复）
  html = html
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="keywords"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    // 移除模板中内联的 JSON-LD（首页的 Organization + WebSite Schema）
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')

  // 3. 构建新的 SEO meta 块
  const jsonldStr = jsonld
    ? `\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonld, null, 2)}\n    </script>`
    : ''

  const keywordsMeta = keywords ? `\n    <meta name="keywords" content="${escapeAttr(keywords)}" />` : ''

  const seoBlock = `
    <!-- ═══ 预渲染 SEO（${canonicalUrl}）═══ -->
    <meta name="description" content="${escapeAttr(description)}" />${keywordsMeta}
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" id="canonical-link" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:locale" content="zh_CN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />${jsonldStr}
    <!-- ═══════════════════════════════════════════ -->`

  // 4. 注入到 </head> 前
  html = html.replace('</head>', `${seoBlock}\n  </head>`)

  // 5. 在 <div id="app"> 后注入隐藏 H1（仅供爬虫）
  if (h1) {
    html = html.replace(
      '<div id="app"></div>',
      `<div id="app"></div>\n    <h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;pointer-events:none">${escapeHtml(h1)}</h1>`
    )
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

// ── 静态路由配置 ─────────────────────────────────────────────────────────────
const staticRoutes = [
  {
    path: '/',
    title: 'SGAIndex — SEO/GEO/AEO 工具导航 | AI搜索时代优化平台',
    description: 'AI时代的SEO与GEO工具导航平台，收录100+款SEO、GEO（生成式引擎优化）、AEO（答案引擎优化）工具，帮助网站在Google和ChatGPT等AI引擎中获得更好的可见性。',
    h1: 'SEO/GEO/AEO 工具导航',
    keywords: 'SEO工具导航,GEO优化,AEO工具,AI搜索优化,Schema结构化数据,llms.txt',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE,
      description: 'AI时代的SEO与GEO工具导航平台，收录SEO、GEO、AEO、Schema结构化数据工具',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE}/seo-nav?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  {
    path: '/seo-nav',
    title: 'SEO工具导航 — 100+主流SEO工具精选 | SGAIndex',
    description: '精选100+款SEO工具，涵盖关键词研究、外链分析、技术SEO、内容优化等分类，帮助网站提升Google搜索排名。',
    h1: 'SEO工具导航',
    keywords: 'SEO工具,关键词研究工具,外链分析工具,技术SEO工具',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SEO工具导航',
      url: `${SITE}/seo-nav`,
    },
  },
  {
    path: '/geo-nav',
    title: 'GEO工具导航 — 生成式引擎优化工具精选 | SGAIndex',
    description: '收录60+款GEO工具，帮助网站内容被ChatGPT、Perplexity、Google AI Overview等AI搜索引擎引用。',
    h1: 'GEO工具导航',
    keywords: 'GEO工具,生成式引擎优化,AI搜索优化工具,ChatGPT SEO',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'GEO工具导航',
      url: `${SITE}/geo-nav`,
    },
  },
  {
    path: '/aeo-nav',
    title: 'AEO工具导航 — 答案引擎优化工具精选 | SGAIndex',
    description: '收录50+款AEO工具，帮助内容出现在Google精选摘要、AI直接答案和语音搜索结果中。',
    h1: 'AEO工具导航',
    keywords: 'AEO工具,答案引擎优化,精选摘要优化,语音搜索优化',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AEO工具导航',
      url: `${SITE}/aeo-nav`,
    },
  },
  {
    path: '/schema-generator',
    title: 'Schema结构化数据生成工具 — 免费JSON-LD生成 | SGAIndex',
    description: '免费Schema结构化数据工具，支持Article、FAQ、Product、HowTo等20+类型JSON-LD生成和验证。',
    h1: 'Schema结构化数据生成工具',
    keywords: 'Schema生成器,JSON-LD工具,结构化数据,FAQ Schema,Article Schema',
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
    title: 'AI可见度检测工具 — 网站内容AI引用分析 | SGAIndex',
    description: '检测网站内容在ChatGPT、Perplexity、Claude、Gemini等主流AI模型中的引用和可见度表现。',
    h1: 'AI可见度检测',
    keywords: 'AI可见度检测,AI引用分析,GEO检测,ChatGPT可见度',
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
    title: 'llms.txt工具导航 — AI爬虫网站索引配置 | SGAIndex',
    description: 'llms.txt生成器、验证器、模板库一站汇集，帮助网站建立AI可读的语义索引文件，提升AI引用率。',
    h1: 'llms.txt工具导航',
    keywords: 'llms.txt生成器,llms.txt工具,AI爬虫配置,AI网站索引',
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
    title: 'SEO/GEO/AEO术语词典 — 搜索优化专业术语解释 | SGAIndex',
    description: '200+条SEO、GEO、AEO专业术语中英对照解释，涵盖技术SEO、内容优化、生成式引擎优化等领域。',
    h1: 'SEO/GEO/AEO 术语词典',
    keywords: 'SEO术语,GEO词汇,AEO定义,搜索优化词典,AI SEO词汇表',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'SEO/GEO/AEO术语词典',
      url: `${SITE}/glossary`,
    },
  },
  {
    path: '/articles',
    title: 'SEO/GEO/AEO深度文章 — AI搜索时代实操指南 | SGAIndex',
    description: '收录60+篇SEO、GEO、AEO深度分析文章，分享AI搜索时代的网站优化实战经验与行业洞察。',
    h1: 'SEO/GEO/AEO 深度文章',
    keywords: 'SEO文章,GEO优化指南,AEO策略,AI搜索优化教程',
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
    title: 'SEO/GEO/AEO教程 — 搜索优化实战课程 | SGAIndex',
    description: '系统化SEO、GEO、AEO实操教程，从入门到进阶，覆盖技术SEO、关键词研究、GA4数据分析等核心技能。',
    h1: 'SEO/GEO/AEO 教程',
    keywords: 'SEO教程,GEO优化课程,AEO学习,搜索优化入门',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'SEO/GEO/AEO教程列表',
      url: `${SITE}/tutorials`,
    },
  },
  {
    path: '/news',
    title: 'SEO/GEO资讯 — 搜索引擎与AI最新动态 | SGAIndex',
    description: '跟踪Google算法更新、ChatGPT新功能、Perplexity动态、Claude搜索等AI搜索行业最新资讯。',
    h1: '搜索引擎与AI最新资讯',
    keywords: 'SEO资讯,Google算法更新,AI搜索动态,GEO新闻',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'SGAIndex搜索资讯',
      url: `${SITE}/news`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    },
  },
  {
    path: '/faq',
    title: 'FAQ — SEO/GEO/AEO 常见问题解答 | SGAIndex',
    description: '解答SEO、GEO生成式引擎优化、AEO答案引擎优化的常见问题，帮助快速了解AI搜索时代的网站优化策略。',
    h1: '常见问题 — SEO/GEO/AEO FAQ',
    keywords: 'SEO FAQ,GEO常见问题,AEO问答,AI搜索优化FAQ',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'SEO/GEO/AEO 常见问题',
      url: `${SITE}/faq`,
    },
  },
]

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
      })
    )
    totalCount++
  }

  // 2. 动态路由：文章详情
  console.log('\n📰 从数据库查询文章并预渲染...')
  const { data: articles, error: aErr } = await supabase
    .from('wseo_articles')
    .select('id, slug, title, description, date, author, tags, category')
    .order('date', { ascending: false })

  if (aErr) {
    console.error('  ⚠️  文章查询失败:', aErr.message, '— 跳过文章预渲染')
  } else {
    for (const a of articles || []) {
      const routeKey = a.slug || a.id
      const routePath = `/articles/${routeKey}`
      const canonicalUrl = `${SITE}${routePath}`
      const tags = Array.isArray(a.tags) ? a.tags : []
      writeHtml(
        routePath,
        buildHtml({
          title: `${a.title} | SGAIndex`,
          description: a.description || `${a.title} — SGAIndex深度文章`,
          canonicalUrl,
          h1: a.title,
          ogType: 'article',
          keywords: tags.join(','),
          jsonld: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: a.title,
            description: a.description || '',
            datePublished: a.date,
            dateModified: a.date,
            author: { '@type': 'Organization', name: a.author || 'SGAIndex团队', url: SITE },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
            url: canonicalUrl,
          },
        })
      )
      totalCount++
    }
    console.log(`  → 共生成 ${(articles || []).length} 篇文章`)
  }

  // 3. 动态路由：教程详情
  console.log('\n📚 从数据库查询教程并预渲染...')
  const { data: tutorials, error: tErr } = await supabase
    .from('wseo_tutorials')
    .select('id, slug, title, description, tags, category, difficulty')
    .order('id', { ascending: true })

  if (tErr) {
    console.error('  ⚠️  教程查询失败:', tErr.message, '— 跳过教程预渲染')
  } else {
    for (const t of tutorials || []) {
      const routeKey = t.slug || t.id
      const routePath = `/tutorials/${routeKey}`
      const canonicalUrl = `${SITE}${routePath}`
      const tags = Array.isArray(t.tags) ? t.tags : []
      writeHtml(
        routePath,
        buildHtml({
          title: `${t.title} | SGAIndex教程`,
          description: t.description || `${t.title} — SGAIndex实操教程`,
          canonicalUrl,
          h1: t.title,
          keywords: tags.join(','),
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
    }
    console.log(`  → 共生成 ${(tutorials || []).length} 个教程`)
  }

  // 4. 动态路由：资讯详情
  console.log('\n📡 从数据库查询资讯并预渲染...')
  const { data: news, error: nErr } = await supabase
    .from('wseo_news')
    .select('id, slug, title, description, date, tags, category')
    .order('date', { ascending: false })

  if (nErr) {
    console.error('  ⚠️  资讯查询失败:', nErr.message, '— 跳过资讯预渲染')
  } else {
    for (const n of news || []) {
      const routeKey = n.slug || n.id
      const routePath = `/news/${routeKey}`
      const canonicalUrl = `${SITE}${routePath}`
      const tags = Array.isArray(n.tags) ? n.tags : []
      writeHtml(
        routePath,
        buildHtml({
          title: `${n.title} | SGAIndex资讯`,
          description: n.description || `${n.title} — SGAIndex搜索资讯`,
          canonicalUrl,
          h1: n.title,
          ogType: 'article',
          keywords: tags.join(','),
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
    }
    console.log(`  → 共生成 ${(news || []).length} 条资讯`)
  }

  // 5. 生成 404.html
  console.log('\n🚫 生成 404.html...')
  const html404 = template
    .replace(/<title>[^<]*<\/title>/, `<title>页面未找到 — ${SITE_NAME}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')
    .replace(
      '</head>',
      `
    <meta name="description" content="您访问的页面不存在，请返回 SGAIndex 主页继续探索SEO、GEO、AEO工具导航。" />
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
