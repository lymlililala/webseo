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

export const news: News[] = []
