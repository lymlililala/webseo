<script setup lang="ts">
// 账户弹窗 —— 邮箱+密码,四种模式:登录 / 注册 / 忘记密码 / 设置新密码。
// 设置新密码(reset)由重置邮件回跳触发(auth.recoveryMode),其余由用户切换。
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth-store'

type Mode = 'login' | 'signup' | 'forgot' | 'reset'

const props = defineProps<{ modelValue: boolean; initialMode?: Mode }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const { t } = useI18n()
const auth = useAuthStore()

const mode = ref<Mode>(props.initialMode ?? 'login')
const email = ref('')
const password = ref('')
const confirm = ref('')
const busy = ref(false)
const error = ref('')
const done = ref('') // 非空时显示成功提示文案(如"查收邮件")

// 每次打开弹窗:复位到指定模式并清空
watch(
  () => props.modelValue,
  (open) => {
    if (open) reset(props.initialMode ?? 'login')
  },
)

function reset(m: Mode) {
  mode.value = m
  password.value = ''
  confirm.value = ''
  busy.value = false
  error.value = ''
  done.value = ''
}

function close() {
  emit('update:modelValue', false)
  if (auth.recoveryMode) auth.clearRecovery()
}

function validEmail(e: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)
}

async function submit() {
  error.value = ''

  if (mode.value === 'reset') {
    if (password.value.length < 6) return (error.value = t('account.pwTooShort'))
    if (password.value !== confirm.value) return (error.value = t('account.pwMismatch'))
    busy.value = true
    const { error: err } = await auth.updatePassword(password.value)
    busy.value = false
    if (err) return (error.value = err.message)
    close()
    return
  }

  if (!validEmail(email.value.trim())) return (error.value = t('account.invalidEmail'))
  const e = email.value.trim()

  if (mode.value === 'forgot') {
    busy.value = true
    const { error: err } = await auth.sendPasswordReset(e)
    busy.value = false
    if (err) return (error.value = err.message)
    done.value = t('account.resetSent', { email: e })
    return
  }

  if (mode.value === 'signup') {
    if (password.value.length < 6) return (error.value = t('account.pwTooShort'))
    if (password.value !== confirm.value) return (error.value = t('account.pwMismatch'))
    busy.value = true
    const { data, error: err } = await auth.signUp(e, password.value)
    busy.value = false
    if (err) return (error.value = err.message)
    if (data.session)
      close() // 未开邮箱确认 → 直接登录
    else done.value = t('account.signupConfirm', { email: e }) // 需确认邮件
    return
  }

  // login
  busy.value = true
  const { error: err } = await auth.signInWithPassword(e, password.value)
  busy.value = false
  if (err) return (error.value = t('account.loginFailed'))
  close()
}
</script>

<template>
  <VaModal :model-value="modelValue" hide-default-actions close-button @update:modelValue="close">
    <div class="auth-modal">
      <!-- 成功提示态(查收邮件等) -->
      <template v-if="done">
        <h2 class="auth-modal__title">{{ t('account.checkInbox') }}</h2>
        <p class="auth-modal__desc">{{ done }}</p>
        <VaButton preset="secondary" class="auth-modal__btn" @click="close">{{ t('account.close') }}</VaButton>
      </template>

      <template v-else>
        <h2 class="auth-modal__title">
          {{
            mode === 'signup'
              ? t('account.signupTitle')
              : mode === 'forgot'
                ? t('account.forgotTitle')
                : mode === 'reset'
                  ? t('account.resetTitle')
                  : t('account.loginTitlePw')
          }}
        </h2>

        <!-- 邮箱(reset 模式不需要,已有会话) -->
        <VaInput
          v-if="mode !== 'reset'"
          v-model="email"
          type="email"
          :label="t('account.emailLabel')"
          class="auth-modal__input"
          @keyup.enter="submit"
        />

        <!-- 密码(forgot 模式不需要) -->
        <VaInput
          v-if="mode !== 'forgot'"
          v-model="password"
          type="password"
          :label="mode === 'reset' ? t('account.newPassword') : t('account.passwordLabel')"
          class="auth-modal__input"
          @keyup.enter="submit"
        />

        <!-- 确认密码(注册 / 设置新密码) -->
        <VaInput
          v-if="mode === 'signup' || mode === 'reset'"
          v-model="confirm"
          type="password"
          :label="t('account.confirmPassword')"
          class="auth-modal__input"
          @keyup.enter="submit"
        />

        <p v-if="error" class="auth-modal__error">{{ error }}</p>

        <VaButton :loading="busy" class="auth-modal__btn" @click="submit">
          {{
            mode === 'signup'
              ? t('account.signUp')
              : mode === 'forgot'
                ? t('account.sendReset')
                : mode === 'reset'
                  ? t('account.updatePassword')
                  : t('account.signIn')
          }}
        </VaButton>

        <!-- 模式切换链接 -->
        <div v-if="mode !== 'reset'" class="auth-modal__links">
          <template v-if="mode === 'login'">
            <a href="#" @click.prevent="reset('forgot')">{{ t('account.forgotLink') }}</a>
            <span
              >{{ t('account.noAccount') }}
              <a href="#" @click.prevent="reset('signup')">{{ t('account.signUp') }}</a></span
            >
          </template>
          <template v-else>
            <span
              >{{ t('account.haveAccount') }}
              <a href="#" @click.prevent="reset('login')">{{ t('account.signIn') }}</a></span
            >
          </template>
        </div>
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
    margin-bottom: 14px;
  }

  &__desc {
    font-size: 14px;
    color: var(--va-text-secondary);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  &__input {
    width: 100%;
    margin-bottom: 12px;
  }

  &__error {
    color: var(--va-danger);
    font-size: 13px;
    margin: 0 0 8px;
  }

  &__btn {
    width: 100%;
    margin-top: 4px;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    font-size: 13px;
    color: var(--va-text-secondary);

    a {
      color: var(--va-primary);
      font-weight: 600;
    }
  }
}
</style>
