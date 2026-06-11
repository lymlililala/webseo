<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { localePath } from '../i18n/useLocale'

interface NavItem {
  id: string | number
  slug?: string
  title: string
  [key: string]: any
}

const props = defineProps<{
  type: 'articles' | 'news' | 'tutorials'
  prev?: NavItem | null
  next?: NavItem | null
}>()

const { t } = useI18n()

function linkTo(item: NavItem) {
  return localePath('/' + props.type + '/' + (item.slug || String(item.id)))
}
</script>

<template>
  <nav v-if="prev || next" class="prev-next-nav" :aria-label="t('detail.related')">
    <RouterLink v-if="prev" :to="linkTo(prev)" class="pn-link pn-prev">
      <VaIcon name="arrow_back" size="16px" />
      <span class="pn-text">
        <span class="pn-label">{{ t('detail.prev') }}</span>
        <span class="pn-title">{{ prev.title }}</span>
      </span>
    </RouterLink>
    <span v-else class="pn-placeholder" />

    <RouterLink v-if="next" :to="linkTo(next)" class="pn-link pn-next">
      <span class="pn-text">
        <span class="pn-label">{{ t('detail.next') }}</span>
        <span class="pn-title">{{ next.title }}</span>
      </span>
      <VaIcon name="arrow_forward" size="16px" />
    </RouterLink>
    <span v-else class="pn-placeholder" />
  </nav>
</template>

<style scoped>
.prev-next-nav {
  display: flex;
  gap: 14px;
  margin-top: 1.8rem;
}

.pn-link {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--va-text-primary);
  transition: all 0.2s ease;
  min-width: 0;
}

.pn-link:hover {
  border-color: var(--va-primary);
  transform: translateY(-2px);
}

.pn-next {
  justify-content: flex-end;
  text-align: right;
}

.pn-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pn-label {
  font-size: 11px;
  color: var(--va-text-secondary);
  opacity: 0.7;
}

.pn-title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pn-placeholder {
  flex: 1;
}

@media (max-width: 600px) {
  .prev-next-nav {
    flex-direction: column;
  }
}
</style>
