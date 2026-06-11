<script setup lang="ts">
import { localePath } from '../i18n/useLocale'

interface RelatedItem {
  id: string | number
  slug?: string
  title: string
  description?: string
  category?: string
  date?: string
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    items: RelatedItem[]
    type: 'articles' | 'news' | 'tutorials'
    title?: string
  }>(),
  { title: 'Related content' },
)

const categoryColor: Record<string, string> = {
  seo: '#3B82F6',
  geo: '#10B981',
  aeo: '#EC4899',
  ai: '#8B5CF6',
  tools: '#F59E0B',
  industry: '#F59E0B',
}

function linkTo(item: RelatedItem) {
  return localePath('/' + props.type + '/' + (item.slug || String(item.id)))
}
</script>

<template>
  <section v-if="items.length" class="related-content">
    <h2 class="related-title">
      <VaIcon name="auto_stories" size="18px" />
      {{ title }}
    </h2>
    <div class="related-grid">
      <RouterLink v-for="item in items" :key="item.id" :to="linkTo(item)" class="related-card">
        <span
          v-if="item.category"
          class="related-cat"
          :style="{ color: categoryColor[item.category] || 'var(--va-primary)' }"
        >
          {{ (item.category || '').toUpperCase() }}
        </span>
        <h3 class="related-card-title">{{ item.title }}</h3>
        <p v-if="item.description" class="related-card-desc">{{ item.description }}</p>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.related-content {
  margin-top: 2.4rem;
  padding-top: 1.8rem;
  border-top: 1px solid var(--va-background-border);
}

.related-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0 0 1.2rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.related-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.related-card:hover {
  border-color: var(--va-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.related-cat {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.related-card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-card-desc {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
