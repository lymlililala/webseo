<script setup lang="ts">
import { watchEffect, onUnmounted } from 'vue'

interface Crumb {
  name: string
  /** 路由路径，例如 /articles；末项(当前页)不传则不可点 */
  to?: string
}

const props = defineProps<{ items: Crumb[] }>()

const SITE = 'https://sgaindex.com'

// 注入 BreadcrumbList JSON-LD（带 data-breadcrumb 便于清理，避免与 usePageSeo 的 data-seo 冲突）
function injectJsonLd() {
  document.querySelectorAll('script[data-breadcrumb="true"]').forEach((el) => el.remove())
  const itemListElement = props.items.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    ...(c.to ? { item: `${SITE}${c.to}` } : {}),
  }))
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-breadcrumb', 'true')
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  })
  document.head.appendChild(script)
}

watchEffect(() => {
  if (props.items.length) injectJsonLd()
})

onUnmounted(() => {
  document.querySelectorAll('script[data-breadcrumb="true"]').forEach((el) => el.remove())
})
</script>

<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <template v-for="(crumb, i) in items" :key="i">
      <RouterLink v-if="crumb.to" :to="crumb.to" class="crumb-link">{{ crumb.name }}</RouterLink>
      <span v-else class="crumb-current">{{ crumb.name }}</span>
      <VaIcon v-if="i < items.length - 1" name="chevron_right" size="14px" class="crumb-sep" />
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 13px;
  color: var(--va-text-secondary);
}

.crumb-link {
  color: var(--va-text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}

.crumb-link:hover {
  color: var(--va-primary);
}

.crumb-current {
  color: var(--va-text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
}

.crumb-sep {
  color: var(--va-text-secondary);
  opacity: 0.5;
}
</style>
