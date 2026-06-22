/**
 * schema-tools-zh.ts — Schema 标记工具页中文 override(按 id 映射)
 * 英文原数据见 schema-tools.ts;组件按当前语言回退。
 * 工具品牌名、Schema 类型名(Article/FAQ…)、字段属性名保留英文。
 */
export const schemaToolsZh: Record<string, string> = {
  merkle: '最受欢迎的免费 Schema 生成器——支持 20+ 类型,界面简洁、输出标准 JSON-LD,无需注册。',
  'google-rich-results': 'Google 官方富结果测试——在此校验你的 Schema,确保符合 Google 收录标准并有资格获得富结果。',
  'schema-org-validator': 'Schema.org 官方校验器——检查结构化数据是否完全符合 Schema.org 规范;合规性的最终判定。',
  'saijo-george': '极简、快速的 JSON-LD 生成器,界面清爽直观、无需注册,覆盖常见 Schema 类型——需要快速出代码时很合适。',
  'hall-analysis': '专注文章 Schema 的精准生成器,字段覆盖完整,支持 Article、BlogPosting、NewsArticle 等子类型。',
  whitespark: 'Whitespark 的 LocalBusiness Schema 生成器,面向本地商户,字段覆盖完整,含营业时间、服务区域与联系方式。',
  recipeschema: '面向菜谱站的 Recipe Schema 生成器,支持食材、步骤、烹饪时间、营养成分等全部菜谱相关字段。',
  'schema-app': '全自动的企业级 Schema 平台——AI 自动识别页面类型并生成结构化数据,支持大站批量部署与持续监测。',
  wordlift: 'AI 驱动的内容知识图谱与 Schema 自动标记平台,识别内容实体、生成结构化数据并构建站点知识图谱。',
  rankmath: '最受欢迎的 WordPress SEO 插件,内置 Schema 模块支持 20+ 类型,并按页面内容智能推荐类型——配置一次即可。',
  yoast: '老牌 WordPress SEO 插件,自动生成 Schema;与 RankMath 一样是 WordPress 站长的首选——稳定可靠。',
}

export const schemaTypesZh: Record<
  string,
  { description: string; fields: string[]; aeoTip?: string; internalLinkLabel?: string }
> = {
  article: {
    description: '面向文章、博客与新闻页的结构化标记。帮搜索引擎识别发布日期、作者与内容类型——内容站 SEO 的基础。',
    fields: [
      '文章标题(必填,建议 50–60 字符)',
      '作者信息,使用 Person 或 Organization 类型',
      '原始发布日期,ISO 8601 格式',
      '文章主图 URL,建议 1200×628px',
    ],
  },
  faq: {
    description: '面向 FAQ 页的结构化标记——在 Google 结果中展示可展开的问答,也是 AI 引擎(ChatGPT、Perplexity)最直接引用的格式。',
    aeoTip: 'FAQ Schema 是最有效的 AEO 手段之一——问答格式完美契合 AI 搜索的"直接回答"需求,大幅提升被引用概率。',
    internalLinkLabel: '查看 AEO 优化工具 →',
    fields: [
      '问答项数组,每项含一个 Question 与 Answer',
      '问题文本(Question.name)——使用真实用户问题',
      '答案文本,纯文本,建议 50–300 字符',
    ],
  },
  product: {
    description: '面向商品页的结构化标记——在结果中展示价格、评分与库存,提升电商点击率。',
    fields: ['商品名称(必填)', '价格与库存信息,使用 Offer 类型', '商品图片 URL', '评分数据,需有真实评价支撑'],
  },
  breadcrumb: {
    description: '面向面包屑导航的结构化标记——在结果中展示清晰的页面层级路径,提升定位与点击率。',
    fields: ['面包屑层级数组,按顺序排列', '位置序号,从 1 开始', '该层级的页面名称', '该层级的页面 URL'],
  },
  howto: {
    description: '面向教程与操作类内容的结构化标记——在结果中展示步骤列表,适合"如何做某事"的内容,并有资格获得特殊富结果。',
    fields: [
      '教程标题(必填)',
      'HowToStep 数组,每步含 position、name 与 text',
      '预计总时长,ISO 8601 时长(如 PT30M = 30 分钟)',
    ],
  },
  localbusiness: {
    description: '面向本地商户信息的结构化标记——展示地址、电话、营业时间与评分;影响 Google 地图与本地结果的核心本地 SEO 配置。',
    fields: ['商户名称(必填)', '完整地址,使用 PostalAddress 类型', '联系电话', '营业时间,影响 Google 本地展示面板'],
  },
  video: {
    description: '面向视频内容的结构化标记——在 Google 结果中展示缩略图、时长与上传日期;适合有视频的媒体与教育类站点。',
    fields: [
      '视频标题(必填)',
      '缩略图 URL(必填),建议 1280×720px',
      '上传日期,ISO 8601 格式(必填)',
      '视频时长,ISO 8601 时长格式',
    ],
  },
  recipe: {
    description: '面向菜谱的结构化标记——在结果中展示烹饪时间、热量与评分;美食博客与菜谱站的必备 Schema。',
    fields: ['菜谱名称(必填)', '菜品图片(必填,影响富结果展示)', '食材列表数组', '烹饪步骤,使用 HowToStep 数组'],
  },
}

// badge / highlight / pricing 短标签字典(不在表内回退原文)
export const schemaLabelsZh: Record<string, string> = {
  // badges
  'Top Pick': '全能首选',
  'Official Essential': '官方必备',
  Authoritative: '权威',
  'Local SEO Pick': '本地 SEO 之选',
  'Fully Automated': '全自动',
  'WordPress Pick': 'WordPress 之选',
  // pricing
  'From $99/mo': '$99/月起',
  'From $49/mo': '$49/月起',
  'Free + Pro $59/yr': '免费 + Pro $59/年',
  'Free + Premium €99/yr': '免费 + Premium €99/年',
  // highlights
  'Free, No Signup': '免费免注册',
  '20+ Schema Types': '20+ 种 Schema 类型',
  'Instant JSON-LD': '即时 JSON-LD',
  'Google Official': 'Google 官方',
  'Validates Rich Results': '校验富结果',
  'Live Preview': '实时预览',
  'Schema.org Official': 'Schema.org 官方',
  'Authoritative Compliance Check': '权威合规检查',
  'All Types Supported': '支持全部类型',
  'Minimal & Fast': '极简快速',
  'No Signup': '免注册',
  'Intuitive UI': '界面直观',
  'Article-Focused': '专注文章',
  'Subtype Support': '支持子类型',
  'Complete Fields': '字段完整',
  'Local-Business Focused': '专注本地商户',
  'Opening Hours': '营业时间',
  'Local SEO Essential': '本地 SEO 必备',
  'Recipe-Specific': '专注菜谱',
  'Nutrition Info': '营养信息',
  'Structured Steps': '结构化步骤',
  'AI Auto-Detection': 'AI 自动识别',
  'Enterprise Management': '企业级管理',
  'Bulk Deploy & Monitor': '批量部署与监测',
  'AI Entity Detection': 'AI 实体识别',
  'Knowledge-Graph Building': '知识图谱构建',
  'Content Semantics': '内容语义',
  'WordPress-Specific': '专为 WordPress',
  'Smart Type Recommendation': '智能类型推荐',
  'Set Once': '配置一次',
  'WordPress Veteran': 'WordPress 老牌',
  'Stable & Reliable': '稳定可靠',
  'Auto-Generation': '自动生成',
}
