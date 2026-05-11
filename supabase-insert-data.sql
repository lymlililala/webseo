-- ============================================================================
-- WEBSEO PROJECT - INSERT INITIAL DATA
-- ============================================================================

-- ============================================================================
-- INSERT ARTICLES
-- ============================================================================
INSERT INTO wseo_articles (title, description, content, author, date, category, tags, read_time)
VALUES
(
  '2026 年 SEO 趋势：AI 搜索对传统 SEO 的冲击',
  'AI 搜索引擎的崛起正在改变整个搜索生态。与其说是替代，不如说是补充和演进。',
  'AI 搜索引擎的崛起正在改变整个搜索生态。与其说是替代，不如说是补充和演进。

## 关键变化

1. **答案驱动优化**：用户不再需要点击链接查看搜索结果，AI 会直接给出答案。这意味着网站需要从"排名优化"转向"内容引用优化"。

2. **E-E-A-T 重要性上升**：Experience、Expertise、Authoritativeness、Trustworthiness 成为 AI 选择信息源的核心指标。

3. **结构化数据与 JSON-LD**：AI 引擎更依赖机器可读的数据格式，增强内容的结构化表示变得至关重要。

## 应对策略

- 优化 FAQ 和对话式内容
- 增加专家背书和出处标注
- 使用 Schema.org 标记核心内容
- 监测 AI 引擎中的品牌提及率（Brand Visibility）

未来的 SEO 是 SEO + GEO + AEO 的融合。',
  '张三',
  '2026-05-10',
  'seo',
  '["AI搜索", "GEO", "AEO", "2026趋势"]'::jsonb,
  8
),
(
  'GEO（生成式引擎优化）完全指南',
  '详解什么是 GEO，如何针对 ChatGPT、Perplexity、Google AI Overview 进行网站优化。',
  'GEO 是 Generative Engine Optimization 的缩写，中文译为"生成式引擎优化"。

## GEO 与 SEO 的区别

- **目标引擎**：SEO 为搜索引擎，GEO 为 AI 引擎
- **优化目标**：SEO 为排名靠前，GEO 为被引用、提及
- **关键指标**：SEO 为点击率，GEO 为引用率、可见度
- **核心方法**：SEO 为关键词优化，GEO 为权威性、结构化数据

## 推荐工具

- Otterly.AI：GEO 监测工具
- Transparent：品牌可见度追踪
- SearchAttention：AI 搜索优化分析',
  '李四',
  '2026-05-08',
  'geo',
  '["GEO指南", "生成式搜索", "品牌可见度"]'::jsonb,
  12
),
(
  'AEO 答案引擎优化：为 AI 对话设计内容',
  '深度解析 AEO 的定义、应用场景和实战优化技巧。',
  'AEO（Answer Engine Optimization）专注于优化内容以适应对话式 AI 的需求。

## AEO 的三个核心层面

### 1. 内容层面
- 以问题为中心组织内容
- 提供清晰的答案摘要
- 增加 FAQ、对话式内容

### 2. 技术层面
- 使用 Speakable 标记让内容可被语音播放
- 添加 QAPage Schema
- 增强 llms.txt 支持

### 3. 用户意图层面
- 分析用户在对话中可能提出的问题
- 预测 AI 如何理解和总结你的内容
- 优化答案的"可被 AI 理解"程度',
  '王五',
  '2026-05-05',
  'aeo',
  '["AEO", "对话AI", "答案优化", "结构化数据"]'::jsonb,
  10
),
(
  '使用 llms.txt 让 AI 更了解你的网站',
  '详解 llms.txt 文件规范和实现方式，提升网站在 AI 系统中的可见度。',
  'llms.txt 是一个新兴的标准文件，用于向 AI 模型提供关于网站的结构化信息。

## llms.txt 是什么？

类似于 robots.txt 和 sitemap.xml，llms.txt 在网站根目录，提供元数据给 LLM（大语言模型）。

## 优势

1. **提高 AI 理解**：AI 更准确地理解网站内容
2. **品牌一致性**：确保 AI 生成内容时描述网站的方式一致
3. **内容优先级**：指导 AI 哪些页面最重要
4. **防止误解**：明确说明网站的真实目的',
  '赵六',
  '2026-05-01',
  'tools',
  '["llms.txt", "AI元数据", "网站优化"]'::jsonb,
  6
);

-- ============================================================================
-- INSERT TUTORIALS
-- ============================================================================
INSERT INTO wseo_tutorials (title, description, category, instructor, difficulty, duration, students, rating, tags)
VALUES
(
  'SEO 基础入门：从 0 到 1',
  '适合完全入门者的 SEO 课程，涵盖关键词研究、页面优化、链接建设等核心概念。',
  'seo',
  '张三',
  'beginner',
  240,
  5230,
  4.8,
  '["SEO基础", "关键词", "页面优化", "技术SEO"]'::jsonb
),
(
  'GEO 生成式引擎优化实战课程',
  '学习如何针对 ChatGPT、Perplexity、Google AI Overview 等生成式引擎进行网站优化。',
  'geo',
  '李四',
  'intermediate',
  180,
  2840,
  4.9,
  '["GEO", "AI搜索", "品牌可见度", "结构化数据"]'::jsonb
),
(
  'AEO 答案引擎优化与对话 AI',
  '掌握 AEO 核心技能，让你的内容在 AI 对话中更容易被引用和提及。',
  'aeo',
  '王五',
  'advanced',
  195,
  1920,
  4.7,
  '["AEO", "对话AI", "结构化数据", "llms.txt"]'::jsonb
),
(
  '高级 SEO：数据分析与实验驱动优化',
  '深入学习如何用数据和 A/B 测试驱动 SEO 决策，适合有 SEO 基础的从业者。',
  'seo',
  '赵六',
  'advanced',
  220,
  1560,
  4.9,
  '["高级SEO", "数据分析", "GA4", "实验驱动"]'::jsonb
);

-- ============================================================================
-- INSERT TUTORIAL LESSONS
-- ============================================================================
INSERT INTO wseo_tutorial_lessons (tutorial_id, lesson_number, title, description, duration, level)
SELECT id, 1, '什么是 SEO？搜索引擎工作原理', '', 18, 'beginner'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1'
UNION ALL
SELECT id, 2, '关键词研究完全指南', '', 32, 'beginner'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1'
UNION ALL
SELECT id, 3, '页面 SEO 优化：Title、Meta 等', '', 25, 'beginner'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1'
UNION ALL
SELECT id, 4, '技术 SEO：网站结构与速度优化', '', 40, 'intermediate'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1'
UNION ALL
SELECT id, 5, '反向链接建设策略', '', 35, 'intermediate'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1'
UNION ALL
SELECT id, 6, '内容优化与 E-E-A-T', '', 28, 'intermediate'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1'
UNION ALL
SELECT id, 7, '持续监测与数据分析', '', 22, 'beginner'
FROM wseo_tutorials WHERE title = 'SEO 基础入门：从 0 到 1';

-- ============================================================================
-- INSERT NEWS
-- ============================================================================
INSERT INTO wseo_news (title, description, content, category, source, date, impact, tags, link)
VALUES
(
  'Google 推出 AI Overview 更新，网站流量影响深远',
  'Google 宣布在更多市场部署 AI Overview，预计对 10-64% 的查询产生影响。',
  'Google AI Overview（谷歌搜索摘要）的大规模推出标志着搜索生态的重大转变。

## 主要影响

- **流量分流**：AI 直接给出答案，传统搜索点击率下降 10-30%
- **排名重要性下降**：不再排名第一就能获得最多流量
- **引用率成为新指标**：被 AI 引用的频率变得更重要

## 应对方案

1. 优化内容让 AI 更容易理解和引用
2. 监测 AI Overview 中的品牌出现频率
3. 针对特定查询创建结构化答案
4. 从"排名优化"转向"可见度优化"',
  'seo',
  'SearchEngineJournal',
  '2026-05-10',
  'high',
  '["Google", "AI Overview", "SEO", "搜索生态"]'::jsonb,
  'https://example.com/google-ai-overview-update'
),
(
  'OpenAI ChatGPT 新增网络搜索功能',
  'ChatGPT 用户现在可以在对话中进行实时网络搜索，获取最新信息。',
  'OpenAI 在 ChatGPT 中集成了网络搜索能力，改变了用户获取信息的方式。

## 技术细节

- 实时搜索能力（Real-time Search）
- 与必应（Bing）搜索集成
- 支持 API 调用方获取引用来源

## 对网站的影响

- 网站需要被 ChatGPT 搜索索引覆盖
- 内容质量和新鲜度变得更重要
- 结构化数据有助于提高被引用概率',
  'geo',
  'OpenAI Blog',
  '2026-05-08',
  'high',
  '["ChatGPT", "GEO", "网络搜索", "OpenAI"]'::jsonb,
  'https://example.com/chatgpt-search'
),
(
  'llms.txt 规范获得行业支持，多家平台承诺兼容',
  'Perplexity、You.com 等 AI 搜索引擎宣布支持 llms.txt 标准。',
  'llms.txt 规范的推出获得了广泛的行业支持，标志着网站元数据标准化的新时代。

## 支持平台

- Perplexity
- You.com
- Komo Search
- Neeva
- 更多平台正在评估',
  'aeo',
  'TechCrunch',
  '2026-05-05',
  'high',
  '["llms.txt", "AEO", "行业标准", "网站元数据"]'::jsonb,
  'https://example.com/llms-txt-support'
),
(
  'Perplexity 推出企业 API，B2B 平台可直接集成',
  '用户现在可以在 B2B 应用中集成 Perplexity 的搜索和 AI 功能。',
  'Perplexity 发布企业级 API，使 B2B SaaS 产品能够集成 AI 搜索能力。

## API 功能

- 实时搜索引擎
- 自然语言处理
- 引用管理（Citation）
- 可定制的 UI 组件',
  'geo',
  'Perplexity',
  '2026-05-01',
  'medium',
  '["Perplexity", "API", "B2B", "企业搜索"]'::jsonb,
  'https://example.com/perplexity-api'
),
(
  '谷歌确认：页面体验信号下调，内容质量优先级提升',
  'Google 官方宣布调整排名因素权重，内容相关性和权威性成为新重点。',
  'Google 的最新算法更新反映了搜索行业的长期演变方向。

## 变化

- 页面体验信号权重下降（但仍然重要）
- E-E-A-T（特别是 Expertise）权重上升
- 内容新鲜度对某些查询类型影响更大',
  'seo',
  'Google SearchCentral',
  '2026-04-28',
  'high',
  '["Google", "算法更新", "E-E-A-T", "排名因素"]'::jsonb,
  'https://example.com/google-algorithm-update'
),
(
  '微软 Copilot 新增企业搜索功能',
  'Microsoft Copilot 现在可以从企业内部数据源和公网进行搜索。',
  'Microsoft 扩展了 Copilot 的搜索能力，覆盖企业内部和公网数据。

## 新特性

- 企业数据搜索（Enterprise Search）
- 跨源引用（Cross-source Citation）
- 安全性和权限控制',
  'ai',
  'Microsoft Blog',
  '2026-04-25',
  'medium',
  '["Microsoft", "Copilot", "企业搜索", "AI"]'::jsonb,
  'https://example.com/copilot-enterprise-search'
);

-- ============================================================================
-- Verification Query - Check total records inserted
-- ============================================================================
SELECT 
  (SELECT COUNT(*) FROM wseo_articles) as articles_count,
  (SELECT COUNT(*) FROM wseo_tutorials) as tutorials_count,
  (SELECT COUNT(*) FROM wseo_tutorial_lessons) as lessons_count,
  (SELECT COUNT(*) FROM wseo_news) as news_count;
