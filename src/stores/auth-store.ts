// 通用钱包 —— 登录态 + 积分余额(全站共享)。
// 登录用 Supabase Auth(邮箱魔法链接,免密);余额读 wseo_credit_balance。
// 这是"通用钱包"的前端单一事实源:navbar、域名工具、将来任何付费页都读这个 store。
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, SUPABASE_CONFIGURED } from '../services/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const balance = ref(0)
  const ready = ref(false) // 首次会话恢复是否完成(避免登录态闪烁)
  const loadingBalance = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const email = computed(() => user.value?.email ?? '')

  // 应用启动时调用一次:恢复已有会话 + 订阅后续登录/登出/魔法链接回跳。
  async function init() {
    if (!SUPABASE_CONFIGURED) {
      ready.value = true
      return
    }
    try {
      const { data } = await supabase.auth.getSession()
      await setSession(data.session)
      supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s)
      })
    } catch (e) {
      // 恢复会话失败也要让 UI 进入可用态(显示"登录"),不能卡死
      console.warn('[auth] init failed:', e)
    } finally {
      ready.value = true
    }
  }

  async function setSession(s: Session | null) {
    session.value = s
    user.value = s?.user ?? null
    if (user.value) await refreshBalance()
    else balance.value = 0
  }

  // 拉取当前用户余额(RLS 保证只能读到自己的行)。
  async function refreshBalance() {
    if (!user.value) return
    loadingBalance.value = true
    try {
      const { data, error } = await supabase
        .from('wseo_credit_balance')
        .select('balance')
        .eq('user_id', user.value.id)
        .maybeSingle()
      if (!error) balance.value = data?.balance ?? 0
    } finally {
      loadingBalance.value = false
    }
  }

  // 邮箱魔法链接登录(免密)。点击邮件里的链接后回跳本页,supabase-js 自动接管会话。
  async function signInWithEmail(emailAddr: string) {
    return supabase.auth.signInWithOtp({
      email: emailAddr,
      options: { emailRedirectTo: window.location.href },
    })
  }

  // 预留:将来要邮箱+密码登录,直接用这个,UI 不用大改。
  async function signInWithPassword(emailAddr: string, password: string) {
    return supabase.auth.signInWithPassword({ email: emailAddr, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    await setSession(null)
  }

  return {
    user,
    session,
    balance,
    ready,
    loadingBalance,
    isLoggedIn,
    email,
    init,
    refreshBalance,
    signInWithEmail,
    signInWithPassword,
    signOut,
  }
})
