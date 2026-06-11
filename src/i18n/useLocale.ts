/**
 * useLocale — 语言探测、持久化、URL 前缀映射
 *
 * 支持语言:'en'(默认,无 URL 前缀) / 'zh'(URL 前缀 /zh)
 *  - 首次访问按 navigator.language 探测(中文浏览器→zh,其余→en)
 *  - 选择持久化到 localStorage
 *  - 同步 <html lang> 属性
 */
import i18n from './index'

export type AppLocale = 'en' | 'zh'
export const SUPPORTED_LOCALES: AppLocale[] = ['en', 'zh']
const STORAGE_KEY = 'sgaindex_locale'

/** 探测初始语言:localStorage > URL 前缀 > 浏览器语言 > en */
export function detectInitialLocale(): AppLocale {
  // 1. localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch (_) {
    /* SSR/隐私模式忽略 */
  }
  // 2. URL 前缀(/zh/...)
  if (typeof window !== 'undefined' && /^\/zh(\/|$)/.test(window.location.pathname)) return 'zh'
  // 3. 浏览器语言
  if (typeof navigator !== 'undefined' && navigator.language) {
    if (navigator.language.toLowerCase().startsWith('zh')) return 'zh'
  }
  return 'en'
}

/** 当前 locale(从 i18n 实例读取) */
export function currentLocale(): AppLocale {
  const l = i18n.global.locale.value as string
  return l === 'zh' ? 'zh' : 'en'
}

/** 设置 locale:更新 i18n + <html lang> + localStorage */
export function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch (_) {
    /* 忽略 */
  }
}

/**
 * 给路径加上当前语言前缀(en 不加,zh 加 /zh)
 * @param path 形如 /seo-nav 的无前缀路径
 * @param locale 目标语言,默认当前
 */
export function localePath(path: string, locale: AppLocale = currentLocale()): string {
  const clean = path.startsWith('/') ? path : '/' + path
  if (locale === 'zh') return clean === '/' ? '/zh' : '/zh' + clean
  return clean
}

/** 从带前缀的路径中剥掉 /zh,返回 { locale, path } */
export function stripLocale(fullPath: string): { locale: AppLocale; path: string } {
  if (/^\/zh(\/|$)/.test(fullPath)) {
    const rest = fullPath.replace(/^\/zh/, '') || '/'
    return { locale: 'zh', path: rest }
  }
  return { locale: 'en', path: fullPath || '/' }
}
