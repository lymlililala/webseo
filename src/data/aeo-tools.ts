// AEO (Answer Engine Optimization) Tools
// 数据来源：GitHub 真实项目 + 官网整理（2026-05-09）
// 6大分类：AEO专项SaaS平台、企业SEO+AEO模块、内容优化工具、问题研究工具、结构化数据工具、国内AEO/GEO平台

export interface AeoTool {
  id: string
  name: string
  nameEn?: string
  description: string
  url: string
  tags: string[]
  isFree: boolean
  hasFreeplan: boolean
  isOpenSource: boolean
  hasApi: boolean
  pricing?: string
  highlights?: string[]
  github?: {
    repo: string
    stars: number
    forks: number
    language: string | null
    topics: string[]
    license: string | null
    createdAt: string
    updatedAt: string
  }
  featured?: boolean
}

export interface AeoCategory {
  id: string
  name: string
  icon: string
  color: string
  description: string
  badge: string
  tools: AeoTool[]
}

// ══════════════════════════════════════════════════════════
// 一、AEO 专项 SaaS 平台（核心监测 + 优化）
// ══════════════════════════════════════════════════════════
const aeoSaasTools: AeoTool[] = [
  {
    id: 'heyamos',
    name: 'HeyAmos',
    nameEn: 'HeyAmos',
    description:
      'An Antler-backed end-to-end AEO platform driven by an AEO Playbook, with strong JAPAC coverage, helping brands systematically build visibility in AI-engine answers.',
    url: 'https://heyamos.com',
    tags: ['AEO', 'Antler-Backed', 'JAPAC', 'AEO Playbook', 'End-to-End', 'Brand Monitoring'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Contact for Pricing',
    highlights: ['Antler-backed, end-to-end AEO', 'AEO Playbook-driven workflow', 'Strong JAPAC Coverage'],
    featured: true,
  },
  {
    id: 'profound',
    name: 'Profound',
    nameEn: 'Profound',
    description:
      'An enterprise AEO platform that raised $55M, SOC2+HIPAA compliant with AI Agent analysis, helping Fortune 500 brands track and optimize their AI-search presence.',
    url: 'https://tryprofound.com',
    tags: ['AEO', 'Sequoia-Backed', 'SOC2', 'HIPAA', 'Enterprise', 'Agent Analysis'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $99/mo',
    highlights: [
      'Sequoia $55M, industry leader',
      'SOC2 + HIPAA compliant',
      'AI Agent analysis for deep visibility insight',
    ],
    featured: true,
  },
  {
    id: 'athenahq',
    name: 'AthenaHQ',
    nameEn: 'AthenaHQ',
    description:
      'A YC-backed GEO/AEO platform with a built-in AI Copilot that recommends strategies and an original QVEM query-volume model to quantify AI-visibility growth.',
    url: 'https://athenahq.ai',
    tags: ['AEO', 'GEO', 'YC', 'AI Copilot', 'QVEM', 'Query-Volume Estimation'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $295/mo',
    highlights: ['YC-backed, top investors', 'AI Copilot recommends strategies', 'Original QVEM query-volume estimation'],
    featured: true,
  },
  {
    id: 'otterly-ai',
    name: 'Otterly.AI',
    nameEn: 'Otterly.AI',
    description:
      'A top AEO-monitoring starter that tracks 15+ prompts daily across major engines like ChatGPT, Perplexity and Gemini. Used by 15,000+ — the best-value AEO entry tool.',
    url: 'https://otterly.ai',
    tags: ['AEO', 'Monitoring Starter', 'Daily Tracking', '15,000+ Users', 'Great Value', 'ChatGPT'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From $29/mo',
    highlights: ['15,000+ users, most popular AEO starter', 'Tracks 15+ prompts daily across major engines', 'From $29/mo, best value'],
    featured: true,
  },
  {
    id: 'peec-ai',
    name: 'Peec AI',
    nameEn: 'Peec AI',
    description:
      'A brand AI-visibility monitor built for agencies, with clean data presentation and multi-client account management for tracking clients across AI engines.',
    url: 'https://peec.ai',
    tags: ['AEO', 'Agencies', 'Brand Monitoring', 'Multi-account', 'Data Visualization'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From €89/mo',
    highlights: ['Built for agencies, multi-client accounts', 'Clean data presentation for client reporting', 'EU-compliant, GDPR-friendly'],
  },
  {
    id: 'goodie-ai',
    name: 'Goodie AI',
    nameEn: 'Goodie AI',
    description:
      'A platform focused on AEO and AI shopping visibility, tracking recommendations across ChatGPT, Amazon Rufus and Perplexity Shopping — ideal for e-commerce brands.',
    url: 'https://higoodie.com',
    tags: ['AEO', 'AI Shopping', 'Amazon Rufus', 'ChatGPT Shopping', 'Perplexity', 'E-commerce'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '~$199/mo',
    highlights: ['Covers AI shopping engines (Amazon Rufus)', 'Tracks ChatGPT/Perplexity shopping visibility', 'E-commerce AEO Features'],
  },
  {
    id: 'evertune',
    name: 'Evertune',
    nameEn: 'Evertune',
    description:
      'An enterprise AEO platform serving the Fortune 500, processing 1M+ prompts a month with statistical-confidence analysis for the most accurate AI-visibility data.',
    url: 'https://evertune.ai',
    tags: ['AEO', 'Fortune500', 'Enterprise', '1M Prompts', 'Statistical Confidence'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '~$3000/mo',
    highlights: [
      'Processes 1M+ prompts/month',
      'Statistical confidence, most reliable',
      'For Fortune 500 enterprises',
    ],
  },
  {
    id: 'omnibound',
    name: 'Omnibound AI',
    nameEn: 'Omnibound AI',
    description:
      'A B2B content AEO platform that drives content strategy from buyer conversations, with bulk refresh and AI-engine optimization to boost visibility in purchase decisions.',
    url: 'https://omnibound.ai',
    tags: ['AEO', 'B2B', 'Content Strategy', 'Buyer Conversations', 'Bulk Refresh'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Custom Pricing',
    highlights: ['B2B-focused, buyer-conversation-driven', 'Bulk content refresh at scale', 'AI visibility for purchase decisions'],
  },
  {
    id: 'aiclicks',
    name: 'AIclicks',
    nameEn: 'AIclicks',
    description:
      'A mid-market AEO toolkit with prompt-cluster mapping, GEO audits and multilingual tracking, helping SMBs run comprehensive AI-search optimization affordably.',
    url: 'https://aiclicks.io',
    tags: ['AEO', 'GEO Audit', 'Prompt Clustering', 'Multilingual', 'Mid-Market'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '$39-79/mo',
    highlights: ['Prompt clustering to analyze AI search intent', 'GEO audit + AEO monitoring', 'Multilingual, global coverage'],
  },
  {
    id: 'rankscale',
    name: 'Rankscale',
    nameEn: 'Rankscale',
    description:
      'A flexible credit-based AI-visibility tracker with high-precision deep ranking across AI engines — buy credits as needed; great for precision-focused teams on a budget.',
    url: 'https://rankscale.io',
    tags: ['AEO', 'Credit-Based', 'High Precision', 'AI Visibility', 'Flexible Billing'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From ~$20/mo',
    highlights: ['Flexible credit billing, pay-as-you-go', 'High-precision visibility tracking', 'For Budget Teams'],
  },
  // ── 开源 AEO 监测（来自 GitHub）──────────────────────────────
  {
    id: 'getcito',
    name: 'GetCito',
    nameEn: 'GetCito',
    description:
      'The first open-source AIO/AEO/GEO platform, tracking brand exposure across ChatGPT, Claude, Perplexity and Google AI Overviews with actionable recommendations, self-hosted or cloud SaaS.',
    url: 'https://getcito.com/dashboard',
    tags: ['AEO', 'GEO', 'AIO', 'Open Source', 'Next.js', 'TypeScript', 'Self-hosted'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: true,
    highlights: [
      '⭐ 107 Stars, top-starred AEO project',
      'Full coverage: ChatGPT / Perplexity / Claude / Google AIO',
      'Open source self-host or cloud SaaS',
    ],
    github: {
      repo: 'ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool',
      stars: 107,
      forks: 14,
      language: 'TypeScript',
      topics: [
        'ai-search-optimization',
        'answer-engine-optimization',
        'chatgpt',
        'claude',
        'generative-engine-optimization',
        'google-ai-overview',
        'llm-seo',
        'nextjs13',
        'open-source',
        'perplexity-ai',
        'seo',
      ],
      license: 'MIT',
      createdAt: '2025-08-12',
      updatedAt: '2026-05-08',
    },
    featured: true,
  },
  {
    id: 'elmo-ai',
    name: 'Elmo AI Visibility',
    nameEn: 'Elmo',
    description:
      'An open-source AI-visibility tracker that monitors exposure across ChatGPT, Perplexity, Gemini, Grok and Copilot in real time, with multi-dimensional AEO/GEO/AIO/LLMO reports and a privacy-friendly BYOK design.',
    url: 'https://www.elmohq.com',
    tags: ['AEO', 'AIO', 'LLMO', 'GEO', 'Open Source', 'BYOK', 'Grok', 'Copilot'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      '⭐ 101 Stars, widest open-source visibility tool',
      'One-stop tracking: ChatGPT / Grok / Copilot / Gemini / Perplexity',
      'TypeScript stack, easy to extend',
    ],
    github: {
      repo: 'elmohq/elmo',
      stars: 101,
      forks: 4,
      language: 'TypeScript',
      topics: [
        'aeo',
        'ai-visibility',
        'aio',
        'aso',
        'chatgpt',
        'copilot',
        'gemini',
        'geo',
        'grok',
        'llmo',
        'marketing',
        'perplexity',
        'seo',
        'tools',
        'typescript',
      ],
      license: null,
      createdAt: '2026-01-18',
      updatedAt: '2026-05-07',
    },
    featured: true,
  },
  {
    id: 'aperture-ai',
    name: 'Aperture',
    nameEn: 'Aperture',
    description:
      'An open-source, self-hostable AI-visibility monitor (BYOK) that tracks how often and in what context a brand appears across ChatGPT, Perplexity and Google AI Overviews — a free alternative to Profound and Peec AI.',
    url: 'https://github.com/anyin-ai/aperture',
    tags: ['AEO', 'BYOK', 'Self-hosted', 'Open Source', 'Brand Monitoring', 'TypeScript', 'LLM Monitoring'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      'BYOK design, full data privacy',
      'Free open-source Profound/Peec alternative',
      'Supports ChatGPT + Perplexity + Google AIO',
    ],
    github: {
      repo: 'anyin-ai/aperture',
      stars: 9,
      forks: 1,
      language: 'TypeScript',
      topics: [
        'aeo',
        'ai-engine-optimization',
        'ai-search',
        'ai-visibility',
        'analytics',
        'brand-monitoring',
        'byok',
        'competitor-analysis',
        'generative-ai',
        'geo',
        'llm',
        'llm-monitoring',
        'self-hosted',
        'seo',
        'seo-audit',
      ],
      license: null,
      createdAt: '2026-02-28',
      updatedAt: '2026-04-30',
    },
  },
  {
    id: 'aeo-radar',
    name: 'AEO Radar',
    nameEn: 'AEO Radar',
    description:
      'An open-source AEO brand-visibility monitor that tracks mentions across ChatGPT, Perplexity and Gemini in real time, with a visual dashboard and alerts for fast response.',
    url: 'https://github.com/hellowalt/aeo-radar',
    tags: ['AEO', 'Open Source', 'Brand Monitoring', 'Dashboard', 'Alerts', 'Python'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: ['Real-time alerts on mention spikes', 'Visual dashboard for brand trends', 'Fully open source, self-hostable'],
    github: {
      repo: 'hellowalt/aeo-radar',
      stars: 11,
      forks: 2,
      language: 'Python',
      topics: ['aeo', 'answer-engine-optimization', 'brand-monitoring', 'chatgpt', 'perplexity'],
      license: null,
      createdAt: '2026-01-22',
      updatedAt: '2026-04-15',
    },
  },
  {
    id: 'canonry',
    name: 'Canonry',
    nameEn: 'Canonry',
    description:
      'An agent-first AEO monitoring and operations platform (by AINYC) built for the AI search era, keeping brands visible in AI answers with automated monitoring, competitor comparison and recommendations.',
    url: 'https://github.com/AINYC/canonry',
    tags: ['AEO', 'Agent-first', 'Brand Monitoring', 'Competitor Comparison', 'TypeScript', 'Open Source'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: true,
    hasApi: true,
    highlights: [
      'Agent-first architecture, automated monitoring',
      'Focused on AEO brand visibility',
      'By AINYC, who also maintain aeo-audit',
    ],
    github: {
      repo: 'AINYC/canonry',
      stars: 36,
      forks: 3,
      language: 'TypeScript',
      topics: ['aeo', 'ai-monitoring', 'brand-visibility', 'agent'],
      license: null,
      createdAt: '2026-01-05',
      updatedAt: '2026-04-28',
    },
  },
]

// ══════════════════════════════════════════════════════════
// 二、企业级 SEO 平台（内置 AEO 模块）
// ══════════════════════════════════════════════════════════
const aeoEnterpriseTools: AeoTool[] = [
  {
    id: 'conductor',
    name: 'Conductor',
    nameEn: 'Conductor',
    description:
      'An enterprise SEO + AEO platform with live LLM query analysis, an AI writing assistant and 24/7 visibility monitoring to unify traditional SEO and AEO at scale.',
    url: 'https://conductor.com',
    tags: ['AEO', 'SEO', 'Enterprise', 'LLM Queries', 'AI Writing', '24/7 Monitoring'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Enterprise Pricing',
    highlights: ['Enterprise AEO + SEO in one', 'Live LLM query analysis + AI writer', '24/7 AI Visibility Monitoring'],
    featured: true,
  },
  {
    id: 'semrush-ai-visibility',
    name: 'Semrush AI Visibility',
    nameEn: 'Semrush AI Visibility',
    description:
      'Semrush’s AI-visibility module with AI Overviews tracking, competitor benchmarking and period comparison, deeply integrated with Semrush’s SEO data.',
    url: 'https://www.semrush.com',
    tags: ['AEO', 'AI Overviews', 'Competitors', 'Semrush', 'SEO Integration', 'Benchmarking'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Included with Semrush',
    highlights: [
      'Deep integration with Semrush SEO data',
      'AI Overviews tracking + competitor benchmarks',
      'Period comparison to quantify AEO gains',
    ],
  },
  {
    id: 'ahrefs-brand-radar',
    name: 'Ahrefs Brand Radar',
    nameEn: 'Ahrefs Brand Radar',
    description:
      'Ahrefs’ AI brand-tracking module covering six AI engines (ChatGPT, Perplexity, Gemini, Copilot, Claude, Grok), seamlessly linked to Ahrefs’ SEO data for the most complete visibility analysis.',
    url: 'https://ahrefs.com/brand-radar',
    tags: ['AEO', 'Ahrefs', '6 AI Engines', 'Brand Tracking', 'SEO Integration'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '+~$199/mo Add-on',
    highlights: ['Brand tracking across 6 AI engines', 'Integrates with Ahrefs SEO data', 'Most Complete Visibility Analysis'],
  },
  {
    id: 'se-ranking',
    name: 'SE Ranking',
    nameEn: 'SE Ranking',
    description:
      'An SEO platform with a built-in generative-engine (GEO/AEO) tracking module and agency multi-client management — great value for small agencies tracking AI visibility.',
    url: 'https://seranking.com',
    tags: ['AEO', 'GEO', 'Agencies', 'Generative Engine Tracking', 'SEO Tool', 'Multi-client'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From ~$55/mo',
    highlights: ['Built-in generative-engine tracking, SEO+AEO', 'For Agency Multi-Client', 'Great value, top pick for small agencies'],
  },
  {
    id: 'brightedge',
    name: 'BrightEdge',
    nameEn: 'BrightEdge',
    description:
      'An enterprise AI-content and AEO platform that systematically fuses AEO with content strategy, offering large-scale visibility monitoring and recommendations for top global brands.',
    url: 'https://brightedge.com',
    tags: ['AEO', 'SEO', 'Enterprise', 'AI Content', 'Large-Scale Monitoring'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Enterprise Pricing',
    highlights: ['Systematic AEO + content strategy', 'Large-scale AI visibility monitoring', 'Serves Top Global Brands'],
  },
  {
    id: 'seoclarity',
    name: 'seoClarity',
    nameEn: 'seoClarity',
    description:
      'An AI-powered enterprise SEO + AEO platform supporting AEO at scale, with content optimization, visibility analysis and automated workflows for large content teams.',
    url: 'https://seoclarity.net',
    tags: ['AEO', 'SEO', 'Enterprise', 'AI Intelligence', 'Automated Workflows', 'Content Optimization'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Enterprise Pricing',
    highlights: ['AI integration for enterprise-scale AEO', 'Content optimization + AI visibility', 'Automated workflows for large teams'],
  },
  {
    id: 'authoritas',
    name: 'Authoritas',
    nameEn: 'Authoritas',
    description:
      'An enterprise SEO platform with an AI brand-monitoring module that tracks performance in AI-generated content and pairs it with SEO data for full visibility analysis.',
    url: 'https://authoritas.com',
    tags: ['AEO', 'SEO', 'Brand Monitoring', 'AI-Generated Content', 'Enterprise'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Usage-Based Pricing',
    highlights: ['AI brand monitoring + full SEO analysis', 'Track brand performance in AI content', 'Enterprise reliability, flexible pricing'],
  },
]

// ══════════════════════════════════════════════════════════
// 三、内容优化工具（AEO 内容结构化）
// ══════════════════════════════════════════════════════════
const aeoContentTools: AeoTool[] = [
  {
    id: 'frase-io',
    name: 'Frase.io',
    nameEn: 'Frase.io',
    description:
      'An AI summary and answer-optimization platform built for AEO, with FAQ generation, content structuring and AI-readiness scoring to quickly produce citation-friendly answers.',
    url: 'https://frase.io',
    tags: ['AEO', 'Content Optimization', 'FAQ Generation', 'AI Summaries', 'Answer Optimization', 'Content Structuring'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $14.99/mo',
    highlights: [
      'AI summaries + FAQ generation for AEO',
      'Content-structure scoring for AI readiness',
      'From $14.99/mo, value pick for content teams',
    ],
    featured: true,
  },
  {
    id: 'surfer-seo',
    name: 'Surfer SEO',
    nameEn: 'Surfer SEO',
    description:
      'A content-scoring and AI-structure platform offering semantic term analysis, coverage scoring and LLM strategy to create content that ranks on Google and gets cited by AI.',
    url: 'https://surferseo.com',
    tags: ['AEO', 'Content Scoring', 'LLM Optimization', 'Semantic Analysis', 'AI Structure', 'SEO'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $89/mo',
    highlights: [
      'Content scoring + AI-structure advice',
      'LLM strategy for Google + AI citations',
      'Semantic term analysis for best coverage',
    ],
  },
  {
    id: 'clearscope',
    name: 'Clearscope',
    nameEn: 'Clearscope',
    description:
      'A semantic term-analysis and coverage-scoring tool that helps teams write semantically complete, authoritative content more likely to be cited in both traditional and AI search.',
    url: 'https://clearscope.io',
    tags: ['AEO', 'Semantic Analysis', 'Content Coverage', 'Topical Authority', 'Content Quality'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $189/mo',
    highlights: ['Semantic term analysis + coverage scoring', 'Build topical authority to lift citation odds', 'Quantifies content quality to set priorities'],
  },
  {
    id: 'marketmuse',
    name: 'MarketMuse',
    nameEn: 'MarketMuse',
    description:
      'An AI-driven topical-authority and content-gap platform that helps brands systematically cover core topics, build a content moat and gain authority in AI and traditional search.',
    url: 'https://marketmuse.com',
    tags: ['AEO', 'Topical Authority', 'Content Gaps', 'AI-Powered', 'Content Moat'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $149/mo',
    highlights: ['Topical authority + content-gap analysis', 'AI-driven content strategy for core topics', 'Build a content moat for long-term advantage'],
  },
  {
    id: 'neuronwriter',
    name: 'NeuronWriter',
    nameEn: 'NeuronWriter',
    description:
      'An NLP-based content optimizer popular in Europe, with multilingual scoring and AI-search recommendations — great value for European AEO content work.',
    url: 'https://neuronwriter.com',
    tags: ['AEO', 'NLP', 'Multilingual', 'European Market', 'Content Scoring', 'Great Value'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From $23/mo',
    highlights: ['NLP optimization, popular in Europe', 'Multilingual, covers European markets', 'From $23/mo, great value'],
  },
  {
    id: 'inlinks',
    name: 'InLinks',
    nameEn: 'InLinks',
    description:
      'An entity-optimization and internal-linking automation tool that builds AI-search authority via knowledge graphs and entity relations, deeply integrated with Schema for better entity recognition.',
    url: 'https://inlinks.com',
    tags: ['AEO', 'Entity Optimization', 'Internal Linking', 'Knowledge Graph', 'Schema', 'AI Authority'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $49/mo',
    highlights: ['Entity optimization + internal linking automation', 'Knowledge-graph building for AI authority', 'Deep Schema integration'],
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    nameEn: 'Writesonic',
    description:
      'An AI content-generation platform producing GEO + SEO + AEO-friendly structure — semantically complete, citation-ready articles, FAQs and landing pages for high-volume teams.',
    url: 'https://writesonic.com',
    tags: ['AEO', 'GEO', 'SEO', 'AI Content Generation', 'FAQ', 'Landing Pages'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $19/mo',
    highlights: ['GEO + SEO + AEO-friendly content', 'One-click FAQ & Landing Pages', 'Semantically complete, citation-ready structure'],
  },
  {
    id: 'seobuild-onpage',
    name: 'SEOBuild Onpage',
    nameEn: 'SEOBuild Onpage',
    description:
      'An AI-agent page SEO + AEO writer (⭐205 Stars): one command generates landing pages optimized for both Google ranking and LLM citation, with 500-token chunking, entity consensus and validation tags, integrating GSC and DataforSEO.',
    url: 'https://github.com/gbessoni/seobuild-onpage',
    tags: ['SEO+AEO', 'AI Writing', 'Claude Code', 'DataforSEO', 'GSC', 'Landing Pages', 'Python'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: true,
    highlights: [
      '⭐ 205 Stars, SEO+AEO AI writing agent',
      '500-token chunking + entity consensus',
      'Integrates Google Search Console + DataforSEO',
    ],
    github: {
      repo: 'gbessoni/seobuild-onpage',
      stars: 205,
      forks: 28,
      language: 'Python',
      topics: [
        'aeo',
        'agent-skills',
        'ahrefs',
        'ai-agent',
        'claude-code',
        'dataforseo',
        'geo',
        'gsc',
        'llm-seo',
        'open-source',
        'semrush',
        'seo',
        'seo-tools',
      ],
      license: null,
      createdAt: '2025-12-20',
      updatedAt: '2026-05-08',
    },
    featured: true,
  },
]

// ══════════════════════════════════════════════════════════
// 四、问题研究工具（AEO 关键词发现）
// ══════════════════════════════════════════════════════════
const aeoResearchTools: AeoTool[] = [
  {
    id: 'alsoasked',
    name: 'AlsoAsked',
    nameEn: 'AlsoAsked',
    description:
      'A visual PAA (People Also Ask) question-tree tool that mines Google’s semantic question network to reveal real user intent for AEO content and FAQ optimization.',
    url: 'https://alsoasked.com',
    tags: ['AEO', 'PAA', 'Question Research', 'Semantic Network', 'FAQ Mining', 'Keyword Discovery'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From $15/mo',
    highlights: ['Visual PAA question tree', 'Core tool for AEO FAQ content', 'Discover Real User Intent'],
    featured: true,
  },
  {
    id: 'answerthepublic',
    name: 'AnswerThePublic',
    nameEn: 'AnswerThePublic',
    description:
      'A classic 5W1H long-tail question aggregator that auto-generates Who/What/When/Where/Why/How questions about a topic from search suggestions — an AEO research essential.',
    url: 'https://answerthepublic.com',
    tags: ['AEO', '5W1H', 'Long-tail Questions', 'Question Aggregation', 'Keyword Research', 'Classic Tool'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From $5/mo',
    highlights: ['Classic 5W1H aggregation, AEO essential', 'Auto-generates Who/What/When/Why/How questions', 'From $5/mo, most affordable'],
    featured: true,
  },
  {
    id: 'google-paa',
    name: 'Google PAA (Free)',
    nameEn: 'Google People Also Ask',
    description:
      'Mine “People Also Ask” answer-box opportunities straight from Google results — free and live; expanding PAA blocks surfaces plenty of AEO content ideas and direct competitive insight.',
    url: 'https://google.com',
    tags: ['AEO', 'PAA', 'Free', 'Answer Box', 'Google', 'Competitive Insight'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'Free',
    highlights: [
      'Free — mine Google answer-box opportunities',
      'Reflects Google AI Overviews trends live',
      'PAA questions as AEO targets',
    ],
  },
  {
    id: 'explodingtopics',
    name: 'Exploding Topics',
    nameEn: 'Exploding Topics',
    description:
      'Discover breakout question topics and industry trends to get ahead on AI-search hotspots for AEO content, across tech, business, health and more verticals.',
    url: 'https://explodingtopics.com',
    tags: ['AEO', 'Trend Discovery', 'Breakout Topics', 'Get Ahead', 'Content Ideation'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'From $39/mo',
    highlights: ['Spot breakout topics to get ahead in AEO', 'Get ahead of AI search trends', 'Covers tech, business, health verticals'],
  },
  {
    id: 'questiondb',
    name: 'QuestionDB',
    nameEn: 'QuestionDB',
    description:
      'A long-tail library built on real Reddit questions, gathering genuine user discussions to help AEO teams find frequently debated question types on Reddit, Quora and more.',
    url: 'https://questiondb.io',
    tags: ['AEO', 'Reddit', 'Long-tail Library', 'Community Questions', 'Real User Questions'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'Free / Paid',
    highlights: ['Based on real Reddit questions', 'Find Hot Community Questions', 'Free tier covers basic research'],
  },
  {
    id: 'keyword-tool',
    name: 'Keyword Tool',
    nameEn: 'Keyword Tool',
    description:
      'A multi-platform search-suggestion tool covering question and long-tail terms from Google, Bing, YouTube, Amazon and Reddit for multi-channel AEO question research.',
    url: 'https://keywordtool.io',
    tags: ['AEO', 'Multi-platform', 'Search Suggestions', 'Question Terms', 'Google', 'YouTube', 'Amazon'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'From $69/mo',
    highlights: [
      'Multi-platform suggestions (Google+Bing+YouTube+Amazon)',
      'Question mining for AEO ideation',
      'API support for content workflows',
    ],
  },
]

// ══════════════════════════════════════════════════════════
// 五、结构化数据工具（Schema / FAQ 标记）
// ══════════════════════════════════════════════════════════
const aeoSchemaTools: AeoTool[] = [
  {
    id: 'geordy-ai',
    name: 'Geordy.ai',
    nameEn: 'Geordy.ai',
    description:
      'A GEO-focused automated JSON-LD platform with llms.txt generation that helps sites quickly adapt to AI engines and improve visibility via structured-data markup.',
    url: 'https://geordy.ai',
    tags: ['AEO', 'JSON-LD', 'llms.txt', 'GEO', 'Automation', 'Structured Data'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Contact for Pricing',
    highlights: ['Automated JSON-LD for GEO/AEO', 'Supports llms.txt generation', 'Quick AI-engine adaptation'],
  },
  {
    id: 'schema-app',
    name: 'Schema App',
    nameEn: 'Schema App',
    description:
      'An enterprise Schema.org management platform supporting complex knowledge-graph building, deployment and tracking to manage structured-data markup site-wide.',
    url: 'https://schemaapp.com',
    tags: ['AEO', 'Schema.org', 'Knowledge Graph', 'Enterprise', 'Structured Data Management', 'Performance Tracking'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Enterprise Pricing',
    highlights: [
      'Enterprise Schema management, complex graphs',
      'Schema deployment + tracking',
      'Manage structured data site-wide',
    ],
  },
  {
    id: 'google-rich-results-test',
    name: 'Google Rich Results Test',
    nameEn: 'Google Rich Results Test',
    description:
      'The official free Schema validator that checks FAQ, HowTo, Article and Product markup to ensure structured data meets Google rich-results and AI Overviews requirements.',
    url: 'https://search.google.com/test/rich-results',
    tags: ['AEO', 'Schema Validation', 'FAQ', 'HowTo', 'Free', 'Google Official', 'AI Overviews'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'Free',
    highlights: [
      'Google-official, authoritative Schema validation',
      'Supports all Schema types (FAQ, HowTo, Article…)',
      'Directly affects AI Overviews rich display',
    ],
    featured: true,
  },
  {
    id: 'schema-markup-generator',
    name: 'Schema Markup Generator',
    nameEn: 'Schema Markup Generator',
    description:
      'An online Schema code generator — no coding needed; fill a form to produce Schema.org-compliant JSON-LD for common types like FAQ, Article, Organization and Product.',
    url: 'https://technicalseo.com/tools/schema-markup-generator',
    tags: ['AEO', 'JSON-LD', 'Schema Generation', 'Free', 'Online Tool', 'No Coding'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'Free',
    highlights: [
      'No coding — fill a form to get JSON-LD',
      'Supports FAQ, Article, Organization and more',
      'Completely free, AEO essential',
    ],
  },
  {
    id: 'rank-math',
    name: 'Rank Math',
    nameEn: 'Rank Math',
    description:
      'A WordPress AEO plugin that auto-generates FAQ, HowTo and Article Schema with AI Overviews optimization — a powerful free tier makes it a top pick for WordPress AEO.',
    url: 'https://rankmath.com',
    tags: ['AEO', 'WordPress', 'FAQ Schema', 'HowTo Schema', 'Plugin', 'AI Overviews'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Free / Paid',
    highlights: ['Top WordPress AEO plugin', 'Auto-generates FAQ, HowTo, Article Schema', 'Powerful Free Tier'],
    featured: true,
  },
  {
    id: 'yoast-seo',
    name: 'Yoast SEO',
    nameEn: 'Yoast SEO',
    description:
      'The most popular WordPress SEO plugin, with built-in Schema that adds Article, BreadcrumbList and Organization data automatically — a classic AEO infrastructure tool.',
    url: 'https://yoast.com',
    tags: ['AEO', 'WordPress', 'Schema', 'SEO', 'Classic Plugin', 'Most Popular Globally'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'Free / Paid',
    highlights: ['Most popular WordPress SEO plugin', 'Built-in Schema support, AEO infrastructure', 'Free tier includes core Schema features'],
  },
  {
    id: 'aeo-js-npm',
    name: 'aeo.js',
    nameEn: 'aeo.js',
    description:
      'An AEO npm package for modern web frameworks that one-click generates llms.txt, robots.txt, sitemaps and JSON-LD, supporting Next.js, Nuxt, Astro and Vite for fast AI-crawler compliance.',
    url: 'https://github.com/multivmlabs/aeo.js',
    tags: ['npm', 'TypeScript', 'llms.txt', 'JSON-LD', 'Next.js', 'Nuxt', 'Astro', 'Vite'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      '⭐ 76 Stars, most popular AEO npm package',
      'Supports Next.js / Nuxt / Astro / Vite',
      'One-click llms.txt + JSON-LD + sitemap',
    ],
    github: {
      repo: 'multivmlabs/aeo.js',
      stars: 76,
      forks: 10,
      language: 'TypeScript',
      topics: ['aeo', 'ai-search', 'answer-engine-optimization', 'llms-txt', 'nextjs', 'nuxt'],
      license: null,
      createdAt: '2026-02-20',
      updatedAt: '2026-05-06',
    },
    featured: true,
  },
  {
    id: 'aeo-schema-skill',
    name: 'AEO Schema Skill',
    nameEn: 'AEO Schema Skill',
    description:
      'A Claude-focused Schema.org JSON-LD markup skill covering Google rich results and AEO answer-engine optimization, including entity graphs, Speakable and sameAs strategy, for Claude.ai, Claude Code and Cursor.',
    url: 'https://github.com/yulia-glukhova/aeo-schema-skill',
    tags: ['JSON-LD', 'Schema.org', 'Claude', 'Speakable', 'Entity Graph', 'sameAs', 'Open Source'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      'Schema markup skill for AI coding environments',
      'Covers Speakable and entity-graph strategy',
      'Works with Claude.ai / Claude Code / Cursor',
    ],
    github: {
      repo: 'yulia-glukhova/aeo-schema-skill',
      stars: 2,
      forks: 0,
      language: null,
      topics: ['aeo', 'schema-org', 'json-ld', 'claude', 'structured-data', 'speakable'],
      license: null,
      createdAt: '2026-03-12',
      updatedAt: '2026-04-25',
    },
  },
]

// ══════════════════════════════════════════════════════════
// 六、国内 AEO / GEO 平台（覆盖国内 AI 引擎）
// ══════════════════════════════════════════════════════════
const aeoChinaTools: AeoTool[] = [
  {
    id: 'aidso',
    name: 'AIDSO',
    nameEn: 'AIDSO',
    description:
      'A DSO + GEO + AEO dual-engine monitor with deep coverage of Chinese platforms like DeepSeek, Doubao and Xiaohongshu plus global engines — a leading China AEO/GEO platform.',
    url: 'https://geo.aidso.com',
    tags: ['AEO', 'GEO', 'DSO', 'DeepSeek', 'Doubao', 'Xiaohongshu', 'China Platforms'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    highlights: ['DSO + GEO + AEO monitoring', 'Covers DeepSeek / Doubao / Xiaohongshu', 'Leading China AEO/GEO platform'],
    featured: true,
  },
  {
    id: 'timus-geo',
    name: 'Lens GEO',
    nameEn: 'Timus GEO',
    description:
      'A free China GEO/AEO monitor offering rank tracking on domestic AI platforms — start tracking visibility on Doubao, Kimi and DeepSeek at no cost; a top pick for beginners.',
    url: 'https://geo.timus.cn',
    tags: ['AEO', 'GEO', 'Free', 'China AI Platforms', 'Doubao', 'Kimi', 'DeepSeek'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: 'Free',
    highlights: ['🆓 Free — top China AEO/GEO starter', 'China AI rank monitoring', 'Free Quick Start'],
    featured: true,
  },
  {
    id: 'impetaai',
    name: 'ImpetaAI',
    nameEn: 'ImpetaAI',
    description:
      'A China AI-visibility monitor with 50+ metrics across major domestic engines (Doubao, DeepSeek, Yuanbao, Kimi, Tongyi Qianwen) and comprehensive AEO diagnostics and recommendations.',
    url: 'https://impetaai.hcr.com.cn',
    tags: ['AEO', 'GEO', '50+ Metrics', 'Doubao', 'DeepSeek', 'Yuanbao', 'Kimi', 'Tongyi Qianwen'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    highlights: [
      '50+ metrics, most complete China AEO diagnosis',
      'Covers Doubao/DeepSeek/Yuanbao/Kimi/Qianwen',
      'Systematic AEO recommendations',
    ],
  },
  {
    id: 'pallasai',
    name: 'PallasAI',
    nameEn: 'PallasAI',
    description:
      'A B2B-focused AEO agent platform founded by Ant Group LLM architects, deeply fusing AI Agent tech with AEO to help B2B firms reach the right customers in the AI search era.',
    url: 'https://pallasai.net',
    tags: ['AEO', 'B2B', 'AI Agent', 'Ant Group', 'Architect-Founded', 'Precision Marketing'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    highlights: ['Founded by Ant Group LLM architects', 'B2B AEO agent for precise outreach', 'Deep AI Agent + AEO integration'],
  },
  {
    id: 'csygeo',
    name: 'CSYGEO',
    nameEn: 'CSYGEO',
    description:
      'A full GEO + AEO platform monitoring 85+ Chinese and global AI platforms, with a professional AEO whitepaper and playbook — one of the deepest AEO methodology platforms, plus content optimization and visibility services.',
    url: 'https://csygeo.cn',
    tags: ['AEO', 'GEO', '85+ AI Platforms', 'AEO Whitepaper', 'China & Global Coverage', 'Content Optimization'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    highlights: ['Monitors 85+ AI platforms, widest coverage', 'Includes a thorough AEO whitepaper', 'GEO + AEO dual engine'],
  },
  {
    id: 'sheepgeo',
    name: 'SheepGeo',
    nameEn: 'SheepGeo',
    description:
      'A GEO/AEO monitor using SHEEP 5-dimension scoring across 9 major AI models, with a free basic tier for SMBs to gauge their presence in Chinese AI engines.',
    url: 'https://sheepgeo.com',
    tags: ['AEO', 'GEO', 'SHEEP 5-D Scoring', '9 AI Models', 'Free Tier', 'SMBs'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    highlights: ['SHEEP 5-D scoring for AEO readiness', 'Covers 9 major AI models', 'Free tier, SMB-friendly'],
  },
  {
    id: 'geokeji',
    name: 'Yishan Tech',
    nameEn: 'GeoKeji',
    description:
      'The most technically capable China GEO/AEO provider, with 7 proprietary systems and end-to-end diagnose-optimize-monitor service including AI content restructuring, entity graphs and Schema markup.',
    url: 'https://geokeji.com',
    tags: ['AEO', 'GEO', '7 Proprietary Systems', 'End-to-End Service', 'Entity Graph', 'Schema Markup'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: 'Custom Pricing',
    highlights: [
      '7 proprietary systems, deepest tech',
      'GEO/AEO diagnose + optimize + monitor',
      'AI content restructuring + entity graph + Schema',
    ],
    featured: true,
  },
  {
    id: 'suproai',
    name: 'Supro AI',
    nameEn: 'SuproAI',
    description:
      'A platform offering an AI-visibility site radar and an AI site builder, helping businesses quickly build AI-engine-friendly sites with ongoing AEO monitoring — ideal for establishing AI presence from scratch.',
    url: 'https://suproai.com',
    tags: ['AEO', 'GEO', 'Site Radar', 'AI Site Builder', 'End-to-end', 'New-Site Optimization'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    highlights: ['Site Radar + AI site builder', 'Helps new sites establish AI presence', 'For AEO from scratch'],
  },
]

// ══════════════════════════════════════════════════════════
// 汇总分类
// ══════════════════════════════════════════════════════════
export const aeoCategories: AeoCategory[] = [
  {
    id: 'aeo-saas',
    name: 'AEO-Focused SaaS',
    icon: 'track_changes',
    color: '#EC4899',
    description:
      'A monitoring and optimization platform built for AEO — brand visibility tracking, prompt analysis and competitor comparison. Includes funded stars (Profound, AthenaHQ) and open-source alternatives (GetCito, Elmo).',
    badge: '🥇 Core',
    tools: aeoSaasTools,
  },
  {
    id: 'aeo-enterprise',
    name: 'Enterprise SEO + AEO module',
    icon: 'business',
    color: '#6366F1',
    description:
      'Built-in AEO modules from enterprise SEO platforms like Semrush, Ahrefs and BrightEdge — a smooth way for teams with existing SEO stacks to extend into AEO without replacing tools.',
    badge: '🔧 Enterprise',
    tools: aeoEnterpriseTools,
  },
  {
    id: 'aeo-content',
    name: 'Content Optimizer',
    icon: 'article',
    color: '#10B981',
    description:
      'Content-structuring tools like Frase, Surfer SEO and MarketMuse that help create answer-friendly content AI engines proactively cite. Includes an open-source AI writing agent (⭐205).',
    badge: '📝 Content',
    tools: aeoContentTools,
  },
  {
    id: 'aeo-research',
    name: 'Question Research Tools',
    icon: 'help_outline',
    color: '#F59E0B',
    description:
      'AEO keyword-discovery tools like AlsoAsked, AnswerThePublic and QuestionDB that mine real user questions to support AEO content and FAQ optimization.',
    badge: '❓ Research',
    tools: aeoResearchTools,
  },
  {
    id: 'aeo-schema',
    name: 'Structured Data Tools',
    icon: 'account_tree',
    color: '#0EA5E9',
    description:
      'Schema generation, validation and management tools including Rank Math, Yoast SEO and aeo.js, helping sites add JSON-LD, llms.txt and Speakable to improve AI-engine recognition.',
    badge: '🗂️ Schema',
    tools: aeoSchemaTools,
  },
  {
    id: 'aeo-china',
    name: 'China AEO/GEO Platforms',
    icon: 'language',
    color: '#EF4444',
    description:
      'An AEO/GEO platform built for the China market, covering major domestic AI engines (Doubao, DeepSeek, Kimi, Tongyi Qianwen, Yuanbao) with brands like AIDSO, Lens GEO and Yishan Tech.',
    badge: '🇨🇳 China',
    tools: aeoChinaTools,
  },
]

export const allAeoTools: AeoTool[] = aeoCategories.flatMap((c) => c.tools)

export const featuredAeoTools: AeoTool[] = allAeoTools.filter((t) => t.featured)
