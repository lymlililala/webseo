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
      'Antler 投资的端到端 AEO 平台，以 AEO Playbook 驱动全流程优化，JAPAC 市场覆盖强，帮助品牌在 AI 引擎答案中系统化建立可见度。',
    url: 'https://heyamos.com',
    tags: ['AEO', 'Antler融资', 'JAPAC', 'AEO Playbook', '端到端', '品牌监测'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '联系报价',
    highlights: ['Antler 融资背书，专注 AEO 端到端方案', 'AEO Playbook 驱动全流程', 'JAPAC 市场覆盖强'],
    featured: true,
  },
  {
    id: 'profound',
    name: 'Profound',
    nameEn: 'Profound',
    description:
      'Sequoia 5500 万美金融资的企业级 AEO 平台，SOC2+HIPAA 合规，支持 AI Agent 分析，帮助 Fortune 500 企业追踪并优化品牌在 AI 搜索中的表现。',
    url: 'https://tryprofound.com',
    tags: ['AEO', 'Sequoia融资', 'SOC2', 'HIPAA', '企业级', 'Agent分析'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '$99/mo 起',
    highlights: [
      'Sequoia $55M 融资，行业领导者',
      'SOC2 + HIPAA 合规，企业安全级别',
      'AI Agent 分析，深度洞察 AI 搜索可见度',
    ],
    featured: true,
  },
  {
    id: 'athenahq',
    name: 'AthenaHQ',
    nameEn: 'AthenaHQ',
    description:
      'YC 背书的 GEO/AEO 综合平台，内置 AI Copilot 自动推荐优化策略，独创 QVEM 查询量估算模型，帮助品牌量化 AI 搜索可见度增长机会。',
    url: 'https://athenahq.ai',
    tags: ['AEO', 'GEO', 'YC', 'AI Copilot', 'QVEM', '查询量估算'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '$295/mo 起',
    highlights: ['YC 背书，顶级投资人认可', 'AI Copilot 自动推荐优化策略', '独创 QVEM 查询量估算，量化增长机会'],
    featured: true,
  },
  {
    id: 'otterly-ai',
    name: 'Otterly.AI',
    nameEn: 'Otterly.AI',
    description:
      'AEO 监测入门首选，每日追踪 15+ Prompt，覆盖 ChatGPT、Perplexity、Gemini 等主流 AI 引擎，15000+ 用户使用，性价比最高的 AEO 入门工具。',
    url: 'https://otterly.ai',
    tags: ['AEO', '监测入门', '每日追踪', '15000+用户', '性价比', 'ChatGPT'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '$29/mo 起',
    highlights: ['15000+ 用户，AEO 入门最受欢迎', '每日追踪 15+ Prompt，覆盖主流 AI 引擎', '$29/mo 起，性价比最高'],
    featured: true,
  },
  {
    id: 'peec-ai',
    name: 'Peec AI',
    nameEn: 'Peec AI',
    description:
      '专为代理商设计的品牌 AI 可见度监测工具，数据呈现简洁清晰，支持多客户账号管理，适合数字营销代理商追踪客户品牌在 AI 引擎中的表现。',
    url: 'https://peec.ai',
    tags: ['AEO', '代理商', '品牌监测', '多账号', '数据可视化'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    pricing: '€89/mo 起',
    highlights: ['专为代理商设计，多客户账号管理', '数据呈现简洁，汇报客户一目了然', '欧洲合规，GDPR 友好'],
  },
  {
    id: 'goodie-ai',
    name: 'Goodie AI',
    nameEn: 'Goodie AI',
    description:
      '专注 AEO 与 AI 购物可见度的综合平台，追踪品牌在 ChatGPT、Amazon Rufus、Perplexity Shopping 等 AI 购物引擎中的推荐表现，适合电商品牌。',
    url: 'https://higoodie.com',
    tags: ['AEO', 'AI购物', 'Amazon Rufus', 'ChatGPT Shopping', 'Perplexity', '电商'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '~$199/mo',
    highlights: ['覆盖 AI 购物引擎（Amazon Rufus）', '追踪 ChatGPT / Perplexity 购物可见度', '电商品牌 AEO 专属功能'],
  },
  {
    id: 'evertune',
    name: 'Evertune',
    nameEn: 'Evertune',
    description:
      '服务 Fortune 500 的企业级 AEO 平台，每月处理 100 万+ Prompt，具有统计置信度分析，提供最精准的 AI 搜索可见度数据，适合超大型企业。',
    url: 'https://evertune.ai',
    tags: ['AEO', 'Fortune500', '企业级', '100万Prompt', '统计置信度'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '~$3000/mo',
    highlights: [
      '每月处理 100 万+ Prompt，数据最全面',
      '统计置信度分析，结果最可靠',
      'Fortune 500 专属，超大型企业首选',
    ],
  },
  {
    id: 'omnibound',
    name: 'Omnibound AI',
    nameEn: 'Omnibound AI',
    description:
      'B2B 内容 AEO 专项平台，以买家对话驱动内容策略，支持批量内容刷新和 AI 引擎优化，帮助 B2B 企业提升在采购决策场景下的 AI 可见度。',
    url: 'https://omnibound.ai',
    tags: ['AEO', 'B2B', '内容策略', '买家对话', '批量刷新'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '定制报价',
    highlights: ['B2B 场景专属，以买家对话驱动内容', '批量内容刷新，大规模优化效率高', '专注采购决策场景的 AI 可见度'],
  },
  {
    id: 'aiclicks',
    name: 'AIclicks',
    nameEn: 'AIclicks',
    description:
      '中市场 AEO 综合工具，支持 Prompt 聚类映射、GEO 审计和多语言追踪，帮助中小企业以低成本进行全面的 AI 搜索优化。',
    url: 'https://aiclicks.io',
    tags: ['AEO', 'GEO审计', 'Prompt聚类', '多语言', '中市场'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '$39-79/mo',
    highlights: ['Prompt 聚类映射，智能分析 AI 搜索意图', 'GEO 审计 + AEO 监测一体化', '多语言支持，全球市场覆盖'],
  },
  {
    id: 'rankscale',
    name: 'Rankscale',
    nameEn: 'Rankscale',
    description:
      '积分制灵活 AI 可见度追踪工具，高精度监测品牌在多个 AI 引擎中的深度排名表现，按需购买积分，适合预算有限但追求高精度数据的团队。',
    url: 'https://rankscale.io',
    tags: ['AEO', '积分制', '高精度', 'AI可见度', '灵活计费'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '~$20/mo 起',
    highlights: ['积分制灵活计费，按需使用', '高精度 AI 可见度深度追踪', '适合预算有限团队'],
  },
  // ── 开源 AEO 监测（来自 GitHub）──────────────────────────────
  {
    id: 'getcito',
    name: 'GetCito',
    nameEn: 'GetCito',
    description:
      '全球首个开源 AIO/AEO/GEO 一体化优化平台，追踪品牌在 ChatGPT、Claude、Perplexity、Google AI Overviews 等 AI 引擎中的曝光，提供可操作的优化建议，支持自托管或云端 SaaS 使用。',
    url: 'https://getcito.com/dashboard',
    tags: ['AEO', 'GEO', 'AIO', '开源', 'Next.js', 'TypeScript', '自托管'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: true,
    highlights: [
      '⭐ 107 Stars，GitHub 最高星 AEO 项目',
      '支持 ChatGPT / Perplexity / Claude / Google AIO 全覆盖',
      '开源可自托管，提供 SaaS 云端版本',
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
      '开源 AI 可见度追踪平台，实时监控品牌在 ChatGPT、Perplexity、Gemini、Grok、Copilot 等主流 AI 引擎中的曝光情况，提供 AEO/GEO/AIO/LLMO 多维度分析报告，BYOK 设计，数据隐私友好。',
    url: 'https://www.elmohq.com',
    tags: ['AEO', 'AIO', 'LLMO', 'GEO', '开源', 'BYOK', 'Grok', 'Copilot'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      '⭐ 101 Stars，覆盖最广的开源 AI 可见度工具',
      '一站式追踪 ChatGPT / Grok / Copilot / Gemini / Perplexity',
      'TypeScript 技术栈，易于二次开发',
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
      '开源 AI 可见度监控与分析平台，BYOK 设计，可自托管部署，追踪品牌在 ChatGPT、Perplexity、Google AI Overviews 等 LLM 中的出现频率与语境，是 Profound 和 Peec AI 的免费开源替代品。',
    url: 'https://github.com/anyin-ai/aperture',
    tags: ['AEO', 'BYOK', '自托管', '开源', '品牌监测', 'TypeScript', 'LLM监控'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      'BYOK 设计，完全掌控数据隐私',
      'Profound / Peec AI 免费开源替代品',
      '支持 ChatGPT + Perplexity + Google AIO',
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
      '开源 AEO 品牌可见度监控工具，实时追踪品牌在 ChatGPT、Perplexity、Gemini 等 AI 搜索引擎中的提及情况，提供可视化 Dashboard 和告警功能，帮助市场团队快速响应 AI 搜索动态。',
    url: 'https://github.com/hellowalt/aeo-radar',
    tags: ['AEO', '开源', '品牌监测', 'Dashboard', '告警', 'Python'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: ['实时告警，品牌提及率异动即时通知', '可视化 Dashboard，品牌趋势一目了然', '完全开源，支持本地自托管'],
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
      'Agent-first 的 AEO 监测与运营平台（AINYC 出品），专为 AI 搜索时代设计，帮助品牌在 AI 引擎答案中持续保持可见性，提供自动化监控、竞品对比和内容优化建议。',
    url: 'https://github.com/AINYC/canonry',
    tags: ['AEO', 'Agent-first', '品牌监测', '竞品对比', 'TypeScript', '开源'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: true,
    hasApi: true,
    highlights: [
      'Agent-first 架构，自动化监控流程',
      '专注 AEO 品牌可见度运营',
      'AINYC 团队同时维护 aeo-audit 审计工具',
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
      '企业级 SEO + AEO 一体化平台，提供实时 LLM 查询分析、AI 写作助手和 24/7 AI 可见度监控，帮助大型企业系统化整合传统 SEO 与 AEO 优化策略。',
    url: 'https://conductor.com',
    tags: ['AEO', 'SEO', '企业级', 'LLM查询', 'AI写作', '24/7监控'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '企业定价',
    highlights: ['企业级 AEO + SEO 一体化', '实时 LLM 查询分析 + AI 写作助手', '24/7 AI 可见度监控'],
    featured: true,
  },
  {
    id: 'semrush-ai-visibility',
    name: 'Semrush AI Visibility',
    nameEn: 'Semrush AI Visibility',
    description:
      'Semrush 旗下 AI 可见度追踪模块，支持 AI Overviews 追踪、竞争对手基准对比和时期对比分析，与 Semrush 强大的 SEO 数据体系深度联动。',
    url: 'https://www.semrush.com',
    tags: ['AEO', 'AI Overviews', '竞争对手', 'Semrush', 'SEO联动', '基准对比'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '含 Semrush 套餐',
    highlights: [
      '与 Semrush 强大 SEO 数据体系深度联动',
      'AI Overviews 追踪 + 竞争对手基准',
      '时期对比分析，量化 AEO 改善效果',
    ],
  },
  {
    id: 'ahrefs-brand-radar',
    name: 'Ahrefs Brand Radar',
    nameEn: 'Ahrefs Brand Radar',
    description:
      'Ahrefs 的 AI 品牌追踪模块，覆盖 ChatGPT、Perplexity、Gemini、Copilot、Claude、Grok 六大 AI 引擎，与 Ahrefs 海量 SEO 数据无缝联动，品牌可见度分析最全面。',
    url: 'https://ahrefs.com/brand-radar',
    tags: ['AEO', 'Ahrefs', '6大AI引擎', '品牌追踪', 'SEO联动'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '~$199/mo 附加',
    highlights: ['覆盖 6 大 AI 引擎品牌追踪', '与 Ahrefs 海量 SEO 数据联动', '品牌可见度分析最全面'],
  },
  {
    id: 'se-ranking',
    name: 'SE Ranking',
    nameEn: 'SE Ranking',
    description:
      '内置生成引擎追踪（GEO/AEO）模块的 SEO 平台，支持代理商多客户管理，追踪品牌在主流 AI 搜索引擎中的可见度变化，性价比高适合中小代理商。',
    url: 'https://seranking.com',
    tags: ['AEO', 'GEO', '代理商', '生成引擎追踪', 'SEO工具', '多客户'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '~$55/mo 起',
    highlights: ['内置生成引擎追踪模块，SEO + AEO 一体', '适合代理商多客户管理', '性价比高，中小代理商首选'],
  },
  {
    id: 'brightedge',
    name: 'BrightEdge',
    nameEn: 'BrightEdge',
    description:
      '企业 AI 内容与 AEO 整合平台，系统化实现 AEO 与内容策略融合，提供大规模 AI 搜索可见度监控和内容优化建议，服务全球顶级企业。',
    url: 'https://brightedge.com',
    tags: ['AEO', 'SEO', '企业级', 'AI内容', '大规模监控'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '企业定价',
    highlights: ['系统化 AEO + 内容策略融合', '大规模 AI 搜索可见度监控', '服务全球顶级企业'],
  },
  {
    id: 'seoclarity',
    name: 'seoClarity',
    nameEn: 'seoClarity',
    description:
      '集成 AI 智能的企业 SEO + AEO 平台，支持企业规模化 AEO 实施，提供内容优化、AI 搜索可见度分析和自动化工作流，适合大型内容团队。',
    url: 'https://seoclarity.net',
    tags: ['AEO', 'SEO', '企业级', 'AI智能', '自动化工作流', '内容优化'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '企业定价',
    highlights: ['AI 智能集成，企业规模化 AEO', '内容优化 + AI 搜索可见度一体', '自动化工作流，大型团队高效执行'],
  },
  {
    id: 'authoritas',
    name: 'Authoritas',
    nameEn: 'Authoritas',
    description:
      '企业 SEO 平台内含 AI 品牌监测模块，追踪品牌在 AI 生成内容中的表现，结合传统 SEO 数据提供全方位的搜索可见度分析和优化建议。',
    url: 'https://authoritas.com',
    tags: ['AEO', 'SEO', '品牌监测', 'AI生成内容', '企业级'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '按需定价',
    highlights: ['AI 品牌监测 + 传统 SEO 全方位分析', '追踪 AI 生成内容中的品牌表现', '企业级可靠性，按需灵活定价'],
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
      'AI 内容摘要与答案优化平台，专为 AEO 内容导向设计，支持 FAQ 生成、内容结构化和 AI 搜索就绪评分，帮助内容团队快速生成被 AI 引擎引用的答案友好型内容。',
    url: 'https://frase.io',
    tags: ['AEO', '内容优化', 'FAQ生成', 'AI摘要', '答案优化', '内容结构化'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '$14.99/mo 起',
    highlights: [
      'AI 内容摘要 + FAQ 生成，AEO 内容导向',
      '内容结构化评分，量化 AI 就绪度',
      '$14.99/mo 起，内容团队性价比首选',
    ],
    featured: true,
  },
  {
    id: 'surfer-seo',
    name: 'Surfer SEO',
    nameEn: 'Surfer SEO',
    description:
      '内容评分与 AI 结构优化平台，提供语义相关词分析、内容覆盖度评分和 LLM 优化策略，帮助内容团队创作既能排名 Google 又能被 AI 引用的高质量内容。',
    url: 'https://surferseo.com',
    tags: ['AEO', '内容评分', 'LLM优化', '语义分析', 'AI结构', 'SEO'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '$89/mo 起',
    highlights: [
      '内容评分 + AI 结构建议双引擎',
      'LLM 优化策略，兼顾 Google + AI 引用',
      '语义相关词分析，内容覆盖度最优化',
    ],
  },
  {
    id: 'clearscope',
    name: 'Clearscope',
    nameEn: 'Clearscope',
    description:
      '语义相关词分析与内容覆盖度评分工具，帮助内容团队创作语义完整、主题权威的内容，提高在传统搜索和 AI 搜索中同时获得引用的概率。',
    url: 'https://clearscope.io',
    tags: ['AEO', '语义分析', '内容覆盖度', '主题权威', '内容质量'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '$189/mo 起',
    highlights: ['语义相关词分析，内容覆盖度评分', '主题权威建立，提升 AI 引用概率', '内容质量量化，指导团队优先方向'],
  },
  {
    id: 'marketmuse',
    name: 'MarketMuse',
    nameEn: 'MarketMuse',
    description:
      'AI 驱动的主题权威建立与内容差距分析平台，帮助品牌系统化覆盖核心话题，建立内容护城河，提升在 AI 引擎和传统搜索引擎中的权威度。',
    url: 'https://marketmuse.com',
    tags: ['AEO', '主题权威', '内容差距', 'AI驱动', '内容护城河'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '$149/mo 起',
    highlights: ['主题权威建立 + 内容差距分析', 'AI 驱动内容策略，覆盖核心话题', '内容护城河建设，提升长期竞争优势'],
  },
  {
    id: 'neuronwriter',
    name: 'NeuronWriter',
    nameEn: 'NeuronWriter',
    description:
      '基于 NLP 的内容优化工具，适合欧洲市场，支持多语言内容评分和 AI 搜索优化建议，性价比高，是欧洲企业进行 AEO 内容优化的热门选择。',
    url: 'https://neuronwriter.com',
    tags: ['AEO', 'NLP', '多语言', '欧洲市场', '内容评分', '性价比'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    pricing: '$23/mo 起',
    highlights: ['NLP 内容优化，欧洲市场热门', '多语言支持，覆盖欧洲多国市场', '$23/mo 起，性价比高'],
  },
  {
    id: 'inlinks',
    name: 'InLinks',
    nameEn: 'InLinks',
    description:
      '实体优化与内部链接自动化工具，通过构建知识图谱和实体关联帮助网站建立 AI 搜索权威度，与 Schema 结构化数据深度整合，提升 AI 引擎对品牌的实体识别。',
    url: 'https://inlinks.com',
    tags: ['AEO', '实体优化', '内部链接', '知识图谱', 'Schema', 'AI权威度'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '$49/mo 起',
    highlights: ['实体优化 + 内部链接自动化', '知识图谱构建，AI 搜索权威建立', '与 Schema 结构化数据深度整合'],
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    nameEn: 'Writesonic',
    description:
      'AI 内容生成平台，支持 GEO + SEO + AEO 友好的内容结构，自动生成语义完整、适合 AI 引用的文章、FAQ 和落地页内容，适合内容量大的团队。',
    url: 'https://writesonic.com',
    tags: ['AEO', 'GEO', 'SEO', 'AI内容生成', 'FAQ', '落地页'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '$19/mo 起',
    highlights: ['GEO + SEO + AEO 友好内容生成', 'FAQ 和落地页一键生成', '语义完整，适合 AI 引用的内容结构'],
  },
  {
    id: 'seobuild-onpage',
    name: 'SEOBuild Onpage',
    nameEn: 'SEOBuild Onpage',
    description:
      'AI Agent 驱动的页面 SEO + AEO 写作工具（⭐ 205 Stars），输入一条命令即可生成 Google 排名 + LLM 引用双目标优化的落地页，内置 500-token 分块架构、实体共识和验证标签，集成 GSC、DataforSEO。',
    url: 'https://github.com/gbessoni/seobuild-onpage',
    tags: ['SEO+AEO', 'AI写作', 'Claude Code', 'DataforSEO', 'GSC', '落地页', 'Python'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: true,
    highlights: [
      '⭐ 205 Stars，SEO + AEO 双目标 AI 写作 Agent',
      '500-token 分块 + 实体共识架构，内容质量高',
      '集成 Google Search Console + DataforSEO 数据',
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
      '可视化 PAA（People Also Ask）问题树工具，帮助挖掘 Google 搜索中的语义问题网络，发现用户真实提问意图，为 AEO 内容创作和 FAQ 优化提供数据支撑。',
    url: 'https://alsoasked.com',
    tags: ['AEO', 'PAA', '问题研究', '语义网络', 'FAQ挖掘', '关键词发现'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '$15/mo 起',
    highlights: ['可视化 PAA 问题树，挖掘语义问题网络', 'AEO FAQ 内容创作核心工具', '发现用户真实提问意图'],
    featured: true,
  },
  {
    id: 'answerthepublic',
    name: 'AnswerThePublic',
    nameEn: 'AnswerThePublic',
    description:
      '经典 5W1H 长尾问题聚合工具，通过搜索联想词自动生成关于某话题的 Who/What/When/Where/Why/How 问题集，是 AEO 问题研究的必备入门工具。',
    url: 'https://answerthepublic.com',
    tags: ['AEO', '5W1H', '长尾问题', '问题聚合', '关键词研究', '经典工具'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '$5/mo 起',
    highlights: ['经典 5W1H 问题聚合，AEO 入门必备', '自动生成 Who/What/When/Why/How 问题集', '$5/mo 起，价格最亲民'],
    featured: true,
  },
  {
    id: 'google-paa',
    name: 'Google PAA（免费）',
    nameEn: 'Google People Also Ask',
    description:
      '直接从 Google 搜索结果中挖掘"People Also Ask"答案框机会，免费且实时，通过手动扩展 PAA 块可发现大量 AEO 内容机会，是最直接的竞争洞察来源。',
    url: 'https://google.com',
    tags: ['AEO', 'PAA', '免费', '答案框', 'Google', '竞争洞察'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '免费',
    highlights: [
      '完全免费，直接挖掘 Google 答案框机会',
      '实时反映 Google AI Overviews 趋势',
      'PAA 问题即 AEO 优化目标',
    ],
  },
  {
    id: 'explodingtopics',
    name: 'Exploding Topics',
    nameEn: 'Exploding Topics',
    description:
      '发现爆发式增长的问题话题和行业趋势，提前布局 AI 搜索热点，帮助品牌在 AEO 内容创作上抢占先机，覆盖科技、商业、健康等多个垂直领域。',
    url: 'https://explodingtopics.com',
    tags: ['AEO', '趋势发现', '爆发话题', '提前布局', '内容选题'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '$39/mo 起',
    highlights: ['发现爆发式增长话题，抢占 AEO 先机', '提前布局 AI 搜索热点内容', '覆盖科技、商业、健康等垂直领域'],
  },
  {
    id: 'questiondb',
    name: 'QuestionDB',
    nameEn: 'QuestionDB',
    description:
      '基于 Reddit 真实问题的长尾词库工具，收集来自真实用户的问题讨论，帮助 AEO 内容团队发现在 Reddit、Quora 等社区中被频繁讨论的问题类型。',
    url: 'https://questiondb.io',
    tags: ['AEO', 'Reddit', '长尾词库', '社区问题', '用户真实提问'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '免费/付费',
    highlights: ['基于 Reddit 真实用户问题', '发现社区高频讨论问题', '免费额度可满足基本研究需求'],
  },
  {
    id: 'keyword-tool',
    name: 'Keyword Tool',
    nameEn: 'Keyword Tool',
    description:
      '多平台搜索联想词工具，覆盖 Google、Bing、YouTube、Amazon、Reddit 等平台的问题词和长尾词，为 AEO 内容优化提供多渠道问题研究支持。',
    url: 'https://keywordtool.io',
    tags: ['AEO', '多平台', '搜索联想词', '问题词', 'Google', 'YouTube', 'Amazon'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '$69/mo 起',
    highlights: [
      '多平台联想词（Google+Bing+YouTube+Amazon）',
      '问题词挖掘，AEO 内容选题全面',
      'API 支持，可集成到内容工作流',
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
      'GEO 专用自动化 JSON-LD 生成平台，支持 llms.txt 文件生成，帮助网站快速完成 AI 引擎适配改造，通过结构化数据标记提升在 AI 搜索中的可见度。',
    url: 'https://geordy.ai',
    tags: ['AEO', 'JSON-LD', 'llms.txt', 'GEO', '自动化', '结构化数据'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '联系报价',
    highlights: ['自动化 JSON-LD 生成，GEO/AEO 专用', '支持 llms.txt 文件生成', '快速完成 AI 引擎适配改造'],
  },
  {
    id: 'schema-app',
    name: 'Schema App',
    nameEn: 'Schema App',
    description:
      '企业级 Schema.org 结构化数据管理平台，支持复杂知识图谱构建、Schema 部署和效果追踪，帮助大型企业系统化管理所有页面的结构化数据标记。',
    url: 'https://schemaapp.com',
    tags: ['AEO', 'Schema.org', '知识图谱', '企业级', '结构化数据管理', '效果追踪'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '企业定价',
    highlights: [
      '企业级 Schema 管理，复杂知识图谱支持',
      'Schema 部署 + 效果追踪一体化',
      '系统化管理所有页面结构化数据',
    ],
  },
  {
    id: 'google-rich-results-test',
    name: 'Google 富媒体结果测试',
    nameEn: 'Google Rich Results Test',
    description:
      '官方免费 Schema 验证工具，检测 FAQ、HowTo、Article、Product 等 Schema 标记是否正确，确保结构化数据符合 Google 富媒体结果和 AI Overviews 要求。',
    url: 'https://search.google.com/test/rich-results',
    tags: ['AEO', 'Schema验证', 'FAQ', 'HowTo', '免费', 'Google官方', 'AI Overviews'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '免费',
    highlights: [
      'Google 官方验证，最权威的 Schema 检测',
      '支持 FAQ、HowTo、Article 等全部 Schema 类型',
      '直接影响 AI Overviews 富媒体显示',
    ],
    featured: true,
  },
  {
    id: 'schema-markup-generator',
    name: 'Schema 标记生成器',
    nameEn: 'Schema Markup Generator',
    description:
      '在线 Schema 代码生成工具，无需编程知识，通过表单填写即可生成符合 Schema.org 规范的 JSON-LD 代码，支持 FAQ、Article、Organization、Product 等常用类型。',
    url: 'https://technicalseo.com/tools/schema-markup-generator',
    tags: ['AEO', 'JSON-LD', 'Schema生成', '免费', '在线工具', '无需编程'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '免费',
    highlights: [
      '无需编程，表单填写即生成 JSON-LD',
      '支持 FAQ、Article、Organization 等类型',
      '完全免费，AEO 入门必备工具',
    ],
  },
  {
    id: 'rank-math',
    name: 'Rank Math',
    nameEn: 'Rank Math',
    description:
      'WordPress AEO 优化插件，自动生成 FAQ Schema、HowTo Schema 和 Article Schema，支持 AI Overviews 优化，免费版功能强大，是 WordPress 站点 AEO 改造的首选插件。',
    url: 'https://rankmath.com',
    tags: ['AEO', 'WordPress', 'FAQ Schema', 'HowTo Schema', '插件', 'AI Overviews'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    pricing: '免费/付费',
    highlights: ['WordPress AEO 改造首选插件', '自动生成 FAQ、HowTo、Article Schema', '免费版已足够强大'],
    featured: true,
  },
  {
    id: 'yoast-seo',
    name: 'Yoast SEO',
    nameEn: 'Yoast SEO',
    description:
      '全球最流行的 WordPress SEO 插件，内置 Schema 支持，自动为页面添加 Article、BreadcrumbList 和 Organization 等结构化数据，是 AEO 基础设施建设的经典工具。',
    url: 'https://yoast.com',
    tags: ['AEO', 'WordPress', 'Schema', 'SEO', '经典插件', '全球最流行'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '免费/付费',
    highlights: ['全球最流行 WordPress SEO 插件', '内置 Schema 支持，AEO 基础设施首选', '免费版即包含核心 Schema 功能'],
  },
  {
    id: 'aeo-js-npm',
    name: 'aeo.js',
    nameEn: 'aeo.js',
    description:
      '现代 Web 框架的 AEO npm 包，一键生成 llms.txt、robots.txt、站点地图和 JSON-LD 结构化数据，支持 Next.js、Nuxt、Astro、Vite，让网站快速符合 AI 引擎爬取标准。',
    url: 'https://github.com/multivmlabs/aeo.js',
    tags: ['npm', 'TypeScript', 'llms.txt', 'JSON-LD', 'Next.js', 'Nuxt', 'Astro', 'Vite'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      '⭐ 76 Stars，最受欢迎的 AEO npm 包',
      '支持 Next.js / Nuxt / Astro / Vite 四大框架',
      '一键生成 llms.txt + JSON-LD + sitemap',
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
      'Claude AI 专用的 Schema.org JSON-LD 标记技能，覆盖 Google 富媒体结果 + AEO AI 答案引擎优化，包含实体图谱构建、Speakable 属性、sameAs 策略，适用于 Claude.ai、Claude Code、Cursor 等 AI 编程环境。',
    url: 'https://github.com/yulia-glukhova/aeo-schema-skill',
    tags: ['JSON-LD', 'Schema.org', 'Claude', 'Speakable', '实体图谱', 'sameAs', '开源'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    highlights: [
      '专为 AI 编程环境设计的 Schema 标记技能',
      '涵盖 Speakable 属性和实体图谱策略',
      '适配 Claude.ai / Claude Code / Cursor',
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
    name: 'AIDSO 爱搜',
    nameEn: 'AIDSO',
    description:
      'DSO + GEO + AEO 双引擎监测平台，深度覆盖 DeepSeek、豆包、小红书等国内 AI 平台，同步支持国际 AI 搜索引擎，是国内 AEO/GEO 综合平台代表。',
    url: 'https://geo.aidso.com',
    tags: ['AEO', 'GEO', 'DSO', 'DeepSeek', '豆包', '小红书', '国内平台'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    highlights: ['DSO + GEO + AEO 三合一监测', '覆盖 DeepSeek / 豆包 / 小红书', '国内 AEO/GEO 综合平台代表'],
    featured: true,
  },
  {
    id: 'timus-geo',
    name: '透镜 GEO',
    nameEn: 'Timus GEO',
    description:
      '国内免费 GEO/AEO 监测工具，提供国内 AI 平台排名监测服务，无需费用即可开始追踪品牌在豆包、Kimi、DeepSeek 等平台中的可见度，入门用户首选。',
    url: 'https://geo.timus.cn',
    tags: ['AEO', 'GEO', '免费', '国内AI平台', '豆包', 'Kimi', 'DeepSeek'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    pricing: '免费',
    highlights: ['🆓 完全免费，国内 AEO/GEO 入门首选', '国内主流 AI 平台排名监测', '无需费用快速上手'],
    featured: true,
  },
  {
    id: 'impetaai',
    name: 'ImpetaAI',
    nameEn: 'ImpetaAI',
    description:
      '50+ 维度评估指标的国内 AI 可见度监测平台，覆盖豆包、DeepSeek、元宝、Kimi、通义千问等主流国内 AI 引擎，提供全面的 AEO 诊断报告和优化建议。',
    url: 'https://impetaai.hcr.com.cn',
    tags: ['AEO', 'GEO', '50+指标', '豆包', 'DeepSeek', '元宝', 'Kimi', '通义千问'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    highlights: [
      '50+ 评估维度，国内最全面的 AEO 诊断',
      '覆盖豆包 / DS / 元宝 / Kimi / 千问',
      '提供系统化 AEO 优化建议',
    ],
  },
  {
    id: 'pallasai',
    name: 'PallasAI',
    nameEn: 'PallasAI',
    description:
      '专注 B2B 场景的 AEO Agent 平台，由蚂蚁大模型架构师创立，将 AI Agent 技术与 AEO 优化深度融合，帮助 B2B 企业在 AI 搜索时代获得精准客户触达。',
    url: 'https://pallasai.net',
    tags: ['AEO', 'B2B', 'AI Agent', '蚂蚁', '架构师创业', '精准营销'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    highlights: ['蚂蚁大模型架构师创立，技术底蕴强', '专注 B2B AEO Agent，精准客户触达', 'AI Agent + AEO 深度融合'],
  },
  {
    id: 'csygeo',
    name: '潮树渔（CSYGEO）',
    nameEn: 'CSYGEO',
    description:
      'GEO + AEO 全覆盖平台，监测国内外 85+ AI 平台，提供专业 AEO 白皮书和操作指南，是国内 AEO 方法论研究最深入的平台之一，同时提供 AI 内容优化和品牌可见度提升服务。',
    url: 'https://csygeo.cn',
    tags: ['AEO', 'GEO', '85+AI平台', 'AEO白皮书', '国内外覆盖', '内容优化'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    highlights: ['监测国内外 85+ AI 平台，覆盖最广', '提供专业 AEO 白皮书，方法论完整', 'GEO + AEO 双引擎服务'],
  },
  {
    id: 'sheepgeo',
    name: 'SheepGeo',
    nameEn: 'SheepGeo',
    description:
      '采用 SHEEP 五维评分体系的 GEO/AEO 监测平台，覆盖 9 大主流 AI 模型，提供免费基础版，适合中小企业快速了解品牌在国内 AI 引擎中的表现。',
    url: 'https://sheepgeo.com',
    tags: ['AEO', 'GEO', 'SHEEP五维评分', '9大模型', '免费版', '中小企业'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    highlights: ['SHEEP 五维评分，直观量化 AEO 就绪度', '覆盖 9 大主流 AI 模型', '免费版可用，中小企业友好'],
  },
  {
    id: 'geokeji',
    name: '移山科技',
    nameEn: 'GeoKeji',
    description:
      '技术实力最强的国内 GEO/AEO 服务商，自研 7 套核心系统，提供从诊断、优化到监测的全链路 GEO/AEO 服务，包括 AI 内容重构、实体图谱构建和 Schema 标记等。',
    url: 'https://geokeji.com',
    tags: ['AEO', 'GEO', '7套自研系统', '全链路服务', '实体图谱', 'Schema标记'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    pricing: '定制报价',
    highlights: [
      '7 套自研系统，技术实力最强',
      'GEO/AEO 诊断 + 优化 + 监测全链路',
      'AI 内容重构 + 实体图谱 + Schema 一体化',
    ],
    featured: true,
  },
  {
    id: 'suproai',
    name: '数珀 AI',
    nameEn: 'SuproAI',
    description:
      '提供网站 AI 可见度雷达和 AI 建站工具的综合平台，帮助企业快速搭建 AI 引擎友好的网站，同时提供持续的 AEO 监测服务，适合需要从零开始建立 AI 搜索存在感的企业。',
    url: 'https://suproai.com',
    tags: ['AEO', 'GEO', '网站雷达', 'AI建站', '全流程', '新站优化'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    highlights: ['网站雷达 + AI 建站工具双合一', '帮助新站快速建立 AI 搜索存在感', '适合从零开始的 AEO 建设'],
  },
]

// ══════════════════════════════════════════════════════════
// 汇总分类
// ══════════════════════════════════════════════════════════
export const aeoCategories: AeoCategory[] = [
  {
    id: 'aeo-saas',
    name: 'AEO 专项 SaaS',
    icon: 'track_changes',
    color: '#EC4899',
    description:
      '专为 AEO 打造的监测与优化平台，覆盖品牌可见度追踪、Prompt 分析、竞品对比。既有 Profound/AthenaHQ 等融资明星，也有 GetCito/Elmo 等开源替代品。',
    badge: '🥇 核心',
    tools: aeoSaasTools,
  },
  {
    id: 'aeo-enterprise',
    name: '企业 SEO + AEO 模块',
    icon: 'business',
    color: '#6366F1',
    description:
      'Semrush、Ahrefs、BrightEdge 等企业 SEO 平台内置的 AEO 功能模块，适合已有 SEO 工具链的企业平滑扩展 AEO 能力，无需替换现有系统。',
    badge: '🔧 企业',
    tools: aeoEnterpriseTools,
  },
  {
    id: 'aeo-content',
    name: '内容优化工具',
    icon: 'article',
    color: '#10B981',
    description:
      'Frase、Surfer SEO、MarketMuse 等内容结构化工具，帮助创作被 AI 引擎主动引用的答案友好型内容。包含开源 AI 写作 Agent（⭐205）。',
    badge: '📝 内容',
    tools: aeoContentTools,
  },
  {
    id: 'aeo-research',
    name: '问题研究工具',
    icon: 'help_outline',
    color: '#F59E0B',
    description:
      'AlsoAsked、AnswerThePublic、QuestionDB 等 AEO 关键词发现工具，挖掘用户真实提问，为 AEO 内容创作和 FAQ 优化提供数据支撑。',
    badge: '❓ 研究',
    tools: aeoResearchTools,
  },
  {
    id: 'aeo-schema',
    name: '结构化数据工具',
    icon: 'account_tree',
    color: '#0EA5E9',
    description:
      'Schema 生成、验证与管理工具，包含 Rank Math、Yoast SEO、aeo.js 等，帮助网站添加 JSON-LD、llms.txt 和 Speakable 属性，提升 AI 引擎识别度。',
    badge: '🗂️ Schema',
    tools: aeoSchemaTools,
  },
  {
    id: 'aeo-china',
    name: '国内 AEO / GEO 平台',
    icon: 'language',
    color: '#EF4444',
    description:
      '专为中国市场打造的 AEO/GEO 平台，覆盖豆包、DeepSeek、Kimi、通义千问、元宝等国内主流 AI 引擎，AIDSO、透镜GEO、移山科技等代表品牌。',
    badge: '🇨🇳 国内',
    tools: aeoChinaTools,
  },
]

export const allAeoTools: AeoTool[] = aeoCategories.flatMap((c) => c.tools)

export const featuredAeoTools: AeoTool[] = allAeoTools.filter((t) => t.featured)
