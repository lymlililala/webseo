<script setup lang="ts">
// navbar 账户入口 —— 登录态/积分余额的全站可见处。
// 未登录:显示"登录"按钮(开弹窗);已登录:显示积分余额 chip + 下拉(邮箱/余额/购买/退出)。
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth-store'
import AuthModal from '../../auth/AuthModal.vue'
import BuyCreditsModal from '../../billing/BuyCreditsModal.vue'

const { t } = useI18n()
const { init: toast } = useToast()
const auth = useAuthStore()
const showLogin = ref(false)
const showBuy = ref(false)
const authMode = ref<'login' | 'signup' | 'forgot' | 'reset'>('login')

function openLogin() {
  authMode.value = 'login'
  showLogin.value = true
}

// 重置密码邮件回跳 → 自动弹出"设置新密码"
watch(
  () => auth.recoveryMode,
  (on) => {
    if (on) {
      authMode.value = 'reset'
      showLogin.value = true
    }
  },
)

// Stripe 付款跳回处理:success_url/cancel_url 带 ?credits=success|cancel。
// 成功 → 刷新余额(webhook 异步发放,稍后再补刷一次)+ 提示,并清掉 URL 参数。
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('credits')
  if (!status) return
  params.delete('credits')
  const qs = params.toString()
  window.history.replaceState({}, '', window.location.pathname + (qs ? '?' + qs : ''))
  if (status === 'success') {
    toast({ message: t('account.paySuccess'), color: 'success' })
    auth.refreshBalance()
    window.setTimeout(() => auth.refreshBalance(), 3000)
  } else if (status === 'cancel') {
    toast({ message: t('account.payCancel'), color: 'warning' })
  }
})
</script>

<template>
  <!-- 无条件渲染:未登录显示"登录",已登录显示余额(会话恢复完成后自动切换) -->
  <div class="account-widget">
    <template v-if="auth.isLoggedIn">
      <VaDropdown :offset="[6, 0]" placement="bottom-end">
        <template #anchor>
          <button class="account-chip" type="button" :aria-label="t('account.balance')">
            <VaIcon name="account_balance_wallet" size="16px" />
            <span class="account-chip__bal">{{ auth.balance }}</span>
          </button>
        </template>
        <div class="account-menu">
          <div class="account-menu__email">{{ auth.email }}</div>
          <div class="account-menu__row">
            <span>{{ t('account.balance') }}</span>
            <strong>{{ auth.balance }} {{ t('account.credits') }}</strong>
          </div>
          <button class="account-menu__buy" type="button" @click="showBuy = true">
            {{ t('account.buyCredits') }}
          </button>
          <button class="account-menu__logout" type="button" @click="auth.signOut()">
            {{ t('account.logout') }}
          </button>
        </div>
      </VaDropdown>
    </template>

    <template v-else>
      <button class="account-login" type="button" @click="openLogin">
        <VaIcon name="login" size="16px" />
        <span>{{ t('account.login') }}</span>
      </button>
    </template>

    <AuthModal v-model="showLogin" :initial-mode="authMode" />
    <BuyCreditsModal v-model="showBuy" />
  </div>
</template>

<style lang="scss" scoped>
.account-widget {
  display: inline-flex;
  align-items: center;
}

.account-chip,
.account-login {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 18px;
  border: 1px solid var(--va-background-border);
  background: transparent;
  color: var(--va-text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.account-chip:hover,
.account-login:hover {
  border-color: var(--va-primary);
  color: var(--va-primary);
}

.account-chip__bal {
  line-height: 1;
}

.account-menu {
  min-width: 200px;
  padding: 12px;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);

  &__email {
    font-size: 13px;
    color: var(--va-text-secondary);
    word-break: break-all;
    margin-bottom: 8px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 6px 0;
    border-top: 1px solid var(--va-background-border);
  }

  &__logout {
    width: 100%;
    margin-top: 10px;
    padding: 7px 0;
    border-radius: 8px;
    border: 1px solid var(--va-background-border);
    background: transparent;
    color: var(--va-text-primary);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  &__buy {
    width: 100%;
    margin-top: 10px;
    padding: 8px 0;
    border-radius: 8px;
    border: none;
    background: var(--va-primary);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.15s;
  }

  &__buy:hover {
    filter: brightness(1.08);
  }

  &__logout:hover {
    border-color: var(--va-danger);
    color: var(--va-danger);
  }
}
</style>
