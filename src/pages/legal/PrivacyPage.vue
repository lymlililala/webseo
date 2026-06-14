<template>
  <LegalShell :title="title" :body="body" :updated="updated" current="/privacy" />
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

const title = computed(() => (isZh.value ? '隐私政策' : 'Privacy Policy'))

const body = computed(() =>
  isZh.value
    ? `
<p><strong>SGAIndex</strong>(以下简称"本站",域名 sgaindex.com)重视你的隐私。本政策说明我们在你访问本站时会收集哪些信息、如何使用,以及你拥有的权利。<strong>生效日期:2026 年 6 月 14 日。</strong></p>

<h2>1. 我们收集的信息</h2>
<p>本站是一个公开的工具导航与内容平台,<strong>无需注册即可浏览</strong>,我们不主动收集姓名、电话等个人身份信息。我们可能处理:</p>
<ul>
  <li><strong>使用与分析数据</strong> — 通过 Vercel Analytics 与 Google Analytics(GA4)收集匿名/汇总数据,如页面浏览、来源、设备类型、大致地理位置,用于改进内容与体验。</li>
  <li><strong>本地存储</strong> — 我们在你的浏览器中保存语言偏好(如 <code>sgaindex_locale</code>)等设置,这些数据不会发送到我们的服务器。</li>
  <li><strong>你主动提供的信息</strong> — 当你通过邮件联系我们时,我们会收到你的邮箱地址及邮件内容。</li>
</ul>

<h2>2. Cookie 与同类技术</h2>
<p>本站及第三方服务(包括分析与广告服务商)会使用 Cookie 或本地存储来统计访问、记住偏好,以及投放与衡量广告。你可以在浏览器设置中清除或禁用 Cookie,但部分功能(如语言记忆)可能受影响。</p>

<h2>3. 第三方服务</h2>
<p>本站依赖以下第三方,它们可能按各自的隐私政策处理数据:</p>
<ul>
  <li><strong>Vercel</strong>(托管与分析)— <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">隐私政策</a></li>
  <li><strong>Google Analytics</strong>(流量分析)— <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">隐私政策</a></li>
  <li><strong>Google AdSense</strong>(广告投放)— <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">广告与 Cookie 说明</a></li>
</ul>
<p>本站包含指向第三方工具的外链,部分可能为联盟链接。点击后你将离开本站,我们对外部网站的隐私实践不承担责任。</p>

<h2>4. 广告</h2>
<p>本站可能展示由 Google 等第三方提供的广告。这些第三方供应商(包括 Google)会使用 Cookie,根据你过往对本站及其他网站的访问来投放广告。Google 使用广告 Cookie,使其及其合作伙伴能基于你的访问行为向你展示相关广告。</p>
<p>你可以前往 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google 广告设置</a> 关闭个性化广告,或访问 <a href="https://www.aboutads.info" target="_blank" rel="noopener">aboutads.info</a> 管理来自参与计划的第三方供应商的广告 Cookie。</p>

<h2>5. 信息的使用</h2>
<p>我们仅将收集到的信息用于:运营与改进本站、分析使用趋势、回复你的咨询、防范滥用与保障安全。我们<strong>不会出售</strong>你的个人信息。</p>

<h2>6. 你的权利</h2>
<p>视你所在地区的法律(如 GDPR、CCPA),你可能有权访问、更正或删除与你相关的个人数据,或反对某些处理。如需行使权利,请邮件联系 <a href="mailto:${CONTACT}">${CONTACT}</a>。</p>

<h2>7. 儿童隐私</h2>
<p>本站不面向 16 岁以下儿童,也不会有意收集其个人信息。</p>

<h2>8. 政策更新</h2>
<p>我们可能不时更新本政策,更新后会修改本页顶部的生效日期。重大变更将在本站显著位置提示。</p>

<h2>9. 联系我们</h2>
<p>对本隐私政策有任何疑问,请联系 <a href="mailto:${CONTACT}">${CONTACT}</a>。</p>
`
    : `
<p><strong>SGAIndex</strong> ("we", "us", or "the Site", at sgaindex.com) respects your privacy. This policy explains what information we collect when you visit the Site, how we use it, and the rights you have. <strong>Effective date: June 14, 2026.</strong></p>

<h2>1. Information we collect</h2>
<p>The Site is a public tools directory and content platform that you can <strong>browse without registering</strong>, and we do not actively collect personal identifiers such as your name or phone number. We may process:</p>
<ul>
  <li><strong>Usage &amp; analytics data</strong> — Anonymous/aggregated data via Vercel Analytics and Google Analytics (GA4), such as page views, referrers, device type and approximate location, used to improve our content and experience.</li>
  <li><strong>Local storage</strong> — We store preferences such as your language choice (e.g. <code>sgaindex_locale</code>) in your browser. This data is not sent to our servers.</li>
  <li><strong>Information you provide</strong> — When you email us, we receive your email address and the contents of your message.</li>
</ul>

<h2>2. Cookies and similar technologies</h2>
<p>The Site and third-party services (including analytics and advertising providers) use cookies or local storage to measure visits, remember preferences, and serve and measure ads. You can clear or disable cookies in your browser settings, though some features (such as language memory) may be affected.</p>

<h2>3. Third-party services</h2>
<p>The Site relies on the following third parties, which may process data under their own privacy policies:</p>
<ul>
  <li><strong>Vercel</strong> (hosting &amp; analytics) — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></li>
  <li><strong>Google Analytics</strong> (traffic analysis) — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a></li>
  <li><strong>Google AdSense</strong> (advertising) — <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">How Google uses ads &amp; cookies</a></li>
</ul>
<p>The Site contains outbound links to third-party tools, some of which may be affiliate links. Once you click through, you leave the Site, and we are not responsible for the privacy practices of external websites.</p>

<h2>4. Advertising</h2>
<p>The Site may display ads served by third parties such as Google. These third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to the Site and/or other sites on the Internet.</p>
<p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>, or manage cookies from participating third-party vendors at <a href="https://www.aboutads.info" target="_blank" rel="noopener">aboutads.info</a>.</p>

<h2>5. How we use information</h2>
<p>We use the information we collect only to: operate and improve the Site, analyze usage trends, respond to your enquiries, and prevent abuse and keep the Site secure. We <strong>do not sell</strong> your personal information.</p>

<h2>6. Your rights</h2>
<p>Depending on the laws of your region (such as GDPR or CCPA), you may have the right to access, correct or delete personal data relating to you, or to object to certain processing. To exercise these rights, email us at <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>

<h2>7. Children's privacy</h2>
<p>The Site is not directed at children under 16 and we do not knowingly collect their personal information.</p>

<h2>8. Updates to this policy</h2>
<p>We may update this policy from time to time. When we do, we will revise the effective date at the top of this page, and significant changes will be highlighted prominently on the Site.</p>

<h2>9. Contact us</h2>
<p>If you have any questions about this Privacy Policy, contact us at <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>
`,
)

usePageSeo(
  computed(() => ({
    title: isZh.value ? '隐私政策 — SGAIndex' : 'Privacy Policy — SGAIndex',
    description: isZh.value
      ? 'SGAIndex 隐私政策:说明我们收集哪些数据、如何使用分析与 Cookie、第三方服务,以及你的数据权利。'
      : 'SGAIndex Privacy Policy: what data we collect, how we use analytics and cookies, the third parties involved, and your data rights.',
    path: '/privacy',
    keywords: isZh.value
      ? 'SGAIndex,隐私政策,Cookie,数据保护,GDPR'
      : 'SGAIndex,privacy policy,cookies,data protection,GDPR,CCPA',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: isZh.value ? '隐私政策' : 'Privacy Policy',
        url: 'https://sgaindex.com/privacy',
        publisher: { '@type': 'Organization', name: 'SGAIndex', url: 'https://sgaindex.com', email: CONTACT },
      },
    ],
  })),
)
</script>
