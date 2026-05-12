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

export const tutorials: Tutorial[] = []
