<template>
  <div class="sga-logo" :style="{ height: height + 'px' }">
    <svg :height="height" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="sga-logo__icon">
      <!-- S 形状图标 -->
      <rect width="28" height="28" rx="7" :fill="colorsComputed.start" />
      <path
        d="M8 10.5C8 9.12 9.12 8 10.5 8H17.5C18.33 8 19 8.67 19 9.5C19 10.33 18.33 11 17.5 11H11C10.45 11 10 11.45 10 12C10 12.55 10.45 13 11 13H17C18.66 13 20 14.34 20 16V17.5C20 18.88 18.88 20 17.5 20H10.5C9.67 20 9 19.33 9 18.5C9 17.67 9.67 17 10.5 17H17C17.55 17 18 16.55 18 16C18 15.45 17.55 15 17 15H11C9.34 15 8 13.66 8 12V10.5Z"
        fill="white"
      />
    </svg>
    <span class="sga-logo__text" :style="{ color: colorsComputed.start }">
      sga<span class="sga-logo__text--dim">index</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useColors } from 'vuestic-ui'

const { getColor } = useColors()

const props = withDefaults(
  defineProps<{
    height?: number
    start?: string
    end?: string
  }>(),
  {
    height: 28,
    start: 'primary',
    end: undefined,
  },
)

const colorsComputed = computed(() => {
  return {
    start: getColor(props.start),
    end: getColor(props.end || props.start),
  }
})
</script>

<style scoped>
.sga-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  user-select: none;
}

.sga-logo__icon {
  flex-shrink: 0;
}

.sga-logo__text {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1;
  white-space: nowrap;
}

.sga-logo__text--dim {
  font-weight: 400;
  opacity: 0.55;
}
</style>
