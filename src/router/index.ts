import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import { setLocale } from '../i18n/useLocale'

/**
 * 业务子路由(相对路径)。挂载在两个父路由下:
 *   '/'    → 英文(默认,无前缀)
 *   '/zh'  → 中文
 * zh 变体的 name 加 ':zh' 后缀避免冲突;导航统一用 localePath() 走路径,不依赖 name。
 */
function makeChildren(suffix = ''): RouteRecordRaw[] {
  const n = (name: string) => name + suffix
  return [
    { name: n('seo-nav'), path: 'seo-nav', component: () => import('../pages/seo-nav/SeoNavPage.vue') },
    { name: n('geo-nav'), path: 'geo-nav', component: () => import('../pages/geo-nav/GeoNavPage.vue') },
    { name: n('aeo-nav'), path: 'aeo-nav', component: () => import('../pages/aeo-nav/AeoNavPage.vue') },
    { name: n('llms-txt'), path: 'llms-txt', component: () => import('../pages/llms-txt/LlmsTxtPage.vue') },
    { name: n('ai-checker'), path: 'ai-checker', component: () => import('../pages/ai-checker/AiCheckerPage.vue') },
    { name: n('glossary'), path: 'glossary', component: () => import('../pages/glossary/GlossaryPage.vue') },
    {
      name: n('schema-generator'),
      path: 'schema-generator',
      component: () => import('../pages/schema-generator/SchemaGeneratorPage.vue'),
    },
    { name: n('articles'), path: 'articles', component: () => import('../pages/articles/ArticlesPage.vue') },
    {
      name: n('article-detail'),
      path: 'articles/:id',
      component: () => import('../pages/articles/ArticleDetailPage.vue'),
    },
    { name: n('tutorials'), path: 'tutorials', component: () => import('../pages/tutorials/TutorialsPage.vue') },
    {
      name: n('tutorial-detail'),
      path: 'tutorials/:id',
      component: () => import('../pages/tutorials/TutorialDetailPage.vue'),
    },
    { name: n('news'), path: 'news', component: () => import('../pages/news/NewsPage.vue') },
    { name: n('news-detail'), path: 'news/:id', component: () => import('../pages/news/NewsDetailPage.vue') },
    { name: n('backlinks'), path: 'backlinks', component: () => import('../pages/backlinks/BacklinksPage.vue') },
    { name: n('dashboard'), path: 'dashboard', component: () => import('../pages/admin/dashboard/Dashboard.vue') },
    { name: n('settings'), path: 'settings', component: () => import('../pages/settings/Settings.vue') },
    { name: n('preferences'), path: 'preferences', component: () => import('../pages/preferences/Preferences.vue') },
    { name: n('users'), path: 'users', component: () => import('../pages/users/UsersPage.vue') },
    { name: n('projects'), path: 'projects', component: () => import('../pages/projects/ProjectsPage.vue') },
    {
      name: n('payments'),
      path: 'payments',
      component: RouteViewComponent,
      children: [
        {
          name: n('payment-methods'),
          path: 'payment-methods',
          component: () => import('../pages/payments/PaymentsPage.vue'),
        },
        { name: n('billing'), path: 'billing', component: () => import('../pages/billing/BillingPage.vue') },
        {
          name: n('pricing-plans'),
          path: 'pricing-plans',
          component: () => import('../pages/pricing-plans/PricingPlans.vue'),
        },
      ],
    },
    { name: n('faq'), path: 'faq', component: () => import('../pages/faq/FaqPage.vue') },
    { name: n('about'), path: 'about', component: () => import('../pages/legal/AboutPage.vue') },
    { name: n('contact'), path: 'contact', component: () => import('../pages/legal/ContactPage.vue') },
    { name: n('privacy'), path: 'privacy', component: () => import('../pages/legal/PrivacyPage.vue') },
    { name: n('terms'), path: 'terms', component: () => import('../pages/legal/TermsPage.vue') },
  ]
}

const routes: Array<RouteRecordRaw> = [
  // 英文(默认,无前缀)
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'seo-nav' },
    children: makeChildren(),
  },
  // 中文(/zh 前缀)
  {
    name: 'admin:zh',
    path: '/zh',
    component: AppLayout,
    redirect: { name: 'seo-nav:zh' },
    children: makeChildren(':zh'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

// 据 URL 前缀同步 locale(/zh → zh,其余 → en)
router.beforeEach((to) => {
  const isZh = to.path === '/zh' || to.path.startsWith('/zh/')
  setLocale(isZh ? 'zh' : 'en')
})

export default router
