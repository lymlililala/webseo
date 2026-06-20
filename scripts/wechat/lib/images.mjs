// 配图 —— 按关键词搜图（热链 CDN），含相关性校验 + 关键词降级 + 缓存 + 宽松回退。
// 主力 Pexels（覆盖广、配额大），未命中回退 Unsplash。两家都搜不到才返回 null。
// SEO/数字营销主题：配图偏抽象（仪表盘/图表/办公/数据/AI），故严格命中优先、
// 全 miss 时宽松接受第一张未用的搜索结果（搜的就是 SEO 词，主题大致相关）。

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { loadEnv, DATA_DIR } from './env.mjs'

const CACHE_FILE = join(DATA_DIR, 'image-cache.json')

// 英文停用词：相关性校验时忽略，只看实义词是否命中。
const STOPWORDS = new Set(['the', 'a', 'an', 'of', 'in', 'at', 'on', 'and', 'to', 'for', 'with',
  'view', 'photo', 'image', 'concept', 'conceptual', 'abstract', 'background', 'modern', 'business',
  'closeup', 'close', 'up', 'top', 'flat', 'lay', 'screen', 'using', 'work', 'working', 'office',
  'person', 'people', 'man', 'woman', 'hand', 'hands', 'laptop', 'computer', 'desk', 'table'])

function loadCache() {
  if (!existsSync(CACHE_FILE)) return {}
  try { return JSON.parse(readFileSync(CACHE_FILE, 'utf8')) } catch { return {} }
}
function saveCache(c) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(CACHE_FILE, JSON.stringify(c, null, 2))
}

function terms(s) {
  return (s || '').toLowerCase().match(/[a-z]{3,}/g)?.filter(w => !STOPWORDS.has(w)) || []
}

/** 相关性：查询里的实义词，至少有一个出现在结果描述里，才算真命中 */
function isRelevant(query, desc) {
  const qt = terms(query)
  if (!qt.length) return false
  const dt = new Set(terms(desc))
  return qt.some(w => dt.has(w))
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ── 各图源适配器：search(query) → [{ url, desc, credit?, downloadLocation? }] ──

class PexelsSource {
  constructor(key) { this.key = key; this.name = 'pexels' }
  async search(query) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`
    const res = await fetch(url, { headers: { Authorization: this.key } })
    if (res.status === 429) throw { rateLimited: true }
    if (!res.ok) return []
    const json = await res.json()
    return (json.photos || []).map(p => ({
      url: p.src?.large || p.src?.original,
      desc: p.alt || '',
      credit: p.photographer || ''
    })).filter(p => p.url)
  }
}

class UnsplashSource {
  constructor(key) { this.key = key; this.name = 'unsplash' }
  async search(query) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${this.key}` } })
    if (res.status === 403 || res.status === 429) throw { rateLimited: true }
    if (!res.ok) return []
    const json = await res.json()
    return (json.results || []).map(p => {
      const base = p.urls?.raw || p.urls?.regular || ''
      const url = base ? `${base}${base.includes('?') ? '&' : '?'}w=1200&q=85&fit=crop` : ''
      return {
        url,
        desc: p.description || p.alt_description || '',
        credit: p.user?.name || '',
        downloadLocation: p.links?.download_location || ''
      }
    }).filter(p => p.url)
  }
}

/**
 * 统一配图客户端：Pexels 优先 → Unsplash 回退。
 * find(keyword, alt) → { url, source, credit } | null
 */
export class ImageFinder {
  constructor(opts = {}) {
    loadEnv()
    const pk = opts.pexelsKey || process.env.PEXELS_API_KEY
    const uk = opts.unsplashKey || process.env.UNSPLASH_ACCESS_KEY
    this.sources = []
    if (pk) this.sources.push(new PexelsSource(pk))
    if (uk) this.sources.push(new UnsplashSource(uk))
    this.enabled = this.sources.length > 0
    this.unsplashKey = uk || null
    this.cache = loadCache()
    this.used = new Set()
    this.disabled = new Set()
    this.stats = { pexels: 0, unsplash: 0, loose: 0, miss: 0, calls: 0 }
  }

  async _search(source, query) {
    const ck = `${source.name}:${query}`
    if (this.cache[ck]) return this.cache[ck]
    let photos = []
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        this.stats.calls++
        photos = await source.search(query)
        break
      } catch (e) {
        if (e && e.rateLimited) { this.disabled.add(source.name); return [] }
        await sleep(700 * (attempt + 1))
      }
    }
    this.cache[ck] = photos
    saveCache(this.cache)
    return photos
  }

  async _pingDownload(loc) {
    if (!loc || !this.unsplashKey) return
    try { await fetch(`${loc}&client_id=${this.unsplashKey}`) } catch { /* 忽略 */ }
  }

  _take(pick, sourceName, loose = false) {
    this.used.add(pick.url)
    this.stats[loose ? 'loose' : sourceName] = (this.stats[loose ? 'loose' : sourceName] || 0) + 1
    return { url: pick.url, source: sourceName, credit: pick.credit }
  }

  /**
   * @param {string} keyword  IMG: 后的关键词（如 "SEO analytics dashboard"）
   * @param {string} [alt]    合成产出的 alt，用于降级查询与相关性判断
   * @returns {Promise<{url,source,credit}|null>}
   */
  async find(keyword, alt = '') {
    if (!this.enabled) return null
    const kw = (keyword || '').trim()
    const core = terms(kw).slice(0, 2).join(' ')
    const altCore = terms(alt).slice(0, 2).join(' ')
    const queries = [...new Set([kw, core, altCore].filter(q => q && q.length >= 3))]

    let looseCandidate = null  // 严格全 miss 时的兜底（第一张未用的搜索结果）
    for (const source of this.sources) {
      if (this.disabled.has(source.name)) continue
      for (const q of queries) {
        const photos = await this._search(source, q)
        const fresh = photos.filter(p => !this.used.has(p.url))
        // 严格命中优先
        const strict = fresh.find(p => isRelevant(kw, p.desc))
        if (strict) {
          if (source.name === 'unsplash') await this._pingDownload(strict.downloadLocation)
          return this._take(strict, source.name)
        }
        // 记录第一个 loose 候选（按源优先级，Pexels 先）
        if (!looseCandidate && fresh.length) looseCandidate = { pick: fresh[0], source: source.name }
      }
    }
    if (looseCandidate) {
      if (looseCandidate.source === 'unsplash') await this._pingDownload(looseCandidate.pick.downloadLocation)
      return this._take(looseCandidate.pick, looseCandidate.source, true)
    }
    this.stats.miss++
    return null
  }
}

export default ImageFinder
