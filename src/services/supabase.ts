import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Some features may not work.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// ARTICLES API
// ============================================================================
export const articlesAPI = {
  async getAll() {
    const { data, error } = await supabase.from('wseo_articles').select('*').order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('wseo_articles').select('*').eq('id', id).single()

    if (error) throw error
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
    const { data, error } = await supabase.from('wseo_tutorials').select('*').order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
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

    return { ...tutorial, lessons }
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
    const { data, error } = await supabase.from('wseo_news').select('*').order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('wseo_news').select('*').eq('id', id).single()

    if (error) throw error
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
