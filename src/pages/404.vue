<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import VuesticLogo from '../components/VuesticLogo.vue'
import NotFoundImage from '../components/NotFoundImage.vue'

// 404 页：noindex，不设 canonical，防止软 404 被收录
onMounted(() => {
  document.title = '页面未找到 — SGAIndex'

  // noindex
  let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.name = 'robots'
    robotsMeta.setAttribute('data-seo-404', 'true')
    document.head.appendChild(robotsMeta)
  }
  robotsMeta.content = 'noindex, follow'

  // 移除任何 canonical
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.removeAttribute('href')
})

onUnmounted(() => {
  document.querySelectorAll('[data-seo-404="true"]').forEach((el) => el.remove())
  document.title = 'SGAIndex — SEO/GEO/AEO 工具导航'
})
</script>

<template>
  <div class="flex flex-col justify-between h-screen items-center bg-[var(--va-background-secondary)]">
    <RouterLink to="/">
      <VuesticLogo :gradient="false" class="my-8 h-5" />
    </RouterLink>

    <div class="flex flex-col items-center gap-6 px-4 my-8">
      <NotFoundImage />
      <h1 class="va-h1 text-center sm:text-5xl text-4xl">页面未找到</h1>

      <p class="text-center">您访问的页面不存在或已被移除，请返回首页继续探索 SEO/GEO/AEO 工具。</p>

      <div class="flex flex-col sm:flex-row gap-4">
        <VaButton to="/seo-nav">返回首页</VaButton>
      </div>
    </div>

    <div />
  </div>
</template>
