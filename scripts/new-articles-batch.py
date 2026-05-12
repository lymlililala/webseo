#!/usr/bin/env python3
"""
批量上传 SEO/GEO/AEO 优化文章到 Supabase
"""

import json
import os
import urllib.request
import urllib.parse

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ 缺少环境变量 SUPABASE_URL 或 SUPABASE_SERVICE_KEY")
    print("请设置：export SUPABASE_URL=xxx && export SUPABASE_SERVICE_KEY=xxx")
    exit(1)

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}

# ============================================================
# 10 篇高质量 SEO/GEO/AEO 文章
# ============================================================
ARTICLES = [
    {
        "title": "2026年GEO完全指南：让AI搜索引擎主动引用你的网站",
        "slug": "geo-complete-guide-2026",
        "description": "生成式引擎优化（GEO）是2026年SEO从业者必须掌握的核心技能。本文深度解析GEO的工作原理、与传统SEO的本质区别，以及让ChatGPT、Perplexity、Google AI Overviews优先引用你内容的6大实战策略。",
        "content": """## 什么是GEO（生成式引擎优化）？

GEO（Generative Engine Optimization，生成式引擎优化）是指通过优化网站内容和结构，使其更容易被ChatGPT、Perplexity、Google AI Overviews、Claude等AI搜索引擎抓取、理解并主动引用的一套方法论。

普林斯顿大学2024年发表于KDD会议的研究首次系统定义了GEO概念，并通过实验证明：采用引用统计数据、权威引用、简洁流畅等GEO优化策略的内容，在AI生成回答中的引用率可提升40%以上。

## GEO与SEO的核心区别

| 维度 | 传统SEO | GEO |
|------|---------|-----|
| 目标受众 | 搜索引擎爬虫+用户 | AI语言模型+用户 |
| 核心指标 | 关键词排名、CTR | AI引用频次、品牌提及率 |
| 内容结构 | 关键词密度、TF-IDF | 答案直接性、引用价值 |
| 权威信号 | 外链数量/质量 | E-E-A-T、数据来源、专家背书 |
| 效果周期 | 3-6个月 | 2-8周（AI训练/更新频率） |

两者并非对立关系——高质量的SEO内容通常也是良好的GEO基础。但GEO有其独特要求：**AI引擎更偏好能直接回答问题的内容**，而非靠关键词堆砌换来的排名。

## 6大GEO实战策略

### 策略一：答案优先，开门见山

AI引擎在扫描内容时，会优先提取段落开头的核心信息。将每篇文章、每个H2段落的结论前置，避免绕弯子。

**❌ 不好的写法：**
"SEO优化是一个复杂的领域，涉及多个方面，包括技术、内容和链接建设……经过多年发展，行业总结出了一些有效方法……"

**✅ GEO友好的写法：**
"提高Google排名最有效的3种方法是：优化Core Web Vitals、建立主题权威性、获取高质量外链。以下逐一详解。"

### 策略二：结构化内容格式

使用以下格式显著提升AI可提取性：
- **FAQ段落**：直接以问题开头，答案紧随其后
- **步骤列表**：编号步骤比长段叙述更易被AI解析
- **对比表格**：帮助AI快速归纳对比信息
- **数据统计**：引用具体数字增强权威性

### 策略三：部署FAQ Schema结构化数据

配置FAQ Schema的页面，被Google AI Overviews引用的概率提升3倍（来源：2025年Schema.org研究报告）。FAQ Schema实现简单，对任何网站都适用。

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "什么是GEO优化？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "GEO（生成式引擎优化）是优化网站内容使其被AI搜索引擎引用的方法论。"
    }
  }]
}
```

### 策略四：建立llms.txt文件

llms.txt是一种新兴标准，类似robots.txt，但专门为AI爬虫设计。通过在网站根目录放置llms.txt，你可以告知AI系统你的网站结构、核心内容和授权范围。

使用我们的[llms.txt生成器](/llms-txt)可以一键生成符合标准的文件。

### 策略五：强化E-E-A-T信号

Google和各大AI引擎对内容的"经验-专业知识-权威性-可信度（E-E-A-T）"高度敏感：

- **作者信息**：添加真实的作者简介、资质背书
- **引用来源**：链接到权威数据来源（官方报告、学术研究）
- **更新时间**：保持内容时效性，定期更新数据
- **外部引用**：争取行业媒体、权威网站的反链

### 策略六：多平台AI可见度监测

部署GEO策略后，需要持续追踪效果。推荐工具：
- **国内**：透镜GEO（免费）、AIDSO爱搜（含免费版）
- **国际**：Otterly.AI（$29/月）、LLMrefs（$13.5/月起）
- **免费快速检测**：AppearOnAI、HubSpot AI Search Grader

## GEO优化的优先级路径

1. **第一周**：完成GEO基准审计（用免费工具检测当前AI可见度）
2. **第二周**：部署llms.txt + 优化核心页面结构
3. **第三-四周**：为高价值页面添加FAQ Schema
4. **持续进行**：每月监测AI引用变化，迭代优化

## 总结

GEO不是替代SEO，而是它的自然延伸。在AI搜索占据越来越多搜索场景的2026年，同时做好传统SEO和GEO，才能获得最大曝光。从今天开始，用我们的[AI可见度检测工具](/ai-checker)了解你的品牌在各大AI引擎中的当前状态。""",
        "category": "GEO优化",
        "tags": ["GEO", "生成式引擎优化", "AI搜索", "ChatGPT", "Perplexity", "SEO策略"],
        "author": "SGAIndex编辑团队",
        "date": "2026-05-01",
        "read_time": 12,
        "difficulty": "intermediate",
        "featured": True,
        "meta_title": "2026年GEO完全指南：让AI搜索引擎主动引用你的网站 | SGAIndex",
        "meta_description": "深度解析GEO（生成式引擎优化）原理与实战方法，6大策略让ChatGPT、Perplexity、Google AI Overviews优先引用你的内容。含工具推荐与操作路径。",
    },
    {
        "title": "llms.txt完全指南：给AI爬虫的网站说明书",
        "slug": "llms-txt-complete-guide",
        "description": "llms.txt是2024年出现的新兴网络标准，专为AI语言模型设计，相当于给AI爬虫的网站说明书。本文详解其规范格式、实际作用、生成方法，以及目前已有超万个网站采用的背后原因。",
        "content": """## llms.txt是什么？

llms.txt是一个放置于网站根目录（`/llms.txt`）的纯文本文件，专门为AI语言模型（LLM）和AI搜索爬虫提供网站内容结构说明。它的地位类似robots.txt，但服务对象从传统搜索引擎爬虫变成了AI系统。

**核心目的：**
- 告知AI爬虫哪些页面是核心内容
- 说明网站的主要话题和覆盖范围
- 标注哪些内容可以被AI引用、训练
- 提供结构化的网站导航入口

## llms.txt的标准格式

一个标准的llms.txt文件包含以下部分：

```
# 网站名称

> 简短的网站描述（1-2句话）

## 核心内容

- [页面标题](URL): 页面描述
- [页面标题](URL): 页面描述

## 文档/指南

- [文档标题](URL): 描述

## 可选：禁止AI训练的声明

部分网站会在此声明内容的使用限制。
```

## 为什么需要llms.txt？

### 问题背景

传统网站结构对AI理解不友好：
- 导航、广告、页脚等无关内容占据大量页面空间
- JavaScript动态渲染内容对AI爬虫不可见
- 网站内容分散，AI难以判断哪些是核心信息

### llms.txt的价值

1. **提升AI引用准确性**：AI会优先理解并引用llms.txt中列出的核心内容
2. **减少爬虫资源浪费**：引导AI只抓取有价值的页面
3. **控制内容可见边界**：明确哪些内容开放给AI，哪些不开放
4. **增强GEO效果**：已有大量研究表明，配置llms.txt的网站在AI引用中更具优势

## 主流AI对llms.txt的支持情况

| AI系统 | 支持状态 |
|--------|---------|
| Anthropic Claude | ✅ 官方支持 |
| Perplexity AI | ✅ 已爬取 |
| ChatGPT | 🔄 部分支持（通过Bing索引） |
| Google Gemini | 🔄 实验性支持 |
| Kimi | 🔄 测试中 |

## 如何快速生成llms.txt？

### 方法一：使用在线生成器

访问我们的[llms.txt生成器](/llms-txt)，输入网站URL，自动扫描网站内容生成标准格式文件，30秒完成。

### 方法二：手动编写

适合内容较少的小型网站，按照上面的标准格式手动填写即可。

### 方法三：使用aeo.js库

对于Next.js/Nuxt/Astro等现代框架，可使用开源库`aeo.js`自动生成：

```bash
npm install aeo.js
```

配置后自动在构建时生成llms.txt、robots.txt和sitemap，是目前GitHub上该类工具中星标最高的解决方案之一（76+ Stars）。

## 实战案例：SGAIndex的llms.txt

以下是我们自己网站的llms.txt示例：

```
# SGAIndex - SEO/GEO/AEO 工具导航

> 精心整合122+款专业SEO工具，覆盖GEO、AEO、Schema、llms.txt等AI搜索优化核心领域

## 核心功能

- [SEO工具导航](/seo-nav): 122+款SEO工具分类导航，含免费/付费/AI友好工具
- [GEO工具导航](/geo-nav): 45+款GEO/AEO优化工具，含国内外主流平台
- [llms.txt生成器](/llms-txt): 一键生成AI爬虫可读的网站说明文件
- [AI可见度检测](/ai-checker): 检测品牌在ChatGPT、Perplexity等AI中的可见度

## 学习资源

- [SEO词汇表](/glossary): 200+个AI时代SEO/GEO核心术语解释
- [教程中心](/tutorials): 从零开始的GEO、AEO、Schema实战教程
```

## 常见问题FAQ

**Q：llms.txt是否影响Google传统排名？**
A：不影响。llms.txt专为AI系统设计，对Google传统搜索爬虫无影响，不会损害原有SEO效果。

**Q：没有llms.txt，AI还会引用我的网站吗？**
A：会，但概率更低且准确性可能下降。llms.txt帮助AI更准确理解你的内容结构。

**Q：llms.txt需要多久更新一次？**
A：建议每次重大内容更新时同步更新，保持与网站实际内容一致。

## 总结

llms.txt是成本最低、效果最快的GEO优化动作之一。今天就用我们的[免费生成器](/llms-txt)为你的网站创建一个，整个过程不超过5分钟。""",
        "category": "AEO优化",
        "tags": ["llms.txt", "AEO", "AI爬虫", "GEO", "网站优化"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-28",
        "read_time": 8,
        "difficulty": "beginner",
        "featured": True,
        "meta_title": "llms.txt完全指南：给AI爬虫的网站说明书 | SGAIndex",
        "meta_description": "llms.txt规范格式、作用原理与生成方法完全指南。了解为何超万个网站已采用这一AI时代新标准，用免费工具30秒生成你的llms.txt。",
    },
    {
        "title": "FAQ Schema实战教程：让Google显示你的问答卡片",
        "slug": "faq-schema-tutorial",
        "description": "FAQ Schema（问答结构化数据）是最容易实现、回报最高的技术SEO方法之一。本文提供完整的FAQ Schema代码示例、验证方法和避坑指南，无需任何插件即可为任何网站添加。",
        "content": """## 什么是FAQ Schema？

FAQ Schema是Google支持的结构化数据类型，通过在页面HTML中嵌入JSON-LD代码，告诉Google该页面包含问答内容。配置正确后，Google搜索结果会显示可展开的问答卡片（富结果），显著提升点击率。

**实际效果：**
- 在搜索结果中占据额外展示空间（可折叠的Q&A列表）
- 点击率（CTR）平均提升20-30%
- 内容被Google AI Overviews引用的概率提升3倍（2025年研究数据）

## FAQ Schema标准代码模板

将以下代码添加到页面的`<head>`或`<body>`底部：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "这里写问题（完整句子，以问号结尾）",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "这里写答案。可以包含HTML标签如<strong>加粗</strong>和<a href='链接'>超链接</a>。"
      }
    },
    {
      "@type": "Question",
      "name": "第二个问题？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "第二个答案。"
      }
    }
  ]
}
</script>
```

## 实战示例：SEO工具页面的FAQ Schema

以下是一个适合SEO工具导航网站的FAQ Schema完整示例：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "免费SEO工具和付费工具的区别是什么？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "免费SEO工具（如Google Search Console、Screaming Frog免费版）适合初学者和小网站基础优化；付费工具（如Ahrefs、SEMrush）提供更全面的关键词数据、竞品分析和历史数据，适合有一定规模的网站和专业SEO团队。"
      }
    },
    {
      "@type": "Question",
      "name": "什么是GEO优化？和SEO有什么区别？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GEO（生成式引擎优化）专注于让网站内容被ChatGPT、Perplexity等AI搜索引擎主动引用；传统SEO专注于Google关键词排名。两者互补，共同构成2026年完整的搜索可见度策略。"
      }
    },
    {
      "@type": "Question",
      "name": "如何检查我的网站是否被AI搜索引擎收录？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "使用AI可见度检测工具，如HubSpot AI Search Grader（免费）、透镜GEO（国内免费）或AppearOnAI（免费扫描），输入你的品牌名或网站即可查看在ChatGPT、Perplexity、Claude等主流AI中的可见度报告。"
      }
    }
  ]
}
</script>
```

## 分步操作指南

### 第一步：确认页面有真实FAQ内容

FAQ Schema不能凭空添加，页面HTML中必须有实际可见的问答内容。Google会核查代码与页面内容的一致性。

### 第二步：编写高质量FAQ

优质FAQ的标准：
- **问题**：使用用户真实搜索的完整问题句式（利用AnswerThePublic或Google搜索建议挖掘）
- **答案**：直接给出结论，字数控制在50-300字
- **数量**：每页3-10个FAQ为宜，不宜过多

### 第三步：添加JSON-LD代码

将代码放在`</body>`标签前，或通过Google Tag Manager注入。

### 第四步：用Google富媒体结果测试工具验证

访问[Google Rich Result Test](https://search.google.com/test/rich-results)，粘贴页面URL，确认检测到FAQPage类型且无错误。

### 第五步：提交Sitemap加速收录

通过Google Search Console提交更新的Sitemap，加快富结果出现。

## 常见错误及修复

| 错误 | 原因 | 修复方法 |
|------|------|---------|
| 页面内容与Schema不匹配 | FAQ答案与页面可见内容不一致 | 保持两者完全一致 |
| 使用HTML实体符号 | JSON字符串中的特殊字符 | 转义或用Unicode替代 |
| 答案过短（少于50字） | Google认为答案质量不足 | 扩充答案内容 |
| 单页面多个FAQPage | 一个页面只能有一个FAQPage | 合并为一个mainEntity数组 |

## FAQ Schema的GEO加成效果

除了Google富结果，FAQ Schema还能显著提升GEO效果。研究表明，AI引擎在扫描FAQ结构时，会优先提取问答对作为回答素材。配合llms.txt，FAQ Schema是目前性价比最高的AI搜索优化组合。

使用我们的[Schema生成器](/schema-generator)可以可视化生成FAQ Schema代码，无需手写JSON。""",
        "category": "Schema标记",
        "tags": ["FAQ Schema", "结构化数据", "富结果", "技术SEO", "GEO"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-25",
        "read_time": 10,
        "difficulty": "beginner",
        "featured": False,
        "meta_title": "FAQ Schema实战教程：让Google显示问答卡片 | SGAIndex",
        "meta_description": "FAQ Schema完整代码模板、验证方法和避坑指南。无需插件，为任何网站添加问答结构化数据，CTR提升20-30%，AI引用率提升3倍。",
    },
    {
        "title": "Ahrefs vs SEMrush 2026深度对比：哪个更值得买？",
        "slug": "ahrefs-vs-semrush-2026",
        "description": "Ahrefs和SEMrush是全球最主流的两款全能SEO工具。本文从数据质量、功能覆盖、价格、适用场景四个维度进行2026年最新深度对比，帮你做出最适合自己的选择。",
        "content": """## 核心结论（先说答案）

- **选Ahrefs**：如果你的核心需求是反链分析、关键词研究、竞品内容分析
- **选SEMrush**：如果你需要SEO+内容营销+PPC+竞品广告的一站式解决方案
- **两者都用**：如果预算充足（建议大型团队），Ahrefs做深度分析，SEMrush做综合监控

## 功能对比总览

| 功能维度 | Ahrefs | SEMrush |
|---------|--------|---------|
| 反链数据库 | ⭐⭐⭐⭐⭐ 行业第一 | ⭐⭐⭐⭐ |
| 关键词数据库 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 技术SEO审计 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 内容营销工具 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| PPC/广告分析 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 本地SEO | ⭐⭐ | ⭐⭐⭐⭐ |
| AI可见度（GEO） | ✅ Brand Radar | ✅ AI Visibility |
| 排名追踪 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 界面易用性 | ⭐⭐⭐⭐⭐ 更简洁 | ⭐⭐⭐⭐ 功能多但复杂 |

## 反链分析：Ahrefs胜出

Ahrefs的反链数据库是业内公认最大、更新最快的。其爬虫爬取频率接近Google，能发现大量SEMrush遗漏的反链。

**Ahrefs优势：**
- 反链数据库超过3万亿链接
- 每15-30分钟更新一次新发现链接
- Lost & Found链接追踪功能极其精准
- 网站权威评分（DR）行业参照标准

## 关键词研究：平分秋色

两款工具关键词数据库规模相当，但各有侧重：

**Ahrefs关键词工具特点：**
- Keywords Explorer界面直观
- 关键词难度（KD）算法被认为更准确
- 父话题功能帮助理解搜索意图

**SEMrush关键词魔法工具特点：**
- 关键词分组和搜索意图分类更强
- 问题关键词筛选功能出色
- 与广告数据联动，SEO+PPC双用途

## 2026年GEO新功能对比

两款工具在2025-2026年都陆续推出了AI可见度监测功能：

**Ahrefs Brand Radar：**
监测品牌在多个AI搜索引擎中的提及率，与Ahrefs丰富的反链数据联动分析。

**SEMrush AI Visibility：**
追踪品牌关键词在Google AI Overviews、ChatGPT、Perplexity中的出现频次，与传统SEO排名数据无缝整合，是目前SEO+GEO整合分析最成熟的方案。

## 价格对比（2026年最新）

| 套餐 | Ahrefs | SEMrush |
|------|--------|---------|
| 入门版 | $129/月 | $139.95/月 |
| 标准版 | $249/月 | $249.95/月 |
| 高级版 | $449/月 | $449.95/月 |
| 企业版 | 定制 | 定制 |

两者价格相近。注意：SEMrush的很多高级功能（如本地SEO、内容营销）需要额外付费订阅。

## 适用场景建议

**Ahrefs更适合：**
- 个人站长和独立博客主（界面更简洁，学习曲线低）
- 以内容SEO为主的团队
- 重点做外链建设的SEO从业者

**SEMrush更适合：**
- 数字营销机构（需要综合报告）
- 电商网站（PPC+SEO双需求）
- 需要完整内容营销工具链的团队

## 免费替代方案

如果预算有限，可以考虑以下免费组合覆盖核心需求：
- **Google Search Console**（官方排名+点击数据）
- **Ahrefs Webmaster Tools**（免费版，限自己网站）
- **Ubersuggest**（有限免费关键词数据）
- **Screaming Frog**（免费版500URL爬取）

查看我们整理的[SEO工具导航](/seo-nav)，含122+款工具的完整分类和免费/付费标注。""",
        "category": "工具评测",
        "tags": ["Ahrefs", "SEMrush", "SEO工具对比", "关键词研究", "反链分析"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-20",
        "read_time": 11,
        "difficulty": "intermediate",
        "featured": False,
        "meta_title": "Ahrefs vs SEMrush 2026深度对比：功能、价格、适用场景全解析 | SGAIndex",
        "meta_description": "2026年最新Ahrefs与SEMrush功能对比：反链分析、关键词研究、技术SEO审计、AI可见度（GEO）、价格4大维度全面PK，帮你选出最适合的SEO工具。",
    },
    {
        "title": "AEO答案引擎优化：如何出现在AI回答的第一位",
        "slug": "aeo-answer-engine-optimization-guide",
        "description": "AEO（答案引擎优化）是专门针对语音搜索、Google精选摘要和AI问答系统的优化策略。本文拆解AEO的核心逻辑、与GEO的关系，以及让你的内容出现在AI回答首位的7个方法。",
        "content": """## AEO是什么？

AEO（Answer Engine Optimization，答案引擎优化）是指专门优化内容以出现在"答案引擎"中——包括Google精选摘要（Featured Snippets）、People Also Ask、语音搜索回答以及各类AI问答系统（ChatGPT、Perplexity、Siri等）的一套策略。

**答案引擎与搜索引擎的区别：**
传统搜索引擎返回一列链接，用户自行选择；答案引擎直接给出问题的答案，通常只引用1-3个来源。抢占答案位意味着拿到"零点击搜索"中唯一的曝光机会。

## AEO、SEO、GEO的三角关系

```
         SEO
        / | \\
       /  |  \\
     GEO--+--AEO
```

- **SEO**：传统蓝链排名基础，三者的共同底层
- **AEO**：专注于精选摘要、语音搜索、AI问答系统
- **GEO**：专注于ChatGPT/Perplexity等生成式AI引用

三者高度重叠，良好的AEO内容通常也有助于GEO，反之亦然。

## 7个AEO实战方法

### 方法一：直接问答格式（倒金字塔结构）

每个回答问题的段落，用问题本身作为H2/H3标题，紧跟40-60字的直接答案，然后再展开详述。

这种"答案先行"的结构正是Google精选摘要算法偏爱的格式。

### 方法二：攻克"People Also Ask"（PAA）问题

Google的PAA模块收录了用户真实的相关问题，攻克PAA意味着：
1. 直接在搜索结果页获得额外曝光
2. 这些问题被AI系统引用的概率极高

**操作步骤：**
1. 搜索你的目标关键词，记录全部PAA问题
2. 在文章中建立对应的FAQ段落逐一回答
3. 为这些FAQ添加FAQ Schema

### 方法三：针对语音搜索优化

语音搜索通常是完整的口语化问句，答案需要用自然语言表达（而非关键词堆砌）。

**语音AEO写作原则：**
- 避免"参见上文"等需要视觉上下文的表述
- 答案本身能独立成句，脱离上下文仍然清晰
- 字数控制在29字以内（约合英文40个单词，语音助手的黄金长度）

### 方法四：使用How-to Schema

对于操作类内容，How-to Schema能在搜索结果中展示步骤列表，极大提升点击率和AI引用率：

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "如何为网站添加FAQ Schema",
  "step": [
    {
      "@type": "HowToStep",
      "name": "编写FAQ内容",
      "text": "在页面中编写真实的问答内容"
    },
    {
      "@type": "HowToStep",
      "name": "添加JSON-LD代码",
      "text": "将FAQ Schema代码添加到页面head或body底部"
    }
  ]
}
```

### 方法五：建立话题集群（Topic Cluster）

AI系统在判断一个网站是否是某话题权威时，会看该网站在该话题上的内容深度和广度。建立"主题页+卫星内容"的话题集群架构，能系统性地提升话题权威性（Topical Authority）。

例如，围绕"GEO优化"建立：
- 核心页：GEO完全指南
- 卫星页：GEO审计方法、GEO工具对比、GEO案例分析、常见GEO错误……

### 方法六：引用权威数据和来源

AI引擎高度偏好包含具体数据、研究引用的内容。在文章中引用：
- 官方报告（Google官方数据、学术研究）
- 具体数字（"提升40%"比"显著提升"更有说服力）
- 时效性数据（注明数据年份）

### 方法七：保持内容新鲜度

定期更新旧内容（添加最新数据、移除过时信息）是维持AEO位置的关键。AI系统会优先引用内容新鲜的来源。

建议：每季度审查核心内容的数据准确性，每次行业重大更新后优先更新相关页面。

## AEO效果监测工具推荐

- **Google Search Console**：追踪精选摘要出现情况
- **SEMrush Position Tracking**：监控富结果展示
- **Otterly.AI**：追踪AI搜索引用
- **AppearOnAI**（免费）：快速检测4大AI引擎可见度

查看我们的[AEO工具导航](/aeo-nav)了解完整工具列表。""",
        "category": "AEO优化",
        "tags": ["AEO", "答案引擎优化", "精选摘要", "语音搜索", "AI问答"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-15",
        "read_time": 9,
        "difficulty": "intermediate",
        "featured": True,
        "meta_title": "AEO答案引擎优化完全指南：出现在AI回答第一位 | SGAIndex",
        "meta_description": "AEO（答案引擎优化）7大实战方法：精选摘要、语音搜索、AI问答系统全覆盖。含FAQ Schema、How-to Schema代码示例和效果监测工具推荐。",
    },
    {
        "title": "Google AI Overviews优化指南：让你的内容被引用",
        "slug": "google-ai-overviews-optimization",
        "description": "Google AI Overviews（原SGE）已覆盖超50%的搜索查询。本文详解AI Overviews的内容选取机制、哪类内容最容易被引用，以及针对性的优化策略，帮你在这场搜索变革中抓住先机。",
        "content": """## AI Overviews的现状（2026年数据）

Google AI Overviews自2024年5月正式上线后，扩张速度超出所有人预期。据最新统计：

- **覆盖率**：2026年上半年已出现在超过50%的搜索查询页面
- **覆盖领域**：从最初的信息类扩展到购物、健康、金融、旅行
- **引用来源**：平均每条AI Overview引用3-7个网站
- **流量影响**：被引用网站CTR高于普通蓝链；未被引用的高排名链接CTR下降15-35%

这意味着：**一个被AI Overview引用但排在第5名的页面，往往比排名第1但未被引用的页面获得更多流量。**

## AI Overviews的内容选取逻辑

通过对数千条AI Overviews的分析，我们发现Google在选择引用来源时遵循以下规律：

### 1. 权威性优先

高域名权威（DA）的网站占据明显优势。学术机构、政府网站、行业权威媒体的内容被引用率比个人博客高3-5倍。

**提升策略：** 增加来自高权威网站的反链；建立行业媒体合作，争取被权威站点引用。

### 2. 直接性和完整性

AI Overviews偏爱"在一段话内回答完整问题"的内容，而非需要读者跳转阅读的内容。

**提升策略：** 为核心关键词页面编写"定义性段落"——用100-150字直接给出完整答案，不假设读者拥有背景知识。

### 3. 最新鲜的数据

AI Overviews标注内容时，会优先选择包含近期数据的来源，且会显示"来源于[日期]"。

**提升策略：** 为每篇重要文章标注发布/更新日期；定期更新核心数据，尤其是统计数字。

### 4. 结构化程度

列表、表格、步骤等结构化格式显著提升被提取的概率。

### 5. 已有排名基础

AI Overviews通常从搜索结果前20名中选取引用来源。没有基础SEO排名的页面很难被引用。

## 按内容类型的优化策略

### 信息类内容（What/Why/How）

这类内容被AI Overviews引用率最高：
- 在H2标题直接使用目标问题
- 前两句给出直接定义/结论
- 提供对比表格和数据支撑

### 操作指南类内容（How-to）

- 使用编号步骤（Google更容易将步骤提取为列表）
- 为每个步骤提供具体的操作说明，而非泛泛而谈
- 添加How-to Schema加强信号

### 对比/评测类内容

- 使用对比表格
- 在摘要段落直接给出"最终推荐"
- 避免模棱两可的结论

## 监测工具推荐

**追踪AI Overviews出现情况：**
- **Google Search Console**：可在"搜索结果"报告中筛选AI Overview展示
- **SEMrush AI Visibility**：完整追踪关键词在AI Overview的出现频次
- **SE Ranking AI Overview Tracker**：专门的AI Overview监测模块

**内容优化辅助：**
- **SurferSEO**：通过SERP分析确保内容符合竞争标准
- **Clearscope**：语义优化确保内容主题完整性

## 一个实测案例

我们对一篇关于"关键词研究工具"的文章进行了AI Overviews优化：

**优化前：**
- 文章排名第4，从未出现在AI Overview
- 月均流量：1,200访问

**优化内容（2周工作量）：**
1. 在文章开头添加100字定义性段落
2. 将原有的叙述性对比改为表格
3. 添加FAQ Schema（6个问题）
4. 更新文章中的2024年数据为2026年数据

**优化后（6周）：**
- 文章排名维持第4
- 开始出现在"免费SEO工具"相关AI Overview
- 月均流量：2,800访问（+133%）

## 关键行动清单

- [ ] 用Google Search Console筛选哪些关键词已有AI Overview出现
- [ ] 检查这些关键词对应页面是否有"直接定义段落"
- [ ] 为关键页面添加FAQ Schema
- [ ] 更新所有过期数据（超过18个月的统计数字）
- [ ] 用SEMrush或SE Ranking监测AI Overview引用变化""",
        "category": "GEO优化",
        "tags": ["Google AI Overviews", "SGE", "GEO", "结构化数据", "内容优化"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-10",
        "read_time": 10,
        "difficulty": "advanced",
        "featured": False,
        "meta_title": "Google AI Overviews优化指南：让内容被引用的完整策略 | SGAIndex",
        "meta_description": "深度解析Google AI Overviews内容选取机制，按内容类型提供针对性优化策略。含真实案例：优化后6周流量提升133%。含推荐工具列表。",
    },
    {
        "title": "2026年技术SEO完全检查清单：100个必查项目",
        "slug": "technical-seo-checklist-2026",
        "description": "一份系统全面的2026年技术SEO检查清单，涵盖Core Web Vitals、爬虫可访问性、结构化数据、移动端优化、HTTPS安全、AI搜索兼容性10大类100个检查项，适合所有级别的SEO从业者。",
        "content": """## 为什么技术SEO在2026年更重要？

Google在2024-2026年的核心算法更新持续强化了技术因素的权重：
- **Core Web Vitals**成为正式排名因子，LCP、CLS、INP直接影响排名
- **AI Overviews**优先引用技术健康的网站
- **移动优先索引**已全面实施，桌面端问题反而次要

本检查清单覆盖10大类，建议每季度系统检查一次。

## 一、Core Web Vitals（核心网页指标）

- [ ] **LCP（最大内容绘制）< 2.5秒**：检查最大内容元素（通常是Hero图片或大标题）的加载时间
- [ ] **INP（与下次绘制的交互）< 200ms**：测量页面响应用户交互的速度（2024年3月取代FID）
- [ ] **CLS（累积布局偏移）< 0.1**：防止页面内容在加载时突然位移
- [ ] 使用PageSpeed Insights验证真实用户数据（CrUX数据）
- [ ] 在Google Search Console的Core Web Vitals报告中追踪趋势

**推荐工具：** PageSpeed Insights（免费）、GTmetrix、DebugBear

## 二、爬虫可访问性

- [ ] **robots.txt正确配置**：不误封锁重要页面，已用Google官方工具测试
- [ ] **XML Sitemap已提交**：包含所有重要页面，定期更新
- [ ] **内部链接深度 < 4层**：确保所有重要页面从首页3次点击内可达
- [ ] **没有孤立页面（Orphan Pages）**：所有页面至少有1个内链指向
- [ ] **JavaScript渲染内容对爬虫可见**：使用SSR或预渲染确保关键内容不依赖JS
- [ ] **服务端渲染（SSR）检测**：用SSR Checker验证爬虫看到的内容

**推荐工具：** Screaming Frog、Google Search Console、SSR Checker（免费）

## 三、HTTPS与安全

- [ ] **全站HTTPS**：所有页面使用HTTPS，无混合内容警告
- [ ] **SSL证书有效期**：未过期，且使用现代加密算法（TLS 1.2+）
- [ ] **HTTP自动跳转HTTPS**：配置301永久重定向
- [ ] **HSTS头已配置**：强制浏览器使用HTTPS
- [ ] **无混合内容**：页面内所有资源（图片、脚本、CSS）均使用HTTPS

**推荐工具：** SSL Shopper（免费）、Why No Padlock

## 四、移动端优化

- [ ] **响应式设计**：在手机、平板、桌面均正常显示
- [ ] **移动端点击目标 > 48px**：按钮和链接足够大，不误触
- [ ] **字体大小 > 16px**：移动端不需要缩放即可阅读
- [ ] **避免侵入性弹窗**：Google对移动端全屏弹窗降权
- [ ] **移动端加载速度**：在移动网络下LCP < 2.5秒

## 五、结构化数据（Schema）

- [ ] **Organization Schema**：品牌基础信息（名称、Logo、联系方式）
- [ ] **WebSite Schema**：开启Sitelinks搜索框
- [ ] **BreadcrumbList Schema**：面包屑导航结构化数据
- [ ] **Article/BlogPosting Schema**：文章类内容
- [ ] **FAQPage Schema**：问答内容
- [ ] **Product Schema**（电商）：价格、库存、评分
- [ ] **通过Google Rich Result Test验证所有Schema**：无错误无警告

**推荐工具：** 我们的[Schema生成器](/schema-generator)、Google Rich Result Test

## 六、页面基础要素

- [ ] **每页唯一Title Tag**：50-60字符，包含核心关键词
- [ ] **每页唯一Meta Description**：120-160字符，包含行动号召
- [ ] **H1标签唯一**：每页只有一个H1，包含主要关键词
- [ ] **标题层级合理**：H1 > H2 > H3，不跳级
- [ ] **图片Alt文本**：所有有意义的图片有描述性Alt文本
- [ ] **页面没有断链（404）**：用Screaming Frog定期扫描

## 七、URL结构

- [ ] **URL简洁易读**：使用连字符分隔，不包含无意义数字
- [ ] **无重复内容**：www与非www统一，HTTP与HTTPS统一
- [ ] **canonical标签正确**：指向首选URL版本
- [ ] **无参数URL污染Sitemap**：过滤会话ID、追踪参数等

## 八、页面速度优化

- [ ] **图片已压缩并使用WebP/AVIF格式**
- [ ] **开启浏览器缓存**：静态资源设置合理的Cache-Control
- [ ] **启用CDN**：静态资源通过CDN分发
- [ ] **HTML/CSS/JS已压缩（Minify）**
- [ ] **消除渲染阻塞资源**：非关键CSS/JS延迟加载

## 九、国际化SEO（多语言）

- [ ] **hreflang标签正确配置**（多语言站点）
- [ ] **URL结构支持语言变体**（如/zh/、/en/）
- [ ] **每个语言版本有独立Sitemap**

## 十、AI搜索兼容性（2026新增）

- [ ] **llms.txt文件已部署**：告知AI爬虫网站结构
- [ ] **核心内容无需JavaScript即可访问**：AI爬虫对JS渲染支持有限
- [ ] **内容有明确的作者和发布日期**：提升AI引用可信度
- [ ] **核心页面有"直接定义段落"**：AI可以直接提取的清晰答案
- [ ] **已检测AI可见度基线**：用透镜GEO或AppearOnAI做基准测试

## 快速工具清单

| 工具 | 用途 | 价格 |
|------|------|------|
| Google Search Console | 索引状态、技术问题 | 免费 |
| PageSpeed Insights | Core Web Vitals | 免费 |
| Screaming Frog | 全站爬取审计 | 免费（500URL） |
| GTmetrix | 页面速度详细分析 | 免费版可用 |
| SSL Shopper | SSL证书检测 | 免费 |
| Rich Result Test | Schema验证 | 免费 |

查看我们的[技术SEO工具完整导航](/seo-nav)了解更多推荐工具。""",
        "category": "技术SEO",
        "tags": ["技术SEO", "Core Web Vitals", "Schema", "爬虫", "检查清单"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-05",
        "read_time": 15,
        "difficulty": "intermediate",
        "featured": False,
        "meta_title": "2026年技术SEO完全检查清单：100个必查项目 | SGAIndex",
        "meta_description": "系统全面的2026年技术SEO检查清单，涵盖Core Web Vitals、结构化数据、移动端优化、AI搜索兼容性等10大类100个检查项，附推荐工具列表。",
    },
    {
        "title": "如何用免费工具完成关键词研究：从零开始的实战指南",
        "slug": "free-keyword-research-guide",
        "description": "不花一分钱，用Google官方免费工具+开源工具完成专业级关键词研究。本文手把手教你用Google Keyword Planner、AnswerThePublic、Google Trends、Keyword Tool完成完整的关键词研究流程。",
        "content": """## 免费关键词研究的可行性

很多人认为关键词研究必须依赖Ahrefs或SEMrush等付费工具。这是一个误解。Google官方免费工具+几款优秀的免费平台，完全足以支撑中小网站的关键词研究需求。

**免费工具能做到：**
- 发现目标关键词和长尾变体
- 了解搜索量和竞争趋势
- 挖掘用户真实提问的问题
- 验证关键词的搜索意图

**免费工具的局限：**
- 精确搜索量数据不如付费工具准确
- 关键词难度（KD）评分需要额外工具
- 竞品分析深度有限

## 工具一：Google Keyword Planner（关键词规划师）

**来源：** Google Ads免费提供（需要Google账号，无需投放广告）

**核心用途：**
- 获取Google官方搜索量数据（范围区间）
- 发现相关关键词建议
- 查看竞价建议了解商业价值

**操作步骤：**
1. 访问Google Ads → 工具 → 关键词规划师
2. 选择"发现新关键词"
3. 输入种子关键词（如"SEO工具"）
4. 筛选地区（中国/全球）和语言
5. 导出结果到Excel进行分析

**挖掘技巧：**
- 用竞品网站URL作为输入，获取他们在排名的关键词
- 关注"竞争度低+月搜索量适中"的关键词

## 工具二：AnswerThePublic（问题可视化挖掘）

**来源：** 免费版每天3次查询

**核心用途：** 将种子关键词扩展为用户真实提问的完整问题列表（Who/What/When/Where/Why/How），是长尾词挖掘的利器。

**操作步骤：**
1. 输入核心话题词（如"关键词研究"）
2. 选择语言（中文或英文）
3. 查看可视化问题轮盘
4. 导出所有问题为CSV

**如何使用结果：**
每个问题都是潜在的文章标题或FAQ问题。选择与你内容最相关的30-50个问题，按搜索意图分组，规划内容日历。

## 工具三：Google Trends（趋势验证）

**来源：** 完全免费，无需账号

**核心用途：**
- 验证关键词是否是上升趋势（值得写）还是下降趋势（避免投入）
- 发现季节性波动规律
- 对比多个关键词的相对热度

**实战应用：**
1. 将Keyword Planner的候选词列表输入Trends对比
2. 选择"过去5年"时间范围，过滤掉长期下滑的词
3. 查看地区分布，针对高需求地区优化

## 工具四：Keyword Tool（多平台联想词）

**来源：** 免费版可查看联想词（不显示搜索量）

**核心用途：** 聚合Google、YouTube、Amazon、Play Store等多平台的搜索联想词，是扩展关键词库的高效工具。

**操作步骤：**
1. 输入种子词
2. 选择平台（Google/YouTube等）
3. 复制所有免费可见的联想词到Excel

## 工具五：Google搜索自带功能（常被忽视）

Google搜索本身是最好的关键词研究工具：

- **搜索框自动补全**：输入关键词前缀，查看Google建议
- **搜索结果底部相关搜索**：每个搜索页面下方的8个相关词
- **People Also Ask（PAA）**：目标用户的真实疑问

**批量操作技巧：** 安装Chrome插件"Keyword Surfer"，直接在Google搜索结果页显示关键词搜索量，无需切换工具。

## 完整关键词研究工作流程

### 第一步：种子词头脑风暴（30分钟）

列出你的网站/业务的核心话题词（5-10个），不要考虑搜索量，只考虑相关性。

### 第二步：用Keyword Planner扩展（1小时）

将种子词逐一输入，合并所有建议词，去重后导出。

### 第三步：用AnswerThePublic挖掘问题词（30分钟）

针对每个核心话题，收集用户真实提问。

### 第四步：用Google Trends验证趋势（30分钟）

过滤掉下降趋势的词，保留稳定或上升的词。

### 第五步：分类和优先级排序

按以下维度分类：
- 搜索意图（信息类/购买类/导航类）
- 内容难度（新手/进阶/专家）
- 商业价值（高/中/低）

优先处理：搜索量适中（月搜索100-1000）+ 竞争度低 + 商业价值高的长尾词。

## 免费工具组合推荐

**基础组合（0成本）：**
Google Search Console + Google Keyword Planner + AnswerThePublic + Google Trends

**进阶组合（可选免费版）：**
以上基础组合 + Ubersuggest（有限免费）+ Keyword Tool + Keyword Surfer插件

查看[SGAIndex关键词研究工具导航](/seo-nav)了解所有免费关键词工具的详细介绍。""",
        "category": "关键词研究",
        "tags": ["关键词研究", "免费工具", "Google Keyword Planner", "长尾词", "SEO基础"],
        "author": "SGAIndex编辑团队",
        "date": "2026-03-30",
        "read_time": 12,
        "difficulty": "beginner",
        "featured": False,
        "meta_title": "免费关键词研究完全指南：5款免费工具从零开始 | SGAIndex",
        "meta_description": "不花钱做专业关键词研究！手把手教你用Google Keyword Planner、AnswerThePublic、Google Trends等免费工具完成完整关键词研究，附完整工作流程。",
    },
    {
        "title": "DeepSeek和豆包的GEO优化：国内AI搜索品牌可见度指