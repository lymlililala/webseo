# Supabase 数据库设置指南

## 📋 概览

本项目使用 Supabase 存储文章、教程、新闻等动态内容。所有表都以 `wseo_` 前缀命名，避免与现有表冲突。

---

## 🚀 快速开始

### 1. 创建数据库表

登录 [Supabase Dashboard](https://app.supabase.com)，进入 SQL Editor：

```bash
# 复制 supabase-schema.sql 的全部内容
# 粘贴到 Supabase SQL Editor
# 执行
```

**或者使用 psql 直接连接：**

```bash
# 获取您的数据库连接字符串
# 在 Supabase Dashboard → Database → Connection Strings → URI

psql "your_connection_string" < supabase-schema.sql
```

### 2. 插入初始数据

同样在 SQL Editor 中执行 `supabase-insert-data.sql`：

```bash
# 复制 supabase-insert-data.sql 全部内容
# 粘贴到 SQL Editor
# 执行
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 并填入您的 Supabase 凭证：

```env
VITE_SUPABASE_URL=https://tixgzezefj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. 安装依赖

```bash
npm install --legacy-peer-deps @supabase/supabase-js
# 或
npm install @supabase/supabase-js
```

---

## 📊 数据库表结构

### wseo_articles - 文章表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR(255) | 文章标题 |
| description | TEXT | 简短描述 |
| content | TEXT | 完整内容 |
| author | VARCHAR(100) | 作者 |
| date | DATE | 发布日期 |
| category | VARCHAR(50) | 分类：seo\|geo\|aeo\|tools |
| tags | JSONB | 标签数组 |
| read_time | INTEGER | 阅读时间（分钟） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### wseo_tutorials - 教程表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR(255) | 课程标题 |
| description | TEXT | 课程描述 |
| category | VARCHAR(50) | 分类：seo\|geo\|aeo |
| instructor | VARCHAR(100) | 讲师名称 |
| difficulty | VARCHAR(50) | 难度：beginner\|intermediate\|advanced |
| duration | INTEGER | 总时长（分钟） |
| students | INTEGER | 学生数 |
| rating | NUMERIC(3,1) | 评分（1-5） |
| tags | JSONB | 标签数组 |
| created_at | TIMESTAMP | 创建时间 |

### wseo_tutorial_lessons - 课程课时表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| tutorial_id | UUID | 课程 ID（外键） |
| lesson_number | INTEGER | 课节号 |
| title | VARCHAR(255) | 课节标题 |
| description | TEXT | 课节描述 |
| duration | INTEGER | 课节时长（分钟） |
| level | VARCHAR(50) | 难度级别 |
| created_at | TIMESTAMP | 创建时间 |

### wseo_news - 新闻表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR(255) | 新闻标题 |
| description | TEXT | 简短描述 |
| content | TEXT | 完整内容 |
| category | VARCHAR(50) | 分类：seo\|geo\|aeo\|ai\|industry |
| source | VARCHAR(100) | 新闻来源 |
| date | DATE | 发布日期 |
| impact | VARCHAR(50) | 影响程度：high\|medium\|low |
| tags | JSONB | 标签数组 |
| link | VARCHAR(500) | 外链 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### wseo_seo_tools, wseo_geo_tools, wseo_aeo_tools - 工具表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(255) | 工具名称 |
| description | TEXT | 工具描述 |
| category | VARCHAR(100) | 工具分类 |
| price | VARCHAR(50) | 价格：free\|paid\|freemium |
| url | VARCHAR(500) | 工具链接 |
| rating | NUMERIC(3,1) | 评分（1-5） |
| tags | JSONB | 标签数组 |
| created_at | TIMESTAMP | 创建时间 |

---

## 🔌 使用 API

### 在 Vue 组件中使用

```typescript
import { articlesAPI, tutorialsAPI, newsAPI } from '@/services/supabase'

// 获取所有文章
const articles = await articlesAPI.getAll()

// 按分类获取
const seoArticles = await articlesAPI.getByCategory('seo')

// 搜索
const results = await articlesAPI.search('AI搜索')

// 创建新文章（需要认证）
await articlesAPI.create({
  title: '新文章',
  description: '...',
  content: '...',
  author: 'Your Name',
  date: new Date().toISOString().split('T')[0],
  category: 'seo',
  tags: JSON.stringify(['tag1', 'tag2']),
  read_time: 10
})
```

### 可用的 API 方法

#### articlesAPI
- `getAll()` - 获取所有文章
- `getById(id)` - 按 ID 获取
- `getByCategory(category)` - 按分类获取
- `search(query)` - 搜索
- `create(article)` - 创建
- `update(id, updates)` - 更新
- `delete(id)` - 删除

#### tutorialsAPI
- `getAll()` - 获取所有课程
- `getById(id)` - 按 ID 获取（包含课时）
- `getByCategory(category)` - 按分类获取
- `getByDifficulty(difficulty)` - 按难度获取
- `create(tutorial)` - 创建
- `update(id, updates)` - 更新
- `delete(id)` - 删除

#### newsAPI
- `getAll()` - 获取所有新闻
- `getById(id)` - 按 ID 获取
- `getByCategory(category)` - 按分类获取
- `getByImpact(impact)` - 按影响度获取
- `search(query)` - 搜索
- `create(newsItem)` - 创建
- `update(id, updates)` - 更新
- `delete(id)` - 删除

#### seoToolsAPI, geoToolsAPI, aeoToolsAPI
- `getAll()` - 获取所有工具
- `search(query)` - 搜索
- 工具表为只读（可根据需要添加写操作）

---

## 🔐 行级安全 (RLS) 策略

目前所有表都设置为允许公开读取。如果需要添加写入权限，可以：

1. 在 Supabase Dashboard → Authentication → Users 中创建用户
2. 更新 RLS 策略以支持认证用户的写操作

示例策略（允许认证用户创建文章）：

```sql
CREATE POLICY "Authenticated users can insert articles" 
ON wseo_articles 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
```

---

## 🐛 常见问题

### 问题 1：连接超时
- 检查 `.env.local` 中的 URL 和 API Key 是否正确
- 验证 Supabase 项目是否在线

### 问题 2：RLS 拒绝访问
- 默认情况下，表是只读的
- 需要创建相应的 RLS 策略来启用写操作

### 问题 3：JSON 字段查询
使用 JSONB 操作符进行高级查询：

```sql
-- 按标签搜索
SELECT * FROM wseo_articles 
WHERE tags @> '["AI"]'::jsonb;
```

---

## 📝 迁移现有数据

如果要将静态数据文件（articles.ts 等）迁移到数据库，运行：

```bash
npm run migrate:supabase
```

（需要在 package.json 中配置此脚本）

---

## 🔄 更新数据

### 方式 1：直接在 Supabase Dashboard 中编辑
进入 Table Editor，直接修改数据

### 方式 2：使用 SQL
在 SQL Editor 中执行 UPDATE 语句

### 方式 3：通过代码 API
使用 `articlesAPI.update(id, updates)` 等方法

---

## 📞 获取帮助

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)
- [本项目 Supabase 服务](./src/services/supabase.ts)
