<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="home-hero">
      <span class="home-kicker">{{ isZh ? 'SGAIndex 全功能平台' : 'The SGAIndex Platform' }}</span>
      <h1 class="home-title">{{ isZh ? '一站搞定 SEO、GEO 与 AEO' : 'SEO, GEO & AEO — all in one place' }}</h1>
      <p class="home-subtitle">
        {{
          isZh
            ? '面向 AI 搜索时代的工具导航与优化平台。下面是各功能模块的作用，点击进入即可使用。'
            : 'A tools directory and optimization platform for the AI search era. Here’s what each module does — click any to dive in.'
        }}
      </p>
    </section>

    <!-- 模块卡片 -->
    <section class="home-modules">
      <RouterLink v-for="m in modules" :key="m.to" :to="localePath(m.to)" class="module-card">
        <div class="module-icon" :style="{ background: m.color + '18', color: m.color }">
          <VaIcon :name="m.icon" size="24px" />
        </div>
        <div class="module-body">
          <h2 class="module-name">{{ isZh ? m.titleZh : m.titleEn }}</h2>
          <p class="module-desc">{{ isZh ? m.descZh : m.descEn }}</p>
        </div>
        <VaIcon name="arrow_forward" size="18px" class="module-arrow" />
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localePath } from '../../i18n/useLocale'
import { usePageSeo } from '../../composables/usePageSeo'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

const modules = [
  {
    to: '/seo-nav',
    icon: 'travel_explore',
    color: '#6366F1',
    titleEn: 'SEO Tools Navigator',
    titleZh: 'SEO 工具导航',
    descEn: '100+ curated SEO tools across keyword research, backlinks, technical SEO and rank tracking.',
    descZh: '精选 100+ 款 SEO 工具，覆盖关键词研究、外链、技术 SEO 与排名追踪。',
  },
  {
    to: '/geo-nav',
    icon: 'auto_awesome',
    color: '#8B5CF6',
    titleEn: 'GEO Navigator',
    titleZh: 'GEO 生成式优化',
    descEn: 'Tools to get your content cited by AI engines like ChatGPT, Perplexity and Google AI Overviews.',
    descZh: '让内容被 ChatGPT、Perplexity、Google AI 概览等 AI 引擎引用的工具集。',
  },
  {
    to: '/aeo-nav',
    icon: 'question_answer',
    color: '#EC4899',
    titleEn: 'AEO Navigator',
    titleZh: 'AEO 答案引擎优化',
    descEn: 'Tools to land in featured snippets, AI direct answers and voice search results.',
    descZh: '帮你出现在精选摘要、AI 直接回答与语音搜索结果里的工具。',
  },
  {
    to: '/llms-txt',
    icon: 'description',
    color: '#0EA5E9',
    titleEn: 'llms.txt Generator',
    titleZh: 'llms.txt 生成器',
    descEn: 'Build an AI-readable site index file to boost how often AI engines cite your pages.',
    descZh: '生成 AI 可读的站点索引文件，提升页面被 AI 引擎引用的概率。',
  },
  {
    to: '/ai-checker',
    icon: 'health_and_safety',
    color: '#10B981',
    titleEn: 'AI Visibility Checker',
    titleZh: 'AI 可见度体检',
    descEn: 'Check how your content is cited and how visible it is across ChatGPT, Claude, Gemini and more.',
    descZh: '检测你的内容在 ChatGPT、Claude、Gemini 等模型中的被引用情况与可见度。',
  },
  {
    to: '/glossary',
    icon: 'menu_book',
    color: '#F59E0B',
    titleEn: 'AI SEO Glossary',
    titleZh: 'AI SEO 词汇表',
    descEn: '200+ SEO, GEO and AEO terms explained — the vocabulary of AI-era search.',
    descZh: '详解 200+ 条 SEO、GEO、AEO 术语——读懂 AI 搜索时代的专业词汇。',
  },
  {
    to: '/schema-generator',
    icon: 'data_object',
    color: '#3B82F6',
    titleEn: 'Schema Generator',
    titleZh: 'Schema 标记工具',
    descEn: 'Generate and validate JSON-LD structured data — Article, FAQ, Product, HowTo and 20+ types.',
    descZh: '生成并校验 JSON-LD 结构化数据——Article、FAQ、Product、HowTo 等 20+ 类型。',
  },
  {
    to: '/articles',
    icon: 'article',
    color: '#EF4444',
    titleEn: 'Articles',
    titleZh: '文章',
    descEn: 'In-depth SEO, GEO and AEO articles sharing real-world optimization experience.',
    descZh: 'SEO、GEO、AEO 深度文章，分享一线实战优化经验与行业洞察。',
  },
  {
    to: '/tutorials',
    icon: 'school',
    color: '#14B8A6',
    titleEn: 'Tutorials',
    titleZh: '教程',
    descEn: 'Step-by-step optimization courses from beginner to advanced.',
    descZh: '从入门到进阶的实操优化教程，手把手带你做。',
  },
  {
    to: '/news',
    icon: 'newspaper',
    color: '#F97316',
    titleEn: 'News',
    titleZh: '新闻',
    descEn: 'Track Google algorithm updates and the latest AI search developments.',
    descZh: '追踪 Google 算法更新与 AI 搜索行业的最新动态。',
  },
  {
    to: '/backlinks',
    icon: 'link',
    color: '#2563EB',
    titleEn: 'Backlink Service',
    titleZh: '外链发布',
    descEn: 'White-hat guest posts and niche edits on real high-authority sites — email us for a quote.',
    descZh: '在真实高权重网站做白帽软文与 niche edit 外链——邮件咨询报价。',
  },
]

usePageSeo(
  computed(() => ({
    title: isZh.value
      ? 'SGAIndex — SEO/GEO/AEO 全功能平台 | AI 搜索优化'
      : 'SGAIndex — SEO/GEO/AEO Platform | AI Search Optimization',
    description: isZh.value
      ? 'SGAIndex 是面向 AI 搜索时代的一站式平台:SEO/GEO/AEO 工具导航、llms.txt 生成、AI 可见度体检、Schema 标记、术语库、文章教程资讯与外链发布服务。'
      : 'SGAIndex is an all-in-one platform for the AI search era: SEO/GEO/AEO tool directories, llms.txt generation, AI visibility checks, Schema markup, a glossary, articles, tutorials, news and a backlink service.',
    path: '/',
    keywords: isZh.value
      ? 'SEO,GEO,AEO,AI 搜索优化,llms.txt,Schema,AI 可见度,外链发布'
      : 'SEO,GEO,AEO,AI search optimization,llms.txt,Schema,AI visibility,backlink service',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SGAIndex',
        url: 'https://sgaindex.com',
        description: isZh.value
          ? '面向 AI 搜索时代的 SEO/GEO/AEO 工具导航与优化平台'
          : 'A tools directory and optimization platform for the AI search era — SEO, GEO and AEO',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sgaindex.com/seo-nav?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  })),
)
</script>

<style scoped lang="scss">
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 0.5rem 3rem;
  color: var(--va-text-primary, #1f2937);
}

.home-hero {
  text-align: center;
  padding: 2rem 1rem 1.5rem;
}

.home-kicker {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--va-primary, #2563eb);
  font-weight: 700;
  margin-bottom: 0.8rem;
}

.home-title {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 auto;
  max-width: 720px;
}

.home-subtitle {
  margin: 1rem auto 0;
  max-width: 640px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--va-secondary, #6b7280);
}

.home-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.module-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: var(--va-background-secondary, #fff);
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: rgba(37, 99, 235, 0.3);

    .module-arrow {
      transform: translateX(3px);
      opacity: 1;
    }
  }
}

.module-icon {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.module-body {
  flex: 1;
  min-width: 0;
}

.module-name {
  font-size: 1.08rem;
  font-weight: 700;
  margin: 0 0 0.3rem;
}

.module-desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--va-secondary, #6b7280);
}

.module-arrow {
  flex-shrink: 0;
  align-self: center;
  color: var(--va-primary, #2563eb);
  opacity: 0.5;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

@media (max-width: 640px) {
  .home-title {
    font-size: 1.7rem;
  }
}
</style>
