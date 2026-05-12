# ⚡ Supabase 快速设置 (5分钟)

## 步骤 1️⃣ 创建数据库表

1. 打开 Supabase Dashboard：https://app.supabase.com
2. 进入您的项目 `tixgzezefj`
3. 左侧菜单 → **SQL Editor** → **New Query**
4. 复制 `supabase-schema.sql` 的全部内容
5. 粘贴到编辑器
6. 点击 **Run** 按钮 ✅

---

## 步骤 2️⃣ 插入初始数据

1. 同样在 **SQL Editor** 中新建查询
2. 复制 `supabase-insert-data.sql` 的全部内容
3. 粘贴并执行
4. 完成后会显示验证结果（articles: 4, tutorials: 4, lessons: 7+, news: 6）✅

---

## 步骤 3️⃣ 配置本地环境

1. 项目根目录已有 `.env.local` 文件（包含您的凭证）
2. 确保文件内容如下：

```env
VITE_SUPABASE_URL=https://tixgzezefj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDkzNzgsImV4cCI6MjA5MzcyNTM3OH0.Hpr0F_kgFc9OkOla-UGHBioR6y2OBB2jbI-0xKMU1M4
```

✅ 完成！

---

## 步骤 4️⃣ 启动开发服务器

```bash
npm install
npm run dev
```

✅ 完成！您的网站现在连接到 Supabase 数据库

---

## ✨ 验证成功

打开浏览器访问 `http://localhost:5173`，进入：

- **文章** 页面 → 应该显示 4 篇文章
- **教程** 页面 → 应该显示 4 门课程
- **新闻** 页面 → 应该显示 6 条新闻

---

## 📁 关键文件说明

| 文件                       | 说明                     |
| -------------------------- | ------------------------ |
| `supabase-schema.sql`      | 创建表结构的 SQL 脚本    |
| `supabase-insert-data.sql` | 插入初始数据的 SQL 脚本  |
| `src/services/supabase.ts` | Supabase 客户端和 API 层 |
| `.env.local`               | 环境变量（包含您的凭证） |
| `SUPABASE_SETUP.md`        | 详细文档                 |

---

## 🚨 故障排除

### 表未显示数据？

- 检查 SQL 执行是否成功（查看 Results 或 Error 标签）
- 重新刷新浏览器
- 检查浏览器控制台是否有错误

### 连接错误？

- 确认 `.env.local` 中的 URL 和 API Key 正确
- 检查 Supabase 项目是否在线
- 清除浏览器缓存

### 权限拒绝？

- 所有表都设置为公开读取
- 如需编辑权限，需要配置 RLS 策略

---

## 🎯 下一步

现在可以：

1. **在页面中使用数据库数据**

   ```typescript
   import { articlesAPI } from '@/services/supabase'
   const articles = await articlesAPI.getAll()
   ```

2. **添加新记录**（需要认证）

   ```typescript
   await articlesAPI.create({ ... })
   ```

3. **在 Supabase Dashboard 中实时管理数据**

---

## 📚 更多资源

- 详细文档：[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Supabase 官方文档：https://supabase.com/docs
- 项目 Supabase 服务层：[src/services/supabase.ts](./src/services/supabase.ts)
