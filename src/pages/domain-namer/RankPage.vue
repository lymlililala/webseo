<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '../../composables/usePageSeo'
import { useDomainNamer } from './useDomainNamer'
import DomainTabs from './DomainTabs.vue'
import ResultPanel from './ResultPanel.vue'
import './domain-namer.css'

const { t } = useI18n()
const ctx = useDomainNamer()

usePageSeo({
  title: t('domainNamerRankPage.seoTitle'),
  description: t('domainNamerRankPage.seoDescription'),
  path: '/domain-namer/rank',
  keywords: t('domainNamerRankPage.seoKeywords'),
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SGAIndex Domain Candidate Ranker',
      description: 'Check domain availability and brand collisions for your own candidate names, then rank them',
      url: 'https://sgaindex.com/domain-namer/rank',
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
          <VaIcon name="leaderboard" size="14px" />
          <span>{{ t('domainNamerPage.badge') }}</span>
        </div>
        <h1 class="dn-hero-title">
          {{ t('domainNamerRankPage.heroMain') }}<br />
          <span class="dn-hero-accent">{{ t('domainNamerRankPage.heroAccent') }}</span>
        </h1>
        <p class="dn-hero-subtitle">{{ t('domainNamerRankPage.heroSubtitle') }}</p>
      </div>
    </div>

    <div class="dn-body">
      <DomainTabs />

      <div class="dn-card">
        <label class="dn-label">{{ t('domainNamerPage.myNamesLabel') }}</label>
        <textarea
          v-model="ctx.myNames"
          class="dn-textarea"
          :placeholder="t('domainNamerPage.myNamesPlaceholder')"
          rows="4"
        />

        <VaButton class="dn-go" :loading="ctx.running" :disabled="ctx.running" @click="ctx.startRank()">
          {{ t('domainNamerPage.rankBtn') }}
        </VaButton>

        <div v-if="ctx.statusMsg" class="dn-status" :class="ctx.statusCls">{{ ctx.statusMsg }}</div>
      </div>

      <ResultPanel :ctx="ctx" />
    </div>
  </div>
</template>
