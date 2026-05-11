// SEO/GEO/AEO 教程数据

export interface Lesson {
  id: string
  number: number
  title: string
  description: string
  duration: number // 分钟
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface Tutorial {
  id: string
  title: string
  description: string
  category: 'seo' | 'geo' | 'aeo'
  instructor: string
  lessons: Lesson[]
  duration: number // 总分钟数
  students: number
  rating: number // 1-5
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  image?: string
  link?: string
}

export const tutorials: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'SEO 基础入门：从 0 到 1',
    description: '适合完全入门者的 SEO 课程，涵盖关键词研究、页面优化、链接建设等核心概念。',
    category: 'seo',
    instructor: '张三',
    difficulty: 'beginner',
    duration: 240,
    students: 5230,
    rating: 4.8,
    lessons: [
      { id: 'l1', number: 1, title: '什么是 SEO？搜索引擎工作原理', description: '', duration: 18, level: 'beginner' },
      { id: 'l2', number: 2, title: '关键词研究完全指南', description: '', duration: 32, level: 'beginner' },
      { id: 'l3', number: 3, title: '页面 SEO 优化：Title、Meta 等', description: '', duration: 25, level: 'beginner' },
      {
        id: 'l4',
        number: 4,
        title: '技术 SEO：网站结构与速度优化',
        description: '',
        duration: 40,
        level: 'intermediate',
      },
      { id: 'l5', number: 5, title: '反向链接建设策略', description: '', duration: 35, level: 'intermediate' },
      { id: 'l6', number: 6, title: '内容优化与 E-E-A-T', description: '', duration: 28, level: 'intermediate' },
      { id: 'l7', number: 7, title: '持续监测与数据分析', description: '', duration: 22, level: 'beginner' },
    ],
    tags: ['SEO基础', '关键词', '页面优化', '技术SEO'],
  },
  {
    id: 'tut-2',
    title: 'GEO 生成式引擎优化实战课程',
    description: '学习如何针对 ChatGPT、Perplexity、Google AI Overview 等生成式引擎进行网站优化。',
    category: 'geo',
    instructor: '李四',
    difficulty: 'intermediate',
    duration: 180,
    students: 2840,
    rating: 4.9,
    lessons: [
      { id: 'l1', number: 1, title: 'GEO 概论与核心差异', description: '', duration: 20, level: 'beginner' },
      {
        id: 'l2',
        number: 2,
        title: '权威性构建：反向链接与品牌',
        description: '',
        duration: 28,
        level: 'intermediate',
      },
      { id: 'l3', number: 3, title: '结构化数据深度应用', description: '', duration: 32, level: 'intermediate' },
      { id: 'l4', number: 4, title: '品牌可见度监测工具实操', description: '', duration: 25, level: 'intermediate' },
      { id: 'l5', number: 5, title: 'AI 引擎适配内容创作', description: '', duration: 35, level: 'intermediate' },
      { id: 'l6', number: 6, title: '案例分析：如何提升 AI 引用率', description: '', duration: 40, level: 'advanced' },
    ],
    tags: ['GEO', 'AI搜索', '品牌可见度', '结构化数据'],
  },
  {
    id: 'tut-3',
    title: 'AEO 答案引擎优化与对话 AI',
    description: '掌握 AEO 核心技能，让你的内容在 AI 对话中更容易被引用和提及。',
    category: 'aeo',
    instructor: '王五',
    difficulty: 'advanced',
    duration: 195,
    students: 1920,
    rating: 4.7,
    lessons: [
      { id: 'l1', number: 1, title: 'AEO 基础概念与应用场景', description: '', duration: 22, level: 'beginner' },
      { id: 'l2', number: 2, title: 'FAQ Schema 与 QAPage 标记', description: '', duration: 28, level: 'intermediate' },
      {
        id: 'l3',
        number: 3,
        title: 'Speakable 标记与语音友好内容',
        description: '',
        duration: 25,
        level: 'intermediate',
      },
      { id: 'l4', number: 4, title: '对话式内容设计', description: '', duration: 30, level: 'intermediate' },
      { id: 'l5', number: 5, title: 'llms.txt 文件配置与优化', description: '', duration: 32, level: 'intermediate' },
      { id: 'l6', number: 6, title: '监测 AI 对话中的品牌提及', description: '', duration: 28, level: 'advanced' },
      { id: 'l7', number: 7, title: '实战项目：完整 AEO 优化方案', description: '', duration: 30, level: 'advanced' },
    ],
    tags: ['AEO', '对话AI', '结构化数据', 'llms.txt'],
  },
  {
    id: 'tut-4',
    title: '高级 SEO：数据分析与实验驱动优化',
    description: '深入学习如何用数据和 A/B 测试驱动 SEO 决策，适合有 SEO 基础的从业者。',
    category: 'seo',
    instructor: '赵六',
    difficulty: 'advanced',
    duration: 220,
    students: 1560,
    rating: 4.9,
    lessons: [
      { id: 'l1', number: 1, title: 'Google Analytics 4 与数据采集', description: '', duration: 35, level: 'advanced' },
      { id: 'l2', number: 2, title: '搜索意图分析与内容差距', description: '', duration: 40, level: 'advanced' },
      { id: 'l3', number: 3, title: 'A/B 测试与排名因素验证', description: '', duration: 38, level: 'advanced' },
      { id: 'l4', number: 4, title: '竞争对手分析深度指南', description: '', duration: 32, level: 'advanced' },
      { id: 'l5', number: 5, title: '构建 SEO 指标体系与 KPI', description: '', duration: 28, level: 'advanced' },
      { id: 'l6', number: 6, title: '大型网站 SEO 策略与执行', description: '', duration: 47, level: 'advanced' },
    ],
    tags: ['高级SEO', '数据分析', 'GA4', '实验驱动'],
  },
]
