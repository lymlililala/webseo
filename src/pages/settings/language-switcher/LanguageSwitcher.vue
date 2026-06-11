<template>
  <div class="flex items-center justify-between">
    <p>Language</p>
    <div class="w-40">
      <VaSelect v-model="model" :options="options" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { currentLocale, setLocale, type AppLocale } from '../../../i18n/useLocale'

const labels: Record<AppLocale, string> = {
  en: 'English',
  zh: '简体中文',
}
const byLabel: Record<string, AppLocale> = { English: 'en', 简体中文: 'zh' }

const options = Object.values(labels)

const model = computed({
  get() {
    return labels[currentLocale()]
  },
  set(value: string) {
    const loc = byLabel[value]
    if (loc) setLocale(loc)
  },
})
</script>
