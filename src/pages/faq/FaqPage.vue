<template>
  <h1 class="page-title">常见问题 — SEO/GEO/AEO FAQ</h1>
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
  title: 'FAQ — SEO/GEO/AEO 常见问题解答',
  description: '解答SEO、GEO生成式引擎优化、AEO答案引擎优化的常见问题，帮助你快速了解AI搜索时代的网站优化策略。',
  path: '/faq',
  keywords: 'SEO常见问题,GEO优化FAQ,AEO问答,AI搜索优化,SGAIndex帮助',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'SEO/GEO/AEO 常见问题',
      url: 'https://sgaindex.com/faq',
      description: '解答SEO、GEO、AEO领域的常见问题',
    },
  ],
})
</script>
