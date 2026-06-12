<template>
  <div class="w-20 h-12 bg-backgroundElement rounded flex justify-center items-center align-bottom">
    <img v-if="props.type === 'mastercard'" alt="Mastercard Logo" src="./mastercard.png" loading="lazy" />
    <img v-if="props.type === 'visa'" alt="Visa Logo" src="./visa.png" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { PaymentSystemType } from '../types'

const props = defineProps<{
  type: PaymentSystemType
}>()
</script>
