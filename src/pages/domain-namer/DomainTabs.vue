<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localePath, stripLocale } from '../../i18n/useLocale'

const { t } = useI18n()
const route = useRoute()

const tabs = [
  { to: '/domain-namer', label: 'menu.domain-namer-naming' },
  { to: '/domain-namer/autofill', label: 'menu.domain-namer-autofill' },
  { to: '/domain-namer/rank', label: 'menu.domain-namer-rank' },
]

// 去掉语言前缀后比较,避免 /zh 前缀干扰高亮
const current = computed(() => stripLocale(route.path).path.replace(/\/$/, '') || '/')
</script>

<template>
  <nav class="dn-tabs">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="localePath(tab.to)"
      class="dn-tab"
      :class="{ active: current === tab.to }"
    >
      {{ t(tab.label) }}
    </RouterLink>
  </nav>
</template>
