<script setup lang="ts">
defineProps<{
  count?: number
  variant?: 'card' | 'list' | 'line'
}>()

const defaultCount = {
  card: 6,
  list: 3,
  line: 5,
}
</script>

<template>
  <div v-if="variant === 'card' || !variant" class="skeleton-grid">
    <div v-for="i in count ?? defaultCount.card" :key="i" class="skeleton-card">
      <div class="skeleton skeleton-header"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
      <div class="skeleton skeleton-tags">
        <div class="skeleton skeleton-tag"></div>
        <div class="skeleton skeleton-tag"></div>
      </div>
    </div>
  </div>

  <div v-else-if="variant === 'list'" class="skeleton-list">
    <div v-for="i in count ?? defaultCount.list" :key="i" class="skeleton-item">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line" style="width: 70%"></div>
      </div>
    </div>
  </div>

  <div v-else-if="variant === 'line'" class="skeleton-lines">
    <div v-for="i in count ?? defaultCount.line" :key="i" class="skeleton-line-item">
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line" style="width: 85%"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--va-background-element) 0%,
    var(--va-background-border) 50%,
    var(--va-background-element) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
}

.skeleton-header {
  height: 12px;
  width: 40%;
}

.skeleton-title {
  height: 20px;
  width: 100%;
}

.skeleton-text {
  height: 14px;
  width: 100%;
}

.skeleton-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.skeleton-tag {
  height: 20px;
  width: 50px;
  border-radius: 4px;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 8px;
}

.skeleton-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.skeleton-line {
  height: 12px;
  width: 100%;
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-line-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 8px;
}

@media (max-width: 900px) {
  .skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 600px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
