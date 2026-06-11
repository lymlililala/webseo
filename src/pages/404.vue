<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VuesticLogo from '../components/VuesticLogo.vue'
import NotFoundImage from '../components/NotFoundImage.vue'
import { localePath } from '../i18n/useLocale'

const { t } = useI18n()

// 404 页：noindex，不设 canonical，防止软 404 被收录
onMounted(() => {
  document.title = t('notFound.title') + ' — SGAIndex'

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
})
</script>

<template>
  <div class="flex flex-col justify-between h-screen items-center bg-[var(--va-background-secondary)]">
    <RouterLink :to="localePath('/')">
      <VuesticLogo :gradient="false" class="my-8 h-5" />
    </RouterLink>

    <div class="flex flex-col items-center gap-6 px-4 my-8">
      <NotFoundImage />
      <h1 class="va-h1 text-center sm:text-5xl text-4xl">{{ t('notFound.title') }}</h1>

      <p class="text-center">{{ t('notFound.text') }}</p>

      <div class="flex flex-col sm:flex-row gap-4">
        <VaButton :to="localePath('/seo-nav')">{{ t('notFound.back') }}</VaButton>
      </div>
    </div>

    <div />
  </div>
</template>
