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

export const articles: Article[] = []
