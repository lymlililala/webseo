<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__brand">
        <RouterLink :to="localePath('/')" class="app-footer__logo">SGAIndex</RouterLink>
        <p class="app-footer__tagline">{{ t('footer.tagline') }}</p>
      </div>

      <nav class="app-footer__links" aria-label="Footer">
        <RouterLink :to="localePath('/backlinks')">{{ t('footer.backlinks') }}</RouterLink>
        <RouterLink :to="localePath('/about')">{{ t('footer.about') }}</RouterLink>
        <RouterLink :to="localePath('/contact')">{{ t('footer.contact') }}</RouterLink>
        <RouterLink :to="localePath('/privacy')">{{ t('footer.privacy') }}</RouterLink>
        <RouterLink :to="localePath('/terms')">{{ t('footer.terms') }}</RouterLink>
        <RouterLink :to="localePath('/faq')">{{ t('menu.faq') }}</RouterLink>
      </nav>
    </div>

    <div class="app-footer__bottom">
      <span>© {{ year }} SGAIndex. {{ t('footer.rights') }}</span>
      <a :href="`mailto:${CONTACT}`">{{ CONTACT }}</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localePath } from '../i18n/useLocale'

const { t } = useI18n()
const CONTACT = 'contact@sgaindex.com'
// 站点构建年份;预渲染时 Date 受限,此处仅用于客户端展示,固定为发布年份
const year = 2026
</script>

<style scoped lang="scss">
.app-footer {
  margin-top: 3rem;
  padding: 2rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
  color: var(--va-text-primary, #374151);
}

.app-footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2.5rem;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.app-footer__logo {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--va-primary, #2563eb);
  text-decoration: none;
}

.app-footer__tagline {
  margin: 0.4rem 0 0;
  max-width: 360px;
  color: var(--va-secondary, #6b7280);
  line-height: 1.5;
}

.app-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: flex-start;

  a {
    color: var(--va-text-primary, #374151);
    text-decoration: none;

    &:hover {
      color: var(--va-primary, #2563eb);
      text-decoration: underline;
    }
  }
}

.app-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  justify-content: space-between;
  max-width: 1200px;
  margin: 1.5rem auto 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  color: var(--va-secondary, #6b7280);
  font-size: 0.82rem;

  a {
    color: var(--va-secondary, #6b7280);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
