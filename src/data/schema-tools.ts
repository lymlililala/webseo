export interface SchemaTool {
  id: string
  name: string
  url: string
  description: string
  highlights: string[]
  tags: string[]
  isFree?: boolean
  hasFreeplan?: boolean
  pricing?: string
  level: 'beginner' | 'advanced' | 'auto' // 新手 / 进阶 / 全自动
  isOfficial?: boolean
  badge?: string
  supportedTypes?: string[] // 支持的 Schema 类型 ID
}

export interface SchemaType {
  id: string
  name: string // 类型名 Article / FAQ ...
  icon: string
  color: string
  stars: number // 站长需求频率 1-5
  description: string
  aeoTip?: string // AEO/GEO 相关提示
  internalLink?: string // 站内内链
  internalLinkLabel?: string
  jsonTemplate: string // JSON-LD 模板代码
  requiredFields: { name: string; desc: string }[]
  tools: string[] // 推荐工具 id 列表
}

// ── 工具数据 ──────────────────────────────────────────────────
export const schemaTools: SchemaTool[] = [
  // 全能型
  {
    id: 'merkle',
    name: 'Merkle Schema Generator',
    url: 'https://technicalseo.com/tools/schema-markup-generator/',
    description: '最受站长欢迎的免费 Schema 生成器，支持 20+ 类型，界面清晰，无需注册即可生成标准 JSON-LD 代码。',
    highlights: ['免费无需注册', '20+ Schema类型', '即时生成JSON-LD'],
    tags: ['全能', '免费', 'JSON-LD'],
    isFree: true,
    level: 'beginner',
    badge: '站长首选',
    supportedTypes: [
      'article',
      'faq',
      'product',
      'breadcrumb',
      'howto',
      'video',
      'localbusiness',
      'event',
      'review',
      'person',
      'organization',
    ],
  },
  {
    id: 'google-rich-results',
    name: 'Google Rich Results Test',
    url: 'https://search.google.com/test/rich-results',
    description:
      'Google 官方出品的富结果验证工具，生成 Schema 代码后必须在此验证，确保符合 Google 索引标准并能获得富结果展示。',
    highlights: ['Google官方', '验证富结果资格', '实时预览效果'],
    tags: ['官方验证', 'Google', '免费'],
    isFree: true,
    isOfficial: true,
    level: 'beginner',
    badge: '官方必备',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'video', 'recipe', 'review', 'event'],
  },
  {
    id: 'schema-org-validator',
    name: 'Schema.org Validator',
    url: 'https://validator.schema.org/',
    description: 'Schema.org 官方权威验证器，检查结构化数据是否完全符合 Schema.org 规范，是合规性验证的最终标准。',
    highlights: ['Schema.org官方', '合规性权威验证', '支持所有类型'],
    tags: ['官方验证', 'Schema.org', '免费'],
    isFree: true,
    isOfficial: true,
    level: 'advanced',
    badge: '权威验证',
    supportedTypes: [
      'article',
      'faq',
      'product',
      'breadcrumb',
      'howto',
      'video',
      'recipe',
      'localbusiness',
      'event',
      'review',
      'person',
      'organization',
    ],
  },
  {
    id: 'saijo-george',
    name: 'Saijo George JSON-LD',
    url: 'https://saijogeorge.com/json-ld-schema-generator/',
    description:
      '极简快速的 JSON-LD 生成器，界面简洁直观，无需注册，覆盖常用 Schema 类型，适合需要快速生成代码的场景。',
    highlights: ['极简快速', '无需注册', '界面直观'],
    tags: ['快速', '免费', '简洁'],
    isFree: true,
    level: 'beginner',
    supportedTypes: ['article', 'faq', 'howto', 'product', 'localbusiness', 'review', 'event', 'person'],
  },
  {
    id: 'hall-analysis',
    name: 'Hall Analysis Article Schema',
    url: 'https://hallanalysis.com/json-ld-generator/',
    description: '专注文章类 Schema 的精准生成器，字段覆盖完整，支持 Article、BlogPosting、NewsArticle 等文章子类型。',
    highlights: ['文章类型专精', '子类型支持', '字段完整'],
    tags: ['Article专项', '免费', '文章'],
    isFree: true,
    level: 'beginner',
    supportedTypes: ['article'],
  },
  {
    id: 'whitespark',
    name: 'Whitespark Local Schema',
    url: 'https://whitespark.ca/',
    description:
      'Whitespark 专为本地商家打造的 LocalBusiness Schema 生成器，字段覆盖全面，支持营业时间、服务区域、联系方式等本地 SEO 关键字段。',
    highlights: ['本地商家专精', '营业时间支持', '本地SEO必备'],
    tags: ['LocalBusiness', '本地SEO', '免费'],
    isFree: true,
    level: 'beginner',
    badge: '本地SEO推荐',
    supportedTypes: ['localbusiness'],
  },
  {
    id: 'recipeschema',
    name: 'RecipeSchema.org',
    url: 'https://recipeschema.com/',
    description: '专为食谱网站设计的 Recipe Schema 生成器，支持食材、步骤、烹饪时间、营养信息等所有食谱相关字段。',
    highlights: ['食谱专属', '营养信息支持', '步骤结构化'],
    tags: ['Recipe专项', '食谱', '免费'],
    isFree: true,
    level: 'beginner',
    supportedTypes: ['recipe'],
  },
  // AI 自动化（付费进阶）
  {
    id: 'schema-app',
    name: 'Schema App',
    url: 'https://schemaapp.com/',
    description:
      '全自动企业级 Schema 管理平台，AI 自动识别页面类型并生成结构化数据，支持大规模网站批量部署，提供持续监测。',
    highlights: ['AI自动识别', '企业级管理', '批量部署监测'],
    tags: ['AI自动化', '企业级', '全自动'],
    hasFreeplan: false,
    pricing: '$99/月起',
    level: 'auto',
    badge: '全自动',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'video', 'localbusiness'],
  },
  {
    id: 'wordlift',
    name: 'WordLift',
    url: 'https://wordlift.io/',
    description:
      'AI 驱动的内容知识图谱和 Schema 自动标注平台，能自动识别内容实体并生成结构化数据，同时构建网站知识图谱。',
    highlights: ['AI实体识别', '知识图谱构建', '内容语义分析'],
    tags: ['AI自动化', '知识图谱', '实体识别'],
    hasFreeplan: true,
    pricing: '$49/月起',
    level: 'auto',
    supportedTypes: ['article', 'product', 'organization', 'person'],
  },
  {
    id: 'rankmath',
    name: 'RankMath',
    url: 'https://rankmath.com/wordpress/plugin/seo-suite/',
    description:
      'WordPress 最流行的 SEO 插件，内置 Schema 自动生成模块，支持 20+ 类型，根据页面内容智能推荐 Schema 类型，设置一次持续生效。',
    highlights: ['WordPress专属', '智能推荐类型', '设置一次持续'],
    tags: ['WordPress', 'AI辅助', '插件'],
    hasFreeplan: true,
    pricing: '免费版 + Pro $59/年',
    level: 'auto',
    badge: 'WordPress推荐',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'video', 'localbusiness', 'review', 'recipe'],
  },
  {
    id: 'yoast',
    name: 'Yoast SEO',
    url: 'https://yoast.com/wordpress/plugins/seo/',
    description:
      'WordPress 老牌 SEO 插件，支持 Schema 自动生成，与 RankMath 并列为 WordPress 站长的两大首选，稳定可靠。',
    highlights: ['WordPress老牌', '稳定可靠', '自动生成'],
    tags: ['WordPress', 'Schema自动化', '插件'],
    hasFreeplan: true,
    pricing: '免费版 + Premium €99/年',
    level: 'auto',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'localbusiness'],
  },
]

// ── Schema 类型数据 ────────────────────────────────────────────
export const schemaTypes: SchemaType[] = [
  {
    id: 'article',
    name: 'Article',
    icon: 'article',
    color: '#6366F1',
    stars: 5,
    description:
      '文章、博客文章、新闻资讯页面的结构化标注。帮助搜索引擎识别发布时间、作者、内容类型，是内容站 SEO 的基础配置。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "你的文章标题",
  "description": "文章摘要描述（150字以内）",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "作者姓名",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "网站名称",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-01-01",
  "dateModified": "2026-05-01",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/article-url"
  }
}`,
    requiredFields: [
      { name: 'headline', desc: '文章标题（必填，建议50-60字符）' },
      { name: 'author', desc: '作者信息，用 Person 或 Organization 类型' },
      { name: 'datePublished', desc: '首次发布日期，ISO 8601 格式' },
      { name: 'image', desc: '文章特色图片 URL，推荐尺寸 1200×628px' },
    ],
    tools: ['merkle', 'hall-analysis', 'saijo-george'],
  },
  {
    id: 'faq',
    name: 'FAQ',
    icon: 'quiz',
    color: '#10B981',
    stars: 5,
    description:
      '常见问题页面的结构化标注，让 Google 在搜索结果中展示可展开的 Q&A，同时是 AI 引擎（ChatGPT、Perplexity）最容易直接引用的内容格式。',
    aeoTip:
      'FAQ Schema 是 AEO 优化最高效的手段之一，问答格式与 AI 搜索的"直接回答"需求完美匹配，能大幅提升被 AI 引用的概率。',
    internalLink: '/aeo-nav',
    internalLinkLabel: '查看 AEO 优化工具 →',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "问题一？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "问题一的详细回答内容，建议50-300字，直接回答问题。"
      }
    },
    {
      "@type": "Question",
      "name": "问题二？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "问题二的详细回答内容。"
      }
    }
  ]
}`,
    requiredFields: [
      { name: 'mainEntity', desc: '问答列表数组，每项包含 Question 和 Answer' },
      { name: 'name', desc: '问题文本（Question.name），建议使用真实用户问题' },
      { name: 'acceptedAnswer.text', desc: '回答内容，纯文本，建议50-300字' },
    ],
    tools: ['saijo-george', 'merkle', 'google-rich-results'],
  },
  {
    id: 'product',
    name: 'Product',
    icon: 'shopping_bag',
    color: '#F59E0B',
    stars: 5,
    description: '商品页面的结构化标注，在搜索结果中展示价格、评分、库存状态等购物信息，大幅提升电商页面的点击率。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "产品名称",
  "description": "产品描述",
  "image": "https://example.com/product.jpg",
  "brand": {
    "@type": "Brand",
    "name": "品牌名称"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/product"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "128"
  }
}`,
    requiredFields: [
      { name: 'name', desc: '产品名称（必填）' },
      { name: 'offers', desc: '价格和可用性信息，使用 Offer 类型' },
      { name: 'image', desc: '产品图片 URL' },
      { name: 'aggregateRating', desc: '评分数据，需有真实评论支撑' },
    ],
    tools: ['merkle', 'google-rich-results'],
  },
  {
    id: 'breadcrumb',
    name: 'BreadcrumbList',
    icon: 'account_tree',
    color: '#8B5CF6',
    stars: 4,
    description:
      '页面面包屑导航的结构化标注，让搜索结果中显示清晰的页面路径层级，提升用户对页面位置的认知，改善点击率。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "分类页",
      "item": "https://example.com/category/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "当前页面标题",
      "item": "https://example.com/category/page/"
    }
  ]
}`,
    requiredFields: [
      { name: 'itemListElement', desc: '面包屑层级数组，按层级顺序排列' },
      { name: 'position', desc: '层级位置编号，从 1 开始' },
      { name: 'name', desc: '该层级的页面名称' },
      { name: 'item', desc: '该层级的页面 URL' },
    ],
    tools: ['merkle', 'saijo-george'],
  },
  {
    id: 'howto',
    name: 'HowTo',
    icon: 'checklist',
    color: '#06B6D4',
    stars: 4,
    description:
      '教程、操作指南类内容的结构化标注，在搜索结果中展示步骤列表，适合"如何做XX"类内容，能获得特殊富结果展示。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "如何做XXX — 完整教程",
  "description": "教程简介描述",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "第一步标题",
      "text": "第一步的详细操作说明。"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "第二步标题",
      "text": "第二步的详细操作说明。"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "第三步标题",
      "text": "第三步的详细操作说明。"
    }
  ]
}`,
    requiredFields: [
      { name: 'name', desc: '教程标题（必填）' },
      { name: 'step', desc: 'HowToStep 数组，包含 position、name、text' },
      { name: 'totalTime', desc: '预计总耗时，ISO 8601 时长格式（如 PT30M = 30分钟）' },
    ],
    tools: ['saijo-george', 'merkle'],
  },
  {
    id: 'localbusiness',
    name: 'LocalBusiness',
    icon: 'store',
    color: '#EF4444',
    stars: 4,
    description:
      '本地商家信息的结构化标注，展示商家地址、电话、营业时间、评分等信息，是本地 SEO 的核心配置，影响 Google Maps 和本地搜索结果。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "商家名称",
  "description": "商家简介",
  "image": "https://example.com/shop.jpg",
  "telephone": "+86-xxx-xxxx-xxxx",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "街道地址",
    "addressLocality": "城市",
    "addressRegion": "省份",
    "postalCode": "邮政编码",
    "addressCountry": "CN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.9042,
    "longitude": 116.4074
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "url": "https://example.com"
}`,
    requiredFields: [
      { name: 'name', desc: '商家名称（必填）' },
      { name: 'address', desc: '详细地址，使用 PostalAddress 类型' },
      { name: 'telephone', desc: '联系电话' },
      { name: 'openingHoursSpecification', desc: '营业时间，影响 Google 本地面板展示' },
    ],
    tools: ['whitespark', 'merkle', 'saijo-george'],
  },
  {
    id: 'video',
    name: 'VideoObject',
    icon: 'play_circle',
    color: '#EC4899',
    stars: 3,
    description:
      '视频内容的结构化标注，在 Google 搜索结果中展示视频缩略图、时长、上传时间等信息，适合有视频内容的媒体站和教育站。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "视频标题",
  "description": "视频描述内容",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2026-01-01",
  "duration": "PT10M30S",
  "contentUrl": "https://example.com/video.mp4",
  "embedUrl": "https://www.youtube.com/embed/xxxxx"
}`,
    requiredFields: [
      { name: 'name', desc: '视频标题（必填）' },
      { name: 'thumbnailUrl', desc: '缩略图 URL（必填），建议 1280×720px' },
      { name: 'uploadDate', desc: '上传日期，ISO 8601 格式（必填）' },
      { name: 'duration', desc: '视频时长，ISO 8601 时长格式' },
    ],
    tools: ['merkle', 'google-rich-results'],
  },
  {
    id: 'recipe',
    name: 'Recipe',
    icon: 'restaurant',
    color: '#F97316',
    stars: 3,
    description:
      '食谱内容的结构化标注，在搜索结果中展示烹饪时间、卡路里、评分等信息，是美食博客和食谱网站的必备 Schema。',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "食谱名称",
  "image": "https://example.com/dish.jpg",
  "author": {
    "@type": "Person",
    "name": "作者姓名"
  },
  "datePublished": "2026-01-01",
  "description": "菜品简介",
  "prepTime": "PT15M",
  "cookTime": "PT30M",
  "totalTime": "PT45M",
  "recipeYield": "4人份",
  "recipeIngredient": [
    "食材一 200g",
    "食材二 适量"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "步骤一描述"
    }
  ]
}`,
    requiredFields: [
      { name: 'name', desc: '食谱名称（必填）' },
      { name: 'image', desc: '菜品图片（必填，影响富结果展示）' },
      { name: 'recipeIngredient', desc: '食材列表数组' },
      { name: 'recipeInstructions', desc: '烹饪步骤，使用 HowToStep 数组' },
    ],
    tools: ['recipeschema', 'merkle'],
  },
]

// ── 辅助函数 ─────────────────────────────────────────────────
export function getToolById(id: string): SchemaTool | undefined {
  return schemaTools.find((t) => t.id === id)
}

export function getToolsForType(typeId: string): SchemaTool[] {
  const type = schemaTypes.find((t) => t.id === typeId)
  if (!type) return []
  return type.tools.map((tid) => getToolById(tid)).filter(Boolean) as SchemaTool[]
}
