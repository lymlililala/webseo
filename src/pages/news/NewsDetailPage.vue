<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { type News } from '../../data/news'
import { newsAPI } from '../../services/supabase'
import Breadcrumb from '../../components/Breadcrumb.vue'
import RelatedContent from '../../components/RelatedContent.vue'
import PrevNextNav from '../../components/PrevNextNav.vue'
import { autolinkGlossary } from '../../utils/glossaryAutolink'
import { localePath } from '../../i18n/useLocale'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const newsItem = ref<News | null>(null)
const loading = ref(true)
const notFound = ref(false)

// 内链：相关推荐 + 上一篇/下一篇
const relatedNews = ref<News[]>([])
const prevNews = ref<News | null>(null)
const nextNews = ref<News | null>(null)

const breadcrumbItems = computed(() => [
  { name: t('detail.home'), to: localePath('/') },
  { name: t('detail.news'), to: localePath('/news') },
  { name: newsItem.value?.title || '' },
])

async function loadInternalLinks(current: News) {
  const selfKey = (current as any).slug || current.id
  try {
    const sameCat = await newsAPI.getByCategory(current.category)
    relatedNews.value = (sameCat || [])
      .filter((n: any) => (n.slug || n.id) !== selfKey)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)

    const all = await newsAPI.getAll()
    const sorted = (all || [])
      .slice()
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const idx = sorted.findIndex((n: any) => (n.slug || n.id) === selfKey)
    if (idx !== -1) {
      prevNews.value = idx > 0 ? sorted[idx - 1] : null
      nextNews.value = idx < sorted.length - 1 ? sorted[idx + 1] : null
    }
  } catch (e) {
    console.error('加载相关资讯失败', e)
  }
}

marked.use({
  renderer: {
    link({ href, title, text }) {
      const isExternal = href && href.startsWith('http')
      const titleAttr = title ? ` title="${title}"` : ''
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${titleAttr}${target}>${text}</a>`
    },
  },
})

const renderedContent = computed(() => {
  if (!newsItem.value?.content) return ''
  return autolinkGlossary(marked(newsItem.value.content) as string)
})

// 正文内自动内链(术语链接)用事件委托走 SPA 路由，避免整页刷新
function onContentClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a.glossary-autolink') as HTMLAnchorElement | null
  if (!a) return
  const href = a.getAttribute('href') || ''
  if (href.startsWith('/')) {
    e.preventDefault()
    router.push(href)
  }
}

onMounted(async () => {
  const slug = route.params.id as string
  try {
    const data = await newsAPI.getBySlug(slug)
    newsItem.value = data ?? null
    if (newsItem.value) loadInternalLinks(newsItem.value)
  } catch (e) {
    console.error('加载新闻失败', e)
  } finally {
    loading.value = false
    if (!newsItem.value) notFound.value = true
  }
})

const categoryMeta: Record<string, { label: string; color: string }> = {
  seo: { label: 'SEO', color: '#3B82F6' },
  geo: { label: 'GEO', color: '#10B981' },
  aeo: { label: 'AEO', color: '#EC4899' },
  ai: { label: 'AI', color: '#8B5CF6' },
  industry: { label: t('articlesPage.catTools'), color: '#F59E0B' },
}

// 数据加载后动态更新 SEO
watch(newsItem, (n) => {
  if (!n) return
  const canonicalUrl = `https://sgaindex.com/news/${n.slug || n.id}`
  const fullTitle = `${n.title} | SGAIndex资讯`
  document.title = fullTitle
  const setMeta = (name: string, content: string, attr = 'name') => {
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      el.setAttribute('data-seo', 'true')
      document.head.appendChild(el)
    }
    el.content = content
  }
  const setLink = (rel: string, href: string, id?: string) => {
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
  setMeta('description', n.description)
  setMeta('robots', 'index, follow')
  setLink('canonical', canonicalUrl, 'canonical-link')
  setMeta('og:type', 'article', 'property')
  setMeta('og:title', fullTitle, 'property')
  setMeta('og:description', n.description, 'property')
  setMeta('og:url', canonicalUrl, 'property')
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', n.description)
  document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]').forEach((el) => el.remove())
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo', 'true')
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title,
    description: n.description,
    datePublished: n.date,
    url: canonicalUrl,
    publisher: { '@type': 'Organization', name: 'SGAIndex', url: 'https://sgaindex.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  })
  document.head.appendChild(script)
})

const impactMeta: Record<string, { label: string; color: string }> = {
  high: { label: t('newsPage.impactHigh'), color: '#EF4444' },
  medium: { label: t('newsPage.impactMedium'), color: '#F59E0B' },
  low: { label: t('newsPage.impactLow'), color: '#10B981' },
}
</script>

<template>
  <div class="news-detail-page">
    <div v-if="loading" class="state-center">
      <VaIcon name="hourglass_empty" size="56px" color="secondary" />
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="notFound" class="state-center">
      <VaIcon name="search_off" size="56px" color="secondary" />
      <p>{{ t('detail.notFoundNews') }}</p>
      <VaButton preset="secondary" @click="router.push(localePath('/news'))">{{ t('detail.backToNews') }}</VaButton>
    </div>

    <template v-else-if="newsItem">
      <!-- Hero -->
      <div class="hero-section">
        <div class="hero-content">
          <button class="back-btn" @click="router.push(localePath('/news'))">
            <VaIcon name="arrow_back" size="16px" />
            {{ t('detail.backToNews') }}
          </button>

          <div class="badges">
            <span
              class="category-badge"
              :style="{
                background: `${categoryMeta[newsItem.category]?.color}22`,
                borderColor: `${categoryMeta[newsItem.category]?.color}55`,
                color: categoryMeta[newsItem.category]?.color,
              }"
            >
              {{ categoryMeta[newsItem.category]?.label }}
            </span>
            <span
              class="impact-badge"
              :style="{
                background: `${impactMeta[newsItem.impact]?.color}22`,
                borderColor: `${impactMeta[newsItem.impact]?.color}55`,
                color: impactMeta[newsItem.impact]?.color,
              }"
            >
              {{ impactMeta[newsItem.impact]?.label }}
            </span>
          </div>

          <h1 class="news-title">{{ newsItem.title }}</h1>
          <p class="news-desc">{{ newsItem.description }}</p>

          <div class="news-meta">
            <span class="meta-item">
              <VaIcon name="source" size="14px" />
              {{ newsItem.source }}
            </span>
            <span class="meta-divider">·</span>
            <span class="meta-item">
              <VaIcon name="calendar_today" size="14px" />
              {{ new Date(newsItem.date).toLocaleDateString() }}
            </span>
          </div>

          <div class="news-tags">
            <span v-for="tag in newsItem.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 正文 -->
      <div class="content-wrapper">
        <Breadcrumb :items="breadcrumbItems" class="detail-breadcrumb" />

        <article class="news-body">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="markdown-body" v-html="renderedContent" @click="onContentClick" />
        </article>

        <!-- 相关推荐 + 上一篇/下一篇 -->
        <RelatedContent :items="relatedNews" type="news" :title="t('detail.relatedNews')" />
        <PrevNextNav type="news" :prev="prevNews" :next="nextNews" />

        <div class="news-footer">
          <VaButton preset="secondary" @click="router.push(localePath('/news'))">
            <VaIcon name="arrow_back" size="16px" />
            {{ t('detail.backToNews') }}
          </VaButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.state-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: var(--va-text-secondary);
}

.hero-section {
  background: linear-gradient(135deg, #0f1b2d 0%, #1a2f4a 50%, #0f2035 100%);
  padding: 2.4rem 2rem 2rem;
  margin: -1rem -1rem 0 -1rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 1.2rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category-badge,
.impact-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 500;
}

.news-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.8rem;
  line-height: 1.3;
}

.news-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1.2rem;
  line-height: 1.6;
}

.news-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

.meta-divider {
  color: rgba(255, 255, 255, 0.25);
  font-size: 13px;
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.content-wrapper {
  max-width: 820px;
  margin: 0 auto;
  padding: 2.4rem 1.5rem 3rem;
  width: 100%;
  box-sizing: border-box;
}

.detail-breadcrumb {
  margin-bottom: 1.2rem;
}

.news-body {
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 16px;
  padding: 2.4rem 2.8rem;
}

.markdown-body {
  font-size: 15px;
  line-height: 1.8;
  color: var(--va-text-primary);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-weight: 700;
  margin: 1.8rem 0 0.8rem;
  color: var(--va-text-primary);
  line-height: 1.3;
}

.markdown-body :deep(h1) {
  font-size: 1.6rem;
}
.markdown-body :deep(h2) {
  font-size: 1.3rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--va-background-border);
}
.markdown-body :deep(h3) {
  font-size: 1.1rem;
}

.markdown-body :deep(p) {
  margin: 0.8rem 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.6rem;
  margin: 0.8rem 0;
}

.markdown-body :deep(li) {
  margin: 0.4rem 0;
}

.markdown-body :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.8rem 1.2rem;
  border-left: 4px solid #10b981;
  background: rgba(16, 185, 129, 0.06);
  border-radius: 0 8px 8px 0;
  color: var(--va-text-secondary);
}

.markdown-body :deep(code) {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}

.markdown-body :deep(pre) {
  background: #1e2130;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-body :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 0.9em;
  color: #e2e8f0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 14px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 8px 14px;
  border: 1px solid var(--va-background-border);
  text-align: left;
}

.markdown-body :deep(th) {
  background: rgba(16, 185, 129, 0.08);
  font-weight: 600;
}

.markdown-body :deep(tr:nth-child(even) td) {
  background: rgba(0, 0, 0, 0.02);
}

.markdown-body :deep(a) {
  color: #10b981;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(a.glossary-autolink) {
  border-bottom: 1px dashed rgba(16, 185, 129, 0.5);
}
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--va-background-border);
  margin: 1.6rem 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
}

.markdown-body :deep(strong) {
  font-weight: 700;
  color: var(--va-text-primary);
}

.news-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--va-background-border);
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .news-title {
    font-size: 1.4rem;
  }
  .news-body {
    padding: 1.4rem 1.2rem;
  }
  .content-wrapper {
    padding: 1.4rem 0.8rem 2rem;
  }
}
</style>
