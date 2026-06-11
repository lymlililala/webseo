<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * ToolFavicon — 显示工具网站的真实 favicon,加载失败时回退到分类图标。
 * 用于工具目录卡片,提升品牌可识别度。
 */
const props = withDefaults(
  defineProps<{
    url: string
    /** 回退用的 Material 图标名 */
    fallbackIcon?: string
    /** 回退图标颜色 */
    fallbackColor?: string
    /** 像素尺寸(图标显示尺寸) */
    size?: number
  }>(),
  { fallbackIcon: 'link', fallbackColor: 'currentColor', size: 22 },
)

const failed = ref(false)

const domain = computed(() => {
  try {
    return new URL(props.url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
})

// 请求 2x 尺寸保证清晰
const faviconUrl = computed(() =>
  domain.value ? `https://www.google.com/s2/favicons?domain=${domain.value}&sz=${props.size * 2}` : '',
)

const showFallback = computed(() => failed.value || !faviconUrl.value)
</script>

<template>
  <VaIcon v-if="showFallback" :name="fallbackIcon" :color="fallbackColor" :size="`${size}px`" />
  <img
    v-else
    :src="faviconUrl"
    :width="size"
    :height="size"
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
    class="tool-favicon"
    @error="failed = true"
  />
</template>

<style scoped>
.tool-favicon {
  display: block;
  border-radius: 4px;
  object-fit: contain;
}
</style>
