<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '../../composables/usePageSeo'
import { useDomainNamer } from './useDomainNamer'
import DomainTabs from './DomainTabs.vue'
import TldField from './TldField.vue'
import ResultPanel from './ResultPanel.vue'
import './domain-namer.css'

const { t } = useI18n()
const ctx = useDomainNamer()

usePageSeo({
  title: t('domainNamerAutofillPage.seoTitle'),
  description: t('domainNamerAutofillPage.seoDescription'),
  path: '/domain-namer/autofill',
  keywords: t('domainNamerAutofillPage.seoKeywords'),
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SGAIndex AI Domain Namer — Auto-fill',
      description: 'Auto-generate multiple registrable, collision-free domain names until a target count is reached',
      url: 'https://sgaindex.com/domain-namer/autofill',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
})
</script>

<template>
  <div class="dn-page">
    <div class="dn-hero">
      <div class="dn-hero-bg" />
      <div class="dn-hero-content">
        <div class="dn-hero-badge">
          <VaIcon name="auto_mode" size="14px" />
          <span>{{ t('domainNamerPage.badge') }}</span>
        </div>
        <h1 class="dn-hero-title">
          {{ t('domainNamerPage.heroTitleMain') }}<br />
          <span class="dn-hero-accent">{{ t('domainNamerAutofillPage.heroAccent') }}</span>
        </h1>
        <p class="dn-hero-subtitle">{{ t('domainNamerAutofillPage.heroSubtitle') }}</p>
      </div>
    </div>

    <div class="dn-body">
      <DomainTabs />

      <div class="dn-card">
        <label class="dn-label">{{ t('domainNamerPage.needLabel') }}</label>
        <textarea
          v-model="ctx.need"
          class="dn-textarea"
          :placeholder="t('domainNamerPage.needPlaceholder')"
          rows="3"
        />

        <TldField :ctx="ctx" />

        <label class="dn-label">{{ t('domainNamerPage.autofillTargetLabel') }}</label>
        <input v-model.number="ctx.autofillN" class="dn-input dn-num" type="number" min="1" :max="ctx.limits.autofillMax" />
        <div class="dn-hint">{{ t('domainNamerPage.autofillHint') }}</div>

        <VaButton class="dn-go" :loading="ctx.running" :disabled="ctx.running" @click="ctx.startAutofill()">
          {{ t('domainNamerAutofillPage.runBtn') }}
        </VaButton>

        <div v-if="ctx.statusMsg" class="dn-status" :class="ctx.statusCls">{{ ctx.statusMsg }}</div>
      </div>

      <ResultPanel :ctx="ctx" />
    </div>
  </div>
</template>
