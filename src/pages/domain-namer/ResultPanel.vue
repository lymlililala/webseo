<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DomainNamerCtx } from './useDomainNamer'

defineProps<{ ctx: DomainNamerCtx }>()
const { t } = useI18n()
</script>

<template>
  <div>
    <!-- 综合推荐 -->
    <div v-if="ctx.recoShow" class="dn-card dn-reco">
      <div class="dn-reco-h">
        <VaIcon name="explore" size="16px" />
        {{ t('domainNamerPage.recoTitle') }}
      </div>
      <div class="dn-reco-body">{{ ctx.recoText }}</div>
      <VaButton
        v-if="ctx.showMore && ctx.limits.continueRecommend"
        class="dn-go"
        preset="secondary"
        :disabled="ctx.running"
        @click="ctx.continueRecommend()"
      >
        {{ t('domainNamerPage.moreBtn') }}
      </VaButton>
    </div>

    <!-- 结果列表 -->
    <div class="dn-results">
      <div v-for="(rec, i) in ctx.goodRecs" :key="rec.id" class="dn-namecard">
        <div class="dn-nc-top">
          <div>
            <div class="dn-name">
              <span v-if="ctx.arranged" class="dn-rank" :class="{ medal: i < 3 }">{{ ctx.rankLabel(i) }}</span>
              {{ rec.name }}
            </div>
            <div class="dn-reason">{{ rec.reason }}</div>
          </div>
          <span v-if="rec.brand !== 'hidden'" class="dn-brand" :class="rec.brand">
            <template v-if="rec.brand === 'checking'">{{ t('domainNamerPage.brandChecking') }}</template>
            <template v-else-if="rec.brand === 'risk'">{{ t('domainNamerPage.brandClash') }}</template>
            <template v-else-if="rec.brand === 'clear'">{{ t('domainNamerPage.brandClear') }}</template>
            <template v-else>{{ t('domainNamerPage.brandFailed') }}</template>
          </span>
        </div>
        <div class="dn-tldrow">
          <span v-for="(st, dom) in rec.domains" :key="dom" class="dn-dchip" :class="st">
            <span class="dn-dot" :class="st" />
            <span class="dn-tn">{{ dom }}</span>
            <span v-if="st === 'registered' && rec.regYears[dom]" class="dn-traf"
              >· {{ rec.regYears[dom] }}{{ t('domainNamerPage.regYearSuffix') }}</span
            >
            <span v-else-if="st === 'unknown'" class="dn-traf warn">· {{ t('domainNamerPage.unknownTag') }}</span>
          </span>
        </div>
        <div v-if="rec.brand === 'risk'" class="dn-brandhint">
          {{ rec.brandWhy }}<template v-if="rec.brandTitle">：{{ rec.brandTitle }}</template>
          <a v-if="rec.brandLink" href="#" @click.prevent="ctx.openLink(rec.brandLink)">{{
            t('domainNamerPage.viewLink')
          }}</a>
        </div>
      </div>

      <!-- 折叠:已占用 / 撞名 -->
      <div v-if="ctx.arranged && ctx.badRecs.length" class="dn-card dn-badgroup">
        <div class="dn-badhead" @click="ctx.badOpen = !ctx.badOpen">
          {{ ctx.badOpen ? '▾' : '▸' }} {{ t('domainNamerPage.takenGroup', { n: ctx.badRecs.length }) }}
        </div>
        <div v-show="ctx.badOpen" class="dn-badbody">
          <div v-for="rec in ctx.badRecs" :key="rec.id" class="dn-namecard">
            <div class="dn-nc-top">
              <div>
                <div class="dn-name">{{ rec.name }}</div>
                <div class="dn-reason">{{ rec.reason }}</div>
              </div>
              <span v-if="rec.brand !== 'hidden'" class="dn-brand" :class="rec.brand">
                <template v-if="rec.brand === 'risk'">{{ t('domainNamerPage.brandClash') }}</template>
                <template v-else-if="rec.brand === 'clear'">{{ t('domainNamerPage.brandClear') }}</template>
                <template v-else-if="rec.brand === 'checking'">{{ t('domainNamerPage.brandChecking') }}</template>
                <template v-else>{{ t('domainNamerPage.brandFailed') }}</template>
              </span>
            </div>
            <div class="dn-tldrow">
              <span v-for="(st, dom) in rec.domains" :key="dom" class="dn-dchip" :class="st">
                <span class="dn-dot" :class="st" />
                <span class="dn-tn">{{ dom }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="dn-legend">
      <span><span class="dn-dot available" /> {{ t('domainNamerPage.legendAvailable') }}</span>
      <span><span class="dn-dot registered" /> {{ t('domainNamerPage.legendRegistered') }}</span>
      <span><span class="dn-dot unknown" /> {{ t('domainNamerPage.legendUnknown') }}</span>
      <span
        ><span class="dn-brand clear dn-legend-pill">{{ t('domainNamerPage.brandClear') }}</span></span
      >
      <span
        ><span class="dn-brand risk dn-legend-pill">{{ t('domainNamerPage.brandClash') }}</span></span
      >
    </div>
  </div>
</template>
