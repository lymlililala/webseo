// GEO (Generative Engine Optimization) & AEO (Answer Engine Optimization) Tools
// 数据来源：GitHub API + 公开产品信息（2026-05-09）
// 5大分类：国内SaaS工具、国内服务商、国际专项工具、传统SEO新增GEO模块、免费工具

export interface GeoTool {
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
  pricing?: string // 定价描述
  region: 'cn' | 'global' // 国内 | 国际
  highlights?: string[] // 核心亮点（3条以内）
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

export interface GeoCategory {
  id: string
  name: string
  icon: string
  color: string
  description: string
  badge?: string
  tools: GeoTool[]
}

// ══════════════════════════════════════════════════════════
// 一、国内 SaaS 工具型平台
// ══════════════════════════════════════════════════════════
const cnSaasTools: GeoTool[] = [
  {
    id: 'aidso',
    name: 'AIDSO 爱搜',
    nameEn: 'AIDSO',
    description:
      'DSO（DeepSearch Optimization）+ GEO 双引擎平台。提供品牌在国内外主流 AI 搜索引擎中的可见度监测、提及率追踪、关键词优化建议，是国内 GEO 工具的参照标准。',
    url: 'https://geo.aidso.com',
    tags: ['DSO', 'GEO双引擎', '品牌监测', '关键词追踪', '国内标杆'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['DSO + GEO 双引擎', '国内外AI搜索全覆盖', '关键词提及率分析'],
    featured: true,
  },
  {
    id: 'timus-geo',
    name: '透镜 GEO',
    nameEn: 'TIMUS.AI GEO',
    description:
      '国内永久免费的 GEO 监测工具，操作简单易用。支持检测品牌在豆包、DeepSeek、元宝、Kimi、通义千问等主流国产 AI 中的可见度与提及情况。',
    url: 'https://geo.timus.cn',
    tags: ['永久免费', '国产AI覆盖', '豆包', 'DeepSeek', '快速上手'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: '永久免费',
    highlights: ['永久免费', '豆包/DS/元宝/Kimi全覆盖', '国内最易用'],
    featured: true,
  },
  {
    id: 'impetaai',
    name: 'ImpetaAI',
    nameEn: 'ImpetaAI（慧辰股份）',
    description:
      '上市公司慧辰股份旗下 GEO 监测平台，提供 50+ 项评估指标，覆盖豆包、DeepSeek、元宝、Kimi、通义千问 5 大国产 AI。支持多维度品牌可见度分析与竞品对比。',
    url: 'https://impetaai.hcr.com.cn',
    tags: ['上市公司', '50+指标', '5大国产AI', '竞品对比', '慧辰股份'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['50+ 监测指标', '覆盖豆包/DS/元宝/Kimi/通义', '上市公司品质保障'],
    featured: true,
  },
  {
    id: 'geowise',
    name: '新榜智汇 GEOWISE',
    nameEn: 'GEOWISE',
    description:
      '新榜旗下 GEO 一体化平台，将内容创作、分发渠道和 AI 可见度监测三合一。覆盖 12 款主流 AI 平台，帮助品牌在 AI 内容生态中实现全链路布局。',
    url: 'https://www.newrank.cn',
    tags: ['新榜旗下', '内容+分发+监测', '12款AI平台', '全链路布局'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['内容+分发+监测一体化', '覆盖12款AI平台', '新榜内容生态赋能'],
  },
  {
    id: 'sheepgeo',
    name: 'SheepGeo',
    description:
      '提供 SHEEP 五维评分体系，全面检测品牌在 9 大 AI 模型中的可见性。支持定时巡检、报告导出，有永久免费版可满足个人和小团队基础需求。',
    url: 'https://sheepgeo.com',
    tags: ['SHEEP五维评分', '9大AI模型', '免费版', '定时巡检', '报告导出'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: '有免费版',
    highlights: ['SHEEP五维评分体系', '检测9大AI模型', '支持免费使用'],
  },
  {
    id: 'woi-geo',
    name: 'WOI GEO 平台',
    nameEn: 'WOI GEO',
    description:
      '提供 6 大 GEO 优化核心功能的一站式平台：AI 可见度监测、品牌提及分析、内容优化建议、竞品对标、效果追踪与报告中心，适合中大型企业使用。',
    url: 'https://woi.com',
    tags: ['6大功能', 'GEO优化中心', '一站式', '企业级'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['6大GEO核心功能', '企业级一站式平台', '品牌提及深度分析'],
  },
  {
    id: 'geo-multimodal',
    name: 'GEO 多模态系统',
    description:
      '专门适配国内多模态 AI 场景的 GEO 系统，兼容 DeepSeek、豆包、元宝、通义千问、文心一言、Kimi 六大平台。支持图文多模态内容的 AI 可见度优化。',
    url: 'https://tp10.ymyhn.com',
    tags: ['多模态', 'DeepSeek', '豆包', '元宝', '文心一言', '国产全覆盖'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['多模态内容优化', '6大国产AI平台兼容', '图文内容可见度'],
  },
  {
    id: 'shujie-ai',
    name: '数阶智能',
    description:
      'GEO 排名系统与 AIGC 矩阵营销平台结合，通过 AI 内容矩阵扩大品牌在 AI 搜索中的覆盖面，同步提升自然搜索和生成式搜索的可见度。',
    url: 'https://jinrikuaituan.com',
    tags: ['GEO排名系统', 'AIGC矩阵', '内容营销', '矩阵扩散'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['GEO排名系统', 'AIGC内容矩阵营销', '搜索可见度双提升'],
  },
]

// ══════════════════════════════════════════════════════════
// 二、国内服务商附工具
// ══════════════════════════════════════════════════════════
const cnServiceTools: GeoTool[] = [
  {
    id: 'geokeji',
    name: '移山科技',
    description:
      '国内 GEO 领域早期技术标杆，拥有 7 套自研系统，发布过 GEO 技术白皮书。提供完整的 GEO 战略咨询、内容优化和持续监测服务，技术深度业内领先。',
    url: 'https://geokeji.com',
    tags: ['GEO技术标杆', '7套自研系统', '技术白皮书', '战略咨询'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['国内GEO早期标杆', '7套自研系统', '有技术白皮书'],
    featured: true,
  },
  {
    id: 'suproai',
    name: '数珀 AI（Supro AI）',
    nameEn: 'Supro AI',
    description:
      '宝洁、联合利华背景团队创立。提供网站雷达（AI可见度检测）和 AI 建站工具，擅长品牌在 AI 搜索场景下的内容策略与工具化建设。',
    url: 'https://suproai.com',
    tags: ['宝洁背景', '网站雷达', 'AI建站', '品牌内容策略'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['宝洁/联合利华背景', '网站雷达AI检测', 'AI建站工具'],
  },
  {
    id: 'laver-ai',
    name: 'Laver AI',
    description:
      '构建监测到优化的完整闭环服务，覆盖 ChatGPT、Perplexity、Claude、Gemini 及国内主流 AI 五大平台。提供定制化 GEO 优化方案与持续效果追踪。',
    url: 'https://zicaiai.com',
    tags: ['监测+优化闭环', '5大AI平台', '定制优化', '效果追踪'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['监测+优化完整闭环', '国内外5大平台覆盖', '定制化方案'],
  },
  {
    id: 'wanhuys',
    name: '万汇搜（移山文化）',
    description: '拥有专利技术，覆盖 500+ 行业，承诺 72 小时见效。提供免费诊断入口，适合快速启动 GEO 优化的中小企业。',
    url: 'https://wanhuys.com',
    tags: ['专利技术', '500+行业', '72h见效', '免费诊断'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: '免费诊断',
    highlights: ['专利技术支撑', '覆盖500+行业', '72小时见效承诺'],
  },
  {
    id: 'starlinkgeo',
    name: '星辰汇 AI',
    description:
      '基于普林斯顿大学 GEO 研究（KDD 2024）的国内实践平台，专注垂直行业 GEO 优化与 AI 智能体集成，适合有技术基础的企业深度应用。',
    url: 'https://starlinkgeo.cn',
    tags: ['基于Princeton研究', '垂直行业', '智能体集成', '技术派'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['基于Princeton KDD 2024研究', '垂直行业专项优化', 'AI智能体集成'],
  },
  {
    id: 'chuanshenggang',
    name: '传声港（杭州龙投）',
    description:
      '以内容投放见长，整合 128 家央媒资源和 15 万+ 自媒体矩阵，通过高权威媒体发稿提升品牌在 AI 引擎中的 E-E-A-T 信号与引用率。',
    url: 'https://chuanshenggang.com',
    tags: ['128家央媒', '15万+自媒体', '内容投放型', 'E-E-A-T建设'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['128家央媒资源', '15万+自媒体矩阵', '内容投放型GEO'],
  },
  {
    id: 'fengkuang-geo',
    name: '疯狂 GEO',
    description:
      '提出 T-GEO 5 级结构化优化体系，号称可实现 95% 的 AI 内容收录率。通过系统化内容改造和知识图谱构建提升品牌在生成式搜索中的覆盖密度。',
    url: 'https://fengkuanggeo.com',
    tags: ['T-GEO五级结构', '95%AI收录率', '知识图谱', '内容结构化'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['T-GEO 5级结构化体系', '95% AI收录率目标', '知识图谱构建'],
  },
  {
    id: 'geo-zhida',
    name: 'GEO 智达',
    description:
      '专注国内 AI 生态的 GEO 增长服务商，通过精准内容策略和多平台分发，帮助客户实现品牌在国产 AI 中的提及率平均提升 78%。',
    url: 'https://geozhida.com',
    tags: ['国内AI生态', '品牌提及率+78%', '多平台分发', '增长服务'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['品牌提及率平均+78%', '专注国内AI生态', '精准内容策略'],
  },
  {
    id: 'aigcgeo',
    name: 'AIGCGEO 导航',
    description:
      '专注 GEO 领域的内容博客与服务商导航站，已收录 32 家国内外 GEO 服务商信息，兼有 GEO 知识库、案例库和工具推荐，是了解 GEO 生态的入口站点。',
    url: 'https://aigcgeo.com',
    tags: ['服务商目录', '32家收录', 'GEO知识库', '导航站'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['收录32家GEO服务商', 'GEO知识库与案例', 'GEO生态全景地图'],
  },
  {
    id: 'geo-suoyin',
    name: 'GEO 索引未来',
    description:
      '多个国内 AI 搜索平台榜单 TOP1，专注品牌在 AI 生成答案中的高频稳定出现，以"内容索引结构"为核心优化方法论，在业内有较高知名度。',
    url: 'https://geosuoyin.com',
    tags: ['多榜单TOP1', '高频提及', '内容索引结构', '知名服务商'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['多榜单综合排名TOP1', '内容索引结构方法论', '高频稳定提及'],
  },
]

// ══════════════════════════════════════════════════════════
// 三、国际 GEO 专项工具
// ══════════════════════════════════════════════════════════
const globalGeoTools: GeoTool[] = [
  {
    id: 'llmrefs',
    name: 'LLMrefs',
    description:
      '聚焦关键词级别的 AI 搜索模式追踪，监测品牌在 ChatGPT、Perplexity、Claude 等 200+ 主流工具中的引用情况。同时提供全球最大 GEO 工具目录（200+ 工具收录）。',
    url: 'https://llmrefs.com',
    tags: ['关键词模式追踪', '200+工具目录', '$13.5/mo起', '国际知名'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '$13.5/月起',
    highlights: ['关键词级别追踪', '200+工具目录', '性价比最高'],
    featured: true,
  },
  {
    id: 'profound-ai',
    name: 'Profound',
    description:
      'G2 2026 企业级 AI 监测领导者，获得 Sequoia Capital 领投 5500 万美元融资。企业级 AI 答案监测平台，适合大规模品牌追踪 AI 搜索可见度，提供深度竞品分析。',
    url: 'https://tryprofound.com',
    tags: ['Sequoia $55M融资', 'G2企业级领导者', '企业级', '竞品分析'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Sequoia $55M融资', 'G2 2026年领导者', '企业级首选'],
    featured: true,
  },
  {
    id: 'otterly-ai',
    name: 'Otterly.AI',
    description:
      '每日自动追踪品牌在 ChatGPT、Perplexity、Google AI Overviews 等平台的可见度，15000+ 用户选择，$29/月起价格亲民，提供竞品监测和内容优化建议。',
    url: 'https://otterly.ai',
    tags: ['每日追踪', '$29/月', '15000+用户', '多平台监测'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '$29/月起',
    highlights: ['每日自动追踪', '$29/月性价比优选', '15000+活跃用户'],
    featured: true,
  },
  {
    id: 'scrunch-ai',
    name: 'Scrunch AI',
    description:
      '覆盖 8 大 AI 引擎的综合监测平台，独特支持情感分析和错误信息标记功能。可识别 AI 答案中对品牌的负面描述或错误信息，帮助品牌主动纠偏。',
    url: 'https://scrunch.ai',
    tags: ['8引擎覆盖', '情感分析', '错误信息标记', '负面监测'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['8大AI引擎覆盖', '情感+错误信息分析', '负面内容主动纠偏'],
  },
  {
    id: 'peec-ai',
    name: 'Peec AI',
    description:
      '德国团队开发的 AI Share of Voice 监测平台，代理商友好，支持白标报告。€89/月起，适合数字营销公司批量管理多客户的 AI 可见度数据。',
    url: 'https://peec.ai',
    tags: ['德国团队', '€89/月', '代理商友好', '白标报告', 'Share of Voice'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '€89/月起',
    highlights: ['代理商友好白标报告', '€89/月欧洲方案', 'AI Share of Voice'],
  },
  {
    id: 'athenahq',
    name: 'AthenaHQ',
    description:
      '首创 QVEM（查询量估算模型）技术，提供 AI 搜索关键词的预测流量数据。$295/月定位高端市场，适合需要数据驱动决策的 SEO 和 GEO 团队。',
    url: 'https://athenahq.ai',
    tags: ['QVEM查询量模型', '$295/月', 'AI流量预测', '高端定位'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '$295/月',
    highlights: ['QVEM查询量估算模型', 'AI搜索流量预测', '数据驱动决策'],
  },
  {
    id: 'rankscale',
    name: 'Rankscale',
    description:
      '采用积分制灵活追踪体系，用户按实际监测需求购买积分，无需绑定固定套餐。约 $20/月起，适合预算有限的中小企业灵活使用。',
    url: 'https://rankscale.io',
    tags: ['积分制灵活计费', '~$20/月', '按需购买', '中小企业友好'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '~$20/月',
    highlights: ['积分制灵活计费', '按需使用无绑定', '中小企业适用'],
  },
  {
    id: 'aiclicks',
    name: 'AIclicks',
    description:
      '约 $39/月的 AI 可见度追踪与优化建议平台，不仅监测品牌出现情况，还提供针对性的内容优化建议，帮助用户将监测数据转化为实际改进行动。',
    url: 'https://aiclicks.io',
    tags: ['~$39/月', '追踪+优化建议', '内容改进指导', '监测转化行动'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '~$39/月',
    highlights: ['监测+优化建议一体', '约$39/月性价比', '行动导向报告'],
  },
  {
    id: 'appearonai',
    name: 'AppearOnAI',
    description:
      '提供免费扫描入口，对 ChatGPT、Perplexity、Claude、Gemini 4 大 AI 引擎进行快速可见度审计，生成可视化报告，适合初次了解 GEO 现状的团队使用。',
    url: 'https://appearonai.com',
    tags: ['免费扫描', '4大AI引擎审计', '可视化报告', 'GEO入门'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '有免费扫描',
    highlights: ['免费快速扫描', '4大AI引擎审计', '可视化GEO报告'],
    featured: true,
  },
  {
    id: 'geneo-app',
    name: 'Geneo',
    description:
      '提供 Prompt（提示词）级别的历史追踪记录，可查看不同时间点、不同 Prompt 下 AI 对品牌的描述变化，帮助团队精确理解 AI 内容的演变趋势。',
    url: 'https://geneo.app',
    tags: ['Prompt级追踪', '历史记录', 'AI描述演变', '精细化分析'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['Prompt级别历史追踪', 'AI描述演变分析', '精细化洞察'],
  },
  {
    id: 'passionfruit',
    name: 'Passionfruit',
    description:
      '将 AI 搜索可见度与实际业务收入归因相关联，帮助品牌量化 GEO 优化的商业价值，建立 AI 搜索可见度与销售转化之间的数据链路。',
    url: 'https://getpassionfruit.com',
    tags: ['可见度+收入归因', '商业价值量化', '转化关联', 'ROI分析'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI可见度与收入归因', 'GEO ROI量化', '销售转化分析'],
  },
  {
    id: 'brandlight-ai',
    name: 'BrandLight',
    description:
      '集品牌监测与 AI 内容优化于一体，内置 AI 内容优化工具可直接生成符合 GEO 标准的优化内容建议，从发现问题到生成解决方案形成闭环。',
    url: 'https://brandlight.ai',
    tags: ['品牌监测', '内置AI优化工具', '内容生成', '闭环优化'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['内置AI内容优化工具', '监测+内容闭环', '直接生成优化建议'],
  },
  {
    id: 'goodie-ai',
    name: 'Goodie AI',
    description:
      '同时覆盖 AEO（答案引擎优化）和 AI 购物推荐可见度，自动识别内容缺口并生成优化建议，适合电商和 B2C 品牌在 AI 购物场景中提升曝光。',
    url: 'https://goodie.ai',
    tags: ['AEO', 'AI购物可见度', '电商场景', '内容缺口识别'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['AEO + AI购物场景', '电商品牌专属优化', '自动识别内容缺口'],
  },
  {
    id: 'knowatoa',
    name: 'Knowatoa',
    description:
      'AI 搜索可见度与引用来源追踪平台，可分析 AI 答案中引用了哪些外部来源，帮助品牌理解竞品被引用的原因，找到内容建设的差距所在。',
    url: 'https://knowatoa.com',
    tags: ['引用来源分析', '竞品被引原因', '内容建设指导', '来源追踪'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['引用来源深度追踪', '竞品被引因素分析', '内容差距定位'],
  },
  {
    id: 'geofast-ai',
    name: 'GEOfast',
    description:
      '快速 GEO 洞察工具，专注于提供即时的 AI 搜索可见度快速扫描和核心指标概览，适合需要快速获得 GEO 现状快照的营销团队使用。',
    url: 'https://geofast.ai',
    tags: ['快速洞察', 'GEO快速扫描', '核心指标概览', '即时报告'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['即时GEO快速扫描', '核心指标一览', '快速获取现状报告'],
  },
]

// ══════════════════════════════════════════════════════════
// 四、传统 SEO 工具新增 GEO 模块
// ══════════════════════════════════════════════════════════
const seoToGeoTools: GeoTool[] = [
  {
    id: 'semrush-ai',
    name: 'Semrush AI Visibility',
    description:
      'Semrush 在其旗舰 SEO 平台中新增 AI Visibility 模块，追踪品牌关键词在 Google AI Overviews、ChatGPT、Perplexity 中的出现频次，与传统 SEO 数据无缝整合。',
    url: 'https://www.semrush.com/features/ai-visibility/',
    tags: ['Semrush', 'AI Visibility模块', 'SEO+GEO', 'Google AI概述'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['SEO与GEO数据无缝整合', 'Google AI Overview追踪', 'Semrush生态加持'],
    featured: true,
  },
  {
    id: 'ahrefs-brand-radar',
    name: 'Ahrefs Brand Radar',
    description:
      'Ahrefs 推出的 AI 搜索品牌追踪模块，监测品牌在多个 AI 搜索引擎中的提及率和引用情况，与 Ahrefs 丰富的反链和关键词数据融合使用效果更佳。',
    url: 'https://ahrefs.com/brand-radar',
    tags: ['Ahrefs', 'Brand Radar', '品牌追踪', '反链联动'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Ahrefs反链数据联动', '品牌AI引用追踪', '综合SEO分析'],
  },
  {
    id: 'se-ranking-ai',
    name: 'SE Ranking AI Overview Tracker',
    description:
      'SE Ranking 新增 AI Overview 追踪功能，监测目标关键词在 Google AI 概述中的出现情况，并分析哪些内容被 AI 引用，提供优化建议。',
    url: 'https://seranking.com',
    tags: ['SE Ranking', 'AI Overview追踪', 'Google优化', '内容引用分析'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI Overview追踪', 'Google内容引用分析', 'SEO+GEO整合'],
  },
  {
    id: 'nightwatch-ai',
    name: 'Nightwatch AI Snippets',
    description:
      'Nightwatch 在排名追踪基础上新增 AI Snippets 监测，追踪 SERP 中 AI 生成内容块的出现规律，帮助用户把握 Featured Snippet 到 AI Overview 的过渡趋势。',
    url: 'https://nightwatch.io',
    tags: ['Nightwatch', 'AI Snippets', '排名追踪', 'SERP特征'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI Snippets监测', 'SERP特征追踪', '排名+GEO双数据'],
  },
  {
    id: 'accuranker-accullm',
    name: 'AccuRanker AccuLLM',
    description:
      'AccuRanker 推出的 AccuLLM 模块，专为 GEO 设计的 LLM 可见度追踪系统，将传统关键词排名与 AI 引用情况并排对比，帮助用户发现 SEO 与 GEO 的协同机会。',
    url: 'https://accuranker.com',
    tags: ['AccuRanker', 'AccuLLM', 'LLM可见度', 'SEO+GEO对比'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AccuLLM专用GEO模块', 'SEO排名与GEO对比', 'LLM可见度专项追踪'],
  },
  {
    id: 'frase-geo',
    name: 'Frase.io GEO Optimization',
    description:
      'Frase 在其 AI 内容优化平台中融入 GEO 思路，分析 AI 答案中的高频引用内容结构，帮助用户优化 FAQ、How-to、结构化摘要，提升被 AI 引用的概率。',
    url: 'https://www.frase.io',
    tags: ['Frase', 'AI内容优化', 'FAQ结构', 'How-to优化'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['AI引用结构分析', 'FAQ与How-to优化', 'AI内容优化平台'],
  },
  {
    id: 'brightedge-geo',
    name: 'BrightEdge Generative Parser',
    description:
      'BrightEdge 企业级 SEO 平台推出 Generative Parser，实时解析 Google AI Overviews 内容，识别哪些来源被引用，为企业内容团队提供精准的 GEO 优化方向。',
    url: 'https://www.brightedge.com',
    tags: ['BrightEdge', '企业级', 'Generative Parser', 'AI概述解析'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['企业级GEO分析', 'Generative Parser', 'AI Overview来源解析'],
  },
  {
    id: 'seoclarity-ai',
    name: 'seoClarity AI Search Visibility',
    description:
      'seoClarity 在企业 SEO 平台中新增 AI Search Visibility 功能，提供品牌在 AI 搜索中的市场份额分析、竞品对比和内容机会识别，面向大型企业用户。',
    url: 'https://www.seoclarity.net',
    tags: ['seoClarity', '企业级', 'AI搜索市场份额', '竞品对比'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI搜索市场份额分析', '大型企业适用', '竞品深度对比'],
  },
  {
    id: 'adobe-llm-optimizer',
    name: 'Adobe LLM Optimizer',
    description:
      'Adobe 推出的企业级 LLM 内容优化工具，帮助品牌优化数字资产在 LLM 训练和推理中的权重，与 Adobe Experience Cloud 深度集成，适合大型品牌内容运营。',
    url: 'https://business.adobe.com/products/experience-cloud/llm-optimizer.html',
    tags: ['Adobe', 'LLM优化', 'Experience Cloud', '企业内容运营'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Adobe企业级品质', 'LLM训练权重优化', 'Experience Cloud集成'],
  },
]

// ══════════════════════════════════════════════════════════
// 五、免费 GEO 工具
// ══════════════════════════════════════════════════════════
const freeGeoTools: GeoTool[] = [
  {
    id: 'timus-geo-free',
    name: '透镜 GEO（免费版）',
    nameEn: 'TIMUS GEO Free',
    description:
      '永久免费的国内 GEO 监测入口，无需注册即可检测品牌在豆包、DeepSeek、Kimi 等主流国产 AI 中的可见度，是国内个人和小团队的首选免费工具。',
    url: 'https://geo.timus.cn',
    tags: ['永久免费', '无需注册', '国产AI检测', '个人首选'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: '完全免费',
    highlights: ['永久完全免费', '无需注册即用', '支持主流国产AI'],
    featured: true,
  },
  {
    id: 'sheepgeo-free',
    name: 'SheepGeo 免费检测',
    description:
      '提供 SHEEP 五维 GEO 免费检测，支持单次扫描 9 大 AI 模型可见度，生成基础诊断报告，适合快速了解 GEO 现状，无需付费即可上手。',
    url: 'https://sheepgeo.com',
    tags: ['免费检测', 'SHEEP五维', '9大AI模型', '基础报告'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: '有免费版',
    highlights: ['免费五维GEO检测', '9大AI模型覆盖', '快速获取诊断报告'],
  },
  {
    id: 'hubspot-ai-grader',
    name: 'HubSpot AI Search Grader',
    description:
      'HubSpot 推出的免费 AI 搜索评分工具，输入品牌名称即可获得在 ChatGPT 等 AI 工具中的品牌情感、提及率和竞争对手对比评分，无需注册。',
    url: 'https://www.hubspot.com/ai-search-grader',
    tags: ['HubSpot', '完全免费', '品牌评分', '情感分析', '无需注册'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '完全免费',
    highlights: ['HubSpot官方出品', '完全免费无需注册', '品牌AI搜索评分'],
    featured: true,
  },
  {
    id: 'llmrefs-tools',
    name: 'llms.txt Generator（LLMrefs）',
    description:
      'LLMrefs 提供的免费 llms.txt 生成工具，输入网站 URL 即可自动扫描并生成标准化 llms.txt 文件，同时提供 AI 爬虫可读性检测报告。',
    url: 'https://llmrefs.com/tools/llms-txt-generator',
    tags: ['llms.txt生成', '免费工具', 'AI爬虫', '自动扫描'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '完全免费',
    highlights: ['一键生成llms.txt', '自动扫描网站内容', 'AI爬虫可读性检测'],
  },
  {
    id: 'ai-crawlability',
    name: 'AI Crawlability Checker',
    description:
      '免费检测网站对 GPTBot、ClaudeBot、PerplexityBot 等主流 AI 爬虫的可爬取性，识别阻止 AI 索引的 robots.txt 配置问题和技术障碍。',
    url: 'https://aicrawlability.com',
    tags: ['免费', 'AI爬虫检测', 'GPTBot', 'robots.txt', '技术诊断'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '完全免费',
    highlights: ['免费AI爬虫可达性检测', 'robots.txt问题识别', '技术障碍诊断'],
  },
  {
    id: 'ai-content-optimizer-free',
    name: 'AI Content Optimizer（免费版）',
    description:
      '基于 GEO 原则的内容结构优化工具免费版，检测内容是否符合 AI 引用标准：FAQ 覆盖、数据引用、权威来源标注、标题层级等关键指标。',
    url: 'https://aicontentoptimizer.io',
    tags: ['内容优化', 'GEO原则', 'FAQ检测', '权威来源', '免费版'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '有免费版',
    highlights: ['基于GEO原则检测', 'FAQ与内容结构分析', '权威引用覆盖检查'],
  },
  {
    id: 'appearonai-free',
    name: 'AppearOnAI 免费扫描',
    description:
      '免费对 4 大 AI 引擎（ChatGPT、Perplexity、Claude、Gemini）进行品牌可见度快速审计，无需注册即可获得可视化报告，适合 GEO 入门快速摸底。',
    url: 'https://appearonai.com',
    tags: ['完全免费', '4大AI引擎', '可视化报告', 'GEO入门'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '完全免费',
    highlights: ['完全免费无需注册', '4大AI引擎快速审计', '可视化GEO报告'],
  },
]

// ══════════════════════════════════════════════════════════
// 开源 GitHub 项目专区
// ══════════════════════════════════════════════════════════
const openSourceGeoTools: GeoTool[] = [
  {
    id: 'gtm-engineer-skills',
    name: 'GTM Engineer Skills',
    description:
      'Claude Code skill for improving website AEO/GEO scores — 16 foundational checks, 6 intelligence dimensions, framework-specific fixes. Based on structured AI optimization principles.',
    url: 'https://github.com/onvoyage-ai/gtm-engineer-skills',
    tags: ['AEO', 'GEO', 'Claude Code', 'llms.txt', '结构化数据'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    region: 'global',
    github: {
      repo: 'onvoyage-ai/gtm-engineer-skills',
      stars: 1017,
      forks: 12,
      language: 'HTML',
      topics: ['aeo', 'ai-optimization', 'claude-code', 'geo', 'llms-txt', 'seo', 'structured-data'],
      license: 'MIT',
      createdAt: '2026-02-26',
      updatedAt: '2026-05-09',
    },
    featured: true,
  },
  {
    id: 'geo-optimizer-skill',
    name: 'GEO Optimizer Skill',
    description:
      'GEO toolkit — audit, optimize websites for AI search engines (ChatGPT, Perplexity, Claude, Gemini). Based on Princeton KDD 2024 research. Python CLI + MCP support.',
    url: 'https://github.com/Auriti-Labs/geo-optimizer-skill',
    tags: ['Python', 'CLI', 'AI可见度', 'Schema标记', 'Princeton研究', 'MCP'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    region: 'global',
    github: {
      repo: 'Auriti-Labs/geo-optimizer-skill',
      stars: 393,
      forks: 43,
      language: 'Python',
      topics: [
        'ai-search',
        'claude',
        'cli',
        'generative-engine-optimization',
        'geo',
        'llms-txt',
        'mcp',
        'openai',
        'perplexity',
        'python',
        'schema-markup',
      ],
      license: 'MIT',
      createdAt: '2026-02-18',
      updatedAt: '2026-05-09',
    },
    featured: true,
  },
  {
    id: 'awesome-geo',
    name: 'Awesome GEO',
    description:
      'Curated guide to Generative Engine Optimization resources: guides, tools & research to boost visibility in AI-powered search engines. 346 stars, 66 forks.',
    url: 'https://github.com/amplifying-ai/awesome-generative-engine-optimization',
    tags: ['Awesome List', 'GEO资源', '研究论文', '工具合集'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    region: 'global',
    github: {
      repo: 'amplifying-ai/awesome-generative-engine-optimization',
      stars: 346,
      forks: 66,
      language: null,
      topics: ['awesome-list', 'generative-engine-optimization', 'geo', 'llm', 'seo'],
      license: null,
      createdAt: '2025-06-05',
      updatedAt: '2026-05-07',
    },
  },
  {
    id: 'aeo-js',
    name: 'aeo.js',
    description:
      'Answer Engine Optimization for the modern web. Generates llms.txt, robots.txt, sitemap, JSON-LD. Supports Next.js, Nuxt, Astro, Vite.',
    url: 'https://github.com/multivmlabs/aeo.js',
    tags: ['TypeScript', 'Next.js', 'Nuxt', 'llms.txt', 'JSON-LD', 'npm包'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    region: 'global',
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
  },
  {
    id: 'searchstack-aeo',
    name: 'Searchstack AEO',
    description:
      'Open-source AEO/GEO/SEO CLI stack. Monitor visibility across Google, AI Overviews, ChatGPT, Perplexity, Claude & Grok. 22 commands, 9 APIs, llms.txt generator.',
    url: 'https://github.com/alexpospekhov/searchstack-aeo',
    tags: ['Python', 'CLI', '22条命令', '9个API', 'llms.txt'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: true,
    region: 'global',
    github: {
      repo: 'alexpospekhov/searchstack-aeo',
      stars: 75,
      forks: 12,
      language: 'Python',
      topics: ['aeo', 'ai-search', 'chatgpt', 'geo', 'llms-txt', 'perplexity', 'python', 'seo-tools'],
      license: 'MIT',
      createdAt: '2026-04-01',
      updatedAt: '2026-05-08',
    },
  },
  {
    id: 'geo-aeo-tracker',
    name: 'GEO/AEO Tracker',
    description:
      '开源、本地优先的 AI 可见度仪表板，免费自托管追踪品牌在 ChatGPT、Perplexity、Claude 等 AI 工具中的提及率与排名情况。',
    url: 'https://github.com/danishashko/geo-aeo-tracker',
    tags: ['开源', 'AI可见度', '品牌监测', '自托管', '仪表板'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: true,
    hasApi: false,
    region: 'global',
    github: {
      repo: 'danishashko/geo-aeo-tracker',
      stars: 47,
      forks: 8,
      language: 'TypeScript',
      topics: ['aeo', 'geo', 'brand-monitoring', 'ai-visibility'],
      license: 'MIT',
      createdAt: '2025-09-12',
      updatedAt: '2026-03-15',
    },
  },
]

// ══════════════════════════════════════════════════════════
// 汇总分类
// ══════════════════════════════════════════════════════════
export const geoCategories: GeoCategory[] = [
  {
    id: 'cn-saas',
    name: '国内 SaaS 工具',
    icon: 'language',
    color: '#EF4444',
    description:
      '国内主流 GEO 监测与优化 SaaS 平台，覆盖豆包、DeepSeek、Kimi、元宝、通义等国产 AI 引擎，部分提供免费版',
    badge: '🇨🇳 国内',
    tools: cnSaasTools,
  },
  {
    id: 'cn-service',
    name: '国内服务商工具',
    icon: 'business',
    color: '#F97316',
    description: '国内专业 GEO 服务商自研工具与平台，提供从诊断到优化的全套服务，适合有深度 GEO 优化需求的企业',
    badge: '🇨🇳 国内',
    tools: cnServiceTools,
  },
  {
    id: 'global-geo',
    name: '国际 GEO 专项工具',
    icon: 'public',
    color: '#6366F1',
    description: '全球领先的 GEO/AEO 专项 SaaS 平台，覆盖 ChatGPT、Perplexity、Claude、Gemini 等国际主流 AI 搜索引擎',
    badge: '🌍 国际',
    tools: globalGeoTools,
  },
  {
    id: 'seo-to-geo',
    name: '传统 SEO 新增 GEO 模块',
    icon: 'upgrade',
    color: '#8B5CF6',
    description: 'Semrush、Ahrefs 等传统 SEO 巨头推出的 GEO/AI 可见度新功能，可与现有 SEO 工作流无缝结合',
    badge: '🔧 增强',
    tools: seoToGeoTools,
  },
  {
    id: 'free-tools',
    name: '免费 GEO 工具',
    icon: 'money_off',
    color: '#10B981',
    description: '完全免费或提供免费版的 GEO 检测工具，适合个人站长和初次接触 GEO 的团队快速上手',
    badge: '🆓 免费',
    tools: freeGeoTools,
  },
  {
    id: 'opensource-geo',
    name: '开源 GitHub 项目',
    icon: 'code',
    color: '#14B8A6',
    description: '基于 GitHub 真实仓库数据，收录星数最高的 GEO/AEO 开源项目，可自托管部署或二次开发',
    badge: '⭐ 开源',
    tools: openSourceGeoTools,
  },
]

export const allGeoTools: GeoTool[] = geoCategories.flatMap((c) => c.tools)

export const featuredGeoTools: GeoTool[] = allGeoTools.filter((t) => t.featured)
