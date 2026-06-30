// 通用钱包 —— 登录态 + 积分余额(全站共享)。
// 登录用 Supabase Auth(邮箱+密码,含注册/重置密码);余额读 wseo_credit_balance。
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
  const recoveryMode = ref(false) // 用户点了重置密码邮件链接 → 需弹"设置新密码"

  const isLoggedIn = computed(() => !!user.value)
  const email = computed(() => user.value?.email ?? '')

  // 应用启动时调用一次:恢复已有会话 + 订阅后续登录/登出/重置密码回跳。
  async function init() {
    if (!SUPABASE_CONFIGURED) {
      ready.value = true
      return
    }
    try {
      const { data } = await supabase.auth.getSession()
      await setSession(data.session)
      supabase.auth.onAuthStateChange((event, s) => {
        setSession(s)
        // 点击重置密码邮件回跳时,Supabase 会建一个临时会话并触发此事件
        if (event === 'PASSWORD_RECOVERY') recoveryMode.value = true
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

  // 注册:邮箱+密码。若 Supabase 开了"Confirm email",返回的 session 为 null,需用户点确认邮件;
  // 关闭确认则直接返回 session(立即登录)。emailRedirectTo 决定确认后回跳地址。
  async function signUp(emailAddr: string, password: string) {
    return supabase.auth.signUp({
      email: emailAddr,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
  }

  // 登录:邮箱+密码。
  async function signInWithPassword(emailAddr: string, password: string) {
    return supabase.auth.signInWithPassword({ email: emailAddr, password })
  }

  // 发送重置密码邮件。点击链接回跳 origin 后会触发 PASSWORD_RECOVERY → recoveryMode。
  async function sendPasswordReset(emailAddr: string) {
    return supabase.auth.resetPasswordForEmail(emailAddr, {
      redirectTo: window.location.origin,
    })
  }

  // 在恢复模式下设置新密码(此时已有临时会话)。
  async function updatePassword(password: string) {
    const r = await supabase.auth.updateUser({ password })
    if (!r.error) recoveryMode.value = false
    return r
  }

  function clearRecovery() {
    recoveryMode.value = false
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
    recoveryMode,
    isLoggedIn,
    email,
    init,
    refreshBalance,
    signUp,
    signInWithPassword,
    sendPasswordReset,
    updatePassword,
    clearRecovery,
    signOut,
  }
})
