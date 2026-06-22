/**
 * ai-checker-tools-zh.ts — AI 可见度体检工具目录中文 override(按 id 映射)
 * 英文原数据见 ai-checker-tools.ts;组件按当前语言回退。工具品牌名保留原文。
 */
export const aiCheckerCategoriesZh: Record<string, { name: string; description: string }> = {
  tier1: {
    name: '🚀 免费快速检测',
    description: '留存核心——输入域名即可获取免费的 AI 可见度报告;适合先快速看一眼品牌在 AI 中的存在感',
  },
  tier2: {
    name: '🇨🇳 国内专业监测',
    description: '专业级监测,深度覆盖豆包、DeepSeek、Kimi、文心一言等主流国产 AI 平台',
  },
  tier3: {
    name: '🌍 国际工具',
    description: '覆盖 ChatGPT、Claude、Perplexity、Gemini 等主流全球 AI 引擎的监测与优化工具',
  },
  tier4: {
    name: '📊 传统 SEO + AI',
    description: 'Semrush、Ahrefs 等传统 SEO 平台新增的 AI 可见度模块——已订阅 SEO 工具的人很合适',
  },
  tier5: {
    name: '🔧 基础工具',
    description: '打基础的 AI 可见度工具——llms.txt 生成器、AI 抓取检测与结构化数据校验',
  },
}

export const aiCheckerToolsZh: Record<string, string> = {
  lensgeo: '永久免费的国产 AI 可见度检测工具,同时检测豆包、DeepSeek 与 Kimi,快速查看品牌被提及的频率。',
  sheepgeo: '覆盖 9 大 AI 引擎(国内外)的可见度检测,提供品牌提及率、情感分析与竞品对比——含永久免费版。',
  appearonai: '免费的全球 AI 可见度扫描器,一次性检测 ChatGPT、Claude、Gemini 与 Perplexity,并一键生成可见度报告。',
  'hubspot-grader': 'HubSpot 的免费一次性 AI 搜索品牌评分器——通过 ChatGPT 检测品牌可见度,给出 A–F 评级与改进建议。',
  aidso: '聚焦国内市场的 AI 可见度监测,覆盖主流国产 AI 引擎,提供品牌关键词监测、引用来源溯源与内容建议。',
  impetaai: '覆盖国内外主流 AI 平台的 50+ 项 AI 可见度指标,支持批量域名监测与自动报告生成。',
  geowise: '新榜的 GEO 智能运营平台,打通内容创作与 AI 可见度监测——适合品牌内容团队,集成微信生态数据。',
  csygeo: '覆盖 85+ AI 平台(国内外)的全量监测服务,含品牌口碑管理、AI 内容策略咨询等企业级服务。',
  llmrefs: '聚焦追踪品牌在 ChatGPT、Claude、Gemini 等中被 LLM 引用情况的全球平台,带 llms.txt 生成器与引用监测。',
  otterly: '专业的 AI 可见度监测工具,自动追踪品牌在 ChatGPT、Perplexity 与 Gemini 中的表现,带竞品对比与趋势分析。',
  profound: '企业级 AI 可见度平台,为大品牌提供全面的 AI 搜索情报,含多品牌管理、市场份额分析与引用来源溯源。',
  'scrunch-ai': '展示 AI 引擎如何理解你网站的工具,带 AI 抓取模拟、内容结构分析与可见度建议。',
  'peec-ai': '聚焦欧洲的 AI 搜索监测,支持 Perplexity、ChatGPT 与 Google AI 概览,提供多语言品牌监测。',
  'brandmentions-ai': '把传统品牌监测扩展到 AI 引擎,跨社媒、新闻与 AI 搜索追踪提及——一站式品牌情报平台。',
  'semrush-ai': 'SEMrush 在 SEO 套件中新增的 AI 可见度模块,追踪品牌在 Google AI 概览中的出现频率与关键词覆盖。',
  'ahrefs-brand': 'Ahrefs 的品牌提及追踪模块,结合 AI 搜索监测,衡量品牌在 AI 搜索中的知名度与引用情况。',
  'adobe-llm': 'Adobe 的企业级 LLM 优化工具,帮大型企业优化内容以提升 AI 引擎可见度,与 AEM 深度集成。',
  'llmstxt-gen': '自动扫描网站结构并生成符合规范的 llms.txt,让 AI 爬虫更好地理解你的内容——可见度的基础。',
  'ai-crawlability': '检测网站是否对 AI 爬虫友好,包括 robots.txt 配置、内容结构与加载速度——AI 抓取的关键因素。',
  'schema-validator': '校验结构化数据(JSON-LD Schema)是否正确——结构化数据是 AI 引擎理解内容实体的关键基础。',
  frase: '内容优化器,分析 AI 搜索结果中高频出现的内容模式,指导更易被 AI 引擎引用的文章结构与要素。',
}
