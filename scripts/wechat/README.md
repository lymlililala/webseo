# SEO 公众号采集 → 英文文章合成 → 写入 Supabase 流水线（sgaindex.com）

参考 chinatravel 的 `scripts/wechat` 实现，移植到本站（英文 SEO/数字营销工具站，
文章存 Supabase `wseo_articles`，前端 Vue + `marked` 渲染 Markdown）。
**做什么**：从 SEO/数字营销/出海中文公众号采集正文 → DeepSeek 语义聚类 →
多源综合 + 翻译为**原创英文** SEO 常青指南 → 质量闸门 + AI 自评分 → 写入 `wseo_articles`。

> ⚠️ 只在本地跑，绝不上 Vercel（数据中心 IP 会被采集源风控）。

## 完整流水线（顺序跑）

```bash
# 0) 解析 SEO 公众号名 → wxid（一次性，含限频重试）。产物 accounts.json（入库）
node scripts/wechat/accounts.mjs
#    打开 accounts.json 核对带 (非精确匹配) 的项，必要时从 candidates 改 wxid
# 0') 关键词发现更多候选号，人工筛后补进 accounts.mjs
node scripts/wechat/discover.mjs

# 1) 采集历史文章 + 正文（按 sn 去重，增量）。产物 data/sources.json
node scripts/wechat/1-crawl.mjs --max-pages 1          # 试跑省钱
node scripts/wechat/1-crawl.mjs --since 2026-06-01

# 2) DeepSeek 语义聚类（3-6 篇/簇）。产物 data/clusters.json —— 跑完人工审一遍
node scripts/wechat/2-cluster.mjs --days 60 --max-clusters 6

# 3) 逐簇综合 + 翻译为原创英文（含对 wseo_articles 判重）。产物 data/drafts.json
node scripts/wechat/3-synthesize.mjs --limit 2         # 先试 2 篇
node scripts/wechat/3-synthesize.mjs                   # 全部

# 4) 质量闸门 + AI 自评分 → 过线写入 wseo_articles（不过线留 drafts，不入库）
node scripts/wechat/4-publish.mjs --dry-run            # 先只看判定与配图
node scripts/wechat/4-publish.mjs --threshold 80 --max-publish 3
```

## 自动化（GitHub Actions）

两个 workflow（`.github/workflows/`）：

- **`wechat-nightly.yml`** — 每晚北京 22:17 cron（也可手动 `workflow_dispatch` 传参）跑全流程：
  采集→聚类→合成→发布写 `wseo_articles`→触发 Vercel 重建（刷新预渲染 + sitemap）。
  内容存库不入 git，故**不 commit**。`data/` 用 actions/cache 跨运行持久化（增量去重 + 省配图配额）。
- **`verify-cimi.yml`** — 手动跑，确认 Actions 出口 IP 对 cimidata 可用（**首次启用 nightly 前先跑这个**）。

**必须在 GitHub 配 Secrets**（仓库 Settings → Secrets and variables → Actions）：

| Secret | 必填 | 用途 |
|---|---|---|
| `CIMIDATA_APP_ID` / `CIMIDATA_APP_SECRET` | ✅ | 采集 |
| `DEEPSEEK_API_KEY` | ✅ | 聚类/合成/评分 |
| `VITE_SUPABASE_URL` / `SUPABASE_SECRET_KEY` | ✅ | 写库 + 判重 |
| `PEXELS_API_KEY` | 建议 | 配图主源（缺则文章无图） |
| `DEEPSEEK_BASE_URL` / `DEEPSEEK_MODEL` | 可选 | 自定义 DeepSeek 端点/模型 |
| `UNSPLASH_ACCESS_KEY` | 可选 | 配图回退源 |
| `VERCEL_DEPLOY_HOOK` | 建议 | 触发生产构建（预渲染 + sitemap 收录新文） |

> 不配 Secrets / 不 push workflow，则不会自动运行——纯本地跑仍按下方步骤。

## 前置

- Node 20+。脚本除 `@supabase/supabase-js` 外零依赖（原生 fetch）。
- **独立依赖**：本目录有自己的 `package.json` + `node_modules`（隔离主项目依赖冲突）。
  首次：`npm install --prefix scripts/wechat`
- 凭证：
  - `cimidata/.env` — `CIMIDATA_APP_ID` / `CIMIDATA_APP_SECRET`（采集，见 `cimidata/README.md`）
  - `scripts/wechat/.env` — `DEEPSEEK_API_KEY` / `DEEPSEEK_BASE_URL` / `DEEPSEEK_MODEL`、
    `PEXELS_API_KEY`（配图，可选）、`UNSPLASH_ACCESS_KEY`（配图回退，可选）
  - 项目根 `.env.local` — `VITE_SUPABASE_URL` / `SUPABASE_SECRET_KEY`（写库，复用前端那份）

## 与 chinatravel 版的关键差异

| 维度 | chinatravel | 本站（webseo） |
|---|---|---|
| 主题 | 中国旅游 | SEO/数字营销/出海 |
| 发布载体 | `.md` 文件 | Supabase `wseo_articles` |
| category | destination/itinerary… | **seo \| geo \| aeo \| tools**（CHECK 约束） |
| FAQ | frontmatter `faq[]` | 正文 `## FAQ` 段（表无 faq 列） |
| 封面图 | `ogImage` 字段 | 无封面字段，图片内联进 content |
| 草稿 | `draft:true` 写文件 | **不过线不入库**（表无 draft 列），留 drafts 人工放行 |
| 配图 | 中国景点图 + 地名校验 | 通用商务/数据图，严格命中→宽松回退 |
| 内链 | `/tags/*` | `/seo-nav` `/geo-nav` `/glossary` `/articles` 等真实路由 |

## 主题方向（种子名单 & 发现关键词覆盖）

Google SEO/技术优化、外贸独立站/跨境、出海/增长媒体、数字营销/运营、SEO 工具/AI。
当前 `accounts.json` 28 个可采集号；`discover.mjs` 候选池见 `data/discovered-accounts.json`。

## 质量与合规设计

- **多源综合 + 翻译为原创英文**（每篇综合 3-6 篇中文源重组），非逐篇翻译/洗稿。
- **判重**（`lib/dedup.mjs`）：合成前查 `wseo_articles` 的 slug/title + LLM 近似判重，
  实质重复的选题直接跳过（省合成费 + 防伤 SEO）。
- **双闸门**（`lib/quality.mjs` + AI 自评分）：套话指纹 / 正文 <7000 字符 / FAQ <2 对 /
  残留中文 / 缺内链 → 不过线；AI 评分 < 阈值（识别幻觉/捏造数据）→ 不过线。
- **不过线不入库**：表无 draft 列，低质文绝不写库；留 `data/drafts.json` + `published.json`
  记录，人工复核后可手动放行。
- **provenance**：`drafts.json` / `published.json` 记录每篇由哪些源文 URL 合成，备查与合规追溯；
  源正文只落本地 `data/`、不入文章、不外传。

## 文件

```
scripts/wechat/
├── cimidata/         采集 API 客户端（零依赖）
├── deepseek.mjs      DeepSeek 客户端（OpenAI 兼容，JSON 容错）
├── lib/
│   ├── env.mjs        共享 .env 加载 + DATA_DIR / ACCOUNTS_FILE
│   ├── clean-html.mjs 正文 HTML → 纯文本
│   ├── slug.mjs       slug 生成 + 唯一性
│   ├── sources.mjs    源文本地 JSON 持久化（data/sources.json）
│   ├── supabase.mjs   Supabase 客户端（读根 .env.local，写 wseo_articles）
│   ├── dedup.mjs      合成前对 wseo_articles 判重
│   ├── quality.mjs    英文指纹/薄内容/FAQ/内链闸门
│   └── images.mjs     Pexels/Unsplash 按关键词配图（严格命中→宽松回退）
├── accounts.mjs      0) SEO 公众号 → 解析 wxid
├── discover.mjs      0') 关键词发现候选号
├── 1-crawl.mjs       1) 采集
├── 2-cluster.mjs     2) 聚类（SEO 主题）
├── 3-synthesize.mjs  3) 中→英原创合成
├── 4-publish.mjs     4) 质量闸门 + 写入 wseo_articles
├── accounts.json     0) 产物（入库，供复核/CI）
├── package.json      独立依赖声明
└── data/             产物（gitignored）
```
