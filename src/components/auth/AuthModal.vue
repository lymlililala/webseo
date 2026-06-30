<script setup lang="ts">
// 登录弹窗 —— 邮箱魔法链接(免密)。发送后提示查收邮箱;点邮件链接回跳本页即完成登录。
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth-store'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const { t } = useI18n()
const auth = useAuthStore()

const email = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref('')

function close() {
  emit('update:modelValue', false)
  // 延迟复位,避免关闭动画期间内容跳变
  window.setTimeout(() => {
    sent.value = false
    error.value = ''
    sending.value = false
  }, 200)
}

async function submit() {
  const e = email.value.trim()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
    error.value = t('account.invalidEmail')
    return
  }
  sending.value = true
  error.value = ''
  const { error: err } = await auth.signInWithEmail(e)
  sending.value = false
  if (err) {
    error.value = err.message
    return
  }
  sent.value = true
}
</script>

<template>
  <VaModal :model-value="modelValue" hide-default-actions close-button @update:modelValue="close">
    <div class="auth-modal">
      <template v-if="!sent">
        <h2 class="auth-modal__title">{{ t('account.loginTitle') }}</h2>
        <p class="auth-modal__desc">{{ t('account.loginDesc') }}</p>
        <VaInput
          v-model="email"
          type="email"
          :label="t('account.emailLabel')"
          class="auth-modal__input"
          @keyup.enter="submit"
        />
        <p v-if="error" class="auth-modal__error">{{ error }}</p>
        <VaButton :loading="sending" class="auth-modal__btn" @click="submit">{{ t('account.sendLink') }}</VaButton>
      </template>
      <template v-else>
        <h2 class="auth-modal__title">{{ t('account.linkSent') }}</h2>
        <p class="auth-modal__desc">{{ t('account.linkSentDesc', { email }) }}</p>
        <VaButton preset="secondary" class="auth-modal__btn" @click="close">{{ t('account.close') }}</VaButton>
      </template>
    </div>
  </VaModal>
</template>

<style lang="scss" scoped>
.auth-modal {
  max-width: 380px;
  padding: 4px 4px 8px;

  &__title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  &__desc {
    font-size: 14px;
    color: var(--va-text-secondary);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  &__input {
    width: 100%;
    margin-bottom: 8px;
  }

  &__error {
    color: var(--va-danger);
    font-size: 13px;
    margin: 4px 0 8px;
  }

  &__btn {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
