/**
 * geo-tools-zh.ts — GEO 工具目录中文 override(按 id 映射)
 * 英文原数据见 geo-tools.ts;组件按当前语言回退。工具品牌名保留原文。
 */
export const geoCategoriesZh: Record<string, { name: string; description: string }> = {
  'cn-saas': {
    name: '国内 SaaS 工具',
    description: '领先的国产 GEO 监测/优化 SaaS,覆盖豆包、DeepSeek、Kimi、元宝与通义,部分含免费额度',
  },
  'cn-service': {
    name: '国内服务商工具',
    description: '国内 GEO 服务商的自研工具,为有深度 GEO 需求的企业提供从诊断到优化的端到端服务',
  },
  'global-geo': {
    name: '国际 GEO 工具',
    description: '领先的全球 GEO/AEO SaaS,覆盖 ChatGPT、Perplexity、Claude、Gemini 等主流 AI 搜索引擎',
  },
  'seo-to-geo': {
    name: '传统 SEO 的 GEO 新增模块',
    description: 'Semrush、Ahrefs 等 SEO 老牌厂商推出的 GEO/AI 可见度新功能,无缝接入你现有工作流',
  },
  'free-tools': {
    name: '免费 GEO 工具',
    description: '免费或免费增值的 GEO 检测工具——很适合个人站长与初接触 GEO 的团队',
  },
  'opensource-geo': {
    name: '开源 GitHub 项目',
    description: '星标最高的开源 GEO/AEO 项目(取自真实 GitHub 数据)——可自托管或二次开发',
  },
}

export const geoToolsZh: Record<string, string> = {
  aidso: 'DSO(深度搜索优化)+ GEO 双引擎平台,追踪国内外 AI 引擎中的可见度、提及与关键词推荐——国产 GEO 标杆。',
  'timus-geo': '永久免费、易上手的国产 GEO 监测工具,检测品牌在豆包、DeepSeek、元宝、Kimi 与通义千问中的可见度与提及。',
  impetaai: '上市公司汇辰旗下的 GEO 监测工具,覆盖 5 大国产 AI(豆包、DeepSeek、元宝、Kimi、通义千问)50+ 指标,提供多维可见度分析与竞品对比。',
  geowise: '新榜的一体化 GEO 平台,打通内容创作、分发与 AI 可见度监测,覆盖 12 大 AI 平台,实现端到端闭环。',
  sheepgeo: '提供 SHEEP 五维评分,检测品牌在 9 个 AI 模型中的可见度,支持定时检测、报告导出,并为个人与小团队提供永久免费额度。',
  'geo-multimodal': '为国内多模态 AI 场景量身打造的 GEO 系统,兼容 DeepSeek、豆包、元宝、通义千问、文心一言与 Kimi——优化图文内容的可见度。',
  geokeji: '国内早期 GEO 标杆,拥有 7 套自研系统并发布 GEO 白皮书,提供策略咨询、内容优化与持续监测,深度行业领先。',
  suproai: '由宝洁、联合利华背景团队创立。提供 Site Radar(AI 可见度检测)与 AI 建站,擅长面向 AI 搜索的品牌内容策略。',
  wanhuys: '专利技术覆盖 500+ 行业,承诺 72 小时见效。免费诊断入口让中小企业能快速上手。',
  starlinkgeo: '基于普林斯顿 GEO 研究(KDD 2024)打造的国内平台,聚焦垂直行业 GEO 优化与 AI 智能体集成,面向有技术能力的企业。',
  chuanshenggang: '专注内容分发,借助 128 家国家级媒体与 15 万+ 创作者网络,提升 E-E-A-T 信号与 AI 引擎中的引用率。',
  'geo-zhida': '聚焦国内 AI 生态的 GEO 增长服务商,通过精准内容与多平台分发,平均提升品牌在国产 AI 中的提及率 78%。',
  llmrefs: '聚焦关键词级的 AI 搜索模式追踪,监测 ChatGPT、Perplexity、Claude 等 200+ 工具中的引用——并运营最大的 GEO 工具目录(收录 200+)。',
  'profound-ai': 'G2 2026 企业级 AI 监测领导者,获红杉资本领投 5500 万美元。面向大规模品牌追踪的企业级 AI 答案监测,带深度竞品分析。',
  'otterly-ai': '自动追踪品牌在 ChatGPT、Perplexity、Google AI 概览等中的每日可见度。15,000+ 用户选择,29 美元/月起,含竞品监测与优化建议。',
  'peec-ai': '德国团队打造的 AI 声量监测——适合代理商,支持白标报告。89 欧元/月起,适合同时管理多客户 AI 可见度的代理商。',
  athenahq: '首创 QVEM(查询量预估模型)以预测 AI 搜索关键词流量。295 美元/月,面向数据驱动 SEO/GEO 团队的高端市场。',
  rankscale: '灵活的按点数计费追踪系统——按需购买点数,无固定套餐。约 20 美元/月起,适合预算有限的中小企业。',
  aiclicks: '约 39 美元/月的 AI 可见度追踪器,不仅监测品牌曝光,还给出针对性内容建议,把数据转化为行动。',
  appearonai: '提供免费扫描,快速审计在 ChatGPT、Perplexity、Claude 与 Gemini 中的可见度并出可视化报告——很适合初接触 GEO 的团队。',
  'geneo-app': '提供 Prompt 级历史记录,展示 AI 在不同时间、不同 Prompt 下如何描述品牌——帮团队理解 AI 内容如何演化。',
  passionfruit: '把 AI 搜索可见度与真实营收归因挂钩,帮品牌量化 GEO 的商业价值,把可见度与销售转化连起来。',
  'brandlight-ai': '将品牌监测与 AI 内容优化结合——内置优化器生成符合 GEO 的内容建议,实现从问题到方案的闭环。',
  'goodie-ai': '同时覆盖 AEO 与 AI 购物推荐可见度,自动检测内容缺口并生成建议——很适合 AI 购物场景下的电商与 B2C 品牌。',
  knowatoa: 'AI 可见度与引用来源追踪器,分析 AI 答案引用了哪些来源,帮品牌弄清竞品为何被引用、自身内容缺口在哪。',
  'semrush-ai': 'Semrush 在旗舰平台中新增 AI 可见度模块,追踪品牌关键词在 Google AI 概览、ChatGPT 与 Perplexity 中的出现频率,与传统 SEO 数据无缝集成。',
  'ahrefs-brand-radar': 'Ahrefs 的 AI 搜索品牌追踪模块,监测各 AI 引擎中的提及与引用,与 Ahrefs 的外链、关键词数据配合最佳。',
  'se-ranking-ai': 'SE Ranking 新增 AI 概览追踪,监测目标关键词在 Google AI 概览中的出现位置,分析被引用的内容并给出建议。',
  'nightwatch-ai': 'Nightwatch 在排名追踪中新增 AI 摘要监测,跟踪 AI 生成块在 SERP 中的呈现,帮用户应对从精选摘要到 AI 概览的转变。',
  'accuranker-accullm': 'AccuRanker 的 AccuLLM 模块是聚焦 GEO 的 LLM 可见度追踪器,把传统排名与 AI 引用并排对比,揭示 SEO 与 GEO 的协同。',
  'frase-geo': 'Frase 把 GEO 思路引入内容平台,分析 AI 答案中常被引用的结构,优化 FAQ、How-to 与摘要以获得引用。',
  'brightedge-geo': 'BrightEdge 企业平台推出 Generative Parser,实时解析 Google AI 概览、识别被引用来源,指导企业内容团队的 GEO 工作。',
  'seoclarity-ai': 'seoClarity 在企业平台中新增 AI 搜索可见度,提供市场份额分析、竞品对比与内容机会发现,面向大型企业。',
  'adobe-llm-optimizer': 'Adobe 的企业级 LLM 内容优化器,帮品牌调优其素材在 LLM 训练与推理中的权重,与 Adobe Experience Cloud 深度集成。',
  'timus-geo-free': '永久免费的国产 GEO 检测工具——无需注册即可测试品牌在豆包、DeepSeek、Kimi 等中的可见度;个人与小团队的免费首选。',
  'sheepgeo-free': '免费的 SHEEP 五维 GEO 检测,扫描 9 个 AI 模型中的可见度并出基础诊断报告——零成本了解你的 GEO 现状。',
  'hubspot-ai-grader': 'HubSpot 的免费 AI 搜索评分器——输入品牌名即可获得 ChatGPT 等工具中的情感、提及率与竞品对比,无需注册。',
  'llmrefs-tools': 'LLMrefs 的免费 llms.txt 生成器——输入 URL 即可自动扫描,生成标准化 llms.txt 与 AI 爬虫可读性报告。',
  'appearonai-free': '免费快速审计品牌在 4 大 AI 引擎(ChatGPT、Perplexity、Claude、Gemini)中的可见度,出可视化报告且无需注册——很适合做首次 GEO 基线。',
  'gtm-engineer-skills': '用于提升网站 AEO/GEO 评分的 Claude Code 技能——16 项基础检查、6 个情报维度、按框架定制的修复方案。基于结构化 AI 优化原则。',
  'geo-optimizer-skill': 'GEO 工具包——审计并为 AI 搜索引擎(ChatGPT、Perplexity、Claude、Gemini)优化网站。基于普林斯顿 KDD 2024 研究。Python CLI + MCP 支持。',
  'awesome-geo': '精选的生成式引擎优化资源指南:指南、工具与研究,助你提升在 AI 搜索引擎中的可见度。346 星、66 fork。',
  'aeo-js': '面向现代 Web 的答案引擎优化。生成 llms.txt、robots.txt、站点地图与 JSON-LD。支持 Next.js、Nuxt、Astro、Vite。',
  'searchstack-aeo': '开源的 AEO/GEO/SEO 命令行套件。监测在 Google、AI 概览、ChatGPT、Perplexity、Claude 与 Grok 中的可见度。22 条命令、9 个 API、llms.txt 生成器。',
  'geo-aeo-tracker': '开源、本地优先的 AI 可见度看板——可免费自托管,追踪 ChatGPT、Perplexity、Claude 等中的品牌提及与排名。',
}
