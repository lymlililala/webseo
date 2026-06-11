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
    name: 'AI Search Optimization Core',
    nameEn: 'AI Search Optimization',
    icon: 'smart_toy',
    color: '#6366F1',
    description: 'Core next-gen AI-search concepts like GEO, AEO and LLMO',
  },
  {
    id: 'seo-basics',
    name: 'Traditional SEO Basics',
    nameEn: 'Traditional SEO',
    icon: 'travel_explore',
    color: '#10B981',
    description: 'Classic SEO terms like E-E-A-T, SERP and Backlink',
  },
  {
    id: 'llm-tech',
    name: 'AI / LLM Tech',
    nameEn: 'AI & LLM Tech',
    icon: 'memory',
    color: '#8B5CF6',
    description: 'AI architecture terms like MCP, RAG and Embedding',
  },
  {
    id: 'content-data',
    name: 'Content & Structured Data',
    nameEn: 'Content & Structured Data',
    icon: 'data_object',
    color: '#F59E0B',
    description: 'Content standards like llms.txt, Schema Markup and Knowledge Graph',
  },
  {
    id: 'metrics',
    name: 'Metrics & Measurement',
    nameEn: 'Metrics & Measurement',
    icon: 'monitoring',
    color: '#EF4444',
    description: 'Metrics like AI visibility, brand mention rate and topical authority',
  },
]

export const glossaryTerms: GlossaryTerm[] = [
  // ── Category 1: AI Search Optimization Core ──────────────────
  {
    id: 'aeo',
    term: 'AEO',
    termZh: 'Answer Engine Optimization',
    category: 'ai-core',
    definition:
      'AEO (Answer Engine Optimization) is the practice of optimizing content so it can be directly cited as an "answer" by AI search systems, voice assistants and Q&A platforms. Unlike traditional SEO competing for ranking links, AEO aims to make your content the authoritative source the engine shows directly.',
    usage: 'Use it when you want your content to appear in Google Featured Snippets, Perplexity citation boxes, Siri voice answers or ChatGPT retrieval results.',
    related: ['geo', 'sge', 'featured-snippet', 'zero-click-search'],
    link: '/aeo-nav',
  },
  {
    id: 'ai-overview',
    term: 'AI Overview',
    termZh: 'AI Overview (Google)',
    category: 'ai-core',
    definition:
      'AI Overview is the AI-generated summary Google shows at the top of the SERP, synthesized from multiple sources by Gemini. It replaced the earlier SGE experiment and is Google’s core product for weaving AI into main search results.',
    usage: 'Analyzing which content structures are more likely to be cited in Google AI Overviews is a core SEO topic for 2024–2026.',
    related: ['sge', 'geo', 'aeo', 'serp'],
  },
  {
    id: 'ai-search',
    term: 'AI Search',
    termZh: 'AI Search',
    category: 'ai-core',
    definition:
      'AI Search refers to the new generation of LLM-driven search engines, including Perplexity AI, Google AI Overviews, Bing Copilot and ChatGPT Search. Unlike keyword-matching search, they generate synthesized answers.',
    usage: 'When assessing brand visibility in the next-gen search ecosystem, AI Search platforms must be part of your monitoring scope.',
    related: ['llm', 'geo', 'llmo'],
  },
  {
    id: 'ai-snippet',
    term: 'AI Snippet',
    termZh: 'AI Snippet',
    category: 'ai-core',
    definition:
      'An AI Snippet is a content excerpt that AI search engines pull from third-party pages and show in results, usually with a source link. Content chosen as an AI Snippet tends to be clearly structured, directly answering and authoritative.',
    usage: 'Optimize paragraph structure so it’s easier for systems like Perplexity and ChatGPT to extract as an AI Snippet.',
    related: ['aeo', 'featured-snippet', 'citation-rate'],
  },
  {
    id: 'geo',
    term: 'GEO',
    termZh: 'Generative Engine Optimization',
    category: 'ai-core',
    definition:
      'GEO (Generative Engine Optimization) is a content methodology aimed specifically at generative AI search engines like ChatGPT, Perplexity and Google AI Overviews. It studies how to get content cited in generated answers.',
    usage: 'GEO strategy is core work when your goal is for brand content to be frequently cited in AI-generated answers.',
    related: ['aeo', 'llmo', 'ai-overview', 'rag'],
    link: '/geo-nav',
  },
  {
    id: 'llmo',
    term: 'LLMO',
    termZh: 'Large Language Model Optimization',
    category: 'ai-core',
    definition:
      'LLMO (Large Language Model Optimization) is the strategy of optimizing content visibility for LLMs like GPT-4, Claude and Gemini. The goal is to ensure your brand, product or content is accurately represented in LLM training data and real-time retrieval.',
    usage: 'When a brand wants to be accurately mentioned when users ask an AI assistant for product recommendations.',
    related: ['geo', 'llm', 'ai-visibility', 'brand-mention-rate'],
  },
  {
    id: 'sge',
    term: 'SGE',
    termZh: 'Search Generative Experience',
    category: 'ai-core',
    definition:
      'SGE was the early name for Google’s experimental AI search feature (2023–2024) that showed AI-generated answers at the top of the results page. SGE officially evolved into Google AI Overviews in 2024.',
    usage: 'SGE is often referenced when understanding the history of Google AI Overviews and as a baseline for early AI-SEO test data.',
    related: ['ai-overview', 'geo', 'serp'],
  },
  {
    id: 'llm-training-data',
    term: 'LLM Training Data',
    termZh: 'LLM Training Data',
    category: 'ai-core',
    definition:
      'LLM Training Data is the text corpus used to train large language models — web content, books, papers and more. If your content is crawled into training data, it shapes the model’s "understanding" of your brand. Quality, authoritative content has a better chance of entering high-quality training sets.',
    usage: 'Assessing whether your content strategy helps your brand’s awareness and accurate representation in future LLM versions.',
    related: ['llm', 'llmo'],
  },
  {
    id: 'conversational-search',
    term: 'Conversational Search',
    termZh: 'Conversational Search',
    category: 'ai-core',
    definition:
      'Conversational Search is multi-turn, natural-language search interaction, distinct from single keyword queries. ChatGPT, Bing Copilot and Google Gemini all support it. Understanding this paradigm matters for content tone.',
    usage: 'Consider conversational question patterns when writing long-tail Q&A content and FAQ pages.',
    related: ['aeo', 'intent-optimization', 'long-tail-keywords'],
  },
  {
    id: 'prompt-engineering',
    term: 'Prompt Engineering',
    termZh: 'Prompt Engineering (SEO view)',
    category: 'ai-core',
    definition:
      'In an SEO context, Prompt Engineering means studying the typical queries users send to AI systems and optimizing content structure to better match the AI’s internal "retrieval prompts." Understanding how AI is prompted to retrieve content is an important part of GEO.',
    usage: 'Analyze typical questions users type into ChatGPT or Perplexity and embed the corresponding answer structures in your content.',
    related: ['geo', 'aeo', 'rag'],
  },
  {
    id: 'zero-click-search',
    term: 'Zero-Click Search',
    termZh: 'Zero-Click Search',
    category: 'ai-core',
    definition:
      'Zero-Click Search is when users get their answer right on the results page without clicking any link. AI Overviews, Featured Snippets and the Knowledge Graph have significantly raised the zero-click share. For content teams, brand exposure no longer always means traffic.',
    usage: 'Zero-click rate is a core reference metric when analyzing AI search’s impact on organic traffic.',
    related: ['ai-overview', 'featured-snippet', 'serp', 'ctr'],
  },

  // ── Category 2: Traditional SEO Fundamentals ─────────────────
  {
    id: 'backlink',
    term: 'Backlink',
    termZh: 'Backlink',
    category: 'seo-basics',
    definition:
      'A Backlink is a hyperlink from another site to yours. In traditional SEO, high-quality backlinks are a core authority signal. In the AI SEO era, being linked by authoritative media also helps shape positive LLM perception of a brand.',
    usage: 'Build a link-building strategy centered on earning backlinks from high-DA/DR sites.',
    related: ['domain-authority', 'e-e-a-t', 'pagerank'],
  },
  {
    id: 'canonical-url',
    term: 'Canonical URL',
    termZh: 'Canonical URL',
    category: 'seo-basics',
    definition:
      'A Canonical URL is the authoritative page version specified via <link rel="canonical">, used to resolve duplicate content. When the same content exists at multiple URLs, the canonical tells engines which version to index and rank.',
    usage: 'Essential for e-commerce sites with many filter-parameter URLs, or when the same article is published across subdomains.',
    related: ['crawlability', 'indexability', 'duplicate-content'],
  },
  {
    id: 'core-web-vitals',
    term: 'Core Web Vitals',
    termZh: 'Core Web Vitals',
    category: 'seo-basics',
    definition:
      'Core Web Vitals are Google’s set of page-performance metrics for user experience — LCP (Largest Contentful Paint), INP (Interaction to Next Paint) and CLS (Cumulative Layout Shift). They’re direct ranking factors and also affect how AI crawlers experience a page.',
    usage: 'A must-check in technical SEO audits — low scores directly hurt rankings and user experience.',
    related: ['lcp', 'page-experience'],
  },
  {
    id: 'crawlability',
    term: 'Crawlability',
    termZh: 'Crawlability',
    category: 'seo-basics',
    definition:
      'Crawlability is whether search engines and AI crawlers can access, read and index your pages. It’s affected by robots.txt config, load speed, JavaScript rendering and internal link structure.',
    usage: 'In a technical SEO audit, check whether robots.txt and crawl budget are blocking important pages.',
    related: ['robots-txt', 'indexability'],
  },
  {
    id: 'ctr',
    term: 'CTR',
    termZh: 'Click-Through Rate',
    category: 'seo-basics',
    definition:
      'CTR (Click-Through Rate) is the share of impressions that get clicked (clicks ÷ impressions). As zero-click search rises, the meaning of CTR optimization is shifting, but it remains a core measure of title and meta-description appeal.',
    usage: 'Aim to raise CTR when optimizing title tags and meta descriptions.',
    related: ['serp', 'zero-click-search'],
  },
  {
    id: 'domain-authority',
    term: 'Domain Authority',
    termZh: 'Domain Authority',
    category: 'seo-basics',
    definition:
      'Domain Authority (DA) is Moz’s third-party score (0–100) predicting a domain’s ranking potential, based on link quantity, quality, domain history and more. Content from high-DA sites is also more likely seen by AI systems as authoritative.',
    usage: 'Assessing the quality of link-building targets or comparing competitors’ overall domain authority.',
    related: ['backlink', 'e-e-a-t', 'pagerank'],
  },
  {
    id: 'duplicate-content',
    term: 'Duplicate Content',
    termZh: 'Duplicate Content',
    category: 'seo-basics',
    definition:
      'Duplicate Content is identical or highly similar content within a site or across sites. Engines struggle to decide which version should rank, potentially diluting equity, and AI systems tend to cite more unique sources.',
    usage: 'During a content audit, identify and merge or canonicalize duplicate pages to avoid diluting SEO equity.',
    related: ['canonical-url'],
  },
  {
    id: 'e-e-a-t',
    term: 'E-E-A-T',
    termZh: 'Experience, Expertise, Authoritativeness, Trustworthiness',
    category: 'seo-basics',
    definition:
      'E-E-A-T is a core concept in Google’s search quality framework — Experience, Expertise, Authoritativeness and Trustworthiness. Strong E-E-A-T signals help both traditional and AI search trust your content.',
    usage:
      'When creating YMYL (Your Money or Your Life) content, E-E-A-T signals (author bios, cited sources, real cases) are key ranking factors.',
    related: ['domain-authority', 'knowledge-graph', 'backlink'],
  },
  {
    id: 'featured-snippet',
    term: 'Featured Snippet',
    termZh: 'Featured Snippet',
    category: 'seo-basics',
    definition:
      'A Featured Snippet is the special box Google shows at the very top of results, quoted directly from a page as a paragraph, list or table. As "Position Zero" it usually gets a very high CTR and is also a prime AI citation source.',
    usage: 'Optimize for Featured Snippets with a clear question-answer structure and concise paragraphs (40–60 words).',
    related: ['ai-snippet', 'aeo', 'serp', 'zero-click-search'],
  },
  {
    id: 'indexability',
    term: 'Indexability',
    termZh: 'Indexability',
    category: 'seo-basics',
    definition:
      'Indexability is whether an engine will include a page in its index after crawling it. Pages blocked via noindex, password protection or crawl errors can’t appear in results or be cited by AI search.',
    usage: 'Checking whether important landing pages were accidentally set to noindex is a basic SEO audit step.',
    related: ['crawlability', 'robots-txt'],
  },
  {
    id: 'intent-optimization',
    term: 'Intent Optimization',
    termZh: 'Search Intent Optimization',
    category: 'seo-basics',
    definition:
      'Intent Optimization tailors content to the real need behind a search (informational, navigational, commercial, transactional). AI engines understand intent more deeply, making intent matching a core ranking factor.',
    usage: 'In keyword research, analyze not just volume but the type of user intent behind each keyword.',
    related: ['conversational-search', 'long-tail-keywords', 'serp'],
  },
  {
    id: 'keyword-research',
    term: 'Keyword Research',
    termZh: 'Keyword Research',
    category: 'seo-basics',
    definition:
      'Keyword Research is foundational SEO work — analyzing the words and phrases users search to guide content strategy. In the AI search era it now extends to analyzing how users ask questions on ChatGPT, Perplexity and more.',
    usage: 'Keyword Research data is a core input when planning a content calendar and optimizing titles and meta tags.',
    related: ['long-tail-keywords', 'intent-optimization', 'serp'],
  },
  {
    id: 'lcp',
    term: 'LCP',
    termZh: 'Largest Contentful Paint',
    category: 'seo-basics',
    definition:
      'LCP is a key Core Web Vitals metric measuring how long the main content element (e.g. the largest image or text block) takes to render. Google recommends under 2.5s; slow LCP is a ranking disadvantage.',
    usage: 'Use Google PageSpeed Insights or Lighthouse to measure and optimize LCP, focusing on image compression, lazy loading and server response time.',
    related: ['core-web-vitals', 'page-experience'],
  },
  {
    id: 'long-tail-keywords',
    term: 'Long-Tail Keywords',
    termZh: 'Long-Tail Keywords',
    category: 'seo-basics',
    definition:
      'Long-Tail Keywords are more specific phrases (usually 3+ words) with lower volume but clearer intent. As users ask in natural language, long-tail strategy matters more than ever in AI search.',
    usage: 'Targeting long-tail keywords in in-depth answers and FAQ pages effectively raises AI citation odds.',
    related: ['keyword-research', 'aeo', 'conversational-search'],
  },
  {
    id: 'meta-description',
    term: 'Meta Description',
    termZh: 'Meta Description',
    category: 'seo-basics',
    definition:
      'A Meta Description is the short text under the title in results (usually 150–160 chars). It doesn’t directly affect ranking but strongly influences clicks (CTR), and a clear one also helps AI understand the page’s gist.',
    usage: 'Write a unique meta description for each important page, including the target keyword and a clear value proposition.',
    related: ['ctr', 'serp'],
  },
  {
    id: 'page-experience',
    term: 'Page Experience',
    termZh: 'Page Experience',
    category: 'seo-basics',
    definition:
      'Page Experience is Google’s composite framework covering Core Web Vitals, mobile-friendliness, HTTPS and the absence of intrusive interstitials. Good page experience is a ranking plus and affects how AI crawlers experience content.',
    usage: 'In a full SEO audit, check Page Experience metrics alongside content-quality metrics.',
    related: ['core-web-vitals', 'lcp'],
  },
  {
    id: 'pagerank',
    term: 'PageRank',
    termZh: 'PageRank',
    category: 'seo-basics',
    definition:
      'PageRank was Google’s earliest core ranking algorithm, judging page importance by the number and quality of inbound links. Though it has evolved into hundreds of signals, link authority remains a core foundation of ranking.',
    usage: 'Understanding why high-quality link building matters for long-term SEO results.',
    related: ['backlink', 'domain-authority'],
  },
  {
    id: 'serp',
    term: 'SERP',
    termZh: 'Search Engine Results Page',
    category: 'seo-basics',
    definition:
      'A SERP (Search Engine Results Page) is what the engine shows after a query. Modern SERPs mix organic results, ads, Featured Snippets, AI Overviews and more, with increasingly complex layouts.',
    usage: 'In SEO analysis, first study the SERP structure and competitive landscape for a target keyword.',
    related: ['ctr', 'featured-snippet', 'ai-overview'],
  },

  // ── Category 3: AI / LLM Tech ────────────────────────────────
  {
    id: 'ai-agent',
    term: 'AI Agent',
    termZh: 'AI Agent',
    category: 'llm-tech',
    definition:
      'An AI Agent is an AI system that can perceive its environment, plan, and autonomously execute multi-step tasks. Unlike single-turn Q&A, an agent can call tools, access external data and iterate until a complex goal is met.',
    usage: 'Agents are the core architecture when building automated workflows like auto-writing, code debugging or data analysis.',
    related: ['mcp', 'function-calling', 'rag', 'tool-use'],
  },
  {
    id: 'embedding',
    term: 'Embedding',
    termZh: 'Embedding',
    category: 'llm-tech',
    definition:
      'An Embedding converts text, images and other content into high-dimensional numeric vectors so semantically similar content sits closer in vector space. Embeddings underpin RAG, semantic search and AI recommendations.',
    usage: 'Used when building semantic-similarity search systems or RAG knowledge bases.',
    related: ['rag', 'vector-database', 'llm'],
  },
  {
    id: 'function-calling',
    term: 'Function Calling',
    termZh: 'Function Calling',
    category: 'llm-tech',
    definition:
      'Function Calling is a built-in ability of LLMs (like GPT-4, Claude) to recognize when an external function is needed and produce a structured call request (name + parameters). It’s a lightweight way to connect AI to real-world tools.',
    usage: 'Used when AI needs real-time data (weather, stock prices) or simple actions (send email, check calendar).',
    related: ['mcp', 'ai-agent', 'tool-use'],
  },
  {
    id: 'hallucination',
    term: 'Hallucination',
    termZh: 'Hallucination',
    category: 'llm-tech',
    definition:
      'A Hallucination is plausible-sounding but actually wrong or fabricated content from an LLM. It’s a core trust problem for AI search and a reason GEO uses high-quality content to "correct" a model’s perception.',
    usage: 'When assessing an AI tool’s reliability or planning content to correct AI’s wrong perception of your brand.',
    related: ['rag', 'e-e-a-t', 'grounding'],
  },
  {
    id: 'grounding',
    term: 'Grounding',
    termZh: 'Grounding',
    category: 'llm-tech',
    definition:
      'Grounding anchors an LLM’s output to verifiable sources to reduce hallucination and improve accuracy, usually via RAG, real-time search or structured-data injection.',
    usage: 'Grounding is a core design principle for ensuring answer reliability in enterprise AI Q&A systems.',
    related: ['rag', 'hallucination', 'vector-database'],
  },
  {
    id: 'llm',
    term: 'LLM',
    termZh: 'Large Language Model',
    category: 'llm-tech',
    definition:
      'An LLM is a large AI model trained on massive text data that can understand and generate human language. Examples include GPT-4, Claude, Gemini and DeepSeek. LLMs are the core engine of modern AI search, AI agents and GEO.',
    usage: 'Understanding the underlying mechanics of AI search and why content quality and structure matter for AI citation.',
    related: ['geo', 'rag', 'ai-agent', 'llmo'],
  },
  {
    id: 'mcp',
    term: 'MCP',
    termZh: 'Model Context Protocol',
    category: 'llm-tech',
    definition:
      'MCP (Model Context Protocol) is an open standard from Anthropic defining how AI models communicate with external tools and data sources. An MCP Server exposes tool capabilities per the protocol; Claude, Cursor and others support it.',
    usage: 'MCP is currently the leading standard when adding extensible tool capabilities to an AI agent.',
    related: ['function-calling', 'ai-agent', 'tool-use'],
  },
  {
    id: 'rag',
    term: 'RAG',
    termZh: 'Retrieval-Augmented Generation',
    category: 'llm-tech',
    definition:
      'RAG (Retrieval-Augmented Generation) is an AI architecture that retrieves relevant content from an external knowledge base before the LLM answers, injecting it as context. RAG reduces hallucination and improves accuracy — core to enterprise AI.',
    usage: 'Essential when building AI Q&A on private documents (e.g. enterprise knowledge bases, support bots).',
    related: ['embedding', 'vector-database', 'hallucination', 'llm'],
  },
  {
    id: 'tool-use',
    term: 'Tool Use',
    termZh: 'Tool Use',
    category: 'llm-tech',
    definition:
      'Tool Use is an AI model’s ability to use external tools (search engines, calculators, code executors, APIs) to complete tasks. Claude and GPT-4 both support it — a foundation for useful AI agents.',
    usage: 'When AI needs real-time data or actions beyond pure text generation.',
    related: ['function-calling', 'mcp', 'ai-agent'],
  },
  {
    id: 'vector-database',
    term: 'Vector Database',
    termZh: 'Vector Database',
    category: 'llm-tech',
    definition:
      'A Vector Database stores and retrieves high-dimensional vectors (embeddings) for semantic-similarity search. Examples include Pinecone, Weaviate, Chroma and pgvector — core infrastructure for RAG systems.',
    usage: 'When building a RAG knowledge base or semantic search, you need a suitable vector database to store document embeddings.',
    related: ['rag', 'embedding', 'ai-agent'],
  },
  {
    id: 'context-window',
    term: 'Context Window',
    termZh: 'Context Window',
    category: 'llm-tech',
    definition:
      'A Context Window is the maximum number of tokens an LLM can handle in a single request. Larger windows let the model "remember" more. GPT-4 Turbo supports 128K tokens; Claude 3.5 supports 200K.',
    usage: 'When analyzing long documents or long conversations, account for the model’s context-window limit and design sensible chunking.',
    related: ['llm', 'rag', 'token'],
  },
  {
    id: 'token',
    term: 'Token',
    termZh: 'Token',
    category: 'llm-tech',
    definition:
      'A Token is the basic unit an LLM processes, usually a word or sub-word. Roughly 1 English word ≈ 1.3 tokens; 1 Chinese character ≈ 1–2 tokens. LLM pricing and context limits are measured in tokens.',
    usage: 'Used to estimate AI API costs or judge whether content exceeds the model’s limit.',
    related: ['llm', 'context-window'],
  },
  {
    id: 'fine-tuning',
    term: 'Fine-tuning',
    termZh: 'Fine-tuning',
    category: 'llm-tech',
    definition:
      'Fine-tuning further trains a pretrained LLM on domain-specific data to adapt it to a task or style. Compared with RAG, fine-tuning bakes knowledge into model weights but costs more and updates more slowly.',
    usage: 'Fine-tuning is an alternative to RAG when you need the model to consistently output a specific format, style or domain knowledge.',
    related: ['llm', 'rag'],
  },
  {
    id: 'foundation-model',
    term: 'Foundation Model',
    termZh: 'Foundation Model',
    category: 'llm-tech',
    definition:
      'A Foundation Model is pretrained on large-scale general data and serves as a base for downstream tasks. GPT-4, Claude, Gemini and LLaMA are foundation models.',
    usage: 'Choosing a suitable foundation model to fine-tune or integrate into a product via API.',
    related: ['llm', 'fine-tuning'],
  },

  // ── Category 4: Content & Structured Data ────────────────────
  {
    id: 'entity',
    term: 'Entity',
    termZh: 'Entity',
    category: 'content-data',
    definition:
      'An Entity is a real-world object — person, place, brand, concept — that engines and AI systems recognize. Google’s Knowledge Graph and AI models understand content via entities, not just keyword matching. Strong entity associations are a core GEO/SEO strategy.',
    usage: 'Use structured data to mark up your brand entity so Google and AI systems recognize it correctly.',
    related: ['knowledge-graph', 'schema-markup', 'e-e-a-t'],
  },
  {
    id: 'faq-schema',
    term: 'FAQ Schema',
    termZh: 'FAQ Schema',
    category: 'content-data',
    definition:
      'FAQ Schema is a Schema.org structured-data type for marking up Q&A on a page. Implemented correctly, it lets Google show expandable Q&A in results and makes it easier for AI models to extract and cite your content.',
    usage: 'Add FAQ Schema to pages with common questions to increase SERP footprint and AI citation odds.',
    related: ['schema-markup', 'aeo', 'featured-snippet'],
  },
  {
    id: 'knowledge-graph',
    term: 'Knowledge Graph',
    termZh: 'Knowledge Graph',
    category: 'content-data',
    definition:
      'The Knowledge Graph is Google’s large structured knowledge base of entities and their relationships. The brand info card on the right of results is pulled from it. Entering the Knowledge Graph is an important brand-authority signal.',
    usage: 'Establish your brand’s Knowledge Graph entity via a Wikipedia page, Wikidata entry and structured data.',
    related: ['entity', 'schema-markup', 'e-e-a-t'],
  },
  {
    id: 'llms-txt',
    term: 'llms.txt',
    termZh: 'llms.txt',
    category: 'content-data',
    definition:
      'llms.txt (or llm.txt) is a text file in the site root, like robots.txt, that declares a content summary, key pages and access for AI crawlers. It’s foundational GEO config that helps AI models understand and index your site.',
    usage: 'Any site wanting better AI-search visibility should configure llms.txt — especially content-heavy sites.',
    related: ['geo', 'crawlability', 'robots-txt'],
    link: '/llms-txt',
  },
  {
    id: 'robots-txt',
    term: 'robots.txt',
    termZh: 'robots.txt',
    category: 'content-data',
    definition:
      'robots.txt is a text file in the site root that tells crawlers which pages they may fetch via Disallow/Allow. Misconfiguration can keep important pages out of the index — a must-check in technical SEO audits.',
    usage: 'Block crawler access to admin and duplicate pages while keeping core content open to all crawlers.',
    related: ['crawlability', 'llms-txt', 'indexability'],
  },
  {
    id: 'schema-markup',
    term: 'Schema Markup',
    termZh: 'Schema Markup',
    category: 'content-data',
    definition:
      'Schema Markup is structured-data code added per the Schema.org spec (usually JSON-LD) that helps engines and AI understand a page’s meaning. Used correctly it can earn Rich Results and improve visibility.',
    usage: 'Add the appropriate Schema to pages like articles, products, FAQs, reviews and local businesses.',
    related: ['faq-schema', 'knowledge-graph', 'aeo'],
  },
  {
    id: 'json-ld',
    term: 'JSON-LD',
    termZh: 'JSON-LD',
    category: 'content-data',
    definition:
      'JSON-LD (JavaScript Object Notation for Linked Data) is Google’s recommended structured-data format, embedded in HTML via a <script type="application/ld+json"> tag.',
    usage: 'Add a JSON-LD block in the page <head> or <body> to implement Article, FAQ, Product and other Schema.',
    related: ['schema-markup', 'faq-schema', 'entity'],
  },
  {
    id: 'semantic-html',
    term: 'Semantic HTML',
    termZh: 'Semantic HTML',
    category: 'content-data',
    definition:
      'Semantic HTML uses meaningful tags (like <article>, <section>, <nav>, <h1>–<h6>) to structure content so engines and AI crawlers understand hierarchy and meaning more accurately — important for SEO and AI readability.',
    usage: 'When building content pages, use semantic tags instead of meaningless <div>s to improve AI parsing accuracy.',
    related: ['crawlability', 'schema-markup'],
  },
  {
    id: 'schema-org',
    term: 'Schema.org',
    termZh: 'Schema.org',
    category: 'content-data',
    definition:
      'Schema.org is the structured-data vocabulary standard maintained jointly by Google, Bing, Yahoo and Yandex, defining thousands of content types (Article, Product, Person, Organization, etc.) — the universal web semantic language.',
    usage: 'Before implementing structured data, check the Schema.org docs to confirm the correct type and properties.',
    related: ['schema-markup', 'json-ld', 'faq-schema'],
  },

  // ── Category 5: Metrics & Measurement ────────────────────────
  {
    id: 'ai-share-of-voice',
    term: 'AI Share of Voice',
    termZh: 'AI Share of Voice',
    category: 'metrics',
    definition:
      'AI Share of Voice measures how often your brand is mentioned in AI search results for a topic or category relative to competitors. It’s a core GEO metric, analogous to keyword ranking share in traditional SEO.',
    usage: 'Regularly monitor brand vs competitor AI mentions on category questions to gauge GEO effectiveness.',
    related: ['geo', 'brand-mention-rate', 'ai-visibility'],
    link: '/ai-checker',
  },
  {
    id: 'ai-visibility',
    term: 'AI Visibility',
    termZh: 'AI Visibility',
    category: 'metrics',
    definition:
      'AI Visibility is a metric system measuring how often a brand is mentioned, cited and recommended across major AI platforms (ChatGPT, Perplexity, DeepSeek, Doubao, etc.). High AI visibility means your brand surfaces when users ask AI related questions.',
    usage: 'In a GEO audit, AI Visibility is the core baseline metric and must be monitored across multiple AI platforms.',
    related: ['geo', 'ai-share-of-voice', 'brand-mention-rate'],
    link: '/ai-checker',
  },
  {
    id: 'brand-mention-rate',
    term: 'Brand Mention Rate',
    termZh: 'Brand Mention Rate',
    category: 'metrics',
    definition:
      'Brand Mention Rate is the percentage of AI search results for a keyword or topic that mention your brand. For example, if "best project management tool" is asked 100 times and your brand appears 30 times, the rate is 30%.',
    usage: 'A core KPI for GEO effectiveness — compare it against historical data and competitors.',
    related: ['ai-visibility', 'ai-share-of-voice', 'geo'],
  },
  {
    id: 'citation-rate',
    term: 'Citation Rate',
    termZh: 'Citation Rate',
    category: 'metrics',
    definition:
      'Citation Rate is how often your content is cited as a source by AI search engines (e.g. Perplexity, ChatGPT Search). A high rate means AI treats your content as authoritative — a direct measure of AEO/GEO success.',
    usage: 'Monitor which page types (tutorials, comparisons, glossaries) earn higher AI citation rates to guide content strategy.',
    related: ['aeo', 'geo', 'ai-visibility'],
  },
  {
    id: 'geo-audit',
    term: 'GEO Audit',
    termZh: 'GEO Audit',
    category: 'metrics',
    definition:
      'A GEO Audit systematically assesses a site’s current AI-search visibility — checking AI mention rate, content structure, llms.txt config, Schema markup, competitor comparison and more. It’s the starting point for a GEO strategy.',
    usage: 'Run a GEO audit quarterly or before major content updates to spot visibility gaps and plan improvements.',
    related: ['geo', 'ai-visibility', 'llms-txt'],
    link: '/ai-checker',
  },
  {
    id: 'prompt-coverage',
    term: 'Prompt Coverage',
    termZh: 'Prompt Coverage',
    category: 'metrics',
    definition:
      'Prompt Coverage measures the share of likely user questions (prompts) about your category in which your brand appears. Users may ask the same thing 50 ways; Prompt Coverage tracks your overall appearance across those variants.',
    usage: 'Use a Prompt Coverage matrix to identify high-frequency question scenarios you haven’t covered yet.',
    related: ['geo', 'brand-mention-rate', 'topic-authority'],
  },
  {
    id: 'topic-authority',
    term: 'Topic Authority',
    termZh: 'Topical Authority',
    category: 'metrics',
    definition:
      'Topic Authority measures how deeply and broadly a site covers a subject area. Sites with high topical authority have in-depth content on all related questions and earn more trust and citations from Google and AI.',
    usage: 'Systematically build topical authority in a niche via a topic-cluster strategy.',
    related: ['e-e-a-t', 'content-gap', 'geo', 'aeo'],
  },
  {
    id: 'content-gap',
    term: 'Content Gap',
    termZh: 'Content Gap',
    category: 'metrics',
    definition:
      'A Content Gap is a keyword, topic or question area competitors cover but your site doesn’t. Content-gap analysis surfaces high-value opportunities — and in the AI search era, closing gaps is key to raising citation rates.',
    usage: 'Use Ahrefs or Semrush content-gap tools to find target keywords competitors rank for and you don’t.',
    related: ['topic-authority', 'keyword-research', 'geo'],
  },
  {
    id: 'ai-crawl-budget',
    term: 'AI Crawl Budget',
    termZh: 'AI Crawl Budget',
    category: 'metrics',
    definition:
      'AI Crawl Budget is the cap on how many pages AI crawlers will fetch from your site in a given period. A sound internal-link structure, llms.txt config and page-priority signals guide them to your most important content first.',
    usage: 'For large sites, use llms.txt and the sitemap to clearly signal AI-crawler priorities.',
    related: ['crawlability', 'llms-txt', 'indexability'],
  },
  {
    id: 'competitive-benchmarking',
    term: 'Competitive Benchmarking',
    termZh: 'Competitive Benchmarking',
    category: 'metrics',
    definition:
      'Competitive Benchmarking assesses your gaps and opportunities by comparing competitors’ AI-search performance (mention rate, citation rate, Share of Voice). In GEO, it’s an important basis for improvement strategy.',
    usage: 'Regularly analyze competitors’ AI mentions on target question scenarios to find content angles where you can win.',
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
