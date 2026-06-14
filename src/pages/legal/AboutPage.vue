<template>
  <LegalShell :title="title" :body="body" :updated="updated" current="/about" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LegalShell from './LegalShell.vue'
import { usePageSeo } from '../../composables/usePageSeo'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

const CONTACT = 'contact@sgaindex.com'
const updated = '2026-06-14'

const title = computed(() => (isZh.value ? '关于我们' : 'About Us'))

const body = computed(() =>
  isZh.value
    ? `
<p><strong>SGAIndex</strong> 是一个面向 AI 搜索时代的工具导航与知识平台。我们精选并整理 SEO、GEO(生成式引擎优化)、AEO(答案引擎优化)以及 Schema 结构化数据工具,帮助网站在 Google 与 ChatGPT、Perplexity、Gemini 等 AI 引擎中获得更好的可见度。</p>

<h2>我们做什么</h2>
<ul>
  <li><strong>工具导航</strong> — 持续维护 200+ 款 SEO/GEO/AEO 工具,按用途分类、附带客观说明,方便快速选型。</li>
  <li><strong>免费在线工具</strong> — 提供 Schema 结构化数据生成器、llms.txt 生成器、AI 可见度检测等实用工具。</li>
  <li><strong>深度内容</strong> — 持续产出文章、教程、术语库与行业资讯,覆盖从入门到进阶的实战优化经验。</li>
</ul>

<h2>我们的理念</h2>
<p>搜索正在从"十个蓝色链接"走向 AI 直接回答。我们相信,优质内容 + 清晰的结构化数据 + 对 AI 爬虫友好的站点架构,是新时代获得自然流量的基础。SGAIndex 的目标是把这套方法论中分散的工具与知识聚合到一处,让每一位站长、内容创作者和营销人员都能低门槛地上手。</p>

<h2>编辑与收录原则</h2>
<p>我们的工具收录与文章基于公开资料、实测体验与行业共识整理,力求客观中立。部分外链可能为合作或联盟链接,但收录与排序不受其影响。如发现信息有误,欢迎通过 <a href="mailto:${CONTACT}">${CONTACT}</a> 指正。</p>

<h2>联系我们</h2>
<p>合作、纠错或建议,请发送邮件至 <a href="mailto:${CONTACT}">${CONTACT}</a>,或访问 <a href="/zh/contact">联系我们</a> 页面。</p>
`
    : `
<p><strong>SGAIndex</strong> is a tools directory and knowledge hub built for the AI search era. We curate and organize SEO, GEO (Generative Engine Optimization), AEO (Answer Engine Optimization) and Schema structured-data tools to help websites earn better visibility across Google and AI engines like ChatGPT, Perplexity and Gemini.</p>

<h2>What we do</h2>
<ul>
  <li><strong>Tool directories</strong> — We maintain 200+ curated SEO/GEO/AEO tools, sorted by use case with objective descriptions so you can choose faster.</li>
  <li><strong>Free online tools</strong> — Schema structured-data generator, llms.txt generator, AI visibility checker and more, free to use.</li>
  <li><strong>In-depth content</strong> — Articles, tutorials, a glossary and industry news covering hands-on optimization from beginner to advanced.</li>
</ul>

<h2>Our philosophy</h2>
<p>Search is shifting from "ten blue links" toward direct AI answers. We believe great content, clean structured data and a crawler-friendly site architecture are the foundation for earning organic visibility in this new era. SGAIndex exists to bring the scattered tools and knowledge behind that methodology into one place, so every site owner, content creator and marketer can get started with a low barrier to entry.</p>

<h2>Editorial &amp; listing principles</h2>
<p>Our listings and articles are compiled from public information, hands-on testing and industry consensus, and we aim to stay objective and neutral. Some outbound links may be partner or affiliate links, but inclusion and ranking are not influenced by them. If you spot an error, please let us know at <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>

<h2>Get in touch</h2>
<p>For partnerships, corrections or suggestions, email us at <a href="mailto:${CONTACT}">${CONTACT}</a> or visit our <a href="/contact">Contact</a> page.</p>
`,
)

usePageSeo(
  computed(() => ({
    title: isZh.value ? '关于我们 — SGAIndex 简介与编辑原则' : 'About Us — What SGAIndex Is & How We Curate',
    description: isZh.value
      ? 'SGAIndex 是面向 AI 搜索时代的 SEO/GEO/AEO 工具导航与知识平台。了解我们做什么、我们的理念,以及工具收录与编辑原则。'
      : 'SGAIndex is a tools directory and knowledge hub for the AI search era. Learn what we do, our philosophy, and our listing & editorial principles.',
    path: '/about',
    keywords: isZh.value
      ? 'SGAIndex,关于我们,SEO 工具导航,GEO,AEO,公司简介'
      : 'SGAIndex,about us,SEO tools directory,GEO,AEO,about the team',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: isZh.value ? '关于 SGAIndex' : 'About SGAIndex',
        url: 'https://sgaindex.com/about',
        publisher: {
          '@type': 'Organization',
          name: 'SGAIndex',
          url: 'https://sgaindex.com',
          email: CONTACT,
        },
      },
    ],
  })),
)
</script>
