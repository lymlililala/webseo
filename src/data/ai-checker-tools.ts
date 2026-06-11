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
    name: 'Lens GEO',
    nameEn: 'Lens GEO',
    url: 'https://geo.timus.cn',
    description:
      'A free-forever China AI-visibility checker that simultaneously checks Doubao, DeepSeek and Kimi to quickly see how often your brand is mentioned.',
    highlights: ['Free Forever', 'Doubao+DeepSeek+Kimi', '🇨🇳 China-Only'],
    tags: ['Free', 'China AI', 'Quick Check'],
    region: 'cn',
    isFree: true,
    tier: 1,
    badge: 'Recommended',
  },
  {
    id: 'sheepgeo',
    name: 'SheepGeo',
    url: 'https://sheepgeo.com',
    description:
      'A visibility checker covering 9 major AI engines (Chinese and global) with brand mention rates, sentiment analysis and competitor comparison — has a free-forever tier.',
    highlights: ['9 AI Models', 'Sentiment Analysis', 'Competitor Comparison'],
    tags: ['China & Global AI', 'Competitor Comparison', 'Sentiment Analysis'],
    region: 'cn',
    hasFreeplan: true,
    pricing: 'Free + Paid',
    tier: 1,
    badge: 'Comprehensive',
  },
  {
    id: 'appearonai',
    name: 'AppearOnAI',
    url: 'https://appearonai.com',
    description:
      'A free global AI-visibility scanner that checks ChatGPT, Claude, Gemini and Perplexity at once and generates a one-click visibility report.',
    highlights: ['4 AI Engines', 'Free Scan', 'Fast Reports'],
    tags: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    region: 'global',
    isFree: true,
    tier: 1,
  },
  {
    id: 'hubspot-grader',
    name: 'HubSpot AI Search Grader',
    url: 'https://www.hubspot.com/ai-search-grader',
    description: 'HubSpot’s free one-off AI search brand grader — checks brand visibility via ChatGPT and returns an A–F grade with improvement tips.',
    highlights: ['Completely Free', 'A–F Brand Grade', 'Improvement Tips'],
    tags: ['Free', 'ChatGPT', 'Brand Grading'],
    region: 'global',
    isFree: true,
    tier: 1,
  },
]

// ── 第二层：国内专业监测 ────────────────────────────────
const tier2Tools: AiCheckerTool[] = [
  {
    id: 'aidso',
    name: 'AIDSO',
    url: 'https://www.aidso.cn',
    description:
      'An AI-visibility monitor focused on the China market, covering major domestic AI engines with brand-keyword monitoring, citation source-tracing and content recommendations.',
    highlights: ['China-Market Focus', 'Citation Source-Tracing', 'Content Optimization'],
    tags: ['China Monitoring', 'Brand Keywords', 'Source Tracing'],
    region: 'cn',
    hasFreeplan: true,
    tier: 2,
  },
  {
    id: 'impetaai',
    name: 'ImpetaAI (Huichen)',
    url: 'https://impeta.cn',
    description: 'Provides 50+ AI-visibility metrics across major Chinese and global AI platforms, with bulk-domain monitoring and automated report generation.',
    highlights: ['50+ Metrics', 'Bulk Domain Monitoring', 'Automated Reports'],
    tags: ['Multi-metric', 'Bulk Monitoring', 'Auto Reports'],
    region: 'cn',
    hasFreeplan: true,
    pricing: 'Pay-as-you-go',
    tier: 2,
  },
  {
    id: 'geowise',
    name: 'GEOWISE (Newrank)',
    url: 'https://geowise.xinbang.cn',
    description: 'Newrank’s GEO smart-operations platform unifying content creation with AI-visibility monitoring — ideal for brand content teams, with WeChat-ecosystem data integration.',
    highlights: ['Content + Monitoring', 'WeChat Ecosystem', 'Brand Teams'],
    tags: ['Content Ops', 'WeChat Ecosystem', 'Unified Platform'],
    region: 'cn',
    hasFreeplan: true,
    tier: 2,
  },
  {
    id: 'csygeo',
    name: 'CSYGEO',
    url: 'https://csygeo.com',
    description:
      'A full monitoring service covering 85+ AI platforms (Chinese and global), with enterprise services like brand-reputation management and AI content-strategy consulting.',
    highlights: ['85+ Platforms', 'Reputation Management', 'Enterprise Services'],
    tags: ['Full Monitoring', 'Enterprise', '85+ Platforms'],
    region: 'cn',
    hasApi: true,
    pricing: 'Custom Enterprise',
    tier: 2,
  },
]

// ── 第三层：国际专项工具 ────────────────────────────────
const tier3Tools: AiCheckerTool[] = [
  {
    id: 'llmrefs',
    name: 'LLMrefs',
    url: 'https://llmrefs.com',
    description:
      'A global platform focused on tracking LLM citations of your brand across ChatGPT, Claude, Gemini and more, with an llms.txt generator and citation monitoring.',
    highlights: ['LLM Citation Tracking', 'llms.txt Generator', 'Multi-Model Monitoring'],
    tags: ['LLM Citations', 'llms.txt', 'Citation Tracking'],
    region: 'global',
    hasFreeplan: true,
    tier: 3,
  },
  {
    id: 'otterly',
    name: 'Otterly.AI',
    url: 'https://otterly.ai',
    description:
      'A pro AI-visibility monitor that auto-tracks brand performance across ChatGPT, Perplexity and Gemini, with competitor comparison and trend analysis.',
    highlights: ['Auto Tracking', 'Competitor Comparison', 'Trend Analysis'],
    tags: ['Auto Monitoring', 'Competitor Comparison', 'Trends'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $29/mo',
    tier: 3,
    badge: 'Popular',
  },
  {
    id: 'profound',
    name: 'Profound',
    url: 'https://profound.io',
    description:
      'An enterprise AI-visibility platform giving large brands comprehensive AI-search intelligence, with multi-brand management, market-share analysis and citation source-tracing.',
    highlights: ['Enterprise', 'Multi-Brand Management', 'Citation Source-Tracing'],
    tags: ['Enterprise', 'AI Intelligence', 'Market Share'],
    region: 'global',
    hasApi: true,
    pricing: 'Custom Enterprise',
    tier: 3,
  },
  {
    id: 'scrunch-ai',
    name: 'Scrunch AI',
    url: 'https://scrunch.ai',
    description: 'A tool that shows how AI engines interpret your site, with AI-crawl simulation, content-structure analysis and visibility recommendations.',
    highlights: ['AI-Crawl Simulation', 'Content-Structure Analysis', 'Visibility Tips'],
    tags: ['AI Crawl', 'Content Analysis', 'Visibility'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $49/mo',
    tier: 3,
  },
  {
    id: 'peec-ai',
    name: 'Peec AI',
    url: 'https://peec.ai',
    description:
      'An AI-search monitor focused on Europe, supporting Perplexity, ChatGPT and Google AI Overviews with multilingual brand monitoring.',
    highlights: ['Multilingual', 'Google AI Overview', 'Perplexity'],
    tags: ['Multilingual', 'European Market', 'AI Monitoring'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $39/mo',
    tier: 3,
  },
  {
    id: 'brandmentions-ai',
    name: 'BrandMentions AI',
    url: 'https://brandmentions.com',
    description: 'Extends traditional brand monitoring into AI engines, tracking mentions across social media, news and AI search — a one-stop brand-intelligence platform.',
    highlights: ['Social + AI Monitoring', 'One-Stop Intelligence', 'Share of Voice'],
    tags: ['Brand Monitoring', 'Social Media', 'AI Mentions'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $49/mo',
    tier: 3,
  },
]

// ── 第四层：传统 SEO + GEO 模块 ────────────────────────
const tier4Tools: AiCheckerTool[] = [
  {
    id: 'semrush-ai',
    name: 'Semrush AI Visibility',
    url: 'https://www.semrush.com/ai-overview-tracker/',
    description:
      'SEMrush’s new AI-visibility module within its SEO suite, tracking how often a brand appears in Google AI Overviews and its keyword coverage.',
    highlights: ['Google AI Overview', 'Unified SEO', 'Keyword Coverage'],
    tags: ['Semrush', 'AI Overview', 'Google'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $129/mo (incl. full SEO)',
    tier: 4,
  },
  {
    id: 'ahrefs-brand',
    name: 'Ahrefs Brand Radar',
    url: 'https://ahrefs.com/brand-radar',
    description: 'Ahrefs’ brand-mention tracking module combined with AI-search monitoring to gauge brand awareness and citations in AI search.',
    highlights: ['Brand-Mention Tracking', 'SEO+AI', 'Authority Links'],
    tags: ['Ahrefs', 'Brand Tracking', 'SEO Integration'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $99/mo (incl. full SEO)',
    tier: 4,
  },
  {
    id: 'adobe-llm',
    name: 'Adobe LLM Optimizer',
    url: 'https://business.adobe.com/products/experience-platform/llm-optimizer.html',
    description:
      'Adobe’s enterprise LLM optimization tool that helps large enterprises optimize content for better AI-engine visibility, deeply integrated with AEM.',
    highlights: ['Enterprise', 'AEM Integration', 'LLM Optimization'],
    tags: ['Adobe', 'Enterprise', 'LLM Optimization'],
    region: 'global',
    pricing: 'Enterprise',
    tier: 4,
  },
]

// ── 第五层：辅助工具 ────────────────────────────────────
const tier5Tools: AiCheckerTool[] = [
  {
    id: 'llmstxt-gen',
    name: 'llms.txt Generator',
    url: 'https://llmrefs.com/llms-txt-generator',
    description:
      'Automatically scans your site structure and generates a spec-compliant llms.txt so AI crawlers understand your content better — a visibility foundation.',
    highlights: ['Auto Scan', 'llms.txt Spec', 'AI Crawlability'],
    tags: ['llms.txt', 'Content Structure', 'AI Crawl'],
    region: 'global',
    isFree: true,
    tier: 5,
    badge: 'Basic Tool',
  },
  {
    id: 'ai-crawlability',
    name: 'AI Crawlability Check',
    url: 'https://www.scrunch.ai/check-ai-crawlability',
    description: 'Checks whether your site is AI-crawler-friendly, including robots.txt config, content structure and load speed — key factors for AI crawling.',
    highlights: ['robots.txt Check', 'AI-Crawl Friendliness', 'Content Structure'],
    tags: ['AI Crawl', 'robots.txt', 'Technical Check'],
    region: 'global',
    isFree: true,
    tier: 5,
  },
  {
    id: 'schema-validator',
    name: 'Google Rich Results Test',
    url: 'https://search.google.com/test/rich-results',
    description: 'Validates whether your structured data (JSON-LD Schema) is correct — structured data is a key foundation for AI engines to understand content entities.',
    highlights: ['JSON-LD Validation', 'Schema Check', 'Free & Official'],
    tags: ['Structured Data', 'Schema', 'JSON-LD'],
    region: 'global',
    isFree: true,
    tier: 5,
  },
  {
    id: 'frase',
    name: 'Frase.io',
    url: 'https://www.frase.io',
    description:
      'A content optimizer that analyzes frequent content patterns in AI search results to guide article structures and elements more likely to be cited by AI engines.',
    highlights: ['Content Analysis', 'AI Citation Patterns', 'Content Optimization'],
    tags: ['Content Optimization', 'AI Citations', 'Article Structure'],
    region: 'global',
    hasFreeplan: true,
    pricing: 'From $14.99/mo',
    tier: 5,
  },
]

// ── 分类配置 ────────────────────────────────────────────
export const aiCheckerCategories: AiCheckerCategory[] = [
  {
    id: 'tier1',
    name: '🚀 Free Quick Check',
    description: 'Retention core — enter a domain to get a free AI-visibility report; great for a first look at your brand’s AI presence',
    icon: 'rocket_launch',
    color: '#10B981',
    badge: 'Free Entry',
    tools: tier1Tools,
  },
  {
    id: 'tier2',
    name: '🇨🇳 China Pro Monitoring',
    description: 'Professional monitoring with deep coverage of major Chinese AI platforms like Doubao, DeepSeek, Kimi and Ernie Bot',
    icon: 'location_on',
    color: '#EF4444',
    badge: 'Top China Pick',
    tools: tier2Tools,
  },
  {
    id: 'tier3',
    name: '🌍 Global Tools',
    description: 'Monitoring and optimization tools covering major global AI engines like ChatGPT, Claude, Perplexity and Gemini',
    icon: 'language',
    color: '#6366F1',
    badge: 'Global Mainstream',
    tools: tier3Tools,
  },
  {
    id: 'tier4',
    name: '📊 Traditional SEO + AI',
    description: 'AI-visibility modules added by traditional SEO platforms like Semrush and Ahrefs — ideal if you already subscribe to an SEO tool',
    icon: 'trending_up',
    color: '#F59E0B',
    tools: tier4Tools,
  },
  {
    id: 'tier5',
    name: '🔧 Utilities',
    description: 'Foundational AI-visibility tools — llms.txt generators, AI-crawl checks and structured-data validators',
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
