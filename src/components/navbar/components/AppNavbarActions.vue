<template>
  <div class="app-navbar-actions"></div>
</template>

<script lang="ts" setup>
defineProps({
  isMobile: { type: Boolean, default: false },
})
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;
}
</style>
