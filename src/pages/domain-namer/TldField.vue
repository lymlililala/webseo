<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DomainNamerCtx } from './useDomainNamer'

defineProps<{ ctx: DomainNamerCtx }>()
const { t } = useI18n()
</script>

<template>
  <div>
    <label class="dn-label">{{ t('domainNamerPage.tldLabel') }}</label>
    <div class="dn-tldbar">
      <span
        v-for="(tld, i) in ctx.tlds"
        :key="tld.ext"
        class="dn-tld"
        :class="{ on: tld.on }"
        @click="ctx.toggleTld(i)"
      >
        {{ tld.ext }}
        <span v-if="tld.custom" class="dn-x" @click.stop="ctx.delTld(i)">×</span>
      </span>
    </div>
    <div class="dn-tldadd">
      <input
        v-model="ctx.tldInput"
        class="dn-input"
        :placeholder="t('domainNamerPage.tldAddPlaceholder')"
        @keydown.enter="ctx.addTld()"
      />
      <VaButton preset="secondary" @click="ctx.addTld()">{{ t('domainNamerPage.tldAddBtn') }}</VaButton>
    </div>
  </div>
</template>
