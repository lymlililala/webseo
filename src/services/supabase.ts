import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const SUPABASE_CONFIGURED = !!(supabaseUrl && supabaseAnonKey)

// ============================================================================
// 内存缓存：同一 session 内避免重复拉取相同数据（TTL 5 分钟）
// ============================================================================
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  ts: number
}

const memCache = new Map<string, CacheEntry<any>>()

function getCached<T>(key: string): T | null {
  const entry = memCache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL) {
    return entry.data as T
  }
  return null
}

function setCache<T>(key: string, data: T): void {
  memCache.set(key, { data, ts: Date.now() })
}

export function clearCache(key?: string): void {
  if (key) {
    memCache.delete(key)
  } else {
    memCache.clear()
  }
}

if (!SUPABASE_CONFIGURED) {
  console.warn('⚠️ Supabase credentials not configured. Pages will use local data fallback.')
}

// 使用占位符避免 createClient 在环境变量缺失时直接抛出异常导致页面崩溃
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
)

export { SUPABASE_CONFIGURED }

// ============================================================================
// ARTICLES API
// ============================================================================
export const articlesAPI = {
  async getAll() {
    const cacheKey = 'articles:all'
    const cached = getCached<any[]>(cacheKey)
    if (cached) return cached

    const { data, error } = await supabase.from('wseo_articles').select('*').order('date', { ascending: false })

    if (error) throw error
    if (data) setCache(cacheKey, data)
    return data
  },

  async getById(id: string) {
    const cacheKey = `articles:${id}`
    const cached = getCached<any>(cacheKey)
    if (cached) return cached

    const { data, error } = await supabase.from('wseo_articles').select('*').eq('id', id).single()

    if (error) throw error
    if (data) setCache(cacheKey, data)
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('wseo_articles')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('wseo_articles')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async create(article: any) {
    const { data, error } = await supabase.from('wseo_articles').insert([article]).select()

    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('wseo_articles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from('wseo_articles').delete().eq('id', id)

    if (error) throw error
  },
}

// ============================================================================
// TUTORIALS API
// ============================================================================
export const tutorialsAPI = {
  async getAll() {
    const cacheKey = 'tutorials:all'
    const cached = getCached<any[]>(cacheKey)
    if (cached) return cached

    // 1. 查询所有教程
    const { data: tutorials, error } = await supabase
      .from('wseo_tutorials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!tutorials || tutorials.length === 0) return []

    // 2. 查询所有 lessons（仅 id + tutorial_id 用于计数）
    const { data: allLessons } = await supabase
      .from('wseo_tutorial_lessons')
      .select('id, tutorial_id, lesson_number, title, description, level, duration')
      .order('lesson_number', { ascending: true })

    // 3. 将 lessons 按 tutorial_id 分组后合并
    const lessonMap: Record<string, any[]> = {}
    for (const l of allLessons || []) {
      if (!lessonMap[l.tutorial_id]) lessonMap[l.tutorial_id] = []
      lessonMap[l.tutorial_id].push({ ...l, number: l.lesson_number })
    }

    const result = tutorials.map((t: any) => ({
      ...t,
      lessons: lessonMap[t.id] || [],
    }))
    setCache(cacheKey, result)
    return result
  },

  async getById(id: string) {
    const cacheKey = `tutorials:${id}`
    const cached = getCached<any>(cacheKey)
    if (cached) return cached

    const { data: tutorial, error: tutorialError } = await supabase
      .from('wseo_tutorials')
      .select('*')
      .eq('id', id)
      .single()

    if (tutorialError) throw tutorialError

    const { data: lessons, error: lessonsError } = await supabase
      .from('wseo_tutorial_lessons')
      .select('*')
      .eq('tutorial_id', id)
      .order('lesson_number', { ascending: true })

    if (lessonsError) throw lessonsError

    // 将数据库字段 lesson_number 映射为前端接口字段 number
    const mappedLessons = (lessons || []).map((l: any) => ({
      ...l,
      number: l.lesson_number,
    }))

    const tutorialResult = { ...tutorial, lessons: mappedLessons }
    setCache(cacheKey, tutorialResult)
    return tutorialResult
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('wseo_tutorials')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByDifficulty(difficulty: string) {
    const { data, error } = await supabase
      .from('wseo_tutorials')
      .select('*')
      .eq('difficulty', difficulty)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(tutorial: any) {
    const { data, error } = await supabase.from('wseo_tutorials').insert([tutorial]).select()

    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('wseo_tutorials')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from('wseo_tutorials').delete().eq('id', id)

    if (error) throw error
  },
}

// ============================================================================
// LESSONS API
// ============================================================================
export const lessonsAPI = {
  async getByTutorial(tutorialId: string) {
    const { data, error } = await supabase
      .from('wseo_tutorial_lessons')
      .select('*')
      .eq('tutorial_id', tutorialId)
      .order('lesson_number', { ascending: true })

    if (error) throw error
    return data
  },

  async create(lesson: any) {
    const { data, error } = await supabase.from('wseo_tutorial_lessons').insert([lesson]).select()

    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase.from('wseo_tutorial_lessons').update(updates).eq('id', id).select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from('wseo_tutorial_lessons').delete().eq('id', id)

    if (error) throw error
  },
}

// ============================================================================
// NEWS API
// ============================================================================
export const newsAPI = {
  async getAll() {
    const cacheKey = 'news:all'
    const cached = getCached<any[]>(cacheKey)
    if (cached) return cached

    const { data, error } = await supabase.from('wseo_news').select('*').order('date', { ascending: false })

    if (error) throw error
    if (data) setCache(cacheKey, data)
    return data
  },

  async getById(id: string) {
    const cacheKey = `news:${id}`
    const cached = getCached<any>(cacheKey)
    if (cached) return cached

    const { data, error } = await supabase.from('wseo_news').select('*').eq('id', id).single()

    if (error) throw error
    if (data) setCache(cacheKey, data)
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('wseo_news')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getByImpact(impact: string) {
    const { data, error } = await supabase
      .from('wseo_news')
      .select('*')
      .eq('impact', impact)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('wseo_news')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async create(newsItem: any) {
    const { data, error } = await supabase.from('wseo_news').insert([newsItem]).select()

    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('wseo_news')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from('wseo_news').delete().eq('id', id)

    if (error) throw error
  },
}

// ============================================================================
// SEO TOOLS API
// ============================================================================
export const seoToolsAPI = {
  async getAll() {
    const { data, error } = await supabase.from('wseo_seo_tools').select('*').order('rating', { ascending: false })

    if (error) throw error
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase.from('wseo_seo_tools').select('*').eq('category', category)

    if (error) throw error
    return data
  },

  async getByPrice(price: string) {
    const { data, error } = await supabase.from('wseo_seo_tools').select('*').eq('price', price)

    if (error) throw error
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('wseo_seo_tools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (error) throw error
    return data
  },
}

// ============================================================================
// GEO TOOLS API
// ============================================================================
export const geoToolsAPI = {
  async getAll() {
    const { data, error } = await supabase.from('wseo_geo_tools').select('*').order('rating', { ascending: false })

    if (error) throw error
    return data
  },

  async getByRegion(region: string) {
    const { data, error } = await supabase.from('wseo_geo_tools').select('*').eq('region', region)

    if (error) throw error
    return data
  },

  async getByPrice(price: string) {
    const { data, error } = await supabase.from('wseo_geo_tools').select('*').eq('price', price)

    if (error) throw error
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('wseo_geo_tools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (error) throw error
    return data
  },
}

// ============================================================================
// AEO TOOLS API
// ============================================================================
export const aeoToolsAPI = {
  async getAll() {
    const { data, error } = await supabase.from('wseo_aeo_tools').select('*').order('rating', { ascending: false })

    if (error) throw error
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase.from('wseo_aeo_tools').select('*').eq('category', category)

    if (error) throw error
    return data
  },

  async getByPrice(price: string) {
    const { data, error } = await supabase.from('wseo_aeo_tools').select('*').eq('price', price)

    if (error) throw error
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('wseo_aeo_tools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (error) throw error
    return data
  },
}

// ============================================================================
// SCHEMA TOOLS API
// ============================================================================
export const schemaToolsAPI = {
  async getAll() {
    const { data, error } = await supabase.from('wseo_schema_tools').select('*').order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('wseo_schema_tools').select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  async getByToolId(toolId: string) {
    const { data, error } = await supabase.from('wseo_schema_tools').select('*').eq('tool_id', toolId).single()

    if (error) throw error
    return data
  },

  async getByLevel(level: string) {
    const { data, error } = await supabase
      .from('wseo_schema_tools')
      .select('*')
      .eq('level', level)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getFreeTools() {
    const { data, error } = await supabase
      .from('wseo_schema_tools')
      .select('*')
      .eq('is_free', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getOfficialTools() {
    const { data, error } = await supabase
      .from('wseo_schema_tools')
      .select('*')
      .eq('is_official', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getBySchemaType(schemaType: string) {
    const { data, error } = await supabase
      .from('wseo_schema_tools')
      .select('*')
      .contains('supported_types', JSON.stringify([schemaType]))

    if (error) throw error
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('wseo_schema_tools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (error) throw error
    return data
  },
}
