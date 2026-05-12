<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  aiCheckerCategories,
  allAiCheckerTools,
  featuredAiCheckerTools,
  type AiCheckerTool,
  type AiCheckerCategory,
} from '../../data/ai-checker-tools'

const searchQuery = ref('')
const activeCategory = ref('all')
const activeRegion = ref<'all' | 'cn' | 'global'>('all')
const showFreeOnly = ref(false)

const filteredTools = computed(() => {
  let tools: AiCheckerTool[] = []
  if (activeCategory.value === 'all') {
    tools = allAiCheckerTools
  } else {
    const cat = aiCheckerCategories.find((c) => c.id === activeCategory.value)
    tools = cat ? cat.tools : []
  }
  if (activeRegion.value !== 'all') {
    tools = tools.filter((t) => t.region === activeRegion.value)
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
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }
  return tools
})

const groupedFilteredTools = computed(() => {
  if (activeCategory.value !== 'all') {
    const cat = aiCheckerCategories.find((c) => c.id === activeCategory.value)
    if (cat) return [{ ...cat, tools: filteredTools.value }]
    return []
  }
  return aiCheckerCategories
    .map((cat) => ({
      ...cat,
      tools: filteredTools.value.filter((t) => cat.tools.some((ct) => ct.id === t.id)),
    }))
    .filter((cat) => cat.tools.length > 0)
})

const totalTools = computed(() => allAiCheckerTools.length)
const cnToolsCount = computed(() => allAiCheckerTools.filter((t) => t.region === 'cn').length)
const globalToolsCount = computed(() => allAiCheckerTools.filter((t) => t.region === 'global').length)
const freeCount = computed(() => allAiCheckerTools.filter((t) => t.isFree || t.hasFreeplan).length)

function openTool(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function getToolCategory(tool: AiCheckerTool): AiCheckerCategory | undefined {
  return aiCheckerCategories.find((c) => c.tools.some((t) => t.id === tool.id))
}

function selectCategory(catId: string) {
  activeCategory.value = catId
  const el = document.querySelector('.checker-main-content')
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  searchQuery.value = ''
  showFreeOnly.value = false
  activeRegion.value = 'all'
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
  document.querySelectorAll('.checker-category-group[data-cat-id]').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => observer?.disconnect())

const activeSidebarItem = computed(() => (activeCategory.value === 'all' ? scrollSpy.value : activeCategory.value))
</script>

<template>
  <div class="checker-page">
    <!-- ── Hero ──────────────────────────────────────────── -->
    <div class="checker-hero">
      <div class="checker-hero-bg" />
      <div class="checker-hero-content">
        <div class="checker-hero-badge">
          <VaIcon name="health_and_safety" size="14px" />
          <span>AI 搜索可见度 · 聚合体检平台</span>
        </div>

        <h1 class="checker-hero-title">
          AI 搜索可见度<br />
          <span class="checker-hero-accent">全景体检工具</span>
        </h1>

        <p class="checker-hero-subtitle">
          聚合 <strong>{{ totalTools }}+</strong> 款 AI 可见度体检工具，覆盖 <strong>国内 9 大 AI 引擎</strong>和<strong
            >国际主流 AI 平台</strong
          >， 从免费快速体检到企业级监测，帮助品牌全面掌握在 AI 搜索中的曝光情况
        </p>

        <!-- 用户旅程提示 -->
        <div class="checker-journey">
          <div class="checker-journey-step">
            <span class="checker-journey-icon">🔍</span>
            <span>选工具体检</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step">
            <span class="checker-journey-icon">📊</span>
            <span>获取报告</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step">
            <span class="checker-journey-icon">⚡</span>
            <span>发现差距</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step">
            <span class="checker-journey-icon">📈</span>
            <span>优化提升</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step active">
            <span class="checker-journey-icon">✅</span>
            <span>复访监测</span>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="checker-search-wrap">
          <VaInput
            v-model="searchQuery"
            placeholder="搜索工具名称、平台、功能..."
            class="checker-search-input"
            clearable
          >
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>

        <!-- Region tabs -->
        <div class="checker-region-tabs">
          <button
            v-for="r in [
              { key: 'all', label: '全部工具' },
              { key: 'cn', label: '🇨🇳 国内工具' },
              { key: 'global', label: '🌍 国际工具' },
            ]"
            :key="r.key"
            class="checker-region-tab"
            :class="{ active: activeRegion === r.key }"
            @click="activeRegion = r.key as 'all' | 'cn' | 'global'"
          >
            {{ r.label }}
          </button>
        </div>

        <!-- Stats -->
        <div class="checker-stats">
          <div class="checker-stat">
            <span class="checker-stat-num">{{ totalTools }}+</span>
            <span class="checker-stat-label">精选工具</span>
          </div>
          <div class="checker-stat-div" />
          <div class="checker-stat">
            <span class="checker-stat-num">{{ cnToolsCount }}</span>
            <span class="checker-stat-label">🇨🇳 国内工具</span>
          </div>
          <div class="checker-stat-div" />
          <div class="checker-stat">
            <span class="checker-stat-num">{{ globalToolsCount }}</span>
            <span class="checker-stat-label">🌍 国际工具</span>
          </div>
          <div class="checker-stat-div" />
          <div class="checker-stat">
            <span class="checker-stat-num">{{ freeCount }}</span>
            <span class="checker-stat-label">含免费版</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Body ───────────────────────────────────────────── -->
    <div class="checker-body">
      <!-- Sidebar -->
      <aside class="checker-sidebar">
        <div class="checker-sidebar-inner">
          <!-- Free filter -->
          <label class="checker-filter-toggle" :class="{ active: showFreeOnly }" @click="showFreeOnly = !showFreeOnly">
            <VaIcon name="money_off" size="12px" />
            只看免费
          </label>

          <div class="checker-sidebar-div" />

          <!-- All -->
          <button
            class="checker-sidebar-item"
            :class="{ active: activeCategory === 'all' }"
            @click="selectCategory('all')"
          >
            <span class="checker-sidebar-dot" style="background: #10b981" />
            <VaIcon name="apps" size="14px" class="checker-sidebar-icon" />
            <span class="checker-sidebar-name">全部工具</span>
            <span class="checker-sidebar-count">{{ totalTools }}</span>
          </button>

          <!-- Categories -->
          <button
            v-for="cat in aiCheckerCategories"
            :key="cat.id"
            class="checker-sidebar-item"
            :class="{
              active: activeCategory === cat.id,
              'scroll-active': activeCategory === 'all' && activeSidebarItem === cat.id,
            }"
            :style="{ '--cat-color': cat.color }"
            @click="selectCategory(cat.id)"
          >
            <span class="checker-sidebar-dot" :style="{ background: cat.color }" />
            <VaIcon
              :name="cat.icon"
              size="14px"
              class="checker-sidebar-icon"
              :style="{ color: activeCategory === cat.id ? cat.color : '' }"
            />
            <span class="checker-sidebar-name">{{ cat.name }}</span>
            <span class="checker-sidebar-count">{{ cat.tools.length }}</span>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="checker-main-content">
        <!-- ── 精选推荐 ─── -->
        <div v-if="activeCategory === 'all' && !searchQuery && activeRegion === 'all'" class="checker-section">
          <div class="checker-section-header">
            <VaIcon name="star" color="warning" size="17px" />
            <h2 class="checker-section-title">快速体检入口</h2>
            <span class="checker-section-badge">免费直达</span>
          </div>
          <div class="checker-featured-grid">
            <div
              v-for="tool in featuredAiCheckerTools"
              :key="tool.id"
              class="checker-featured-card"
              @click="openTool(tool.url)"
            >
              <div
                class="checker-featured-icon"
                :style="{
                  background: (getToolCategory(tool)?.color || '#10B981') + '18',
                  borderColor: (getToolCategory(tool)?.color || '#10B981') + '3a',
                }"
              >
                <VaIcon
                  :name="getToolCategory(tool)?.icon || 'health_and_safety'"
                  :style="{ color: getToolCategory(tool)?.color || '#10B981' }"
                  size="22px"
                />
              </div>
              <div class="checker-featured-info">
                <div class="checker-featured-top">
                  <h3 class="checker-featured-name">{{ tool.name }}</h3>
                  <div class="checker-featured-badges">
                    <span v-if="tool.badge" class="checker-badge checker-badge-highlight">{{ tool.badge }}</span>
                    <span v-if="tool.isFree" class="checker-badge checker-badge-free">免费</span>
                    <span v-else-if="tool.hasFreeplan" class="checker-badge checker-badge-freeplan">含免费版</span>
                    <span
                      class="checker-badge"
                      :class="tool.region === 'cn' ? 'checker-badge-cn' : 'checker-badge-global'"
                    >
                      {{ tool.region === 'cn' ? '🇨🇳 国内' : '🌍 国际' }}
                    </span>
                  </div>
                </div>
                <ul v-if="tool.highlights?.length" class="checker-featured-highlights">
                  <li v-for="h in tool.highlights" :key="h">
                    <VaIcon name="check_circle" size="12px" color="success" />
                    <span>{{ h }}</span>
                  </li>
                </ul>
                <p class="checker-featured-desc">{{ tool.description }}</p>
                <div v-if="tool.pricing" class="checker-pricing-tag">
                  <VaIcon name="sell" size="12px" />
                  {{ tool.pricing }}
                </div>
              </div>
              <VaIcon name="open_in_new" size="14px" class="checker-featured-arrow" />
            </div>
          </div>
        </div>

        <!-- ── 结果栏 ─── -->
        <div class="checker-result-bar">
          <span class="checker-result-count">
            <VaIcon name="format_list_bulleted" size="13px" />
            找到 <strong>{{ filteredTools.length }}</strong> 个工具
          </span>
          <button
            v-if="searchQuery || showFreeOnly || activeRegion !== 'all'"
            class="checker-clear-btn"
            @click="clearFilters"
          >
            <VaIcon name="close" size="12px" />
            清除筛选
          </button>
        </div>

        <!-- ── 空状态 ─── -->
        <div v-if="filteredTools.length === 0" class="checker-empty">
          <VaIcon name="search_off" size="50px" color="secondary" />
          <p>没有找到匹配的工具，试试其他关键词</p>
          <VaButton preset="secondary" size="small" @click="clearFilters">清除所有筛选</VaButton>
        </div>

        <!-- ── 工具分层展示 ─── -->
        <div
          v-for="group in groupedFilteredTools"
          :key="group.id"
          class="checker-category-group"
          :data-cat-id="group.id"
        >
          <div class="checker-cat-header" :style="{ borderLeftColor: group.color }">
            <div class="checker-cat-header-left">
              <div class="checker-cat-icon" :style="{ background: group.color + '18' }">
                <VaIcon :name="group.icon" :style="{ color: group.color }" size="19px" />
              </div>
              <div>
                <div class="checker-cat-name-row">
                  <h2 class="checker-cat-name">{{ group.name }}</h2>
                  <span v-if="group.badge" class="checker-cat-badge">{{ group.badge }}</span>
                </div>
                <p class="checker-cat-desc">{{ group.description }}</p>
              </div>
            </div>
            <span class="checker-cat-count" :style="{ background: group.color + '18', color: group.color }">
              {{ group.tools.length }} 个工具
            </span>
          </div>

          <div class="checker-tools-grid">
            <div
              v-for="tool in group.tools"
              :key="tool.id"
              class="checker-tool-card"
              :style="{ '--tool-color': group.color }"
              @click="openTool(tool.url)"
            >
              <div class="checker-tool-top">
                <div
                  class="checker-tool-icon"
                  :style="{ background: group.color + '14', borderColor: group.color + '35' }"
                >
                  <VaIcon :name="group.icon" :style="{ color: group.color }" size="17px" />
                </div>
                <div class="checker-tool-badges">
                  <span v-if="tool.badge" class="checker-badge checker-badge-highlight">{{ tool.badge }}</span>
                  <span v-if="tool.isFree" class="checker-badge checker-badge-free">免费</span>
                  <span v-else-if="tool.hasFreeplan" class="checker-badge checker-badge-freeplan">含免费</span>
                  <span v-if="tool.hasApi" class="checker-badge checker-badge-api">API</span>
                  <span
                    class="checker-badge"
                    :class="tool.region === 'cn' ? 'checker-badge-cn' : 'checker-badge-global'"
                  >
                    {{ tool.region === 'cn' ? '🇨🇳' : '🌍' }}
                  </span>
                </div>
              </div>

              <h3 class="checker-tool-name">{{ tool.name }}</h3>
              <p v-if="tool.nameEn && tool.nameEn !== tool.name" class="checker-tool-name-en">{{ tool.nameEn }}</p>

              <ul v-if="tool.highlights?.length" class="checker-tool-highlights">
                <li v-for="h in tool.highlights.slice(0, 3)" :key="h">
                  <VaIcon name="check" size="11px" />
                  <span>{{ h }}</span>
                </li>
              </ul>

              <p class="checker-tool-desc">{{ tool.description }}</p>

              <div class="checker-tool-footer">
                <div class="checker-tool-tags">
                  <span v-for="tag in tool.tags.slice(0, 2)" :key="tag" class="checker-tag">{{ tag }}</span>
                </div>
                <div class="checker-tool-meta">
                  <span v-if="tool.pricing" class="checker-pricing-inline">{{ tool.pricing }}</span>
                  <div class="checker-tool-visit">
                    <VaIcon name="open_in_new" size="11px" />
                    <span>访问</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── 用户旅程指引 ─── -->
        <div class="checker-tips-section">
          <div class="checker-tips-header">
            <VaIcon name="lightbulb" color="warning" size="17px" />
            <h2 class="checker-section-title">体检后如何提升 AI 可见度？</h2>
          </div>
          <div class="checker-tips-grid">
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">🔍</div>
              <h3>第一步：免费体检基线</h3>
              <p>
                用 <strong>透镜 GEO</strong>（国内）或 <strong>AppearOnAI</strong>（国际）免费获取品牌 AI
                可见度基线报告，确认是否被主流 AI 引擎提及。
              </p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">📄</div>
              <h3>第二步：添加 llms.txt</h3>
              <p>
                使用 <strong>LLMs.txt 生成器</strong> 为网站创建 llms.txt 文件，主动告知 AI 爬虫网站核心内容，这是提升
                AI 可见度的最基础步骤。
              </p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">🏗️</div>
              <h3>第三步：结构化数据</h3>
              <p>
                为重要页面添加 JSON-LD Schema（Article、FAQ、Organization），用
                <strong>Google Rich Results Test</strong> 验证，帮助 AI 引擎准确理解内容实体。
              </p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">✍️</div>
              <h3>第四步：优化内容质量</h3>
              <p>
                在内容中加入<strong>统计数据</strong>、<strong>FAQ 格式</strong>、<strong>权威引用</strong>，使用
                <strong>Frase.io</strong> 分析 AI 引用的内容模式，大幅提升被引用概率。
              </p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">📊</div>
              <h3>第五步：持续监测</h3>
              <p>
                国内用户选 <strong>SheepGeo</strong>（9大模型）或 <strong>ImpetaAI</strong>（50+指标）；国际用户选
                <strong>Otterly.AI</strong>（$29/月）进行持续追踪，建立复访习惯。
              </p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">🔄</div>
              <h3>每月复查进度</h3>
              <p>
                AI
                引擎每月更新模型和训练数据，建议<strong>每月一次</strong>用免费工具复查品牌可见度，追踪优化效果，及时调整策略。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ───────────────────────────────────────── */
.checker-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ───────────────────────────────────────── */
.checker-hero {
  background: linear-gradient(135deg, #0a1628 0%, #0f2140 45%, #0d1f35 100%);
  padding: 2.5rem 2rem 2rem;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.checker-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(16, 185, 129, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 15% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.checker-hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.checker-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.9rem;
}

.checker-hero-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.6rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.checker-hero-accent {
  background: linear-gradient(90deg, #34d399, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.checker-hero-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1.2rem;
  line-height: 1.65;
}

.checker-hero-subtitle strong {
  color: rgba(255, 255, 255, 0.85);
}

/* ── Journey ─────────────────────────────────────── */
.checker-journey {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  margin-bottom: 1.2rem;
  font-size: 12px;
}

.checker-journey-step {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.5);
}

.checker-journey-step.active {
  color: #34d399;
  font-weight: 600;
}

.checker-journey-icon {
  font-size: 13px;
}

/* ── Search ──────────────────────────────────────── */
.checker-search-wrap {
  max-width: 500px;
  margin: 0 auto 1rem;
}

.checker-search-input {
  width: 100%;
}

.checker-search-input :deep(input) {
  color: #fff !important;
}

.checker-search-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

.checker-search-input :deep(.va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.checker-search-input :deep(.va-input-wrapper:hover .va-input-wrapper__field),
.checker-search-input :deep(.va-input-wrapper--focused .va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
}

/* ── Region tabs ─────────────────────────────────── */
.checker-region-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 1.1rem;
}

.checker-region-tab {
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

.checker-region-tab:hover {
  border-color: rgba(16, 185, 129, 0.5);
  color: rgba(255, 255, 255, 0.85);
}

.checker-region-tab.active {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.6);
  color: #6ee7b7;
}

/* ── Stats ───────────────────────────────────────── */
.checker-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.checker-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.checker-stat-num {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
}

.checker-stat-label {
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.checker-stat-div {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
}

/* ── Body ────────────────────────────────────────── */
.checker-body {
  display: flex;
  flex: 1;
  align-items: flex-start;
  margin: 0 -1rem;
  min-height: 0;
}

/* ── Sidebar ─────────────────────────────────────── */
.checker-sidebar {
  width: 210px;
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

.checker-sidebar::-webkit-scrollbar {
  width: 3px;
}

.checker-sidebar::-webkit-scrollbar-thumb {
  background: var(--va-background-border);
  border-radius: 3px;
}

.checker-sidebar-inner {
  padding: 13px 7px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checker-filter-toggle {
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
  margin: 0 2px 2px;
}

.checker-filter-toggle:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}

.checker-filter-toggle.active {
  background: var(--va-primary);
  border-color: var(--va-primary);
  color: #fff;
}

.checker-sidebar-div {
  height: 1px;
  background: var(--va-background-border);
  margin: 6px 2px;
}

.checker-sidebar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 7px 8px;
  border-radius: 7px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.checker-sidebar-item:hover {
  background: var(--va-background-secondary);
}

.checker-sidebar-item.active {
  background: rgba(16, 185, 129, 0.1);
}

.checker-sidebar-item.scroll-active:not(.active) {
  background: var(--va-background-element);
}

.checker-sidebar-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.6;
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.checker-sidebar-item.active .checker-sidebar-dot,
.checker-sidebar-item.scroll-active .checker-sidebar-dot {
  opacity: 1;
  transform: scale(1.4);
}

.checker-sidebar-icon {
  flex-shrink: 0;
  color: var(--va-text-secondary);
  transition: color 0.15s;
}

.checker-sidebar-item.active .checker-sidebar-icon {
  color: var(--cat-color, #10b981);
}

.checker-sidebar-name {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: var(--va-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.checker-sidebar-item.active .checker-sidebar-name {
  color: var(--va-text-primary);
  font-weight: 600;
}

.checker-sidebar-count {
  flex-shrink: 0;
  font-size: 10px;
  color: var(--va-text-secondary);
  background: var(--va-background-element);
  border-radius: 8px;
  padding: 1px 5px;
  min-width: 17px;
  text-align: center;
}

.checker-sidebar-item.active .checker-sidebar-count {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

/* ── Main Content ────────────────────────────────── */
.checker-main-content {
  flex: 1;
  min-width: 0;
  padding: 1.4rem 1.4rem 2rem;
  overflow-y: auto;
}

/* ── Section ─────────────────────────────────────── */
.checker-section {
  margin-bottom: 2rem;
}

.checker-section-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 1rem;
}

.checker-section-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.checker-section-badge {
  display: inline-block;
  padding: 2px 7px;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.22);
  border-radius: 9px;
  font-size: 10.5px;
  font-weight: 500;
}

/* ── Featured ────────────────────────────────────── */
.checker-featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 8px;
}

.checker-featured-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 15px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checker-featured-card:hover {
  border-color: #10b981;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

.checker-featured-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 9px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.checker-featured-info {
  flex: 1;
  min-width: 0;
}

.checker-featured-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

.checker-featured-name {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.checker-featured-badges {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.checker-featured-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.checker-featured-highlights li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--va-text-secondary);
}

.checker-featured-desc {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin: 0 0 6px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.checker-pricing-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--va-text-secondary);
  background: var(--va-background-element);
  padding: 2px 7px;
  border-radius: 5px;
}

.checker-featured-arrow {
  flex-shrink: 0;
  color: var(--va-text-secondary);
  opacity: 0.3;
  transition: opacity 0.2s;
  margin-top: 2px;
}

.checker-featured-card:hover .checker-featured-arrow {
  opacity: 0.7;
}

/* ── Result bar ──────────────────────────────────── */
.checker-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
  padding: 7px 12px;
  background: var(--va-background-secondary);
  border-radius: 7px;
  border: 1px solid var(--va-background-border);
}

.checker-result-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--va-text-secondary);
}

.checker-clear-btn {
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

.checker-clear-btn:hover {
  background: var(--va-background-element);
  color: var(--va-text-primary);
}

/* ── Category Group ──────────────────────────────── */
.checker-category-group {
  margin-bottom: 2.2rem;
}

.checker-cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
  padding: 12px 14px;
  background: var(--va-background-secondary);
  border-radius: 9px;
  border-left: 4px solid;
  flex-wrap: wrap;
  gap: 8px;
}

.checker-cat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checker-cat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checker-cat-name-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 2px;
}

.checker-cat-name {
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.checker-cat-badge {
  font-size: 10.5px;
  padding: 1px 6px;
  background: var(--va-background-element);
  border-radius: 6px;
  color: var(--va-text-secondary);
  border: 1px solid var(--va-background-border);
}

.checker-cat-desc {
  font-size: 11.5px;
  color: var(--va-text-secondary);
  margin: 0;
}

.checker-cat-count {
  padding: 3px 8px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Tools Grid ──────────────────────────────────── */
.checker-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.checker-tool-card {
  padding: 13px 14px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.checker-tool-card:hover {
  border-color: var(--tool-color, #10b981);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.checker-tool-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checker-tool-icon {
  width: 34px;
  height: 34px;
  border-radius: 7px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checker-tool-badges {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.checker-tool-name {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.checker-tool-name-en {
  font-size: 11px;
  color: var(--va-text-secondary);
  margin: -4px 0 0;
}

.checker-tool-highlights {
  list-style: none;
  padding: 7px 8px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--va-background-element);
  border-radius: 6px;
}

.checker-tool-highlights li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--va-text-secondary);
}

.checker-tool-desc {
  font-size: 11.5px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.checker-tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.checker-tool-tags {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.checker-tool-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.checker-pricing-inline {
  font-size: 10.5px;
  color: var(--va-text-secondary);
  white-space: nowrap;
}

.checker-tool-visit {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: #059669;
  opacity: 0;
  transition: opacity 0.2s;
}

.checker-tool-card:hover .checker-tool-visit {
  opacity: 1;
}

/* ── Badges ──────────────────────────────────────── */
.checker-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
  white-space: nowrap;
}

.checker-badge-highlight {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.checker-badge-free {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.checker-badge-freeplan {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.22);
}

.checker-badge-api {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.22);
}

.checker-badge-cn {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.checker-badge-global {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.18);
}

/* ── Tags ────────────────────────────────────────── */
.checker-tag {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 10px;
  background: var(--va-background-element);
  color: var(--va-text-secondary);
  border: 1px solid var(--va-background-border);
}

/* ── Tips ────────────────────────────────────────── */
.checker-tips-section {
  background: var(--va-background-secondary);
  border-radius: 12px;
  padding: 1.4rem;
  margin-top: 0.5rem;
}

.checker-tips-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 1rem;
}

.checker-tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.checker-tip-card {
  padding: 13px 14px;
  background: var(--va-background-primary);
  border-radius: 9px;
  border: 1px solid var(--va-background-border);
}

.checker-tip-emoji {
  font-size: 1.4rem;
  margin-bottom: 6px;
}

.checker-tip-card h3 {
  font-size: 12.5px;
  font-weight: 700;
  margin: 0 0 5px;
  color: var(--va-text-primary);
}

.checker-tip-card p {
  font-size: 11.5px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.checker-tip-card p strong {
  color: var(--va-text-primary);
}

/* ── Empty ───────────────────────────────────────── */
.checker-empty {
  text-align: center;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
}

.checker-empty p {
  font-size: 13.5px;
  color: var(--va-text-secondary);
  margin: 0;
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 900px) {
  .checker-body {
    flex-direction: column;
  }

  .checker-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid var(--va-background-border);
    overflow-x: auto;
    overflow-y: hidden;
  }

  .checker-sidebar-inner {
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 9px 12px;
    gap: 4px;
    overflow-x: auto;
  }

  .checker-sidebar-div {
    width: 1px;
    height: auto;
    margin: 0 4px;
    align-self: stretch;
  }

  .checker-sidebar-item {
    flex-shrink: 0;
    white-space: nowrap;
    padding: 5px 9px;
    border-radius: 16px;
  }

  .checker-sidebar-dot,
  .checker-sidebar-count {
    display: none;
  }

  .checker-main-content {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .checker-hero-title {
    font-size: 1.65rem;
  }

  .checker-tools-grid {
    grid-template-columns: 1fr;
  }

  .checker-tips-grid {
    grid-template-columns: 1fr;
  }

  .checker-featured-grid {
    grid-template-columns: 1fr;
  }

  .checker-journey {
    font-size: 11px;
  }
}
</style>
