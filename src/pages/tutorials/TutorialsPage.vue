<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { type Tutorial } from '../../data/tutorials'
import { tutorialsAPI } from '../../services/supabase'
import SkeletonLoader from '../../components/SkeletonLoader.vue'
import { usePageSeo } from '../../composables/usePageSeo'
import { localePath } from '../../i18n/useLocale'

const { t } = useI18n()

usePageSeo({
  title: t('tutorialsPage.seoTitle'),
  description: t('tutorialsPage.seoDescription'),
  path: '/tutorials',
  keywords: t('tutorialsPage.seoKeywords'),
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'SGAIndex Tutorials',
      description: t('tutorialsPage.seoDescription'),
      url: 'https://sgaindex.com/tutorials',
    },
  ],
})

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref<'all' | 'seo' | 'geo' | 'aeo'>('all')
const selectedLevel = ref<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
const loading = ref(true)
const allTutorials = ref<Tutorial[]>([])
const currentPage = ref(1)
const pageSize = 12

onMounted(async () => {
  try {
    const data = await tutorialsAPI.getAll()
    if (data && data.length > 0) {
      allTutorials.value = data.map((item: any) => ({
        ...item,
        lessons: item.lessons ?? [],
        duration: item.duration ?? 30,
      })) as Tutorial[]
    }
  } catch (e) {
    console.error('加载教程失败', e)
  } finally {
    loading.value = false
  }
})

const filteredTutorials = computed(() => {
  let result = allTutorials.value

  if (selectedCategory.value !== 'all') {
    result = result.filter((t) => t.category === selectedCategory.value)
  }

  if (selectedLevel.value !== 'all') {
    result = result.filter((t) => t.difficulty === selectedLevel.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (t) => t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }

  return result.sort((a, b) => b.students - a.students)
})

// 分页
const paginatedTutorials = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTutorials.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredTutorials.value.length / pageSize))

// 筛选变化时重置到第一页
watch([searchQuery, selectedCategory, selectedLevel], () => {
  currentPage.value = 1
})

function goToPage(page: number) {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const difficultyLabel = computed<Record<string, string>>(() => ({
  beginner: t('tutorialsPage.levelBeginner'),
  intermediate: t('tutorialsPage.levelIntermediate'),
  advanced: t('tutorialsPage.levelAdvanced'),
}))
</script>

<template>
  <div class="tutorials-page">
    <!-- Hero -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <VaIcon name="school" size="16px" />
          <span>{{ t('tutorialsPage.badge') }}</span>
        </div>
        <h1 class="hero-title">{{ t('tutorialsPage.heroTitle') }}</h1>
        <p class="hero-subtitle">{{ t('tutorialsPage.heroSubtitle') }}</p>

        <div class="search-wrapper">
          <VaInput v-model="searchQuery" :placeholder="t('tutorialsPage.searchPlaceholder')" class="search-input" clearable>
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>
      </div>
    </div>

    <!-- Filters & Content -->
    <div class="content-wrapper">
      <aside class="sidebar">
        <div class="filter-group">
          <h3>{{ t('tutorialsPage.categories') }}</h3>
          <button
            v-for="cat in [
              { id: 'all', label: t('tutorialsPage.all') },
              { id: 'seo', label: t('tutorialsPage.catSeo') },
              { id: 'geo', label: t('tutorialsPage.catGeo') },
              { id: 'aeo', label: t('tutorialsPage.catAeo') },
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
          <h3>{{ t('tutorialsPage.level') }}</h3>
          <button
            v-for="level in [
              { id: 'all', label: t('tutorialsPage.levelAll') },
              { id: 'beginner', label: t('tutorialsPage.levelBeginner') },
              { id: 'intermediate', label: t('tutorialsPage.levelIntermediate') },
              { id: 'advanced', label: t('tutorialsPage.levelAdvanced') },
            ]"
            :key="level.id"
            class="filter-btn"
            :class="{ active: selectedLevel === level.id }"
            @click="selectedLevel = level.id as typeof selectedLevel"
          >
            {{ level.label }}
          </button>
        </div>
      </aside>

      <main class="main-content">
        <div v-if="loading" class="loading-state">
          <SkeletonLoader variant="card" :count="6" />
        </div>

        <div v-else-if="filteredTutorials.length === 0" class="empty-state">
          <VaIcon name="school" size="56px" color="secondary" />
          <p>{{ t('tutorialsPage.empty') }}</p>
        </div>

        <div v-else>
          <div class="tutorials-grid">
            <div
              v-for="tutorial in paginatedTutorials"
              :key="tutorial.id"
              class="tutorial-card"
              @click="router.push(localePath('/tutorials/' + ((tutorial as any).slug || tutorial.id)))"
            >
              <div class="tutorial-header">
                <div class="difficulty-badge" :class="tutorial.difficulty">
                  {{ difficultyLabel[tutorial.difficulty] }}
                </div>
                <div class="rating">
                  <VaIcon name="star" size="14px" color="warning" />
                  <span>{{ tutorial.rating }}</span>
                </div>
              </div>

              <RouterLink
                :to="localePath('/tutorials/' + ((tutorial as any).slug || tutorial.id))"
                class="tutorial-title-link"
                @click.stop
              >
                <h3 class="tutorial-title">{{ tutorial.title }}</h3>
              </RouterLink>
              <p class="tutorial-desc">{{ tutorial.description }}</p>

              <div class="tutorial-info">
                <span class="info-item">
                  <VaIcon name="person" size="14px" />
                  {{ tutorial.instructor }}
                </span>
                <span class="info-item">
                  <VaIcon name="schedule" size="14px" />
                  {{ t('tutorialsPage.minutes', { n: tutorial.duration }) }}
                </span>
                <span class="info-item">
                  <VaIcon name="group" size="14px" />
                  {{ t('tutorialsPage.students', { n: tutorial.students.toLocaleString() }) }}
                </span>
              </div>

              <div class="lessons-count">
                <VaIcon name="list" size="14px" />
                {{ t('tutorialsPage.lessons', { n: tutorial.lessons.length }) }}
              </div>

              <VaButton class="enroll-btn" preset="secondary"> {{ t('tutorialsPage.viewCourse') }} </VaButton>
            </div>
          </div>

          <!-- 分页器 -->
          <div v-if="totalPages > 1" class="pagination">
            <VaButton preset="secondary" size="small" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              <VaIcon name="arrow_back" size="16px" />
            </VaButton>
            <div class="page-info">
              {{ t('articlesPage.pageInfo', { current: currentPage, total: totalPages, count: filteredTutorials.length }) }}
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
.tutorials-page {
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
  width: 180px;
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
  padding: 8px 12px;
  margin-bottom: 4px;
  border: none;
  background: transparent;
  color: var(--va-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
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

.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.tutorial-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
}

.tutorial-card:hover {
  border-color: var(--va-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.difficulty-badge.beginner {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.difficulty-badge.intermediate {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.difficulty-badge.advanced {
  background: rgba(168, 85, 247, 0.12);
  color: #7c3aed;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.tutorial-title-link {
  text-decoration: none;
  color: inherit;
}

.tutorial-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
  line-height: 1.5;
}

.tutorial-title-link:hover .tutorial-title {
  color: var(--va-primary);
}

.tutorial-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.tutorial-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
  border-top: 1px solid var(--va-background-border);
  border-bottom: 1px solid var(--va-background-border);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--va-text-secondary);
}

.lessons-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--va-primary);
  font-weight: 600;
}

.enroll-btn {
  width: 100%;
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

  .tutorials-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.7rem;
  }

  .tutorials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
