<template>
  <div class="legal-page">
    <nav class="legal-breadcrumb" aria-label="Breadcrumb">
      <RouterLink :to="localePath('/')">{{ t('footer.home') }}</RouterLink>
      <span aria-hidden="true">/</span>
      <span>{{ title }}</span>
    </nav>

    <article class="legal-doc">
      <header class="legal-head">
        <h1 class="legal-title">{{ title }}</h1>
        <p v-if="updated" class="legal-updated">{{ t('footer.lastUpdated') }}: {{ updated }}</p>
      </header>

      <!-- 正文(作者撰写的静态 HTML) -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="legal-body" v-html="body" />

      <slot />
    </article>

    <!-- 同组页面互链(对用户与爬虫均可见) -->
    <nav class="legal-related" aria-label="Legal pages">
      <RouterLink v-for="l in links" :key="l.path" :to="localePath(l.path)" :class="{ active: l.path === current }">
        {{ t(l.label) }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localePath } from '../../i18n/useLocale'

defineProps<{
  title: string
  body: string
  updated?: string
  /** 当前页路径,用于高亮互链 */
  current?: string
}>()

const { t } = useI18n()

const links = [
  { path: '/about', label: 'footer.about' },
  { path: '/contact', label: 'footer.contact' },
  { path: '/privacy', label: 'footer.privacy' },
  { path: '/terms', label: 'footer.terms' },
  { path: '/faq', label: 'menu.faq' },
]
</script>

<style scoped lang="scss">
.legal-page {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 0.5rem 3rem;
}

.legal-breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: var(--va-secondary, #6b7280);
  margin-bottom: 1.25rem;

  a {
    color: var(--va-primary, #2563eb);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.legal-head {
  margin-bottom: 1.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 1rem;
}

.legal-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.legal-updated {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: var(--va-secondary, #6b7280);
}

.legal-body {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--va-text-primary, #1f2937);

  :deep(h2) {
    font-size: 1.35rem;
    font-weight: 700;
    margin: 2rem 0 0.75rem;
  }

  :deep(h3) {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
  }

  :deep(p) {
    margin: 0 0 1rem;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 1rem;
    padding-left: 1.4rem;
  }

  :deep(li) {
    margin-bottom: 0.4rem;
  }

  :deep(a) {
    color: var(--va-primary, #2563eb);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(strong) {
    font-weight: 600;
  }
}

.legal-related {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  a {
    font-size: 0.9rem;
    color: var(--va-primary, #2563eb);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &.active {
      color: var(--va-secondary, #6b7280);
      font-weight: 600;
      pointer-events: none;
    }
  }
}
</style>
