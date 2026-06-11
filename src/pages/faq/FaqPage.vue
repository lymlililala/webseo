<template>
  <h1 class="page-title">FAQ — SEO/GEO/AEO</h1>
  <Categories />
  <RequestDemo />
  <Questions />
  <Navigation />
</template>

<script setup lang="ts">
import Categories from './widgets/Categories.vue'
import Questions from './widgets/Questions.vue'
import RequestDemo from './widgets/RequestDemo.vue'
import Navigation from './widgets/Navigation.vue'
import { usePageSeo } from '../../composables/usePageSeo'

usePageSeo({
  title: 'FAQ — SEO/GEO/AEO Frequently Asked Questions',
  description:
    'Answers to common questions about SEO, GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) to help you optimize for the AI search era.',
  path: '/faq',
  keywords: 'SEO FAQ,GEO optimization FAQ,AEO Q&A,AI search optimization,SGAIndex help',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'SEO/GEO/AEO FAQ',
      url: 'https://sgaindex.com/faq',
      description: 'Answers to common questions about SEO, GEO and AEO',
    },
  ],
})
</script>
