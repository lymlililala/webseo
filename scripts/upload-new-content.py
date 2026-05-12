#!/usr/bin/env python3
"""
批量上传 SEO/GEO/AEO 优化文章和新闻到 Supabase
"""

import json
import sys
import urllib.request
import urllib.error
from datetime import datetime

# ======== Supabase 配置 ========
SUPABASE_URL = "https://tixgzezefjjsyuzgdhcd.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E"

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": "Bearer " + SUPABASE_SERVICE_KEY,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}


def upsert_records(table, records):
    url = SUPABASE_URL + "/rest/v1/" + table
    data = json.dumps(records, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


# =====================================================================
# 文章数据 (10篇)
# =====================================================================
ARTICLES = [
    {
        "title": "2026年GEO完全指南：让AI搜索引擎主动引用你的网站",
        "slug": "geo-complete-guide-2026",
        "description": "生成式引擎优化（GEO）是2026年SEO从业者必须掌握的核心技能。深度解析GEO的工作原理、与传统SEO的本质区别，以及让ChatGPT、Perplexity、Google AI Overviews优先引用你内容的6大实战策略。",
        "content": (
            "## 什么是GEO（生成式引擎优化）？\n\n"
            "GEO（Generative Engine Optimization）是指通过优化网站内容和结构，使其更容易被ChatGPT、Perplexity、Google AI Overviews、Claude等AI搜索引擎抓取、理解并主动引用的一套方法论。\n\n"
            "普林斯顿大学2024年发表于KDD会议的研究首次系统定义了GEO概念，通过实验证明：采用GEO优化策略的内容，在AI生成回答中的引用率可提升40%以上。\n\n"
            "## GEO与SEO的核心区别\n\n"
            "| 维度 | 传统SEO | GEO |\n"
            "|------|---------|-----|\n"
            "| 目标受众 | 搜索引擎爬虫+用户 | AI语言模型+用户 |\n"
            "| 核心指标 | 关键词排名、CTR | AI引用频次、品牌提及率 |\n"
            "| 内容结构 | 关键词密度、TF-IDF | 答案直接性、引用价值 |\n"
            "| 权威信号 | 外链数量/质量 | E-E-A-T、数据来源、专家背书 |\n"
            "| 效果周期 | 3-6个月 | 2-8周 |\n\n"
            "## 6大GEO实战策略\n\n"
            "### 策略一：答案优先，开门见山\n\n"
            "AI引擎在扫描内容时，会优先提取段落开头的核心信息。将每篇文章的结论前置，避免绕弯子。\n\n"
            "**GEO友好的写法：**「提高Google排名最有效的3种方法是：优化Core Web Vitals、建立主题权威性、获取高质量外链。以下逐一详解。」\n\n"
            "### 策略二：结构化内容格式\n\n"
            "使用FAQ段落、编号步骤、对比表格、具体数据统计，显著提升AI可提取性。\n\n"
            "### 策略三：部署FAQ Schema结构化数据\n\n"
            "配置FAQ Schema的页面，被Google AI Overviews引用的概率提升3倍（2025年研究数据）。使用我们的[Schema生成器](/schema-generator)可快速创建FAQ Schema代码。\n\n"
            "### 策略四：建立llms.txt文件\n\n"
            "llms.txt是新兴AI爬虫标准，类似robots.txt。使用我们的[llms.txt生成器](/llms-txt)一键生成符合标准的文件。\n\n"
            "### 策略五：强化E-E-A-T信号\n\n"
            "- 添加真实的作者简介、资质背书\n"
            "- 链接到权威数据来源\n"
            "- 保持内容时效性\n"
            "- 争取行业媒体的反链\n\n"
            "### 策略六：多平台AI可见度监测\n\n"
            "- **国内**：透镜GEO（免费）、AIDSO爱搜（含免费版）\n"
            "- **国际**：Otterly.AI（$29/月）、LLMrefs（$13.5/月起）\n"
            "- **免费检测**：AppearOnAI、HubSpot AI Search Grader\n\n"
            "## GEO优化优先级路径\n\n"
            "1. **第一周**：完成GEO基准审计\n"
            "2. **第二周**：部署llms.txt + 优化核心页面结构\n"
            "3. **第三-四周**：为高价值页面添加FAQ Schema\n"
            "4. **持续进行**：每月监测AI引用变化\n\n"
            "## 常见问题FAQ\n\n"
            "**Q：GEO优化需要多长时间看到效果？**\n"
            "A：GEO效果通常在2-8周内可见，远快于传统SEO的3-6个月。\n\n"
            "**Q：做了GEO优化会影响Google传统排名吗？**\n"
            "A：不会。GEO优化措施与传统SEO目标高度一致，两者相互促进。\n\n"
            "## 总结\n\n"
            "GEO不是替代SEO，而是它的自然延伸。用我们的[AI可见度检测工具](/ai-checker)了解你的品牌在各大AI引擎中的当前状态。"
        ),
        "category": "GEO优化",
        "tags": ["GEO", "生成式引擎优化", "AI搜索", "ChatGPT", "Perplexity"],
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
        "description": "llms.txt是2024年出现的新兴网络标准，专为AI语言模型设计，相当于给AI爬虫的网站说明书。详解其规范格式、实际作用、生成方法，以及目前已有超万个网站采用的背后原因。",
        "content": (
            "## llms.txt是什么？\n\n"
            "llms.txt是一个放置于网站根目录（/llms.txt）的纯文本文件，专门为AI语言模型（LLM）和AI搜索爬虫提供网站内容结构说明。它的地位类似robots.txt，但服务对象从传统搜索引擎爬虫变成了AI系统。\n\n"
            "**核心目的：**\n"
            "- 告知AI爬虫哪些页面是核心内容\n"
            "- 说明网站的主要话题和覆盖范围\n"
            "- 标注哪些内容可以被AI引用、训练\n"
            "- 提供结构化的网站导航入口\n\n"
            "## llms.txt的标准格式\n\n"
            "```\n"
            "# 网站名称\n\n"
            "> 简短的网站描述（1-2句话）\n\n"
            "## 核心内容\n\n"
            "- [页面标题](URL): 页面描述\n\n"
            "## 文档/指南\n\n"
            "- [文档标题](URL): 描述\n"
            "```\n\n"
            "## 为什么需要llms.txt？\n\n"
            "AI引擎在理解网站时面临挑战：导航、广告、页脚等无关内容占据大量空间；JavaScript动态内容对AI爬虫不可见；内容分散，AI难以判断哪些是核心信息。\n\n"
            "llms.txt的价值：\n"
            "1. **提升AI引用准确性**：AI会优先理解并引用llms.txt中列出的核心内容\n"
            "2. **减少爬虫资源浪费**：引导AI只抓取有价值的页面\n"
            "3. **控制内容可见边界**：明确哪些内容开放给AI\n"
            "4. **增强GEO效果**：已有研究表明，配置llms.txt的网站在AI引用中更具优势\n\n"
            "## 主流AI对llms.txt的支持情况\n\n"
            "| AI系统 | 支持状态 |\n"
            "|--------|----------|\n"
            "| Anthropic Claude | 官方支持 |\n"
            "| Perplexity AI | 已爬取 |\n"
            "| ChatGPT | 部分支持 |\n"
            "| Google Gemini | 实验性支持 |\n"
            "| Kimi | 测试中 |\n\n"
            "## 如何快速生成llms.txt？\n\n"
            "**方法一：使用在线生成器**\n\n"
            "访问我们的[llms.txt生成器](/llms-txt)，输入网站URL，自动扫描网站内容生成标准格式文件，30秒完成。\n\n"
            "**方法二：手动编写**\n\n"
            "适合内容较少的小型网站，按照标准格式手动填写即可。\n\n"
            "**方法三：使用aeo.js库**\n\n"
            "对于Next.js/Nuxt/Astro等现代框架，使用开源库aeo.js自动生成，是目前GitHub上星标最高的解决方案之一（76+ Stars）。\n\n"
            "## 常见问题FAQ\n\n"
            "**Q：llms.txt是否影响Google传统排名？**\n"
            "A：不影响。llms.txt专为AI系统设计，对Google传统搜索爬虫无影响。\n\n"
            "**Q：没有llms.txt，AI还会引用我的网站吗？**\n"
            "A：会，但概率更低且准确性可能下降。llms.txt帮助AI更准确理解你的内容结构。\n\n"
            "**Q：llms.txt需要多久更新一次？**\n"
            "A：建议每次重大内容更新时同步更新，保持与网站实际内容一致。\n\n"
            "## 总结\n\n"
            "llms.txt是成本最低、效果最快的GEO优化动作之一。今天就用我们的[免费生成器](/llms-txt)为你的网站创建一个，整个过程不超过5分钟。"
        ),
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
        "content": (
            "## 什么是FAQ Schema？\n\n"
            "FAQ Schema是Google支持的结构化数据类型，通过在页面HTML中嵌入JSON-LD代码，告诉Google该页面包含问答内容。配置正确后，Google搜索结果会显示可展开的问答卡片（富结果）。\n\n"
            "**实际效果：**\n"
            "- 在搜索结果中占据额外展示空间\n"
            "- 点击率（CTR）平均提升20-30%\n"
            "- 内容被Google AI Overviews引用的概率提升3倍\n\n"
            "## FAQ Schema标准代码模板\n\n"
            "将以下代码添加到页面的`<head>`或`<body>`底部：\n\n"
            "```json\n"
            "{\n"
            '  "@context": "https://schema.org",\n'
            '  "@type": "FAQPage",\n'
            '  "mainEntity": [{\n'
            '    "@type": "Question",\n'
            '    "name": "问题文本？",\n'
            '    "acceptedAnswer": {\n'
            '      "@type": "Answer",\n'
            '      "text": "答案文本。"\n'
            "    }\n"
            "  }]\n"
            "}\n"
            "```\n\n"
            "## 分步操作指南\n\n"
            "### 第一步：确认页面有真实FAQ内容\n\n"
            "FAQ Schema不能凭空添加，页面HTML中必须有实际可见的问答内容。Google会核查代码与页面内容的一致性。\n\n"
            "### 第二步：编写高质量FAQ\n\n"
            "- **问题**：使用用户真实搜索的完整问题句式\n"
            "- **答案**：直接给出结论，字数控制在50-300字\n"
            "- **数量**：每页3-10个FAQ为宜\n\n"
            "### 第三步：添加JSON-LD代码\n\n"
            "将代码放在`</body>`标签前，或通过Google Tag Manager注入。\n\n"
            "### 第四步：用Google富媒体结果测试工具验证\n\n"
            "访问Google Rich Result Test，粘贴页面URL，确认检测到FAQPage类型且无错误。\n\n"
            "### 第五步：提交Sitemap加速收录\n\n"
            "通过Google Search Console提交更新的Sitemap，加快富结果出现。\n\n"
            "## 常见错误及修复\n\n"
            "| 错误 | 原因 | 修复方法 |\n"
            "|------|------|----------|\n"
            "| 页面内容与Schema不匹配 | FAQ答案与页面可见内容不一致 | 保持两者完全一致 |\n"
            "| 答案过短（少于50字） | Google认为答案质量不足 | 扩充答案内容 |\n"
            "| 单页面多个FAQPage | 一个页面只能有一个FAQPage | 合并为一个mainEntity数组 |\n\n"
            "## FAQ Schema的GEO加成效果\n\n"
            "除了Google富结果，FAQ Schema还能显著提升GEO效果。AI引擎在扫描FAQ结构时，会优先提取问答对作为回答素材。\n\n"
            "使用我们的[Schema生成器](/schema-generator)可以可视化生成FAQ Schema代码，无需手写JSON。"
        ),
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
        "description": "Ahrefs和SEMrush是全球最主流的两款全能SEO工具。从数据质量、功能覆盖、价格、适用场景四个维度进行2026年最新深度对比，帮你做出最适合自己的选择。",
        "content": (
            "## 核心结论（先说答案）\n\n"
            "- **选Ahrefs**：核心需求是反链分析、关键词研究、竞品内容分析\n"
            "- **选SEMrush**：需要SEO+内容营销+PPC+竞品广告的一站式解决方案\n"
            "- **两者都用**：如果预算充足，Ahrefs做深度分析，SEMrush做综合监控\n\n"
            "## 功能对比总览\n\n"
            "| 功能维度 | Ahrefs | SEMrush |\n"
            "|---------|--------|---------|\n"
            "| 反链数据库 | 行业第一 | 优秀 |\n"
            "| 关键词数据库 | 优秀 | 优秀 |\n"
            "| 技术SEO审计 | 良好 | 优秀 |\n"
            "| 内容营销工具 | 一般 | 优秀 |\n"
            "| PPC/广告分析 | 一般 | 优秀 |\n"
            "| AI可见度（GEO） | Brand Radar | AI Visibility |\n"
            "| 界面易用性 | 更简洁 | 功能多但复杂 |\n\n"
            "## 反链分析：Ahrefs胜出\n\n"
            "Ahrefs的反链数据库是业内公认最大、更新最快的。反链数据库超过3万亿链接，每15-30分钟更新一次。\n\n"
            "## 2026年GEO新功能对比\n\n"
            "**Ahrefs Brand Radar：**\n"
            "监测品牌在多个AI搜索引擎中的提及率，与Ahrefs丰富的反链数据联动分析。\n\n"
            "**SEMrush AI Visibility：**\n"
            "追踪品牌关键词在Google AI Overviews、ChatGPT、Perplexity中的出现频次，与传统SEO排名数据无缝整合。\n\n"
            "## 价格对比（2026年最新）\n\n"
            "| 套餐 | Ahrefs | SEMrush |\n"
            "|------|--------|---------|\n"
            "| 入门版 | $129/月 | $139.95/月 |\n"
            "| 标准版 | $249/月 | $249.95/月 |\n"
            "| 高级版 | $449/月 | $449.95/月 |\n\n"
            "## 适用场景建议\n\n"
            "**Ahrefs更适合：**\n"
            "- 个人站长和独立博客主（界面更简洁）\n"
            "- 以内容SEO为主的团队\n"
            "- 重点做外链建设的SEO从业者\n\n"
            "**SEMrush更适合：**\n"
            "- 数字营销机构（需要综合报告）\n"
            "- 电商网站（PPC+SEO双需求）\n"
            "- 需要完整内容营销工具链的团队\n\n"
            "## 免费替代方案\n\n"
            "预算有限时：Google Search Console（免费）、Ahrefs Webmaster Tools（免费）、Ubersuggest（有限免费）。\n\n"
            "查看我们整理的[SEO工具导航](/seo-nav)，含122+款工具的完整分类。"
        ),
        "category": "工具评测",
        "tags": ["Ahrefs", "SEMrush", "SEO工具对比", "关键词研究", "反链分析"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-20",
        "read_time": 11,
        "difficulty": "intermediate",
        "featured": False,
        "meta_title": "Ahrefs vs SEMrush 2026深度对比：功能、价格、适用场景全解析 | SGAIndex",
        "meta_description": "2026年Ahrefs与SEMrush功能对比：反链分析、关键词研究、技术SEO审计、AI可见度（GEO）、价格4大维度全面PK，帮你选出最适合的SEO工具。",
    },
    {
        "title": "AEO答案引擎优化：如何出现在AI回答的第一位",
        "slug": "aeo-answer-engine-optimization-guide",
        "description": "AEO（答案引擎优化）是专门针对语音搜索、Google精选摘要和AI问答系统的优化策略。拆解AEO的核心逻辑、与GEO的关系，以及让你的内容出现在AI回答首位的7个方法。",
        "content": (
            "## AEO是什么？\n\n"
            "AEO（Answer Engine Optimization，答案引擎优化）是指专门优化内容以出现在答案引擎中——包括Google精选摘要（Featured Snippets）、People Also Ask、语音搜索回答以及各类AI问答系统（ChatGPT、Perplexity、Siri等）的一套策略。\n\n"
            "**答案引擎与搜索引擎的区别：**\n"
            "传统搜索引擎返回一列链接，用户自行选择；答案引擎直接给出问题的答案，通常只引用1-3个来源。抢占答案位意味着拿到零点击搜索中唯一的曝光机会。\n\n"
            "## AEO、SEO、GEO的三角关系\n\n"
            "- **SEO**：传统蓝链排名基础，三者的共同底层\n"
            "- **AEO**：专注于精选摘要、语音搜索、AI问答系统\n"
            "- **GEO**：专注于ChatGPT/Perplexity等生成式AI引用\n\n"
            "三者高度重叠，良好的AEO内容通常也有助于GEO，反之亦然。\n\n"
            "## 7个AEO实战方法\n\n"
            "### 方法一：直接问答格式（倒金字塔结构）\n\n"
            "每个回答问题的段落，用问题本身作为H2/H3标题，紧跟40-60字的直接答案，然后再展开详述。这种答案先行的结构正是Google精选摘要算法偏爱的格式。\n\n"
            "### 方法二：攻克People Also Ask（PAA）问题\n\n"
            "1. 搜索你的目标关键词，记录全部PAA问题\n"
            "2. 在文章中建立对应的FAQ段落逐一回答\n"
            "3. 为这些FAQ添加FAQ Schema\n\n"
            "### 方法三：针对语音搜索优化\n\n"
            "- 答案本身能独立成句，脱离上下文仍然清晰\n"
            "- 字数控制在29字以内（语音助手的黄金长度）\n"
            "- 避免需要视觉上下文的表述\n\n"
            "### 方法四：使用How-to Schema\n\n"
            "对于操作类内容，How-to Schema能在搜索结果中展示步骤列表，极大提升点击率和AI引用率。\n\n"
            "### 方法五：建立话题集群（Topic Cluster）\n\n"
            "AI系统在判断一个网站是否是某话题权威时，会看该网站在该话题上的内容深度和广度。建立主题页+卫星内容的话题集群架构，能系统性地提升话题权威性（Topical Authority）。\n\n"
            "### 方法六：引用权威数据和来源\n\n"
            "AI引擎高度偏好包含具体数据、研究引用的内容。在文章中引用官方报告、具体数字和时效性数据。\n\n"
            "### 方法七：保持内容新鲜度\n\n"
            "定期更新旧内容是维持AEO位置的关键。AI系统会优先引用内容新鲜的来源。建议每季度审查核心内容的数据准确性。\n\n"
            "## AEO效果监测工具推荐\n\n"
            "- **Google Search Console**：追踪精选摘要出现情况\n"
            "- **SEMrush Position Tracking**：监控富结果展示\n"
            "- **Otterly.AI**：追踪AI搜索引用\n"
            "- **AppearOnAI**（免费）：快速检测4大AI引擎可见度\n\n"
            "查看我们的[AEO工具导航](/aeo-nav)了解完整工具列表。"
        ),
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
        "description": "Google AI Overviews（原SGE）已覆盖超50%的搜索查询。详解AI Overviews的内容选取机制、哪类内容最容易被引用，以及针对性的优化策略。",
        "content": (
            "## AI Overviews的现状（2026年数据）\n\n"
            "Google AI Overviews自2024年5月正式上线后，扩张速度超出所有人预期：\n\n"
            "- **覆盖率**：2026年上半年已出现在超过50%的搜索查询页面\n"
            "- **覆盖领域**：从最初的信息类扩展到购物、健康、金融、旅行\n"
            "- **引用来源**：平均每条AI Overview引用3-7个网站\n"
            "- **流量影响**：被引用网站CTR高于普通蓝链；未被引用的高排名链接CTR下降15-35%\n\n"
            "**重要结论：一个被AI Overview引用但排在第5名的页面，往往比排名第1但未被引用的页面获得更多流量。**\n\n"
            "## AI Overviews的内容选取逻辑\n\n"
            "### 1. 权威性优先\n\n"
            "高域名权威（DA）的网站占据明显优势。学术机构、政府网站、行业权威媒体的内容被引用率比个人博客高3-5倍。\n\n"
            "### 2. 直接性和完整性\n\n"
            "AI Overviews偏爱在一段话内回答完整问题的内容。为核心关键词页面编写定义性段落——用100-150字直接给出完整答案。\n\n"
            "### 3. 最新鲜的数据\n\n"
            "AI Overviews会优先选择包含近期数据的来源。标注发布/更新日期；定期更新核心数据。\n\n"
            "### 4. 结构化程度\n\n"
            "列表、表格、步骤等结构化格式显著提升被提取的概率。\n\n"
            "### 5. 已有排名基础\n\n"
            "AI Overviews通常从搜索结果前20名中选取引用来源。没有基础SEO排名的页面很难被引用。\n\n"
            "## 按内容类型的优化策略\n\n"
            "### 信息类内容（What/Why/How）\n\n"
            "- 在H2标题直接使用目标问题\n"
            "- 前两句给出直接定义/结论\n"
            "- 提供对比表格和数据支撑\n\n"
            "### 操作指南类内容（How-to）\n\n"
            "- 使用编号步骤\n"
            "- 为每个步骤提供具体的操作说明\n"
            "- 添加How-to Schema加强信号\n\n"
            "## 一个实测案例\n\n"
            "我们对一篇关于关键词研究工具的文章进行了AI Overviews优化：\n\n"
            "**优化内容（2周工作量）：**\n"
            "1. 在文章开头添加100字定义性段落\n"
            "2. 将原有的叙述性对比改为表格\n"
            "3. 添加FAQ Schema（6个问题）\n"
            "4. 更新文章中的2024年数据为2026年数据\n\n"
            "**优化后（6周）：**\n"
            "- 开始出现在相关AI Overview\n"
            "- 月均流量从1,200提升至2,800（+133%）\n\n"
            "## 关键行动清单\n\n"
            "- 用Google Search Console筛选哪些关键词已有AI Overview出现\n"
            "- 检查对应页面是否有直接定义段落\n"
            "- 为关键页面添加FAQ Schema\n"
            "- 更新所有过期数据（超过18个月的统计数字）"
        ),
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
        "title": "2026年技术SEO完全检查清单：10大类必查项目",
        "slug": "technical-seo-checklist-2026",
        "description": "一份系统全面的2026年技术SEO检查清单，涵盖Core Web Vitals、爬虫可访问性、结构化数据、移动端优化、HTTPS安全、AI搜索兼容性10大类，适合所有级别的SEO从业者每季度系统检查。",
        "content": (
            "## 为什么技术SEO在2026年更重要？\n\n"
            "Google在2024-2026年的核心算法更新持续强化了技术因素的权重：\n"
            "- **Core Web Vitals**成为正式排名因子，LCP、CLS、INP直接影响排名\n"
            "- **AI Overviews**优先引用技术健康的网站\n"
            "- **移动优先索引**已全面实施\n\n"
            "## 一、Core Web Vitals（核心网页指标）\n\n"
            "- **LCP（最大内容绘制）< 2.5秒**：检查最大内容元素的加载时间\n"
            "- **INP（与下次绘制的交互）< 200ms**：测量页面响应用户交互的速度（2024年3月替代FID）\n"
            "- **CLS（累积布局偏移）< 0.1**：防止页面内容在加载时突然位移\n"
            "- 使用PageSpeed Insights验证真实用户数据\n"
            "- 在Google Search Console的Core Web Vitals报告中追踪趋势\n\n"
            "**推荐工具：** PageSpeed Insights（免费）、GTmetrix、DebugBear\n\n"
            "## 二、爬虫可访问性\n\n"
            "- robots.txt正确配置，不误封锁重要页面\n"
            "- XML Sitemap已提交，包含所有重要页面\n"
            "- 内部链接深度 < 4层\n"
            "- 没有孤立页面（Orphan Pages）\n"
            "- JavaScript渲染内容对爬虫可见\n\n"
            "**推荐工具：** Screaming Frog、Google Search Console、SSR Checker（免费）\n\n"
            "## 三、HTTPS与安全\n\n"
            "- 全站HTTPS，无混合内容警告\n"
            "- SSL证书有效期未过期，使用TLS 1.2+\n"
            "- HTTP自动跳转HTTPS\n"
            "- HSTS头已配置\n\n"
            "**推荐工具：** SSL Shopper（免费）\n\n"
            "## 四、移动端优化\n\n"
            "- 响应式设计：在手机、平板、桌面均正常显示\n"
            "- 移动端点击目标 > 48px\n"
            "- 字体大小 > 16px\n"
            "- 避免侵入性弹窗（Google对移动端全屏弹窗降权）\n\n"
            "## 五、结构化数据（Schema）\n\n"
            "- Organization Schema：品牌基础信息\n"
            "- WebSite Schema：开启Sitelinks搜索框\n"
            "- BreadcrumbList Schema：面包屑导航\n"
            "- Article/BlogPosting Schema：文章类内容\n"
            "- FAQPage Schema：问答内容\n"
            "- 通过Google Rich Result Test验证所有Schema\n\n"
            "**推荐工具：** 我们的[Schema生成器](/schema-generator)、Google Rich Result Test\n\n"
            "## 六、页面基础要素\n\n"
            "- 每页唯一Title Tag（50-60字符）\n"
            "- 每页唯一Meta Description（120-160字符）\n"
            "- H1标签唯一，每页只有一个H1\n"
            "- 图片Alt文本：所有有意义的图片有描述性Alt文本\n"
            "- 页面没有断链（404）\n\n"
            "## 七、AI搜索兼容性（2026年新增）\n\n"
            "- llms.txt文件已部署：告知AI爬虫网站结构\n"
            "- 核心内容无需JavaScript即可访问\n"
            "- 内容有明确的作者和发布日期\n"
            "- 核心页面有直接定义段落\n"
            "- 已检测AI可见度基线：用透镜GEO或AppearOnAI做基准测试\n\n"
            "## 快速工具清单\n\n"
            "| 工具 | 用途 | 价格 |\n"
            "|------|------|------|\n"
            "| Google Search Console | 索引状态、技术问题 | 免费 |\n"
            "| PageSpeed Insights | Core Web Vitals | 免费 |\n"
            "| Screaming Frog | 全站爬取审计 | 免费（500URL） |\n"
            "| GTmetrix | 页面速度详细分析 | 免费版可用 |\n"
            "| SSL Shopper | SSL证书检测 | 免费 |\n\n"
            "查看我们的[技术SEO工具完整导航](/seo-nav)了解更多推荐工具。"
        ),
        "category": "技术SEO",
        "tags": ["技术SEO", "Core Web Vitals", "Schema", "爬虫", "检查清单"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-05",
        "read_time": 15,
        "difficulty": "intermediate",
        "featured": False,
        "meta_title": "2026年技术SEO完全检查清单：10大类必查项目 | SGAIndex",
        "meta_description": "系统全面的2026年技术SEO检查清单，涵盖Core Web Vitals、结构化数据、移动端优化、AI搜索兼容性等10大类，附推荐工具列表。每季度必查。",
    },
    {
        "title": "如何用免费工具完成关键词研究：从零开始的实战指南",
        "slug": "free-keyword-research-guide",
        "description": "不花一分钱，用Google官方免费工具+开源工具完成专业级关键词研究。手把手教你用Google Keyword Planner、AnswerThePublic、Google Trends完成完整的关键词研究流程。",
        "content": (
            "## 免费关键词研究的可行性\n\n"
            "很多人认为关键词研究必须依赖Ahrefs或SEMrush等付费工具。这是一个误解。Google官方免费工具+几款优秀的免费平台，完全足以支撑中小网站的关键词研究需求。\n\n"
            "**免费工具能做到：**\n"
            "- 发现目标关键词和长尾变体\n"
            "- 了解搜索量和竞争趋势\n"
            "- 挖掘用户真实提问的问题\n"
            "- 验证关键词的搜索意图\n\n"
            "## 工具一：Google Keyword Planner（关键词规划师）\n\n"
            "**来源：** Google Ads免费提供（需要Google账号，无需投放广告）\n\n"
            "**操作步骤：**\n"
            "1. 访问Google Ads → 工具 → 关键词规划师\n"
            "2. 选择发现新关键词\n"
            "3. 输入种子关键词（如SEO工具）\n"
            "4. 筛选地区和语言\n"
            "5. 导出结果到Excel进行分析\n\n"
            "**挖掘技巧：** 用竞品网站URL作为输入，获取他们在排名的关键词；关注竞争度低+月搜索量适中的关键词。\n\n"
            "## 工具二：AnswerThePublic（问题可视化挖掘）\n\n"
            "**来源：** 免费版每天3次查询\n\n"
            "**核心用途：** 将种子关键词扩展为用户真实提问的完整问题列表（Who/What/When/Where/Why/How），是长尾词挖掘的利器。\n\n"
            "**操作步骤：**\n"
            "1. 输入核心话题词\n"
            "2. 选择语言\n"
            "3. 查看可视化问题轮盘\n"
            "4. 导出所有问题为CSV\n\n"
            "## 工具三：Google Trends（趋势验证）\n\n"
            "**核心用途：**\n"
            "- 验证关键词是否是上升趋势（值得写）还是下降趋势（避免投入）\n"
            "- 发现季节性波动规律\n"
            "- 对比多个关键词的相对热度\n\n"
            "## 工具四：Google搜索自带功能（常被忽视）\n\n"
            "- **搜索框自动补全**：输入关键词前缀，查看Google建议\n"
            "- **搜索结果底部相关搜索**：每个搜索页面下方的8个相关词\n"
            "- **People Also Ask（PAA）**：目标用户的真实疑问\n\n"
            "## 完整关键词研究工作流程\n\n"
            "**第一步：种子词头脑风暴（30分钟）**\n"
            "列出你的网站/业务的核心话题词（5-10个）。\n\n"
            "**第二步：用Keyword Planner扩展（1小时）**\n"
            "将种子词逐一输入，合并所有建议词，去重后导出。\n\n"
            "**第三步：用AnswerThePublic挖掘问题词（30分钟）**\n"
            "针对每个核心话题，收集用户真实提问。\n\n"
            "**第四步：用Google Trends验证趋势（30分钟）**\n"
            "过滤掉下降趋势的词，保留稳定或上升的词。\n\n"
            "**第五步：分类和优先级排序**\n"
            "优先处理：搜索量适中（月搜索100-1000）+ 竞争度低 + 商业价值高的长尾词。\n\n"
            "查看[SGAIndex关键词研究工具导航](/seo-nav)了解所有免费关键词工具的详细介绍。"
        ),
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
        "title": "国内AI搜索GEO优化：DeepSeek、豆包、Kimi品牌可见度实战",
        "slug": "china-ai-search-geo-guide",
        "description": "DeepSeek、豆包、Kimi、通义千问等国产AI搜索引擎的用户规模已超1亿。专注于国内AI搜索场景下的GEO优化策略，以及国内独有的DSO（DeepSearch优化）概念。",
        "content": (
            "## 国内AI搜索现状（2026年）\n\n"
            "中国AI搜索市场正在经历高速增长：\n\n"
            "- **DeepSeek**：发布R1以来月活用户突破1亿，AI搜索模式被大量用户采用\n"
            "- **豆包**（字节跳动）：日活用户超5000万，搜索功能成核心增长点\n"
            "- **Kimi**（月之暗面）：长文本能力强，被专业用户大量用于信息搜集\n"
            "- **通义千问**（阿里云）：企业用户占比高，B2B场景渗透率领先\n"
            "- **元宝**（腾讯）：微信生态加持，C端用户增长最快\n\n"
            "## DSO是什么？\n\n"
            "DSO（DeepSearch Optimization）是AIDSO爱搜提出的优化概念，专门针对DeepSeek的深度搜索功能。DeepSeek的深度搜索会主动进行多轮网页搜索，综合多个来源生成答案。\n\n"
            "**DSO与GEO的主要区别：**\n"
            "- 对结构化内容（Markdown格式）更友好\n"
            "- 更重视内容的专业性和垂直深度\n"
            "- 对平台权威性（知乎、百度百科等）权重更高\n\n"
            "## 国内AI搜索GEO优化的5个重点\n\n"
            "### 重点一：覆盖国内主流内容平台\n\n"
            "| 平台 | AI引用权重 | 特点 |\n"
            "|------|-----------|------|\n"
            "| 知乎 | 极高 | 专业问答，AI引用率第一 |\n"
            "| 百度百科 | 极高 | 权威定义类内容首选 |\n"
            "| 微信公众号 | 高 | 大号内容被豆包/Kimi频繁引用 |\n"
            "| 小红书 | 中高 | 豆包/元宝的重要引用来源 |\n\n"
            "### 重点二：优化中文内容的答案密度\n\n"
            "国内AI搜索也偏好答案前置的内容结构。避免先卖关子写法（先列背景，最后给结论），直接进入干货。\n\n"
            "### 重点三：利用国内特有的Schema信号\n\n"
            "百度搜索对Schema标记的支持正在加强，百度的AI摘要功能同样会优先引用有结构化数据的页面。\n\n"
            "建议为百度优化：Article Schema、FAQPage Schema、Organization Schema。\n\n"
            "### 重点四：建立llms.txt的中文版本\n\n"
            "在llms.txt中使用中英双语内容描述，对豆包、Kimi等国内AI的抓取有正面影响。\n\n"
            "### 重点五：监测国内AI的品牌可见度\n\n"
            "**推荐工具（国内）：**\n"
            "- **透镜GEO**（免费）：覆盖豆包、DeepSeek、元宝、Kimi、通义千问，永久免费\n"
            "- **SheepGeo**（免费版可用）：SHEEP五维评分体系，检测9大AI模型\n"
            "- **AIDSO爱搜**（含免费版）：DSO+GEO双引擎，国内GEO工具标杆\n\n"
            "查看我们的[GEO工具导航](/geo-nav)了解完整的国内GEO工具列表。\n\n"
            "## 实战行动清单\n\n"
            "- 用透镜GEO（免费）检测当前品牌在国内AI中的可见度基线\n"
            "- 在知乎建立专业内容矩阵（目标：5篇以上高质量回答）\n"
            "- 为官网核心页面部署FAQ Schema\n"
            "- 创建中英双语llms.txt\n"
            "- 每月监测品牌提及率变化"
        ),
        "category": "GEO优化",
        "tags": ["DeepSeek", "豆包", "Kimi", "国内AI搜索", "GEO", "DSO"],
        "author": "SGAIndex编辑团队",
        "date": "2026-03-25",
        "read_time": 11,
        "difficulty": "intermediate",
        "featured": True,
        "meta_title": "国内AI搜索GEO优化：DeepSeek、豆包、Kimi品牌可见度实战指南 | SGAIndex",
        "meta_description": "国内AI搜索GEO优化全攻略：DeepSeek DSO、豆包、Kimi可见度提升5大策略，含知乎内容矩阵、中文FAQ Schema、国内免费监测工具推荐。",
    },
    {
        "title": "反链建设2026年指南：7种仍然有效的高质量外链策略",
        "slug": "backlink-building-guide-2026",
        "description": "反链依然是Google排名最重要的因子之一。2026年的外链建设已彻底告别数量为王时代，AI内容识别让低质量链接的风险大增。本文分享7种仍然有效的高质量外链建设方法。",
        "content": (
            "## 反链的现状：2026年外链价值如何？\n\n"
            "每年都有人宣称外链已死，但Google的官方声明和大量实测数据持续证明：高质量反链仍然是最强的排名信号之一。\n\n"
            "2024年Google泄露的内部文件（SpamBrain算法文档）再次确认：\n"
            "- 来自权威、相关网站的反链正面效果显著\n"
            "- 大规模低质量链接建设不仅无效，还会触发惩罚\n"
            "- 链接的语境相关性权重提升\n\n"
            "## 7种2026年仍然有效的外链建设方法\n\n"
            "### 方法一：内容驱动自然获链（最高ROI）\n\n"
            "创建值得被引用的内容，是获取高质量外链最可持续的方法：\n"
            "- **原创数据和研究**：发布行业调查报告，媒体和博主会引用数据来源\n"
            "- **免费工具和资源**：开发一个有实用价值的在线工具\n"
            "- **权威指南和清单**：详尽的年度清单文章是外链磁石\n\n"
            "### 方法二：HARO/媒体资源请求\n\n"
            "HARO（Help A Reporter Out）等平台连接记者与信息来源：\n"
            "1. 注册HARO或Qwoted等平台\n"
            "2. 监控与你行业相关的请求\n"
            "3. 提供高质量的专业洞察作为回应\n"
            "4. 获得权威媒体的引用（DA 60+的媒体外链）\n\n"
            "### 方法三：客座博客（精准策略）\n\n"
            "- 只选高相关性网站（必须与你的行业高度匹配）\n"
            "- 内容质量不降标：客座文章应比你自己博客的内容还要好\n"
            "- 避免批量客座博客计划（Google已将其列为垃圾链接）\n\n"
            "### 方法四：数字PR（品牌新闻发布）\n\n"
            "- 发布有新闻价值的行业数据或调查\n"
            "- 与科技媒体、行业媒体建立关系\n"
            "- 将外链获取纳入产品发布的传播计划\n\n"
            "### 方法五：失效链接重建\n\n"
            "利用Ahrefs的Lost & Found功能找到：\n"
            "1. 指向你竞品的优质外链\n"
            "2. 行业相关网站上的死链（404页面）\n"
            "3. 联系这些网站，提供你的内容作为替代\n\n"
            "### 方法六：AI辅助链接建设工具\n\n"
            "- **Respona**：集外链挖掘和邮件推广于一体，AI辅助撰写推广邮件\n"
            "- **BacklinkGPT**：AI驱动的链接建设平台\n\n"
            "### 方法七：内部链接优化\n\n"
            "虽然不是外链，但优化内链结构能最大化现有外链的效果：\n"
            "- 将外链权重从着陆页传递到需要提升排名的深层页面\n"
            "- 使用描述性锚文本\n\n"
            "## 绝对要避免的外链行为\n\n"
            "- 购买链接（尤其是链接网络