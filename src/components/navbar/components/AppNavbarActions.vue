<template>
  <div class="app-navbar-actions">
    <!-- Theme toggle (light / dark) -->
    <button class="nav-icon-btn" type="button" :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleTheme">
      <VaIcon :name="isDark ? 'light_mode' : 'dark_mode'" size="18px" />
    </button>

    <!-- Language toggle (EN / 中文) -->
    <button class="lang-switch" type="button" :aria-label="'Switch language'" @click="toggleLocale">
      <VaIcon name="language" size="18px" />
      <span class="lang-label">{{ current === 'zh' ? 'EN' : '中文' }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColors } from 'vuestic-ui'
import { currentLocale, setLocale, stripLocale, localePath, type AppLocale } from '../../../i18n/useLocale'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const route = useRoute()
const router = useRouter()

// ── Language ──────────────────────────────────────────────
const current = computed<AppLocale>(() => currentLocale())

function toggleLocale() {
  const target: AppLocale = current.value === 'zh' ? 'en' : 'zh'
  const { path } = stripLocale(route.fullPath)
  setLocale(target)
  router.push(localePath(path, target))
}

// ── Theme (light / dark) ──────────────────────────────────
const THEME_KEY = 'sgaindex_theme'
const { applyPreset, currentPresetName } = useColors()

const isDark = computed(() => currentPresetName.value === 'dark')

function toggleTheme() {
  const next = isDark.value ? 'light' : 'dark'
  applyPreset(next)
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch (_) {
    /* ignore */
  }
}

onMounted(() => {
  // 恢复用户上次选择的主题(navbar 全局常驻,适合做主题持久化入口)
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') applyPreset(saved)
  } catch (_) {
    /* ignore */
  }
})
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--va-background-border);
  background: transparent;
  color: var(--va-text-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.nav-icon-btn:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}

.nav-icon-btn:focus-visible,
.lang-switch:focus-visible {
  outline: 2px solid var(--va-primary);
  outline-offset: 2px;
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
