<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { articles as localArticles, type Article } from '../../data/articles'
import { articlesAPI, SUPABASE_CONFIGURED } from '../../services/supabase'

const searchQuery = ref('')
const selectedCategory = ref<'all' | 'seo' | 'geo' | 'aeo' | 'tools'>('all')
const loading = ref(true)
const allArticles = ref<Article[]>([])

onMounted(async () => {
  if (!SUPABASE_CONFIGURED) {
    allArticles.value = localArticles
    loading.value = false
    return
  }
  try {
    const data = await articlesAPI.getAll()
    if (data && data.length > 0) {
      allArticles.value = data.map((item: any) => ({
        ...item,
        readTime: item.read_time ?? item.readTime ?? 5,
      }))
    } else {
      allArticles.value = localArticles
    }
  } catch {
    allArticles.value = localArticles
  } finally {
    loading.value = false
  }
})

const filteredArticles = computed(() => {
  let result = allArticles.value

  if (selectedCategory.value !== 'all') {
    result = result.filter((a) => a.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }

  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function openArticle(article: Article) {
  if (article.link) {
    window.open(article.link, '_blank', 'noopener,noreferrer')
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

const categories = [
  { id: 'all', name: '全部文章', icon: 'article', color: '#6366F1' },
  { id: 'seo', name: 'SEO', icon: 'travel_explore', color: '#3B82F6' },
  { id: 'geo', name: 'GEO', icon: 'auto_awesome', color: '#10B981' },
  { id: 'aeo', name: 'AEO', icon: 'question_answer', color: '#EC4899' },
  { id: 'tools', name: '工具相关', icon: 'build', color: '#F59E0B' },
] as const
</script>

<template>
  <div class="articles-page">
    <!-- ── Hero ─────────────────────────────── -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <VaIcon name="article" size="16px" />
          <span>技术文章</span>
        </div>
        <h1 class="hero-title">SEO/GEO/AEO 深度文章库</h1>
        <p class="hero-subtitle">最新的搜索优化洞察、行业趋势分析和实战指南，帮助您紧跟 AI 搜索变化</p>

        <div class="search-wrapper">
          <VaInput v-model="searchQuery" placeholder="搜索文章标题、标签..." class="search-input" clearable>
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>
      </div>
    </div>

    <!-- ── Main Content ────────────────────── -->
    <div class="content-wrapper">
      <!-- Sidebar Categories -->
      <aside class="articles-sidebar">
        <div class="sidebar-header">分类</div>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-btn"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          <VaIcon :name="cat.icon" size="16px" />
          <span>{{ cat.name }}</span>
          <span class="count">{{ allArticles.filter((a) => cat.id === 'all' || a.category === cat.id).length }}</span>
        </button>
      </aside>

      <!-- Articles Grid -->
      <main class="articles-main">
        <div v-if="loading" class="empty-state">
          <VaIcon name="hourglass_empty" size="56px" color="secondary" />
          <p>加载中...</p>
        </div>

        <div v-else-if="filteredArticles.length === 0" class="empty-state">
          <VaIcon name="search_off" size="56px" color="secondary" />
          <p>没有找到匹配的文章</p>
          <VaButton preset="secondary" size="small" @click="clearFilters"> 清除筛选 </VaButton>
        </div>

        <div v-else class="articles-grid">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
            @click="openArticle(article)"
          >
            <div class="article-header">
              <div class="article-meta">
                <VaIcon
                  :name="
                    {
                      seo: 'travel_explore',
                      geo: 'auto_awesome',
                      aeo: 'question_answer',
                      tools: 'build',
                    }[article.category]
                  "
                  size="14px"
                  :style="{
                    color: {
                      seo: '#3B82F6',
                      geo: '#10B981',
                      aeo: '#EC4899',
                      tools: '#F59E0B',
                    }[article.category],
                  }"
                />
                <span class="date">{{ new Date(article.date).toLocaleDateString('zh-CN') }}</span>
                <span class="read-time">{{ article.readTime }} 分钟阅读</span>
              </div>
              <div v-if="article.category === 'tools'" class="impact-badge">
                <VaIcon name="star" size="12px" />
              </div>
            </div>

            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-desc">{{ article.description }}</p>

            <div class="article-tags">
              <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="article-footer">
              <span class="author">作者：{{ article.author }}</span>
              <VaIcon name="open_in_new" size="16px" color="secondary" />
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.articles-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ─────────────────────────────── */
.hero-section {
  background: linear-gradient(135deg, #1a1f3c 0%, #2d3561 50%, #1a2744 100%);
  padding: 2.8rem 2rem 2.4rem;
  margin: -1rem -1rem 0 -1rem;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
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
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1.6rem;
  line-height: 1.6;
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

/* ── Content Layout ───────────────────── */
.content-wrapper {
  flex: 1;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.articles-sidebar {
  flex-shrink: 0;
  width: 200px;
}

.sidebar-header {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--va-text-secondary);
  opacity: 0.6;
  margin-bottom: 1rem;
  letter-spacing: 0.08em;
}

.category-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--va-text-secondary);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  margin-bottom: 4px;
}

.category-btn:hover {
  background: var(--va-background-element);
  color: var(--va-text-primary);
}

.category-btn.active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--va-primary);
  font-weight: 600;
}

.category-btn .count {
  margin-left: auto;
  font-size: 11px;
  background: var(--va-background-element);
  padding: 2px 6px;
  border-radius: 10px;
}

.articles-main {
  flex: 1;
  min-width: 0;
}

/* ── Articles Grid ────────────────────── */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.article-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  border-color: var(--va-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--va-text-secondary);
}

.date {
  font-weight: 500;
}

.read-time {
  opacity: 0.7;
}

.article-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.article-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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

.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--va-text-secondary);
  padding-top: 8px;
  border-top: 1px solid var(--va-background-border);
}

.author {
  font-size: 12px;
}

/* ── Empty State ──────────────────────── */
.empty-state {
  text-align: center;
  padding: 3.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.empty-state p {
  font-size: 14px;
  color: var(--va-text-secondary);
  margin: 0;
}

/* ── Responsive ───────────────────────── */
@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
  }

  .articles-sidebar {
    width: 100%;
  }

  .sidebar-header {
    display: none;
  }

  .category-btn {
    display: inline-block;
    width: auto;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.7rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .article-card {
    padding: 16px;
  }
}
</style>
