<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  aiCheckerCategories,
  allAiCheckerTools,
  featuredAiCheckerTools,
  type AiCheckerTool,
  type AiCheckerCategory,
} from '../../data/ai-checker-tools'
import { aiCheckerCategoriesZh, aiCheckerToolsZh } from '../../data/ai-checker-tools-zh'
import { toolTagsZh } from '../../data/tool-tags-zh'
import { highlightsZh, pricingZh } from '../../data/tool-extras-zh'
import { usePageSeo } from '../../composables/usePageSeo'
import { localePath } from '../../i18n/useLocale'
import ToolFavicon from '../../components/ToolFavicon.vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const isZh = computed(() => locale.value === 'zh')

const catName = (c: { id: string; name: string }) =>
  isZh.value ? aiCheckerCategoriesZh[c.id]?.name ?? c.name : c.name
const catDesc = (c: { id: string; description: string }) =>
  isZh.value ? aiCheckerCategoriesZh[c.id]?.description ?? c.description : c.description
const toolDesc = (tl: { id: string; description: string }) =>
  isZh.value ? aiCheckerToolsZh[tl.id] ?? tl.description : tl.description
const tagLabel = (tag: string) => (isZh.value ? toolTagsZh[tag] ?? tag : tag)
const hlLabel = (h: string) => (isZh.value ? highlightsZh[h] ?? h : h)
const priceLabel = (p?: string) => (p && isZh.value ? pricingZh[p] ?? p : p)

const CHECKER_BASE = '/ai-checker'
const catIds = new Set(aiCheckerCategories.map((c) => c.id))
const validCat = (c: unknown) => (typeof c === 'string' && catIds.has(c) ? c : 'all')

const searchQuery = ref('')
const activeCategory = ref<string>(validCat(route.params.category))
const activeRegion = ref<'all' | 'cn' | 'global'>('all')
const showFreeOnly = ref(false)

// 分类专属 SEO:自指 canonical + 唯一 title/description
const activeCatObj = computed(() => aiCheckerCategories.find((c) => c.id === activeCategory.value))
usePageSeo(
  computed(() => {
    const cat = activeCatObj.value
    const path = cat ? `${CHECKER_BASE}/${cat.id}` : CHECKER_BASE
    return {
      title: cat
        ? isZh.value
          ? `${catName(cat)} — AI 可见度体检 | SGAIndex`
          : `${catName(cat)} — AI Visibility Checker | SGAIndex`
        : t('aiCheckerPage.seoTitle'),
      description: cat ? catDesc(cat) : t('aiCheckerPage.seoDescription'),
      path,
      keywords: t('aiCheckerPage.seoKeywords'),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: cat ? catName(cat) : 'AI Visibility Checker',
          description: cat ? catDesc(cat) : 'Check how your content is cited and how visible it is across major AI models',
          url: `https://sgaindex.com${path}`,
          isPartOf: { '@type': 'WebSite', name: 'SGAIndex', url: 'https://sgaindex.com' },
        },
      ],
    }
  }),
)

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

function getToolCategory(tool: AiCheckerTool): AiCheckerCategory | undefined {
  return aiCheckerCategories.find((c) => c.tools.some((t) => t.id === tool.id))
}

function selectCategory(catId: string) {
  const target = localePath(catId === 'all' ? CHECKER_BASE : `${CHECKER_BASE}/${catId}`)
  if (route.path !== target) router.push(target)
  else scrollContentTop()
}

function scrollContentTop() {
  const el = document.querySelector('.checker-main-content')
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => route.params.category,
  (c) => {
    activeCategory.value = validCat(c)
    scrollContentTop()
  },
)

// 纯浏览态:展示分类作用导览而非罗列工具
const showCategoryOverview = computed(
  () =>
    activeCategory.value === 'all' &&
    !searchQuery.value.trim() &&
    activeRegion.value === 'all' &&
    !showFreeOnly.value,
)

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
          <span>{{ t('aiCheckerPage.badge') }}</span>
        </div>

        <h1 class="checker-hero-title">
          {{ t('aiCheckerPage.heroTitleMain') }}<br />
          <span class="checker-hero-accent">{{ t('aiCheckerPage.heroTitleAccent') }}</span>
        </h1>

        <p class="checker-hero-subtitle" v-html="t('aiCheckerPage.heroSubtitle', { n: totalTools })"></p>

        <!-- 用户旅程提示 -->
        <div class="checker-journey">
          <div class="checker-journey-step">
            <span class="checker-journey-icon">🔍</span>
            <span>{{ t('aiCheckerPage.journey1') }}</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step">
            <span class="checker-journey-icon">📊</span>
            <span>{{ t('aiCheckerPage.journey2') }}</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step">
            <span class="checker-journey-icon">⚡</span>
            <span>{{ t('aiCheckerPage.journey3') }}</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step">
            <span class="checker-journey-icon">📈</span>
            <span>{{ t('aiCheckerPage.journey4') }}</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="checker-journey-step active">
            <span class="checker-journey-icon">✅</span>
            <span>{{ t('aiCheckerPage.journey5') }}</span>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="checker-search-wrap">
          <VaInput
            v-model="searchQuery"
            :placeholder="t('aiCheckerPage.searchPlaceholder')"
            :aria-label="t('aiCheckerPage.searchAria')"
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
              { key: 'all', label: t('aiCheckerPage.allTools') },
              { key: 'cn', label: t('aiCheckerPage.regionCn') },
              { key: 'global', label: t('aiCheckerPage.regionGlobal') },
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
            <span class="checker-stat-label">{{ t('aiCheckerPage.statTools') }}</span>
          </div>
          <div class="checker-stat-div" />
          <div class="checker-stat">
            <span class="checker-stat-num">{{ cnToolsCount }}</span>
            <span class="checker-stat-label">{{ t('aiCheckerPage.regionCn') }}</span>
          </div>
          <div class="checker-stat-div" />
          <div class="checker-stat">
            <span class="checker-stat-num">{{ globalToolsCount }}</span>
            <span class="checker-stat-label">{{ t('aiCheckerPage.regionGlobal') }}</span>
          </div>
          <div class="checker-stat-div" />
          <div class="checker-stat">
            <span class="checker-stat-num">{{ freeCount }}</span>
            <span class="checker-stat-label">{{ t('aiCheckerPage.statFree') }}</span>
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
            {{ t('aiCheckerPage.filterFreeOnly') }}
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
            <span class="checker-sidebar-name">{{ t('aiCheckerPage.allTools') }}</span>
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
            <span class="checker-sidebar-name">{{ catName(cat) }}</span>
            <span class="checker-sidebar-count">{{ cat.tools.length }}</span>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="checker-main-content">
        <!-- ── 精选推荐(筛选态显示,纯浏览态让位于分类导览) ─── -->
        <div
          v-if="activeCategory === 'all' && !searchQuery && activeRegion === 'all' && !showCategoryOverview"
          class="checker-section"
        >
          <div class="checker-section-header">
            <VaIcon name="star" color="warning" size="17px" />
            <h2 class="checker-section-title">{{ t('aiCheckerPage.featuredTitle') }}</h2>
            <span class="checker-section-badge">{{ t('aiCheckerPage.featuredBadge') }}</span>
          </div>
          <div class="checker-featured-grid">
            <a
              v-for="tool in featuredAiCheckerTools"
              :key="tool.id"
              :href="tool.url"
              target="_blank"
              rel="noopener noreferrer"
              class="checker-featured-card"
              :aria-label="t('aiCheckerPage.visitAria', { name: tool.name })"
            >
              <div
                class="checker-featured-icon"
                :style="{
                  background: (getToolCategory(tool)?.color || '#10B981') + '18',
                  borderColor: (getToolCategory(tool)?.color || '#10B981') + '3a',
                }"
              >
                <ToolFavicon
                  :url="tool.url"
                  :fallback-icon="getToolCategory(tool)?.icon || 'health_and_safety'"
                  :fallback-color="getToolCategory(tool)?.color || '#10B981'"
                  :size="22"
                />
              </div>
              <div class="checker-featured-info">
                <div class="checker-featured-top">
                  <h3 class="checker-featured-name">{{ tool.name }}</h3>
                  <div class="checker-featured-badges">
                    <span v-if="tool.badge" class="checker-badge checker-badge-highlight">{{ tool.badge }}</span>
                    <span v-if="tool.isFree" class="checker-badge checker-badge-free">{{ t('aiCheckerPage.badgeFree') }}</span>
                    <span v-else-if="tool.hasFreeplan" class="checker-badge checker-badge-freeplan">{{ t('aiCheckerPage.badgeFreeTier') }}</span>
                    <span
                      class="checker-badge"
                      :class="tool.region === 'cn' ? 'checker-badge-cn' : 'checker-badge-global'"
                    >
                      {{ tool.region === 'cn' ? t('aiCheckerPage.badgeCn') : t('aiCheckerPage.badgeGlobal') }}
                    </span>
                  </div>
                </div>
                <ul v-if="tool.highlights?.length" class="checker-featured-highlights">
                  <li v-for="h in tool.highlights" :key="h">
                    <VaIcon name="check_circle" size="12px" color="success" />
                    <span>{{ hlLabel(h) }}</span>
                  </li>
                </ul>
                <p class="checker-featured-desc">{{ toolDesc(tool) }}</p>
                <div v-if="tool.pricing" class="checker-pricing-tag">
                  <VaIcon name="sell" size="12px" />
                  {{ priceLabel(tool.pricing) }}
                </div>
              </div>
              <VaIcon name="open_in_new" size="14px" class="checker-featured-arrow" />
            </a>
          </div>
        </div>

        <!-- ── 结果栏 ─── -->
        <!-- 分类作用导览(纯浏览态) -->
        <div v-if="showCategoryOverview" class="checker-overview">
          <div class="checker-section-header">
            <VaIcon name="dashboard" color="primary" size="17px" />
            <h2 class="checker-section-title">{{ isZh ? '按方向浏览' : 'Browse by focus area' }}</h2>
          </div>
          <p class="checker-overview-sub">
            {{
              isZh
                ? '下面是 AI 可见度体检的几类工具,选一类深入即可看到该方向下的工具。'
                : 'Each card is a category of AI-visibility tools. Pick one to see the tools inside.'
            }}
          </p>
          <div class="checker-overview-grid">
            <RouterLink
              v-for="cat in aiCheckerCategories"
              :key="cat.id"
              :to="localePath(`${CHECKER_BASE}/${cat.id}`)"
              class="checker-ov-card"
            >
              <div class="checker-ov-icon" :style="{ background: cat.color + '18', color: cat.color }">
                <VaIcon :name="cat.icon" size="22px" />
              </div>
              <div class="checker-ov-body">
                <h3 class="checker-ov-name">{{ catName(cat) }}</h3>
                <p class="checker-ov-desc">{{ catDesc(cat) }}</p>
                <span class="checker-ov-count">{{ cat.tools.length }} {{ t('aiCheckerPage.toolsUnit') }}</span>
              </div>
              <VaIcon name="arrow_forward" size="16px" class="checker-ov-arrow" />
            </RouterLink>
          </div>
        </div>

        <template v-if="!showCategoryOverview">
          <div class="checker-result-bar">
          <span class="checker-result-count">
            <VaIcon name="format_list_bulleted" size="13px" />
            <span v-html="t('aiCheckerPage.resultCount', { n: filteredTools.length })"></span>
          </span>
          <button
            v-if="searchQuery || showFreeOnly || activeRegion !== 'all'"
            class="checker-clear-btn"
            @click="clearFilters"
          >
            <VaIcon name="close" size="12px" />
            {{ t('aiCheckerPage.clearFilters') }}
          </button>
        </div>

        <!-- ── 空状态 ─── -->
        <div v-if="filteredTools.length === 0" class="checker-empty">
          <VaIcon name="search_off" size="50px" color="secondary" />
          <p>{{ t('aiCheckerPage.empty') }}</p>
          <VaButton preset="secondary" size="small" @click="clearFilters">{{ t('aiCheckerPage.clearAllFilters') }}</VaButton>
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
                  <h2 class="checker-cat-name">{{ catName(group) }}</h2>
                  <span v-if="group.badge" class="checker-cat-badge">{{ group.badge }}</span>
                </div>
                <p class="checker-cat-desc">{{ catDesc(group) }}</p>
              </div>
            </div>
            <span class="checker-cat-count" :style="{ background: group.color + '18', color: group.color }">
              {{ group.tools.length }} {{ t('aiCheckerPage.toolsUnit') }}
            </span>
          </div>

          <div class="checker-tools-grid">
            <a
              v-for="tool in group.tools"
              :key="tool.id"
              :href="tool.url"
              target="_blank"
              rel="noopener noreferrer"
              class="checker-tool-card"
              :style="{ '--tool-color': group.color }"
              :aria-label="t('aiCheckerPage.visitAria', { name: tool.name })"
            >
              <div class="checker-tool-top">
                <div
                  class="checker-tool-icon"
                  :style="{ background: group.color + '14', borderColor: group.color + '35' }"
                >
                  <ToolFavicon :url="tool.url" :fallback-icon="group.icon" :fallback-color="group.color" :size="17" />
                </div>
                <div class="checker-tool-badges">                  <span v-if="tool.badge" class="checker-badge checker-badge-highlight">{{ tool.badge }}</span>
                  <span v-if="tool.isFree" class="checker-badge checker-badge-free">{{ t('aiCheckerPage.badgeFree') }}</span>
                  <span v-else-if="tool.hasFreeplan" class="checker-badge checker-badge-freeplan">{{ t('aiCheckerPage.badgeHasFree') }}</span>
                  <span v-if="tool.hasApi" class="checker-badge checker-badge-api">{{ t('aiCheckerPage.badgeApi') }}</span>
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
                  <span>{{ hlLabel(h) }}</span>
                </li>
              </ul>

              <p class="checker-tool-desc">{{ toolDesc(tool) }}</p>

              <div class="checker-tool-footer">
                <div class="checker-tool-tags">
                  <span v-for="tag in tool.tags.slice(0, 2)" :key="tag" class="checker-tag">{{ tagLabel(tag) }}</span>
                </div>
                <div class="checker-tool-meta">
                  <span v-if="tool.pricing" class="checker-pricing-inline">{{ priceLabel(tool.pricing) }}</span>
                  <div class="checker-tool-visit">
                    <VaIcon name="open_in_new" size="11px" />
                    <span>{{ t('aiCheckerPage.visitHint') }}</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        </template>

        <!-- ── 用户旅程指引 ─── -->
        <div class="checker-tips-section">
          <div class="checker-tips-header">
            <VaIcon name="lightbulb" color="warning" size="17px" />
            <h2 class="checker-section-title">{{ t('aiCheckerPage.tipsTitle') }}</h2>
          </div>
          <div class="checker-tips-grid">
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">🔍</div>
              <h3>{{ t('aiCheckerPage.tip1Title') }}</h3>
              <p v-html="t('aiCheckerPage.tip1Body')"></p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">📄</div>
              <h3>{{ t('aiCheckerPage.tip2Title') }}</h3>
              <p v-html="t('aiCheckerPage.tip2Body')"></p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">🏗️</div>
              <h3>{{ t('aiCheckerPage.tip3Title') }}</h3>
              <p v-html="t('aiCheckerPage.tip3Body')"></p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">✍️</div>
              <h3>{{ t('aiCheckerPage.tip4Title') }}</h3>
              <p v-html="t('aiCheckerPage.tip4Body')"></p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">📊</div>
              <h3>{{ t('aiCheckerPage.tip5Title') }}</h3>
              <p v-html="t('aiCheckerPage.tip5Body')"></p>
            </div>
            <div class="checker-tip-card">
              <div class="checker-tip-emoji">🔄</div>
              <h3>{{ t('aiCheckerPage.tip6Title') }}</h3>
              <p v-html="t('aiCheckerPage.tip6Body')"></p>
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
  flex-wrap: wrap;
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
  color: rgba(255, 255, 255, 0.6);
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
  text-decoration: none;
  color: inherit;
}
.checker-featured-card:focus-visible,
.checker-tool-card:focus-visible {
  outline: 2px solid var(--va-primary);
  outline-offset: 2px;
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
/* ── 分类作用导览 ─────────────────────────── */
.checker-overview-sub {
  margin: 4px 0 14px;
  font-size: 0.86rem;
  color: var(--va-text-secondary);
}

.checker-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.checker-ov-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: var(--va-background-secondary);
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.checker-ov-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
}

.checker-ov-card:hover .checker-ov-arrow {
  transform: translateX(3px);
  opacity: 1;
}

.checker-ov-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checker-ov-body {
  flex: 1;
  min-width: 0;
}

.checker-ov-name {
  font-size: 1.02rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.checker-ov-desc {
  margin: 0 0 8px;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--va-text-secondary);
}

.checker-ov-count {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--va-primary);
  background: rgba(16, 185, 129, 0.12);
  padding: 2px 8px;
  border-radius: 999px;
}

.checker-ov-arrow {
  flex-shrink: 0;
  align-self: center;
  color: var(--va-primary);
  opacity: 0.5;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

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
  text-decoration: none;
  color: inherit;
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
