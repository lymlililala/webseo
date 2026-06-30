// 充值(Stripe)前端入口。带 Supabase access_token 调后端创建结账会话,再跳转 Stripe 托管页。
import { supabase } from './supabase'

// 发起充值:成功则跳转到 Stripe 结账页(本函数不返回,页面会离开)。
// 失败抛错,由调用方提示。
export async function startCheckout(packId: string): Promise<void> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('login required')

  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    // 只回传站内相对路径,付完原路返回
    body: JSON.stringify({ packId, returnPath: window.location.pathname }),
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || `HTTP ${res.status}`)
  }
  const { url } = await res.json()
  if (url) window.location.href = url
  else throw new Error('no checkout url')
}
