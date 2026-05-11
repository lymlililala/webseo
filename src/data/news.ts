// SEO/GEO/AEO 行业新闻数据

export interface News {
  id: string
  title: string
  description: string
  content: string
  category: 'seo' | 'geo' | 'aeo' | 'ai' | 'industry'
  source: string
  date: string
  tags: string[]
  impact: 'high' | 'medium' | 'low' // 对行业的影响程度
  link?: string
}

export const news: News[] = [
  {
    id: 'news-1',
    title: 'Google 推出 AI Overview 更新，网站流量影响深远',
    description: 'Google 宣布在更多市场部署 AI Overview，预计对 10-64% 的查询产生影响。',
    content: `Google AI Overview（谷歌搜索摘要）的大规模推出标志着搜索生态的重大转变。

## 主要影响

- **流量分流**：AI 直接给出答案，传统搜索点击率下降 10-30%
- **排名重要性下降**：不再排名第一就能获得最多流量
- **引用率成为新指标**：被 AI 引用的频率变得更重要

## 应对方案

1. 优化内容让 AI 更容易理解和引用
2. 监测 AI Overview 中的品牌出现频率
3. 针对特定查询创建结构化答案
4. 从"排名优化"转向"可见度优化"

## 预期时间表

- 5月：美国市场进一步扩展
- 6月-7月：欧洲市场推出
- Q3：亚太地区跟进`,
    source: 'SearchEngineJournal',
    date: '2026-05-10',
    category: 'seo',
    tags: ['Google', 'AI Overview', 'SEO', '搜索生态'],
    impact: 'high',
    link: 'https://example.com/google-ai-overview-update',
  },
  {
    id: 'news-2',
    title: 'OpenAI ChatGPT 新增网络搜索功能',
    description: 'ChatGPT 用户现在可以在对话中进行实时网络搜索，获取最新信息。',
    content: `OpenAI 在 ChatGPT 中集成了网络搜索能力，改变了用户获取信息的方式。

## 技术细节

- 实时搜索能力（Real-time Search）
- 与必应（Bing）搜索集成
- 支持 API 调用方获取引用来源

## 对网站的影响

- 网站需要被 ChatGPT 搜索索引覆盖
- 内容质量和新鲜度变得更重要
- 结构化数据有助于提高被引用概率

## GEO 优化建议

- 监测 ChatGPT 中的品牌提及
- 优化常见问题的答案
- 确保内容最新且权威`,
    source: 'OpenAI Blog',
    date: '2026-05-08',
    category: 'geo',
    tags: ['ChatGPT', 'GEO', '网络搜索', 'OpenAI'],
    impact: 'high',
    link: 'https://example.com/chatgpt-search',
  },
  {
    id: 'news-3',
    title: 'llms.txt 规范获得行业支持，多家平台承诺兼容',
    description: 'Perplexity、You.com 等 AI 搜索引擎宣布支持 llms.txt 标准。',
    content: `llms.txt 规范的推出获得了广泛的行业支持，标志着网站元数据标准化的新时代。

## 支持平台

- Perplexity
- You.com
- Komo Search
- Neeva
- 更多平台正在评估

## 规范的意义

1. **标准化信息提供**：网站以统一方式向 AI 提供信息
2. **改善 AI 理解**：减少误解和不准确的内容生成
3. **品牌保护**：控制 AI 如何描述你的网站

## 采用建议

- 立即创建 llms.txt 文件
- 定期更新网站信息
- 监测 AI 系统如何使用这些信息
- 参考 sgaindex.com 的 llms.txt Generator 工具`,
    source: 'TechCrunch',
    date: '2026-05-05',
    category: 'aeo',
    tags: ['llms.txt', 'AEO', '行业标准', '网站元数据'],
    impact: 'high',
    link: 'https://example.com/llms-txt-support',
  },
  {
    id: 'news-4',
    title: 'Perplexity 推出企业 API，B2B 平台可直接集成',
    description: '用户现在可以在 B2B 应用中集成 Perplexity 的搜索和 AI 功能。',
    content: `Perplexity 发布企业级 API，使 B2B SaaS 产品能够集成 AI 搜索能力。

## API 功能

- 实时搜索引擎
- 自然语言处理
- 引用管理（Citation）
- 可定制的 UI 组件

## 商业影响

- 企业可以在自有平台中提供 AI 搜索
- 新的收入流机制
- 改善用户体验

## 对 GEO 的启示

- 企业应用中的品牌提及变得更重要
- 需要确保内容被企业搜索系统索引
- 结构化数据更易被 B2B 应用引用`,
    source: 'Perplexity',
    date: '2026-05-01',
    category: 'geo',
    tags: ['Perplexity', 'API', 'B2B', '企业搜索'],
    impact: 'medium',
    link: 'https://example.com/perplexity-api',
  },
  {
    id: 'news-5',
    title: '谷歌确认：页面体验信号下调，内容质量优先级提升',
    description: 'Google 官方宣布调整排名因素权重，内容相关性和权威性成为新重点。',
    content: `Google 的最新算法更新反映了搜索行业的长期演变方向。

## 变化

- 页面体验信号权重下降（但仍然重要）
- E-E-A-T（特别是 Expertise）权重上升
- 内容新鲜度对某些查询类型影响更大

## 对 SEO 的影响

1. 建立行业权威性变得关键
2. 作者署名和专家背书更重要
3. 定期更新内容质量优于性能优化

## 长期趋势

这与 GEO 和 AEO 的重点相吻合——权威性和内容质量。`,
    source: 'Google SearchCentral',
    date: '2026-04-28',
    category: 'seo',
    tags: ['Google', '算法更新', 'E-E-A-T', '排名因素'],
    impact: 'high',
    link: 'https://example.com/google-algorithm-update',
  },
  {
    id: 'news-6',
    title: '微软 Copilot 新增企业搜索功能',
    description: 'Microsoft Copilot 现在可以从企业内部数据源和公网进行搜索。',
    content: `Microsoft 扩展了 Copilot 的搜索能力，覆盖企业内部和公网数据。

## 新特性

- 企业数据搜索（Enterprise Search）
- 跨源引用（Cross-source Citation）
- 安全性和权限控制

## 启示

- 企业网站的可见度变得更重要
- 企业应考虑自有知识库的 AI 优化
- 公网信息和企业数据的融合搜索`,
    source: 'Microsoft Blog',
    date: '2026-04-25',
    category: 'ai',
    tags: ['Microsoft', 'Copilot', '企业搜索', 'AI'],
    impact: 'medium',
    link: 'https://example.com/copilot-enterprise-search',
  },
]
