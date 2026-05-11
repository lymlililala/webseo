<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { seoCategories, allTools, featuredTools, type SeoTool, type SeoCategory } from '../../data/seo-tools'

const searchQuery = ref('')
const activeCategory = ref('all')
const showAiOnly = ref(false)
const showFreeOnly = ref(false)

const filteredTools = computed(() => {
  let tools: SeoTool[] = []

  if (activeCategory.value === 'all') {
    tools = allTools
  } else {
    const cat = seoCategories.find((c) => c.id === activeCategory.value)
    tools = cat ? cat.tools : []
  }

  if (showAiOnly.value) {
    tools = tools.filter((t) => t.isAiFriendly)
  }
  if (showFreeOnly.value) {
    tools = tools.filter((t) => t.isFree)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }
  return tools
})

const groupedFilteredTools = computed(() => {
  if (activeCategory.value !== 'all') {
    const cat = seoCategories.find((c) => c.id === activeCategory.value)
    if (cat) {
      return [{ ...cat, tools: filteredTools.value }]
    }
    return []
  }
  return seoCategories
    .map((cat) => ({
      ...cat,
      tools: filteredTools.value.filter((t) => cat.tools.some((ct) => ct.id === t.id)),
    }))
    .filter((cat) => cat.tools.length > 0)
})

const totalTools = computed(() => allTools.length)
const freeToolsCount = computed(() => allTools.filter((t) => t.isFree).length)
const aiToolsCount = computed(() => allTools.filter((t) => t.isAiFriendly).length)

function openTool(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function getCategoryColor(categoryId: string): string {
  const cat = seoCategories.find((c) => c.id === categoryId)
  return cat?.color || '#4CAF50'
}

function getToolCategory(tool: SeoTool): SeoCategory | undefined {
  return seoCategories.find((c) => c.tools.some((t) => t.id === tool.id))
}

function selectCategory(catId: string) {
  activeCategory.value = catId
  // scroll content area to top
  const el = document.querySelector('.main-content')
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
}

// track scroll to highlight active category in sidebar when showing "all"
const scrollSpy = ref('all')
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (activeCategory.value !== 'all') return
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scrollSpy.value = (entry.target as HTMLElement).dataset.catId || 'all'
        }
      })
    },
    { threshold: 0.25 },
  )
  document.querySelectorAll('.category-group[data-cat-id]').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const activeSidebarItem = computed(() => (activeCategory.value === 'all' ? scrollSpy.value : activeCategory.value))
</script>

<template>
  <div class="seo-nav-page">
    <!-- ── Hero ───────────────────────────────────────── -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <VaIcon name="travel_explore" size="16px" />
          <span>SEO 工具导航</span>
        </div>
        <h1 class="hero-title">发现最优质的 SEO 工具</h1>
        <p class="hero-subtitle">
          精心整合 {{ totalTools }}+ 款专业 SEO 工具，覆盖关键词研究、技术诊断、内容优化、AI搜索监测等
          {{ seoCategories.length }} 大核心领域
        </p>

        <div class="search-wrapper">
          <VaInput v-model="searchQuery" placeholder="搜索工具名称、功能或标签..." class="search-input" clearable>
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-number">{{ totalTools }}+</span>
            <span class="stat-label">精选工具</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">{{ freeToolsCount }}</span>
            <span class="stat-label">免费可用</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">{{ aiToolsCount }}</span>
            <span class="stat-label">AI 友好</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">{{ seoCategories.length }}</span>
            <span class="stat-label">专业分类</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Body: Sidebar + Content ────────────────────── -->
    <div class="body-layout">
      <!-- Left Sidebar -->
      <aside class="cat-sidebar">
        <div class="sidebar-inner">
          <!-- Filter options -->
          <div class="sidebar-filters">
            <label class="filter-toggle" :class="{ active: showFreeOnly }" @click="showFreeOnly = !showFreeOnly">
              <VaIcon name="money_off" size="14px" />
              仅免费
            </label>
            <label class="filter-toggle" :class="{ active: showAiOnly }" @click="showAiOnly = !showAiOnly">
              <VaIcon name="smart_toy" size="14px" />
              AI 友好
            </label>
          </div>

          <div class="sidebar-divider" />

          <!-- All entry -->
          <button class="sidebar-item" :class="{ active: activeCategory === 'all' }" @click="selectCategory('all')">
            <span class="sidebar-item-dot" style="background: #6366f1" />
            <VaIcon name="apps" size="16px" class="sidebar-item-icon" />
            <span class="sidebar-item-name">全部工具</span>
            <span class="sidebar-item-count">{{ totalTools }}</span>
          </button>

          <!-- Category entries -->
          <button
            v-for="cat in seoCategories"
            :key="cat.id"
            class="sidebar-item"
            :class="{
              active: activeCategory === cat.id,
              'scroll-active': activeCategory === 'all' && activeSidebarItem === cat.id,
            }"
            :style="{ '--cat-color': cat.color }"
            @click="selectCategory(cat.id)"
          >
            <span class="sidebar-item-dot" :style="{ background: cat.color }" />
            <VaIcon
              :name="cat.icon"
              size="16px"
              class="sidebar-item-icon"
              :style="{ color: activeCategory === cat.id ? cat.color : '' }"
            />
            <span class="sidebar-item-name">{{ cat.name }}</span>
            <span class="sidebar-item-count">{{ cat.tools.length }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Featured Tools (only when showing all and no search) -->
        <div v-if="activeCategory === 'all' && !searchQuery" class="section featured-section">
          <div class="section-header">
            <div class="section-title-group">
              <VaIcon name="star" color="warning" size="20px" />
              <h2 class="section-title">精选推荐</h2>
            </div>
            <p class="section-desc">站长必备的核心工具，每一款都经过实战验证</p>
          </div>
          <div class="featured-grid">
            <div v-for="tool in featuredTools" :key="tool.id" class="featured-card" @click="openTool(tool.url)">
              <div
                class="featured-card-icon"
                :style="{
                  background: getCategoryColor(getToolCategory(tool)?.id || '') + '15',
                  borderColor: getCategoryColor(getToolCategory(tool)?.id || '') + '35',
                }"
              >
                <VaIcon
                  :name="getToolCategory(tool)?.icon || 'link'"
                  :color="getCategoryColor(getToolCategory(tool)?.id || '')"
                  size="26px"
                />
              </div>
              <div class="featured-card-content">
                <div class="featured-card-header">
                  <h3 class="featured-card-title">{{ tool.name }}</h3>
                  <div class="featured-card-badges">
                    <span v-if="tool.isFree" class="badge badge-free">免费</span>
                    <span v-if="tool.isAiFriendly" class="badge badge-ai">AI 友好</span>
                  </div>
                </div>
                <p class="featured-card-desc">{{ tool.description }}</p>
                <div class="featured-card-tags">
                  <span v-for="tag in tool.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
              <div class="featured-card-arrow">
                <VaIcon name="open_in_new" size="16px" color="secondary" />
              </div>
            </div>
          </div>
        </div>

        <!-- Result count bar -->
        <div class="result-bar">
          <span class="result-count">
            <VaIcon name="format_list_bulleted" size="15px" />
            找到 <strong>{{ filteredTools.length }}</strong> 个工具
          </span>
          <button
            v-if="searchQuery || showAiOnly || showFreeOnly"
            class="clear-btn"
            @click="
              searchQuery = ''
              showAiOnly = false
              showFreeOnly = false
            "
          >
            <VaIcon name="close" size="13px" />
            清除筛选
          </button>
        </div>

        <!-- Tools by Category -->
        <div class="tools-section">
          <div v-if="filteredTools.length === 0" class="empty-state">
            <VaIcon name="search_off" size="56px" color="secondary" />
            <p class="empty-text">没有找到匹配的工具，试试其他关键词</p>
            <VaButton
              preset="secondary"
              size="small"
              @click="
                searchQuery = ''
                showAiOnly = false
                showFreeOnly = false
              "
            >
              清除筛选条件
            </VaButton>
          </div>

          <div v-for="group in groupedFilteredTools" :key="group.id" class="category-group" :data-cat-id="group.id">
            <div class="category-header" :style="{ borderLeftColor: group.color }">
              <div class="category-header-left">
                <div class="category-icon-wrap" :style="{ background: group.color + '15' }">
                  <VaIcon :name="group.icon" :style="{ color: group.color }" size="22px" />
                </div>
                <div>
                  <h2 class="category-name">{{ group.name }}</h2>
                  <p class="category-desc">{{ group.description }}</p>
                </div>
              </div>
              <span class="category-count" :style="{ background: group.color + '15', color: group.color }">
                {{ group.tools.length }} 个工具
              </span>
            </div>

            <div class="tools-grid">
              <div v-for="tool in group.tools" :key="tool.id" class="tool-card" @click="openTool(tool.url)">
                <div class="tool-card-top">
                  <div
                    class="tool-icon-wrap"
                    :style="{ background: group.color + '12', borderColor: group.color + '30' }"
                  >
                    <VaIcon :name="group.icon" :style="{ color: group.color }" size="20px" />
                  </div>
                  <div class="tool-badges">
                    <span v-if="tool.isFree" class="badge badge-free">免费</span>
                    <span v-if="tool.hasApi" class="badge badge-api">API</span>
                    <span v-if="tool.isAiFriendly" class="badge badge-ai">AI</span>
                  </div>
                </div>

                <h3 class="tool-name">{{ tool.name }}</h3>
                <p class="tool-desc">{{ tool.description }}</p>

                <div class="tool-footer">
                  <div class="tool-tags">
                    <span v-for="tag in tool.tags.slice(0, 2)" :key="tag" class="tag tag-small">{{ tag }}</span>
                  </div>
                  <div class="tool-link-hint">
                    <VaIcon name="open_in_new" size="13px" />
                    <span>访问</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="section tips-section">
          <div class="tips-header">
            <VaIcon name="lightbulb" color="warning" size="20px" />
            <h2 class="section-title">站长 SEO 使用建议</h2>
          </div>
          <div class="tips-grid">
            <div class="tip-card">
              <div class="tip-icon">🔍</div>
              <h3 class="tip-title">从关键词研究开始</h3>
              <p class="tip-content">
                用 <strong>Exploding Topics</strong> 发现爆发词，再用
                <strong>AnswerThePublic</strong> 挖掘用户真实问题，通过
                <strong>Google Keyword Planner</strong> 验证搜索量。
              </p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">⚡</div>
              <h3 class="tip-title">定期技术体检</h3>
              <p class="tip-content">
                每月用 <strong>Screaming Frog</strong> 做全站爬取，配合 <strong>PageSpeed Insights</strong> 检查 Core
                Web Vitals，及时修复技术 SEO 问题。
              </p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">✍️</div>
              <h3 class="tip-title">AI 辅助内容优化</h3>
              <p class="tip-content">
                使用 <strong>SurferSEO</strong> 或 <strong>Clearscope</strong> 进行内容打分，结合
                <strong>Frase.io</strong> 快速生成高排名文章框架。
              </p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">🤖</div>
              <h3 class="tip-title">布局 AI 搜索时代</h3>
              <p class="tip-content">
                使用 <strong>GEO/AEO Tracker</strong> 监测品牌在 AI 工具中的引用率，通过
                <strong>SearchAttention</strong> 优化内容在 Google AI Overview 中的可见度。
              </p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">🔗</div>
              <h3 class="tip-title">构建高质量外链</h3>
              <p class="tip-content">
                用 <strong>Majestic</strong> 分析竞品反链来源，再通过 <strong>Respona</strong> 或
                <strong>BacklinkGPT</strong> 自动化外链推广流程。
              </p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">📊</div>
              <h3 class="tip-title">数据驱动决策</h3>
              <p class="tip-content">
                将 <strong>Google Search Console</strong> 数据与
                <strong>Similarweb</strong> 竞品流量数据结合分析，精准找到最大增长机会点。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page shell ───────────────────────────── */
.seo-nav-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ─────────────────────────────────── */
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

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
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
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1.6rem;
  line-height: 1.6;
}

.search-wrapper {
  max-width: 520px;
  margin: 0 auto 1.6rem;
}

.search-input {
  width: 100%;
}

/* 搜索框在深色 Hero 背景下强制白色文字 */
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
.search-input :deep(.va-input-wrapper:hover .va-input-wrapper__field),
.search-input :deep(.va-input-wrapper--focused .va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
}

/* ── Body layout ──────────────────────────── */
.body-layout {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 0;
  margin: 0 -1rem;
  min-height: 0;
}

/* ── Left Sidebar ─────────────────────────── */
.cat-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 60px;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  border-right: 1px solid var(--va-background-border);
  background: var(--va-background-primary);
  scrollbar-width: thin;
  scrollbar-color: var(--va-background-border) transparent;
}

.cat-sidebar::-webkit-scrollbar {
  width: 4px;
}
.cat-sidebar::-webkit-scrollbar-thumb {
  background: var(--va-background-border);
  border-radius: 4px;
}

.sidebar-inner {
  padding: 16px 10px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-filters {
  display: flex;
  gap: 6px;
  padding: 0 2px 4px;
  flex-wrap: wrap;
}

.filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--va-background-border);
  background: transparent;
  color: var(--va-text-secondary);
  transition: all 0.15s;
  user-select: none;
}

.filter-toggle:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}

.filter-toggle.active {
  background: var(--va-primary);
  border-color: var(--va-primary);
  color: #fff;
}

.sidebar-divider {
  height: 1px;
  background: var(--va-background-border);
  margin: 8px 2px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    color 0.15s;
  position: relative;
}

.sidebar-item:hover {
  background: var(--va-background-secondary);
}

.sidebar-item.active {
  background: rgba(99, 102, 241, 0.1);
}

.sidebar-item.scroll-active:not(.active) {
  background: var(--va-background-element);
}

.sidebar-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.7;
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.sidebar-item.active .sidebar-item-dot,
.sidebar-item.scroll-active .sidebar-item-dot {
  opacity: 1;
  transform: scale(1.3);
}

.sidebar-item-icon {
  flex-shrink: 0;
  color: var(--va-text-secondary);
  transition: color 0.15s;
}

.sidebar-item.active .sidebar-item-icon {
  color: var(--cat-color, var(--va-primary));
}

.sidebar-item-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--va-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.sidebar-item.active .sidebar-item-name {
  color: var(--va-text-primary);
  font-weight: 600;
}

.sidebar-item-count {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--va-text-secondary);
  background: var(--va-background-element);
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 20px;
  text-align: center;
}

.sidebar-item.active .sidebar-item-count {
  background: rgba(99, 102, 241, 0.15);
  color: var(--va-primary);
}

/* ── Main Content ─────────────────────────── */
.main-content {
  flex: 1;
  min-width: 0;
  padding: 1.5rem 1.5rem 2rem;
  overflow-y: auto;
}

/* ── Sections ─────────────────────────────── */
.section {
  margin-bottom: 2.5rem;
}

.section-header {
  margin-bottom: 1.2rem;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 4px;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.section-desc {
  color: var(--va-text-secondary);
  font-size: 13px;
  margin: 0;
}

/* ── Featured ─────────────────────────────── */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 9px;
}

.featured-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.featured-card:hover {
  border-color: var(--va-primary);
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.07);
  transform: translateY(-1px);
}

.featured-card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 11px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-card-content {
  flex: 1;
  min-width: 0;
}

.featured-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
  flex-wrap: wrap;
}

.featured-card-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.featured-card-badges {
  display: flex;
  gap: 4px;
}

.featured-card-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0 0 7px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.featured-card-arrow {
  flex-shrink: 0;
  opacity: 0.35;
  transition: opacity 0.2s;
}

.featured-card:hover .featured-card-arrow {
  opacity: 0.8;
}

/* ── Result bar ───────────────────────────── */
.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding: 8px 12px;
  background: var(--va-background-secondary);
  border-radius: 8px;
  border: 1px solid var(--va-background-border);
}

.result-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--va-text-secondary);
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--va-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 5px;
  transition:
    background 0.15s,
    color 0.15s;
}

.clear-btn:hover {
  background: var(--va-background-element);
  color: var(--va-text-primary);
}

/* ── Tools section ────────────────────────── */
.tools-section {
  /* no extra padding needed */
}

.category-group {
  margin-bottom: 2.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 14px 16px;
  background: var(--va-background-secondary);
  border-radius: 10px;
  border-left: 4px solid;
  flex-wrap: wrap;
  gap: 10px;
}

.category-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 2px;
  color: var(--va-text-primary);
}

.category-desc {
  font-size: 12.5px;
  color: var(--va-text-secondary);
  margin: 0;
}

.category-count {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Tools Grid ───────────────────────────── */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.tool-card {
  padding: 16px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.tool-card:hover {
  border-color: var(--va-primary);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.tool-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-badges {
  display: flex;
  gap: 4px;
}

.tool-name {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.tool-desc {
  font-size: 12.5px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.tool-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tool-link-hint {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--va-primary);
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.tool-card:hover .tool-link-hint {
  opacity: 1;
}

/* ── Badges ───────────────────────────────── */
.badge {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  line-height: 17px;
}

.badge-free {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.badge-api {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.badge-ai {
  background: rgba(168, 85, 247, 0.12);
  color: #7c3aed;
  border: 1px solid rgba(168, 85, 247, 0.25);
}

/* ── Tags ─────────────────────────────────── */
.tag {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 11.5px;
  background: var(--va-background-element);
  color: var(--va-text-secondary);
  border: 1px solid var(--va-background-border);
}

.tag-small {
  padding: 1px 6px;
  font-size: 11px;
}

/* ── Tips ─────────────────────────────────── */
.tips-section {
  background: var(--va-background-secondary);
  border-radius: 14px;
  padding: 1.6rem;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 1.2rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.tip-card {
  padding: 16px;
  background: var(--va-background-primary);
  border-radius: 10px;
  border: 1px solid var(--va-background-border);
}

.tip-icon {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.tip-title {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--va-text-primary);
}

.tip-content {
  font-size: 12.5px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* ── Empty State ──────────────────────────── */
.empty-state {
  text-align: center;
  padding: 3.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.empty-text {
  font-size: 14px;
  color: var(--va-text-secondary);
  margin: 0;
}

/* ── Responsive ───────────────────────────── */
@media (max-width: 900px) {
  .body-layout {
    flex-direction: column;
  }

  .cat-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid var(--va-background-border);
    overflow-x: auto;
    overflow-y: hidden;
  }

  .sidebar-inner {
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 10px 12px;
    gap: 4px;
    overflow-x: auto;
  }

  .sidebar-filters {
    display: none;
  }

  .sidebar-divider {
    width: 1px;
    height: auto;
    margin: 0 4px;
    align-self: stretch;
  }

  .sidebar-item {
    flex-shrink: 0;
    white-space: nowrap;
    padding: 6px 10px;
    border-radius: 20px;
  }

  .sidebar-item-dot {
    display: none;
  }

  .sidebar-item-name {
    font-size: 12.5px;
  }

  .sidebar-item-count {
    display: none;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.7rem;
  }

  .stats-row {
    gap: 1.2rem;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }

  .featured-card {
    flex-wrap: wrap;
  }

  .featured-card-arrow {
    display: none;
  }
}
</style>
