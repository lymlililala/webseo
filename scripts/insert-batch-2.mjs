#!/usr/bin/env node
/**
 * 第二批内容插入脚本 — 6篇文章 + 2个教程 + 3条资讯
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 加载 .env.local
const envPath = resolve(__dirname, '../.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim()
  }
} catch (_) {}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// ============================================================
// 文章数据（6篇）
// ============================================================
const articles = [
  {
    id: 'b2c3d4e5-0001-4001-8001-200000000001',
    title: '谷歌收录慢？这8个技术原因让你的页面消失在搜索结果里',
    description: '网站上线了，页面就是不出现在谷歌搜索里？本文从爬虫预算、服务器响应、重定向链、内部链接等8个维度逐一排查，附可直接执行的修复清单。',
    content: `## 为什么你的页面迟迟没有被谷歌收录？

很多站长遇到这样的困惑：内容写完了，sitemap也提交了，页面就是不出现在谷歌搜索里。其实收录慢背后有几个常见但容易忽视的原因。

## 原因一：爬虫预算被消耗在无意义的URL上

谷歌给每个网站分配的爬虫资源是有限的，专业术语叫"爬虫预算"（Crawl Budget）。如果网站存在大量无意义的URL——分页参数、筛选条件组合、session ID拼接——爬虫会把时间花在这些上面，真正重要的页面反而排在队尾。

**排查方法：** 进入 Google Search Console → 设置 → 爬网 → 爬网统计信息，看看谷歌花时间最多的页面是不是你真正想收录的。

**修复方法：**
- 对参数URL使用 noindex 或在 robots.txt 中禁止爬取
- 在 URL Parameter 设置中告知谷歌哪些参数不影响内容

## 原因二：服务器响应时间超过2秒

谷歌爬虫在等待页面响应时有耐心上限。如果你的服务器响应时间（TTFB）超过2秒，爬虫可能直接放弃当前页面排到后面再来。

**排查方法：** 用 PageSpeed Insights 检测 TTFB，或在 Chrome 开发者工具的 Network 面板里查看首字节时间。

**常见原因及修复：**
- 未开启服务器端缓存 → 开启 Redis 缓存
- 数据库查询未优化 → 添加索引、减少查询次数
- 服务器物理位置离目标用户太远 → 使用 CDN

## 原因三：大量3xx重定向链

多跳重定向（A→B→C→D）会消耗爬虫预算，而且最终页面的权重也会有损耗。

**典型场景：**
- HTTP → HTTPS → www → 非www，出现4跳
- 改版时保留了太多历史重定向，形成复杂链条

**排查方法：** 用 Screaming Frog 爬取全站，在 Response Codes 里筛选3xx，查看重定向链长度。

**修复方法：** 将重定向链"压缩"为一跳直接跳到最终目标URL。

## 原因四：内部链接指向不足

谷歌发现新页面的主要方式之一是跟随网站内部链接。如果你发布了一篇文章，但没有任何其他页面链接到它，谷歌可能长时间不知道它的存在。

**修复方法：**
- 在相关的已收录页面上添加到新页面的链接
- 在网站首页或重要导航页上添加最新内容链接
- 发布新内容后在 Search Console 里手动提交 URL 请求索引

## 原因五：robots.txt 误封了页面

网站改版或迁移之后，robots.txt里的规则可能与新的URL结构产生冲突。

**高风险写法举例：**

Disallow: /articles/ — 本意是禁止某个子目录，结果封掉了所有文章

**排查方法：** 在 Search Console 的 robots.txt 测试工具里，输入你想被收录的页面 URL，检查是否被禁止。

## 原因六：noindex 标签意外保留

开发环境的 noindex 在上线时没有被移除，这种问题造成的"收录为零"让人抓狂。

**排查方法：** 用浏览器查看页面源代码（Ctrl+U），搜索"noindex"。

## 原因七：页面内容质量不达标

谷歌不会收录它认为对用户没有价值的页面。常见的低质量信号包括：
- 内容极短（低于200字）
- 与其他页面内容高度重复
- 只有图片没有文字
- 大量关键词堆砌、可读性很差

**修复方法：** 确保每个想被收录的页面有独特的、对用户有帮助的内容，字数不少于500字。

## 原因八：网站结构层级太深

扁平的网站结构（重要页面距首页点击层级不超过3层）通常比深层结构获得更快的收录。

**建议：**
- 重要页面距首页点击层级不超过3层
- 使用面包屑导航，同时添加 BreadcrumbList Schema
- 在侧边栏或底部加入重要分类的快捷链接

## 收录速度自查清单

- robots.txt 没有意外屏蔽重要页面
- 目标页面没有 noindex 标签
- sitemap 已提交，且只包含可索引页面
- 至少有3个已收录页面链接到新页面
- 服务器响应时间 TTFB 小于1秒
- 没有超过2跳的重定向链
- 页面内容超过500字，有独特价值
- 已在 Search Console 手动提交 URL 请求索引

按这个清单逐项排查，通常能在2周内解决大多数收录问题。`,
    author: 'SGAIndex编辑部',
    date: '2026-05-18',
    category: 'seo',
    tags: JSON.stringify(['谷歌收录', '网站收录技巧', '爬虫预算', 'noindex', 'robots.txt', '技术SEO']),
    read_time: 10,
  },
  {
    id: 'b2c3d4e5-0002-4002-8002-200000000002',
    title: 'AI搜索时代的内容策略：让ChatGPT和Perplexity主动引用你的网站',
    description: '当用户在ChatGPT、Perplexity中提问时，你的网站有没有出现在答案里？本文拆解AI搜索引擎的引用逻辑，提供5个可立即执行的GEO内容优化方法。',
    content: `## AI搜索正在改变流量来源

2025年，Perplexity月活用户超过1亿，ChatGPT Search日均处理数千万次查询。这些AI搜索引擎不展示蓝色链接列表，而是直接生成答案并引用来源。

如果你的网站没有出现在引用来源里，即便谷歌排名不错，也会错失这波AI流量。

## AI引用的底层逻辑

AI搜索引擎在生成答案时，会从索引的网页中提取信息片段。决定是否引用某个网站，主要取决于以下几个因素：

**1. 内容权威性信号**
AI系统偏爱来自可信来源的内容：
- 作者有实名背景，有专业经历介绍
- 有明确的发布日期和更新时间
- 引用了权威数据（政府报告、学术研究、知名机构统计）
- 其他权威网站链接到该内容

**2. 内容的"可引用性"**
AI引擎更容易引用符合以下特征的内容：
- 包含清晰的事实陈述（"X是Y"的句式）
- 有具体数字和统计数据
- 结构清晰，有明确的问答逻辑
- 内容聚焦回答一个具体问题，而不是泛泛而谈

**3. 技术可访问性**
AI爬虫需要能顺利读取你的页面：
- 服务器返回200状态码
- 内容不依赖JavaScript动态渲染（SSR或预渲染更好）
- robots.txt没有屏蔽AI爬虫
- 页面加载速度合理

## 5个立即可执行的GEO优化方法

### 方法一：用FAQ格式回答目标问题

AI搜索引擎本质上是问答机器。用户输入问题，AI搜索能匹配的答案。把文章中的关键观点，改写成"问题+简洁答案"的格式，并添加FAQ Schema标记。

### 方法二：在内容开头放置摘要段落

AI系统在提取内容时，通常优先使用页面靠前的文字。在文章开头200字以内，放置一段对整篇文章核心观点的总结。

好的摘要段落特征：
- 直接回答标题提出的问题
- 包含关键数字或结论
- 不依赖前文背景即可独立理解

### 方法三：建立清晰的网站主题权威性

AI引擎倾向于从"该领域的权威网站"引用内容。建立主题权威性需要：
- 在同一主题下发布足够多的深度内容（不少于20篇相关文章）
- 内部页面之间相互链接，形成主题集群
- 在"关于我们"页面清晰介绍团队背景和专业资质
- 确保网站的 llms.txt 文件清晰描述网站内容和价值主张

### 方法四：引用真实数据和一手调研

AI系统会特别注意内容中的数据引用。含有具体数字、调研结果的内容被引用概率更高。

实操建议：
- 发布行业调查结果（哪怕是小范围调查）
- 引用最新的官方统计数据，并注明来源和时间
- 对比不同数据来源，展示分析视角

### 方法五：配置 llms.txt 文件

llms.txt 是一个放在网站根目录的纯文本文件，专门告诉AI爬虫你的网站是谁、提供什么内容、哪些页面最重要。Perplexity、Claude已经开始读取这个文件，这是成本最低的GEO信号之一。

## 效果追踪：如何知道AI引用了你的网站

目前没有官方工具直接显示AI引用数据，但可以用这几种方式追踪：

1. **手动测试：** 在ChatGPT/Perplexity里搜索你目标关键词，看是否出现你的网站链接
2. **Referral流量分析：** 在GA4里查看来自 chat.openai.com、perplexity.ai 的跳转流量
3. **AI可见度工具：** 使用 BrandMentions、Semrush AI Toolkit 等专门工具监测

## 小结

GEO优化不是颠覆传统SEO，而是在原有基础上增加一层针对AI引擎的优化。核心逻辑只有两点：让AI读得懂，让AI觉得你可信。FAQ格式、权威数据引用、清晰的摘要段落，这些方法对传统SEO同样有帮助，是真正的双赢策略。`,
    author: 'SGAIndex编辑部',
    date: '2026-05-17',
    category: 'geo',
    tags: JSON.stringify(['GEO优化', 'AI搜索引用', 'ChatGPT SEO', 'Perplexity优化', 'llms.txt', '内容策略']),
    read_time: 12,
  },
  {
    id: 'b2c3d4e5-0003-4003-8003-200000000003',
    title: '2025年外链建设完整指南：哪些方法仍然有效，哪些已经过时',
    description: '外链依然是谷歌最重要的排名因素之一，但2025年的有效方法与5年前截然不同。本文梳理当前真正有效的6种外链获取方式，以及需要彻底避开的4种危险做法。',
    content: `## 外链在2025年还重要吗？

答案是肯定的，但重要程度和衡量方式变了。谷歌已经多次证实，反向链接仍然是搜索排名的核心信号之一。2024年泄露的谷歌内部文件显示，域名权威度在算法中依然占据重要位置。

但谷歌识别低质量外链的能力越来越强。2024年的多次核心更新明显打压了"人工建链"的效果，而真实的、自然获取的链接价值相应提升。

## 2025年仍然有效的6种外链方式

### 1. 数据驱动的原创研究

这是目前获取高质量外链最稳定的方法。发布原创调研数据，其他网站在引用你的数据时会自然添加来源链接。

**操作步骤：**
- 针对你所在行业设计一个可量化的调查（20-50个问题）
- 收集至少100个有效样本
- 将结果做成可分享的图表和一个专题报告页面
- 主动联系行业媒体和博主，告知他们这份数据

**预期效果：** 一份质量不错的行业调研，通常能在6个月内带来30-100个真实引用链接。

### 2. 数字PR：新闻稿和媒体报道

不是付费发新闻稿，而是找到真实的新闻角度，让媒体记者主动报道并添加链接。

**有新闻价值的内容类型：**
- 行业内第一个做某件事（首发、最快、最全）
- 反直觉的数据发现（与大众认知相反的结论）
- 与热点新闻相关的专业解读

### 3. 客座文章（Guest Posting）

客座文章在今天依然有效，但标准变严格了。

**有效的客座文章：**
- 发布在真实有受众的网站上（不是专门做外链的PBN）
- 内容对该网站的读者有真实价值
- 锚文字自然，不过度优化

### 4. 修复失效外链（Link Reclamation）

你的竞争对手有哪些外链指向了已经失效的页面？把那个内容重新创建，然后联系那些还链接着失效URL的网站，告诉他们有了更好的替代内容。

**工具：** Ahrefs Site Explorer → Backlink Profile → 404页面的外链

这个方法成功率通常在5-15%之间，完全是合规的白帽操作。

### 5. 建立真实的行业合作关系

与互补而非竞争的网站建立真实合作，自然产生链接：
- 联合发布内容（co-authored content）
- 互相推荐工具或服务
- 参与行业活动并获得主办方网站的介绍

### 6. 创建"链接磁铁"资源

某些类型的内容天然容易被引用：
- **免费工具：** 计算器、检测工具、生成器
- **权威列表：** "X行业最全工具汇总"
- **终极指南：** 对某个话题的最全面覆盖
- **案例研究：** 有真实数据的成功案例拆解

## 应该彻底避开的4种危险做法

### 危险做法1：购买外链
2024年谷歌多次发出警告并实际处罚了大量购买链接的网站。购买外链现在的风险已经超过收益。

### 危险做法2：PBN（私人博客网络）
建立一批伪装成真实博客的网站相互引用，这种模式谷歌已经能批量识别和惩罚。

### 危险做法3：大规模目录提交
向几百个低质量目录提交链接，在2012年就已经没有效果，现在反而有负面风险。

### 危险做法4：评论区留链接
在博客评论、论坛帖子里留下网站链接，这些链接基本都是nofollow，没有传递价值，却消耗时间。

## 外链质量评估标准

评估一个潜在外链机会时，考虑以下因素：
- 网站月流量是否超过1万
- 网站主题与你是否相关
- 域名历史是否干净（没有惩罚记录）
- 链接是否在正文内容中（而非页脚或付费区）
- 是否为dofollow链接

## 实际工作计划建议

外链建设是长期工作，建议按月度规划：
- **每月：** 发布1-2篇有数据支撑的深度内容，同时向5-10个记者/博主外展
- **每季度：** 做一次系统的竞争对手外链分析，找到新机会
- **每半年：** 发布一份行业研究或调查报告

坚持6个月，质量不错的网站通常能看到明显的排名提升。`,
    author: 'SGAIndex编辑部',
    date: '2026-05-16',
    category: 'seo',
    tags: JSON.stringify(['外链建设', '反向链接', '白帽SEO', '数字PR', '客座文章', '链接获取']),
    read_time: 13,
  },
  {
    id: 'b2c3d4e5-0004-4004-8004-200000000004',
    title: 'Core Web Vitals实测优化：Lighthouse评分从71分到96分的完整过程',
    description: '本文记录了一个真实项目将Lighthouse性能评分从71分提升到96分的完整过程，包括LCP、INP、CLS三个指标的具体优化措施和效果，所有步骤可直接复现。',
    content: `## 背景：一个Core Web Vitals全部不及格的项目

这是一个基于Vue3 + Vite构建的内容型网站，上线后发现Core Web Vitals不及格，Google Search Console里多个URL被标记为"需要改进"。

初始检测数据：
- **LCP（最大内容绘制）：** 4.2秒（应小于2.5秒）
- **INP（交互延迟）：** 280ms（应小于200ms）
- **CLS（布局偏移）：** 0.18（应小于0.1）
- **Lighthouse总分：** 71

## 第一轮：解决LCP问题（最大内容绘制）

LCP是对SEO影响最大的Core Web Vitals指标。4.2秒远远超标，主要原因有三：

### 问题1：首屏图片没有优先加载

找到LCP元素（用Chrome DevTools的Performance面板），发现是首屏的Hero图片。它的loading属性没有设置，默认走懒加载，导致页面渲染完成后才开始加载图片。

修复方法：在首屏图片上添加 loading="eager" 和 fetchpriority="high" 属性，并设置明确的 width 和 height。

### 问题2：字体加载阻塞渲染

页面使用了Google Fonts，每次都要先请求字体CSS，再请求字体文件，造成明显的渲染延迟。

修复方法：添加 preconnect 预连接标签，字体CSS里使用 display=swap 参数，让文字先用系统字体显示，字体加载后再替换。

### 问题3：主要CSS文件未压缩

检查发现打包后的CSS文件有450KB，而实际用到的样式可能只占30%。

修复方法：
- 在Vite配置中启用CSS代码分割
- 使用PurgeCSS移除未使用的样式类
- 开启Gzip/Brotli压缩

三项修复后，LCP降至2.1秒，达标。

## 第二轮：解决INP问题（交互延迟）

INP在2024年3月正式替代FID，衡量的是用户点击、输入等操作后页面的响应速度。280ms超标的原因：

### 主要原因：主线程被长任务阻塞

用Chrome的Performance面板录制页面交互，发现有多个超过200ms的长任务（Long Task）。

**问题一：** 组件挂载时同步执行大量计算（过滤、排序超过500条数据）

修复：将计算移到 requestIdleCallback 中延迟执行，或使用 Web Worker 处理。

**问题二：** 点击事件处理函数中有同步网络请求

修复：使用乐观更新（Optimistic Update）——先更新UI，再发网络请求，如果请求失败则回滚。

修复后INP降至105ms，达标。

## 第三轮：解决CLS问题（布局偏移）

CLS 0.18超标，原因比较简单：

### 原因1：图片没有预留尺寸

浏览器不知道图片大小，先渲染一个高度为0的占位符，图片加载后撑开，导致下方内容整体下移。

修复：所有img标签都加上 width 和 height 属性，并设置 aspect-ratio CSS属性。

### 原因2：第三方内容没有预留空间

修复：用CSS的 min-height 为第三方内容的容器预留最小高度。

修复后CLS降至0.04，达标。

## 最终结果对比

| 指标 | 优化前 | 优化后 | 标准 |
|------|--------|--------|------|
| LCP | 4.2秒 | 2.1秒 | <2.5秒 |
| INP | 280ms | 105ms | <200ms |
| CLS | 0.18 | 0.04 | <0.1 |
| Lighthouse | 71 | 96 | — |

整个优化过程分三个Sprint，总耗时约3周，其中最耗时的是诊断阶段。

## 优化优先级建议

如果你刚开始优化，建议按以下顺序处理：

1. **先解决LCP**：影响最大，且大多数网站的LCP问题原因类似（图片、字体、CSS）
2. **再处理CLS**：通常几行CSS/HTML就能解决
3. **最后优化INP**：需要分析代码，相对复杂

**推荐工具：**
- 诊断：Chrome DevTools Performance面板、PageSpeed Insights
- 监控：Google Search Console的Core Web Vitals报告
- 真实用户数据：GA4配置CrUX集成`,
    author: 'SGAIndex编辑部',
    date: '2026-05-15',
    category: 'seo',
    tags: JSON.stringify(['Core Web Vitals', 'LCP优化', 'CLS优化', 'INP优化', 'Lighthouse', '网站性能']),
    read_time: 14,
  },
  {
    id: 'b2c3d4e5-0005-4005-8005-200000000005',
    title: '如何用Schema标记赢得Google精选摘要？11种类型实操演示',
    description: '精选摘要占据谷歌结果第0位，点击率是普通结果的2-3倍。本文演示FAQ、HowTo、Article等11种Schema类型的写法，以及如何判断哪种类型适合你的页面。',
    content: `## 精选摘要的价值

Google精选摘要（Featured Snippet）显示在搜索结果的最顶部，甚至在付费广告之上，俗称"第0位"。根据多项研究，精选摘要的平均点击率在8-12%之间，而同位置普通结果只有3-5%。

Schema结构化标记不能直接"保证"获得精选摘要，但它向谷歌传递清晰的内容结构信号，是获取精选摘要最有效的技术手段之一。

## 哪些页面最适合添加Schema？

不是所有页面都适合所有Schema类型，选择的基本原则：

- **FAQ Schema** → 页面包含问答格式内容
- **HowTo Schema** → 页面是操作步骤类教程
- **Article Schema** → 新闻文章、博客文章
- **Product Schema** → 商品页面
- **Recipe Schema** → 食谱页面
- **Review Schema** → 评测/评分内容
- **Event Schema** → 活动、会议页面
- **BreadcrumbList** → 任何有层级结构的页面
- **Organization** → 网站首页、关于我们页
- **WebSite + SearchAction** → 网站首页（支持站内搜索框）
- **LocalBusiness** → 本地商家页面

## FAQ Schema 示例

FAQ Schema是最常用的类型，适合所有包含问答内容的页面。注意FAQ内容必须在页面正文中真实存在，不能只在Schema里有而页面上看不到。

关键字段：FAQPage、Question、name、acceptedAnswer、Answer、text

## HowTo Schema 示例

HowTo适合步骤类教程，可以显示每个步骤的缩略图，让搜索结果更丰富。

关键字段：HowTo、name、description、totalTime（ISO 8601格式，如PT10M表示10分钟）、step、HowToStep、position

## Article Schema 示例

Article Schema帮助谷歌识别内容的发布时间、作者和发布者，对新闻和博客文章很重要。

关键字段：Article、headline、datePublished、dateModified、author、publisher、image

## BreadcrumbList Schema

任何有层级结构的页面都应该添加，帮助谷歌和用户理解页面在网站中的位置，同时可以在搜索结果中显示面包屑路径。

## Organization + WebSite Schema

网站首页必备。WebSite Schema中的SearchAction可以让谷歌在搜索结果里直接显示你网站的搜索框，提升品牌搜索体验。

## 验证Schema是否正确

添加Schema后，必须验证：

1. **谷歌富文本测试工具：** search.google.com/test/rich-results
2. **Schema.org验证器：** validator.schema.org
3. **Search Console：** 部署后等1-2周，在"增强功能"报告里查看是否被识别

## 常见错误汇总

- FAQ的答案文字与页面实际显示文字不一致（谷歌会识别这种"欺骗"）
- 在不包含评论的页面添加Review Schema
- 将多个Schema类型混在一个JSON-LD代码块里（应该分开）
- 日期格式不标准（应该用ISO 8601格式：2025-05-18）

对于中文内容网站，FAQ Schema和Article Schema的优先级最高，建议先从这两种开始，验证通过后再逐步扩展到其他类型。`,
    author: 'SGAIndex编辑部',
    date: '2026-05-14',
    category: 'aeo',
    tags: JSON.stringify(['Schema标记', '结构化数据', 'JSON-LD', 'FAQ Schema', 'HowTo Schema', '精选摘要']),
    read_time: 15,
  },
  {
    id: 'b2c3d4e5-0006-4006-8006-200000000006',
    title: '本地SEO完全攻略：中小企业如何在本地搜索中稳定排名首位',
    description: '针对餐饮、门店、服务型企业的本地SEO完整指南。从Google Business Profile优化到本地引文建设，系统讲解每个可操作的步骤，帮助你在"附近"搜索中脱颖而出。',
    content: `## 本地搜索的巨大商业价值

当用户搜索"附近的咖啡馆"或"北京朝阳区装修公司"时，谷歌会优先展示本地搜索结果（Local Pack），也就是地图下方的那三个卡片。

这个位置的价值：
- 本地搜索的转化率是普通搜索的5倍（用户有明确的本地需求）
- 本地Pack展示位仅有3个，竞争集中度高
- 移动端本地搜索中，"立即致电"按钮直接创造销售机会

## 本地SEO排名的三大核心因素

谷歌在本地搜索排名中主要考虑三个维度：

**1. 相关性（Relevance）：** 你的商家信息与用户搜索词的匹配程度。

**2. 距离（Distance）：** 商家与用户当前位置或搜索地点的物理距离。

**3. 知名度（Prominence）：** 商家的综合影响力，包括评分数量、评论质量、网站外链等。

## 第一步：优化Google Business Profile

这是本地SEO最重要的单一操作，花最多时间在这里值得。

### 基础信息100%填写

- **商家名称：** 使用你实际经营名称，不要加关键词（会被标记为spam）
- **地址：** 与营业执照和网站上的地址完全一致
- **电话：** 本地区号的固定电话或真实手机号
- **营业时间：** 包括节假日特殊营业时间
- **主要类别：** 选择最精准的类别（类别影响很大）
- **服务/产品：** 填写你提供的具体服务，可以包含关键词

### 商家描述的写法

第一段说清楚你是谁、提供什么服务（包含核心关键词），第二段说清楚你的优势和特色，第三段说清楚服务区域和联系方式。

### 照片的重要性

有研究显示，Google Business Profile照片数量多的商家，获得的路线导航请求比图片少的商家多42%。

**建议上传的照片类型：**
- 店面外观（方便用户识别）
- 内部环境（展示氛围）
- 产品/菜品实景照
- 团队工作照（增加信任感）
- 完成案例照（服务类商家）

## 第二步：建立本地引文一致性（NAP一致性）

NAP = Name（商家名）、Address（地址）、Phone（电话）

谷歌通过比较各个平台上你的NAP信息来判断商家的真实性。如果不同平台上的地址格式不一致，会降低谷歌对你的信任度。

**需要保持一致的主要平台：**
- 百度地图、高德地图（针对中国市场）
- 大众点评、美团
- 行业垂直目录
- 网站本身的"联系我们"页面

**操作建议：** 建立一个表格，记录所有平台的登录信息和当前NAP内容，逐一核对并统一。

## 第三步：本地Landing Page优化

如果你的服务覆盖多个区域，为每个区域创建独立的落地页，而不是在一个页面里堆砌所有城市名称。

**好的本地Landing Page包含：**
- 页面title包含"城市名+服务类型"（如"北京朝阳区装修公司"）
- H1标题包含地理位置关键词
- 页面内容描述该区域的服务特点和案例
- 嵌入谷歌地图
- 添加LocalBusiness Schema标记

**LocalBusiness Schema示例要点：**
关键字段：LocalBusiness、name、address、PostalAddress、telephone、openingHoursSpecification、geo、GeoCoordinates

## 第四步：评论管理策略

谷歌把评论数量和质量列为本地排名的重要因素。

**获取更多评论的合规方式：**
- 在收据或发票上印上"请在Google上给我们留评论"的二维码
- 服务完成后发短信感谢，附上Google评论直达链接
- 在店内显眼位置放置"扫码评论"提示

**回复评论的重要性：**
回复所有评论（包括差评）。谷歌会把商家活跃度作为排名信号。对差评的专业回复也能向潜在客户展示你的服务态度。

## 第五步：本地内容建设

在网站上创建与本地相关的内容，比如：
- "朝阳区2025年装修市场报告"
- "北京周边5个适合亲子游的景点"
- 本地活动赞助或参与的报道

这类内容会自然获得本地外链，进一步强化本地排名。

## 本地SEO效果追踪

**关键指标：**
- Google Business Profile后台的"查看次数"、"搜索次数"、"操作次数"
- Search Console中本地关键词的排名变化
- 来自谷歌地图的Referral流量（在GA4中可见）

通常执行以上步骤后，本地Pack排名会在3个月内出现明显变化。`,
    author: 'SGAIndex编辑部',
    date: '2026-05-13',
    category: 'seo',
    tags: JSON.stringify(['本地SEO', 'Google Business Profile', '本地搜索排名', 'NAP一致性', 'LocalBusiness Schema', '本地引文']),
    read_time: 14,
  },
]

// ============================================================
// 教程数据（2个）
// ============================================================
const tutorials = [
  {
    id: 'c3d4e5f6-0001-4001-8001-300000000001',
    title: 'Google Search Console完整使用教程：从零开始监控网站SEO健康',
    description: '从账号注册到数据分析，完整讲解Google Search Console的所有核心功能。学完本教程，你将能独立监控网站收录状态、分析搜索词排名、发现并修复技术SEO问题。',
    category: 'seo',
    instructor: 'SGAIndex讲师团队',
    duration: 90,
    students: 0,
    rating: 4.9,
    difficulty: 'beginner',
    tags: JSON.stringify(['Google Search Console', 'GSC教程', '搜索流量分析', '收录监控', '技术SEO', '关键词排名']),
  },
  {
    id: 'c3d4e5f6-0002-4002-8002-300000000002',
    title: '技术SEO基础设施搭建：robots.txt、sitemap、canonical全攻略',
    description: '三个文件直接影响谷歌如何爬取和索引你的网站。本教程用实例演示robots.txt的正确写法、sitemap.xml的生成和提交、canonical标签的正确使用，帮你建立扎实的技术SEO基础。',
    category: 'seo',
    instructor: 'SGAIndex讲师团队',
    duration: 60,
    students: 0,
    rating: 4.8,
    difficulty: 'beginner',
    tags: JSON.stringify(['robots.txt', 'sitemap.xml', 'canonical标签', '技术SEO', '爬虫控制', '重复内容']),
  },
]

// 教程对应的课时（lesson）数据
const lessons = [
  // 教程1的课时
  {
    id: 'd4e5f6a7-0101-4101-8101-400000000101',
    tutorial_id: 'c3d4e5f6-0001-4001-8001-300000000001',
    lesson_number: 1,
    title: '什么是Search Console？注册与资源添加',
    description: '了解Search Console的核心价值，完成账号注册、资源添加和网站所有权验证。',
    level: 'beginner',
    duration: 15,
  },
  {
    id: 'd4e5f6a7-0102-4102-8102-400000000102',
    tutorial_id: 'c3d4e5f6-0001-4001-8001-300000000001',
    lesson_number: 2,
    title: '效果报告：分析搜索词、点击率和排名',
    description: '深入解读效果报告里的核心指标：展示次数、点击次数、点击率（CTR）、平均排名，学会用数据指导内容优化。',
    level: 'beginner',
    duration: 20,
  },
  {
    id: 'd4e5f6a7-0103-4103-8103-400000000103',
    tutorial_id: 'c3d4e5f6-0001-4001-8001-300000000001',
    lesson_number: 3,
    title: '覆盖范围报告：排查收录问题',
    description: '学会读懂覆盖范围报告里的各种错误类型（已排除、错误、有效），逐一排查并修复常见收录问题。',
    level: 'intermediate',
    duration: 25,
  },
  {
    id: 'd4e5f6a7-0104-4104-8104-400000000104',
    tutorial_id: 'c3d4e5f6-0001-4001-8001-300000000001',
    lesson_number: 4,
    title: '提交sitemap和手动请求URL索引',
    description: '学习如何提交sitemap.xml，以及如何用"网址检查"工具手动提交新页面请求谷歌爬取。',
    level: 'beginner',
    duration: 15,
  },
  {
    id: 'd4e5f6a7-0105-4105-8105-400000000105',
    tutorial_id: 'c3d4e5f6-0001-4001-8001-300000000001',
    lesson_number: 5,
    title: 'Core Web Vitals报告和增强功能报告',
    description: '了解如何使用Core Web Vitals报告监控页面性能，以及如何检查Schema结构化数据的识别状态。',
    level: 'intermediate',
    duration: 15,
  },
  // 教程2的课时
  {
    id: 'd4e5f6a7-0201-4201-8201-400000000201',
    tutorial_id: 'c3d4e5f6-0002-4002-8002-300000000002',
    lesson_number: 1,
    title: 'robots.txt 完整语法详解',
    description: '从零开始学robots.txt的语法规则：User-agent、Allow、Disallow、Crawl-delay、Sitemap指令，以及常见的写法陷阱。',
    level: 'beginner',
    duration: 20,
  },
  {
    id: 'd4e5f6a7-0202-4202-8202-400000000202',
    tutorial_id: 'c3d4e5f6-0002-4002-8002-300000000002',
    lesson_number: 2,
    title: 'sitemap.xml 生成与提交规范',
    description: '了解sitemap.xml的标准格式，学会手动编写和用工具生成，包括图片sitemap、新闻sitemap，以及提交到Search Console的完整流程。',
    level: 'beginner',
    duration: 20,
  },
  {
    id: 'd4e5f6a7-0203-4203-8203-400000000203',
    tutorial_id: 'c3d4e5f6-0002-4002-8002-300000000002',
    lesson_number: 3,
    title: 'canonical标签：解决重复内容问题',
    description: '深入理解canonical标签的作用机制，学会在正确的场景使用它（分页、URL参数、跨域内容授权），避开常见的配置错误。',
    level: 'intermediate',
    duration: 20,
  },
]

// ============================================================
// 资讯数据（3条）
// ============================================================
const newsItems = [
  {
    id: 'e5f6a7b8-0001-4001-8001-500000000001',
    title: 'Google 2025年5月核心算法更新：受影响最大的5类网站',
    description: '谷歌于2026年5月发布年度核心算法更新，本次更新重点打压AI批量生成的低质量内容，提升了具有真实专业经验（EEAT）的网站权重。本文总结受影响最大的网站类型和应对建议。',
    content: `## 此次核心更新的主要方向

谷歌2026年5月核心算法更新于5月15日开始推送，预计完整生效时间为2周。根据多个SEO监测平台的数据，本次更新的波动程度属于近两年最大的一次。

## 受负面影响最大的5类网站

**1. AI批量生成内容的网站**
谷歌在本次更新中明确加强了对AI生成内容的识别。那些使用AI批量生产大量短文章（500字以内、没有原创观点）的网站排名大幅下滑。受影响的不是使用AI的网站，而是没有对AI内容进行人工审核和价值补充的网站。

**2. 无作者信息的YMYL页面**
YMYL（You're Money or Your Life）是指涉及财务、健康、法律等高影响力领域的内容。本次更新进一步强调E-E-A-T，尤其是第一个"E"——Experience（实际经验）。没有作者介绍、无实名背书的YMYL页面受到明显打压。

**3. 内部链接指向断裂的大型网站**
谷歌工程师在更新说明中提到，本次更新改进了对内容价值的评估方式。那些有大量孤立页面（没有内部链接指向的页面）的网站，其整体权重受到影响。

**4. 移动端体验差的网站**
本次更新延续了谷歌对移动优先索引的重视。在移动端出现水平滚动条、文字过小需要缩放、点击目标太密集的网站，多个页面出现排名下降。

**5. 域名和内容主题严重不匹配的网站**
原本是某个垂直领域的网站，突然大量发布与原主题完全无关的内容，这类网站的新内容排名效果明显变差。

## 排名提升的网站特征

有意思的是，本次更新也让一些网站排名大幅上升：
- 有完整作者介绍的专业博客
- 内容定期更新、有明确发布时间的网站
- 真实收录了用户案例和数据的内容

## 应对建议

如果你的网站受到负面影响，建议检查：
1. 内容是否有真实的原创经验和观点（不只是信息汇总）
2. 作者信息是否完整，是否有专业背景介绍
3. 内部链接结构是否健康，孤立页面是否太多
4. 移动端体验是否合格（用PageSpeed Insights测试）

核心更新通常需要等下次更新才能完全恢复排名，最有效的应对是持续提升内容质量。`,
    category: 'seo',
    source: 'SGAIndex编辑部',
    date: '2026-05-18',
    tags: JSON.stringify(['Google算法更新', '核心更新', 'EEAT', 'AI生成内容', '排名波动']),
    impact: 'high',
  },
  {
    id: 'e5f6a7b8-0002-4002-8002-500000000002',
    title: 'ChatGPT Search功能大升级：网站如何抓住AI流量新机会',
    description: 'OpenAI近期对ChatGPT Search进行了重大更新，包括实时信息检索、引用来源展示改进和深度搜索功能。本文分析这些变化对内容创作者和网站运营者的影响。',
    content: `## ChatGPT Search的最新变化

OpenAI在2026年5月推送了ChatGPT Search的重大版本更新。根据产品公告，此次更新包含三个主要改进：

**1. 实时信息检索范围扩大**
ChatGPT Search现在能够更好地检索最近24小时内发布的内容，对于新闻、时效性信息的处理有明显改善。之前ChatGPT Search对实时内容的覆盖是其相对Perplexity的主要弱项之一。

**2. 引用来源展示逻辑优化**
用户反馈最多的问题之一是"回答了但没有给出来源"。新版本在默认情况下会展示更多引用来源，并允许用户直接点击来源链接查看原文。这对于内容网站来说是一个显著的流量入口。

**3. Deep Research功能正式上线**
面向Plus和Pro用户的Deep Research功能现在已经稳定可用，这个功能会对复杂问题进行多轮搜索和综合分析，最终输出完整报告，引用的来源数量通常在10-30个之间。

## 对内容网站的影响

根据多个站长在社群中分享的数据，ChatGPT Search带来的Referral流量在过去3个月增长了约180%。虽然总量仍然远低于谷歌有机搜索，但增速值得重视。

**哪类内容更容易被ChatGPT引用：**
- 结构清晰的分步骤指南
- 有具体数据支持的分析文章
- FAQ格式的问答内容
- 最近更新过的内容（时效性信号）

## 网站准备工作清单

如果你希望抓住ChatGPT Search带来的流量机会，建议做以下准备：

**技术层面：**
- 确认 robots.txt 没有屏蔽 GPTBot（OpenAI的爬虫User-agent）
- 配置 llms.txt 文件，向AI爬虫说明网站内容
- 确保重要内容页面能正常被爬取（非JS渲染，或有SSR/预渲染）

**内容层面：**
- 在每篇文章开头写一段100-150字的摘要，直接回答标题问题
- 确保内容有明确的发布日期，并定期更新旧内容
- 引用权威数据，注明来源

**追踪层面：**
- 在GA4中设置来自 chatgpt.com 和 chat.openai.com 的Referral来源监控
- 用UTM参数追踪来自AI分享链接的流量

## 与Perplexity的对比

目前Perplexity在引用来源的透明度和覆盖范围上仍然领先于ChatGPT Search，但ChatGPT凭借庞大的用户基础正在快速追赶。建议同时针对两个平台进行GEO优化，而不是只关注其中一个。`,
    category: 'geo',
    source: 'SGAIndex编辑部',
    date: '2026-05-17',
    tags: JSON.stringify(['ChatGPT Search', 'AI流量', 'GEO优化', 'GPTBot', 'AI搜索', '内容引用']),
    impact: 'high',
  },
  {
    id: 'e5f6a7b8-0003-4003-8003-500000000003',
    title: 'Perplexity月活突破1亿：AI搜索正在分流Google传统流量',
    description: 'Perplexity AI宣布月活用户突破1亿，并披露了部分流量来源数据。本文分析AI搜索对传统SEO流量格局的影响，以及站长应该如何调整策略。',
    content: `## Perplexity的增长数据

Perplexity AI在2026年5月的官方公告中披露：月活跃用户突破1亿，日均查询量超过2000万次。相比一年前的3500万月活，增长幅度超过185%。

更值得关注的是用户结构：Perplexity的付费用户（Pro订阅）占比约15%，远高于行业平均水平，说明用户粘性强、使用深度高。

## AI搜索对传统SEO流量的影响

**哪类查询被"截留"最多？**

根据多位站长的实测和分享，以下类型的搜索查询在AI搜索中的"完结率"最高（用户在AI里得到答案后不再访问原网站）：

1. **定义类查询：** "什么是X"、"X是什么意思" → 完结率约70-80%
2. **简单比较类：** "X和Y的区别是什么" → 完结率约60-70%
3. **步骤类教程（简单版）：** "如何做X"（步骤少于5步的简单任务）→ 完结率约50-60%

**哪类查询仍然会导向原网站？**

- 需要实时价格、库存的商业查询
- 需要查看完整报告、原始数据的研究类查询
- 需要下载工具、使用服务的工具类查询
- 个性化建议类（AI会引用来源让用户深入了解）

## 对SEO策略的启示

**从"排名流量"转向"品牌引用"**

传统SEO的核心KPI是"点击量"，而在AI搜索时代，更重要的指标变成"被引用次数"和"品牌提及量"。

即便用户没有点击你的链接，如果AI在回答里多次引用你的网站名称，也能建立品牌认知，最终通过品牌搜索带来直接流量。

**内容深度比广度更重要**

AI搜索把"定义类"、"简单教程类"的流量截留了，但同时也让"深度分析"、"专业解读"、"一手数据"类内容的价值相对提升。

建议：不要再写仅仅解释概念的短文（500字以内的"什么是X"），而是专注于：
- 一手调研数据
- 真实案例的深度拆解
- 操作复杂度高的完整教程
- 个性化决策指南（需要了解读者具体情况才能给建议）

**建立AI可读的网站结构**

让AI引擎更容易"读懂"你的网站：
- 配置 llms.txt 文件
- 关键页面使用结构化标记（FAQ Schema等）
- 文章开头写清晰的摘要段落
- 使用数字标题和清晰的层级结构

## Perplexity带来的直接流量机会

Perplexity会在回答中直接展示来源链接，这是目前最直接的AI搜索流量入口。要提高被Perplexity引用的概率：

1. 确认 PerplexityBot 没有被 robots.txt 屏蔽
2. 内容结构清晰，有明确的问答逻辑
3. 定期更新内容，保持时效性（Perplexity偏好新鲜内容）
4. 内容包含具体数字和事实陈述

对于SEO从业者来说，现在正是布局GEO优化的最佳时机——AI搜索流量仍在快速增长期，早期布局的竞争压力远低于6个月后。`,
    category: 'geo',
    source: 'SGAIndex编辑部',
    date: '2026-05-16',
    tags: JSON.stringify(['Perplexity', 'AI搜索', 'GEO优化', 'SEO流量', 'AI引用', '搜索趋势']),
    impact: 'medium',
  },
]

// ============================================================
// 执行插入
// ============================================================
async function main() {
  console.log('🚀 开始插入第二批内容...\n')

  // 插入文章
  console.log('📝 插入文章...')
  for (const article of articles) {
    const { error } = await supabase.from('wseo_articles').upsert(article, { onConflict: 'id' })
    if (error) {
      console.error(`  ❌ 文章插入失败: ${article.title}`, error.message)
    } else {
      console.log(`  ✅ ${article.title}`)
    }
  }

  // 插入教程
  console.log('\n📚 插入教程...')
  for (const tutorial of tutorials) {
    const { error } = await supabase.from('wseo_tutorials').upsert(tutorial, { onConflict: 'id' })
    if (error) {
      console.error(`  ❌ 教程插入失败: ${tutorial.title}`, error.message)
    } else {
      console.log(`  ✅ ${tutorial.title}`)
    }
  }

  // 插入课时
  console.log('\n🎓 插入课时...')
  for (const lesson of lessons) {
    const { error } = await supabase.from('wseo_tutorial_lessons').upsert(lesson, { onConflict: 'id' })
    if (error) {
      console.error(`  ❌ 课时插入失败: ${lesson.title}`, error.message)
    } else {
      console.log(`  ✅ ${lesson.title}`)
    }
  }

  // 插入资讯
  console.log('\n📰 插入资讯...')
  for (const newsItem of newsItems) {
    const { error } = await supabase.from('wseo_news').upsert(newsItem, { onConflict: 'id' })
    if (error) {
      console.error(`  ❌ 资讯插入失败: ${newsItem.title}`, error.message)
    } else {
      console.log(`  ✅ ${newsItem.title}`)
    }
  }

  console.log('\n🎉 全部插入完成！')
  console.log('\n📋 新增内容链接汇总：')
  console.log('\n【文章】')
  for (const a of articles) console.log(`  https://sgaindex.com/articles/${a.id}`)
  console.log('\n【教程】')
  for (const t of tutorials) console.log(`  https://sgaindex.com/tutorials/${t.id}`)
  console.log('\n【资讯】')
  for (const n of newsItems) console.log(`  https://sgaindex.com/news/${n.id}`)
}

main().catch(console.error)
