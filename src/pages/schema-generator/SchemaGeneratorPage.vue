<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { schemaTypes, schemaTools, getToolsForType, type SchemaType, type SchemaTool } from '../../data/schema-tools'

const router = useRouter()

const activeTypeId = ref<string>('faq') // 默认选中 FAQ（AEO 核心）
const copiedId = ref<string>('')

const activeType = computed<SchemaType | undefined>(() => schemaTypes.find((t) => t.id === activeTypeId.value))

const activeTypeTools = computed<SchemaTool[]>(() => (activeTypeId.value ? getToolsForType(activeTypeId.value) : []))

// 全能型工具（不按 Schema 类型过滤，始终显示）
const universalTools = computed<SchemaTool[]>(() =>
  schemaTools.filter((t) => ['merkle', 'google-rich-results', 'schema-org-validator'].includes(t.id)),
)

// AI 自动化工具
const autoTools = computed<SchemaTool[]>(() => schemaTools.filter((t) => t.level === 'auto'))

function selectType(id: string) {
  activeTypeId.value = id
  copiedId.value = ''
}

async function copyCode(code: string, id: string) {
  try {
    await navigator.clipboard.writeText(code)
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = ''
    }, 2000)
  } catch {
    // fallback
    const el = document.createElement('textarea')
    el.value = code
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = ''
    }, 2000)
  }
}

function openTool(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function renderStars(n: number): string {
  return '⭐'.repeat(n)
}

function getLevelLabel(level: SchemaTool['level']): string {
  const map = { beginner: '适合新手', advanced: '进阶用', auto: '全自动' }
  return map[level]
}

function getLevelColor(level: SchemaTool['level']): string {
  const map = { beginner: '#10B981', advanced: '#6366F1', auto: '#F59E0B' }
  return map[level]
}
</script>

<template>
  <div class="schema-page">
    <!-- ── Hero ──────────────────────────────────────────────── -->
    <div class="schema-hero">
      <div class="schema-hero-bg" />
      <div class="schema-hero-content">
        <div class="schema-hero-badge">
          <VaIcon name="data_object" size="14px" />
          <span>结构化数据 · Schema Markup 工具聚合</span>
        </div>
        <h1 class="schema-hero-title">
          Schema 标记生成器<br />
          <span class="schema-hero-accent">工具导航 & 模板中心</span>
        </h1>
        <p class="schema-hero-subtitle">
          聚合 <strong>{{ schemaTools.length }}+</strong> 款 Schema 生成与验证工具，覆盖
          <strong>{{ schemaTypes.length }}</strong> 种常用类型，含 JSON-LD 模板和字段说明，
          帮助你快速为网站添加结构化数据，提升富结果展示和 AI 引用概率。
        </p>

        <!-- 工作流提示 -->
        <div class="schema-workflow">
          <div class="schema-workflow-step">
            <span class="schema-wf-num">1</span>
            <span>选择 Schema 类型</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="schema-workflow-step">
            <span class="schema-wf-num">2</span>
            <span>用工具生成代码</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="schema-workflow-step">
            <span class="schema-wf-num">3</span>
            <span>复制 JSON-LD 模板</span>
          </div>
          <VaIcon name="chevron_right" size="14px" color="rgba(255,255,255,0.3)" />
          <div class="schema-workflow-step active">
            <span class="schema-wf-num">4</span>
            <span>Google官方验证 ✅</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 类型选择标签栏 ────────────────────────────────────── -->
    <div class="schema-type-bar">
      <div class="schema-type-tabs">
        <button
          v-for="type in schemaTypes"
          :key="type.id"
          class="schema-type-tab"
          :class="{ active: activeTypeId === type.id }"
          :style="activeTypeId === type.id ? { '--tab-color': type.color } : {}"
          @click="selectType(type.id)"
        >
          <VaIcon :name="type.icon" size="14px" :style="{ color: activeTypeId === type.id ? type.color : '' }" />
          <span>{{ type.name }}</span>
          <span class="schema-type-stars">{{ renderStars(type.stars) }}</span>
        </button>
      </div>
    </div>

    <!-- ── 主体内容 ───────────────────────────────────────────── -->
    <div class="schema-body">
      <!-- ── 左侧：类型详情 ── -->
      <div class="schema-main">
        <div v-if="activeType" class="schema-detail">
          <!-- 类型头部 -->
          <div class="schema-detail-header" :style="{ borderLeftColor: activeType.color }">
            <div class="schema-detail-header-left">
              <div class="schema-detail-icon" :style="{ background: activeType.color + '18' }">
                <VaIcon :name="activeType.icon" :style="{ color: activeType.color }" size="22px" />
              </div>
              <div>
                <div class="schema-detail-name-row">
                  <h2 class="schema-detail-name">{{ activeType.name }} Schema</h2>
                  <span class="schema-detail-stars">{{ renderStars(activeType.stars) }}</span>
                </div>
                <p class="schema-detail-desc">{{ activeType.description }}</p>
              </div>
            </div>
          </div>

          <!-- AEO 提示（仅 FAQ） -->
          <div v-if="activeType.aeoTip" class="schema-aeo-tip">
            <div class="schema-aeo-tip-header">
              <VaIcon name="auto_awesome" size="15px" color="#10B981" />
              <strong>AEO 核心技巧</strong>
            </div>
            <p>{{ activeType.aeoTip }}</p>
            <button
              v-if="activeType.internalLink"
              class="schema-aeo-link"
              @click="router.push(activeType.internalLink!)"
            >
              <VaIcon name="open_in_new" size="12px" />
              {{ activeType.internalLinkLabel }}
            </button>
          </div>

          <!-- 必填字段说明 -->
          <div class="schema-required-fields">
            <div class="schema-section-title">
              <VaIcon name="check_circle" size="14px" color="success" />
              必填字段说明
            </div>
            <div class="schema-fields-list">
              <div v-for="field in activeType.requiredFields" :key="field.name" class="schema-field-item">
                <code class="schema-field-name">{{ field.name }}</code>
                <span class="schema-field-desc">{{ field.desc }}</span>
              </div>
            </div>
          </div>

          <!-- JSON-LD 模板 -->
          <div class="schema-template-block">
            <div class="schema-template-header">
              <div class="schema-section-title">
                <VaIcon name="code" size="14px" color="primary" />
                JSON-LD 模板代码
              </div>
              <button
                class="schema-copy-btn"
                :class="{ copied: copiedId === activeType.id }"
                @click="copyCode(activeType.jsonTemplate, activeType.id)"
              >
                <VaIcon :name="copiedId === activeType.id ? 'check' : 'content_copy'" size="13px" />
                {{ copiedId === activeType.id ? '已复制！' : '复制代码' }}
              </button>
            </div>
            <pre class="schema-code-block"><code>{{ activeType.jsonTemplate }}</code></pre>
          </div>

          <!-- 推荐工具 -->
          <div class="schema-section-title" style="margin-top: 1.4rem">
            <VaIcon name="build" size="14px" color="warning" />
            推荐生成工具
          </div>
          <div class="schema-tools-grid">
            <div v-for="tool in activeTypeTools" :key="tool.id" class="schema-tool-card" @click="openTool(tool.url)">
              <div class="schema-tool-top">
                <div class="schema-tool-name-row">
                  <span class="schema-tool-name">{{ tool.name }}</span>
                  <span
                    v-if="tool.badge"
                    class="schema-tool-badge"
                    :style="{
                      background: tool.isOfficial ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                      color: tool.isOfficial ? '#059669' : '#d97706',
                    }"
                  >
                    {{ tool.badge }}
                  </span>
                </div>
                <span
                  class="schema-level-tag"
                  :style="{
                    color: getLevelColor(tool.level),
                    borderColor: getLevelColor(tool.level) + '40',
                    background: getLevelColor(tool.level) + '12',
                  }"
                >
                  {{ getLevelLabel(tool.level) }}
                </span>
              </div>
              <p class="schema-tool-desc">{{ tool.description }}</p>
              <div class="schema-tool-highlights">
                <span v-for="h in tool.highlights" :key="h" class="schema-highlight-tag">
                  <VaIcon name="check" size="10px" />{{ h }}
                </span>
              </div>
              <div class="schema-tool-footer">
                <div class="schema-price-tag">
                  <VaIcon name="sell" size="11px" />
                  {{ tool.isFree ? '免费' : tool.pricing || '付费' }}
                </div>
                <div class="schema-visit-btn">
                  <VaIcon name="open_in_new" size="11px" />
                  前往使用
                </div>
              </div>
            </div>
          </div>

          <!-- 验证提示 -->
          <div class="schema-validate-tip">
            <VaIcon name="verified" size="15px" color="#6366F1" />
            <span
              >生成代码后，务必用 <strong>Google Rich Results Test</strong> 和
              <strong>Schema.org Validator</strong> 验证</span
            >
            <div class="schema-validate-btns">
              <button class="schema-validate-btn" @click="openTool('https://search.google.com/test/rich-results')">
                <VaIcon name="open_in_new" size="11px" />Google 验证
              </button>
              <button class="schema-validate-btn" @click="openTool('https://validator.schema.org/')">
                <VaIcon name="open_in_new" size="11px" />Schema.org 验证
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 右侧：全能工具 + AI自动化 ── -->
      <aside class="schema-sidebar">
        <div class="schema-sidebar-inner">
          <!-- 全能型工具 -->
          <div class="schema-sidebar-section">
            <div class="schema-sidebar-section-title">
              <VaIcon name="star" size="13px" color="warning" />
              🥇 全能型首选
            </div>
            <div class="schema-sidebar-tools">
              <div
                v-for="tool in universalTools"
                :key="tool.id"
                class="schema-sidebar-tool"
                @click="openTool(tool.url)"
              >
                <div class="schema-sidebar-tool-top">
                  <span class="schema-sidebar-tool-name">{{ tool.name }}</span>
                  <span v-if="tool.badge" class="schema-sidebar-badge">{{ tool.badge }}</span>
                </div>
                <div class="schema-sidebar-tool-meta">
                  <span class="schema-level-tag-sm" :style="{ color: getLevelColor(tool.level) }">{{
                    getLevelLabel(tool.level)
                  }}</span>
                  <span class="schema-sidebar-free">{{ tool.isFree ? '免费' : tool.pricing }}</span>
                </div>
                <div class="schema-sidebar-tool-visit">
                  <VaIcon name="open_in_new" size="10px" />
                  前往使用
                </div>
              </div>
            </div>
          </div>

          <div class="schema-sidebar-div" />

          <!-- AI 自动化 -->
          <div class="schema-sidebar-section">
            <div class="schema-sidebar-section-title">
              <VaIcon name="auto_awesome" size="13px" color="primary" />
              🤖 AI 全自动方案
            </div>
            <p class="schema-sidebar-tip">适合 WordPress 站长或希望"一次设置、永久生效"的用户</p>
            <div class="schema-sidebar-tools">
              <div v-for="tool in autoTools" :key="tool.id" class="schema-sidebar-tool" @click="openTool(tool.url)">
                <div class="schema-sidebar-tool-top">
                  <span class="schema-sidebar-tool-name">{{ tool.name }}</span>
                  <span v-if="tool.badge" class="schema-sidebar-badge schema-sidebar-badge-auto">{{ tool.badge }}</span>
                </div>
                <div class="schema-sidebar-tool-meta">
                  <span class="schema-level-tag-sm" :style="{ color: getLevelColor(tool.level) }">{{
                    getLevelLabel(tool.level)
                  }}</span>
                  <span class="schema-sidebar-free">{{ tool.hasFreeplan ? '含免费版' : tool.pricing }}</span>
                </div>
                <div class="schema-sidebar-tool-visit">
                  <VaIcon name="open_in_new" size="10px" />
                  前往使用
                </div>
              </div>
            </div>
          </div>

          <div class="schema-sidebar-div" />

          <!-- 小贴士 -->
          <div class="schema-sidebar-tips">
            <div class="schema-sidebar-section-title">
              <VaIcon name="lightbulb" size="13px" color="warning" />
              实施小贴士
            </div>
            <ul class="schema-tips-list">
              <li>
                <VaIcon name="check" size="11px" color="success" />
                <span>将 JSON-LD 放在 <code>&lt;head&gt;</code> 或 <code>&lt;body&gt;</code> 末尾均可</span>
              </li>
              <li>
                <VaIcon name="check" size="11px" color="success" />
                <span>同一页面可叠加多种 Schema 类型</span>
              </li>
              <li>
                <VaIcon name="check" size="11px" color="success" />
                <span>FAQ Schema 对 AI 搜索引用效果最佳</span>
              </li>
              <li>
                <VaIcon name="check" size="11px" color="success" />
                <span>部署后 1-2 周 Google 开始识别</span>
              </li>
              <li>
                <VaIcon name="check" size="11px" color="success" />
                <span>每次内容更新后重新验证 Schema</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ──────────────────────────────────────────── */
.schema-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ──────────────────────────────────────────── */
.schema-hero {
  background: linear-gradient(135deg, #0d1a2e 0%, #1a2744 45%, #0f1f38 100%);
  padding: 2.5rem 2rem 2rem;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.schema-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 15% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.schema-hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.schema-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fcd34d;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.9rem;
}

.schema-hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.6rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.schema-hero-accent {
  background: linear-gradient(90deg, #fbbf24, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.schema-hero-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1.2rem;
  line-height: 1.65;
}

.schema-hero-subtitle strong {
  color: rgba(255, 255, 255, 0.85);
}

/* Workflow */
.schema-workflow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.schema-workflow-step {
  display: flex;
  align-items: center;
  gap: 5px;
}

.schema-workflow-step.active {
  color: #fbbf24;
  font-weight: 600;
}

.schema-wf-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
}

.schema-workflow-step.active .schema-wf-num {
  background: rgba(251, 191, 36, 0.25);
  color: #fbbf24;
}

/* ── 类型标签栏 ────────────────────────────────────── */
.schema-type-bar {
  background: var(--va-background-secondary);
  border-bottom: 1px solid var(--va-background-border);
  padding: 0 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.schema-type-bar::-webkit-scrollbar {
  display: none;
}

.schema-type-tabs {
  display: flex;
  gap: 2px;
  min-width: max-content;
}

.schema-type-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--va-text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
  white-space: nowrap;
}

.schema-type-tab:hover {
  color: var(--va-text-primary);
  background: var(--va-background-element);
}

.schema-type-tab.active {
  color: var(--va-text-primary);
  border-bottom-color: var(--tab-color, #6366f1);
  font-weight: 600;
}

.schema-type-stars {
  font-size: 9px;
  opacity: 0.6;
}

/* ── Body ──────────────────────────────────────────── */
.schema-body {
  display: flex;
  flex: 1;
  align-items: flex-start;
  margin: 0 -1rem;
  min-height: 0;
}

/* ── Main ──────────────────────────────────────────── */
.schema-main {
  flex: 1;
  min-width: 0;
  padding: 1.4rem 1.6rem 2rem;
}

.schema-detail {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* 类型头部 */
.schema-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--va-background-secondary);
  border-radius: 10px;
  border-left: 4px solid;
  gap: 10px;
}

.schema-detail-header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.schema-detail-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.schema-detail-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.schema-detail-name {
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
  color: var(--va-text-primary);
}

.schema-detail-stars {
  font-size: 11px;
}

.schema-detail-desc {
  font-size: 12.5px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* AEO 提示 */
.schema-aeo-tip {
  padding: 13px 15px;
  background: rgba(16, 185, 129, 0.07);
  border: 1px solid rgba(16, 185, 129, 0.22);
  border-radius: 9px;
}

.schema-aeo-tip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
  font-size: 12.5px;
  color: #059669;
}

.schema-aeo-tip p {
  font-size: 12.5px;
  color: var(--va-text-secondary);
  margin: 0 0 10px;
  line-height: 1.6;
}

.schema-aeo-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 11px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  color: #059669;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.schema-aeo-link:hover {
  background: rgba(16, 185, 129, 0.2);
}

/* Section title */
.schema-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin-bottom: 10px;
}

/* 必填字段 */
.schema-required-fields {
  background: var(--va-background-secondary);
  border-radius: 9px;
  padding: 13px 15px;
  border: 1px solid var(--va-background-border);
}

.schema-fields-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.schema-field-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 12px;
}

.schema-field-name {
  flex-shrink: 0;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 1px 7px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11.5px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.schema-field-desc {
  color: var(--va-text-secondary);
  line-height: 1.5;
}

/* JSON-LD 模板 */
.schema-template-block {
  background: var(--va-background-secondary);
  border-radius: 9px;
  border: 1px solid var(--va-background-border);
  overflow: hidden;
}

.schema-template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  border-bottom: 1px solid var(--va-background-border);
  background: var(--va-background-element);
}

.schema-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 11px;
  border-radius: 6px;
  border: 1px solid var(--va-background-border);
  background: var(--va-background-secondary);
  color: var(--va-text-secondary);
  font-size: 11.5px;
  cursor: pointer;
  transition: all 0.15s;
}

.schema-copy-btn:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}

.schema-copy-btn.copied {
  border-color: #10b981;
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.schema-code-block {
  margin: 0;
  padding: 14px 16px;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--va-text-primary);
  background: transparent;
  overflow-x: auto;
  white-space: pre;
}

/* 推荐工具网格 */
.schema-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.schema-tool-card {
  padding: 13px 14px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schema-tool-card:hover {
  border-color: #f59e0b;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.schema-tool-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}

.schema-tool-name-row {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.schema-tool-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--va-text-primary);
}

.schema-tool-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 5px;
  font-weight: 600;
}

.schema-level-tag {
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 6px;
  border: 1px solid;
}

.schema-tool-desc {
  font-size: 11.5px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.55;
  flex: 1;
}

.schema-tool-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.schema-highlight-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  padding: 2px 7px;
  background: var(--va-background-element);
  border-radius: 5px;
  color: var(--va-text-secondary);
  border: 1px solid var(--va-background-border);
}

.schema-tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.schema-price-tag {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--va-text-secondary);
}

.schema-visit-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #f59e0b;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s;
}

.schema-tool-card:hover .schema-visit-btn {
  opacity: 1;
}

/* 验证提示 */
.schema-validate-tip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 15px;
  background: rgba(99, 102, 241, 0.07);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9px;
  font-size: 12.5px;
  color: var(--va-text-secondary);
}

.schema-validate-tip strong {
  color: var(--va-text-primary);
}

.schema-validate-btns {
  display: flex;
  gap: 6px;
  margin-left: auto;
  flex-wrap: wrap;
}

.schema-validate-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 11px;
  border-radius: 6px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.schema-validate-btn:hover {
  background: rgba(99, 102, 241, 0.16);
}

/* ── Sidebar ───────────────────────────────────────── */
.schema-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 60px;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  border-left: 1px solid var(--va-background-border);
  background: var(--va-background-primary);
  scrollbar-width: thin;
  scrollbar-color: var(--va-background-border) transparent;
}

.schema-sidebar::-webkit-scrollbar {
  width: 3px;
}

.schema-sidebar::-webkit-scrollbar-thumb {
  background: var(--va-background-border);
  border-radius: 3px;
}

.schema-sidebar-inner {
  padding: 14px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schema-sidebar-div {
  height: 1px;
  background: var(--va-background-border);
  margin: 2px 0;
}

.schema-sidebar-section-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin-bottom: 8px;
}

.schema-sidebar-tip {
  font-size: 11px;
  color: var(--va-text-secondary);
  margin: -4px 0 8px;
  line-height: 1.5;
}

.schema-sidebar-tools {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.schema-sidebar-tool {
  padding: 10px 11px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.schema-sidebar-tool:hover {
  border-color: #f59e0b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.schema-sidebar-tool-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 4px;
}

.schema-sidebar-tool-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--va-text-primary);
}

.schema-sidebar-badge {
  font-size: 9.5px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  font-weight: 600;
  flex-shrink: 0;
}

.schema-sidebar-badge-auto {
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
}

.schema-sidebar-tool-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.schema-level-tag-sm {
  font-size: 10.5px;
  font-weight: 600;
}

.schema-sidebar-free {
  font-size: 10.5px;
  color: var(--va-text-secondary);
}

.schema-sidebar-tool-visit {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  color: #f59e0b;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s;
}

.schema-sidebar-tool:hover .schema-sidebar-tool-visit {
  opacity: 1;
}

/* Tips 列表 */
.schema-tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.schema-tips-list li {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11.5px;
  color: var(--va-text-secondary);
  line-height: 1.5;
}

.schema-tips-list li .va-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.schema-tips-list li code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 10.5px;
  background: var(--va-background-element);
  padding: 0 4px;
  border-radius: 3px;
  color: var(--va-text-primary);
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 1100px) {
  .schema-sidebar {
    width: 220px;
  }
}

@media (max-width: 900px) {
  .schema-body {
    flex-direction: column;
  }

  .schema-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    border-left: none;
    border-top: 1px solid var(--va-background-border);
    order: -1;
  }

  .schema-sidebar-inner {
    padding: 12px;
  }

  .schema-sidebar-tools {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .schema-main {
    padding: 1rem;
  }

  .schema-type-bar {
    padding: 0 1rem;
  }
}

@media (max-width: 600px) {
  .schema-hero-title {
    font-size: 1.65rem;
  }

  .schema-tools-grid {
    grid-template-columns: 1fr;
  }

  .schema-validate-btns {
    margin-left: 0;
  }

  .schema-workflow {
    font-size: 11px;
  }
}
</style>
