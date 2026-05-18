/**
 * usePageSeo — 零依赖的页面级 SEO head 管理
 * 设置 title、meta description、canonical、Open Graph、Twitter Card、JSON-LD
 */
import { onMounted, onUnmounted, watchEffect, type Ref } from 'vue'

const BASE_URL = 'https://sgaindex.com'
const SITE_NAME = 'SGAIndex'
const DEFAULT_IMAGE = `${BASE_URL}/og-default.png`

export interface SeoOptions {
  title: string
  description: string
  /** 页面路径，例如 /seo-nav，自动拼接 BASE_URL */
  path: string
  /** Open Graph 图片，默认用 DEFAULT_IMAGE */
  image?: string
  /** JSON-LD 结构化数据对象数组 */
  jsonLd?: Record<string, unknown>[]
  /** 页面关键词 */
  keywords?: string
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string, id?: string) {
  const selector = id ? `link[id="${id}"]` : `link[rel="${rel}"]`
  let el = document.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (id) el.id = id
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  el.href = href
}

function removeJsonLdScripts() {
  document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]').forEach((el) => el.remove())
}

function injectJsonLd(schemas: Record<string, unknown>[]) {
  removeJsonLdScripts()
  schemas.forEach((schema) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', 'true')
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  })
}

function removeSeoTags() {
  document.querySelectorAll('[data-seo="true"]').forEach((el) => el.remove())
}

export function usePageSeo(options: SeoOptions | Ref<SeoOptions>) {
  const apply = (opts: SeoOptions) => {
    const { title, description, path, image = DEFAULT_IMAGE, jsonLd = [], keywords } = opts
    const canonicalUrl = `${BASE_URL}${path}`
    const fullTitle = `${title} | ${SITE_NAME}`

    // Title
    document.title = fullTitle

    // Basic meta
    setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)
    setMeta('robots', 'index, follow')

    // Canonical
    setLink('canonical', canonicalUrl, 'canonical-link')

    // Open Graph
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:locale', 'zh_CN', 'property')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    // JSON-LD
    const baseWebSiteSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
      description: 'AI时代的SEO与GEO工具导航平台，收录SEO、GEO、AEO、Schema结构化数据工具',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/seo-nav?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }
    injectJsonLd([baseWebSiteSchema, ...jsonLd])
  }

  onMounted(() => {
    const opts =
      typeof options === 'object' && 'value' in options ? (options as Ref<SeoOptions>).value : (options as SeoOptions)
    apply(opts)
  })

  // 支持响应式
  if (typeof options === 'object' && 'value' in options) {
    watchEffect(() => {
      apply((options as Ref<SeoOptions>).value)
    })
  }

  onUnmounted(() => {
    // 页面卸载时清理，防止标签堆积
    removeSeoTags()
    document.title = `${SITE_NAME} — SEO/GEO/AEO 工具导航`
  })
}
