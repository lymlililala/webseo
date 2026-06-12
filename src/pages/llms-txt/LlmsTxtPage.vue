<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '../../composables/usePageSeo'

const { t } = useI18n()

usePageSeo({
  title: t('llmsTxtPage.seoTitle'),
  description: t('llmsTxtPage.seoDescription'),
  path: '/llms-txt',
  keywords: t('llmsTxtPage.seoKeywords'),
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'llms.txt Generator',
      description: 'llms.txt generators, validators and templates — build an AI-readable semantic index',
      url: 'https://sgaindex.com/llms-txt',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
})

const activeTab = ref<'tools' | 'templates' | 'guide'>('tools')

// ── External tools (by category) ────────────────────────────────────────
const toolGroups = [
  {
    label: 'Auto-generate (enter a URL)',
    color: '#6366F1',
    icon: 'auto_awesome',
    tools: [
      {
        name: 'LLMrefs generator',
        url: 'https://llmrefs.com/llms-txt-generator',
        desc: 'Paste a site URL to fetch and generate llms.txt in one click; supports online hosting and auto-updates',
        badge: 'Recommended',
        badgeColor: '#6366F1',
      },
    ],
  },
  {
    label: 'Fill-in generator',
    color: '#10B981',
    icon: 'edit_note',
    tools: [
      {
        name: 'Geordy.ai',
        url: 'https://geordy.ai',
        desc: 'GEO optimization platform with a built-in llms.txt editor; use alongside an AI content strategy',
        badge: '',
        badgeColor: '',
      },
      {
        name: 'SiteSpeakAI llms.txt',
        url: 'https://sitespeak.ai/tools/llms-txt-generator',
        desc: 'Online form-based generator; fill in your site info and export in one click',
        badge: '',
        badgeColor: '',
      },
    ],
  },
]

// ── Template data ──────────────────────────────────────────────────
const templates = [
  {
    id: 'saas',
    label: 'SaaS Product',
    icon: 'cloud',
    color: '#6366F1',
    desc: 'For SaaS platforms and web apps',
    preview:
      '# Product name\n\n> Describe your SaaS product’s core value in one sentence\n\n## Core features\n- [Feature A](https://example.com/features/a): primary feature description\n- [Feature B](https://example.com/features/b): secondary feature description\n\n## Pricing\n- [pricing page](https://example.com/pricing): free vs paid comparison\n\n## Docs\n- [Quick start](https://example.com/docs/start): 5-minute quick start\n- [API reference](https://example.com/docs/api): full API docs\n\n## Optional\n- [Blog](https://example.com/blog): product updates and industry insight',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce / Retail',
    icon: 'shopping_cart',
    color: '#10B981',
    desc: 'For e-commerce and brand sites',
    preview:
      '# Brand name\n\n> brand positioning and core value proposition\n\n## best sellers\n- [Product A](https://example.com/products/a): product key selling point\n- [Product B](https://example.com/products/b): product key selling point\n\n## brand story\n- [about us](https://example.com/about): brand history and philosophy\n\n## service guarantees\n- [after-sales](https://example.com/service): return policy\n- [contact us](https://example.com/contact): customer support\n\n## Optional\n- [new arrivals](https://example.com/new): latest products',
  },
  {
    id: 'content',
    label: 'Content / Media',
    icon: 'article',
    color: '#F59E0B',
    desc: 'For blogs, content sites and media',
    preview:
      '# Site name\n\n> content positioning: focus area, audience, core value\n\n## featured content\n- [Article A](https://example.com/article-a): content summary\n- [Article B](https://example.com/article-b): content summary\n\n## topic categories\n- [Topic 1](https://example.com/topic/1): topic note\n\n## About\n- [about the author](https://example.com/about): author background and expertise\n\n## Optional\n- [Newsletter](https://example.com/newsletter): weekly newsletter',
  },
  {
    id: 'enterprise',
    label: 'Company sites',
    icon: 'business',
    color: '#0EA5E9',
    desc: 'For B2B companies and organizations',
    preview:
      '# Company name\n\n> company business description: audience, core capabilities, market position\n\n## core business\n- [Service A](https://example.com/services/a): service description\n- [Service B](https://example.com/services/b): service description\n\n## Solutions\n- [industry solutions](https://example.com/solutions): solutions for specific industries\n\n## about the company\n- [company profile](https://example.com/about): founding date, size, awards\n- [Team](https://example.com/team): core team intro\n\n## Optional\n- [Cases](https://example.com/cases): case studies',
  },
  {
    id: 'tool',
    label: 'Tools / Open Source',
    icon: 'build_circle',
    color: '#EC4899',
    desc: 'For developer tools and open-source projects',
    preview:
      '# Tool name\n\n> one-sentence description of the tool: what problem it solves and who it’s for\n\n## Quick start\n- [install guide](https://example.com/install): 5-step install\n- [basic usage](https://example.com/usage): basic usage example\n\n## Docs\n- [API docs](https://example.com/api): full API reference\n- [config](https://example.com/config): all config options\n\n## Community\n- [GitHub](https://github.com/user/repo): source, Issue, PR\n\n## Optional\n- [changelog](https://example.com/changelog): version history',
  },
]

// ── Copy the template content ──────────────────────────────────────────────
const copyingId = ref('')
async function copyTemplate(tpl: (typeof templates)[0]) {
  copyingId.value = tpl.id
  await navigator.clipboard.writeText(tpl.preview)
  setTimeout(() => (copyingId.value = ''), 2000)
}
</script>

<template>
  <div class="llms-page">
    <!-- ── Hero ──────────────────────────────────────────── -->
    <div class="llms-hero">
      <div class="llms-hero-bg" />
      <div class="llms-hero-content">
        <div class="llms-hero-badge">
          <VaIcon name="description" size="14px" />
          <span>{{ t('llmsTxtPage.badge') }}</span>
        </div>
        <h1 class="llms-hero-title">{{ t('llmsTxtPage.heroTitleMain') }}<br /><span class="llms-hero-accent">{{ t('llmsTxtPage.heroTitleAccent') }}</span></h1>
        <p class="llms-hero-sub" v-html="t('llmsTxtPage.heroSub')"></p>
        <div class="llms-stats">
          <div class="llms-stat">
            <span class="llms-stat-n">2024</span><span class="llms-stat-l">{{ t('llmsTxtPage.statSpecYear') }}</span>
          </div>
          <div class="llms-stat-sep" />
          <div class="llms-stat">
            <span class="llms-stat-n">{{ toolGroups.reduce((s, g) => s + g.tools.length, 0) }}</span
            ><span class="llms-stat-l">{{ t('llmsTxtPage.statToolsListed') }}</span>
          </div>
          <div class="llms-stat-sep" />
          <div class="llms-stat">
            <span class="llms-stat-n">{{ templates.length }}</span
            ><span class="llms-stat-l">{{ t('llmsTxtPage.statTemplates') }}</span>
          </div>
          <div class="llms-stat-sep" />
          <div class="llms-stat"><span class="llms-stat-n">{{ t('llmsTxtPage.statFreeVal') }}</span><span class="llms-stat-l">{{ t('llmsTxtPage.statAllFree') }}</span></div>
        </div>
        <div class="llms-concept-bar">
          <div class="llms-ci">
            <VaIcon name="description" size="14px" color="#60A5FA" /><span v-html="t('llmsTxtPage.concept1')"></span>
          </div>
          <span class="llms-sep">·</span>
          <div class="llms-ci">
            <VaIcon name="smart_toy" size="14px" color="#A78BFA" /><span v-html="t('llmsTxtPage.concept2')"></span>
          </div>
          <span class="llms-sep">·</span>
          <div class="llms-ci">
            <VaIcon name="bolt" size="14px" color="#FCD34D" /><span>{{ t('llmsTxtPage.concept3') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tab directory ─────────────────────────────────────── -->
    <div class="llms-tabs">
      <button class="llms-tab" :class="{ active: activeTab === 'tools' }" @click="activeTab = 'tools'">
        <VaIcon name="grid_view" size="14px" />{{ t('llmsTxtPage.tabTools') }}
      </button>
      <button class="llms-tab" :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'">
        <VaIcon name="description" size="14px" />{{ t('llmsTxtPage.tabTemplates') }}
      </button>
      <button class="llms-tab" :class="{ active: activeTab === 'guide' }" @click="activeTab = 'guide'">
        <VaIcon name="menu_book" size="14px" />{{ t('llmsTxtPage.tabGuide') }}
      </button>
    </div>

    <!-- ── Recommended tools tab ────────────────────────────────────── -->
    <div v-if="activeTab === 'tools'" class="llms-tools-body">
      <div v-for="group in toolGroups" :key="group.label" class="llms-tool-group">
        <div class="llms-group-hd">
          <div class="llms-group-icon" :style="{ background: group.color + '18' }">
            <VaIcon :name="group.icon" size="16px" :style="{ color: group.color }" />
          </div>
          <span class="llms-group-label">{{ group.label }}</span>
          <span class="llms-group-count">{{ group.tools.length }}</span>
        </div>
        <div class="llms-tool-grid">
          <a
            v-for="tool in group.tools"
            :key="tool.name"
            :href="tool.url"
            target="_blank"
            rel="noopener"
            class="llms-tool-card"
          >
            <div class="llms-tool-top">
              <span class="llms-tool-name">{{ tool.name }}</span>
              <span
                v-if="tool.badge"
                class="llms-tool-badge"
                :style="{
                  background: tool.badgeColor + '18',
                  color: tool.badgeColor,
                  borderColor: tool.badgeColor + '40',
                }"
                >{{ tool.badge }}</span
              >
            </div>
            <p class="llms-tool-desc">{{ tool.desc }}</p>
            <div class="llms-tool-footer">
              <span class="llms-tool-link">{{ tool.url.replace(/^https?:\/\//, '').split('/')[0] }}</span>
              <VaIcon name="open_in_new" size="12px" />
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- ── Template library tab ─────────────────────────────────────── -->
    <div v-if="activeTab === 'templates'" class="llms-tpl-body">
      <p class="llms-tpl-intro">
        <VaIcon name="info_outline" size="14px" color="#60A5FA" />
        {{ t('llmsTxtPage.tplIntro') }}
      </p>
      <div class="llms-tpl-grid">
        <div v-for="tpl in templates" :key="tpl.id" class="llms-tpl-card" :style="{ '--tc': tpl.color }">
          <div class="llms-tpl-hd">
            <div class="llms-tpl-icon" :style="{ background: tpl.color + '20' }">
              <VaIcon :name="tpl.icon" size="20px" :style="{ color: tpl.color }" />
            </div>
            <div>
              <h3 class="llms-tpl-name">{{ tpl.label }}</h3>
              <p class="llms-tpl-desc">{{ tpl.desc }}</p>
            </div>
          </div>
          <pre class="llms-tpl-preview">{{ tpl.preview }}</pre>
          <button
            class="llms-tpl-btn"
            :style="{ background: copyingId === tpl.id ? '#10B981' : tpl.color }"
            @click="copyTemplate(tpl)"
          >
            <VaIcon :name="copyingId === tpl.id ? 'check' : 'content_copy'" size="13px" />
            {{ copyingId === tpl.id ? t('llmsTxtPage.copiedBtn') : t('llmsTxtPage.copyBtn') }}
          </button>
        </div>
      </div>

      <!-- Usage notes -->
      <div class="llms-tpl-tip">
        <VaIcon name="lightbulb_outline" size="15px" color="#F59E0B" />
        <div>
          <strong>{{ t('llmsTxtPage.tplHowTitle') }}</strong>
          <ol>
            <li>{{ t('llmsTxtPage.tplHow1') }}</li>
            <li>{{ t('llmsTxtPage.tplHow2') }}</li>
            <li v-html="t('llmsTxtPage.tplHow3')"></li>
            <li v-html="t('llmsTxtPage.tplHow4')"></li>
            <li>{{ t('llmsTxtPage.tplHow5') }}</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- ── Format guide tab ────────────────────────────────────── -->
    <div v-if="activeTab === 'guide'" class="llms-guide-body">
      <div class="llms-guide-grid">
        <!-- What is llms.txt -->
        <div class="llms-gc llms-gc--wide">
          <div class="llms-gc-hd">
            <VaIcon name="help_outline" size="18px" color="#60A5FA" />
            <h3>{{ t('llmsTxtPage.gWhatTitle') }}</h3>
          </div>
          <p v-html="t('llmsTxtPage.gWhatP1')"></p>
          <p v-html="t('llmsTxtPage.gWhatP2')"></p>
        </div>

        <!-- Format spec -->
        <div class="llms-gc">
          <div class="llms-gc-hd">
            <VaIcon name="code" size="18px" color="#A78BFA" />
            <h3>{{ t('llmsTxtPage.gFormatTitle') }}</h3>
          </div>
          <pre class="llms-code">{{ t('llmsTxtPage.gFormatCode') }}</pre>
          <p class="llms-note">{{ t('llmsTxtPage.gFormatNote') }}</p>
        </div>

        <!-- Best practices -->
        <div class="llms-gc">
          <div class="llms-gc-hd">
            <VaIcon name="tips_and_updates" size="18px" color="#10B981" />
            <h3>{{ t('llmsTxtPage.gBestTitle') }}</h3>
          </div>
          <ul class="llms-best">
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span v-html="t('llmsTxtPage.gBest1')"></span>
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span v-html="t('llmsTxtPage.gBest2')"></span>
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span v-html="t('llmsTxtPage.gBest3')"></span>
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span v-html="t('llmsTxtPage.gBest4')"></span>
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span v-html="t('llmsTxtPage.gBest5')"></span>
            </li>
          </ul>
        </div>

        <!-- Deployment -->
        <div class="llms-gc">
          <div class="llms-gc-hd">
            <VaIcon name="cloud_upload" size="18px" color="#F59E0B" />
            <h3>{{ t('llmsTxtPage.gDeployTitle') }}</h3>
          </div>
          <ol class="llms-steps">
            <li>
              <span class="llms-step-n">1</span><span v-html="t('llmsTxtPage.gDeploy1')"></span>
            </li>
            <li>
              <span class="llms-step-n">2</span><span v-html="t('llmsTxtPage.gDeploy2')"></span>
            </li>
            <li>
              <span class="llms-step-n">3</span><span v-html="t('llmsTxtPage.gDeploy3')"></span>
            </li>
            <li><span class="llms-step-n">4</span><span>{{ t('llmsTxtPage.gDeploy4') }}</span></li>
          </ol>
        </div>

        <!-- vs robots.txt -->
        <div class="llms-gc llms-gc--wide">
          <div class="llms-gc-hd">
            <VaIcon name="compare_arrows" size="18px" color="#EC4899" />
            <h3>{{ t('llmsTxtPage.gVsTitle') }}</h3>
          </div>
          <div class="llms-cmp-table">
            <div class="llms-cmp-row llms-cmp-hd"><span>{{ t('llmsTxtPage.cmpDimension') }}</span><span>robots.txt</span><span>llms.txt</span></div>
            <div class="llms-cmp-row">
              <span>{{ t('llmsTxtPage.cmpAudience') }}</span><span>{{ t('llmsTxtPage.cmpAudienceR') }}</span><span>{{ t('llmsTxtPage.cmpAudienceL') }}</span>
            </div>
            <div class="llms-cmp-row">
              <span>{{ t('llmsTxtPage.cmpFunc') }}</span><span>{{ t('llmsTxtPage.cmpFuncR') }}</span><span>{{ t('llmsTxtPage.cmpFuncL') }}</span>
            </div>
            <div class="llms-cmp-row"><span>{{ t('llmsTxtPage.cmpFormat') }}</span><span>{{ t('llmsTxtPage.cmpFormatR') }}</span><span>{{ t('llmsTxtPage.cmpFormatL') }}</span></div>
            <div class="llms-cmp-row"><span>{{ t('llmsTxtPage.cmpIntro') }}</span><span>1994</span><span>2024</span></div>
            <div class="llms-cmp-row">
              <span>{{ t('llmsTxtPage.cmpRole') }}</span><span>{{ t('llmsTxtPage.cmpRoleR') }}</span><span>{{ t('llmsTxtPage.cmpRoleL') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Root ──────────────────────────────────────────────── */
.llms-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ──────────────────────────────────────────────── */
.llms-hero {
  background: linear-gradient(135deg, #0a1628 0%, #0f2847 45%, #0a1e3a 100%);
  padding: 2.5rem 2rem 2rem;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.llms-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(96, 165, 250, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 15% 80%, rgba(167, 139, 250, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.llms-hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}
.llms-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: #93c5fd;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.9rem;
}
.llms-hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 0.7rem;
  letter-spacing: -0.5px;
}
.llms-hero-accent {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.llms-hero-sub {
  color: #bfdbfe;
  font-size: 0.92rem;
  line-height: 1.75;
  margin-bottom: 1.3rem;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
}
.llms-hero-sub strong {
  color: #93c5fd;
}

/* Stats */
.llms-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.llms-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.2rem;
}
.llms-stat-n {
  font-size: 1.4rem;
  font-weight: 700;
  color: #93c5fd;
  line-height: 1.1;
}
.llms-stat-l {
  font-size: 0.7rem;
  color: #818cf8;
  margin-top: 2px;
  white-space: nowrap;
}
.llms-stat-sep {
  width: 1px;
  height: 28px;
  background: rgba(96, 165, 250, 0.25);
}

/* Concept bar */
.llms-concept-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.75rem;
  color: #bfdbfe;
  margin-top: 0.7rem;
}
.llms-ci {
  display: flex;
  align-items: center;
  gap: 4px;
}
.llms-sep {
  color: rgba(191, 219, 254, 0.35);
}

/* ── Tabs ──────────────────────────────────────────────── */
.llms-tabs {
  display: flex;
  padding: 1rem 1.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
  background: var(--va-background-primary);
  flex-shrink: 0;
}
.llms-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 18px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--va-secondary);
  transition: all 0.15s;
  margin-bottom: -1px;
}
.llms-tab:hover {
  color: var(--va-text-primary);
}
.llms-tab.active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
  font-weight: 600;
}

/* ── Tools tab ─────────────────────────────────────────── */
.llms-tools-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.llms-tool-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.llms-group-hd {
  display: flex;
  align-items: center;
  gap: 8px;
}
.llms-group-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.llms-group-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--va-text-primary);
}
.llms-group-count {
  font-size: 0.7rem;
  color: var(--va-secondary);
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  padding: 1px 7px;
  border-radius: 10px;
}
.llms-tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}
.llms-tool-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  background: var(--va-background-primary);
  text-decoration: none;
  transition: all 0.15s;
  position: relative;
}
.llms-tool-card:hover {
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 4px 16px rgba(96, 165, 250, 0.08);
  transform: translateY(-1px);
}
.llms-tool-top {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}
.llms-tool-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--va-text-primary);
}
.llms-tool-badge {
  font-size: 0.65rem;
  padding: 1px 7px;
  border-radius: 8px;
  border: 1px solid;
  font-weight: 600;
}
.llms-tool-desc {
  font-size: 0.78rem;
  color: var(--va-secondary);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}
.llms-tool-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}
.llms-tool-link {
  font-size: 0.72rem;
  color: #60a5fa;
  opacity: 0.8;
}
.llms-tool-footer.va-icon {
  color: var(--va-secondary);
  opacity: 0.5;
}

/* ── Templates tab ─────────────────────────────────────── */
.llms-tpl-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.llms-tpl-intro {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.83rem;
  color: var(--va-secondary);
  margin: 0;
  line-height: 1.6;
  padding: 10px 14px;
  background: rgba(96, 165, 250, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 10px;
}
.llms-tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.llms-tpl-card {
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  background: var(--va-background-primary);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.18s;
}
.llms-tpl-card:hover {
  border-color: color-mix(in srgb, var(--tc) 40%, transparent);
  box-shadow: 0 4px 18px color-mix(in srgb, var(--tc) 10%, transparent);
}
.llms-tpl-hd {
  display: flex;
  align-items: center;
  gap: 10px;
}
.llms-tpl-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.llms-tpl-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0 0 2px;
}
.llms-tpl-desc {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin: 0;
}
.llms-tpl-preview {
  font-size: 0.72rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: var(--va-background-secondary);
  border-radius: 8px;
  padding: 10px;
  color: var(--va-secondary);
  line-height: 1.55;
  max-height: 140px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  overflow: hidden;
}
.llms-tpl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  opacity: 0.92;
}
.llms-tpl-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}

/* Template tip */
.llms-tpl-tip {
  display: flex;
  gap: 10px;
  padding: 16px 18px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  font-size: 0.82rem;
  color: var(--va-secondary);
  line-height: 1.6;
}
.llms-tpl-tip strong {
  color: var(--va-text-primary);
  display: block;
  margin-bottom: 6px;
}
.llms-tpl-tip ol {
  margin: 0;
  padding-left: 1.2rem;
}
.llms-tpl-tip li {
  margin-bottom: 3px;
}
.llms-tpl-tip code {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* ── Guide tab ─────────────────────────────────────────── */
.llms-guide-body {
  padding: 1.5rem;
}
.llms-guide-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.llms-gc {
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  background: var(--va-background-primary);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.llms-gc--wide {
  grid-column: 1 / -1;
}
.llms-gc-hd {
  display: flex;
  align-items: center;
  gap: 8px;
}
.llms-gc-hd h3 {
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}
.llms-gc p {
  font-size: 0.82rem;
  color: var(--va-secondary);
  line-height: 1.65;
  margin: 0;
}
.llms-gc p strong {
  color: var(--va-text-primary);
}
.llms-gc code {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}
.llms-code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.78rem;
  background: var(--va-background-secondary);
  border-radius: 8px;
  padding: 12px;
  color: #60a5fa;
  line-height: 1.65;
  white-space: pre-wrap;
  margin: 0;
  overflow-x: auto;
}
.llms-note {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin: 0;
  font-style: italic;
}
.llms-best {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.llms-best li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.8rem;
  color: var(--va-secondary);
  line-height: 1.5;
}
.llms-best li strong {
  color: var(--va-text-primary);
}
.llms-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.llms-steps li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--va-secondary);
  line-height: 1.5;
}
.llms-steps li code {
  background: var(--va-background-secondary);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.8em;
}
.llms-step-n {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 50%;
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Compare table */
.llms-cmp-table {
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  overflow: hidden;
}
.llms-cmp-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
}
.llms-cmp-row > span {
  padding: 8px 12px;
  font-size: 0.78rem;
  color: var(--va-secondary);
  border-right: 1px solid var(--va-background-border);
  border-bottom: 1px solid var(--va-background-border);
}
.llms-cmp-row > span:last-child {
  border-right: none;
}
.llms-cmp-row:last-child > span {
  border-bottom: none;
}
.llms-cmp-hd > span {
  font-weight: 700;
  color: var(--va-text-primary);
  background: var(--va-background-secondary);
  font-size: 0.75rem;
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 900px) {
  .llms-guide-grid {
    grid-template-columns: 1fr;
  }
  .llms-gc--wide {
    grid-column: auto;
  }
}
@media (max-width: 640px) {
  .llms-hero-title {
    font-size: 1.8rem;
  }
  .llms-tpl-grid {
    grid-template-columns: 1fr;
  }
  .llms-tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
