<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tutorials as localTutorials, type Tutorial } from '../../data/tutorials'
import { tutorialsAPI, SUPABASE_CONFIGURED } from '../../services/supabase'

const route = useRoute()
const router = useRouter()

const tutorial = ref<Tutorial | null>(null)
const loading = ref(true)
const notFound = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  try {
    if (SUPABASE_CONFIGURED) {
      const data = await tutorialsAPI.getById(id)
      if (data) {
        tutorial.value = {
          ...data,
          lessons: data.lessons ?? [],
          duration: data.duration ?? 30,
        } as Tutorial
      } else {
        tutorial.value = localTutorials.find((t) => t.id === id) ?? null
      }
    } else {
      tutorial.value = localTutorials.find((t) => t.id === id) ?? null
    }
  } catch {
    tutorial.value = localTutorials.find((t) => t.id === id) ?? null
  } finally {
    loading.value = false
    if (!tutorial.value) notFound.value = true
  }
})

const categoryMeta: Record<string, { label: string; color: string; icon: string }> = {
  seo: { label: 'SEO', color: '#3B82F6', icon: 'travel_explore' },
  geo: { label: 'GEO', color: '#10B981', icon: 'auto_awesome' },
  aeo: { label: 'AEO', color: '#EC4899', icon: 'question_answer' },
}

const difficultyMeta: Record<string, { label: string; color: string }> = {
  beginner: { label: '初级', color: '#10B981' },
  intermediate: { label: '中级', color: '#F59E0B' },
  advanced: { label: '高级', color: '#EF4444' },
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} 分钟`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} 小时 ${m} 分钟` : `${h} 小时`
}
</script>

<template>
  <div class="tutorial-detail-page">
    <div v-if="loading" class="state-center">
      <VaIcon name="hourglass_empty" size="56px" color="secondary" />
      <p>加载中...</p>
    </div>

    <div v-else-if="notFound" class="state-center">
      <VaIcon name="search_off" size="56px" color="secondary" />
      <p>教程不存在</p>
      <VaButton preset="secondary" @click="router.push({ name: 'tutorials' })">返回教程列表</VaButton>
    </div>

    <template v-else-if="tutorial">
      <!-- Hero -->
      <div class="hero-section">
        <div class="hero-content">
          <button class="back-btn" @click="router.push({ name: 'tutorials' })">
            <VaIcon name="arrow_back" size="16px" />
            返回教程列表
          </button>

          <div class="badges">
            <span
              class="category-badge"
              :style="{
                background: `${categoryMeta[tutorial.category]?.color}22`,
                borderColor: `${categoryMeta[tutorial.category]?.color}55`,
                color: categoryMeta[tutorial.category]?.color,
              }"
            >
              <VaIcon :name="categoryMeta[tutorial.category]?.icon" size="13px" />
              {{ categoryMeta[tutorial.category]?.label }}
            </span>
            <span
              class="difficulty-badge"
              :style="{
                background: `${difficultyMeta[tutorial.difficulty]?.color}22`,
                borderColor: `${difficultyMeta[tutorial.difficulty]?.color}55`,
                color: difficultyMeta[tutorial.difficulty]?.color,
              }"
            >
              {{ difficultyMeta[tutorial.difficulty]?.label }}
            </span>
          </div>

          <h1 class="tutorial-title">{{ tutorial.title }}</h1>
          <p class="tutorial-desc">{{ tutorial.description }}</p>

          <!-- 统计数据 -->
          <div class="tutorial-stats">
            <span class="stat-item">
              <VaIcon name="person" size="14px" />
              讲师：{{ tutorial.instructor }}
            </span>
            <span class="stat-divider">·</span>
            <span class="stat-item">
              <VaIcon name="schedule" size="14px" />
              {{ formatDuration(tutorial.duration) }}
            </span>
            <span class="stat-divider">·</span>
            <span class="stat-item">
              <VaIcon name="menu_book" size="14px" />
              {{ tutorial.lessons.length }} 节课
            </span>
            <span class="stat-divider">·</span>
            <span class="stat-item">
              <VaIcon name="people" size="14px" />
              {{ tutorial.students.toLocaleString() }} 学员
            </span>
            <span class="stat-divider">·</span>
            <span class="stat-item rating">
              <VaIcon name="star" size="14px" color="warning" />
              {{ tutorial.rating }}
            </span>
          </div>

          <div class="tutorial-tags">
            <span v-for="tag in tutorial.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 课程大纲 -->
      <div class="content-wrapper">
        <div class="tutorial-body">
          <!-- 有课程列表时展示大纲 -->
          <template v-if="tutorial.lessons && tutorial.lessons.length > 0">
            <div class="section-header">
              <VaIcon name="format_list_numbered" size="20px" color="primary" />
              <h2>课程大纲</h2>
              <span class="lesson-count">共 {{ tutorial.lessons.length }} 节</span>
            </div>

            <div class="lessons-list">
              <div v-for="lesson in tutorial.lessons" :key="lesson.id" class="lesson-item">
                <div class="lesson-number">{{ lesson.number }}</div>
                <div class="lesson-info">
                  <div class="lesson-title">{{ lesson.title }}</div>
                  <div v-if="lesson.description" class="lesson-desc">{{ lesson.description }}</div>
                </div>
                <div class="lesson-meta">
                  <span class="lesson-level" :class="lesson.level">{{ difficultyMeta[lesson.level]?.label }}</span>
                  <span class="lesson-duration">
                    <VaIcon name="schedule" size="12px" />
                    {{ lesson.duration }} 分钟
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- 无课程列表时显示说明 -->
          <div v-else class="no-lessons">
            <VaIcon name="school" size="48px" color="secondary" />
            <p>课程内容正在整理中，敬请期待</p>
          </div>
        </div>

        <div class="page-footer">
          <VaButton preset="secondary" @click="router.push({ name: 'tutorials' })">
            <VaIcon name="arrow_back" size="16px" />
            返回教程列表
          </VaButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tutorial-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.state-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: var(--va-text-secondary);
}

.hero-section {
  background: linear-gradient(135deg, #1a1535 0%, #2a1f4e 50%, #1a1040 100%);
  padding: 2.4rem 2rem 2rem;
  margin: -1rem -1rem 0 -1rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 1.2rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category-badge,
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 500;
}

.tutorial-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.8rem;
  line-height: 1.3;
}

.tutorial-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1.2rem;
  line-height: 1.6;
}

.tutorial-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

.stat-item.rating {
  color: #fbbf24;
}

.stat-divider {
  color: rgba(255, 255, 255, 0.25);
  font-size: 13px;
}

.tutorial-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

/* ── 课程大纲 ── */
.content-wrapper {
  max-width: 820px;
  margin: 0 auto;
  padding: 2.4rem 1.5rem 3rem;
  width: 100%;
  box-sizing: border-box;
}

.tutorial-body {
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  border-radius: 16px;
  padding: 2rem 2.4rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--va-background-border);
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}

.lesson-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--va-text-secondary);
  background: var(--va-background-element);
  padding: 2px 10px;
  border-radius: 10px;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lesson-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  transition: background 0.15s;
}

.lesson-item:hover {
  background: var(--va-background-element);
}

.lesson-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.lesson-info {
  flex: 1;
  min-width: 0;
}

.lesson-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--va-text-primary);
  line-height: 1.4;
}

.lesson-desc {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 3px;
  line-height: 1.4;
}

.lesson-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.lesson-level {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.lesson-level.beginner {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
}

.lesson-level.intermediate {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
}

.lesson-level.advanced {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.lesson-duration {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--va-text-secondary);
}

.no-lessons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--va-text-secondary);
}

.page-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--va-background-border);
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .tutorial-title {
    font-size: 1.4rem;
  }
  .tutorial-body {
    padding: 1.4rem 1.2rem;
  }
  .content-wrapper {
    padding: 1.4rem 0.8rem 2rem;
  }

  .lesson-meta {
    display: none;
  }
}
</style>
