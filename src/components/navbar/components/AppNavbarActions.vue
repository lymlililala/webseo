<template>
  <div class="app-navbar-actions">
    <button class="lang-switch" type="button" :aria-label="'Switch language'" @click="toggle">
      <VaIcon name="language" size="18px" />
      <span class="lang-label">{{ current === 'zh' ? 'EN' : '中文' }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentLocale, setLocale, stripLocale, localePath, type AppLocale } from '../../../i18n/useLocale'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const route = useRoute()
const router = useRouter()

const current = computed<AppLocale>(() => currentLocale())

// 切换语言:保持当前页面路径,只切换 /zh 前缀,并持久化
function toggle() {
  const target: AppLocale = current.value === 'zh' ? 'en' : 'zh'
  const { path } = stripLocale(route.fullPath)
  setLocale(target)
  router.push(localePath(path, target))
}
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;
}

.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 18px;
  border: 1px solid var(--va-background-border);
  background: transparent;
  color: var(--va-text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.lang-switch:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}

.lang-label {
  line-height: 1;
}
</style>
