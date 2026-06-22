/**
 * glossary-zh.ts — AI SEO 词汇表中文 override(按术语 id 映射)
 * 英文原数据见 glossary.ts;组件按当前语言回退。术语英文名/缩写保留原文。
 */
export const glossaryCategoriesZh: Record<string, string> = {
  'ai-core': 'AI 搜索优化核心',
  'seo-basics': '传统 SEO 基础',
  'llm-tech': 'AI / LLM 技术',
  'content-data': '内容与结构化数据',
  metrics: '指标与衡量',
}

export const glossaryTermsZh: Record<string, { definition: string; usage: string }> = {
  aeo: {
    definition:
      'AEO(答案引擎优化)是指优化内容,使其能被 AI 搜索系统、语音助手与问答平台直接当作"答案"引用。与传统 SEO 争夺排名链接不同,AEO 的目标是让你的内容成为引擎直接展示的权威来源。',
    usage: '当你希望内容出现在 Google 精选摘要、Perplexity 引用框、Siri 语音回答或 ChatGPT 检索结果中时使用。',
  },
  'ai-overview': {
    definition:
      'AI Overview 是 Google 在搜索结果页顶部展示的 AI 生成摘要,由 Gemini 综合多个来源生成。它取代了早期的 SGE 实验,是 Google 把 AI 融入主搜索结果的核心产品。',
    usage: '分析哪些内容结构更容易被 Google AI 概览引用,是 2024–2026 年的核心 SEO 课题。',
  },
  'ai-search': {
    definition:
      'AI 搜索指新一代由大模型驱动的搜索引擎,包括 Perplexity AI、Google AI 概览、Bing Copilot 与 ChatGPT Search。与关键词匹配式搜索不同,它们生成综合性答案。',
    usage: '评估品牌在新一代搜索生态中的可见度时,必须把 AI 搜索平台纳入监测范围。',
  },
  'ai-snippet': {
    definition:
      'AI Snippet 是 AI 搜索引擎从第三方页面摘取并在结果中展示的内容片段,通常附带来源链接。被选为 AI Snippet 的内容往往结构清晰、直接作答且具权威性。',
    usage: '优化段落结构,让 Perplexity、ChatGPT 等系统更容易将其摘取为 AI Snippet。',
  },
  geo: {
    definition:
      'GEO(生成式引擎优化)是专门面向 ChatGPT、Perplexity、Google AI 概览等生成式 AI 搜索引擎的内容方法论,研究如何让内容被生成的答案引用。',
    usage: '当你的目标是让品牌内容在 AI 生成答案中被频繁引用时,GEO 策略是核心工作。',
  },
  llmo: {
    definition:
      'LLMO(大语言模型优化)是面向 GPT-4、Claude、Gemini 等大模型优化内容可见度的策略,目标是确保你的品牌、产品或内容在大模型训练数据与实时检索中被准确呈现。',
    usage: '当品牌希望在用户向 AI 助手咨询产品推荐时被准确提及时使用。',
  },
  sge: {
    definition:
      'SGE 是 Google 实验性 AI 搜索功能的早期名称(2023–2024),在结果页顶部展示 AI 生成答案。SGE 于 2024 年正式演化为 Google AI 概览。',
    usage: '了解 Google AI 概览的历史、以及作为早期 AI-SEO 测试数据基线时,常会提到 SGE。',
  },
  'llm-training-data': {
    definition:
      '大模型训练数据是用于训练大语言模型的文本语料——网页内容、书籍、论文等。如果你的内容被抓取进训练数据,会塑造模型对你品牌的"理解"。高质量、权威的内容更有机会进入优质训练集。',
    usage: '评估你的内容策略是否有助于品牌在未来大模型版本中的知名度与准确呈现。',
  },
  'conversational-search': {
    definition:
      '对话式搜索是多轮、自然语言的搜索交互,区别于单条关键词查询。ChatGPT、Bing Copilot 与 Google Gemini 都支持。理解这一范式对内容语气很重要。',
    usage: '撰写长尾问答内容与 FAQ 页时,考虑对话式提问的模式。',
  },
  'prompt-engineering': {
    definition:
      '在 SEO 语境下,Prompt 工程指研究用户发给 AI 系统的典型查询,并优化内容结构以更好匹配 AI 内部的"检索 prompt"。理解 AI 如何被引导去检索内容,是 GEO 的重要部分。',
    usage: '分析用户在 ChatGPT 或 Perplexity 里输入的典型问题,并在内容中嵌入对应的答案结构。',
  },
  'zero-click-search': {
    definition:
      '零点击搜索是指用户在结果页直接获得答案、无需点击任何链接。AI 概览、精选摘要与知识图谱大幅提高了零点击占比。对内容团队而言,品牌曝光不再总等于流量。',
    usage: '分析 AI 搜索对自然流量的影响时,零点击率是核心参考指标。',
  },
  backlink: {
    definition:
      '反向链接(外链)是其他网站指向你网站的超链接。在传统 SEO 中,高质量外链是核心权威信号。在 AI SEO 时代,被权威媒体链接也有助于塑造大模型对品牌的正面认知。',
    usage: '围绕从高 DA/DR 网站获取外链来制定外链建设策略。',
  },
  'canonical-url': {
    definition:
      '规范链接(Canonical URL)是通过 <link rel="canonical"> 指定的权威页面版本,用于解决重复内容。当同一内容存在于多个 URL 时,canonical 告诉引擎应收录与排名哪个版本。',
    usage: '对有大量筛选参数 URL 的电商站、或同一文章跨子域发布的情况,这是必备配置。',
  },
  'core-web-vitals': {
    definition:
      '核心网页指标是 Google 衡量用户体验的一组页面性能指标——LCP(最大内容绘制)、INP(下次交互延迟)与 CLS(累积布局偏移)。它们是直接排名因素,也影响 AI 爬虫对页面的体验。',
    usage: '技术 SEO 审计的必查项——分数偏低会直接损害排名与用户体验。',
  },
  crawlability: {
    definition:
      '可抓取性指搜索引擎与 AI 爬虫能否访问、读取并收录你的页面。它受 robots.txt 配置、加载速度、JavaScript 渲染与内链结构影响。',
    usage: '在技术 SEO 审计中,检查 robots.txt 与抓取预算是否拦住了重要页面。',
  },
  ctr: {
    definition:
      'CTR(点击率)是展示中被点击的比例(点击数 ÷ 展示数)。随着零点击搜索上升,CTR 优化的含义在变化,但它仍是衡量标题与描述吸引力的核心指标。',
    usage: '优化标题标签与元描述时,以提升 CTR 为目标。',
  },
  'domain-authority': {
    definition:
      '域名权重(DA)是 Moz 的第三方评分(0–100),基于链接数量、质量、域名历史等预测域名的排名潜力。来自高 DA 网站的内容也更容易被 AI 系统视为权威。',
    usage: '评估外链建设目标的质量,或对比竞品的整体域名权重。',
  },
  'duplicate-content': {
    definition:
      '重复内容是站内或跨站相同或高度相似的内容。引擎难以判断哪个版本应排名,可能稀释权重,而 AI 系统倾向引用更独特的来源。',
    usage: '内容审计时识别重复页并合并或做 canonical,避免稀释 SEO 权重。',
  },
  'e-e-a-t': {
    definition:
      'E-E-A-T 是 Google 搜索质量框架的核心概念——经验(Experience)、专业(Expertise)、权威(Authoritativeness)与可信(Trustworthiness)。强 E-E-A-T 信号有助于传统与 AI 搜索都信任你的内容。',
    usage: '创作 YMYL(关乎金钱或生命)内容时,E-E-A-T 信号(作者简介、引用来源、真实案例)是关键排名因素。',
  },
  'featured-snippet': {
    definition:
      '精选摘要是 Google 在结果最顶部展示的特殊框,直接引用某页面的段落、列表或表格。作为"第零位置",它通常获得很高的 CTR,也是 AI 引用的优质来源。',
    usage: '用清晰的问答结构与简洁段落(40–60 词)来优化精选摘要。',
  },
  indexability: {
    definition:
      '可收录性指引擎抓取页面后是否会将其纳入索引。被 noindex、密码保护或抓取错误拦住的页面无法出现在结果中、也无法被 AI 搜索引用。',
    usage: '检查重要落地页是否被误设为 noindex,是基础的 SEO 审计步骤。',
  },
  'intent-optimization': {
    definition:
      '意图优化是按搜索背后的真实需求(信息型、导航型、商业型、交易型)来调整内容。AI 引擎对意图的理解更深,使意图匹配成为核心排名因素。',
    usage: '做关键词研究时,不只看搜索量,更要分析每个词背后的用户意图类型。',
  },
  'keyword-research': {
    definition:
      '关键词研究是 SEO 的基础工作——分析用户搜索的词与短语以指导内容策略。在 AI 搜索时代,它进一步延伸到分析用户在 ChatGPT、Perplexity 等如何提问。',
    usage: '规划内容日历、优化标题与元标签时,关键词研究数据是核心输入。',
  },
  lcp: {
    definition:
      'LCP 是核心网页指标的关键项,衡量主内容元素(如最大的图片或文本块)的渲染耗时。Google 建议在 2.5 秒以内;LCP 过慢会在排名上吃亏。',
    usage: '用 Google PageSpeed Insights 或 Lighthouse 测量并优化 LCP,重点关注图片压缩、懒加载与服务器响应时间。',
  },
  'long-tail-keywords': {
    definition:
      '长尾关键词是更具体的短语(通常 3 词以上),搜索量较低但意图更明确。随着用户用自然语言提问,长尾策略在 AI 搜索中比以往更重要。',
    usage: '在深度答案与 FAQ 页中定位长尾关键词,能有效提升 AI 引用概率。',
  },
  'meta-description': {
    definition:
      '元描述是结果中标题下方的简短文字(通常 150–160 字符)。它不直接影响排名,但强烈影响点击(CTR),清晰的元描述也有助于 AI 理解页面主旨。',
    usage: '为每个重要页面撰写独特的元描述,包含目标关键词与清晰的价值主张。',
  },
  'page-experience': {
    definition:
      '页面体验是 Google 的综合框架,涵盖核心网页指标、移动友好、HTTPS 与无侵入式弹窗。良好的页面体验是排名加分项,也影响 AI 爬虫对内容的体验。',
    usage: '做全面 SEO 审计时,把页面体验指标与内容质量指标一起检查。',
  },
  pagerank: {
    definition:
      'PageRank 是 Google 最早的核心排名算法,通过入链的数量与质量判断页面重要性。尽管已演化为数百个信号,链接权威仍是排名的核心基础。',
    usage: '理解为什么高质量外链建设对长期 SEO 成效至关重要。',
  },
  serp: {
    definition:
      'SERP(搜索结果页)是引擎在查询后展示的页面。现代 SERP 混合了自然结果、广告、精选摘要、AI 概览等,版式日益复杂。',
    usage: 'SEO 分析时,先研究目标关键词的 SERP 结构与竞争格局。',
  },
  'ai-agent': {
    definition:
      'AI Agent(智能体)是能感知环境、规划并自主执行多步任务的 AI 系统。与单轮问答不同,智能体能调用工具、访问外部数据并迭代,直到完成复杂目标。',
    usage: '构建自动写作、代码调试或数据分析等自动化工作流时,智能体是核心架构。',
  },
  embedding: {
    definition:
      'Embedding(向量嵌入)把文本、图像等内容转换为高维数值向量,使语义相近的内容在向量空间中距离更近。它是 RAG、语义搜索与 AI 推荐的底层基础。',
    usage: '构建语义相似度搜索系统或 RAG 知识库时使用。',
  },
  'function-calling': {
    definition:
      'Function Calling(函数调用)是大模型(如 GPT-4、Claude)内置的能力:识别何时需要外部函数,并生成结构化的调用请求(名称+参数)。它是把 AI 连接到现实工具的轻量方式。',
    usage: '当 AI 需要实时数据(天气、股价)或简单操作(发邮件、查日程)时使用。',
  },
  hallucination: {
    definition:
      '幻觉(Hallucination)是大模型生成的听起来合理、实则错误或编造的内容。它是 AI 搜索的核心信任问题,也是 GEO 用高质量内容去"纠正"模型认知的原因。',
    usage: '评估某 AI 工具的可靠性,或规划内容以纠正 AI 对你品牌的错误认知时。',
  },
  grounding: {
    definition:
      'Grounding(接地)是把大模型输出锚定到可验证来源,以减少幻觉、提升准确性,通常通过 RAG、实时搜索或注入结构化数据实现。',
    usage: 'Grounding 是确保企业 AI 问答系统答案可靠性的核心设计原则。',
  },
  llm: {
    definition:
      'LLM(大语言模型)是基于海量文本训练、能理解与生成人类语言的大型 AI 模型,如 GPT-4、Claude、Gemini 与 DeepSeek。大模型是现代 AI 搜索、AI 智能体与 GEO 的核心引擎。',
    usage: '理解 AI 搜索的底层机制,以及为什么内容质量与结构对 AI 引用很重要。',
  },
  mcp: {
    definition:
      'MCP(模型上下文协议)是 Anthropic 提出的开放标准,定义 AI 模型如何与外部工具和数据源通信。MCP Server 按协议暴露工具能力;Claude、Cursor 等均支持。',
    usage: '为 AI 智能体添加可扩展的工具能力时,MCP 是当前领先的标准。',
  },
  rag: {
    definition:
      'RAG(检索增强生成)是一种 AI 架构:在大模型作答前,先从外部知识库检索相关内容并作为上下文注入。RAG 能减少幻觉、提升准确性——是企业 AI 的核心。',
    usage: '在私有文档上构建 AI 问答(如企业知识库、客服机器人)时必备。',
  },
  'tool-use': {
    definition:
      'Tool Use(工具使用)是 AI 模型使用外部工具(搜索引擎、计算器、代码执行器、API)完成任务的能力。Claude 与 GPT-4 都支持——是实用 AI 智能体的基础。',
    usage: '当 AI 需要纯文本生成之外的实时数据或操作时。',
  },
  'vector-database': {
    definition:
      '向量数据库存储与检索高维向量(embedding),用于语义相似度搜索。如 Pinecone、Weaviate、Chroma 与 pgvector——RAG 系统的核心基础设施。',
    usage: '构建 RAG 知识库或语义搜索时,需要合适的向量数据库来存储文档向量。',
  },
  'context-window': {
    definition:
      '上下文窗口是大模型单次请求能处理的最大 token 数。窗口越大,模型能"记住"的内容越多。GPT-4 Turbo 支持 128K token;Claude 3.5 支持 200K。',
    usage: '分析长文档或长对话时,需考虑模型的上下文窗口上限并设计合理的分块。',
  },
  token: {
    definition:
      'Token 是大模型处理的基本单位,通常是一个词或子词。大致 1 个英文单词 ≈ 1.3 token;1 个汉字 ≈ 1–2 token。大模型的计费与上下文上限都以 token 计。',
    usage: '用于估算 AI API 成本,或判断内容是否超出模型上限。',
  },
  'fine-tuning': {
    definition:
      '微调(Fine-tuning)是在预训练大模型上用领域数据继续训练,使其适配某任务或风格。与 RAG 相比,微调把知识固化进模型权重,但成本更高、更新更慢。',
    usage: '当你需要模型稳定输出特定格式、风格或领域知识时,微调是 RAG 的替代方案。',
  },
  'foundation-model': {
    definition:
      '基础模型(Foundation Model)在大规模通用数据上预训练,作为下游任务的基座。GPT-4、Claude、Gemini 与 LLaMA 都是基础模型。',
    usage: '选择合适的基础模型来微调,或通过 API 集成进产品。',
  },
  entity: {
    definition:
      '实体(Entity)是引擎与 AI 系统能识别的现实世界对象——人物、地点、品牌、概念。Google 知识图谱与 AI 模型通过实体而非仅关键词匹配来理解内容。强实体关联是核心的 GEO/SEO 策略。',
    usage: '用结构化数据标记你的品牌实体,让 Google 与 AI 系统正确识别它。',
  },
  'faq-schema': {
    definition:
      'FAQ Schema 是 Schema.org 的结构化数据类型,用于标记页面上的问答。正确实现后,可让 Google 在结果中展示可展开的问答,也让 AI 模型更容易摘取并引用你的内容。',
    usage: '为含常见问题的页面添加 FAQ Schema,扩大 SERP 占位并提高 AI 引用概率。',
  },
  'knowledge-graph': {
    definition:
      '知识图谱是 Google 庞大的结构化知识库,记录实体及其关系。结果右侧的品牌信息卡即取自其中。进入知识图谱是重要的品牌权威信号。',
    usage: '通过维基百科页面、Wikidata 条目与结构化数据建立你品牌的知识图谱实体。',
  },
  'llms-txt': {
    definition:
      'llms.txt(或 llm.txt)是放在网站根目录、类似 robots.txt 的文本文件,用于声明内容摘要、关键页面与对 AI 爬虫的访问。它是基础的 GEO 配置,帮 AI 模型理解并索引你的站点。',
    usage: '任何想提升 AI 搜索可见度的网站都应配置 llms.txt——尤其内容密集型站点。',
  },
  'robots-txt': {
    definition:
      'robots.txt 是放在网站根目录的文本文件,通过 Disallow/Allow 告诉爬虫可抓取哪些页面。配置错误可能让重要页面无法进入索引——技术 SEO 审计的必查项。',
    usage: '屏蔽爬虫对后台与重复页的访问,同时对所有爬虫开放核心内容。',
  },
  'schema-markup': {
    definition:
      'Schema 标记是按 Schema.org 规范添加的结构化数据代码(通常为 JSON-LD),帮引擎与 AI 理解页面含义。正确使用可获得富结果并提升可见度。',
    usage: '为文章、商品、FAQ、评价、本地商户等页面添加合适的 Schema。',
  },
  'json-ld': {
    definition:
      'JSON-LD(链接数据的 JavaScript 对象表示法)是 Google 推荐的结构化数据格式,通过 <script type="application/ld+json"> 标签嵌入 HTML。',
    usage: '在页面 <head> 或 <body> 中添加 JSON-LD 块,实现 Article、FAQ、Product 等 Schema。',
  },
  'semantic-html': {
    definition:
      '语义化 HTML 使用有含义的标签(如 <article>、<section>、<nav>、<h1>–<h6>)来组织内容,使引擎与 AI 爬虫更准确地理解层级与含义——对 SEO 与 AI 可读性都很重要。',
    usage: '构建内容页时,用语义化标签替代无意义的 <div>,提升 AI 解析准确性。',
  },
  'schema-org': {
    definition:
      'Schema.org 是由 Google、Bing、Yahoo 与 Yandex 共同维护的结构化数据词汇标准,定义了上千种内容类型(Article、Product、Person、Organization 等)——通用的网页语义语言。',
    usage: '实现结构化数据前,查阅 Schema.org 文档确认正确的类型与属性。',
  },
  'ai-share-of-voice': {
    definition:
      'AI 声量(AI Share of Voice)衡量在某主题或品类的 AI 搜索结果中,你的品牌相对竞品被提及的频率。它是核心 GEO 指标,类比传统 SEO 中的关键词排名份额。',
    usage: '定期监测品类问题上品牌与竞品的 AI 提及,以衡量 GEO 成效。',
  },
  'ai-visibility': {
    definition:
      'AI 可见度是衡量品牌在主流 AI 平台(ChatGPT、Perplexity、DeepSeek、豆包等)被提及、引用与推荐频率的指标体系。高 AI 可见度意味着用户向 AI 提相关问题时你的品牌会出现。',
    usage: 'GEO 审计中,AI 可见度是核心基线指标,须跨多个 AI 平台监测。',
  },
  'brand-mention-rate': {
    definition:
      '品牌提及率是在某关键词或主题的 AI 搜索结果中提及你品牌的百分比。例如"最佳项目管理工具"被问 100 次、你的品牌出现 30 次,则提及率为 30%。',
    usage: '衡量 GEO 成效的核心 KPI——与历史数据及竞品对比。',
  },
  'citation-rate': {
    definition:
      '引用率是你的内容被 AI 搜索引擎(如 Perplexity、ChatGPT Search)作为来源引用的频率。高引用率意味着 AI 把你的内容视为权威——是 AEO/GEO 成功的直接衡量。',
    usage: '监测哪类页面(教程、对比、术语表)获得更高 AI 引用率,以指导内容策略。',
  },
  'geo-audit': {
    definition:
      'GEO 审计系统性评估网站当前的 AI 搜索可见度——检查 AI 提及率、内容结构、llms.txt 配置、Schema 标记、竞品对比等。它是 GEO 策略的起点。',
    usage: '每季度或在重大内容更新前做一次 GEO 审计,发现可见度缺口并规划改进。',
  },
  'prompt-coverage': {
    definition:
      'Prompt 覆盖度衡量在用户可能提出的、关于你品类的问题(prompt)中,你的品牌出现的比例。同一件事用户可能有 50 种问法;Prompt 覆盖度跟踪你在这些变体中的整体出现情况。',
    usage: '用 Prompt 覆盖度矩阵找出你尚未覆盖的高频问题场景。',
  },
  'topic-authority': {
    definition:
      '主题权威度衡量网站对某一主题领域的覆盖深度与广度。主题权威度高的网站对所有相关问题都有深度内容,更能赢得 Google 与 AI 的信任与引用。',
    usage: '通过主题集群策略,在细分领域系统性地建立主题权威度。',
  },
  'content-gap': {
    definition:
      '内容缺口是竞品覆盖、而你网站没有覆盖的关键词、主题或问题领域。内容缺口分析能挖掘高价值机会——在 AI 搜索时代,补齐缺口是提升引用率的关键。',
    usage: '用 Ahrefs 或 Semrush 的内容缺口工具,找出竞品有排名而你没有的目标关键词。',
  },
  'ai-crawl-budget': {
    definition:
      'AI 抓取预算是 AI 爬虫在给定时间内从你网站抓取页面数量的上限。合理的内链结构、llms.txt 配置与页面优先级信号能引导它们优先抓取你最重要的内容。',
    usage: '对大型站点,用 llms.txt 与站点地图清晰地向 AI 爬虫表明优先级。',
  },
  'competitive-benchmarking': {
    definition:
      '竞品基准分析通过对比竞品的 AI 搜索表现(提及率、引用率、声量)来评估你的差距与机会。在 GEO 中,它是改进策略的重要依据。',
    usage: '定期分析竞品在目标问题场景上的 AI 提及,找出你能取胜的内容切入点。',
  },
}
