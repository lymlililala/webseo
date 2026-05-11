// SEO/GEO/AEO 技术文章数据

export interface Article {
  id: string
  title: string
  description: string
  content: string
  author: string
  date: string
  category: 'seo' | 'geo' | 'aeo' | 'tools'
  tags: string[]
  readTime: number // 分钟
  image?: string
  link?: string
}

export const articles: Article[] = [
  {
    id: 'article-1',
    title: '2026 年 SEO 趋势：AI 搜索对传统 SEO 的冲击',
    description: '探讨 AI 搜索引擎（ChatGPT、Perplexity）对传统搜索引擎优化的影响，以及网站应该如何适应新的搜索生态。',
    content: `AI 搜索引擎的崛起正在改变整个搜索生态。与其说是替代，不如说是补充和演进。

## 关键变化

1. **答案驱动优化**：用户不再需要点击链接查看搜索结果，AI 会直接给出答案。这意味着网站需要从"排名优化"转向"内容引用优化"。

2. **E-E-A-T 重要性上升**：Experience、Expertise、Authoritativeness、Trustworthiness 成为 AI 选择信息源的核心指标。

3. **结构化数据与 JSON-LD**：AI 引擎更依赖机器可读的数据格式，增强内容的结构化表示变得至关重要。

## 应对策略

- 优化 FAQ 和对话式内容
- 增加专家背书和出处标注
- 使用 Schema.org 标记核心内容
- 监测 AI 引擎中的品牌提及率（Brand Visibility）

未来的 SEO 是 SEO + GEO + AEO 的融合。`,
    author: '张三',
    date: '2026-05-10',
    category: 'seo',
    tags: ['AI搜索', 'GEO', 'AEO', '2026趋势'],
    readTime: 8,
  },
  {
    id: 'article-2',
    title: 'GEO（生成式引擎优化）完全指南',
    description: '详解什么是 GEO，如何针对 ChatGPT、Perplexity、Google AI Overview 进行网站优化。',
    content: `GEO 是 Generative Engine Optimization 的缩写，中文译为"生成式引擎优化"。

## GEO 与 SEO 的区别

| 指标 | SEO | GEO |
|------|-----|-----|
| 目标引擎 | Google、Bing 等搜索引擎 | ChatGPT、Perplexity 等 AI 引擎 |
| 优化目标 | 排名靠前 | 被 AI 引用、提及 |
| 关键指标 | 点击率 | 引用率、可见度 |
| 核心方法 | 关键词优化 | 权威性、结构化数据 |

## 核心优化要点

1. **提高权威性**：获取行业权威网站的反向链接
2. **优化结构化数据**：使用 JSON-LD 标记 FAQ、术语、定义
3. **监测品牌提及**：追踪品牌在 AI 引擎中的出现频率
4. **优化内容长度与深度**：AI 倾向引用深度、全面的内容

## 推荐工具

- Otterly.AI：GEO 监测工具
- Transparent：品牌可见度追踪
- SearchAttention：AI 搜索优化分析`,
    author: '李四',
    date: '2026-05-08',
    category: 'geo',
    tags: ['GEO指南', '生成式搜索', '品牌可见度'],
    readTime: 12,
  },
  {
    id: 'article-3',
    title: 'AEO 答案引擎优化：为 AI 对话设计内容',
    description: '深度解析 AEO 的定义、应用场景和实战优化技巧。',
    content: `AEO（Answer Engine Optimization）专注于优化内容以适应对话式 AI 的需求。

## AEO 的三个核心层面

### 1. 内容层面
- 以问题为中心组织内容
- 提供清晰的答案摘要（snippet 优化）
- 增加 FAQ、对话式内容

### 2. 技术层面
- 使用 Speakable 标记让内容可被语音播放
- 添加 QAPage Schema
- 增强 llms.txt 支持（更详见 https://llms.txt 规范）

### 3. 用户意图层面
- 分析用户在对话中可能提出的问题
- 预测 AI 如何理解和总结你的内容
- 优化答案的"可被 AI 理解"程度

## 实战案例

某电商网站通过添加结构化 QA 数据，使得在 AI 对话中的品牌提及率提升 45%。

## 相关资源
- llms.txt 规范：为 AI 提供网站信息的标准格式
- AlsoAsked：发现用户真实提问
- AnswerThePublic：可视化搜索意图`,
    author: '王五',
    date: '2026-05-05',
    category: 'aeo',
    tags: ['AEO', '对话AI', '答案优化', '结构化数据'],
    readTime: 10,
  },
  {
    id: 'article-4',
    title: '使用 llms.txt 让 AI 更了解你的网站',
    description: '详解 llms.txt 文件规范和实现方式，提升网站在 AI 系统中的可见度。',
    content: `llms.txt 是一个新兴的标准文件，用于向 AI 模型提供关于网站的结构化信息。

## llms.txt 是什么？

类似于 robots.txt 和 sitemap.xml，llms.txt 在网站根目录，提供元数据给 LLM（大语言模型）：

\`\`\`
# 示例 llms.txt
Website: sgaindex.com
Description: 聚合 SEO/GEO/AEO 工具的导航平台
Contact: contact@sgaindex.com

## 主要版块
- SEO Tools Navigator: 150+ SEO 工具推荐
- GEO Navigator: 100+ 生成式搜索工具
- AEO Tools: 80+ 答案引擎优化工具
\`\`\`

## 优势

1. **提高 AI 理解**：AI 更准确地理解网站内容
2. **品牌一致性**：确保 AI 生成内容时描述网站的方式一致
3. **内容优先级**：指导 AI 哪些页面最重要
4. **防止误解**：明确说明网站的真实目的

## 如何实现

在 \`/llms.txt\` 添加网站信息，参照 sgaindex.com 的 llms.txt Generator 工具。`,
    author: '赵六',
    date: '2026-05-01',
    category: 'tools',
    tags: ['llms.txt', 'AI元数据', '网站优化'],
    readTime: 6,
  },
]
