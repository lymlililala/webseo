<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  glossaryTerms,
  glossaryCategories,
  alphabet,
  type GlossaryTerm,
  type GlossaryCategory,
} from '../../data/glossary'

const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref<string>('all')
const activeLetter = ref<string>('')

// ── 过滤逻辑 ──────────────────────────────────────────────────
const filteredTerms = computed(() => {
  let terms = glossaryTerms

  if (activeCategory.value !== 'all') {
    terms = terms.filter((t) => t.category === activeCategory.value)
  }

  if (activeLetter.value) {
    terms = terms.filter((t) => t.term[0].toUpperCase() === activeLetter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    terms = terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.termZh.includes(q) ||
        t.definition.includes(q) ||
        t.related.some((r) => r.toLowerCase().includes(q)),
    )
  }

  return [...terms].sort((a, b) => a.term.localeCompare(b.term))
})

// ── 按字母分组 ────────────────────────────────────────────────
const groupedTerms = computed(() => {
  if (searchQuery.value.trim() || activeLetter.value) {
    return [{ letter: '', terms: filteredTerms.value }]
  }

  const map = new Map<string, GlossaryTerm[]>()
  filteredTerms.value.forEach((t) => {
    const letter = t.term[0].toUpperCase()
    if (!map.has(letter)) map.set(letter, [])
    map.get(letter)!.push(t)
  })

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, terms]) => ({ letter, terms }))
})

// ── 出现过的字母 ──────────────────────────────────────────────
const usedLetters = computed(() => {
  const terms = activeCategory.value === 'all' ? glossaryTerms : glossaryTerms.filter((t) => t.category === activeCategory.value)
  return new Set(terms.map((t) => t.term[0].toUpperCase()))
})

// ── 统计 ──────────────────────────────────────────────────────
const totalCount = computed(() => glossaryTerms.length)
const categoryCount = (catId: string) => glossaryTerms.filter((t) => t.category === catId).length

function getCategoryById(id: string): GlossaryCategory | undefined {
  return glossaryCategories.find((c) => c.id === id)
}

function getTermById(id: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.id === id)
}

// ── 字母跳转 ──────────────────────────────────────────────────
function jumpToLetter(letter: string) {
  if (activeLetter.value === letter) {
    activeLetter.value = ''
    return
  }
  searchQuery.value = ''
  activeLetter.value = letter
  nextTick(() => {
    const el = document.getElementById(`letter-${letter}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// ── 跳转相关术语 ──────────────────────────────────────────────
function jumpToTerm(termId: string) {
  searchQuery.value = ''
  activeCategory.value = 'all'
  activeLetter.value = ''
  nextTick(() => {
    const el = document.getElementById(`term-${termId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

// ── 外部链接 ──────────────────────────────────────────────────
function navigateTo(link: string) {
  router.push(link)
}

function clearFilters() {
  searchQuery.value = ''
  activeCategory.value = 'all'
  activeLetter.value = ''
}

const hasFilter = computed(() => searchQuery.value || activeCategory.value !== 'all' || activeLetter.value)
</script>

<template>
  <div class="glossary-page">
    <!-- ── Hero ──────────────────────────────────────────────── -->
    <div class="glossary-hero">
      <div class="glossary-hero-bg" />
      <div class="glossary-hero-content">
        <div class="glossary-hero-badge">
          <VaIcon name="menu_book" size="14px" />
          <span>AI SEO 词汇表 · {{ totalCount }}+ 术语</span>
        </div>
        <h1 class="glossary-hero-title">
          AI SEO 完整词汇表<br />
          <span class="glossary-hero-accent">GEO · AEO · LLMO & 更多</span>
        </h1>
        <p class="glossary-hero-subtitle">
          涵盖 <strong>{{ totalCount }}+</strong> 个核心术语，5 大分类覆盖
          <strong>AI 搜索优化</strong>、<strong>传统 SEO 基础</strong>、<strong>LLM 技术</strong>、<strong>结构化数据</strong>和<strong>监测指标</strong>，是全站文章内链的中转枢纽。
        </p>

        <!-- 搜索框 -->
        <div class="glossary-search-wrap">
          <VaInput
            v-model="searchQuery"
            placeholder="搜索术语、中文名、定义关键词..."
            class="glossary-search-input"
            clearable
            @update:model-value="activeLetter = ''"
          >
            <template #prepend>
              <VaIcon name="search" size="20px" color="secondary" />
            </template>
          </VaInput>
        </div>

        <!-- 统计 -->
        <div class="glossary-stats">
          <div v-for="cat in glossaryCategories" :key="cat.id" class="glossary-stat">
            <span class="glossary-stat-num" :style="{ color: cat.color }">{{ categoryCount(cat.id) }}</span>
            <span class="glossary-stat-label">{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Body ───────────────────────────────────────────────── -->
    <div class="glossary-body">
      <!-- ── 分类筛选 + 字母栏（左侧粘性） ─── -->
      <aside class="glossary-sidebar">
        <div class="glossary-sidebar-inner">
          <!-- 分类 -->
          <div class="glossary-sidebar-section-title">按分类浏览</div>

          <button
            class="glossary-cat-btn"
            :class="{ active: activeCategory === 'all' }"
            @click="activeCategory = 'all'; activeLetter = ''"
          >
            <VaIcon name="apps" size="14px" />
            <span>全部术语</span>
            <span class="glossary-cat-count">{{ totalCount }}</span>
          </button>

          <button
            v-for="cat in glossaryCategories"
            :key="cat.id"
            class="glossary-cat-btn"
            :class="{ active: activeCategory === cat.id }"
            :style="{ '--cat-color': cat.color }"
            @click="activeCategory = cat.id; activeLetter = ''"
          >
            <VaIcon :name="cat.icon" size="14px" :style="{ color: activeCategory === cat.id ? cat.color : '' }" />
            <span>{{ cat.name }}</span>
            <span class="glossary-cat-count">{{ categoryCount(cat.id) }}</span>
          </button>

          <div class="glossary-sidebar-div" />

          <!-- 字母索引 -->
          <div class="glossary-sidebar-section-title">字母索引</div>
          <div class="glossary-alphabet-grid">
            <button
              v-for="letter in alphabet"
              :key="letter"
              class="glossary-alpha-btn"
              :class="{
                active: activeLetter === letter,
                disabled: !usedLetters.has(letter),
              }"
              :disabled="!usedLetters.has(letter)"
              @click="jumpToLetter(letter)"
            >
              {{ letter }}
            </button>
          </div>
        </div>
      </aside>

      <!-- ── 主内容 ─── -->
      <main class="glossary-main">
        <!-- 结果栏 -->
        <div class="glossary-result-bar">
          <span class="glossary-result-count">
            <VaIcon name="format_list_bulleted" size="13px" />
            显示 <strong>{{ filteredTerms.length }}</strong> / {{ totalCount }} 个术语
          </span>
          <button v-if="hasFilter" class="glossary-clear-btn" @click="clearFilters">
            <VaIcon name="close" size="12px" />
            清除筛选
          </button>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTerms.length === 0" class="glossary-empty">
          <VaIcon name="search_off" size="50px" color="secondary" />
          <p>没有找到匹配的术语</p>
          <VaButton preset="secondary" size="small" @click="clearFilters">清除筛选</VaButton>
        </div>

        <!-- 术语分组 -->
        <div v-for="group in groupedTerms" :key="group.letter">
          <!-- 字母锚点标题 -->
          <div v-if="group.letter" :id="`letter-${group.letter}`" class="glossary-letter-anchor">
            <span class="glossary-letter-label">{{ group.letter }}</span>
            <div class="glossary-letter-line" />
          </div>

          <!-- 术语卡片列表 -->
          <div class="glossary-terms-list">
            <div
              v-for="term in group.terms"
              :id="`term-${term.id}`"
              :key="term.id"
              class="glossary-term-card"
              :style="{ '--term-color': getCategoryById(term.category)?.color || '#6366F1' }"
            >
              <!-- 卡片头部 -->
              <div class="glossary-term-header">
                <div class="glossary-term-header-left">
                  <div
                    class="glossary-term-icon"
                    :style="{
                      background: (getCategoryById(term.category)?.color || '#6366F1') + '14',
                      borderColor: (getCategoryById(term.category)?.color || '#6366F1') + '35',
                    }"
                  >
                    <VaIcon
                      :name="getCategoryById(term.category)?.icon || 'help'"
                      :style="{ color: getCategoryById(term.category)?.color || '#6366F1' }"
                      size="15px"
                    />
                  </div>
                  <div>
                    <div class="glossary-term-name-row">
                      <h3 class="glossary-term-name">{{ term.term }}</h3>
                      <span class="glossary-term-zh">{{ term.termZh }}</span>
                    </div>
                    <span
                      class="glossary-term-cat-badge"
                      :style="{
                        background: (getCategoryById(term.category)?.color || '#6366F1') + '12',
                        color: getCategoryById(term.category)?.color || '#6366F1',
                        borderColor: (getCategoryById(term.category)?.color || '#6366F1') + '28',
                      }"
                    >
                      {{ getCategoryById(term.category)?.name }}
                    </span>
                  </div>
                </div>

                <!-- 内链跳转按钮 -->
                <button
                  v-if="term.link"
                  class="glossary-term-link-btn"
                  @click.stop="navigateTo(term.link!)"
                >
                  <VaIcon name="open_in_new" size="12px" />
                  查看工具
                </button>
              </div>

              <!-- 定义 -->
              <p class="glossary-term-def">{{ term.definition }}</p>

              <!-- 使用场景 -->
              <div class="glossary-term-usage">
                <VaIcon name="lightbulb" size="12px" color="warning" />
                <span>{{ term.usage }}</span>
              </div>

              <!-- 相关术语 -->
              <div v-if="term.related.length" class="glossary-term-related">
                <span class="glossary-related-label">相关：</span>
                <button
                  v-for="relId in term.related"
                  :key="relId"
                  class="glossary-related-tag"
                  @click="jumpToTerm(relId)"
                >
                  {{ getTermById(relId)?.term || relId }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部提交入口 -->
        <div class="glossary-footer-cta">
          <VaIcon name="add_circle_outline" size="18px" color="primary" />
          <span>没找到你要的术语？</span>
          <a
            href="mailto:suggest@aiskillnav.com?subject=建议添加术语"
            class="glossary-submit-link"
          >
            提交新词 →
          </a>
          <span class="glossary-footer-meta">最后更新：2026年5月 · 共 {{ totalCount }} 个术语</span>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ──────────────────────────────────────────── */
.glossary-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ──────────────────────────────────────────── */
.glossary-hero {
  background: linear-gradient(135deg, #0d1527 0%, #1a1f44 45%, #0f1a2e 100%);
  padding: 2.5rem 2rem 2rem;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.glossary-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(139, 92, 246, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 40% 45% at 15% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.glossary-hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.glossary-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 92, 246, 0.18);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #c4b5fd;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.9rem;
}

.glossary-hero-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.6rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.glossary-hero-accent {
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glossary-hero-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1.3rem;
  line-height: 1.65;
}

.glossary-hero-subtitle strong {
  color: rgba(255, 255, 255, 0.85);
}

/* 搜索框 */
.glossary-search-wrap {
  max-width: 520px;
  margin: 0 auto 1.2rem;
}

.glossary-search-input {
  width: 100%;
}

.glossary-search-input :deep(input) {
  color: #fff !important;
}

.glossary-search-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

.glossary-search-input :deep(.va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.glossary-search-input :deep(.va-input-wrapper:hover .va-input-wrapper__field),
.glossary-search-input :deep(.va-input-wrapper--focused .va-input-wrapper__field) {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
}

/* 统计 */
.glossary-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.8rem;
  flex-wrap: wrap;
}

.glossary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.glossary-stat-num {
  font-size: 1.3rem;
  font-weight: 700;
}

.glossary-stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* ── Body ──────────────────────────────────────────── */
.glossary-body {
  display: flex;
  flex: 1;
  align-items: flex-start;
  margin: 0 -1rem;
  min-height: 0;
}

/* ── Sidebar ───────────────────────────────────────── */
.glossary-sidebar {
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

.glossary-sidebar::-webkit-scrollbar {
  width: 3px;
}

.glossary-sidebar::-webkit-scrollbar-thumb {
  background: var(--va-background-border);
  border-radius: 3px;
}

.glossary-sidebar-inner {
  padding: 13px 8px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.glossary-sidebar-section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--va-text-secondary);
  padding: 4px 6px 2px;
  opacity: 0.6;
}

.glossary-sidebar-div {
  height: 1px;
  background: var(--va-background-border);
  margin: 8px 4px;
}

.glossary-cat-btn {
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
  font-size: 12px;
  color: var(--va-text-secondary);
}

.glossary-cat-btn:hover {
  background: var(--va-background-secondary);
}

.glossary-cat-btn.active {
  background: rgba(139, 92, 246, 0.1);
  color: var(--va-text-primary);
  font-weight: 600;
}

.glossary-cat-btn.active .va-icon {
  color: var(--cat-color, #8b5cf6) !important;
}

.glossary-cat-count {
  margin-left: auto;
  font-size: 10px;
  background: var(--va-background-element);
  padding: 1px 5px;
  border-radius: 8px;
  flex-shrink: 0;
}

.glossary-cat-btn.active .glossary-cat-count {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

/* 字母网格 */
.glossary-alphabet-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  padding: 2px;
}

.glossary-alpha-btn {
  padding: 4px 2px;
  border-radius: 5px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: center;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--va-text-secondary);
  transition: all 0.15s;
}

.glossary-alpha-btn:hover:not(.disabled) {
  background: var(--va-background-secondary);
  border-color: rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
}

.glossary-alpha-btn.active {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  color: #8b5cf6;
}

.glossary-alpha-btn.disabled {
  opacity: 0.2;
  cursor: default;
}

/* ── Main ──────────────────────────────────────────── */
.glossary-main {
  flex: 1;
  min-width: 0;
  padding: 1.4rem 1.6rem 2rem;
}

/* 结果栏 */
.glossary-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding: 7px 12px;
  background: var(--va-background-secondary);
  border-radius: 7px;
  border: 1px solid var(--va-background-border);
}

.glossary-result-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--va-text-secondary);
}

.glossary-clear-btn {
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

.glossary-clear-btn:hover {
  background: var(--va-background-element);
  color: var(--va-text-primary);
}

/* 空状态 */
.glossary-empty {
  text-align: center;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.glossary-empty p {
  font-size: 13.5px;
  color: var(--va-text-secondary);
  margin: 0;
}

/* ── 字母锚点 ──────────────────────────────────────── */
.glossary-letter-anchor {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 1.8rem 0 0.9rem;
  scroll-margin-top: 70px;
}

.glossary-letter-label {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glossary-letter-line {
  flex: 1;
  height: 1px;
  background: var(--va-background-border);
}

/* ── 术语列表 ──────────────────────────────────────── */
.glossary-terms-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0.5rem;
}

/* ── 术语卡片 ──────────────────────────────────────── */
.glossary-term-card {
  padding: 16px 18px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 11px;
  transition: all 0.2s ease;
  border-left: 3px solid var(--term-color, #6366f1);
  scroll-margin-top: 70px;
}

.glossary-term-card:hover {
  border-color: var(--term-color, #6366f1);
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.06);
}

/* 卡片头部 */
.glossary-term-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.glossary-term-header-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.glossary-term-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.glossary-term-name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.glossary-term-name {
  font-size: 15px;
  font-weight: 800;
  margin: 0;
  color: var(--va-text-primary);
  letter-spacing: -0.2px;
}

.glossary-term-zh {
  font-size: 12px;
  color: var(--va-text-secondary);
  font-weight: 500;
}

.glossary-term-cat-badge {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 7px;
  font-size: 10.5px;
  font-weight: 500;
  border: 1px solid;
}

/* 内链按钮 */
.glossary-term-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 7px;
  border: 1px solid var(--va-background-border);
  background: var(--va-background-element);
  color: var(--va-text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}

.glossary-term-link-btn:hover {
  border-color: var(--term-color, #6366f1);
  color: var(--term-color, #6366f1);
  background: var(--va-background-secondary);
}

/* 定义 */
.glossary-term-def {
  font-size: 13px;
  color: var(--va-text-primary);
  line-height: 1.7;
  margin: 0 0 10px;
}

/* 使用场景 */
.glossary-term-usage {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 11px;
  background: var(--va-background-element);
  border-radius: 7px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--va-text-secondary);
  line-height: 1.6;
}

.glossary-term-usage .va-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

/* 相关术语 */
.glossary-term-related {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.glossary-related-label {
  font-size: 11px;
  color: var(--va-text-secondary);
  flex-shrink: 0;
}

.glossary-related-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
  cursor: pointer;
  transition: all 0.15s;
}

.glossary-related-tag:hover {
  background: rgba(99, 102, 241, 0.18);
  border-color: rgba(99, 102, 241, 0.4);
}

/* ── 底部 CTA ───────────────────────────────────────── */
.glossary-footer-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 18px;
  background: var(--va-background-secondary);
  border-radius: 10px;
  border: 1px dashed var(--va-background-border);
  margin-top: 1.5rem;
  font-size: 13px;
  color: var(--va-text-secondary);
}

.glossary-submit-link {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.15s;
}

.glossary-submit-link:hover {
  color: #6d28d9;
}

.glossary-footer-meta {
  margin-left: auto;
  font-size: 11px;
  color: var(--va-text-secondary);
  opacity: 0.6;
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 900px) {
  .glossary-body {
    flex-direction: column;
  }

  .glossary-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid var(--va-background-border);
  }

  .glossary-sidebar-inner {
    padding: 10px 12px;
  }

  .glossary-alphabet-grid {
    grid-template-columns: repeat(13, 1fr);
  }

  .glossary-main {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .glossary-hero-title {
    font-size: 1.65rem;
  }

  .glossary-stats {
    gap: 1rem;
  }

  .glossary-alphabet-grid {
    grid-template-columns: repeat(9, 1fr);
  }

  .glossary-term-header {
    flex-direction: column;
  }

  .glossary-footer-meta {
    margin-left: 0;
    width: 100%;
  }
}
</style>
