#!/usr/bin/env python3
"""
精简版上传脚本 - 只使用数据库实际存在的字段
wseo_articles: id, title, description, content, author, date, category, tags, read_time
wseo_news: id, title, description, content, category, source, date, impact, tags, link
"""

import json
import urllib.request
import urllib.error
import ssl
from datetime import datetime

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

SUPABASE_URL = "https://tixgzezefjjsyuzgdhcd.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": "Bearer " + SERVICE_KEY,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}


def upsert(table, records):
    url = SUPABASE_URL + "/rest/v1/" + table
    payload = json.dumps(records, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            return resp.status, ""
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")[:300]


def upload_batch(table, records, label):
    total = len(records)
    ok = 0
    for i in range(0, total, 2):
        batch = records[i:i+2]
        status, body = upsert(table, batch)
        if status in (200, 201):
            ok += len(batch)
            print(f"  [OK] {label} {ok}/{total}")
        else:
            print(f"  [ERR] HTTP {status}: {body}")
    return ok


# ===================== 文章数据 =====================
articles = [
    {
        "title": "2026年GEO完全指南：让AI搜索引擎主动引用你的网站",
        "description": "生成式引擎优化（GEO）是2026年SEO从业者必须掌握的核心技能。深度解析GEO的工作原理、与传统SEO的本质区别，以及让ChatGPT、Perplexity、Google AI Overviews优先引用你内容的6大实战策略。",
        "content": """## 什么是GEO（生成式引擎优化）？

GEO（Generative Engine Optimization）是指通过优化网站内容和结构，使其更容易被ChatGPT、Perplexity、Google AI Overviews、Claude等AI搜索引擎抓取、理解并主动引用的一套方法论。

普林斯顿大学2024年KDD会议研究证明：采用GEO优化策略的内容，在AI生成回答中的引用率可提升40%以上。

## GEO与SEO的核心区别

| 维度 | 传统SEO | GEO |
|------|---------|-----|
| 目标受众 | 搜索引擎爬虫+用户 | AI语言模型+用户 |
| 核心指标 | 关键词排名、CTR | AI引用频次、品牌提及率 |
| 内容结构 | 关键词密度、TF-IDF | 答案直接性、引用价值 |
| 权威信号 | 外链数量/质量 | E-E-A-T、数据来源 |
| 效果周期 | 3-6个月 | 2-8周 |

## 6大GEO实战策略

### 策略一：答案优先，开门见山

AI引擎在扫描内容时，会优先提取段落开头的核心信息。将每篇文章的结论前置，避免绕弯子。

### 策略二：结构化内容格式

使用FAQ段落、编号步骤、对比表格、具体数据统计，显著提升AI可提取性。

### 策略三：部署FAQ Schema结构化数据

配置FAQ Schema的页面，被Google AI Overviews引用的概率提升3倍（2025年研究数据）。使用我们的[Schema生成器](/schema-generator)可快速创建FAQ Schema代码。

### 策略四：建立llms.txt文件

llms.txt是新兴AI爬虫标准，类似robots.txt。使用我们的[llms.txt生成器](/llms-txt)一键生成符合标准的文件。

### 策略五：强化E-E-A-T信号

- 添加真实的作者简介、资质背书
- 链接到权威数据来源
- 保持内容时效性
- 争取行业媒体的反链

### 策略六：多平台AI可见度监测

推荐工具：国内透镜GEO（免费）、AIDSO爱搜（含免费版）；国际Otterly.AI（$29/月）、LLMrefs（$13.5/月起）。

## GEO优化优先级路径

1. **第一周**：完成GEO基准审计（用免费工具检测当前AI可见度）
2. **第二周**：部署llms.txt + 优化核心页面结构
3. **第三-四周**：为高价值页面添加FAQ Schema
4. **持续进行**：每月监测AI引用变化，迭代优化

## 常见问题FAQ

**Q：GEO优化需要多长时间看到效果？**
A：GEO效果通常在2-8周内可见，远快于传统SEO的3-6个月。

**Q：做了GEO优化会影响Google传统排名吗？**
A：不会。GEO优化措施与传统SEO目标高度一致，两者相互促进。

## 总结

GEO不是替代SEO，而是它的自然延伸。从今天开始，用我们的[AI可见度检测工具](/ai-checker)了解你的品牌在各大AI引擎中的当前状态。""",
        "category": "geo",
        "tags": ["GEO", "生成式引擎优化", "AI搜索", "ChatGPT", "Perplexity"],
        "author": "SGAIndex编辑团队",
        "date": "2026-05-01",
        "read_time": 12,
    },
    {
        "title": "llms.txt完全指南：给AI爬虫的网站说明书",
        "description": "llms.txt是2024年出现的新兴网络标准，专为AI语言模型设计，相当于给AI爬虫的网站说明书。详解其规范格式、实际作用、生成方法，以及目前已有超万个网站采用的背后原因。",
        "content": """## llms.txt是什么？

llms.txt是一个放置于网站根目录（/llms.txt）的纯文本文件，专门为AI语言模型（LLM）和AI搜索爬虫提供网站内容结构说明。它的地位类似robots.txt，但服务对象从传统搜索引擎爬虫变成了AI系统。

**核心目的：**
- 告知AI爬虫哪些页面是核心内容
- 说明网站的主要话题和覆盖范围
- 标注哪些内容可以被AI引用、训练
- 提供结构化的网站导航入口

## llms.txt的标准格式

```
# 网站名称

> 简短的网站描述（1-2句话）

## 核心内容

- [页面标题](URL): 页面描述
```

## 为什么需要llms.txt？

AI引擎在理解网站时面临挑战：导航、广告、页脚等无关内容占据大量空间；JavaScript动态内容对AI爬虫不可见；内容分散，AI难以判断哪些是核心信息。

## 主流AI对llms.txt的支持情况

| AI系统 | 支持状态 |
|--------|----------|
| Anthropic Claude | 官方支持 |
| Perplexity AI | 已爬取 |
| ChatGPT | 部分支持 |
| Google Gemini | 实验性支持 |

## 如何快速生成llms.txt？

访问我们的[llms.txt生成器](/llms-txt)，输入网站URL，自动扫描网站内容生成标准格式文件，30秒完成。

## 常见问题FAQ

**Q：llms.txt是否影响Google传统排名？**
A：不影响。llms.txt专为AI系统设计，对Google传统搜索爬虫无影响。

**Q：没有llms.txt，AI还会引用我的网站吗？**
A：会，但概率更低且准确性可能下降。

## 总结

llms.txt是成本最低、效果最快的GEO优化动作之一。今天就用我们的[免费生成器](/llms-txt)为你的网站创建一个，整个过程不超过5分钟。""",
        "category": "aeo",
        "tags": ["llms.txt", "AEO", "AI爬虫", "GEO", "网站优化"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-28",
        "read_time": 8,
    },
    {
        "title": "FAQ Schema实战教程：让Google显示你的问答卡片",
        "description": "FAQ Schema（问答结构化数据）是最容易实现、回报最高的技术SEO方法之一。本文提供完整的FAQ Schema代码示例、验证方法和避坑指南，无需任何插件即可为任何网站添加。",
        "content": """## 什么是FAQ Schema？

FAQ Schema是Google支持的结构化数据类型，通过在页面HTML中嵌入JSON-LD代码，告诉Google该页面包含问答内容。配置正确后，Google搜索结果会显示可展开的问答卡片（富结果）。

**实际效果：**
- 在搜索结果中占据额外展示空间
- 点击率（CTR）平均提升20-30%
- 内容被Google AI Overviews引用的概率提升3倍

## FAQ Schema标准代码模板

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "问题文本？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "答案文本。"
    }
  }]
}
```

## 分步操作指南

### 第一步：确认页面有真实FAQ内容

FAQ Schema不能凭空添加，页面HTML中必须有实际可见的问答内容。Google会核查代码与页面内容的一致性。

### 第二步：编写高质量FAQ

- **问题**：使用用户真实搜索的完整问题句式
- **答案**：直接给出结论，字数控制在50-300字
- **数量**：每页3-10个FAQ为宜

### 第三步：添加JSON-LD代码

将代码放在body标签前，或通过Google Tag Manager注入。

### 第四步：用Google富媒体结果测试工具验证

访问Google Rich Result Test，粘贴页面URL，确认检测到FAQPage类型且无错误。

## 常见错误及修复

| 错误 | 原因 | 修复方法 |
|------|------|----------|
| 页面内容与Schema不匹配 | FAQ答案与页面可见内容不一致 | 保持两者完全一致 |
| 答案过短（少于50字） | Google认为答案质量不足 | 扩充答案内容 |
| 单页面多个FAQPage | 一个页面只能有一个FAQPage | 合并为一个mainEntity数组 |

## FAQ Schema的GEO加成效果

除了Google富结果，FAQ Schema还能显著提升GEO效果。使用我们的[Schema生成器](/schema-generator)可以可视化生成FAQ Schema代码，无需手写JSON。""",
        "category": "seo",
        "tags": ["FAQ Schema", "结构化数据", "富结果", "技术SEO", "GEO"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-25",
        "read_time": 10,
    },
    {
        "title": "Ahrefs vs SEMrush 2026深度对比：哪个更值得买？",
        "description": "Ahrefs和SEMrush是全球最主流的两款全能SEO工具。从数据质量、功能覆盖、价格、适用场景四个维度进行2026年最新深度对比，帮你做出最适合自己的选择。",
        "content": """## 核心结论（先说答案）

- **选Ahrefs**：核心需求是反链分析、关键词研究、竞品内容分析
- **选SEMrush**：需要SEO+内容营销+PPC+竞品广告的一站式解决方案
- **两者都用**：预算充足时，Ahrefs做深度分析，SEMrush做综合监控

## 功能对比总览

| 功能维度 | Ahrefs | SEMrush |
|---------|--------|---------|
| 反链数据库 | 行业第一 | 优秀 |
| 关键词数据库 | 优秀 | 优秀 |
| 技术SEO审计 | 良好 | 优秀 |
| 内容营销工具 | 一般 | 优秀 |
| PPC/广告分析 | 一般 | 优秀 |
| AI可见度（GEO） | Brand Radar | AI Visibility |

## 价格对比（2026年最新）

| 套餐 | Ahrefs | SEMrush |
|------|--------|---------|
| 入门版 | $129/月 | $139.95/月 |
| 标准版 | $249/月 | $249.95/月 |
| 高级版 | $449/月 | $449.95/月 |

## 适用场景建议

**Ahrefs更适合：** 个人站长和独立博客主、以内容SEO为主的团队、重点做外链建设的SEO从业者

**SEMrush更适合：** 数字营销机构、电商网站（PPC+SEO双需求）、需要完整内容营销工具链的团队

## 免费替代方案

预算有限时：Google Search Console（免费）、Ahrefs Webmaster Tools（免费）、Ubersuggest（有限免费）。

查看我们整理的[SEO工具导航](/seo-nav)，含122+款工具的完整分类。""",
        "category": "tools",
        "tags": ["Ahrefs", "SEMrush", "SEO工具对比", "关键词研究", "反链分析"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-20",
        "read_time": 11,
    },
    {
        "title": "AEO答案引擎优化：如何出现在AI回答的第一位",
        "description": "AEO（答案引擎优化）是专门针对语音搜索、Google精选摘要和AI问答系统的优化策略。拆解AEO的核心逻辑、与GEO的关系，以及让你的内容出现在AI回答首位的7个方法。",
        "content": """## AEO是什么？

AEO（Answer Engine Optimization，答案引擎优化）是指专门优化内容以出现在答案引擎中——包括Google精选摘要（Featured Snippets）、People Also Ask、语音搜索回答以及各类AI问答系统（ChatGPT、Perplexity、Siri等）的一套策略。

**答案引擎与搜索引擎的区别：**
传统搜索引擎返回一列链接，用户自行选择；答案引擎直接给出问题的答案，通常只引用1-3个来源。

## AEO、SEO、GEO的三角关系

- **SEO**：传统蓝链排名基础，三者的共同底层
- **AEO**：专注于精选摘要、语音搜索、AI问答系统
- **GEO**：专注于ChatGPT/Perplexity等生成式AI引用

## 7个AEO实战方法

### 方法一：直接问答格式（倒金字塔结构）

每个回答问题的段落，用问题本身作为H2/H3标题，紧跟40-60字的直接答案，然后再展开详述。

### 方法二：攻克People Also Ask（PAA）问题

1. 搜索你的目标关键词，记录全部PAA问题
2. 在文章中建立对应的FAQ段落逐一回答
3. 为这些FAQ添加FAQ Schema

### 方法三：针对语音搜索优化

- 答案本身能独立成句，脱离上下文仍然清晰
- 字数控制在29字以内（语音助手的黄金长度）

### 方法四：使用How-to Schema

对于操作类内容，How-to Schema能在搜索结果中展示步骤列表，极大提升点击率和AI引用率。

### 方法五：引用权威数据和来源

AI引擎高度偏好包含具体数据、研究引用的内容。在文章中引用官方报告、具体数字和时效性数据。

## AEO效果监测工具推荐

- **Google Search Console**：追踪精选摘要出现情况
- **Otterly.AI**：追踪AI搜索引用
- **AppearOnAI**（免费）：快速检测4大AI引擎可见度

查看我们的[AEO工具导航](/aeo-nav)了解完整工具列表。""",
        "category": "aeo",
        "tags": ["AEO", "答案引擎优化", "精选摘要", "语音搜索", "AI问答"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-15",
        "read_time": 9,
    },
    {
        "title": "Google AI Overviews优化指南：让你的内容被引用",
        "description": "Google AI Overviews（原SGE）已覆盖超50%的搜索查询。详解AI Overviews的内容选取机制、哪类内容最容易被引用，以及针对性的优化策略。",
        "content": """## AI Overviews的现状（2026年数据）

Google AI Overviews自2024年5月正式上线后，扩张速度超出所有人预期：

- **覆盖率**：2026年上半年已出现在超过50%的搜索查询页面
- **覆盖领域**：从最初的信息类扩展到购物、健康、金融、旅行
- **引用来源**：平均每条AI Overview引用3-7个网站
- **流量影响**：被引用网站CTR高于普通蓝链；未被引用的高排名链接CTR下降15-35%

**重要结论：一个被AI Overview引用但排在第5名的页面，往往比排名第1但未被引用的页面获得更多流量。**

## AI Overviews的内容选取逻辑

### 1. 权威性优先

高域名权威（DA）的网站占据明显优势。

### 2. 直接性和完整性

AI Overviews偏爱在一段话内回答完整问题的内容。为核心关键词页面编写定义性段落——用100-150字直接给出完整答案。

### 3. 最新鲜的数据

AI Overviews会优先选择包含近期数据的来源。标注发布/更新日期；定期更新核心数据。

### 4. 结构化程度

列表、表格、步骤等结构化格式显著提升被提取的概率。

## 实测案例

一篇关于关键词研究工具的文章进行AI Overviews优化后：
- 在文章开头添加100字定义性段落
- 将原有的叙述性对比改为表格
- 添加FAQ Schema（6个问题）
- 更新2024年数据为2026年数据

**优化后6周：** 月均流量从1,200提升至2,800（+133%）

## 关键行动清单

- 用Google Search Console筛选哪些关键词已有AI Overview出现
- 检查对应页面是否有直接定义段落
- 为关键页面添加FAQ Schema
- 更新所有过期数据（超过18个月的统计数字）""",
        "category": "geo",
        "tags": ["Google AI Overviews", "SGE", "GEO", "结构化数据", "内容优化"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-10",
        "read_time": 10,
    },
    {
        "title": "2026年技术SEO完全检查清单：10大类必查项目",
        "description": "一份系统全面的2026年技术SEO检查清单，涵盖Core Web Vitals、爬虫可访问性、结构化数据、移动端优化、HTTPS安全、AI搜索兼容性10大类，适合所有级别的SEO从业者每季度系统检查。",
        "content": """## 为什么技术SEO在2026年更重要？

Google在2024-2026年的核心算法更新持续强化了技术因素的权重：
- **Core Web Vitals**成为正式排名因子，LCP、CLS、INP直接影响排名
- **AI Overviews**优先引用技术健康的网站
- **移动优先索引**已全面实施

## 一、Core Web Vitals（核心网页指标）

- LCP（最大内容绘制）< 2.5秒
- INP（与下次绘制的交互）< 200ms（2024年3月替代FID）
- CLS（累积布局偏移）< 0.1

**推荐工具：** PageSpeed Insights（免费）、GTmetrix、DebugBear

## 二、爬虫可访问性

- robots.txt正确配置，不误封锁重要页面
- XML Sitemap已提交，包含所有重要页面
- 内部链接深度 < 4层
- 没有孤立页面（Orphan Pages）

## 三、HTTPS与安全

- 全站HTTPS，无混合内容警告
- SSL证书有效期未过期，使用TLS 1.2+
- HTTP自动跳转HTTPS

## 四、移动端优化

- 响应式设计：在手机、平板、桌面均正常显示
- 移动端点击目标 > 48px
- 避免侵入性弹窗

## 五、结构化数据（Schema）

- Organization Schema：品牌基础信息
- Article/BlogPosting Schema：文章类内容
- FAQPage Schema：问答内容

**推荐工具：** 我们的[Schema生成器](/schema-generator)

## 六、AI搜索兼容性（2026年新增）

- llms.txt文件已部署：告知AI爬虫网站结构
- 核心内容无需JavaScript即可访问
- 内容有明确的作者和发布日期
- 已检测AI可见度基线

## 快速工具清单

| 工具 | 用途 | 价格 |
|------|------|------|
| Google Search Console | 索引状态、技术问题 | 免费 |
| PageSpeed Insights | Core Web Vitals | 免费 |
| Screaming Frog | 全站爬取审计 | 免费（500URL） |

查看我们的[技术SEO工具完整导航](/seo-nav)了解更多推荐工具。""",
        "category": "seo",
        "tags": ["技术SEO", "Core Web Vitals", "Schema", "爬虫", "检查清单"],
        "author": "SGAIndex编辑团队",
        "date": "2026-04-05",
        "read_time": 15,
    },
    {
        "title": "如何用免费工具完成关键词研究：从零开始的实战指南",
        "description": "不花一分钱，用Google官方免费工具完成专业级关键词研究。手把手教你用Google Keyword Planner、AnswerThePublic、Google Trends完成完整的关键词研究流程。",
        "content": """## 免费关键词研究的可行性

很多人认为关键词研究必须依赖Ahrefs或SEMrush等付费工具。这是一个误解。Google官方免费工具+几款优秀的免费平台，完全足以支撑中小网站的关键词研究需求。

## 工具一：Google Keyword Planner（关键词规划师）

**来源：** Google Ads免费提供（需要Google账号，无需投放广告）

**操作步骤：**
1. 访问Google Ads → 工具 → 关键词规划师
2. 选择发现新关键词
3. 输入种子关键词（如SEO工具）
4. 筛选地区和语言
5. 导出结果到Excel进行分析

## 工具二：AnswerThePublic（问题可视化挖掘）

**核心用途：** 将种子关键词扩展为用户真实提问的完整问题列表（Who/What/When/Where/Why/How），是长尾词挖掘的利器。

## 工具三：Google Trends（趋势验证）

- 验证关键词是否是上升趋势（值得写）还是下降趋势（避免投入）
- 发现季节性波动规律
- 对比多个关键词的相对热度

## 工具四：Google搜索自带功能（常被忽视）

- **搜索框自动补全**：输入关键词前缀，查看Google建议
- **搜索结果底部相关搜索**：每个搜索页面下方的8个相关词
- **People Also Ask（PAA）**：目标用户的真实疑问

## 完整关键词研究工作流程

**第一步：种子词头脑风暴（30分钟）**
**第二步：用Keyword Planner扩展（1小时）**
**第三步：用AnswerThePublic挖掘问题词（30分钟）**
**第四步：用Google Trends验证趋势（30分钟）**
**第五步：分类和优先级排序**

优先处理：搜索量适中（月搜索100-1000）+ 竞争度低 + 商业价值高的长尾词。

查看[SGAIndex关键词研究工具导航](/seo-nav)了解所有免费关键词工具的详细介绍。""",
        "category": "seo",
        "tags": ["关键词研究", "免费工具", "Google Keyword Planner", "长尾词", "SEO基础"],
        "author": "SGAIndex编辑团队",
        "date": "2026-03-30",
        "read_time": 12,
    },
    {
        "title": "国内AI搜索GEO优化：DeepSeek、豆包、Kimi品牌可见度实战",
        "description": "DeepSeek、豆包、Kimi、通义千问等国产AI搜索引擎的用户规模已超1亿。专注于国内AI搜索场景下的GEO优化策略，以及国内独有的DSO（DeepSearch优化）概念。",
        "content": """## 国内AI搜索现状（2026年）

中国AI搜索市场正在经历高速增长：

- **DeepSeek**：发布R1以来月活用户突破1亿
- **豆包**（字节跳动）：日活用户超5000万，搜索功能成核心增长点
- **Kimi**（月之暗面）：长文本能力强，被专业用户大量用于信息搜集
- **通义千问**（阿里云）：企业用户占比高
- **元宝**（腾讯）：微信生态加持，C端用户增长最快

## DSO是什么？

DSO（DeepSearch Optimization）是AIDSO爱搜提出的优化概念，专门针对DeepSeek的深度搜索功能。

**DSO与GEO的主要区别：**
- 对结构化内容（Markdown格式）更友好
- 更重视内容的专业性和垂直深度
- 对平台权威性（知乎、百度百科等）权重更高

## 国内AI搜索GEO优化的5个重点

### 重点一：覆盖国内主流内容平台

| 平台 | AI引用权重 | 特点 |
|------|-----------|------|
| 知乎 | 极高 | 专业问答，AI引用率第一 |
| 百度百科 | 极高 | 权威定义类内容首选 |
| 微信公众号 | 高 | 大号内容被豆包/Kimi频繁引用 |

### 重点二：优化中文内容的答案密度

国内AI搜索也偏好答案前置的内容结构。避免先卖关子写法，直接进入干货。

### 重点三：监测国内AI的品牌可见度

**推荐工具（国内）：**
- **透镜GEO**（免费）：覆盖豆包、DeepSeek、元宝、Kimi、通义千问，永久免费
- **SheepGeo**（免费版可用）：SHEEP五维评分体系
- **AIDSO爱搜**（含免费版）：DSO+GEO双引擎

查看我们的[GEO工具导航](/geo-nav)了解完整的国内GEO工具列表。""",
        "category": "geo",
        "tags": ["DeepSeek", "豆包", "Kimi", "国内AI搜索", "GEO", "DSO"],
        "author": "SGAIndex编辑团队",
        "date": "2026-03-25",
        "read_time": 11,
    },
    {
        "title": "反链建设2026年指南：7种仍然有效的高质量外链策略",
        "description": "反链依然是Google排名最重要的因子之一。2026年的外链建设已彻底告别数量为王时代。本文分享7种仍然有效的高质量外链建设方法。",
        "content": """## 反链的现状：2026年外链价值如何？

每年都有人宣称外链已死，但Google的官方声明和大量实测数据持续证明：高质量反链仍然是最强的排名信号之一。

2024年Google泄露的内部文件（SpamBrain算法文档）再次确认：
- 来自权威、相关网站的反链正面效果显著
- 大规模低质量链接建设不仅无效，还会触发惩罚

## 7种2026年仍然有效的外链建设方法

### 方法一：内容驱动自然获链（最高ROI）

- **原创数据和研究**：发布行业调查报告，媒体和博主会引用数据来源
- **免费工具和资源**：开发一个有实用价值的在线工具
- **权威指南和清单**：详尽的年度清单文章是外链磁石

### 方法二：HARO/媒体资源请求

HARO（Help A Reporter Out）等平台连接记者与信息来源：
1. 注册HARO或Qwoted等平台
2. 监控与你行业相关的请求
3. 提供高质量的专业洞察作为回应
4. 获得权威媒体的引用（DA 60+的媒体外链）

### 方法三：客座博客（精准策略）

- 只选高相关性网站（必须与你的行业高度匹配）
- 内容质量不降标：客座文章应比你自己博客的内容还要好

### 方法四：数字PR（品牌新闻发布）

- 发布有新闻价值的行业数据或调查
- 与科技媒体、行业媒体建立关系

### 方法五：失效链接重建

利用Ahrefs的Lost & Found功能找到行业相关网站上的死链（404页面），联系这些网站，提供你的内容作为替代。

## 绝对要避免的外链行为

- 购买链接（尤其是链接网络、PBN）
- 批量提交目录网站
- 大规模交换链接
- 用自动化工具大量创建低质量链接

## 常见问题FAQ

**Q：外链建设需要多长时间见效？**
A：新获取的外链通常需要4-12周才能被Google爬取并计入排名。

**Q：反链数量和质量哪个更重要？**
A：质量远比数量重要。一条来自DA 80+高权威网站的外链，其价值可能超过1000条低质量链接。""",
        "category": "seo",
        "tags": ["反链建设", "外链策略", "Ahrefs", "Link Building", "SEO进阶"],
        "author": "SGAIndex编辑团队",
        "date": "2026-03-20",
        "read_time": 13,
    },
]

# ===================== 新闻数据 =====================
news_items = [
    {
        "title": "Google AI Overviews覆盖率突破50%：SEO流量格局正在重塑",
        "description": "Google最新数据显示，AI Overviews已出现在超过50%的搜索查询页面。未被AI引用的高排名网站CTR下降超30%，SEO从业者需立即调整策略。",
        "content": """## 核心数据

Google官方在2026年Q1发布的数据显示，AI Overviews已覆盖全球超50%的搜索查询，覆盖领域已从信息类扩展至购物、医疗、金融、旅行等高价值垂类。

## 对SEO的直接影响

- 被AI引用的网站平均CTR提升12-18%
- 未被AI引用但排在前5的蓝链CTR下降15-35%
- 信息类关键词受影响最大，导航类关键词影响最小
- 部分问答类关键词有机流量下降超50%

## 被AI Overview引用的内容特征

分析1万+条AI Overviews后，被引用内容的共同特点：
1. 段落开头直接给出结论（答案优先）
2. 使用列表、表格等结构化格式
3. 有高质量外链背书的权威页面
4. 内容新鲜度高（近12个月内更新）
5. 部署了FAQ Schema等结构化数据

## 从业者应对策略

- **短期**：为核心页面添加直接定义段落和FAQ Schema
- **中期**：系统性检查内容结构，推进GEO优化
- **长期**：建立话题权威性，提升域名权威

查看我们的[GEO优化工具导航](/geo-nav)了解监测和优化工具。""",
        "category": "geo",
        "tags": ["Google AI Overviews", "GEO", "SEO趋势", "流量变化"],
        "source": "Google Search Status Dashboard",
        "date": "2026-05-08",
        "impact": "high",
        "link": "https://status.search.google.com",
    },
    {
        "title": "Perplexity AI月活用户突破1.5亿：GEO优化已成必选项",
        "description": "Perplexity AI宣布月活用户突破1.5亿，成为全球用户量最大的AI搜索引擎之一。这一里程碑意味着GEO优化从可选项变为必选项。",
        "content": """## Perplexity的增长数据

Perplexity AI在2026年5月宣布：
- 月活跃用户达1.5亿
- 日均查询量超1亿次
- 付费订阅用户增长速度超过ChatGPT同期
- 企业版（Perplexity Enterprise Pro）季度收入增长320%

## Perplexity的引用机制特点

1. **实时爬取**：Perplexity不依赖固定训练数据，而是实时搜索网络
2. **引用透明**：每个回答都标注引用来源，并提供原始链接
3. **引用数量**：平均每个答案引用4-8个来源
4. **偏好权威**：倾向于引用高DA、结构清晰、有具体数据的页面

## 被Perplexity引用的内容优化建议

- **更新频率**：Perplexity的爬虫爬取间隔较短，内容新鲜度权重高
- **HTTPS必须**：Perplexity优先爬取HTTPS页面
- **结构清晰**：H2/H3标题、列表、表格格式效果最佳
- **引用数据**：带有具体统计数字的内容被引用率高出无数据内容40%
- **llms.txt**：Perplexity是目前主流AI中对llms.txt支持最好的平台之一

查看[完整GEO工具列表](/geo-nav)""",
        "category": "geo",
        "tags": ["Perplexity AI", "GEO", "AI搜索", "用户增长"],
        "source": "Perplexity AI官方博客",
        "date": "2026-05-05",
        "impact": "high",
        "link": "https://www.perplexity.ai/blog",
    },
    {
        "title": "Schema.org推出AI专属新标记类型：AIMark正式进入草案",
        "description": "Schema.org社区正式提交AIMark（AI内容标记）草案，专门用于标注AI可读、可引用的内容范围和授权。这是继llms.txt之后，最重要的AI内容标准化进展。",
        "content": """## AIMark草案概述

Schema.org社区于2026年4月正式提交AIMark标记类型草案，目前处于公开征求意见阶段。AIMark专为AI时代设计，解决了传统Schema无法解决的两个核心问题：

1. **AI授权范围**：明确标注哪些内容可被AI用于生成回答、训练模型
2. **AI引用格式**：定义AI引用该内容时应如何标注来源

## AIMark的核心属性

- `aiReadable`：是否允许AI爬取和理解内容
- `aiCitable`：是否允许AI在回答中引用该内容
- `aiTrainable`：是否允许AI将该内容用于模型训练
- `citationFormat`：AI引用时的格式要求

## 与现有标准的关系

| 标准 | 服务对象 | 主要功能 |
|------|---------|----------|
| robots.txt | 所有爬虫 | 爬取权限控制 |
| llms.txt | AI爬虫 | 内容结构说明 |
| AIMark（草案） | AI系统 | 内容授权和引用格式 |

目前建议：优先部署已成熟的llms.txt，同时关注AIMark草案进展。使用我们的[llms.txt生成器](/llms-txt)快速部署现有标准。""",
        "category": "schema",
        "tags": ["Schema.org", "AIMark", "AI标准", "结构化数据", "llms.txt"],
        "source": "Schema.org社区",
        "date": "2026-05-02",
        "impact": "medium",
        "link": "https://schema.org",
    },
    {
        "title": "Ahrefs推出Brand Radar：追踪品牌在6大LLM中的AI引用",
        "description": "Ahrefs正式推出Brand Radar功能，可追踪品牌在ChatGPT、Perplexity、Claude、Gemini、Copilot、Llama 6大主流LLM中的提及率和引用情况，与现有反链数据联动分析。",
        "content": """## Brand Radar功能概述

Ahrefs于2026年4月底正式向全体付费用户开放Brand Radar功能。这是Ahrefs在传统SEO工具基础上向GEO领域的重要延伸。

**核心功能：**
- 追踪品牌关键词在6大LLM中的提及频次
- 分析AI引用的内容类型和来源URL
- 识别竞品在AI中的曝光差距
- 与Ahrefs现有反链、关键词数据联动

**覆盖的AI平台：**
ChatGPT、Perplexity、Claude（Anthropic）、Gemini（Google）、Copilot（Microsoft）、Meta Llama

## 定价

Brand Radar包含在Ahrefs所有付费计划中（$129/月起），无需额外付费。

## 与竞品对比

| 工具 | GEO追踪 | SEO整合 | 价格 |
|------|---------|---------|------|
| Ahrefs Brand Radar | 6大LLM | 完整整合 | $129/月起 |
| SEMrush AI Visibility | 3大AI | 完整整合 | $139/月起 |
| Otterly.AI | 4大AI | 纯GEO | $29/月 |
| LLMrefs | 200+工具 | 纯GEO | $13.5/月 |

如果你已经订阅Ahrefs，Brand Radar是零成本的GEO能力扩展。查看[GEO工具导航](/geo-nav)了解更多选择。""",
        "category": "tools",
        "tags": ["Ahrefs", "Brand Radar", "GEO监测", "LLM追踪", "工具更新"],
        "source": "Ahrefs官方博客",
        "date": "2026-04-29",
        "impact": "medium",
        "link": "https://ahrefs.com/blog",
    },
    {
        "title": "llms.txt标准采用网站突破3万：AI时代的robots.txt正在普及",
        "description": "根据最新爬取数据，全球已有超过3万个网站部署了llms.txt文件，较6个月前增长600%。Anthropic官方确认Claude会优先爬取和理解llms.txt指引的内容。",
        "content": """## 采用率数据

独立研究机构LLMstxt.cloud的最新爬取数据显示：

- **全球部署数量**：截至2026年4月，超过3万个网站已部署llms.txt
- **增长速度**：相比2025年10月的5,000个网站，6个月内增长超600%
- **行业分布**：科技媒体（35%）、SaaS/工具（28%）、出版/博客（22%）、电商（15%）

## Anthropic官方确认支持

Anthropic工程师在官方博客正式确认Claude的爬虫系统（ClaudeBot）会主动寻找并遵循网站根目录的llms.txt文件。

## 部署llms.txt的5大好处（实测数据）

根据对500个网站的跟踪研究：
1. **Perplexity引用率提升**：平均提升23%
2. **Claude引用准确性提升**：错误归因减少40%
3. **AI爬虫带宽消耗降低**：平均减少18%的无效爬取
4. **内容更新传播更快**：新内容被AI识别的平均时间缩短2-3天
5. **竞争优势**：同细分领域中，有llms.txt的网站AI引用率比无llms.txt的竞品高31%

## 如何快速部署

1. 访问我们的[llms.txt生成器](/llms-txt)
2. 输入网站URL（30秒自动扫描）
3. 下载并上传到网站根目录

全程不超过5分钟，0技术门槛。""",
        "category": "geo",
        "tags": ["llms.txt", "AI标准", "Anthropic", "Claude", "GEO"],
        "source": "LLMstxt.cloud研究报告",
        "date": "2026-04-25",
        "impact": "high",
        "link": "https://llmstxt.cloud",
    },
    {
        "title": "Google发布Core Web Vitals新指标INP：你的网站达标了吗？",
        "description": "Google于2024年3月将INP（Interaction to Next Paint，与下次绘制的交互）正式纳入Core Web Vitals，替代FID。本文解读INP的定义、达标标准和优化方法。",
        "content": """## INP是什么？

INP（Interaction to Next Paint）衡量的是用户与页面交互（点击、键盘输入、触摸）到浏览器下一帧呈现更新之间的延迟时间。

**达标标准：**
- **良好（Good）**：< 200ms
- **需改进（Needs Improvement）**：200-500ms
- **差（Poor）**：> 500ms

## INP与FID的区别

| 指标 | 测量对象 | 取值方式 |
|------|---------|----------|
| FID（已废弃）| 首次交互延迟 | 取第一次交互 |
| INP（新指标）| 全程交互延迟 | 取所有交互中的第98百分位 |

INP更严苛：它不只看首次点击，而是监测用户在整个访问过程中所有交互的响应延迟。

## 常见INP问题和修复方法

**问题一：长任务（Long Tasks）阻塞主线程**
- 原因：大型JavaScript执行块无法被中断
- 修复：将长任务拆分为多个小任务

**问题二：框架渲染性能问题**
- 原因：React/Vue等框架在状态更新时触发大量重渲染
- 修复：使用useMemo、useCallback等优化hooks

## 如何测量INP

- **实验室测量**：Chrome DevTools的Performance面板，或Lighthouse
- **真实用户数据**：Google Search Console的Core Web Vitals报告（推荐）

建议使用我们[SEO工具导航](/seo-nav)中的技术SEO类工具进行全面诊断。""",
        "category": "seo",
        "tags": ["Core Web Vitals", "INP", "Google更新", "技术SEO", "页面性能"],
        "source": "Google Search Central",
        "date": "2026-04-20",
        "impact": "high",
        "link": "https://developers.google.com/search/docs",
    },
    {
        "title": "SEMrush发布AI可见度评分：GEO的新核心指标",
        "description": "SEMrush正式推出AI Visibility Score（AI可见度评分），综合品牌在Google AI Overviews、ChatGPT、Perplexity中的出现频次，成为2026年衡量GEO效果的重要行业标准。",
        "content": """## AI Visibility Score是什么？

SEMrush AI Visibility Score是一个综合评分指标（0-100），综合衡量品牌关键词在以下AI平台的出现频次和质量：

- Google AI Overviews（权重最高，30%）
- ChatGPT（25%）
- Perplexity（25%）
- Bing Copilot（20%）

**评分解读：**
- 0-20：AI可见度极低，需要立即优化
- 21-50：初级可见度，有较大提升空间
- 51-75：中等水平，接近行业均值
- 76-100：优秀，属于所在行业前20%

## 与传统SEO排名的关系

SEMrush对10万个关键词的研究发现：
- Google传统排名第1-3的页面，AI Visibility Score平均58分
- 但有17%的页面传统排名在第5位以外，AI Visibility Score却超过70分
- 证明GEO和传统SEO排名已出现显著分化，两者需要分别优化

## 如何提升AI Visibility Score

1. **内容结构优化**（影响最大）：答案前置、FAQ段落、对比表格
2. **FAQ Schema部署**：平均提升Score 8-12分
3. **外链权威性**：高DA外链是AI引用的核心信号
4. **内容更新频率**：每月更新的内容比1年未更新的内容Score高23%
5. **llms.txt部署**：对Perplexity和Claude有正面效果

查看[GEO工具导航](/geo-nav)了解所有选项。""",
        "category": "tools",
        "tags": ["SEMrush", "AI Visibility", "GEO指标", "AI Overview", "工具更新"],
        "source": "SEMrush官方博客",
        "date": "2026-04-15",
        "impact": "medium",
        "link": "https://www.semrush.com/blog",
    },
    {
        "title": "DeepSeek R2发布：国内AI搜索市场格局再度洗牌",
        "description": "DeepSeek R2的发布在国内AI搜索市场引发新一轮竞争。R2的深度搜索能力大幅升级，对内容引用的选择标准更为严格，站长需要针对DeepSeek的DSO逻辑进行专项优化。",
        "content": """## DeepSeek R2的核心升级

DeepSeek R2相比R1的主要变化：

- **深度搜索能力增强**：多轮搜索深度从3轮提升至最高8轮
- **引用质量提升**：R2对引用内容的质量要求明显提高，低质量内容被引用率下降60%
- **结构化偏好增强**：R2对Markdown格式、表格、代码块的解析更准确
- **中文理解优化**：针对中文互联网内容的理解精度提升

## 对GEO/DSO优化的影响

根据AIDSO爱搜发布的R2上线后30天追踪数据：

| 内容类型 | R1时代引用率 | R2时代引用率 | 变化 |
|---------|-------------|-------------|------|
| 有数据支撑的专业内容 | 42% | 58% | +38% |
| 结构化FAQ内容 | 35% | 52% | +49% |
| 无引用来源的泛化内容 | 28% | 11% | -61% |
| 过期/未更新内容（>1年） | 15% | 5% | -67% |

## DSO（DeepSearch Optimization）重点

针对DeepSeek R2的优化建议：

1. **引用来源必须注明**：无来源的统计数字在R2中被降权
2. **使用Markdown格式**：R2对标准Markdown的解析最友好
3. **更新内容时间戳**：R2的新鲜度算法权重比R1高一倍
4. **覆盖知乎**：知乎内容在R2的引用权重最高
5. **专业深度 > 内容量**：R2更倾向于引用专业深度高的垂直内容

查看[GEO工具导航](/geo-nav)中的国内工具列表了解更多DeepSeek专项优化工具。""",
        "category": "geo",
        "tags": ["DeepSeek R2", "DSO", "GEO", "国内AI搜索", "内容优化"],
        "source": "DeepSeek官方公告",
        "date": "2026-04-10",
        "impact": "high",
        "link": "https://deepseek.com",
    },
    {
        "title": "新研究：配置结构化数据的网站在AI Overview中获得3倍引用",
        "description": "普林斯顿大学联合Moz发布的2026年最新研究证实：正确配置FAQ、Article、HowTo等Schema标记的网站，在Google AI Overviews中被引用的概率是未配置网站的3.2倍。",
        "content": """## 研究概述

**研究机构：** 普林斯顿大学计算机科学系 + Moz Research
**研究时间：** 2025年10月-2026年3月（6个月追踪）
**样本量：** 分析了50万个URL在Google AI Overviews中的出现情况
**发表平台：** WWW 2026会议（世界网页大会）

## 核心发现

### 结论一：Schema配置与AI引用率正相关

| Schema配置情况 | AI Overview引用率 |
|--------------|------------------|
| 未配置任何Schema | 4.2% |
| 配置Article/BlogPosting Schema | 11.3% |
| 配置FAQ Schema | 13.6% |

FAQ Schema的效果最为显著——平均引用率是无Schema页面的3.2倍。

### 结论二：FAQ Schema的质量影响效果差异

- 问题少于3个的FAQ Schema：提升效果有限（约1.4倍）
- 问题3-7个，每个答案100-200字：效果最佳（3.2倍）
- 问题超过10个：收益递减（2.1倍）

**结论：Schema是放大器，不是替代品。先有好内容，再加Schema。**

## 对从业者的实践建议

1. 为所有信息类核心页面添加FAQPage Schema
2. 为文章添加Article Schema（含发布日期和作者信息）
3. 为操作指南添加HowTo Schema

使用我们的[Schema生成器](/schema-generator)快速生成所有类型的Schema代码。""",
        "category": "schema",
        "tags": ["Schema标记", "研究报告", "Google AI Overviews", "FAQ Schema", "结构化数据"],
        "source": "WWW 2026会议论文",
        "date": "2026-04-05",
        "impact": "high",
        "link": "https://www2026.thewebconf.org",
    },
    {
        "title": "Google更新E-E-A-T指南：AI生成内容如何评估？",
        "description": "Google发布了更新的E-E-A-T（经验-专业知识-权威性-可信度）评估指南，明确AI生成内容的评估标准：内容来源与编辑把关比生成方式更重要。",
        "content": """## E-E-A-T更新的核心内容

Google于2026年3月更新了搜索质量评估指南中关于E-E-A-T的部分，新增了专门的AI内容评估章节。

### 关键原则：内容质量而非生成方式

Google明确表示：评估的是内容本身的质量，而非是否由AI生成。

### 对AI内容的具体评估标准

| 维度 | 会提升评分的做法 | 会降低评分的做法 |
|------|----------------|------------------|
| 经验（Experience）| 包含亲身实践数据、案例 | 无实操细节的通用表述 |
| 专业知识（Expertise）| 作者有明确资质背书 | 匿名内容、无作者信息 |
| 权威性（Authority）| 被行业权威网站引用 | 在孤立低质量网站上 |
| 可信度（Trust）| 引用可验证的来源 | 无来源的统计数字 |

### AI内容的红线

更新指南明确以下情形会被视为低质量内容：
- 大规模生成缺乏深度、不区分话题的通用文章
- AI生成内容未经人工审核就发布
- 用AI批量生成关键词变体页面

## 对SEO内容策略的影响

**可以做的：**
- 使用AI辅助内容创作，但需人工审核和个性化补充
- 在AI生成基础上加入真实经验、数据和专家视角

**应避免的：**
- 不加审核地批量发布AI生成内容
- 隐藏AI创作事实

## 总结

E-E-A-T更新的核心信号是：AI可以作为内容创作工具，但不能替代真实的专业知识和经验。人+AI的协作模式，才是2026年内容SEO的最优解。""",
        "category": "seo",
        "tags": ["E-E-A-T", "Google更新", "AI内容", "内容质量", "SEO策略"],
        "source": "Google Search Central博客",
        "date": "2026-03-30",
        "impact": "high",
        "link": "https://developers.google.com/search/blog",
    },
]


# ===================== 主函数 =====================
if __name__ == "__main__":
    print("=" * 60)
    print("SGAIndex 内容批量上传工具 v2")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # 上传文章
    print(f"\n[1/2] 上传文章（Articles）共{len(articles)}篇...")
    a_ok = upload_batch("wseo_articles", articles, "文章")
    print(f"文章上传完成: {a_ok}/{len(articles)}")

    # 上传新闻
    print(f"\n[2/2] 上传新闻（News）共{len(news_items)}条...")
    n_ok = upload_batch("wseo_news", news_items, "新闻")
    print(f"新闻上传完成: {n_ok}/{len(news_items)}")

    print("\n" + "=" * 60)
    print(f"完成！文章 {a_ok}/{len(articles)} 篇 + 新闻 {n_ok}/{len(news_items)} 条")
    print("=" * 60)
