<template>
  <LegalShell :title="title" :body="body" :updated="updated" current="/terms" />
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

const title = computed(() => (isZh.value ? '服务条款' : 'Terms of Service'))

const body = computed(() =>
  isZh.value
    ? `
<p>欢迎使用 <strong>SGAIndex</strong>(sgaindex.com)。访问或使用本站,即表示你同意以下服务条款。如不同意,请停止使用本站。<strong>生效日期:2026 年 6 月 14 日。</strong></p>

<h2>1. 服务说明</h2>
<p>本站提供 SEO/GEO/AEO 工具导航、免费在线工具及相关内容(文章、教程、术语库、资讯),仅供参考与学习之用。</p>

<h2>2. 内容与"按现状"提供</h2>
<p>我们尽力保证信息准确、及时,但不对内容的完整性、准确性或时效性作出保证。所有内容、工具与外链均按"现状(as is)"提供。你基于本站信息所作的任何决策,风险自负。</p>

<h2>3. 第三方工具与外链</h2>
<p>本站收录并链接到大量第三方工具与网站。我们不拥有、不运营这些第三方服务,也不对其可用性、内容、定价或隐私实践负责。部分外链可能为联盟链接——你通过其完成购买,我们可能获得佣金,但这不会增加你的成本,也不影响我们的客观收录。</p>

<h2>4. 可接受的使用</h2>
<p>使用本站时,你同意不进行以下行为:</p>
<ul>
  <li>以违法、侵权或损害他人的方式使用本站;</li>
  <li>试图未经授权访问本站系统,或干扰、破坏本站正常运行;</li>
  <li>使用自动化手段(爬虫、抓取等)对本站施加不合理负载;</li>
  <li>未经许可大规模复制、转售本站内容。</li>
</ul>

<h2>5. 知识产权</h2>
<p>本站的原创内容、设计与商标归 SGAIndex 所有,受相关法律保护。你可在注明来源并链接回本站的前提下合理引用;商业转载需事先获得书面许可。第三方商标归各自所有者所有。</p>

<h2>6. 责任限制</h2>
<p>在法律允许的最大范围内,SGAIndex 不对因使用或无法使用本站而导致的任何直接、间接、偶发或后果性损失承担责任。</p>

<h2>7. 条款变更</h2>
<p>我们可能不时修订本条款,更新后会修改本页顶部的生效日期。继续使用本站即视为接受修订后的条款。</p>

<h2>8. 联系我们</h2>
<p>对本服务条款有任何疑问,请联系 <a href="mailto:${CONTACT}">${CONTACT}</a>。</p>
`
    : `
<p>Welcome to <strong>SGAIndex</strong> (sgaindex.com). By accessing or using the Site, you agree to the following Terms of Service. If you do not agree, please stop using the Site. <strong>Effective date: June 14, 2026.</strong></p>

<h2>1. About the service</h2>
<p>The Site provides SEO/GEO/AEO tool directories, free online tools, and related content (articles, tutorials, a glossary and news) for reference and educational purposes only.</p>

<h2>2. Content provided "as is"</h2>
<p>We make reasonable efforts to keep information accurate and up to date, but we make no warranty as to the completeness, accuracy or timeliness of the content. All content, tools and outbound links are provided "as is." Any decisions you make based on information from the Site are at your own risk.</p>

<h2>3. Third-party tools and links</h2>
<p>The Site lists and links to many third-party tools and websites. We do not own or operate these third-party services and are not responsible for their availability, content, pricing or privacy practices. Some outbound links may be affiliate links — if you make a purchase through them we may earn a commission, at no extra cost to you, and this does not influence our objective listings.</p>

<h2>4. Acceptable use</h2>
<p>When using the Site, you agree not to:</p>
<ul>
  <li>use the Site in any unlawful, infringing or harmful manner;</li>
  <li>attempt to gain unauthorized access to our systems, or interfere with or disrupt the Site;</li>
  <li>use automated means (crawlers, scrapers, etc.) that place an unreasonable load on the Site;</li>
  <li>reproduce or resell the Site's content at scale without permission.</li>
</ul>

<h2>5. Intellectual property</h2>
<p>The original content, design and trademarks of the Site belong to SGAIndex and are protected by applicable law. You may quote reasonably with attribution and a link back to the Site; commercial reproduction requires prior written permission. Third-party trademarks remain the property of their respective owners.</p>

<h2>6. Limitation of liability</h2>
<p>To the maximum extent permitted by law, SGAIndex shall not be liable for any direct, indirect, incidental or consequential damages arising from your use of, or inability to use, the Site.</p>

<h2>7. Changes to these terms</h2>
<p>We may revise these Terms from time to time. When we do, we will update the effective date at the top of this page. Continued use of the Site constitutes acceptance of the revised Terms.</p>

<h2>8. Contact us</h2>
<p>If you have any questions about these Terms of Service, contact us at <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>
`,
)

usePageSeo(
  computed(() => ({
    title: isZh.value ? '服务条款 — SGAIndex' : 'Terms of Service — SGAIndex',
    description: isZh.value
      ? 'SGAIndex 服务条款:服务说明、内容免责、第三方与联盟链接、可接受使用、知识产权与责任限制。'
      : 'SGAIndex Terms of Service: scope of service, content disclaimer, third-party & affiliate links, acceptable use, IP and limitation of liability.',
    path: '/terms',
    keywords: isZh.value
      ? 'SGAIndex,服务条款,使用条款,免责声明,联盟链接'
      : 'SGAIndex,terms of service,terms of use,disclaimer,affiliate disclosure',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: isZh.value ? '服务条款' : 'Terms of Service',
        url: 'https://sgaindex.com/terms',
        publisher: { '@type': 'Organization', name: 'SGAIndex', url: 'https://sgaindex.com', email: CONTACT },
      },
    ],
  })),
)
</script>
