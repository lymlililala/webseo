<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { geoCategories, allGeoTools, featuredGeoTools, type GeoTool, type GeoCategory } from '../../data/geo-tools'

const searchQuery = ref('')
const activeCategory = ref('all')
const showOpenSourceOnly = ref(false)
const showFreeOnly = ref(false)
const activeRegion = ref<'all' | 'cn' | 'global'>('all')

const filteredTools = computed(() => {
  let tools: GeoTool[] = []

  if (activeCategory.value === 'all') {
    tools = allGeoTools
  } else {
    const cat = geoCategories.find((c) => c.id === activeCategory.value)
    tools = cat ? cat.tools : []
  }

  if (activeRegion.value !== 'all') {
    tools = tools.filter((t) => t.region === activeRegion.value)
  }
  if (showOpenSourceOnly.value) {
    tools = tools.filter((t) => t.isOpenSource)
  }
  if (showFreeOnly.value) {
    tools = tools.filter((t) => t.isFree || t.hasFreeplan)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.nameEn?.toLowerCase().includes(q) ?? false) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (t.github?.repo.toLowerCase().includes(q) ?? false),
    )
  }
  return tools
})

const groupedFilteredTools = computed(() => {
  if (activeCategory.value !== 'all') {
    const cat = geoCategories.find((c) => c.id === activeCategory.value)
    if (cat) {
      return [{ ...cat, tools: filteredTools.value }]
    }
    return []
  }
  return geoCategories
    .map((cat) => ({
      ...cat,
      tools: filteredTools.value.filter((t) => cat.tools.some((ct) => ct.id === t.id)),
    }))
    .filter((cat) => cat.tools.length > 0)
})

const totalTools = computed(() => allGeoTools.length)
const cnToolsCount = computed(() => allGeoTools.filter((t) => t.region === 'cn').length)
const globalToolsCount = computed(() => allGeoTools.filter((t) => t.region === 'global').length)
const openSourceCount = computed(() => allGeoTools.filter((t) => t.isOpenSource).length)
const freeCount = computed(() => allGeoTools.filter((t) => t.isFree || t.hasFreeplan).length)

function openTool(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function getCategoryColor(categoryId: string): string {
  const cat = geoCategories.find((c) => c.id === categoryId)
  return cat?.color || '#6366F1'
}

function getToolCategory(tool: GeoTool): GeoCategory | undefined {
  return geoCategories.find((c) => c.tools.some((t) => t.id === tool.id))
}

function selectCategory(catId: string) {
  activeCategory.value = catId
  const el = document.querySelector('.geo-main-content')
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  searchQuery.value = ''
  showOpenSourceOnly.value = false
  showFreeOnly.value = false
  activeRegion.value = 'all'
}

function formatStars(stars: number): string {
  if (stars >= 1000) return (stars / 1000).toFixed(1) + 'k'
  return String(stars)
}

// Scroll spy
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
    { threshold: 0.15 },
  )
  document.querySelectorAll('.geo-category-group[data-cat-id]').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const activeSidebarItem = computed(() => (activeCategory.value === 'all' ? scrollSpy.value : activeCategory.value))
</script>

<template>
  <div class="geo-nav-page">
    <!-- ── Hero ───────────────────────────────────────────── -->
    <div class="geo-hero">
      <div class="geo-hero-bg" />
      <div class="geo-hero-content">
        <div class="geo-hero-badge">
          <VaIcon name="auto_awesome" size="14px" />
          <span>GEO · AEO · AI 搜索优化导航</span>
        </div>
        <h1 class="geo-hero-title">
          生成式引擎优化工具<br />
          <span class="geo-hero-title-accent">全景导航</span>
        </h1>
        <p class="geo-hero-subtitle">
          深度整合 <strong>{{ totalTools }}+</strong> 款工具与资源，6 大分类覆盖
          <strong>国内 SaaS</strong>、<strong>国内服务商</strong>、<strong>国际专项工具</strong>、<strong
            >传统 SEO 升级</strong
          >、<strong>免费工具</strong>、<strong>开源项目</strong>
        </p>

        <div class="geo-search-wrap">
          <VaInput
            v-model="searchQuery"
            placeholder="搜索工具名称、功能特点、标签..."
            class="geo-search-input"
            clearable
          >
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>

        <!-- Region tabs -->
        <div class="geo-region-tabs">
          <button
            v-for="r in [
              { key: 'all', label: '全部', icon: 'public' },
              { key: 'cn', label: '🇨🇳 国内工具', icon: '' },
              { key: 'global', label: '🌍 国际工具', icon: '' },
            ]"
            :key="r.key"
            class="geo-region-tab"
            :class="{ active: activeRegion === r.key }"
            @click="activeRegion = r.key as 'all' | 'cn' | 'global'"
          >
            {{ r.label }}
          </button>
        </div>

        <div class="geo-stats">
          <div class="geo-stat">
            <span class="geo-stat-num">{{ totalTools }}+</span>
            <span class="geo-stat-label">精选工具</span>
          </div>
          <div class="geo-stat-div" />
          <div class="geo-stat">
            <span class="geo-stat-num">{{ cnToolsCount }}</span>
            <span class="geo-stat-label">🇨🇳 国内工具</span>
          </div>
          <div class="geo-stat-div" />
          <div class="geo-stat">
            <span class="geo-stat-num">{{ globalToolsCount }}</span>
            <span class="geo-stat-label">🌍 国际工具</span>
          </div>
          <div class="geo-stat-div" />
          <div class="geo-stat">
            <span class="geo-stat-num">{{ freeCount }}</span>
            <span class="geo-stat-label">含免费版</span>
          </div>
          <div class="geo-stat-div" />
          <div class="geo-stat">
            <span class="geo-stat-num">{{ openSourceCount }}</span>
            <span class="geo-stat-label">开源项目</span>
          </div>
        </div>

        <!-- Concept bar -->
        <div class="geo-concept-bar">
          <div class="geo-concept-item">
            <VaIcon name="psychology" size="15px" color="#818CF8" />
            <span><strong>GEO</strong> = Generative Engine Optimization</span>
          </div>
          <span class="geo-concept-sep">·</span>
          <div class="geo-concept-item">
            <VaIcon name="question_answer" size="15px" color="#34D399" />
            <span><strong>AEO</strong> = Answer Engine Optimization</span>
          </div>
          <span class="geo-concept-sep">·</span>
          <div class="geo-concept-item">
            <VaIcon name="description" size="15px" color="#60A5FA" />
            <span><strong>llms.txt</strong> = AI 可读结构标准</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Body ───────────────────────────────────────────── -->
    <div class="geo-body">
      <!-- Sidebar -->
      <aside class="geo-sidebar">
        <div class="geo-sidebar-inner">
          <!-- Filters -->
          <div class="geo-sidebar-filters">
            <label class="geo-filter-toggle" :class="{ active: showFreeOnly }" @click="showFreeOnly = !showFreeOnly">
              <VaIcon name="money_off" size="12px" />
              含免费
            </label>
            <label
              class="geo-filter-toggle"
              :class="{ active: showOpenSourceOnly }"
              @click="showOpenSourceOnly = !showOpenSourceOnly"
            >
              <VaIcon name="code" size="12px" />
              开源
            </label>
          </div>

          <div class="geo-sidebar-div" />

          <!-- All -->
          <button class="geo-sidebar-item" :class="{ active: activeCategory === 'all' }" @click="selectCategory('all')">
            <span class="geo-sidebar-active-bar" />
            <VaIcon name="apps" size="16px" class="geo-sidebar-icon" />
            <span class="geo-sidebar-name">全部工具</span>
            <span class="geo-sidebar-count">{{ totalTools }}</span>
          </button>

          <!-- Categories -->
          <button
            v-for="cat in geoCategories"
            :key="cat.id"
            class="geo-sidebar-item"
            :class="{
              active: activeCategory === cat.id,
              'scroll-active': activeCategory === 'all' && activeSidebarItem === cat.id,
            }"
            :style="{ '--cat-color': cat.color }"
            @click="selectCategory(cat.id)"
          >
            <span class="geo-sidebar-active-bar" :style="{ background: cat.color }" />
            <VaIcon
              :name="cat.icon"
              size="16px"
              class="geo-sidebar-icon"
              :style="{ color: activeCategory === cat.id ? cat.color : '' }"
            />
            <span class="geo-sidebar-name">{{ cat.name }}</span>
            <span class="geo-sidebar-count">{{ cat.tools.length }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="geo-main-content">
        <!-- Featured (only all + no search) -->
        <div v-if="activeCategory === 'all' && !searchQuery && activeRegion === 'all'" class="geo-section">
          <div class="geo-section-header">
            <VaIcon name="star" color="warning" size="17px" />
            <h2 class="geo-section-title">精选推荐</h2>
            <span class="geo-section-badge">编辑严选</span>
          </div>
          <div class="geo-featured-grid">
            <div v-for="tool in featuredGeoTools" :key="tool.id" class="geo-featured-card" @click="openTool(tool.url)">
              <div
                class="geo-featured-icon"
                :style="{
                  background: getCategoryColor(getToolCategory(tool)?.id || '') + '18',
                  borderColor: getCategoryColor(getToolCategory(tool)?.id || '') + '3a',
                }"
              >
                <VaIcon
                  :name="getToolCategory(tool)?.icon || 'hub'"
                  :color="getCategoryColor(getToolCategory(tool)?.id || '')"
                  size="22px"
                />
              </div>
              <div class="geo-featured-info">
                <div class="geo-featured-top">
                  <h3 class="geo-featured-name">{{ tool.name }}</h3>
                  <div class="geo-featured-badges">
                    <span v-if="tool.isFree" class="geo-badge geo-badge-free">免费</span>
                    <span v-else-if="tool.hasFreeplan" class="geo-badge geo-badge-freeplan">含免费版</span>
                    <span v-if="tool.isOpenSource" class="geo-badge geo-badge-oss">开源</span>
                    <span class="geo-badge" :class="tool.region === 'cn' ? 'geo-badge-cn' : 'geo-badge-global'">
                      {{ tool.region === 'cn' ? '🇨🇳 国内' : '🌍 国际' }}
                    </span>
                  </div>
                </div>
                <!-- Highlights -->
                <ul v-if="tool.highlights?.length" class="geo-featured-highlights">
                  <li v-for="h in tool.highlights" :key="h">
                    <VaIcon name="check_circle" size="12px" color="success" />
                    <span>{{ h }}</span>
                  </li>
                </ul>
                <p class="geo-featured-desc">{{ tool.description }}</p>
                <div class="geo-featured-bottom">
                  <div v-if="tool.pricing" class="geo-pricing-tag">
                    <VaIcon name="sell" size="12px" />
                    {{ tool.pricing }}
                  </div>
                  <div v-if="tool.github" class="geo-github-info">
                    <VaIcon name="star_border" size="12px" />
                    <span>{{ formatStars(tool.github.stars) }}</span>
                  </div>
                </div>
              </div>
              <VaIcon name="open_in_new" size="14px" class="geo-featured-arrow" />
            </div>
          </div>
        </div>

        <!-- Result bar -->
        <div class="geo-result-bar">
          <span class="geo-result-count">
            <VaIcon name="format_list_bulleted" size="13px" />
            找到 <strong>{{ filteredTools.length }}</strong> 个工具
          </span>
          <button
            v-if="searchQuery || showOpenSourceOnly || showFreeOnly || activeRegion !== 'all'"
            class="geo-clear-btn"
            @click="clearFilters"
          >
            <VaIcon name="close" size="12px" />
            清除筛选
          </button>
        </div>

        <!-- Tools by Category -->
        <div v-if="filteredTools.length === 0" class="geo-empty">
          <VaIcon name="search_off" size="50px" color="secondary" />
          <p>没有找到匹配的工具，试试其他关键词</p>
          <VaButton preset="secondary" size="small" @click="clearFilters"> 清除所有筛选 </VaButton>
        </div>

        <div v-for="group in groupedFilteredTools" :key="group.id" class="geo-category-group" :data-cat-id="group.id">
          <div class="geo-cat-header" :style="{ borderLeftColor: group.color }">
            <div class="geo-cat-header-left">
              <div class="geo-cat-icon" :style="{ background: group.color + '18' }">
                <VaIcon :name="group.icon" :style="{ color: group.color }" size="19px" />
              </div>
              <div>
                <div class="geo-cat-name-row">
                  <h2 class="geo-cat-name">{{ group.name }}</h2>
                  <span v-if="group.badge" class="geo-cat-badge">{{ group.badge }}</span>
                </div>
                <p class="geo-cat-desc">{{ group.description }}</p>
              </div>
            </div>
            <span class="geo-cat-count" :style="{ background: group.color + '18', color: group.color }">
              {{ group.tools.length }} 个工具
            </span>
          </div>

          <div class="geo-tools-grid">
            <div
              v-for="tool in group.tools"
              :key="tool.id"
              class="geo-tool-card"
              :style="{ '--tool-color': group.color }"
              @click="openTool(tool.url)"
            >
              <!-- Top row -->
              <div class="geo-tool-top">
                <div class="geo-tool-icon" :style="{ background: group.color + '14', borderColor: group.color + '35' }">
                  <VaIcon :name="group.icon" :style="{ color: group.color }" size="17px" />
                </div>
                <div class="geo-tool-badges">
                  <span v-if="tool.isFree" class="geo-badge geo-badge-free">免费</span>
                  <span v-else-if="tool.hasFreeplan" class="geo-badge geo-badge-freeplan">含免费</span>
                  <span v-if="tool.isOpenSource" class="geo-badge geo-badge-oss">开源</span>
                  <span v-if="tool.hasApi" class="geo-badge geo-badge-api">API</span>
                  <span class="geo-badge" :class="tool.region === 'cn' ? 'geo-badge-cn' : 'geo-badge-global'">
                    {{ tool.region === 'cn' ? '🇨🇳' : '🌍' }}
                  </span>
                </div>
              </div>

              <!-- Name -->
              <h3 class="geo-tool-name">{{ tool.name }}</h3>
              <p v-if="tool.nameEn && tool.nameEn !== tool.name" class="geo-tool-name-en">{{ tool.nameEn }}</p>

              <!-- Highlights list -->
              <ul v-if="tool.highlights?.length" class="geo-tool-highlights">
                <li v-for="h in tool.highlights.slice(0, 3)" :key="h">
                  <VaIcon name="check" size="11px" />
                  <span>{{ h }}</span>
                </li>
              </ul>

              <p class="geo-tool-desc">{{ tool.description }}</p>

              <!-- GitHub Stats -->
              <div v-if="tool.github" class="geo-tool-github">
                <a
                  :href="`https://github.com/${tool.github.repo}`"
                  class="geo-github-link"
                  @click.stop="openTool(`https://github.com/${tool.github.repo}`)"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                  {{ tool.github.repo }}
                </a>
                <div class="geo-github-stats">
                  <span><VaIcon name="star_border" size="11px" />{{ formatStars(tool.github.stars) }}</span>
                  <span v-if="tool.github.language" class="geo-github-lang">{{ tool.github.language }}</span>
                </div>
              </div>

              <!-- Footer -->
              <div class="geo-tool-footer">
                <div class="geo-tool-tags">
                  <span v-for="tag in tool.tags.slice(0, 2)" :key="tag" class="geo-tag geo-tag-sm">{{ tag }}</span>
                </div>
                <div class="geo-tool-meta">
                  <span v-if="tool.pricing" class="geo-pricing-inline">{{ tool.pricing }}</span>
                  <div class="geo-tool-visit">
                    <VaIcon name="open_in_new" size="11px" />
                    <span>访问</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips Section -->
        <div class="geo-tips-section">
          <div class="geo-tips-header">
            <VaIcon name="lightbulb" color="warning" size="17px" />
            <h2 class="geo-section-title">GEO 实战路径</h2>
          </div>
          <div class="geo-tips-grid">
            <div class="geo-tip-card">
              <div class="geo-tip-emoji">🔍</div>
              <h3>第一步：摸清现状</h3>
              <p>
                用 <strong>透镜 GEO</strong>（免费）或 <strong>HubSpot AI Grader</strong>（免费）快速获取品牌当前在主流
                AI 引擎中的可见度基线数据，判断是否需要系统优化。
              </p>
            </div>
            <div class="geo-tip-card">
              <div class="geo-tip-emoji">📄</div>
              <h3>第二步：添加 llms.txt</h3>
              <p>
                通过 <strong>aeo.js</strong> 或 <strong>LLMrefs llms.txt 生成器</strong>（免费）为网站添加 llms.txt
                文件，告知 AI 爬虫网站核心内容结构，这是 GEO 的基础建设。
              </p>
            </div>
            <div class="geo-tip-card">
              <div class="geo-tip-emoji">🏗️</div>
              <h3>第三步：结构化数据</h3>
              <p>
                为核心页面添加 JSON-LD Schema（Article、FAQ、Organization），结合
                <strong>Google Rich Results Test</strong> 验证，结构化数据是 AI 引擎理解内容实体的关键。
              </p>
            </div>
            <div class="geo-tip-card">
              <div class="geo-tip-emoji">✍️</div>
              <h3>第四步：优化内容质量</h3>
              <p>
                Princeton KDD 2024 研究证明：加入<strong>统计数据</strong>、<strong>FAQ 格式</strong
                >、<strong>权威引用</strong>和清晰<strong>标题层级</strong>可显著提升 AI 引用率。使用
                <strong>Frase.io</strong> 辅助内容分析。
              </p>
            </div>
            <div class="geo-tip-card">
              <div class="geo-tip-emoji">📊</div>
              <h3>第五步：持续监测</h3>
              <p>
                国内用户推荐 <strong>ImpetaAI</strong>（50+指标）或
                <strong>新榜智汇</strong>（内容+监测一体）；国际用户推荐 <strong>Otterly.AI</strong>（$29/月）或
                <strong>Profound</strong>（企业级）。
              </p>
            </div>
            <div class="geo-tip-card">
              <div class="geo-tip-emoji">🔐</div>
              <h3>第六步：E-E-A-T 建设</h3>
              <p>
                在 <strong>Wikidata</strong> 建立品牌实体，通过
                <strong>传声港</strong>（128家央媒资源）或高权威媒体发稿，提升品牌在 AI 引擎中的 E-E-A-T 可信度信号。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ──────────────────────────────────── */
.geo-nav-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ──────────────────────────────────── */
.geo-hero {
  background: linear-gradient(135deg, #0f1629 0%, #1a1f44 45%, #0d2135 100%);
  padding: 1.8rem 2rem 0;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: visible;
  flex-shrink: 0;
}

.geo-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(99, 102, 241, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 15% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.geo-hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.geo-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99, 102, 241, 0.18);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.7rem;
}

.geo-hero-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.45rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.geo-hero-title-accent {
  background: linear-gradient(90deg, #818cf8, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.geo-hero-subtitle {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1rem;
  line-height: 1.6;
}

.geo-hero-subtitle strong {
  color: rgba(255, 255, 255, 0.85);
}

.geo-search-wrap {
  max-width: 560px;
  margin: 0 auto 0.8rem;
}

.geo-search-input {
  width: 100%;
}

/* 搜索框在深色 Hero 背景下强制白色文字 */
.geo-search-input :deep(input) {
  color: #fff !important;
  font-size: 15px !important;
  height: 44px;
}
.geo-search-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}
.geo-search-input :deep(.va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  padding: 0 18px !important;
}
.geo-search-input :deep(.va-input-wrapper:hover .va-input-wrapper__field),
.geo-search-input :deep(.va-input-wrapper--focused .va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3) !important;
}

/* Region tabs */
.geo-region-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 0.8rem;
}

.geo-region-tab {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.55);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.geo-region-tab:hover {
  border-color: rgba(99, 102, 241, 0.5);
  color: rgba(255, 255, 255, 0.85);
}

.geo-region-tab.active {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.6);
  color: #c7d2fe;
}

/* Stats 扁平横向条 — 悬浮在 Hero/Body 交界处 */
.geo-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: nowrap;
  margin: 0.8rem -2rem 0;
  background: rgba(255, 255, 255, 0.06);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.geo-stat {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 22px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
  flex: 1;
  justify-content: center;
}

.geo-stat:last-child {
  border-right: none;
}

.geo-stat:hover {
  background: rgba(255, 255, 255, 0.08);
}

.geo-stat-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.geo-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.geo-stat-div {
  display: none;
}

/* Concept bar */
.geo-concept-bar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.geo-concept-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.geo-concept-item strong {
  color: rgba(255, 255, 255, 0.8);
}

.geo-concept-sep {
  color: rgba(255, 255, 255, 0.18);
  font-size: 15px;
}

/* ── Body ──────────────────────────────────── */
.geo-body {
  display: flex;
  flex: 1;
  align-items: flex-start;
  margin: 0 -1rem;
  min-height: 0;
}

/* ── Sidebar ───────────────────────────────── */
.geo-sidebar {
  width: 228px;
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

.geo-sidebar::-webkit-scrollbar {
  width: 3px;
}
.geo-sidebar::-webkit-scrollbar-thumb {
  background: var(--va-background-border);
  border-radius: 3px;
}

.geo-sidebar-inner {
  padding: 18px 12px 28px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.geo-sidebar-filters {
  display: flex;
  gap: 4px;
  padding: 0 2px 2px;
  flex-wrap: wrap;
}

.geo-filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--va-background-border);
  background: transparent;
  color: var(--va-text-secondary);
  transition: all 0.15s;
  user-select: none;
}

.geo-filter-toggle:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}
.geo-filter-toggle.active {
  background: var(--va-primary);
  border-color: var(--va-primary);
  color: #fff;
}

.geo-sidebar-div {
  height: 1px;
  background: var(--va-background-border);
  margin: 6px 2px;
}

.geo-sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 10px 9px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  position: relative;
  overflow: hidden;
}

.geo-sidebar-item:hover {
  background: var(--va-background-secondary);
}
.geo-sidebar-item.active {
  background: rgba(99, 102, 241, 0.1);
}
.geo-sidebar-item.scroll-active:not(.active) {
  background: var(--va-background-element);
}

/* 侧边栏活跃指示粗线条 */
.geo-sidebar-active-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 70%;
  border-radius: 0 3px 3px 0;
  background: var(--cat-color, var(--va-primary));
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.geo-sidebar-item.active .geo-sidebar-active-bar,
.geo-sidebar-item.scroll-active .geo-sidebar-active-bar {
  transform: translateY(-50%) scaleY(1);
}

/* 兼容旧的 dot 元素（已在模板中替换，此处保留以防万一） */
.geo-sidebar-dot {
  display: none;
}

.geo-sidebar-icon {
  flex-shrink: 0;
  color: var(--va-text-secondary);
  transition: color 0.15s;
}

.geo-sidebar-item.active .geo-sidebar-icon {
  color: var(--cat-color, var(--va-primary));
}

.geo-sidebar-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--va-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.geo-sidebar-item.active .geo-sidebar-name {
  color: var(--va-text-primary);
  font-weight: 600;
}

.geo-sidebar-count {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--va-text-secondary);
  background: var(--va-background-element);
  border-radius: 10px;
  padding: 1px 7px;
  min-width: 22px;
  text-align: center;
}

.geo-sidebar-item.active .geo-sidebar-count {
  background: rgba(99, 102, 241, 0.15);
  color: var(--va-primary);
}

/* ── Main Content ──────────────────────────── */
.geo-main-content {
  flex: 1;
  min-width: 0;
  padding: 2rem 2rem 2.5rem;
  overflow-y: auto;
}

/* ── Section ───────────────────────────────── */
.geo-section {
  margin-bottom: 2rem;
}

.geo-section-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 1rem;
}

.geo-section-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.geo-section-badge {
  display: inline-block;
  padding: 2px 7px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--va-primary);
  border: 1px solid rgba(99, 102, 241, 0.22);
  border-radius: 9px;
  font-size: 10.5px;
  font-weight: 500;
}

/* ── Featured ──────────────────────────────── */
.geo-featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 12px;
}

.geo-featured-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  background: var(--va-background-secondary);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.geo-featured-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.geo-featured-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.geo-featured-info {
  flex: 1;
  min-width: 0;
}

.geo-featured-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

.geo-featured-name {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.geo-featured-badges {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

/* Highlights list */
.geo-featured-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.geo-featured-highlights li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--va-text-secondary);
}

.geo-featured-desc {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin: 0 0 6px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.geo-featured-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.geo-pricing-tag {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--va-text-secondary);
  background: var(--va-background-element);
  padding: 2px 7px;
  border-radius: 5px;
}

.geo-github-info {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--va-text-secondary);
}

.geo-featured-arrow {
  flex-shrink: 0;
  color: var(--va-text-secondary);
  opacity: 0.3;
  transition: opacity 0.2s;
  margin-top: 2px;
}

.geo-featured-card:hover .geo-featured-arrow {
  opacity: 0.7;
}

/* ── Result bar ────────────────────────────── */
.geo-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 10px 14px;
  background: var(--va-background-secondary);
  border-radius: 10px;
  border: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.geo-result-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--va-text-secondary);
}

.geo-clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--va-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 5px;
  transition: all 0.15s;
}

.geo-clear-btn:hover {
  background: var(--va-background-element);
  color: var(--va-text-primary);
}

/* ── Category Group ────────────────────────── */
.geo-category-group {
  margin-bottom: 3rem;
}

.geo-cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding: 16px 20px;
  background: var(--va-background-secondary);
  border-radius: 12px;
  border: none;
  border-left: 4px solid;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
  gap: 10px;
}

.geo-cat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.geo-cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.geo-cat-name-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 2px;
}

.geo-cat-name {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.geo-cat-badge {
  font-size: 10.5px;
  padding: 1px 6px;
  background: var(--va-background-element);
  border-radius: 6px;
  color: var(--va-text-secondary);
  border: 1px solid var(--va-background-border);
}

.geo-cat-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0;
}

.geo-cat-count {
  padding: 3px 8px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Tools Grid：改为 3 列，增加间距 ── */
.geo-tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* 卡片：去掉边框，改为阴影 */
.geo-tool-card {
  padding: 16px 18px;
  background: var(--va-background-secondary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 9px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.geo-tool-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.geo-tool-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.geo-tool-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.geo-tool-badges {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.geo-tool-name {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.geo-tool-name-en {
  font-size: 11px;
  color: var(--va-text-secondary);
  margin: -4px 0 0;
}

/* Highlights in card */
.geo-tool-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 7px 8px;
  background: var(--va-background-element);
  border-radius: 6px;
}

.geo-tool-highlights li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--va-text-secondary);
}

.geo-tool-highlights li span {
  line-height: 1.4;
}

.geo-tool-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* GitHub block */
.geo-tool-github {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  background: var(--va-background-element);
  border-radius: 6px;
  border: 1px solid var(--va-background-border);
  gap: 5px;
}

.geo-github-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--va-text-secondary);
  text-decoration: none;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s;
}

.geo-github-link:hover {
  color: var(--va-primary);
}

.geo-github-stats {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: var(--va-text-secondary);
  flex-shrink: 0;
}

.geo-github-stats span {
  display: flex;
  align-items: center;
  gap: 2px;
}

.geo-github-lang {
  padding: 1px 5px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--va-primary);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

/* Footer */
.geo-tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.geo-tool-tags {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.geo-tool-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.geo-pricing-inline {
  font-size: 10.5px;
  color: var(--va-text-secondary);
  white-space: nowrap;
}

.geo-tool-visit {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--va-primary);
  opacity: 0;
  transition: opacity 0.2s;
}

.geo-tool-card:hover .geo-tool-visit {
  opacity: 1;
}

/* ── Badges ────────────────────────────────── */
.geo-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
  white-space: nowrap;
}

.geo-badge-free {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.geo-badge-freeplan {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.22);
}

.geo-badge-oss {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.22);
}

.geo-badge-api {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.22);
}

.geo-badge-cn {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.geo-badge-global {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.18);
}

/* ── Tags ──────────────────────────────────── */
.geo-tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10.5px;
  background: var(--va-background-element);
  color: var(--va-text-secondary);
  border: 1px solid var(--va-background-border);
}

.geo-tag-sm {
  padding: 1px 5px;
  font-size: 10px;
}

/* ── Tips ──────────────────────────────────── */
.geo-tips-section {
  background: var(--va-background-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 0.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.geo-tips-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 1rem;
}

.geo-tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
}

.geo-tip-card {
  padding: 18px;
  background: var(--va-background-primary);
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.geo-tip-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
}

.geo-tip-emoji {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.geo-tip-card h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 7px;
  color: var(--va-text-primary);
}

.geo-tip-card p {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.65;
}

.geo-tip-card p strong {
  color: var(--va-text-primary);
}

/* ── Empty ─────────────────────────────────── */
.geo-empty {
  text-align: center;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
}

.geo-empty p {
  font-size: 13.5px;
  color: var(--va-text-secondary);
  margin: 0;
}

/* ── Responsive ────────────────────────────── */
@media (max-width: 1200px) {
  .geo-tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .geo-body {
    flex-direction: column;
  }

  .geo-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid var(--va-background-border);
    overflow-x: auto;
    overflow-y: hidden;
  }

  .geo-sidebar-inner {
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 10px 12px;
    gap: 4px;
    overflow-x: auto;
  }

  .geo-sidebar-filters {
    display: none;
  }

  .geo-sidebar-div {
    width: 1px;
    height: auto;
    margin: 0 4px;
    align-self: stretch;
  }

  .geo-sidebar-item {
    flex-shrink: 0;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 20px;
  }

  .geo-sidebar-active-bar,
  .geo-sidebar-dot,
  .geo-sidebar-count {
    display: none;
  }

  .geo-sidebar-name {
    font-size: 12.5px;
  }

  .geo-main-content {
    padding: 1.2rem;
  }

  .geo-tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .geo-hero-title {
    font-size: 1.6rem;
  }
  .geo-stats {
    flex-wrap: wrap;
  }
  .geo-stat {
    padding: 7px 14px;
    flex: 1 1 45%;
  }
  .geo-stat-num {
    font-size: 1rem;
  }
  .geo-tools-grid {
    grid-template-columns: 1fr;
  }
  .geo-tips-grid {
    grid-template-columns: 1fr;
  }
  .geo-region-tabs {
    flex-wrap: wrap;
  }
  .geo-concept-bar {
    font-size: 11px;
  }
}
</style>
