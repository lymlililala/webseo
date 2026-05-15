<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type News } from '../../data/news'
import { newsAPI } from '../../services/supabase'
import SkeletonLoader from '../../components/SkeletonLoader.vue'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref<'all' | 'seo' | 'geo' | 'aeo' | 'ai' | 'industry'>('all')
const selectedImpact = ref<'all' | 'high' | 'medium' | 'low'>('all')
const loading = ref(true)
const allNews = ref<News[]>([])
const currentPage = ref(1)
const pageSize = 12

onMounted(async () => {
  try {
    const data = await newsAPI.getAll()
    if (data && data.length > 0) {
      allNews.value = data as News[]
    }
  } catch (e) {
    console.error('加载新闻失败', e)
  } finally {
    loading.value = false
  }
})

const filteredNews = computed(() => {
  let result = allNews.value

  if (selectedCategory.value !== 'all') {
    result = result.filter((n) => n.category === selectedCategory.value)
  }

  if (selectedImpact.value !== 'all') {
    result = result.filter((n) => n.impact === selectedImpact.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (n) => n.title.toLowerCase().includes(q) || n.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }

  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 分页
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredNews.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredNews.value.length / pageSize))

// 筛选变化时重置到第一页
watch([searchQuery, selectedCategory, selectedImpact], () => {
  currentPage.value = 1
})

function goToPage(page: number) {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const impactLabel = {
  high: '高影响',
  medium: '中影响',
  low: '低影响',
}

function openNewsLink(link?: string) {
  if (link) {
    window.open(link, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <div class="news-page">
    <!-- Hero -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <VaIcon name="newspaper" size="16px" />
          <span>行业新闻</span>
        </div>
        <h1 class="hero-title">SEO/GEO/AEO 行业动态</h1>
        <p class="hero-subtitle">关注最新的搜索引擎算法更新和 AI 搜索发展趋势</p>

        <div class="search-wrapper">
          <VaInput v-model="searchQuery" placeholder="搜索新闻..." class="search-input" clearable>
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>
      </div>
    </div>

    <!-- Filters & News -->
    <div class="content-wrapper">
      <aside class="sidebar">
        <div class="filter-group">
          <h3>分类</h3>
          <button
            v-for="cat in [
              { id: 'all', label: '全部新闻' },
              { id: 'seo', label: 'SEO' },
              { id: 'geo', label: 'GEO' },
              { id: 'aeo', label: 'AEO' },
              { id: 'ai', label: 'AI' },
              { id: 'industry', label: '行业' },
            ]"
            :key="cat.id"
            class="filter-btn"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id as typeof selectedCategory"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="filter-group">
          <h3>影响程度</h3>
          <button
            v-for="impact in [
              { id: 'all', label: '全部' },
              { id: 'high', label: '高影响' },
              { id: 'medium', label: '中影响' },
              { id: 'low', label: '低影响' },
            ]"
            :key="impact.id"
            class="filter-btn"
            :class="{ active: selectedImpact === impact.id }"
            @click="selectedImpact = impact.id as typeof selectedImpact"
          >
            {{ impact.label }}
          </button>
        </div>
      </aside>

      <main class="main-content">
        <div v-if="loading" class="loading-state">
          <SkeletonLoader variant="list" :count="5" />
        </div>

        <div v-else-if="filteredNews.length === 0" class="empty-state">
          <VaIcon name="newspaper" size="56px" color="secondary" />
          <p>暂无匹配新闻</p>
        </div>

        <div v-else>
          <div class="news-list">
            <article
              v-for="item in paginatedNews"
              :key="item.id"
              class="news-item"
              @click="router.push({ name: 'news-detail', params: { id: item.id } })"
            >
              <div class="news-header">
                <div class="news-meta">
                  <span class="category-tag">{{ item.category.toUpperCase() }}</span>
                  <span class="date">{{ new Date(item.date).toLocaleDateString('zh-CN') }}</span>
                </div>
                <div class="impact-badge" :class="item.impact">
                  {{ impactLabel[item.impact] }}
                </div>
              </div>

              <h3 class="news-title">{{ item.title }}</h3>
              <p class="news-desc">{{ item.description }}</p>

              <div class="news-tags">
                <span v-for="tag in item.tags.slice(0, 4)" :key="tag" class="tag">{{ tag }}</span>
              </div>

              <div class="news-footer">
                <span class="source">
                  <VaIcon name="source" size="14px" />
                  {{ item.source }}
                </span>
                <VaButton
                  v-if="item.link"
                  preset="plain"
                  size="small"
                  border
                  class="read-more"
                  @click.stop="openNewsLink(item.link)"
                >
                  <VaIcon name="open_in_new" size="14px" />
                  阅读全文
                </VaButton>
                <span v-else class="no-link">暂无原文链接</span>
              </div>
            </article>
          </div>

          <!-- 分页器 -->
          <div v-if="totalPages > 1" class="pagination">
            <VaButton preset="secondary" size="small" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              <VaIcon name="arrow_back" size="16px" />
            </VaButton>
            <div class="page-info">
              第 {{ currentPage }} / {{ totalPages }} 页（共 {{ filteredNews.length }} 条新闻）
            </div>
            <VaButton
              preset="secondary"
              size="small"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <VaIcon name="arrow_forward" size="16px" />
            </VaButton>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.news-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  background: linear-gradient(135deg, #1a1f3c 0%, #2d3561 50%, #1a2744 100%);
  padding: 2.8rem 2rem 2.4rem;
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
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 1.2rem;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.8rem;
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1.6rem;
}

.search-wrapper {
  max-width: 520px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
}

.search-input :deep(input) {
  color: #fff !important;
}

.search-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

.search-input :deep(.va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.content-wrapper {
  flex: 1;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  flex-shrink: 0;
  width: 160px;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group h3 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--va-text-secondary);
  margin: 0 0 8px;
  opacity: 0.6;
}

.filter-btn {
  display: block;
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 4px;
  border: none;
  background: transparent;
  color: var(--va-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
  text-align: left;
}

.filter-btn:hover {
  background: var(--va-background-element);
}

.filter-btn.active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--va-primary);
  font-weight: 600;
}

.main-content {
  flex: 1;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  padding: 20px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
}

.news-item:hover {
  border-color: var(--va-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.category-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--va-primary);
  background: rgba(99, 102, 241, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
}

.date {
  color: var(--va-text-secondary);
}

.impact-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.impact-badge.high {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.impact-badge.medium {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.impact-badge.low {
  background: rgba(107, 114, 128, 0.12);
  color: #4b5563;
}

.news-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0 0 8px;
  line-height: 1.5;
}

.news-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0 0 12px;
  line-height: 1.6;
}

.news-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tag {
  display: inline-block;
  padding: 3px 8px;
  background: var(--va-background-element);
  color: var(--va-text-secondary);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--va-background-border);
  font-size: 12px;
}

.source {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--va-text-secondary);
}

.no-link {
  font-size: 12px;
  color: var(--va-text-secondary);
  opacity: 0.5;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading-state {
  padding: 2rem 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

/* ── Pagination ───────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding: 20px;
  background: var(--va-background-secondary);
  border-radius: 12px;
}

.page-info {
  font-size: 14px;
  color: var(--va-text-secondary);
  min-width: 180px;
  text-align: center;
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .filter-btn {
    display: inline-block;
    width: auto;
    margin-right: 8px;
  }

  .news-item {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.7rem;
  }

  .news-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
