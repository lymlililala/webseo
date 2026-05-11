export interface AiCheckerTool {
  id: string
  name: string
  nameEn?: string
  url: string
  description: string
  highlights?: string[]
  tags: string[]
  region: 'cn' | 'global'
  isFree?: boolean
  hasFreeplan?: boolean
  pricing?: string
  isOpenSource?: boolean
  hasApi?: boolean
  tier: 1 | 2 | 3 | 4 | 5 // 分层
  badge?: string
}

export interface AiCheckerCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  badge?: string
  tools: AiCheckerTool[]
}

// ── 第一层：免费快速体检 ────────────────────────────────
const tier1Tools: AiCheckerTool[] = [
  {
    id: 'lensgeo',
    name: '透镜 GEO',
    nameEn: 'Lens GEO',
    url: 'https://geo.timus.cn',
    description: '永久免费的国内 AI 可见度体检工具，同时检测豆包、DeepSeek、Kimi 三大国内 AI 引擎，快速获取品牌被提及情况。',
    highlights: ['永久免费', '豆包+DS+Kimi', '🇨🇳 国内专属'],
    tags: ['免费', '国内AI', '快速体检'],
    region: 'cn',
    isFree: true,
    tier: 1,
    badge: '推荐',
  },
  {
    id: 'sheepgeo',
    name: 'SheepGeo',
    url: 'https://sheepgeo.com',
    description: '覆盖 9 大主流 AI 引擎的可见度检测平台，含国内外模型，提供品牌提及率、情感分析、竞品对比等功能，有永久免费版。',
    highlights: ['9大AI模型', '情感分析', '竞品对比'],
    tags: ['国内外AI', '竞品对比', '情感分析'],
    region: 'cn',
    hasFreeplan: true,
    pricing: '免费版 + 付费版',
    tier: 1,
    badge: '全面',
  },
  {
    id: 'appearonai',
    name: 'AppearOnAI',
    url: 'https://appearonai.com',
    description: '国际免费 AI 可见度扫描工具，同时检测 ChatGPT、Claude、Gemini、Perplexity 四大主流 AI 引擎，一键生成可见度报告。',
    highlights: ['4大AI引擎', '免费扫描', '快速报告'],
    tags: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    region: 'global',
    isFree: true,
    tier: 1,
  },
  {
    id: 'hubspot-grader',
    name: 'HubSpot AI Search Grader',
    url: 'https://www.hubspot.com/ai-search-grader',
    description: 'HubSpot 推出的免费一次性 AI 搜索品牌评分工具，基于 ChatGPT 检测品牌可见度，输出 A-F 评级和改进建议。',
    highlights: ['完全免费', 'A-F品牌评级', '改进建议'],
    tags: ['免费', 'ChatGPT', '品牌评级'],
    region: 'global',
    isFree: true,
    tier: 1,
  },
]

// ── 第二层：国内专业监测 ────────────────────────────────
const tier2Tools: AiCheckerTool[] = [
  {
    id: 'aidso',
    name: 'AIDSO 爱搜',
    url: 'https://www.aidso.cn',
    description: '专注国内市场的 AI 搜索可见度监测平台，覆盖国内主流 AI 引擎，提供品牌关键词监测、AI 引用溯源和内容优化建议。',
    highlights: ['国内市场专注', 'AI引用溯源', '内容优化'],
    tags: ['国内监测', '品牌关键词', '引用溯源'],
    region: 'cn',
    hasFreeplan: true,
    tier: 2,
  },
  {
    id: 'impetaai',
    name: 'ImpetaAI 慧辰',
    url: 'https://impeta.cn',
    description: '提供 50+ 维度 AI 搜索可见度监测指标，覆盖国内外主流 AI 平台，支持批量域名监测和自动化报告生成。',
    highlights: ['50+监测指标', '批量域名监测', '自动化报告'],
    tags: ['多维指标', '批量监测', '自动报告'],
    region: 'cn',
    hasFreeplan: true,
    pricing: '按需付费',
    tier: 2,
  },
  {
    id: 'geowise',
    name: '新榜 GEOWISE',
    url: 'https://geowise.xinbang.cn',
    description: '新榜旗下 GEO 智能运营平台，内容创作+AI可见度监测一体化，适合品牌内容团队使用，支持微信生态数据打通。',
    highlights: ['内容+监测一体', '微信生态', '品牌团队'],
    tags: ['内容运营', '微信生态', '一体化平台'],
    region: 'cn',
    hasFreeplan: true,
    tier: 2,
  },
  {
    id: 'csygeo',
    name: '潮树渔 CSYGEO',
    url: 'https://csygeo.com',
    description: '覆盖 85+ AI 平台的全量监测服务，包括国内外主流 AI 引擎，提供品牌声誉管理、AI 内容策略咨询等企业服务。',
    highlights: ['85+平台覆盖', '品牌声誉管理', '企业服务'],
    tags: ['全量监测', '企业级', '85+平台'],
    region: 'cn',
    hasApi: true,
    pricing: '企业定制',
    tier: 2,
  },
]

// ── 第三层：国际专项工具 ────────────────────────────────
const tier3Tools: AiCheckerTool[] = [
  {
    id: 'llmrefs',
    name: 'LLMrefs',
    url: 'https://llmrefs.com',
    description: '专注追踪品牌在 LLM 中被引用情况的国际平台，支持 ChatGPT、Claude、Gemini 等，提供 llms.txt 生成器和引用监测。',
    highlights: ['LLM引用追踪', 'llms.txt生成器', '多模型监测'],
    tags: ['LLM引用', 'llms.txt', '引用追踪'],
    region: 'global',
    hasFreeplan: true,
    tier: 3,
  },
  {
    id: 'otterly',
    name: 'Otterly.AI',
    url: 'https://otterly.ai',
    description: '专业的 AI 搜索可见度监测工具，自动追踪品牌在 ChatGPT、Perplexity、Gemini 中的表现，提供竞品对比和趋势分析。',
    highlights: ['自动追踪', '竞品对比', '趋势分析'],
    tags: ['自动监测', '竞品对比', '趋势'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$29/月起',
    tier: 3,
    badge: '热门',
  },
  {
    id: 'profound',
    name: 'Profound',
    url: 'https://profound.io',
    description: '企业级 AI 可见度分析平台，为大型品牌提供全面的 AI 搜索情报，支持多品牌管理、市场份额分析和 AI 引用来源追溯。',
    highlights: ['企业级', '多品牌管理', 'AI引用溯源'],
    tags: ['企业级', 'AI情报', '市场份额'],
    region: 'global',
    hasApi: true,
    pricing: '企业定制',
    tier: 3,
  },
  {
    id: 'scrunch-ai',
    name: 'Scrunch AI',
    url: 'https://scrunch.ai',
    description: '帮助品牌了解 AI 引擎如何理解其网站内容的工具，提供 AI 爬取模拟、内容结构分析和可见度改进建议。',
    highlights: ['AI爬取模拟', '内容结构分析', '可见度建议'],
    tags: ['AI爬取', '内容分析', '可见度'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$49/月起',
    tier: 3,
  },
  {
    id: 'peec-ai',
    name: 'Peec AI',
    url: 'https://peec.ai',
    description: '专注欧洲市场的 AI 搜索监测工具，支持 Perplexity、ChatGPT、Google AI Overview 等，提供多语言品牌监测。',
    highlights: ['多语言支持', 'Google AI Overview', 'Perplexity'],
    tags: ['多语言', '欧洲市场', 'AI监测'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$39/月起',
    tier: 3,
  },
  {
    id: 'brandmentions-ai',
    name: 'BrandMentions AI',
    url: 'https://brandmentions.com',
    description: '将传统品牌监测扩展到 AI 引擎领域，追踪品牌在社交媒体、新闻和 AI 搜索中的提及，一站式品牌情报平台。',
    highlights: ['社媒+AI监测', '一站式情报', '品牌声量'],
    tags: ['品牌监测', '社交媒体', 'AI提及'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$49/月起',
    tier: 3,
  },
]

// ── 第四层：传统 SEO + GEO 模块 ────────────────────────
const tier4Tools: AiCheckerTool[] = [
  {
    id: 'semrush-ai',
    name: 'Semrush AI Visibility',
    url: 'https://www.semrush.com/ai-overview-tracker/',
    description: 'SEMrush 在传统 SEO 工具中新增的 AI 可见度模块，追踪品牌在 Google AI Overview 中的出现频率和关键词覆盖。',
    highlights: ['Google AI Overview', 'SEO一体化', '关键词覆盖'],
    tags: ['Semrush', 'AI Overview', 'Google'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$129/月起（含全套SEO）',
    tier: 4,
  },
  {
    id: 'ahrefs-brand',
    name: 'Ahrefs Brand Radar',
    url: 'https://ahrefs.com/brand-radar',
    description: 'Ahrefs 推出的品牌提及追踪模块，结合 AI 搜索监测，帮助用户了解品牌在 AI 搜索中的知名度和被引用情况。',
    highlights: ['品牌提及追踪', 'SEO+AI', '权威链接'],
    tags: ['Ahrefs', '品牌追踪', 'SEO整合'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$99/月起（含全套SEO）',
    tier: 4,
  },
  {
    id: 'adobe-llm',
    name: 'Adobe LLM Optimizer',
    url: 'https://business.adobe.com/products/experience-platform/llm-optimizer.html',
    description: 'Adobe 推出的企业级 LLM 优化工具，帮助大型企业优化内容以在 AI 引擎中获得更好的可见度，与 AEM 深度集成。',
    highlights: ['企业级', 'AEM集成', 'LLM优化'],
    tags: ['Adobe', '企业级', 'LLM优化'],
    region: 'global',
    pricing: '企业版',
    tier: 4,
  },
]

// ── 第五层：辅助工具 ────────────────────────────────────
const tier5Tools: AiCheckerTool[] = [
  {
    id: 'llmstxt-gen',
    name: 'LLMs.txt 生成器',
    url: 'https://llmstxt.io',
    description: '自动扫描网站结构并生成符合规范的 llms.txt 文件，让 AI 爬虫更好地理解网站内容，提升 AI 搜索可见度基础。',
    highlights: ['自动扫描', 'llms.txt规范', 'AI可爬性'],
    tags: ['llms.txt', '内容结构', 'AI爬取'],
    region: 'global',
    isFree: true,
    tier: 5,
    badge: '基础工具',
  },
  {
    id: 'ai-crawlability',
    name: 'AI 可爬性检测',
    url: 'https://www.scrunch.ai/check-ai-crawlability',
    description: '检测网站是否对 AI 爬虫友好，包括 robots.txt 配置、内容结构、加载速度等影响 AI 抓取的关键因素。',
    highlights: ['robots.txt检测', 'AI爬取友好度', '内容结构'],
    tags: ['AI爬取', 'robots.txt', '技术检测'],
    region: 'global',
    isFree: true,
    tier: 5,
  },
  {
    id: 'schema-validator',
    name: 'Google Rich Results Test',
    url: 'https://search.google.com/test/rich-results',
    description: '验证网站结构化数据（JSON-LD Schema）是否正确，结构化数据是 AI 引擎理解内容实体的关键技术基础。',
    highlights: ['JSON-LD验证', 'Schema检测', '免费官方'],
    tags: ['结构化数据', 'Schema', 'JSON-LD'],
    region: 'global',
    isFree: true,
    tier: 5,
  },
  {
    id: 'frase',
    name: 'Frase.io',
    url: 'https://www.frase.io',
    description: '内容优化工具，通过分析 AI 搜索结果中的高频内容模式，指导用户创作更容易被 AI 引擎引用的文章结构和内容要素。',
    highlights: ['内容分析', 'AI引用模式', '内容优化'],
    tags: ['内容优化', 'AI引用', '文章结构'],
    region: 'global',
    hasFreeplan: true,
    pricing: '$14.99/月起',
    tier: 5,
  },
]

// ── 分类配置 ────────────────────────────────────────────
export const aiCheckerCategories: AiCheckerCategory[] = [
  {
    id: 'tier1',
    name: '🚀 免费快速体检',
    description: '留存核心 — 输入域名即可免费获取 AI 可见度报告，适合首次了解品牌 AI 存在感',
    icon: 'rocket_launch',
    color: '#10B981',
    badge: '免费入口',
    tools: tier1Tools,
  },
  {
    id: 'tier2',
    name: '🇨🇳 国内专业监测',
    description: '深度覆盖豆包、DeepSeek、Kimi、文心一言等国内主流 AI 平台的专业监测服务',
    icon: 'location_on',
    color: '#EF4444',
    badge: '国内首选',
    tools: tier2Tools,
  },
  {
    id: 'tier3',
    name: '🌍 国际专项工具',
    description: '覆盖 ChatGPT、Claude、Perplexity、Gemini 等国际主流 AI 引擎的监测与优化工具',
    icon: 'language',
    color: '#6366F1',
    badge: '国际主流',
    tools: tier3Tools,
  },
  {
    id: 'tier4',
    name: '📊 传统 SEO + AI 升级',
    description: 'Semrush、Ahrefs 等传统 SEO 平台新增的 AI 可见度模块，适合已有 SEO 工具订阅的用户',
    icon: 'trending_up',
    color: '#F59E0B',
    tools: tier4Tools,
  },
  {
    id: 'tier5',
    name: '🔧 辅助工具',
    description: 'llms.txt 生成器、AI 爬取检测、结构化数据验证等 AI 可见度基础建设工具',
    icon: 'build',
    color: '#8B5CF6',
    tools: tier5Tools,
  },
]

// ── 聚合数据 ─────────────────────────────────────────────
export const allAiCheckerTools: AiCheckerTool[] = [
  ...tier1Tools,
  ...tier2Tools,
  ...tier3Tools,
  ...tier4Tools,
  ...tier5Tools,
]

export const featuredAiCheckerTools: AiCheckerTool[] = allAiCheckerTools.filter((t) =>
  ['lensgeo', 'sheepgeo', 'appearonai', 'otterly', 'llmrefs'].includes(t.id),
)
