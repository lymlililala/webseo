<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { aeoCategories, allAeoTools, featuredAeoTools, type AeoTool, type AeoCategory } from '../../data/aeo-tools'

const searchQuery = ref('')
const activeCategory = ref('all')
const showOpenSourceOnly = ref(false)
const showFreeOnly = ref(false)

const filteredTools = computed(() => {
  let tools: AeoTool[] = []

  if (activeCategory.value === 'all') {
    tools = allAeoTools
  } else {
    const cat = aeoCategories.find((c) => c.id === activeCategory.value)
    tools = cat ? cat.tools : []
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
    const cat = aeoCategories.find((c) => c.id === activeCategory.value)
    if (cat) {
      return [{ ...cat, tools: filteredTools.value }]
    }
    return []
  }
  return aeoCategories
    .map((cat) => ({
      ...cat,
      tools: filteredTools.value.filter((t) => cat.tools.some((ct) => ct.id === t.id)),
    }))
    .filter((cat) => cat.tools.length > 0)
})

const totalTools = computed(() => allAeoTools.length)
const openSourceCount = computed(() => allAeoTools.filter((t) => t.isOpenSource).length)
const freeCount = computed(() => allAeoTools.filter((t) => t.isFree || t.hasFreeplan).length)
const chinaCount = computed(
  () =>
    allAeoTools.filter((t) =>
      t.tags.some((tag) => ['国内平台', '豆包', 'DeepSeek', 'Kimi', '国内AI平台'].includes(tag)),
    ).length,
)

function openTool(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function getCategoryColor(categoryId: string): string {
  const cat = aeoCategories.find((c) => c.id === categoryId)
  return cat?.color || '#EC4899'
}

function getToolCategory(tool: AeoTool): AeoCategory | undefined {
  return aeoCategories.find((c) => c.tools.some((t) => t.id === tool.id))
}

function selectCategory(catId: string) {
  activeCategory.value = catId
  const el = document.querySelector('.aeo-main-content')
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  searchQuery.value = ''
  showOpenSourceOnly.value = false
  showFreeOnly.value = false
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
  document.querySelectorAll('.aeo-category-group[data-cat-id]').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const activeSidebarItem = computed(() => (activeCategory.value === 'all' ? scrollSpy.value : activeCategory.value))
</script>

<template>
  <div class="aeo-nav-page">
    <!-- ── Hero ─────────────────────────────────────────── -->
    <div class="aeo-hero">
      <div class="aeo-hero-bg" />
      <div class="aeo-hero-content">
        <div class="aeo-hero-badge">
          <VaIcon name="question_answer" size="14px" />
          <span>AEO · Answer Engine Optimization 工具导航</span>
        </div>
        <h1 class="aeo-hero-title">
          答案引擎优化工具<br />
          <span class="aeo-hero-title-accent">全景导航</span>
        </h1>
        <p class="aeo-hero-subtitle">
          深度整合 <strong>{{ totalTools }}+</strong> 款工具与资源，6 大分类覆盖 <strong>AEO 专项 SaaS</strong>、<strong
            >企业 SEO 模块</strong
          >、<strong>内容优化</strong>、<strong>问题研究</strong>、<strong>结构化数据</strong>、<strong
            >国内平台</strong
          >
        </p>

        <div class="aeo-search-wrap">
          <VaInput
            v-model="searchQuery"
            placeholder="搜索工具名称、功能特点、标签..."
            class="aeo-search-input"
            clearable
          >
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>

        <div class="aeo-stats">
          <div class="aeo-stat">
            <span class="aeo-stat-num">{{ totalTools }}+</span>
            <span class="aeo-stat-label">精选工具</span>
          </div>
          <div class="aeo-stat-div" />
          <div class="aeo-stat">
            <span class="aeo-stat-num">{{ openSourceCount }}</span>
            <span class="aeo-stat-label">⭐ 开源项目</span>
          </div>
          <div class="aeo-stat-div" />
          <div class="aeo-stat">
            <span class="aeo-stat-num">{{ freeCount }}</span>
            <span class="aeo-stat-label">🆓 含免费版</span>
          </div>
          <div class="aeo-stat-div" />
          <div class="aeo-stat">
            <span class="aeo-stat-num">{{ chinaCount }}</span>
            <span class="aeo-stat-label">🇨🇳 国内平台</span>
          </div>
        </div>

        <!-- Concept bar -->
        <div class="aeo-concept-bar">
          <div class="aeo-concept-item">
            <VaIcon name="question_answer" size="15px" color="#F9A8D4" />
            <span><strong>AEO</strong> = Answer Engine Optimization</span>
          </div>
          <span class="aeo-concept-sep">·</span>
          <div class="aeo-concept-item">
            <VaIcon name="description" size="15px" color="#60A5FA" />
            <span><strong>llms.txt</strong> = AI 可读结构标准</span>
          </div>
          <span class="aeo-concept-sep">·</span>
          <div class="aeo-concept-item">
            <VaIcon name="schema" size="15px" color="#34D399" />
            <span><strong>JSON-LD</strong> = 结构化数据标记</span>
          </div>
          <span class="aeo-concept-sep">·</span>
          <div class="aeo-concept-item">
            <VaIcon name="help_outline" size="15px" color="#FCD34D" />
            <span><strong>PAA</strong> = People Also Ask 答案框</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Body ─────────────────────────────────────────── -->
    <div class="aeo-body">
      <!-- Sidebar -->
      <aside class="aeo-sidebar">
        <div class="aeo-sidebar-inner">
          <!-- Filters -->
          <div class="aeo-sidebar-filters">
            <label class="aeo-filter-toggle" :class="{ active: showFreeOnly }" @click="showFreeOnly = !showFreeOnly">
              <VaIcon name="money_off" size="12px" />
              含免费
            </label>
            <label
              class="aeo-filter-toggle"
              :class="{ active: showOpenSourceOnly }"
              @click="showOpenSourceOnly = !showOpenSourceOnly"
            >
              <VaIcon name="code" size="12px" />
              开源
            </label>
          </div>

          <div class="aeo-sidebar-div" />

          <!-- All -->
          <button class="aeo-sidebar-item" :class="{ active: activeCategory === 'all' }" @click="selectCategory('all')">
            <span class="aeo-sidebar-active-bar" />
            <VaIcon name="apps" size="16px" class="aeo-sidebar-icon" />
            <span class="aeo-sidebar-name">全部工具</span>
            <span class="aeo-sidebar-count">{{ totalTools }}</span>
          </button>

          <!-- Categories -->
          <button
            v-for="cat in aeoCategories"
            :key="cat.id"
            class="aeo-sidebar-item"
            :class="{
              active: activeCategory === cat.id,
              'scroll-active': activeCategory === 'all' && activeSidebarItem === cat.id,
            }"
            :style="{ '--cat-color': cat.color }"
            @click="selectCategory(cat.id)"
          >
            <span class="aeo-sidebar-active-bar" :style="{ background: cat.color }" />
            <VaIcon
              :name="cat.icon"
              size="16px"
              class="aeo-sidebar-icon"
              :style="{ color: activeCategory === cat.id ? cat.color : '' }"
            />
            <span class="aeo-sidebar-name">{{ cat.name }}</span>
            <span class="aeo-sidebar-count">{{ cat.tools.length }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="aeo-main-content">
        <!-- Featured (only all + no search) -->
        <div v-if="activeCategory === 'all' && !searchQuery" class="aeo-section">
          <div class="aeo-section-header">
            <VaIcon name="star" color="warning" size="17px" />
            <h2 class="aeo-section-title">精选推荐</h2>
            <span class="aeo-section-badge">编辑严选</span>
          </div>
          <div class="aeo-featured-grid">
            <div v-for="tool in featuredAeoTools" :key="tool.id" class="aeo-featured-card" @click="openTool(tool.url)">
              <div
                class="aeo-featured-icon"
                :style="{
                  background: getCategoryColor(getToolCategory(tool)?.id || '') + '18',
                  borderColor: getCategoryColor(getToolCategory(tool)?.id || '') + '3a',
                }"
              >
                <span class="aeo-icon-wrap">
                  <VaIcon
                    :name="getToolCategory(tool)?.icon || 'question_answer'"
                    :color="getCategoryColor(getToolCategory(tool)?.id || '')"
                    size="22px"
                  />
                </span>
              </div>
              <div class="aeo-featured-info">
                <div class="aeo-featured-top">
                  <h3 class="aeo-featured-name">{{ tool.name }}</h3>
                  <div class="aeo-featured-badges">
                    <span v-if="tool.isFree" class="aeo-badge aeo-badge-free">免费</span>
                    <span v-else-if="tool.hasFreeplan" class="aeo-badge aeo-badge-freeplan">含免费版</span>
                    <span v-if="tool.isOpenSource" class="aeo-badge aeo-badge-oss">开源</span>
                    <span v-if="tool.hasApi" class="aeo-badge aeo-badge-api">API</span>
                  </div>
                </div>
                <!-- Highlights -->
                <ul v-if="tool.highlights?.length" class="aeo-featured-highlights">
                  <li v-for="h in tool.highlights" :key="h">
                    <VaIcon name="check_circle" size="12px" color="success" />
                    <span>{{ h }}</span>
                  </li>
                </ul>
                <p class="aeo-featured-desc">{{ tool.description }}</p>
                <div class="aeo-featured-bottom">
                  <div v-if="tool.pricing" class="aeo-pricing-tag">
                    <VaIcon name="sell" size="12px" />
                    {{ tool.pricing }}
                  </div>
                  <div v-if="tool.github" class="aeo-github-info">
                    <VaIcon name="star_border" size="12px" />
                    <span>{{ formatStars(tool.github.stars) }}</span>
                  </div>
                </div>
              </div>
              <VaIcon name="open_in_new" size="14px" class="aeo-featured-arrow" />
            </div>
          </div>
        </div>

        <!-- Result bar -->
        <div class="aeo-result-bar">
          <span class="aeo-result-count">
            <VaIcon name="format_list_bulleted" size="13px" />
            找到 <strong>{{ filteredTools.length }}</strong> 个工具
          </span>
          <button v-if="searchQuery || showOpenSourceOnly || showFreeOnly" class="aeo-clear-btn" @click="clearFilters">
            <VaIcon name="close" size="12px" />
            清除筛选
          </button>
        </div>

        <!-- Empty -->
        <div v-if="filteredTools.length === 0" class="aeo-empty">
          <VaIcon name="search_off" size="50px" color="secondary" />
          <p>没有找到匹配的工具，试试其他关键词</p>
          <VaButton preset="secondary" size="small" @click="clearFilters"> 清除所有筛选 </VaButton>
        </div>

        <!-- Tools by Category -->
        <div v-for="group in groupedFilteredTools" :key="group.id" class="aeo-category-group" :data-cat-id="group.id">
          <div class="aeo-cat-header" :style="{ borderLeftColor: group.color }">
            <div class="aeo-cat-header-left">
              <div class="aeo-cat-icon" :style="{ background: group.color + '18' }">
                <span class="aeo-icon-wrap"
                  ><VaIcon :name="group.icon" :style="{ color: group.color }" size="19px"
                /></span>
              </div>
              <div>
                <div class="aeo-cat-name-row">
                  <h2 class="aeo-cat-name">{{ group.name }}</h2>
                  <span v-if="group.badge" class="aeo-cat-badge">{{ group.badge }}</span>
                </div>
                <p class="aeo-cat-desc">{{ group.description }}</p>
              </div>
            </div>
            <span class="aeo-cat-count" :style="{ background: group.color + '18', color: group.color }">
              {{ group.tools.length }} 个工具
            </span>
          </div>

          <div class="aeo-tools-grid">
            <div
              v-for="tool in group.tools"
              :key="tool.id"
              class="aeo-tool-card"
              :style="{ '--tool-color': group.color }"
              @click="openTool(tool.url)"
            >
              <!-- Top row -->
              <div class="aeo-tool-top">
                <div class="aeo-tool-icon" :style="{ background: group.color + '14', borderColor: group.color + '35' }">
                  <span class="aeo-icon-wrap"
                    ><VaIcon :name="group.icon" :style="{ color: group.color }" size="17px"
                  /></span>
                </div>
                <div class="aeo-tool-badges">
                  <span v-if="tool.isFree" class="aeo-badge aeo-badge-free">免费</span>
                  <span v-else-if="tool.hasFreeplan" class="aeo-badge aeo-badge-freeplan">含免费</span>
                  <span v-if="tool.isOpenSource" class="aeo-badge aeo-badge-oss">开源</span>
                  <span v-if="tool.hasApi" class="aeo-badge aeo-badge-api">API</span>
                </div>
              </div>

              <!-- Name -->
              <h3 class="aeo-tool-name">{{ tool.name }}</h3>
              <p v-if="tool.nameEn && tool.nameEn !== tool.name" class="aeo-tool-name-en">{{ tool.nameEn }}</p>

              <!-- Highlights -->
              <ul v-if="tool.highlights?.length" class="aeo-tool-highlights">
                <li v-for="h in tool.highlights.slice(0, 3)" :key="h">
                  <VaIcon name="check" size="11px" />
                  <span>{{ h }}</span>
                </li>
              </ul>

              <p class="aeo-tool-desc">{{ tool.description }}</p>

              <!-- GitHub Stats -->
              <div v-if="tool.github" class="aeo-tool-github">
                <a
                  :href="`https://github.com/${tool.github.repo}`"
                  class="aeo-github-link"
                  @click.stop="openTool(`https://github.com/${tool.github.repo}`)"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                  {{ tool.github.repo }}
                </a>
                <div class="aeo-github-stats">
                  <span><VaIcon name="star_border" size="11px" />{{ formatStars(tool.github.stars) }}</span>
                  <span v-if="tool.github.language" class="aeo-github-lang">{{ tool.github.language }}</span>
                </div>
              </div>

              <!-- Footer -->
              <div class="aeo-tool-footer">
                <div class="aeo-tool-tags">
                  <span v-for="tag in tool.tags.slice(0, 2)" :key="tag" class="aeo-tag aeo-tag-sm">{{ tag }}</span>
                </div>
                <div class="aeo-tool-meta">
                  <span v-if="tool.pricing" class="aeo-pricing-inline">{{ tool.pricing }}</span>
                  <div class="aeo-tool-visit">
                    <VaIcon name="open_in_new" size="11px" />
                    <span>访问</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips Section -->
        <div class="aeo-tips-section">
          <div class="aeo-tips-header">
            <VaIcon name="lightbulb" color="warning" size="17px" />
            <h2 class="aeo-section-title">AEO 实战路径</h2>
          </div>
          <div class="aeo-tips-grid">
            <div class="aeo-tip-card">
              <div class="aeo-tip-emoji">📡</div>
              <h3>第一步：监测 AI 可见度基线</h3>
              <p>
                用 <strong>Otterly.AI</strong>（$29/mo，15000+用户）或
                <strong>GetCito/Elmo</strong>（开源免费）快速建立品牌在 ChatGPT、Perplexity、Gemini 等 AI
                引擎中的曝光基线。国内品牌首选<strong>透镜 GEO</strong>（免费）。
              </p>
            </div>
            <div class="aeo-tip-card">
              <div class="aeo-tip-emoji">❓</div>
              <h3>第二步：挖掘 AEO 问题关键词</h3>
              <p>
                通过 <strong>AlsoAsked</strong> 可视化 PAA 问题树和 <strong>AnswerThePublic</strong>（5W1H
                问题聚合）发现用户真实提问意图，优先布局高频被 AI 引用的答案型内容。
              </p>
            </div>
            <div class="aeo-tip-card">
              <div class="aeo-tip-emoji">📝</div>
              <h3>第三步：创作答案友好型内容</h3>
              <p>
                使用 <strong>Frase.io</strong>（AI 摘要+FAQ生成，$14.99/mo）或
                <strong>Surfer SEO</strong>（内容评分+LLM优化）创作结构清晰、语义完整的内容，兼顾 Google 排名与 AI
                引用。
              </p>
            </div>
            <div class="aeo-tip-card">
              <div class="aeo-tip-emoji">🗂️</div>
              <h3>第四步：添加结构化数据</h3>
              <p>
                WordPress 站点用 <strong>Rank Math</strong> 自动生成 FAQ/HowTo Schema；现代框架用
                <strong>aeo.js</strong>（⭐76）一键生成 llms.txt + JSON-LD；用
                <strong>Google 富媒体结果测试</strong>（免费）验证标记是否生效。
              </p>
            </div>
            <div class="aeo-tip-card">
              <div class="aeo-tip-emoji">🔧</div>
              <h3>第五步：升级为企业级方案</h3>
              <p>
                已有 SEO 工具链的企业可直接启用 <strong>Semrush AI Visibility</strong> 或
                <strong>Ahrefs Brand Radar</strong> 中的 AEO 模块，无需替换现有系统即可平滑扩展 AEO 能力。
              </p>
            </div>
            <div class="aeo-tip-card">
              <div class="aeo-tip-emoji">🇨🇳</div>
              <h3>第六步：覆盖国内 AI 引擎</h3>
              <p>
                国内市场优先使用 <strong>AIDSO 爱搜</strong>（DSO+GEO+AEO 三合一）或
                <strong>移山科技</strong>（7套自研系统），覆盖豆包、DeepSeek、Kimi、通义千问等主流国内 AI 平台，建立国内
                AI 可见度优势。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ────────────────────────────────── */
.aeo-nav-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ────────────────────────────────── */
.aeo-hero {
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1155 45%, #1a0e35 100%);
  padding: 3.2rem 2rem 2.6rem;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.aeo-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(236, 72, 153, 0.2) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 15% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.aeo-hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.aeo-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.4);
  color: #f9a8d4;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.9rem;
}

.aeo-hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 0.7rem;
}

.aeo-hero-title-accent {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.aeo-hero-subtitle {
  color: #c4b5fd;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.3rem;
}

.aeo-hero-subtitle strong {
  color: #f0abfc;
}

/* ── Search ──────────────────────────────── */
.aeo-search-wrap {
  max-width: 560px;
  margin: 0 auto 2rem;
}

.aeo-search-input {
  width: 100%;
}

/* 搜索框在深色 Hero 背景下强制白色文字 */
.aeo-search-input :deep(input) {
  color: #fff !important;
  font-size: 15px !important;
  height: 44px;
}
.aeo-search-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}
.aeo-search-input :deep(.va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  padding: 0 18px !important;
}
.aeo-search-input :deep(.va-input-wrapper:hover .va-input-wrapper__field),
.aeo-search-input :deep(.va-input-wrapper--focused .va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3) !important;
}

/* ── Stats：卡片化 ───────────────────────────────── */
.aeo-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.aeo-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(236, 72, 153, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
  min-width: 82px;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.aeo-stat:hover {
  background: rgba(236, 72, 153, 0.1);
}

.aeo-stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f9a8d4;
  line-height: 1;
}

.aeo-stat-label {
  font-size: 10.5px;
  color: #a78bfa;
  white-space: nowrap;
  text-align: center;
}

/* 旧分隔线隐藏 */
.aeo-stat-div {
  display: none;
}

/* ── Concept bar ─────────────────────────── */
.aeo-concept-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.75rem;
  color: #c4b5fd;
  margin-top: 0.7rem;
}

.aeo-concept-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.aeo-concept-sep {
  color: rgba(196, 181, 253, 0.4);
}

/* ── Body ────────────────────────────────── */
.aeo-body {
  display: flex;
  flex: 1;
  gap: 0;
  overflow: hidden;
}

/* ── Sidebar ─────────────────────────────── */
.aeo-sidebar {
  width: 228px;
  flex-shrink: 0;
  border-right: 1px solid var(--va-background-border);
  overflow-y: auto;
  position: sticky;
  top: 60px;
  max-height: calc(100vh - 60px);
  background: var(--va-background-primary);
  scrollbar-width: thin;
  scrollbar-color: var(--va-background-border) transparent;
}

.aeo-sidebar-inner {
  padding: 18px 12px 28px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.aeo-sidebar-filters {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.aeo-filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.72rem;
  cursor: pointer;
  border: 1px solid var(--va-background-border);
  color: var(--va-secondary);
  transition: all 0.15s;
  user-select: none;
}

.aeo-filter-toggle:hover,
.aeo-filter-toggle.active {
  background: rgba(236, 72, 153, 0.12);
  border-color: rgba(236, 72, 153, 0.45);
  color: #ec4899;
}

.aeo-sidebar-div {
  height: 1px;
  background: var(--va-background-border);
  margin: 4px 0;
}

.aeo-sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px 9px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  color: var(--va-text-primary);
  transition: all 0.15s;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.aeo-sidebar-item:hover {
  background: var(--va-background-secondary);
}

.aeo-sidebar-item.active,
.aeo-sidebar-item.scroll-active {
  background: rgba(236, 72, 153, 0.08);
}

/* 活跃状态左侧粗线条 */
.aeo-sidebar-active-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 70%;
  border-radius: 0 3px 3px 0;
  background: var(--cat-color, #ec4899);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.aeo-sidebar-item.active .aeo-sidebar-active-bar,
.aeo-sidebar-item.scroll-active .aeo-sidebar-active-bar {
  transform: translateY(-50%) scaleY(1);
}

/* 兼容旧 dot */
.aeo-sidebar-dot {
  display: none;
}

.aeo-sidebar-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.aeo-sidebar-item.active .aeo-sidebar-icon,
.aeo-sidebar-item.scroll-active .aeo-sidebar-icon {
  opacity: 1;
}

.aeo-sidebar-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: var(--va-text-secondary);
  transition: color 0.15s;
}

.aeo-sidebar-item.active .aeo-sidebar-name,
.aeo-sidebar-item.scroll-active .aeo-sidebar-name {
  color: var(--va-text-primary);
  font-weight: 600;
}

.aeo-sidebar-count {
  font-size: 11px;
  background: var(--va-background-element);
  color: var(--va-text-secondary);
  padding: 1px 7px;
  border-radius: 10px;
  min-width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.aeo-sidebar-item.active .aeo-sidebar-count,
.aeo-sidebar-item.scroll-active .aeo-sidebar-count {
  background: rgba(236, 72, 153, 0.15);
  color: #ec4899;
}

/* ── Main ────────────────────────────────── */
.aeo-main-content {
  flex: 1;
  padding: 2rem 2rem 2.5rem;
  overflow-y: auto;
  min-width: 0;
}

/* ── Section header ──────────────────────── */
.aeo-section {
  margin-bottom: 2rem;
}

.aeo-section-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 1rem;
}

.aeo-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0;
}

.aeo-section-badge {
  font-size: 0.7rem;
  background: rgba(249, 115, 22, 0.12);
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

/* ── Featured grid ───────────────────────── */
.aeo-featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 12px;
}

.aeo-featured-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  border: none;
  background: var(--va-background-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.aeo-featured-card:hover {
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.12);
  transform: translateY(-4px);
}

.aeo-featured-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  border-radius: 13px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.aeo-featured-info {
  flex: 1;
  min-width: 0;
}

.aeo-featured-top {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 5px;
}

.aeo-featured-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0;
}

.aeo-featured-badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.aeo-featured-highlights {
  list-style: none;
  margin: 5px 0 6px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.aeo-featured-highlights li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: var(--va-text-primary);
}

.aeo-featured-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  line-height: 1.55;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aeo-featured-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.aeo-pricing-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: #ec4899;
  background: rgba(236, 72, 153, 0.08);
  padding: 2px 8px;
  border-radius: 8px;
}

.aeo-github-info {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  color: var(--va-secondary);
}

.aeo-featured-arrow {
  color: var(--va-secondary);
  opacity: 0.5;
  flex-shrink: 0;
  margin-top: 2px;
}

/* ── Result bar ──────────────────────────── */
.aeo-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  margin-bottom: 1.5rem;
  background: var(--va-background-secondary);
  border-radius: 10px;
  border: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.aeo-result-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--va-text-secondary);
}

.aeo-clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--va-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}

.aeo-clear-btn:hover {
  background: var(--va-background-element);
  color: var(--va-text-primary);
}

/* ── Empty ───────────────────────────────── */
.aeo-empty {
  text-align: center;
  padding: 3rem;
  color: var(--va-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ── Category Group ──────────────────────── */
.aeo-category-group {
  margin-bottom: 3rem;
}

.aeo-cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-left: 4px solid transparent;
  background: var(--va-background-secondary);
  border-radius: 12px;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.aeo-cat-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.aeo-cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.aeo-cat-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.aeo-cat-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0;
}

.aeo-cat-badge {
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  font-weight: 600;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.aeo-cat-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin: 2px 0 0;
  line-height: 1.5;
}

.aeo-cat-count {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Tools Grid：改为 3 列，增加间距 ──────────────────────────── */
.aeo-tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* 卡片：去掉硬边框，改为阴影 + 圆角 */
.aeo-tool-card {
  padding: 16px 18px;
  border-radius: 12px;
  border: none;
  background: var(--va-background-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 9px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.aeo-tool-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.aeo-tool-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.aeo-tool-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.aeo-tool-badges {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.aeo-tool-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0;
  line-height: 1.35;
}

.aeo-tool-name-en {
  font-size: 0.72rem;
  color: var(--va-secondary);
  margin: 0;
}

.aeo-tool-highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.aeo-tool-highlights li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.71rem;
  color: var(--va-text-primary);
}

.aeo-tool-desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  line-height: 1.55;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── GitHub info ─────────────────────────── */
.aeo-tool-github {
  border-top: 1px solid var(--va-background-border);
  padding-top: 6px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.aeo-github-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--va-secondary);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
  transition: color 0.15s;
}

.aeo-github-link:hover {
  color: #ec4899;
}

.aeo-github-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.aeo-github-stats span {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
  color: var(--va-secondary);
}

.aeo-github-lang {
  font-size: 0.68rem;
  background: var(--va-background-secondary);
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Footer ──────────────────────────────── */
.aeo-tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 2px;
}

.aeo-tool-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.aeo-tool-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.aeo-pricing-inline {
  font-size: 0.7rem;
  color: var(--va-secondary);
}

.aeo-tool-visit {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  color: #ec4899;
  opacity: 0.8;
}

/* ── Icon wrap ───────────────────────────── */
.aeo-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  width: 100%;
  height: 100%;
}

/* ── Badges ──────────────────────────────── */
.aeo-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
}

.aeo-badge-free {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.aeo-badge-freeplan {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.aeo-badge-oss {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.aeo-badge-api {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

/* ── Tags ────────────────────────────────── */
.aeo-tag {
  background: var(--va-background-secondary);
  color: var(--va-secondary);
  border-radius: 6px;
  border: 1px solid var(--va-background-border);
}

.aeo-tag-sm {
  font-size: 0.65rem;
  padding: 1px 6px;
}

/* ── Tips ────────────────────────────────── */
.aeo-tips-section {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--va-background-secondary);
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.aeo-tips-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 1rem;
}

.aeo-tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
}

.aeo-tip-card {
  padding: 18px;
  border-radius: 12px;
  border: none;
  background: var(--va-background-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.aeo-tip-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
}

.aeo-tip-emoji {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.aeo-tip-card h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0 0 7px;
}

.aeo-tip-card p {
  font-size: 13px;
  color: var(--va-text-secondary);
  line-height: 1.65;
  margin: 0;
}

.aeo-tip-card p strong {
  color: #ec4899;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 1200px) {
  .aeo-tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .aeo-hero-title {
    font-size: 1.8rem;
  }
  .aeo-body {
    flex-direction: column;
  }
  .aeo-sidebar {
    width: 100%;
    max-height: none;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--va-background-border);
    overflow-x: auto;
    overflow-y: hidden;
  }
  .aeo-sidebar-inner {
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 10px 12px;
    overflow-x: auto;
    gap: 4px;
  }
  .aeo-sidebar-item {
    flex-shrink: 0;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 20px;
  }
  .aeo-sidebar-active-bar,
  .aeo-sidebar-dot,
  .aeo-sidebar-count {
    display: none;
  }
  .aeo-main-content {
    padding: 1.2rem;
  }
  .aeo-tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .aeo-hero-title {
    font-size: 1.6rem;
  }
  .aeo-stats {
    gap: 8px;
  }
  .aeo-stat {
    padding: 10px 14px;
    min-width: 70px;
  }
  .aeo-stat-num {
    font-size: 1.3rem;
  }
  .aeo-featured-grid {
    grid-template-columns: 1fr;
  }
  .aeo-tools-grid {
    grid-template-columns: 1fr;
  }
  .aeo-tips-grid {
    grid-template-columns: 1fr;
  }
  .aeo-concept-bar {
    font-size: 0.7rem;
  }
}
</style>
