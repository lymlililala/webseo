import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'seo-nav' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'seo-nav' },
    children: [
      {
        name: 'seo-nav',
        path: 'seo-nav',
        component: () => import('../pages/seo-nav/SeoNavPage.vue'),
      },
      {
        name: 'geo-nav',
        path: 'geo-nav',
        component: () => import('../pages/geo-nav/GeoNavPage.vue'),
      },
      {
        name: 'aeo-nav',
        path: 'aeo-nav',
        component: () => import('../pages/aeo-nav/AeoNavPage.vue'),
      },
      {
        name: 'llms-txt',
        path: 'llms-txt',
        component: () => import('../pages/llms-txt/LlmsTxtPage.vue'),
      },
      {
        name: 'articles',
        path: 'articles',
        component: () => import('../pages/articles/ArticlesPage.vue'),
      },
      {
        name: 'tutorials',
        path: 'tutorials',
        component: () => import('../pages/tutorials/TutorialsPage.vue'),
      },
      {
        name: 'news',
        path: 'news',
        component: () => import('../pages/news/NewsPage.vue'),
      },
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
      },
      {
        name: 'payments',
        path: '/payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
          },
        ],
      },
      {
        name: 'faq',
        path: '/faq',
        component: () => import('../pages/faq/FaqPage.vue'),
      },
    ],
  },
  {
    name: '404',
    path: '/404',
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

export default router
