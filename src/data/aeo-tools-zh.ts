/**
 * aeo-tools-zh.ts — AEO 工具目录中文 override(按 id 映射)
 * 英文原数据见 aeo-tools.ts;组件按当前语言回退。工具品牌名保留原文。
 */
export const aeoCategoriesZh: Record<string, { name: string; description: string }> = {
  'aeo-saas': {
    name: 'AEO 专项 SaaS',
    description:
      '为 AEO 打造的监测与优化平台——品牌可见度追踪、Prompt 分析与竞品对比。含获融资的明星产品(Profound、AthenaHQ)与开源替代品(GetCito、Elmo)。',
  },
  'aeo-enterprise': {
    name: '企业 SEO + AEO 模块',
    description:
      'Semrush、Ahrefs、BrightEdge 等企业级 SEO 平台内置的 AEO 模块——让已有 SEO 体系的团队不必换工具即可平滑扩展到 AEO。',
  },
  'aeo-content': {
    name: '内容优化工具',
    description:
      'Frase、Surfer SEO、MarketMuse 等内容结构化工具,帮你创作 AI 引擎乐于引用的答案型内容。含一个开源 AI 写作智能体(⭐205)。',
  },
  'aeo-research': {
    name: '问题研究工具',
    description:
      'AlsoAsked、AnswerThePublic、QuestionDB 等 AEO 关键词发现工具,挖掘真实用户问题,支撑 AEO 内容与 FAQ 优化。',
  },
  'aeo-schema': {
    name: '结构化数据工具',
    description:
      'Rank Math、Yoast SEO、aeo.js 等 Schema 生成、校验与管理工具,帮网站加上 JSON-LD、llms.txt 与 Speakable,提升 AI 引擎识别度。',
  },
  'aeo-china': {
    name: '国内 AEO/GEO 平台',
    description:
      '为国内市场打造的 AEO/GEO 平台,覆盖豆包、DeepSeek、Kimi、通义千问、元宝等主流国产 AI 引擎,含 AIDSO、Lens GEO、易山科技等品牌。',
  },
}

export const aeoToolsZh: Record<string, string> = {
  heyamos: 'Antler 投资的端到端 AEO 平台,由 AEO 实战手册驱动,亚太覆盖强,帮品牌在 AI 引擎答案中系统化建立可见度。',
  profound: '获 5500 万美元融资的企业级 AEO 平台,通过 SOC2+HIPAA 合规并带 AI 智能体分析,帮《财富》500 强追踪并优化其 AI 搜索表现。',
  athenahq: 'YC 投资的 GEO/AEO 平台,内置可推荐策略的 AI 助手,并自研 QVEM 查询量模型来量化 AI 可见度增长。',
  'otterly-ai': '顶级的 AEO 监测入门工具,每日跨 ChatGPT、Perplexity、Gemini 等主流引擎追踪 15+ 个 Prompt。15,000+ 用户在用——最具性价比的 AEO 入门工具。',
  'peec-ai': '为代理商打造的品牌 AI 可见度监测,数据呈现清爽,支持多客户账号管理,跨 AI 引擎追踪客户表现。',
  'goodie-ai': '聚焦 AEO 与 AI 购物可见度的平台,跨 ChatGPT、Amazon Rufus 与 Perplexity Shopping 追踪推荐——很适合电商品牌。',
  evertune: '服务《财富》500 强的企业级 AEO 平台,每月处理 100 万+ Prompt,以统计置信度分析提供最精准的 AI 可见度数据。',
  omnibound: 'B2B 内容 AEO 平台,从买家对话出发驱动内容策略,带批量刷新与 AI 引擎优化,提升在采购决策中的可见度。',
  aiclicks: '面向中端市场的 AEO 工具包,含 Prompt 聚类映射、GEO 审计与多语言追踪,帮中小企业以实惠成本做全面的 AI 搜索优化。',
  rankscale: '灵活的按点数计费 AI 可见度追踪器,跨 AI 引擎做高精度深度排名——按需购买点数;很适合追求精度又有预算约束的团队。',
  getcito: '首个开源的 AIO/AEO/GEO 平台,跨 ChatGPT、Claude、Perplexity 与 Google AI 概览追踪品牌曝光并给出可落地建议,支持自托管或云端 SaaS。',
  'elmo-ai': '开源的 AI 可见度追踪器,实时监测在 ChatGPT、Perplexity、Gemini、Grok 与 Copilot 中的曝光,提供多维 AEO/GEO/AIO/LLMO 报告与隐私友好的 BYOK 设计。',
  'aperture-ai': '开源、可自托管的 AI 可见度监测(BYOK),追踪品牌在 ChatGPT、Perplexity 与 Google AI 概览中出现的频率与语境——Profound 与 Peec AI 的免费替代品。',
  'aeo-radar': '开源的 AEO 品牌可见度监测,实时追踪在 ChatGPT、Perplexity 与 Gemini 中的提及,带可视化看板与提醒以便快速响应。',
  canonry: '智能体优先的 AEO 监测与运营平台(出自 AINYC),为 AI 搜索时代打造,通过自动监测、竞品对比与建议让品牌在 AI 答案中保持可见。',
  conductor: '企业级 SEO + AEO 平台,带实时 LLM 查询分析、AI 写作助手与 7×24 可见度监测,规模化统一传统 SEO 与 AEO。',
  'semrush-ai-visibility': 'Semrush 的 AI 可见度模块,带 AI 概览追踪、竞品基准与周期对比,与 Semrush 的 SEO 数据深度集成。',
  'ahrefs-brand-radar': 'Ahrefs 的 AI 品牌追踪模块,覆盖六大 AI 引擎(ChatGPT、Perplexity、Gemini、Copilot、Claude、Grok),与 Ahrefs 的 SEO 数据无缝打通,做最完整的可见度分析。',
  'se-ranking': '内置生成式引擎(GEO/AEO)追踪模块与代理商多客户管理的 SEO 平台——小型代理商追踪 AI 可见度的高性价比之选。',
  brightedge: '企业级 AI 内容与 AEO 平台,系统性融合 AEO 与内容策略,为全球顶级品牌提供大规模可见度监测与建议。',
  seoclarity: 'AI 驱动的企业级 SEO + AEO 平台,支持规模化 AEO,带内容优化、可见度分析与自动化工作流,服务大型内容团队。',
  authoritas: '企业级 SEO 平台,内含 AI 品牌监测模块,追踪在 AI 生成内容中的表现并与 SEO 数据结合,做完整的可见度分析。',
  'frase-io': '为 AEO 打造的 AI 摘要与答案优化平台,带 FAQ 生成、内容结构化与 AI 就绪度评分,快速产出易被引用的答案。',
  'surfer-seo': '内容评分与 AI 结构平台,提供语义词分析、覆盖度评分与 LLM 策略,创作既能在 Google 排名、又被 AI 引用的内容。',
  clearscope: '语义词分析与覆盖度评分工具,帮团队写出语义完整、权威的内容,更易在传统搜索与 AI 搜索中被引用。',
  marketmuse: 'AI 驱动的主题权威度与内容缺口平台,帮品牌系统覆盖核心主题、建立内容护城河,在 AI 与传统搜索中赢得权威。',
  neuronwriter: '基于 NLP 的内容优化器,在欧洲很受欢迎,带多语言评分与 AI 搜索建议——做欧洲 AEO 内容性价比很高。',
  inlinks: '实体优化与内链自动化工具,借助知识图谱与实体关系建立 AI 搜索权威,与 Schema 深度集成以提升实体识别。',
  writesonic: 'AI 内容生成平台,产出兼顾 GEO+SEO+AEO 的结构——语义完整、可被引用的文章、FAQ 与落地页,适合大批量团队。',
  'seobuild-onpage': 'AI 智能体页面 SEO + AEO 写手(⭐205 星):一条命令生成兼顾 Google 排名与 LLM 引用的落地页,带 500-token 分块、实体共识与校验标签,集成 GSC 与 DataforSEO。',
  alsoasked: '可视化的 PAA(其他人也问)问题树工具,挖掘 Google 的语义问题网络,揭示真实用户意图,用于 AEO 内容与 FAQ 优化。',
  answerthepublic: '经典的 5W1H 长尾问题聚合器,基于搜索建议自动生成关于某话题的 Who/What/When/Where/Why/How 问题——AEO 研究必备。',
  'google-paa': '直接从 Google 结果挖掘"其他人也问"答案框机会——免费且实时;展开 PAA 区块能带来大量 AEO 内容灵感与直接竞品洞察。',
  explodingtopics: '发现爆发型问题话题与行业趋势,抢先布局 AI 搜索热点做 AEO 内容,覆盖科技、商业、健康等多个垂直领域。',
  questiondb: '基于真实 Reddit 问题构建的长尾词库,汇集真实用户讨论,帮 AEO 团队在 Reddit、Quora 等找到被频繁讨论的问题类型。',
  'keyword-tool': '多平台搜索建议工具,覆盖 Google、Bing、YouTube、Amazon 与 Reddit 的问题与长尾词,做多渠道 AEO 问题研究。',
  'geordy-ai': '聚焦 GEO 的自动化 JSON-LD 平台,带 llms.txt 生成,帮网站快速适配 AI 引擎,通过结构化数据标记提升可见度。',
  'schema-app': '企业级 Schema.org 管理平台,支持复杂知识图谱的构建、部署与追踪,实现全站结构化数据标记管理。',
  'google-rich-results-test': '官方免费 Schema 校验器,检查 FAQ、HowTo、Article 与 Product 标记,确保结构化数据满足 Google 富结果与 AI 概览要求。',
  'schema-markup-generator': '在线 Schema 代码生成器——无需编码;填表即可生成符合 Schema.org 的 JSON-LD,覆盖 FAQ、Article、Organization、Product 等常见类型。',
  'rank-math': 'WordPress AEO 插件,自动生成 FAQ、HowTo 与 Article Schema 并带 AI 概览优化——强大的免费版让它成为 WordPress AEO 的首选。',
  'yoast-seo': '最受欢迎的 WordPress SEO 插件,内置 Schema 自动添加 Article、BreadcrumbList 与 Organization 数据——经典的 AEO 基础设施工具。',
  'aeo-js-npm': '面向现代 Web 框架的 AEO npm 包,一键生成 llms.txt、robots.txt、站点地图与 JSON-LD,支持 Next.js、Nuxt、Astro 与 Vite,快速完成 AI 爬虫适配。',
  'aeo-schema-skill': '面向 Claude 的 Schema.org JSON-LD 标记技能,覆盖 Google 富结果与 AEO 答案引擎优化,含实体图谱、Speakable 与 sameAs 策略,适用于 Claude.ai、Claude Code 与 Cursor。',
  aidso: 'DSO + GEO + AEO 双引擎监测,深度覆盖 DeepSeek、豆包、小红书等国内平台及全球引擎——国内领先的 AEO/GEO 平台。',
  'timus-geo': '免费的国产 GEO/AEO 监测工具,支持国产 AI 平台排名追踪——零成本开始追踪豆包、Kimi 与 DeepSeek 中的可见度;新手首选。',
  impetaai: '国产 AI 可见度监测工具,覆盖主流国产引擎(豆包、DeepSeek、元宝、Kimi、通义千问)50+ 指标,提供全面的 AEO 诊断与建议。',
  pallasai: '由蚂蚁集团大模型架构师创立、聚焦 B2B 的 AEO 智能体平台,深度融合 AI Agent 技术与 AEO,帮 B2B 企业在 AI 搜索时代触达对的客户。',
  csygeo: '覆盖 85+ 国内外 AI 平台的完整 GEO + AEO 平台,配专业 AEO 白皮书与实战手册——AEO 方法论最深的平台之一,另含内容优化与可见度服务。',
  sheepgeo: '采用 SHEEP 五维评分、跨 9 大 AI 模型的 GEO/AEO 监测工具,带面向中小企业的免费基础版,用于了解在国产 AI 引擎中的表现。',
  geokeji: '技术实力最强的国产 GEO/AEO 服务商,拥有 7 套自研系统与端到端的诊断-优化-监测服务,含 AI 内容重构、实体图谱与 Schema 标记。',
  suproai: '提供 AI 可见度站点雷达与 AI 建站的平台,帮企业快速搭建对 AI 引擎友好的网站并持续做 AEO 监测——很适合从零建立 AI 存在感。',
}
