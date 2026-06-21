<template>
  <div class="bl-page">
    <!-- ═══ Hero ═══ -->
    <section class="bl-hero">
      <span class="bl-kicker">{{ t.kicker }}</span>
      <h1 class="bl-title">{{ t.heroTitle }}</h1>
      <p class="bl-subtitle">{{ t.heroSubtitle }}</p>
      <div class="bl-hero-actions">
        <button type="button" class="bl-btn bl-btn--primary" @click="openContact()">{{ t.heroCta }}</button>
        <a class="bl-btn bl-btn--ghost" href="#packages">{{ t.heroCta2 }}</a>
      </div>
      <ul class="bl-trust">
        <li v-for="item in t.trust" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- ═══ 价值点 ═══ -->
    <section class="bl-benefits">
      <article v-for="b in t.benefits" :key="b.title" class="bl-benefit">
        <VaIcon :name="b.icon" size="28px" color="primary" />
        <h3>{{ b.title }}</h3>
        <p>{{ b.desc }}</p>
      </article>
    </section>

    <!-- ═══ 套餐 ═══ -->
    <section id="packages" class="bl-packages">
      <header class="bl-section-head">
        <h2>{{ t.packagesTitle }}</h2>
        <p>{{ t.packagesSubtitle }}</p>
      </header>
      <div class="bl-grid">
        <article
          v-for="pkg in t.packages"
          :key="pkg.name"
          class="bl-card"
          :class="{ 'bl-card--featured': pkg.featured }"
        >
          <span v-if="pkg.featured" class="bl-badge">{{ t.popular }}</span>
          <h3 class="bl-card-name">{{ pkg.name }}</h3>
          <p class="bl-card-tagline">{{ pkg.tagline }}</p>
          <div class="bl-price">
            <span class="bl-price-quote">{{ t.priceNote }}</span>
          </div>
          <ul class="bl-features">
            <li v-for="f in pkg.features" :key="f">
              <VaIcon name="mso-check" size="18px" color="primary" />
              <span>{{ f }}</span>
            </li>
          </ul>
          <button
            type="button"
            class="bl-btn"
            :class="pkg.featured ? 'bl-btn--primary' : 'bl-btn--outline'"
            @click="openContact(pkg.name)"
          >
            {{ t.packageCta }}
          </button>
        </article>
      </div>

      <!-- 定制 -->
      <div class="bl-custom">
        <div>
          <h3>{{ t.customTitle }}</h3>
          <p>{{ t.customDesc }}</p>
        </div>
        <button type="button" class="bl-btn bl-btn--primary" @click="openContact(t.customSubject)">
          {{ t.customCta }}
        </button>
      </div>
    </section>

    <!-- ═══ 流程 ═══ -->
    <section class="bl-process">
      <header class="bl-section-head">
        <h2>{{ t.processTitle }}</h2>
        <p>{{ t.processSubtitle }}</p>
      </header>
      <ol class="bl-steps">
        <li v-for="(s, i) in t.steps" :key="s.title">
          <span class="bl-step-num">{{ i + 1 }}</span>
          <div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="bl-faq">
      <header class="bl-section-head">
        <h2>{{ t.faqTitle }}</h2>
      </header>
      <details v-for="qa in t.faq" :key="qa.q" class="bl-faq-item">
        <summary>{{ qa.q }}</summary>
        <p>{{ qa.a }}</p>
      </details>
    </section>

    <!-- ═══ 最终 CTA ═══ -->
    <section class="bl-cta">
      <h2>{{ t.finalTitle }}</h2>
      <p>{{ t.finalDesc }}</p>
      <button type="button" class="bl-btn bl-btn--primary bl-btn--lg" @click="openContact()">{{ t.finalCta }}</button>
      <p class="bl-cta-email">
        {{ t.orEmail }} <a :href="`mailto:${CONTACT}`">{{ CONTACT }}</a>
      </p>
    </section>

    <!-- ═══ 咨询弹窗:邮箱 + 一键复制 + 可选 mailto ═══ -->
    <VaModal v-model="showContact" hide-default-actions max-width="430px" close-button>
      <h3 class="bl-modal-title">{{ t.modalTitle }}</h3>
      <p class="bl-modal-desc">{{ t.modalDesc }}</p>
      <div class="bl-modal-email">
        <span class="bl-modal-addr">{{ CONTACT }}</span>
        <button type="button" class="bl-btn bl-btn--outline bl-modal-copy" @click="copyEmail">
          {{ copied ? t.copied : t.copy }}
        </button>
      </div>
      <a class="bl-btn bl-btn--primary bl-modal-mailto" :href="mailtoFor(activePlan)">{{ t.openMail }}</a>
      <p class="bl-modal-hint">{{ t.modalHint }}</p>
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '../../composables/usePageSeo'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

const CONTACT = 'contact@sgaindex.com'

// 咨询弹窗状态：不直接跳 mailto(很多访客没配桌面邮件客户端,会卡在系统"添加账户"),
// 改为弹出卡片 → 展示邮箱 + 一键复制 + 可选"用邮件客户端打开(预填主题/正文)"
const showContact = ref(false)
const activePlan = ref<string | undefined>(undefined)
const copied = ref(false)

const openContact = (plan?: string) => {
  activePlan.value = plan
  copied.value = false
  showContact.value = true
}

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(CONTACT)
  } catch {
    // 兜底:clipboard API 不可用时用临时 textarea
    const ta = document.createElement('textarea')
    ta.value = CONTACT
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      /* 忽略 */
    }
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

// 邮件 CTA：预填主题与正文,便于用户一键发起咨询、便于我们识别套餐
const mailtoFor = (plan?: string) => {
  const subject = plan
    ? isZh.value
      ? `外链发布咨询 — ${plan}`
      : `Backlink Service Inquiry — ${plan}`
    : isZh.value
      ? '外链发布咨询'
      : 'Backlink Service Inquiry'
  const body = isZh.value
    ? `你好 SGAIndex 团队，\n\n我想了解外链发布服务${plan ? `（${plan}）` : ''}。\n\n网站 / 目标页面：\n目标关键词：\n所在行业：\n预算 / 每月需求量：\n\n谢谢！`
    : `Hi SGAIndex team,\n\nI'd like to learn more about your backlink service${plan ? ` (${plan})` : ''}.\n\nWebsite / target pages:\nTarget keywords:\nNiche / industry:\nBudget / monthly volume:\n\nThanks!`
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const en = {
  kicker: 'SGAIndex Link-Building Service',
  heroTitle: 'Backlink Publishing on Real, High-Authority Sites',
  heroSubtitle:
    'Editorially placed guest posts and niche edits on indexed, traffic-bearing websites — manually vetted, white-hat, and built to move your rankings in both Google and AI search.',
  heroCta: 'Get a free quote',
  heroCta2: 'See packages',
  trust: ['White-hat & manual outreach', 'DA / DR-filtered domains', 'Dofollow, contextual links', 'Full transparency report'],
  benefits: [
    {
      icon: 'verified',
      title: 'Real sites, real traffic',
      desc: 'Every domain is screened for organic traffic, indexing and topical relevance — no PBNs or link farms.',
    },
    {
      icon: 'trending_up',
      title: 'Rankings that compound',
      desc: 'Contextual, dofollow links from relevant niches that build authority for Google and AI engines alike.',
    },
    {
      icon: 'description',
      title: 'Done-for-you content',
      desc: 'Native writers craft the article and naturally embed your link — you only approve and relax.',
    },
    {
      icon: 'lock',
      title: 'Safe & transparent',
      desc: 'Manual outreach, gradual velocity, and a live-link report for every placement we deliver.',
    },
  ],
  packagesTitle: 'Backlink Packages',
  packagesSubtitle: 'Pick the scope that fits, then email us for a tailored quote. No fixed price — you only pay for what your goals need.',
  priceNote: 'Custom quote',
  popular: 'Most popular',
  packageCta: 'Get a quote by email',
  packages: [
    {
      name: 'Starter',
      tagline: 'For new sites testing the waters',
      featured: false,
      features: [
        '5 backlinks / month',
        'DA / DR 30+ domains',
        'Dofollow contextual links',
        'Original 600+ word articles',
        'Live-link delivery report',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      tagline: 'Best for sites ready to rank',
      featured: true,
      features: [
        '12 backlinks / month',
        'DA / DR 40+ domains',
        'Niche-relevant placements',
        'Guest posts + niche edits',
        '800+ word expert articles',
        'Anchor-text strategy included',
        'Priority email support',
      ],
    },
    {
      name: 'Authority',
      tagline: 'For competitive niches & agencies',
      featured: false,
      features: [
        '25 backlinks / month',
        'DA / DR 50+ premium domains',
        'High-traffic, real-business sites',
        'Guest posts, niche edits & digital PR',
        'Dedicated link strategist',
        'Monthly performance review',
        'White-label reporting',
      ],
    },
  ],
  customTitle: 'Need volume, white-label, or a specific niche?',
  customDesc: 'Tell us your targets and budget — we’ll build a custom link-building plan around them.',
  customSubject: 'Custom Plan',
  customCta: 'Request a custom plan',
  processTitle: 'How it works',
  processSubtitle: 'From brief to live links in four simple steps.',
  steps: [
    { title: 'Send your brief', desc: 'Email us your site, target pages, keywords and niche. We reply with a tailored plan and quote within 1–2 business days.' },
    { title: 'We find the sites', desc: 'We hand-pick relevant, traffic-bearing domains and share the shortlist for your approval before anything goes live.' },
    { title: 'Content & placement', desc: 'Our writers produce the article, embed your link naturally, and publish it on the agreed sites.' },
    { title: 'Report & repeat', desc: 'You receive a full report of live URLs. We monitor and keep the momentum going each month.' },
  ],
  faqTitle: 'Frequently asked questions',
  faq: [
    { q: 'Are these white-hat backlinks?', a: 'Yes. We only use manual outreach to real, editorially-run websites with genuine traffic. No PBNs, link farms or automated tools.' },
    { q: 'How do you choose the domains?', a: 'We filter by Domain Authority / Domain Rating, organic traffic, indexing status and topical relevance to your niche, and share the list for your approval.' },
    { q: 'When will I see results?', a: 'Link building compounds over time. Most clients notice ranking movement within 4–12 weeks, depending on competition and on-page health.' },
    { q: 'How do I pay and get started?', a: 'Just email us — we’ll confirm scope, send an invoice, and kick off once payment is received. Packages are billed monthly and you can cancel anytime.' },
    { q: 'Do you offer refunds if a link drops?', a: 'Yes. If a placed link is removed within 6 months, we replace it free of charge on an equivalent domain.' },
  ],
  finalTitle: 'Ready to build authority that lasts?',
  finalDesc: 'Get a free, no-obligation quote tailored to your site and goals.',
  finalCta: 'Email us for a free quote',
  orEmail: 'Or write to us directly at',
  modalTitle: 'Contact us about backlinks',
  modalDesc: 'Copy the email below and send us your details, or open your mail app with a pre-filled message.',
  copy: 'Copy email',
  copied: 'Copied!',
  openMail: 'Open in mail app',
  modalHint: 'We typically reply within 1–2 business days.',
}

const zh = {
  kicker: 'SGAIndex 外链建设服务',
  heroTitle: '在真实高权重网站上发布外链',
  heroSubtitle:
    '在已被收录、有真实流量的网站上进行编辑型软文与站内链接（niche edit）投放——全程人工审核、白帽合规，助你在 Google 与 AI 搜索中同步提升排名。',
  heroCta: '免费获取报价',
  heroCta2: '查看套餐',
  trust: ['白帽 · 人工外联', 'DA / DR 域名筛选', 'Dofollow 上下文链接', '完整交付报告'],
  benefits: [
    {
      icon: 'verified',
      title: '真实网站 · 真实流量',
      desc: '每个域名都经过自然流量、收录状态与主题相关性筛选——拒绝站群与链接农场。',
    },
    {
      icon: 'trending_up',
      title: '排名持续累积',
      desc: '来自相关领域的上下文 Dofollow 链接，为 Google 与 AI 引擎同步积累权威度。',
    },
    {
      icon: 'description',
      title: '内容代写代发',
      desc: '母语写手撰写文章并自然植入你的链接——你只需确认，剩下交给我们。',
    },
    {
      icon: 'lock',
      title: '安全 · 透明',
      desc: '人工外联、平稳的增长节奏，每条外链都附上可访问的交付报告。',
    },
  ],
  packagesTitle: '外链发布套餐',
  packagesSubtitle: '挑一个合适的量级，再邮件咨询获取专属报价。没有固定价格——按你的目标需要付费即可。',
  priceNote: '报价邮件咨询',
  popular: '最受欢迎',
  packageCta: '邮件咨询报价',
  packages: [
    {
      name: '入门版 Starter',
      tagline: '适合新站小步试水',
      featured: false,
      features: ['每月 5 条外链', 'DA / DR 30+ 域名', 'Dofollow 上下文链接', '原创 600+ 字文章', '外链交付报告', '邮件支持'],
    },
    {
      name: '成长版 Growth',
      tagline: '适合准备冲排名的站点',
      featured: true,
      features: [
        '每月 12 条外链',
        'DA / DR 40+ 域名',
        '相关领域定向投放',
        '软文 + niche edit',
        '800+ 字专家级文章',
        '含锚文本策略',
        '优先邮件支持',
      ],
    },
    {
      name: '权威版 Authority',
      tagline: '适合竞争激烈的行业与代理商',
      featured: false,
      features: [
        '每月 25 条外链',
        'DA / DR 50+ 优质域名',
        '高流量 · 真实企业站点',
        '软文 / niche edit / 数字公关',
        '专属外链策略师',
        '每月效果复盘',
        '可白标报告',
      ],
    },
  ],
  customTitle: '需要更大量级、白标或指定行业？',
  customDesc: '告诉我们你的目标与预算，我们为你定制专属外链方案。',
  customSubject: '定制方案',
  customCta: '咨询定制方案',
  processTitle: '服务流程',
  processSubtitle: '从需求到外链上线，只需四步。',
  steps: [
    { title: '提交需求', desc: '邮件告知网站、目标页面、关键词与行业，我们将在 1–2 个工作日内回复定制方案与报价。' },
    { title: '筛选网站', desc: '我们人工挑选相关、有流量的域名，并在投放前把候选清单交给你确认。' },
    { title: '内容与投放', desc: '写手撰写文章、自然植入你的链接，并发布在双方确认的网站上。' },
    { title: '报告与续期', desc: '你将收到全部上线 URL 的完整报告，我们持续监测并按月保持势头。' },
  ],
  faqTitle: '常见问题',
  faq: [
    { q: '这些是白帽外链吗？', a: '是的。我们仅通过人工外联，投放在有真实流量、编辑运营的网站上——不使用站群、链接农场或自动化工具。' },
    { q: '你们如何挑选域名？', a: '我们按域名权重（DA / DR）、自然流量、收录状态与主题相关性筛选，并把清单交给你确认后再投放。' },
    { q: '多久能看到效果？', a: '外链效果会随时间累积。多数客户在 4–12 周内观察到排名变化，具体取决于竞争程度与页面本身的优化情况。' },
    { q: '如何付款和开始？', a: '直接邮件联系我们即可——确认范围后开具账单，收款后启动。套餐按月计费，可随时取消。' },
    { q: '外链掉了会补吗？', a: '会。若已投放的链接在 6 个月内被移除，我们将在同等权重的域名上免费补发。' },
  ],
  finalTitle: '准备好积累长期权威度了吗？',
  finalDesc: '获取一份针对你网站与目标的免费报价，无需任何承诺。',
  finalCta: '邮件获取免费报价',
  orEmail: '或直接写信至',
  modalTitle: '外链发布咨询',
  modalDesc: '复制下方邮箱把需求发给我们,或直接打开邮件客户端(已为你预填好主题与正文)。',
  copy: '复制邮箱',
  copied: '已复制!',
  openMail: '用邮件客户端打开',
  modalHint: '我们通常在 1–2 个工作日内回复。',
}

const t = computed(() => (isZh.value ? zh : en))

usePageSeo(
  computed(() => ({
    title: isZh.value
      ? '外链发布服务 — 高权重网站软文与外链建设 | SGAIndex'
      : 'Backlink Publishing Service — High-DA Guest Posts & Link Building | SGAIndex',
    description: isZh.value
      ? '在真实高权重网站上发布 Dofollow 外链：软文投放、niche edit、数字公关。白帽人工外联，DA/DR 筛选，提供完整交付报告。邮件咨询免费报价。'
      : 'Get dofollow backlinks on real, high-authority websites: guest posts, niche edits and digital PR. White-hat manual outreach, DA/DR-filtered domains, full reporting. Email us for a free quote.',
    path: '/backlinks',
    keywords: isZh.value
      ? '外链发布,外链建设,软文外链,guest post,niche edit,反向链接,buy backlinks,链接建设服务'
      : 'backlink service,buy backlinks,link building service,guest posting service,niche edits,high DA backlinks,white hat link building',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: isZh.value ? 'SGAIndex 外链发布服务' : 'SGAIndex Backlink Publishing Service',
        serviceType: isZh.value ? '外链建设 / 链接建设' : 'Link Building / Backlink Service',
        url: 'https://sgaindex.com/backlinks',
        provider: { '@type': 'Organization', name: 'SGAIndex', url: 'https://sgaindex.com', email: CONTACT },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: isZh.value ? '外链发布套餐' : 'Backlink Packages',
          itemListElement: t.value.packages.map((p) => ({
            '@type': 'Offer',
            name: p.name,
            url: 'https://sgaindex.com/backlinks',
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: t.value.faq.map((qa) => ({
          '@type': 'Question',
          name: qa.q,
          acceptedAnswer: { '@type': 'Answer', text: qa.a },
        })),
      },
    ],
  })),
)
</script>

<style scoped lang="scss">
.bl-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 0.5rem 3rem;
  color: var(--va-text-primary, #1f2937);
}

/* ── 通用按钮 ── */
.bl-btn {
  display: inline-block;
  padding: 0.7rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: inherit;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-1px);
  }

  &--primary {
    background: var(--va-primary, #2563eb);
    color: #fff;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  }

  &--outline {
    border-color: var(--va-primary, #2563eb);
    color: var(--va-primary, #2563eb);
    background: transparent;

    &:hover {
      background: rgba(37, 99, 235, 0.06);
    }
  }

  &--ghost {
    color: var(--va-text-primary, #374151);
    background: transparent;
    border-color: rgba(0, 0, 0, 0.12);
  }

  &--lg {
    padding: 0.95rem 2rem;
    font-size: 1.05rem;
  }
}

/* ── Hero ── */
.bl-hero {
  text-align: center;
  padding: 2.5rem 1rem 1.5rem;
}

.bl-kicker {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--va-primary, #2563eb);
  font-weight: 700;
  margin-bottom: 0.9rem;
}

.bl-title {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1.18;
  margin: 0 auto;
  max-width: 760px;
}

.bl-subtitle {
  margin: 1.1rem auto 0;
  max-width: 680px;
  font-size: 1.1rem;
  line-height: 1.65;
  color: var(--va-secondary, #6b7280);
}

.bl-hero-actions {
  display: flex;
  gap: 0.85rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.8rem;
}

.bl-trust {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem 1.5rem;
  list-style: none;
  padding: 0;
  margin: 1.8rem 0 0;
  font-size: 0.88rem;
  color: var(--va-secondary, #6b7280);

  li {
    display: flex;
    align-items: center;

    &::before {
      content: '✓';
      color: var(--va-primary, #2563eb);
      font-weight: 700;
      margin-right: 0.4rem;
    }
  }
}

/* ── 价值点 ── */
.bl-benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin: 3rem 0;
}

.bl-benefit {
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: var(--va-background-element, #f8fafc);

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0.75rem 0 0.4rem;
  }

  p {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--va-secondary, #6b7280);
  }
}

/* ── 区块标题 ── */
.bl-section-head {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
  }

  p {
    margin: 0.6rem auto 0;
    max-width: 560px;
    color: var(--va-secondary, #6b7280);
    font-size: 1rem;
  }
}

/* ── 套餐 ── */
.bl-packages {
  margin: 3.5rem 0;
}

.bl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.bl-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);

  &--featured {
    border-color: var(--va-primary, #2563eb);
    border-width: 2px;
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.15);
  }
}

.bl-badge {
  position: absolute;
  top: -0.8rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--va-primary, #2563eb);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  white-space: nowrap;
}

.bl-card-name {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
}

.bl-card-tagline {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: var(--va-secondary, #6b7280);
}

.bl-price {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  margin: 1.1rem 0 1.25rem;
}

.bl-price-quote {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--va-primary, #2563eb);
}

.bl-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  flex: 1;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    margin-bottom: 0.65rem;
    font-size: 0.93rem;
    line-height: 1.5;

    .va-icon {
      margin-top: 0.1rem;
      flex-shrink: 0;
    }
  }
}

/* ── 定制条 ── */
.bl-custom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-top: 2rem;
  padding: 1.75rem;
  border-radius: 16px;
  background: var(--va-background-element, #f1f5f9);

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
  }

  p {
    margin: 0.3rem 0 0;
    color: var(--va-secondary, #6b7280);
    font-size: 0.95rem;
  }
}

/* ── 流程 ── */
.bl-process {
  margin: 3.5rem 0;
}

.bl-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.5rem;

  li {
    display: flex;
    gap: 0.9rem;
    align-items: flex-start;

    h3 {
      margin: 0 0 0.3rem;
      font-size: 1.05rem;
      font-weight: 700;
    }

    p {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.6;
      color: var(--va-secondary, #6b7280);
    }
  }
}

.bl-step-num {
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: var(--va-primary, #2563eb);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── FAQ ── */
.bl-faq {
  margin: 3.5rem 0;
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}

.bl-faq-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1rem 0;

  summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 1.02rem;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::after {
      content: '+';
      color: var(--va-primary, #2563eb);
      font-size: 1.3rem;
      font-weight: 400;
    }
  }

  &[open] summary::after {
    content: '–';
  }

  p {
    margin: 0.75rem 0 0;
    color: var(--va-secondary, #6b7280);
    line-height: 1.65;
    font-size: 0.95rem;
  }
}

/* ── 最终 CTA ── */
.bl-cta {
  text-align: center;
  margin: 3.5rem 0 1rem;
  padding: 2.75rem 1.5rem;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.02));
  border: 1px solid rgba(37, 99, 235, 0.15);

  h2 {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0;
  }

  p {
    margin: 0.7rem auto 1.5rem;
    max-width: 520px;
    color: var(--va-secondary, #6b7280);
  }
}

.bl-cta-email {
  margin-top: 1.1rem !important;
  font-size: 0.9rem;

  a {
    color: var(--va-primary, #2563eb);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

/* ── 咨询弹窗 ── */
.bl-modal-title {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 0.4rem;
}

.bl-modal-desc {
  margin: 0 0 1.1rem;
  color: var(--va-secondary, #6b7280);
  font-size: 0.95rem;
  line-height: 1.6;
}

.bl-modal-email {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: var(--va-background-element, #f8fafc);
  margin-bottom: 1rem;
}

.bl-modal-addr {
  flex: 1;
  min-width: 180px;
  font-weight: 700;
  font-size: 1.05rem;
  word-break: break-all;
}

.bl-modal-copy {
  padding: 0.5rem 1rem;
  font-size: 0.88rem;
  white-space: nowrap;
}

.bl-modal-mailto {
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.bl-modal-hint {
  margin: 0.9rem 0 0;
  font-size: 0.82rem;
  color: var(--va-secondary, #6b7280);
  text-align: center;
}

@media (max-width: 640px) {
  .bl-title {
    font-size: 1.85rem;
  }
}
</style>
