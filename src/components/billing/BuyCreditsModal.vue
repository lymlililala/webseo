<script setup lang="ts">
// 购买积分弹窗 —— 按 plans.js 的 PACKS 自动渲染成卡片,点击发起 Stripe 充值。
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PACKS, CURRENCY, grantedCredits } from '../../config/plans'
import { startCheckout } from '../../services/billing'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const { t } = useI18n()

const loadingId = ref('') // 正在发起结账的 pack id
const error = ref('')

const SYMBOL: Record<string, string> = { usd: '$', cny: '¥', eur: '€', gbp: '£' }
function price(cents: number) {
  const sym = SYMBOL[CURRENCY] || ''
  const n = cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2)
  return `${sym}${n}`
}

async function buy(packId: string) {
  if (loadingId.value) return
  loadingId.value = packId
  error.value = ''
  try {
    await startCheckout(packId) // 成功会跳走,不会回到这里
  } catch (e) {
    error.value = t('account.checkoutError')
    loadingId.value = ''
    void e
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <VaModal :model-value="modelValue" hide-default-actions close-button size="large" @update:modelValue="close">
    <div class="buy-credits">
      <h2 class="buy-credits__title">{{ t('account.buyTitle') }}</h2>
      <p class="buy-credits__desc">{{ t('account.buyDesc') }}</p>

      <div class="buy-credits__grid">
        <div v-for="p in PACKS" :key="p.id" class="pack" :class="{ 'pack--popular': p.popular }">
          <div v-if="p.popular" class="pack__badge">{{ t('account.popular') }}</div>
          <div class="pack__credits">{{ grantedCredits(p) }}</div>
          <div class="pack__unit">{{ t('account.credits') }}</div>
          <div v-if="p.bonus" class="pack__bonus">{{ t('account.bonusSuffix', { n: p.bonus }) }}</div>
          <div class="pack__price">{{ price(p.priceCents) }}</div>
          <VaButton :loading="loadingId === p.id" :disabled="!!loadingId" class="pack__btn" @click="buy(p.id)">
            {{ t('account.buyAction') }}
          </VaButton>
        </div>
      </div>

      <p v-if="error" class="buy-credits__error">{{ error }}</p>
      <p class="buy-credits__note">{{ t('account.buyNote') }}</p>
    </div>
  </VaModal>
</template>

<style lang="scss" scoped>
.buy-credits {
  padding: 4px;

  &__title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: 14px;
    color: var(--va-text-secondary);
    margin-bottom: 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__error {
    color: var(--va-danger);
    font-size: 13px;
    margin-top: 14px;
  }

  &__note {
    font-size: 12px;
    color: var(--va-text-secondary);
    margin-top: 16px;
  }
}

.pack {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px 16px 18px;
  border: 1px solid var(--va-background-border);
  border-radius: 14px;
  background: var(--va-background-element);

  &--popular {
    border-color: var(--va-primary);
    box-shadow: 0 0 0 1px var(--va-primary);
  }

  &__badge {
    position: absolute;
    top: -10px;
    background: var(--va-primary);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 10px;
  }

  &__credits {
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
  }

  &__unit {
    font-size: 13px;
    color: var(--va-text-secondary);
    margin-top: 2px;
  }

  &__bonus {
    font-size: 12px;
    font-weight: 600;
    color: var(--va-success);
    margin-top: 6px;
  }

  &__price {
    font-size: 20px;
    font-weight: 700;
    margin: 12px 0;
  }

  &__btn {
    width: 100%;
  }
}
</style>
