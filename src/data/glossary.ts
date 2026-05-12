export interface GlossaryTerm {
  id: string // slug，用于锚点 #geo
  term: string // 英文术语名
  termZh: string // 中文名
  category: 'ai-core' | 'seo-basics' | 'llm-tech' | 'content-data' | 'metrics'
  definition: string // 定义（中文）
  usage: string // 使用场景
  related: string[] // 相关术语 id 列表
  link?: string // 站内跳转链接（内链枢纽）
}

export interface GlossaryCategory {
  id: 'ai-core' | 'seo-basics' | 'llm-tech' | 'content-data' | 'metrics'
  name: string
  nameEn: string
  icon: string
  color: string
  description: string
}

export const glossaryCategories: GlossaryCategory[] = [
  {
    id: 'ai-core',
    name: 'AI搜索优化核心',
    nameEn: 'AI Search Optimization',
    icon: 'smart_toy',
    color: '#6366F1',
    description: 'GEO、AEO、LLMO 等新一代 AI 搜索优化核心概念',
  },
  {
    id: 'seo-basics',
    name: '传统SEO基础',
    nameEn: 'Traditional SEO',
    icon: 'travel_explore',
    color: '#10B981',
    description: 'E-E-A-T、SERP、Backlink 等经典 SEO 基础术语',
  },
  {
    id: 'llm-tech',
    name: 'AI / LLM 技术',
    nameEn: 'AI & LLM Tech',
    icon: 'memory',
    color: '#8B5CF6',
    description: 'MCP、RAG、Embedding 等 AI 技术架构术语',
  },
  {
    id: 'content-data',
    name: '内容与结构化数据',
    nameEn: 'Content & Structured Data',
    icon: 'data_object',
    color: '#F59E0B',
    description: 'llms.txt、Schema Markup、Knowledge Graph 等内容标准',
  },
  {
    id: 'metrics',
    name: '监测与指标',
    nameEn: 'Metrics & Measurement',
    icon: 'monitoring',
    color: '#EF4444',
    description: 'AI 可见度、品牌提及率、话题权威性等衡量指标',
  },
]

export const glossaryTerms: GlossaryTerm[] = [
  // ── Category 1: AI Search Optimization Core ──────────────────
  {
    id: 'aeo',
    term: 'AEO',
    termZh: '答案引擎优化',
    category: 'ai-core',
    definition:
      'AEO（Answer Engine Optimization，答案引擎优化）是指将内容优化为可被 AI 搜索系统、语音助手和问答平台直接引用为"答案"的实践。与传统 SEO 争夺排名链接不同，AEO 的核心目标是让你的内容成为搜索引擎直接展示的权威来源。',
    usage: '当你希望内容出现在 Google Featured Snippet、Perplexity 引用框、Siri 语音回答或 ChatGPT 检索结果中时使用。',
    related: ['geo', 'sge', 'featured-snippet', 'zero-click-search'],
    link: '/aeo-nav',
  },
  {
    id: 'ai-overview',
    term: 'AI Overview',
    termZh: 'AI 概览（Google）',
    category: 'ai-core',
    definition:
      'AI Overview 是 Google 在 SERP 顶部展示的 AI 生成摘要，由 Gemini 模型综合多个来源生成。它取代了早期的 SGE 实验功能，是 Google 将 AI 融入主搜索结果的核心产品。被 AI Overview 引用意味着品牌获得了极高曝光度。',
    usage: '分析哪类内容结构更容易被 Google AI Overview 引用，是 2024–2026 年 SEO 的核心课题。',
    related: ['sge', 'geo', 'aeo', 'serp'],
  },
  {
    id: 'ai-search',
    term: 'AI Search',
    termZh: 'AI 搜索',
    category: 'ai-core',
    definition:
      'AI Search 泛指以大语言模型（LLM）为核心驱动的新一代搜索引擎，包括 Perplexity AI、Google AI Overview、Bing Copilot、ChatGPT Search 等产品。与传统关键词匹配搜索不同，AI 搜索能理解语义、意图，并直接生成综合答案。',
    usage: '当评估品牌在下一代搜索生态中的可见性时，必须将 AI Search 平台纳入监测范围。',
    related: ['llm', 'geo', 'llmo'],
  },
  {
    id: 'ai-snippet',
    term: 'AI Snippet',
    termZh: 'AI 摘要片段',
    category: 'ai-core',
    definition:
      'AI Snippet 是指 AI 搜索引擎从第三方网页中提取并展示在结果界面的内容片段，通常附带来源链接。被选为 AI Snippet 的内容往往具备结构清晰、回答直接、权威性强等特征。',
    usage: '优化内容段落结构，使其更容易被 Perplexity、ChatGPT 等 AI 系统提取为 AI Snippet。',
    related: ['aeo', 'featured-snippet', 'citation-rate'],
  },
  {
    id: 'geo',
    term: 'GEO',
    termZh: '生成式引擎优化',
    category: 'ai-core',
    definition:
      'GEO（Generative Engine Optimization，生成式引擎优化）是专门针对 ChatGPT、Perplexity、Google AI Overview 等生成式 AI 搜索引擎的内容优化方法论。GEO 研究如何让内容被 LLM 选择、引用并呈现给用户，是传统 SEO 在 AI 时代的进化。',
    usage: '当目标是让品牌内容在 AI 生成答案中频繁被引用时，GEO 策略是核心工作。',
    related: ['aeo', 'llmo', 'ai-overview', 'rag'],
    link: '/geo-nav',
  },
  {
    id: 'llmo',
    term: 'LLMO',
    termZh: '大语言模型优化',
    category: 'ai-core',
    definition:
      'LLMO（Large Language Model Optimization）是指针对 GPT-4、Claude、Gemini 等大语言模型的内容可见性优化策略。LLMO 的目标在于：让你的品牌、产品或内容在 LLM 的训练数据和实时检索中占据正面、准确的位置，从而在对话式 AI 交互中被推荐。',
    usage: '品牌希望在用户向 AI 助手询问产品推荐时，确保自家品牌被准确提及。',
    related: ['geo', 'llm', 'ai-visibility', 'brand-mention-rate'],
  },
  {
    id: 'sge',
    term: 'SGE',
    termZh: '搜索生成体验',
    category: 'ai-core',
    definition:
      'SGE 是 Google 于 2023–2024 年推出的实验性 AI 搜索功能的早期名称，即在搜索结果页面顶部展示 AI 生成的综合回答。SGE 已于 2024 年正式演进为 Google AI Overview，成为 Google 主搜索的标配功能。',
    usage: '理解 Google AI Overview 历史背景时常提及 SGE，也是评估早期 AI SEO 测试数据的参考坐标。',
    related: ['ai-overview', 'geo', 'serp'],
  },
  {
    id: 'llm-training-data',
    term: 'LLM Training Data',
    termZh: 'LLM 训练数据',
    category: 'ai-core',
    definition:
      'LLM Training Data 是指用于训练大语言模型的文本语料库，包含网页内容、书籍、论文等。你的网站内容若被爬取并纳入训练数据，将影响模型对你品牌和产品的"认知"。优质、权威的内容更有机会进入高质量训练集。',
    usage: '评估内容策略是否有助于提升品牌在未来 LLM 版本中的知名度和准确表达。',
    related: ['llm', 'llmo'],
  },
  {
    id: 'conversational-search',
    term: 'Conversational Search',
    termZh: '对话式搜索',
    category: 'ai-core',
    definition:
      'Conversational Search 是指用户以自然语言多轮对话方式进行的搜索交互，区别于传统的单次关键词查询。ChatGPT、Bing Copilot 和 Google Gemini 均支持对话式搜索。理解这一范式对于内容创作的语气、结构和深度都有直接影响。',
    usage: '撰写长尾问答内容、FAQ 页面时，需考虑对话式搜索的提问模式。',
    related: ['aeo', 'intent-optimization', 'long-tail-keywords'],
  },
  {
    id: 'prompt-engineering',
    term: 'Prompt Engineering',
    termZh: '提示词工程（SEO 视角）',
    category: 'ai-core',
    definition:
      '在 SEO 语境下，Prompt Engineering 是指研究用户向 AI 系统发出的典型查询模式，并据此优化内容结构，使内容更匹配 AI 系统内部的"检索提示"。了解 AI 如何被提示去检索内容，是 GEO 实践的重要组成部分。',
    usage: '分析用户在 ChatGPT 或 Perplexity 中输入的典型提问，并将相应答案结构嵌入内容中。',
    related: ['geo', 'aeo', 'rag'],
  },
  {
    id: 'zero-click-search',
    term: 'Zero-Click Search',
    termZh: '零点击搜索',
    category: 'ai-core',
    definition:
      'Zero-Click Search 是指用户在搜索引擎结果页上直接获得答案而不点击任何链接的搜索行为。AI Overview、Featured Snippet 和知识图谱的普及显著提升了零点击搜索的比例。对于内容营销团队，这意味着品牌曝光不再等于流量。',
    usage: '分析 AI 搜索对网站自然流量的影响时，零点击搜索率是核心参考指标。',
    related: ['ai-overview', 'featured-snippet', 'serp', 'ctr'],
  },

  // ── Category 2: Traditional SEO Fundamentals ─────────────────
  {
    id: 'backlink',
    term: 'Backlink',
    termZh: '外部链接 / 反向链接',
    category: 'seo-basics',
    definition:
      'Backlink 是指其他网站指向你网站的超链接。在传统 SEO 中，高质量的 Backlink 是搜索引擎评估网页权威性的核心信号之一。在 AI SEO 时代，被权威媒体链接引用同样有助于提升 LLM 对品牌的正面认知。',
    usage: '构建链接建设策略时，以获取高 DA/DR 网站的 Backlink 为核心目标。',
    related: ['domain-authority', 'e-e-a-t', 'pagerank'],
  },
  {
    id: 'canonical-url',
    term: 'Canonical URL',
    termZh: '规范链接',
    category: 'seo-basics',
    definition:
      'Canonical URL 是通过 <link rel="canonical"> 标签指定的页面权威版本 URL，用于解决重复内容问题。当同一内容存在多个 URL 时，Canonical 告诉搜索引擎哪个版本应被索引和排名。',
    usage: '电商网站存在大量筛选参数 URL、或同一文章发布于多个子域时必须设置 Canonical。',
    related: ['crawlability', 'indexability', 'duplicate-content'],
  },
  {
    id: 'core-web-vitals',
    term: 'Core Web Vitals',
    termZh: '核心网页指标',
    category: 'seo-basics',
    definition:
      'Core Web Vitals 是 Google 定义的一组衡量用户体验的页面性能指标，包括 LCP（最大内容绘制）、INP（下一次绘画交互）和 CLS（累积布局偏移）。这些指标是 Google 排名算法的直接因素，也影响 AI 爬虫对页面质量的判断。',
    usage: '在技术 SEO 审计中，Core Web Vitals 是必查项，低分会直接影响排名和用户体验。',
    related: ['lcp', 'page-experience'],
  },
  {
    id: 'crawlability',
    term: 'Crawlability',
    termZh: '可爬取性',
    category: 'seo-basics',
    definition:
      'Crawlability 是指搜索引擎和 AI 爬虫能否顺利访问、读取并索引网站页面的能力。影响可爬取性的因素包括 robots.txt 配置、页面加载速度、JavaScript 渲染、内部链接结构等。',
    usage: '进行技术 SEO 审计时，检查 robots.txt 和 Crawl Budget 是否阻碍了重要页面的爬取。',
    related: ['robots-txt', 'indexability'],
  },
  {
    id: 'ctr',
    term: 'CTR',
    termZh: '点击率',
    category: 'seo-basics',
    definition:
      'CTR（Click-Through Rate，点击率）是指在搜索结果中展示后被用户点击的比例（点击次数 ÷ 展示次数）。在 AI 搜索时代，随着零点击搜索增加，CTR 优化的重要性与意义正在发生转变，但仍是衡量标题和元描述吸引力的核心指标。',
    usage: '优化 Title Tag 和 Meta Description 时，以提升 CTR 为核心目标。',
    related: ['serp', 'zero-click-search'],
  },
  {
    id: 'domain-authority',
    term: 'Domain Authority',
    termZh: '域名权威度',
    category: 'seo-basics',
    definition:
      'Domain Authority（DA）是 Moz 开发的第三方评分指标（0–100），用于预测一个域名在搜索引擎中的排名潜力。DA 综合考量了链接数量、质量、域名历史等因素。高 DA 网站发布的内容也更容易被 AI 系统认为是权威来源。',
    usage: '评估外链建设目标网站质量，或对比竞争对手的整体域名权威度。',
    related: ['backlink', 'e-e-a-t', 'pagerank'],
  },
  {
    id: 'duplicate-content',
    term: 'Duplicate Content',
    termZh: '重复内容',
    category: 'seo-basics',
    definition:
      'Duplicate Content 是指在同一网站或跨站之间存在的相同或高度相似的内容。搜索引擎难以判断哪个版本应该排名，可能导致权重分散。AI 系统也倾向于引用内容独特性更高的来源。',
    usage: '内容审计时识别并合并或规范化重复页面，避免 SEO 权重稀释。',
    related: ['canonical-url'],
  },
  {
    id: 'e-e-a-t',
    term: 'E-E-A-T',
    termZh: '经验、专业知识、权威性、可信度',
    category: 'seo-basics',
    definition:
      'E-E-A-T 是 Google 搜索质量评估框架的核心概念，代表 Experience（经验）、Expertise（专业知识）、Authoritativeness（权威性）和 Trustworthiness（可信度）。高 E-E-A-T 内容更受 Google 算法青睐，同时也更容易被 AI 系统选为权威引用来源。',
    usage:
      '创作 YMYL（Your Money Your Life）类内容时，E-E-A-T 信号（作者简介、引用来源、实际案例）是排名的关键影响因素。',
    related: ['domain-authority', 'knowledge-graph', 'backlink'],
  },
  {
    id: 'featured-snippet',
    term: 'Featured Snippet',
    termZh: '精选摘要',
    category: 'seo-basics',
    definition:
      'Featured Snippet 是 Google 在搜索结果页最顶部展示的特殊内容框，直接摘录自某网页并以段落、列表或表格形式呈现。Featured Snippet 是"Position Zero"，通常具有极高的点击率，也是 AI 搜索引擎构建答案的重要数据来源。',
    usage: '使用清晰的问题-答案结构、简洁的段落长度（40–60字）来优化 Featured Snippet 获取。',
    related: ['ai-snippet', 'aeo', 'serp', 'zero-click-search'],
  },
  {
    id: 'indexability',
    term: 'Indexability',
    termZh: '可索引性',
    category: 'seo-basics',
    definition:
      'Indexability 是指搜索引擎爬取页面后是否会将其纳入索引的能力。通过 noindex 标签、密码保护或爬取错误阻止索引的页面无法出现在搜索结果中，也无法被 AI 搜索引擎引用。',
    usage: '检查重要落地页是否被意外设置了 noindex，是 SEO 审计的基础步骤。',
    related: ['crawlability', 'robots-txt'],
  },
  {
    id: 'intent-optimization',
    term: 'Intent Optimization',
    termZh: '搜索意图优化',
    category: 'seo-basics',
    definition:
      'Intent Optimization 是指根据用户搜索背后的真实需求（信息型、导航型、商业型、交易型）来优化内容的策略。AI 搜索引擎对意图的理解更加深入，这使得意图匹配成为内容排名的核心因素之一。',
    usage: '进行关键词研究时，不仅分析搜索量，更要判断关键词背后的用户意图类型。',
    related: ['conversational-search', 'long-tail-keywords', 'serp'],
  },
  {
    id: 'keyword-research',
    term: 'Keyword Research',
    termZh: '关键词研究',
    category: 'seo-basics',
    definition:
      'Keyword Research 是 SEO 的基础工作，通过分析用户在搜索引擎中使用的词汇和短语来指导内容策略。在 AI 搜索时代，Keyword Research 已扩展至分析用户在 ChatGPT、Perplexity 等平台中的自然语言提问模式。',
    usage: '制定内容日历、优化页面标题和元标签时，Keyword Research 数据是核心输入。',
    related: ['long-tail-keywords', 'intent-optimization', 'serp'],
  },
  {
    id: 'lcp',
    term: 'LCP',
    termZh: '最大内容绘制',
    category: 'seo-basics',
    definition:
      'LCP 是 Core Web Vitals 中的关键指标，衡量页面主要内容元素（如最大图片或文本块）完成渲染所需的时间。Google 建议 LCP 应在 2.5 秒内完成。LCP 慢的页面在排名竞争中处于劣势。',
    usage: '使用 Google PageSpeed Insights 或 Lighthouse 检测并优化 LCP，重点关注图片压缩、懒加载和服务器响应时间。',
    related: ['core-web-vitals', 'page-experience'],
  },
  {
    id: 'long-tail-keywords',
    term: 'Long-Tail Keywords',
    termZh: '长尾关键词',
    category: 'seo-basics',
    definition:
      'Long-Tail Keywords 是指更具体、搜索量相对较低但购买意图或信息需求更明确的搜索短语（通常 3 个词以上）。在 AI 搜索时代，用户以自然语言提问的习惯使得长尾关键词策略比以往更加重要。',
    usage: '创作深度解答类内容、FAQ 页面时，围绕长尾关键词布局能有效提升 AI 引用概率。',
    related: ['keyword-research', 'aeo', 'conversational-search'],
  },
  {
    id: 'meta-description',
    term: 'Meta Description',
    termZh: '元描述',
    category: 'seo-basics',
    definition:
      'Meta Description 是出现在搜索结果标题下方的简短描述文本（通常 150–160 字符），不直接影响排名，但显著影响用户点击决策（CTR）。清晰、有吸引力的 Meta Description 也有助于 AI 系统理解页面主题。',
    usage: '为每个重要页面撰写独特的 Meta Description，包含目标关键词和明确的价值主张。',
    related: ['ctr', 'serp'],
  },
  {
    id: 'page-experience',
    term: 'Page Experience',
    termZh: '页面体验',
    category: 'seo-basics',
    definition:
      'Page Experience 是 Google 的综合评估框架，包含 Core Web Vitals、移动端友好性、HTTPS 安全性和无侵入式插屏广告等信号。良好的页面体验是 Google 排名的重要加分项，也影响 AI 爬虫对内容质量的评判。',
    usage: '进行全面 SEO 审计时，Page Experience 指标应与内容质量指标并列检查。',
    related: ['core-web-vitals', 'lcp'],
  },
  {
    id: 'pagerank',
    term: 'PageRank',
    termZh: '网页排名算法',
    category: 'seo-basics',
    definition:
      'PageRank 是 Google 最早的核心排名算法，通过分析指向页面的链接数量和质量来评估页面重要性。虽然 PageRank 已演进为数百个信号的综合算法，但链接权威性仍是 Google 排名的核心基础之一。',
    usage: '理解为什么高质量外链建设（Link Building）对 SEO 长期效果至关重要。',
    related: ['backlink', 'domain-authority'],
  },
  {
    id: 'serp',
    term: 'SERP',
    termZh: '搜索引擎结果页',
    category: 'seo-basics',
    definition:
      'SERP（Search Engine Results Page）是用户输入搜索词后搜索引擎呈现的结果页面。现代 SERP 包含自然排名、付费广告、Featured Snippet、AI Overview 等多种结果类型，布局日趋复杂。',
    usage: '进行 SEO 分析时，首先分析目标关键词的 SERP 结构和竞争格局，判断优化策略。',
    related: ['ctr', 'featured-snippet', 'ai-overview'],
  },

  // ── Category 3: AI / LLM Tech ────────────────────────────────
  {
    id: 'ai-agent',
    term: 'AI Agent',
    termZh: 'AI 智能体',
    category: 'llm-tech',
    definition:
      'AI Agent 是指能够感知环境、制定计划并自主执行多步骤任务的 AI 系统。与单轮问答不同，AI Agent 可以调用工具、访问外部数据、持续迭代，直至完成复杂目标。',
    usage: '构建自动化工作流（如自动写作、代码调试、数据分析）时，AI Agent 是核心架构。',
    related: ['mcp', 'function-calling', 'rag', 'tool-use'],
  },
  {
    id: 'embedding',
    term: 'Embedding',
    termZh: '向量嵌入',
    category: 'llm-tech',
    definition:
      'Embedding 是将文本、图像等内容转换为高维数字向量的技术，使语义相似的内容在向量空间中距离更近。Embedding 是 RAG、语义搜索和 AI 内容推荐的基础技术。',
    usage: '构建基于语义相似度的搜索系统或 RAG 知识库时使用。',
    related: ['rag', 'vector-database', 'llm'],
  },
  {
    id: 'function-calling',
    term: 'Function Calling',
    termZh: '函数调用',
    category: 'llm-tech',
    definition:
      'Function Calling 是 LLM（如 GPT-4、Claude）的内置能力，允许模型在对话中识别需要调用外部函数的时机，并生成结构化的调用请求（函数名+参数）。它是让 AI 连接真实世界工具的轻量级方案。',
    usage: '需要 AI 查询实时数据（天气、股价）或执行简单动作（发邮件、查日历）时使用。',
    related: ['mcp', 'ai-agent', 'tool-use'],
  },
  {
    id: 'hallucination',
    term: 'Hallucination',
    termZh: 'AI 幻觉',
    category: 'llm-tech',
    definition:
      'Hallucination 指 LLM 生成看似合理但实际错误或虚构的内容。AI 幻觉是影响 AI 搜索可信度的核心问题，也是 GEO 优化需要通过高质量内容"纠正"模型认知的原因之一。',
    usage: '评估 AI 工具可靠性或制定内容策略以纠正 AI 对品牌的错误认知时。',
    related: ['rag', 'e-e-a-t', 'grounding'],
  },
  {
    id: 'grounding',
    term: 'Grounding',
    termZh: '事实锚定',
    category: 'llm-tech',
    definition:
      'Grounding 是指将 LLM 的输出锚定到可验证的事实来源，以减少幻觉、提高回答准确性的技术方法。通常通过 RAG、实时搜索或结构化数据注入实现。',
    usage: '构建企业级 AI 问答系统时，Grounding 是确保回答可靠性的核心设计原则。',
    related: ['rag', 'hallucination', 'vector-database'],
  },
  {
    id: 'llm',
    term: 'LLM',
    termZh: '大语言模型',
    category: 'llm-tech',
    definition:
      'LLM 是通过海量文本数据训练的大规模 AI 模型，能够理解和生成人类语言。代表产品包括 GPT-4、Claude、Gemini、DeepSeek 等。LLM 是现代 AI 搜索、AI Agent 和 GEO 优化的核心驱动力。',
    usage: '理解 AI 搜索引擎的底层机制，以及为什么内容质量和结构对 AI 引用至关重要。',
    related: ['geo', 'rag', 'ai-agent', 'llmo'],
  },
  {
    id: 'mcp',
    term: 'MCP',
    termZh: '模型上下文协议',
    category: 'llm-tech',
    definition:
      'MCP（Model Context Protocol）是 Anthropic 提出的开放标准协议，定义了 AI 模型与外部工具、数据源之间的标准化通信方式。MCP Server 是按照该协议暴露工具能力的服务端，Claude、Cursor 等 AI 工具可通过 MCP 连接文件系统、数据库、API 等。',
    usage: '为 AI Agent 添加可扩展工具能力时，MCP 是目前最主流的标准化方案。',
    related: ['function-calling', 'ai-agent', 'tool-use'],
  },
  {
    id: 'rag',
    term: 'RAG',
    termZh: '检索增强生成',
    category: 'llm-tech',
    definition:
      'RAG（Retrieval-Augmented Generation）是一种 AI 架构，在 LLM 生成回答前先从外部知识库中检索相关内容，将检索结果作为上下文注入模型。RAG 能有效减少幻觉、提升答案准确性，是企业 AI 应用的核心架构。',
    usage: '构建基于私有文档的 AI 问答系统（如企业知识库、客服机器人）时必用。',
    related: ['embedding', 'vector-database', 'hallucination', 'llm'],
  },
  {
    id: 'tool-use',
    term: 'Tool Use',
    termZh: '工具调用',
    category: 'llm-tech',
    definition:
      'Tool Use 是 AI 模型使用外部工具（搜索引擎、计算器、代码执行器、API 等）完成任务的能力。Claude 和 GPT-4 均支持 Tool Use，是构建实用 AI Agent 的基础能力。',
    usage: '当 AI 需要访问实时数据或执行超出纯文本生成范围的操作时。',
    related: ['function-calling', 'mcp', 'ai-agent'],
  },
  {
    id: 'vector-database',
    term: 'Vector Database',
    termZh: '向量数据库',
    category: 'llm-tech',
    definition:
      'Vector Database（向量数据库）专门存储和检索高维向量数据（Embedding），支持语义相似度搜索。代表产品包括 Pinecone、Weaviate、Chroma、pgvector 等。是构建 RAG 系统的核心基础设施。',
    usage: '构建 RAG 知识库或语义搜索系统时，需要选择合适的向量数据库存储文档 Embedding。',
    related: ['rag', 'embedding', 'ai-agent'],
  },
  {
    id: 'context-window',
    term: 'Context Window',
    termZh: '上下文窗口',
    category: 'llm-tech',
    definition:
      'Context Window 是 LLM 在单次对话或请求中能处理的最大 token 数量。上下文窗口越大，模型能"记住"和参考的信息越多。GPT-4 Turbo 支持 128K tokens，Claude 3.5 支持 200K tokens。',
    usage: '处理长文档分析或长对话时，需考虑模型的上下文窗口限制并设计合理的分块策略。',
    related: ['llm', 'rag', 'token'],
  },
  {
    id: 'token',
    term: 'Token',
    termZh: '词元',
    category: 'llm-tech',
    definition:
      'Token 是 LLM 处理文本的基本单位，通常对应一个词或子词。英文约 1 个词 = 1.3 tokens，中文约 1 个字 = 1–2 tokens。LLM 的定价和上下文窗口限制均以 token 计量。',
    usage: '估算 AI API 调用成本或判断内容是否超过模型处理上限时使用。',
    related: ['llm', 'context-window'],
  },
  {
    id: 'fine-tuning',
    term: 'Fine-tuning',
    termZh: '微调',
    category: 'llm-tech',
    definition:
      'Fine-tuning 是在预训练 LLM 基础上，使用特定领域数据进行进一步训练，使模型适应特定任务或风格。与 RAG 相比，Fine-tuning 将知识注入模型权重，但成本更高、更新更慢。',
    usage: '需要模型持续输出特定格式、风格或专业领域知识时，Fine-tuning 是 RAG 之外的选择。',
    related: ['llm', 'rag'],
  },
  {
    id: 'foundation-model',
    term: 'Foundation Model',
    termZh: '基础模型',
    category: 'llm-tech',
    definition:
      'Foundation Model 是在大规模通用数据上预训练的 AI 模型，可作为下游任务的基础。GPT-4、Claude、Gemini、LLaMA 等都是 Foundation Model。理解 Foundation Model 的训练机制有助于制定更有效的 GEO 内容策略。',
    usage: '选择合适的基础模型进行 Fine-tuning 或通过 API 集成到产品中。',
    related: ['llm', 'fine-tuning'],
  },

  // ── Category 4: Content & Structured Data ────────────────────
  {
    id: 'entity',
    term: 'Entity',
    termZh: '实体',
    category: 'content-data',
    definition:
      'Entity（实体）是搜索引擎和 AI 系统识别的真实世界对象——人物、地点、品牌、概念等。Google 的知识图谱和 AI 模型都基于实体理解内容，而非单纯匹配关键词。建立强实体关联是 GEO/SEO 的核心策略之一。',
    usage: '通过结构化数据标注品牌实体，帮助 Google 和 AI 系统正确识别你的品牌。',
    related: ['knowledge-graph', 'schema-markup', 'e-e-a-t'],
  },
  {
    id: 'faq-schema',
    term: 'FAQ Schema',
    termZh: 'FAQ 结构化数据',
    category: 'content-data',
    definition:
      'FAQ Schema 是 Schema.org 定义的结构化数据类型，用于标注页面中的问答内容。正确实施 FAQ Schema 可以让 Google 在搜索结果中展示可展开的问答，同时也让 AI 模型更容易提取和引用你的内容。',
    usage: '在包含常见问题的页面添加 FAQ Schema，提升 SERP 展示面积和 AI 引用概率。',
    related: ['schema-markup', 'aeo', 'featured-snippet'],
  },
  {
    id: 'knowledge-graph',
    term: 'Knowledge Graph',
    termZh: '知识图谱',
    category: 'content-data',
    definition:
      'Knowledge Graph 是 Google 维护的大型结构化知识库，存储实体及其关系。当 Google 在搜索结果右侧展示品牌信息卡时，就是从知识图谱中提取数据。进入 Google 知识图谱是品牌权威性的重要信号。',
    usage: '通过 Wikipedia 页面、Wikidata 词条、结构化数据等方式建立品牌知识图谱实体。',
    related: ['entity', 'schema-markup', 'e-e-a-t'],
  },
  {
    id: 'llms-txt',
    term: 'llms.txt',
    termZh: 'LLM 访问声明文件',
    category: 'content-data',
    definition:
      'llms.txt（或 llm.txt）是网站根目录下的文本文件，类似 robots.txt，用于向 AI 爬虫声明网站内容摘要、关键页面和访问权限。它是 GEO 优化的基础配置，帮助 AI 模型更准确地理解和索引你的网站。',
    usage: '任何希望提升 AI 搜索可见度的网站都应配置 llms.txt，尤其是内容型网站。',
    related: ['geo', 'crawlability', 'robots-txt'],
    link: '/llms-txt',
  },
  {
    id: 'robots-txt',
    term: 'robots.txt',
    termZh: '爬虫协议文件',
    category: 'content-data',
    definition:
      'robots.txt 是网站根目录下的文本文件，通过 Disallow/Allow 指令告知搜索引擎爬虫哪些页面可以抓取。错误配置 robots.txt 可能导致重要页面无法被索引，是技术 SEO 审计的必查项。',
    usage: '阻止爬虫访问后台页面、重复内容页，同时确保核心内容页对所有爬虫开放。',
    related: ['crawlability', 'llms-txt', 'indexability'],
  },
  {
    id: 'schema-markup',
    term: 'Schema Markup',
    termZh: '结构化数据标注',
    category: 'content-data',
    definition:
      'Schema Markup 是按照 Schema.org 规范添加的结构化数据代码（通常为 JSON-LD 格式），帮助搜索引擎和 AI 理解页面内容的具体含义。正确使用 Schema 可以获得 Rich Results（富结果），提升点击率和 AI 引用概率。',
    usage: '为文章、产品、FAQ、评测、本地商家等页面类型添加对应的 Schema 标注。',
    related: ['faq-schema', 'knowledge-graph', 'aeo'],
  },
  {
    id: 'json-ld',
    term: 'JSON-LD',
    termZh: 'JSON-LD',
    category: 'content-data',
    definition:
      'JSON-LD（JavaScript Object Notation for Linked Data）是 Google 推荐的结构化数据标注格式，以 <script type="application/ld+json"> 标签嵌入 HTML。JSON-LD 是实现 Schema Markup 最简洁、最易维护的方式。',
    usage: '在页面 <head> 或 <body> 中添加 JSON-LD 代码块，实现 Article、FAQ、Product 等 Schema 标注。',
    related: ['schema-markup', 'faq-schema', 'entity'],
  },
  {
    id: 'semantic-html',
    term: 'Semantic HTML',
    termZh: '语义化 HTML',
    category: 'content-data',
    definition:
      'Semantic HTML 是使用具有明确含义的 HTML 标签（如 <article>、<section>、<nav>、<h1>-<h6>）来组织页面内容，使搜索引擎和 AI 爬虫能更准确理解内容层级和含义，是 SEO 和 AI 可读性的基础。',
    usage: '构建内容页面时，使用语义化标签替代无意义的 <div>，提升 AI 内容解析准确性。',
    related: ['crawlability', 'schema-markup'],
  },
  {
    id: 'schema-org',
    term: 'Schema.org',
    termZh: 'Schema.org 规范',
    category: 'content-data',
    definition:
      'Schema.org 是由 Google、Bing、Yahoo、Yandex 联合维护的结构化数据词汇标准，定义了数千种内容类型（Article、Product、Person、Organization 等）的标注规范，是全球通用的网页语义标准。',
    usage: '实施结构化数据前，查阅 Schema.org 文档确认使用正确的类型和属性。',
    related: ['schema-markup', 'json-ld', 'faq-schema'],
  },

  // ── Category 5: Metrics & Measurement ────────────────────────
  {
    id: 'ai-share-of-voice',
    term: 'AI Share of Voice',
    termZh: 'AI 声量占比',
    category: 'metrics',
    definition:
      'AI Share of Voice（AI 声量占比）衡量在特定话题或品类的 AI 搜索结果中，你的品牌被提及的比例相对于竞品的份额。这是 GEO 效果评估的核心指标，类似传统 SEO 中的关键词排名份额。',
    usage: '定期监测品类相关问题中品牌 vs 竞品的 AI 提及比，评估 GEO 优化效果。',
    related: ['geo', 'brand-mention-rate', 'ai-visibility'],
    link: '/ai-checker',
  },
  {
    id: 'ai-visibility',
    term: 'AI Visibility',
    termZh: 'AI 可见度',
    category: 'metrics',
    definition:
      'AI Visibility（AI 可见度）是综合衡量品牌在各大 AI 搜索平台（ChatGPT、Perplexity、DeepSeek、豆包等）中被提及、引用和推荐程度的指标体系。高 AI 可见度意味着当用户向 AI 询问相关问题时，你的品牌会被主动提及。',
    usage: '进行 GEO 审计时，AI Visibility 是核心基准指标，需要跨多个 AI 平台同时监测。',
    related: ['geo', 'ai-share-of-voice', 'brand-mention-rate'],
    link: '/ai-checker',
  },
  {
    id: 'brand-mention-rate',
    term: 'Brand Mention Rate',
    termZh: '品牌提及率',
    category: 'metrics',
    definition:
      'Brand Mention Rate 是指在针对特定关键词或话题的 AI 搜索结果中，品牌被提及的频率百分比。例如，询问"最好的项目管理工具"100 次，品牌被提及 30 次，则提及率为 30%。',
    usage: '作为 GEO 优化效果的核心 KPI，与历史数据和竞品对比分析。',
    related: ['ai-visibility', 'ai-share-of-voice', 'geo'],
  },
  {
    id: 'citation-rate',
    term: 'Citation Rate',
    termZh: '内容引用率',
    category: 'metrics',
    definition:
      'Citation Rate 是指你的网站内容被 AI 搜索引擎（如 Perplexity、ChatGPT Search）作为来源引用的频率。高引用率表明你的内容被 AI 认为是权威来源，是 AEO/GEO 优化效果的直接体现。',
    usage: '监测哪些页面类型（教程、对比、Glossary）获得更高的 AI 引用率，指导内容策略。',
    related: ['aeo', 'geo', 'ai-visibility'],
  },
  {
    id: 'geo-audit',
    term: 'GEO Audit',
    termZh: 'GEO 审计',
    category: 'metrics',
    definition:
      'GEO Audit 是系统性评估网站在 AI 搜索引擎中可见度现状的过程，包括检查 AI 提及率、内容结构、llms.txt 配置、Schema 标注、竞品对比等维度。GEO 审计是制定 GEO 优化策略的起点。',
    usage: '每季度或重大内容更新前执行 GEO 审计，识别 AI 可见度差距并制定改进计划。',
    related: ['geo', 'ai-visibility', 'llms-txt'],
    link: '/ai-checker',
  },
  {
    id: 'prompt-coverage',
    term: 'Prompt Coverage',
    termZh: '提示词覆盖率',
    category: 'metrics',
    definition:
      'Prompt Coverage 衡量你的品牌在目标用户可能向 AI 提出的各类问题（Prompts）中出现的覆盖比例。用户可能用 50 种不同方式询问同一问题，Prompt Coverage 追踪你在这些变体中的总体出现率。',
    usage: '制定内容策略时，用 Prompt Coverage 矩阵识别哪些高频问题场景还未被覆盖。',
    related: ['geo', 'brand-mention-rate', 'topic-authority'],
  },
  {
    id: 'topic-authority',
    term: 'Topic Authority',
    termZh: '话题权威性',
    category: 'metrics',
    definition:
      'Topic Authority 是衡量网站在特定话题领域深度和广度覆盖程度的综合评估。拥有高 Topic Authority 的网站在该话题的所有相关问题上都有深度内容，更容易获得 Google 和 AI 的信任与引用。',
    usage: '通过构建话题集群（Topic Cluster）策略，系统性地建立某一细分领域的 Topic Authority。',
    related: ['e-e-a-t', 'content-gap', 'geo', 'aeo'],
  },
  {
    id: 'content-gap',
    term: 'Content Gap',
    termZh: '内容缺口',
    category: 'metrics',
    definition:
      'Content Gap 是指竞争对手内容覆盖而你的网站尚未涉及的关键词、话题或问题领域。通过 Content Gap 分析可以发现高价值内容机会，尤其在 AI 搜索时代，补齐内容缺口对提升 AI 引用率至关重要。',
    usage: '使用 Ahrefs 或 Semrush 的 Content Gap 工具，找到竞品有排名而你没有的目标关键词。',
    related: ['topic-authority', 'keyword-research', 'geo'],
  },
  {
    id: 'ai-crawl-budget',
    term: 'AI Crawl Budget',
    termZh: 'AI 爬取预算',
    category: 'metrics',
    definition:
      'AI Crawl Budget 是指 AI 爬虫在特定时间内愿意爬取你网站的页面数量上限。通过合理的内部链接结构、llms.txt 配置和页面优先级标注，可以引导 AI 爬虫优先爬取最重要的内容。',
    usage: '对于大型网站，需要通过 llms.txt 和 sitemap 明确指示 AI 爬虫的爬取优先级。',
    related: ['crawlability', 'llms-txt', 'indexability'],
  },
  {
    id: 'competitive-benchmarking',
    term: 'Competitive Benchmarking',
    termZh: '竞品对标分析',
    category: 'metrics',
    definition:
      'Competitive Benchmarking 是通过对比竞品在 AI 搜索中的表现（提及率、引用率、Share of Voice）来评估自身差距和机会的分析方法。在 GEO 领域，竞品对标是制定提升策略的重要依据。',
    usage: '定期分析竞品在目标问题场景中的 AI 提及情况，识别可以超越的内容切入点。',
    related: ['ai-share-of-voice', 'brand-mention-rate', 'geo-audit'],
  },
]

// ── 按字母获取首字母列表 ─────────────────────────────────────
export function getTermFirstLetters(terms: GlossaryTerm[]): string[] {
  const letters = new Set(terms.map((t) => t.term[0].toUpperCase()))
  return Array.from(letters).sort()
}

// ── 全部首字母（A-Z）─────────────────────────────────────────
export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
