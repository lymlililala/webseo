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
    name: 'AIDSO',
    nameEn: 'AIDSO',
    description:
      'A DSO (DeepSearch Optimization) + GEO dual-engine platform tracking visibility, mentions and keyword recommendations across Chinese and global AI engines — a China GEO reference standard.',
    url: 'https://geo.aidso.com',
    tags: ['DSO', 'GEO Dual-Engine', 'Brand Monitoring', 'Keyword Tracking', 'China Benchmark'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['DSO + GEO Dual-Engine', 'Full China & Global AI Coverage', 'Keyword Mention Analysis'],
    featured: true,
  },
  {
    id: 'timus-geo',
    name: 'Lens GEO',
    nameEn: 'TIMUS.AI GEO',
    description:
      'A free-forever, easy-to-use China GEO monitor that checks brand visibility and mentions across Doubao, DeepSeek, Yuanbao, Kimi and Tongyi Qianwen.',
    url: 'https://geo.timus.cn',
    tags: ['Free Forever', 'China AI Coverage', 'Doubao', 'DeepSeek', 'Quick Start'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: 'Free Forever',
    highlights: ['Free Forever', 'Doubao/DeepSeek/Yuanbao/Kimi', 'Easiest in China'],
    featured: true,
  },
  {
    id: 'impetaai',
    name: 'ImpetaAI',
    nameEn: 'ImpetaAI (Huichen)',
    description:
      'A GEO monitor from public company Huichen with 50+ metrics across 5 China AIs (Doubao, DeepSeek, Yuanbao, Kimi, Tongyi Qianwen), with multi-dimensional visibility analysis and competitor comparison.',
    url: 'https://impetaai.hcr.com.cn',
    tags: ['Public Company', '50+ Metrics', '5 China AI', 'Competitor Comparison', 'Huichen'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['50+ Metrics', 'Covers Doubao/DeepSeek/Yuanbao/Kimi/Tongyi', 'Public-Company Quality'],
    featured: true,
  },
  {
    id: 'geowise',
    name: 'GEOWISE',
    nameEn: 'GEOWISE',
    description:
      'Newrank’s all-in-one GEO platform uniting content creation, distribution and AI visibility monitoring across 12 major AI platforms for end-to-end coverage.',
    url: 'https://www.newrank.cn',
    tags: ['By Newrank', 'Content + Distribution + Monitoring', '12 AI Platforms', 'End-to-end'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['Content + Distribution + Monitoring', '12 AI Platforms', 'Newrank Content Ecosystem'],
  },
  {
    id: 'sheepgeo',
    name: 'SheepGeo',
    description:
      'Offers SHEEP 5-dimension scoring to check brand visibility across 9 AI models, with scheduled checks, report export and a free-forever tier for individuals and small teams.',
    url: 'https://sheepgeo.com',
    tags: ['SHEEP 5-D Scoring', '9 AI Models', 'Free Tier', 'Scheduled Checks', 'Report Export'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: 'Free Tier',
    highlights: ['SHEEP 5-D Scoring', 'Checks 9 AI Models', 'Free Usage'],
  },
  {
    id: 'geo-multimodal',
    name: 'GEO Multimodal System',
    description:
      'A GEO system tailored to China’s multimodal AI scene, compatible with DeepSeek, Doubao, Yuanbao, Tongyi Qianwen, Ernie Bot and Kimi — optimizing visibility for text-and-image content.',
    url: 'https://tp10.ymyhn.com',
    tags: ['Multimodal', 'DeepSeek', 'Doubao', 'Yuanbao', 'Ernie Bot', 'Full China Coverage'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['Multimodal Optimization', '6 China AI Platforms', 'Visual Content Visibility'],
  },
]

// ══════════════════════════════════════════════════════════
// 二、国内服务商附工具
// ══════════════════════════════════════════════════════════
const cnServiceTools: GeoTool[] = [
  {
    id: 'geokeji',
    name: 'Yishan Tech',
    description:
      'An early China GEO benchmark with 7 proprietary systems and a published GEO whitepaper, offering strategy consulting, content optimization and ongoing monitoring with industry-leading depth.',
    url: 'https://geokeji.com',
    tags: ['GEO Tech Benchmark', '7 Proprietary Systems', 'Whitepaper', 'Strategy Consulting'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['Early China GEO Leader', '7 Proprietary Systems', 'Has Whitepaper'],
    featured: true,
  },
  {
    id: 'suproai',
    name: 'Supro AI',
    nameEn: 'Supro AI',
    description:
      'Founded by a team with P&G and Unilever backgrounds. Offers Site Radar (AI visibility detection) and an AI site builder, with strong brand content strategy for AI search.',
    url: 'https://suproai.com',
    tags: ['P&G Pedigree', 'Site Radar', 'AI Site Builder', 'Brand Content Strategy'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['P&G / Unilever Pedigree', 'Site Radar AI Detection', 'AI Site Builder'],
  },
  {
    id: 'wanhuys',
    name: 'Wanhuisou (Yishan)',
    description: 'Patented tech covering 500+ industries with a 72-hour results promise. A free diagnostic entry makes it a good quick start for SMBs.',
    url: 'https://wanhuys.com',
    tags: ['Patented Tech', '500+ Industries', 'Results in 72h', 'Free Diagnosis'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: 'Free Diagnosis',
    highlights: ['Patented Tech', '500+ Industries Covered', 'Results in 72h'],
  },
  {
    id: 'starlinkgeo',
    name: 'Xingchenhui AI',
    description:
      'A China platform built on Princeton’s GEO research (KDD 2024), focused on vertical-industry GEO optimization and AI-agent integration for technically capable enterprises.',
    url: 'https://starlinkgeo.cn',
    tags: ['Based on Princeton Research', 'Vertical Industries', 'AI Agent Integration', 'Tech-focused'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'cn',
    highlights: ['Based on Princeton KDD 2024 Research', 'Vertical-Specific Optimization', 'AI Agent Integration'],
  },
  {
    id: 'chuanshenggang',
    name: 'Chuanshenggang (Hangzhou Longtou)',
    description:
      'Specializes in content distribution, leveraging 128 state-media outlets and a 150k+ creator network to raise E-E-A-T signals and citation rates in AI engines.',
    url: 'https://chuanshenggang.com',
    tags: ['128 State Media', '150k+ Creators', 'Content Distribution', 'E-E-A-T Building'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['128 State-Media Outlets', '150k+ Creator Network', 'Content-Distribution GEO'],
  },
  {
    id: 'geo-zhida',
    name: 'GEO Zhida',
    description:
      'A GEO growth provider focused on China’s AI ecosystem, lifting brand mention rates in domestic AI by an average of 78% via precise content and multi-platform distribution.',
    url: 'https://geozhida.com',
    tags: ['China AI Ecosystem', '+78% Brand Mentions', 'Multi-platform Distribution', 'Growth Service'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    highlights: ['+78% Avg Brand Mentions', 'Focused on China AI', 'Precise Content Strategy'],
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
      'Focuses on keyword-level AI-search pattern tracking, monitoring citations across 200+ tools like ChatGPT, Perplexity and Claude — and hosts the largest GEO tool directory (200+ listed).',
    url: 'https://llmrefs.com',
    tags: ['Keyword Pattern Tracking', '200+ Tool Directory', 'From $13.5/mo', 'Globally Known'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '$13.5/mo',
    highlights: ['Keyword-Level Tracking', '200+ Tool Directory', 'Best Value'],
    featured: true,
  },
  {
    id: 'profound-ai',
    name: 'Profound',
    description:
      'A G2 2026 enterprise AI-monitoring leader that raised $55M led by Sequoia Capital. An enterprise AI-answer monitor for large-scale brand tracking with deep competitor analysis.',
    url: 'https://tryprofound.com',
    tags: ['Sequoia $55M Funding', 'G2 Enterprise Leader', 'Enterprise', 'Competitor Analysis'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Sequoia $55M Funding', 'G2 2026 Leader', 'Enterprise Pick'],
    featured: true,
  },
  {
    id: 'otterly-ai',
    name: 'Otterly.AI',
    description:
      'Automatically tracks daily brand visibility across ChatGPT, Perplexity, Google AI Overviews and more. Chosen by 15,000+ users, from an affordable $29/mo, with competitor monitoring and recommendations.',
    url: 'https://otterly.ai',
    tags: ['Daily Tracking', '$29/mo', '15,000+ Users', 'Multi-platform Monitoring'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '$29/mo',
    highlights: ['Daily Auto-Tracking', '$29/mo Best Value', '15,000+ Active Users'],
    featured: true,
  },
  {
    id: 'peec-ai',
    name: 'Peec AI',
    description:
      'A German-built AI Share-of-Voice monitor — agency-friendly with white-label reports. From €89/mo, ideal for agencies managing many clients’ AI visibility.',
    url: 'https://peec.ai',
    tags: ['German Team', '€89/mo', 'Agency-Friendly', 'White-Label Reports', 'Share of Voice'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '€89/mo',
    highlights: ['Agency White-Label Reports', '€89/mo (Europe)', 'AI Share of Voice'],
  },
  {
    id: 'athenahq',
    name: 'AthenaHQ',
    description:
      'Pioneered QVEM (Query Volume Estimation Model) to forecast AI-search keyword traffic. At $295/mo it targets the premium market for data-driven SEO/GEO teams.',
    url: 'https://athenahq.ai',
    tags: ['QVEM Query-Volume Model', '$295/mo', 'AI Traffic Forecast', 'Premium'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    pricing: '$295/mo',
    highlights: ['QVEM Query-Volume Model', 'AI Search Traffic Forecast', 'Data-Driven Decisions'],
  },
  {
    id: 'rankscale',
    name: 'Rankscale',
    description:
      'A flexible credit-based tracking system — buy credits as needed with no fixed plan. From ~$20/mo, good for budget-conscious SMBs.',
    url: 'https://rankscale.io',
    tags: ['Credit-Based Billing', '~$20/mo', 'Pay-as-you-go', 'SMB-Friendly'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '~$20/mo',
    highlights: ['Credit-Based Billing', 'Pay-as-you-go', 'For SMBs'],
  },
  {
    id: 'aiclicks',
    name: 'AIclicks',
    description:
      'A ~$39/mo AI visibility tracker that not only monitors brand appearances but also gives targeted content recommendations to turn data into action.',
    url: 'https://aiclicks.io',
    tags: ['~$39/mo', 'Tracking + Recommendations', 'Improvement Guidance', 'Track & Convert'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: '~$39/mo',
    highlights: ['Monitor + Recommend', '~$39/mo Value', 'Action-Oriented Reports'],
  },
  {
    id: 'appearonai',
    name: 'AppearOnAI',
    description:
      'Offers a free scan that quickly audits visibility across ChatGPT, Perplexity, Claude and Gemini with a visual report — ideal for teams new to GEO.',
    url: 'https://appearonai.com',
    tags: ['Free Scan', '4 AI-Engine Audit', 'Visual Reports', 'GEO Starter'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: 'Free Scan',
    highlights: ['Free Quick Scan', '4 AI-Engine Audit', 'Visual GEO Reports'],
    featured: true,
  },
  {
    id: 'geneo-app',
    name: 'Geneo',
    description:
      'Provides prompt-level history, showing how AI describes a brand over time and across prompts — helping teams understand how AI content evolves.',
    url: 'https://geneo.app',
    tags: ['Prompt-Level Tracking', 'History', 'AI Description Evolution', 'Granular Analysis'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['Prompt-Level History', 'AI Description Evolution', 'Granular Insights'],
  },
  {
    id: 'passionfruit',
    name: 'Passionfruit',
    description:
      'Links AI search visibility to real revenue attribution, helping brands quantify the business value of GEO and connect visibility to sales conversions.',
    url: 'https://getpassionfruit.com',
    tags: ['Visibility + Revenue Attribution', 'Business Value Quantified', 'Conversion Attribution', 'ROI Analysis'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Visibility + Revenue Attribution', 'GEO ROI Quantified', 'Sales Conversion Analysis'],
  },
  {
    id: 'brandlight-ai',
    name: 'BrandLight',
    description:
      'Combines brand monitoring with AI content optimization — its built-in optimizer generates GEO-compliant content suggestions, closing the loop from problem to solution.',
    url: 'https://brandlight.ai',
    tags: ['Brand Monitoring', 'Built-in AI Optimizer', 'Content Generation', 'Closed-loop Optimization'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['Built-in AI Content Optimizer', 'Monitor + Content Loop', 'Generates Recommendations'],
  },
  {
    id: 'goodie-ai',
    name: 'Goodie AI',
    description:
      'Covers both AEO and AI shopping-recommendation visibility, auto-detecting content gaps and generating suggestions — ideal for e-commerce and B2C brands in AI shopping.',
    url: 'https://goodie.ai',
    tags: ['AEO', 'AI Shopping Visibility', 'E-commerce', 'Content Gap Detection'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['AEO + AI Shopping', 'E-commerce Brand Optimization', 'Auto Content-Gap Detection'],
  },
  {
    id: 'knowatoa',
    name: 'Knowatoa',
    description:
      'An AI visibility and citation-source tracker that analyzes which sources AI answers cite, helping brands understand why competitors get cited and where their content gaps are.',
    url: 'https://knowatoa.com',
    tags: ['Citation Source Analysis', 'Why Competitors Get Cited', 'Content Guidance', 'Source Tracking'],
    isFree: false,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['Deep Citation Tracking', 'Competitor Citation Factors', 'Content Gap Finder'],
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
      'Semrush added an AI Visibility module to its flagship platform, tracking how often brand keywords appear in Google AI Overviews, ChatGPT and Perplexity, seamlessly integrated with traditional SEO data.',
    url: 'https://www.semrush.com',
    tags: ['Semrush', 'AI Visibility Module', 'SEO+GEO', 'Google AI Overviews'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Seamless SEO + GEO Data', 'Google AI Overview Tracking', 'Backed by Semrush'],
    featured: true,
  },
  {
    id: 'ahrefs-brand-radar',
    name: 'Ahrefs Brand Radar',
    description:
      'Ahrefs’ AI-search brand-tracking module monitors mentions and citations across AI engines, working best alongside Ahrefs’ backlink and keyword data.',
    url: 'https://ahrefs.com/brand-radar',
    tags: ['Ahrefs', 'Brand Radar', 'Brand Tracking', 'Backlink Integration'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Ahrefs Backlink Integration', 'Brand Citation Tracking', 'Full SEO Analysis'],
  },
  {
    id: 'se-ranking-ai',
    name: 'SE Ranking AI Overview Tracker',
    description:
      'SE Ranking added AI Overview tracking to monitor where target keywords appear in Google AI Overviews and analyze what gets cited, with recommendations.',
    url: 'https://seranking.com',
    tags: ['SE Ranking', 'AI Overview Tracking', 'Google Optimization', 'Citation Analysis'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI Overview Tracking', 'Google Citation Analysis', 'SEO + GEO Integration'],
  },
  {
    id: 'nightwatch-ai',
    name: 'Nightwatch AI Snippets',
    description:
      'Nightwatch added AI Snippets monitoring to its rank tracking, following how AI-generated blocks appear in the SERP to help users navigate the shift from featured snippets to AI Overviews.',
    url: 'https://nightwatch.io',
    tags: ['Nightwatch', 'AI Snippets', 'Rank Tracking', 'SERP Features'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI Snippets Monitoring', 'SERP Feature Tracking', 'Rank + GEO Data'],
  },
  {
    id: 'accuranker-accullm',
    name: 'AccuRanker AccuLLM',
    description:
      'AccuRanker’s AccuLLM module is a GEO-focused LLM visibility tracker that compares traditional rankings with AI citations side by side to reveal SEO–GEO synergies.',
    url: 'https://accuranker.com',
    tags: ['AccuRanker', 'AccuLLM', 'LLM Visibility', 'SEO + GEO Comparison'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AccuLLM GEO Module', 'SEO Rank vs GEO', 'Dedicated LLM Visibility Tracking'],
  },
  {
    id: 'frase-geo',
    name: 'Frase.io GEO Optimization',
    description:
      'Frase brings GEO thinking into its content platform, analyzing frequently cited structures in AI answers to optimize FAQs, How-tos and summaries for citation.',
    url: 'https://www.frase.io',
    tags: ['Frase', 'AI Content Optimization', 'FAQ Schema', 'How-to Optimization'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    highlights: ['Citation Structure Analysis', 'FAQ & How-to Optimization', 'AI Content Platform'],
  },
  {
    id: 'brightedge-geo',
    name: 'BrightEdge Generative Parser',
    description:
      'BrightEdge’s enterprise platform launched Generative Parser to parse Google AI Overviews in real time, identifying cited sources and guiding enterprise content teams’ GEO efforts.',
    url: 'https://www.brightedge.com',
    tags: ['BrightEdge', 'Enterprise', 'Generative Parser', 'AI Overview Parsing'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Enterprise GEO Analytics', 'Generative Parser', 'AI Overview Source Parsing'],
  },
  {
    id: 'seoclarity-ai',
    name: 'seoClarity AI Search Visibility',
    description:
      'seoClarity added AI Search Visibility to its enterprise platform, offering market-share analysis, competitor comparison and content-opportunity detection for large enterprises.',
    url: 'https://www.seoclarity.net',
    tags: ['seoClarity', 'Enterprise', 'AI Search Market Share', 'Competitor Comparison'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['AI Search Market-Share Analysis', 'For Large Enterprises', 'Deep Competitor Comparison'],
  },
  {
    id: 'adobe-llm-optimizer',
    name: 'Adobe LLM Optimizer',
    description:
      'Adobe’s enterprise LLM content optimizer helps brands tune how their assets are weighted in LLM training and inference, deeply integrated with Adobe Experience Cloud.',
    url: 'https://business.adobe.com/products/experience-cloud.html',
    tags: ['Adobe', 'LLM Optimization', 'Experience Cloud', 'Enterprise Content Ops'],
    isFree: false,
    hasFreeplan: false,
    isOpenSource: false,
    hasApi: true,
    region: 'global',
    highlights: ['Adobe Enterprise Quality', 'LLM Training-Weight Optimization', 'Experience Cloud Integration'],
  },
]

// ══════════════════════════════════════════════════════════
// 五、免费 GEO 工具
// ══════════════════════════════════════════════════════════
const freeGeoTools: GeoTool[] = [
  {
    id: 'timus-geo-free',
    name: 'Lens GEO (Free)',
    nameEn: 'TIMUS GEO Free',
    description:
      'A free-forever China GEO checker — no signup required to test brand visibility across Doubao, DeepSeek, Kimi and more; a top free pick for individuals and small teams.',
    url: 'https://geo.timus.cn',
    tags: ['Free Forever', 'No Signup', 'China AI Detection', 'Top Pick for Individuals'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: 'Completely Free',
    highlights: ['Free Forever', 'No Signup Required', 'Major China AI Supported'],
    featured: true,
  },
  {
    id: 'sheepgeo-free',
    name: 'SheepGeo Free Check',
    description:
      'Free SHEEP 5-dimension GEO checks scanning visibility across 9 AI models, with a basic diagnostic report — a no-cost way to gauge your GEO status.',
    url: 'https://sheepgeo.com',
    tags: ['Free Check', 'SHEEP 5-Dimension', '9 AI Models', 'Basic Reports'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'cn',
    pricing: 'Free Tier',
    highlights: ['Free 5-D GEO Check', '9 AI Models Covered', 'Fast Diagnostic Reports'],
  },
  {
    id: 'hubspot-ai-grader',
    name: 'HubSpot AI Search Grader',
    description:
      'HubSpot’s free AI search grader — enter a brand name to get sentiment, mention rate and competitor comparison across tools like ChatGPT, no signup needed.',
    url: 'https://www.hubspot.com/ai-search-grader',
    tags: ['HubSpot', 'Completely Free', 'Brand Score', 'Sentiment Analysis', 'No Signup'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: 'Completely Free',
    highlights: ['By HubSpot', 'Free, No Signup', 'Brand AI Search Score'],
    featured: true,
  },
  {
    id: 'llmrefs-tools',
    name: 'llms.txt Generator（LLMrefs）',
    description:
      'LLMrefs’ free llms.txt generator — enter a URL to auto-scan and produce a standardized llms.txt plus an AI-crawler readability report.',
    url: 'https://llmrefs.com/tools/llms-txt-generator',
    tags: ['llms.txt Generation', 'Free Tool', 'AI Crawler', 'Auto Scan'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: 'Completely Free',
    highlights: ['One-click llms.txt', 'Auto Site Scan', 'AI Crawler Readability'],
  },
  {
    id: 'appearonai-free',
    name: 'AppearOnAI Free Scan',
    description:
      'A free quick audit of brand visibility across 4 AI engines (ChatGPT, Perplexity, Claude, Gemini) with a visual report and no signup — great for a first GEO baseline.',
    url: 'https://appearonai.com',
    tags: ['Completely Free', '4 AI Engines', 'Visual Reports', 'GEO Starter'],
    isFree: true,
    hasFreeplan: true,
    isOpenSource: false,
    hasApi: false,
    region: 'global',
    pricing: 'Completely Free',
    highlights: ['Free, No Signup', 'Fast 4-Engine Audit', 'Visual GEO Reports'],
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
    tags: ['AEO', 'GEO', 'Claude Code', 'llms.txt', 'Structured Data'],
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
    tags: ['Python', 'CLI', 'AI Visibility', 'Schema Markup', 'Princeton Research', 'MCP'],
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
    tags: ['Awesome List', 'GEO Resources', 'Research Paper', 'Tool Collection'],
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
    tags: ['TypeScript', 'Next.js', 'Nuxt', 'llms.txt', 'JSON-LD', 'npm Package'],
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
    tags: ['Python', 'CLI', '22 Commands', '9 APIs', 'llms.txt'],
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
      'An open-source, local-first AI visibility dashboard — self-host for free to track brand mentions and rankings across ChatGPT, Perplexity, Claude and more.',
    url: 'https://github.com/danishashko/geo-aeo-tracker',
    tags: ['Open Source', 'AI Visibility', 'Brand Monitoring', 'Self-hosted', 'Dashboard'],
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
    name: 'China SaaS Tools',
    icon: 'language',
    color: '#EF4444',
    description:
      'A leading China GEO monitoring/optimization SaaS covering Doubao, DeepSeek, Kimi, Yuanbao and Tongyi, some with free tiers',
    badge: '🇨🇳 China',
    tools: cnSaasTools,
  },
  {
    id: 'cn-service',
    name: 'China Provider Tools',
    icon: 'business',
    color: '#F97316',
    description: 'Proprietary tools from Chinese GEO service providers, offering end-to-end diagnosis-to-optimization for enterprises with deep GEO needs',
    badge: '🇨🇳 China',
    tools: cnServiceTools,
  },
  {
    id: 'global-geo',
    name: 'Global GEO Tools',
    icon: 'public',
    color: '#6366F1',
    description: 'A leading global GEO/AEO SaaS covering major AI search engines like ChatGPT, Perplexity, Claude and Gemini',
    badge: '🌍 Global',
    tools: globalGeoTools,
  },
  {
    id: 'seo-to-geo',
    name: 'Legacy SEO + GEO Add-ons',
    icon: 'upgrade',
    color: '#8B5CF6',
    description: 'New GEO/AI-visibility features from SEO incumbents like Semrush and Ahrefs that slot into your existing workflow',
    badge: '🔧 Add-on',
    tools: seoToGeoTools,
  },
  {
    id: 'free-tools',
    name: 'Free GEO Tools',
    icon: 'money_off',
    color: '#10B981',
    description: 'Free or freemium GEO checkers — ideal for individual owners and teams new to GEO',
    badge: '🆓 Free',
    tools: freeGeoTools,
  },
  {
    id: 'opensource-geo',
    name: 'Open-Source GitHub Projects',
    icon: 'code',
    color: '#14B8A6',
    description: 'The most-starred open-source GEO/AEO projects (from real GitHub data) — self-host or extend them',
    badge: '⭐ Open Source',
    tools: openSourceGeoTools,
  },
]

export const allGeoTools: GeoTool[] = geoCategories.flatMap((c) => c.tools)

export const featuredGeoTools: GeoTool[] = allGeoTools.filter((t) => t.featured)
