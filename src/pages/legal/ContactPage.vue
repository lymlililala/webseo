<template>
  <LegalShell :title="title" :body="body" :updated="updated" current="/contact">
    <div class="contact-card">
      <span class="contact-label">{{ isZh ? '邮箱' : 'Email' }}</span>
      <a class="contact-email" :href="`mailto:${CONTACT}`">{{ CONTACT }}</a>
      <p class="contact-note">
        {{
          isZh
            ? '我们通常在 1–2 个工作日内回复。'
            : 'We typically respond within 1–2 business days.'
        }}
      </p>
    </div>
  </LegalShell>
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

const title = computed(() => (isZh.value ? '联系我们' : 'Contact Us'))

const body = computed(() =>
  isZh.value
    ? `
<p>感谢你对 <strong>SGAIndex</strong> 的关注。无论是合作咨询、内容纠错,还是工具收录建议,我们都很乐意听到你的声音。</p>

<h2>可以就这些事联系我们</h2>
<ul>
  <li><strong>工具收录 / 更新</strong> — 推荐一款 SEO/GEO/AEO 工具,或更新已有信息。</li>
  <li><strong>内容纠错</strong> — 文章、教程或术语中如有错误,请告知我们。</li>
  <li><strong>商务与合作</strong> — 内容合作、投放或联盟事宜。</li>
  <li><strong>隐私与数据</strong> — 与你个人数据相关的查询或请求(详见<a href="/zh/privacy">隐私政策</a>)。</li>
</ul>

<h2>邮件之外</h2>
<p>为提高沟通效率,来信时请尽量写明主题与具体诉求;涉及纠错的,附上对应页面链接会更快得到处理。</p>
`
    : `
<p>Thanks for your interest in <strong>SGAIndex</strong>. Whether it's a partnership enquiry, a content correction, or a tool you think we should list, we'd love to hear from you.</p>

<h2>What you can reach us about</h2>
<ul>
  <li><strong>Tool listings / updates</strong> — Suggest an SEO/GEO/AEO tool, or update existing information.</li>
  <li><strong>Content corrections</strong> — Let us know if an article, tutorial or glossary entry has an error.</li>
  <li><strong>Business &amp; partnerships</strong> — Content collaborations, placements or affiliate matters.</li>
  <li><strong>Privacy &amp; data</strong> — Questions or requests about your personal data (see our <a href="/privacy">Privacy Policy</a>).</li>
</ul>

<h2>Before you write</h2>
<p>To help us respond faster, please include a clear subject and the specifics of your request. For corrections, attaching the relevant page link gets things resolved much quicker.</p>
`,
)

usePageSeo(
  computed(() => ({
    title: isZh.value ? '联系我们 — SGAIndex' : 'Contact Us — SGAIndex',
    description: isZh.value
      ? `通过 ${CONTACT} 联系 SGAIndex,咨询工具收录、内容纠错、商务合作或隐私数据相关事宜。`
      : `Get in touch with SGAIndex at ${CONTACT} for tool listings, content corrections, partnerships or privacy & data requests.`,
    path: '/contact',
    keywords: isZh.value ? 'SGAIndex,联系我们,联系方式,邮箱' : 'SGAIndex,contact us,get in touch,email',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: isZh.value ? '联系 SGAIndex' : 'Contact SGAIndex',
        url: 'https://sgaindex.com/contact',
        publisher: {
          '@type': 'Organization',
          name: 'SGAIndex',
          url: 'https://sgaindex.com',
          email: CONTACT,
          contactPoint: {
            '@type': 'ContactPoint',
            email: CONTACT,
            contactType: 'customer support',
            availableLanguage: ['English', 'Chinese'],
          },
        },
      },
    ],
  })),
)
</script>

<style scoped lang="scss">
.contact-card {
  margin-top: 1.5rem;
  padding: 1.5rem 1.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: var(--va-background-element, #f8fafc);
}

.contact-label {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--va-secondary, #6b7280);
  margin-bottom: 0.35rem;
}

.contact-email {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--va-primary, #2563eb);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.contact-note {
  margin: 0.75rem 0 0;
  font-size: 0.9rem;
  color: var(--va-secondary, #6b7280);
}
</style>
