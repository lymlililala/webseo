#!/bin/bash

# Supabase 数据上传脚本（通过 HTTP REST API）

SUPABASE_URL="https://tixgzezefj.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDkzNzgsImV4cCI6MjA5MzcyNTM3OH0.Hpr0F_kgFc9OkOla-UGHBioR6y2OBB2jbI-0xKMU1M4"

echo "✅ Supabase REST API 数据上传开始..."
echo ""

# ============================================================================
# 1. 上传文章
# ============================================================================
echo "📄 正在上传文章..."

curl -s -X POST "$SUPABASE_URL/rest/v1/wseo_articles" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "2026 年 SEO 趋势：AI 搜索对传统 SEO 的冲击",
      "description": "AI 搜索引擎的崛起正在改变整个搜索生态。与其说是替代，不如说是补充和演进。",
      "content": "AI 搜索引擎的崛起正在改变整个搜索生态。\n\n关键变化：\n1. 答案驱动优化\n2. E-E-A-T 重要性上升\n3. 结构化数据与 JSON-LD",
      "author": "张三",
      "date": "2026-05-10",
      "category": "seo",
      "tags": ["AI搜索", "GEO", "AEO", "2026趋势"],
      "read_time": 8
    },
    {
      "title": "GEO（生成式引擎优化）完全指南",
      "description": "详解什么是 GEO，如何针对 ChatGPT、Perplexity、Google AI Overview 进行网站优化。",
      "content": "GEO 是 Generative Engine Optimization 的缩写。\n\nGEO 与 SEO 的区别：\n- 目标引擎\n- 优化目标\n- 关键指标",
      "author": "李四",
      "date": "2026-05-08",
      "category": "geo",
      "tags": ["GEO指南", "生成式搜索", "品牌可见度"],
      "read_time": 12
    },
    {
      "title": "AEO 答案引擎优化：为 AI 对话设计内容",
      "description": "深度解析 AEO 的定义、应用场景和实战优化技巧。",
      "content": "AEO（Answer Engine Optimization）专注于优化内容以适应对话式 AI。\n\n核心层面：\n1. 内容层面\n2. 技术层面\n3. 用户意图层面",
      "author": "王五",
      "date": "2026-05-05",
      "category": "aeo",
      "tags": ["AEO", "对话AI", "答案优化", "结构化数据"],
      "read_time": 10
    },
    {
      "title": "使用 llms.txt 让 AI 更了解你的网站",
      "description": "详解 llms.txt 文件规范和实现方式，提升网站在 AI 系统中的可见度。",
      "content": "llms.txt 是一个新兴的标准文件。\n\n优势：\n1. 提高 AI 理解\n2. 品牌一致性\n3. 内容优先级",
      "author": "赵六",
      "date": "2026-05-01",
      "category": "tools",
      "tags": ["llms.txt", "AI元数据", "网站优化"],
      "read_time": 6
    }
  ]' > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ 成功上传 4 篇文章"
else
  echo "❌ 文章上传失败"
fi

# ============================================================================
# 2. 上传教程
# ============================================================================
echo "📚 正在上传教程..."

curl -s -X POST "$SUPABASE_URL/rest/v1/wseo_tutorials" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "SEO 基础入门：从 0 到 1",
      "description": "适合完全入门者的 SEO 课程。",
      "category": "seo",
      "instructor": "张三",
      "difficulty": "beginner",
      "duration": 240,
      "students": 5230,
      "rating": 4.8,
      "tags": ["SEO基础", "关键词", "页面优化", "技术SEO"]
    },
    {
      "title": "GEO 生成式引擎优化实战课程",
      "description": "学习如何针对 ChatGPT、Perplexity、Google AI Overview 等生成式引擎进行网站优化。",
      "category": "geo",
      "instructor": "李四",
      "difficulty": "intermediate",
      "duration": 180,
      "students": 2840,
      "rating": 4.9,
      "tags": ["GEO", "AI搜索", "品牌可见度", "结构化数据"]
    },
    {
      "title": "AEO 答案引擎优化与对话 AI",
      "description": "掌握 AEO 核心技能。",
      "category": "aeo",
      "instructor": "王五",
      "difficulty": "advanced",
      "duration": 195,
      "students": 1920,
      "rating": 4.7,
      "tags": ["AEO", "对话AI", "结构化数据", "llms.txt"]
    },
    {
      "title": "高级 SEO：数据分析与实验驱动优化",
      "description": "深入学习如何用数据和 A/B 测试驱动 SEO 决策。",
      "category": "seo",
      "instructor": "赵六",
      "difficulty": "advanced",
      "duration": 220,
      "students": 1560,
      "rating": 4.9,
      "tags": ["高级SEO", "数据分析", "GA4", "实验驱动"]
    }
  ]' > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ 成功上传 4 门教程"
else
  echo "❌ 教程上传失败"
fi

# ============================================================================
# 3. 上传新闻
# ============================================================================
echo "📰 正在上传新闻..."

curl -s -X POST "$SUPABASE_URL/rest/v1/wseo_news" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "Google 推出 AI Overview 更新，网站流量影响深远",
      "description": "Google 宣布在更多市场部署 AI Overview。",
      "content": "Google AI Overview 的大规模推出标志着搜索生态的重大转变。",
      "category": "seo",
      "source": "SearchEngineJournal",
      "date": "2026-05-10",
      "impact": "high",
      "tags": ["Google", "AI Overview", "SEO", "搜索生态"],
      "link": "https://example.com/google-ai-overview-update"
    },
    {
      "title": "OpenAI ChatGPT 新增网络搜索功能",
      "description": "ChatGPT 用户现在可以在对话中进行实时网络搜索。",
      "content": "OpenAI 在 ChatGPT 中集成了网络搜索能力。",
      "category": "geo",
      "source": "OpenAI Blog",
      "date": "2026-05-08",
      "impact": "high",
      "tags": ["ChatGPT", "GEO", "网络搜索", "OpenAI"],
      "link": "https://example.com/chatgpt-search"
    },
    {
      "title": "llms.txt 规范获得行业支持，多家平台承诺兼容",
      "description": "Perplexity、You.com 等 AI 搜索引擎宣布支持 llms.txt 标准。",
      "content": "llms.txt 规范的推出获得了广泛的行业支持。",
      "category": "aeo",
      "source": "TechCrunch",
      "date": "2026-05-05",
      "impact": "high",
      "tags": ["llms.txt", "AEO", "行业标准", "网站元数据"],
      "link": "https://example.com/llms-txt-support"
    },
    {
      "title": "Perplexity 推出企业 API，B2B 平台可直接集成",
      "description": "用户现在可以在 B2B 应用中集成 Perplexity 的搜索和 AI 功能。",
      "content": "Perplexity 发布企业级 API。",
      "category": "geo",
      "source": "Perplexity",
      "date": "2026-05-01",
      "impact": "medium",
      "tags": ["Perplexity", "API", "B2B", "企业搜索"],
      "link": "https://example.com/perplexity-api"
    },
    {
      "title": "谷歌确认：页面体验信号下调，内容质量优先级提升",
      "description": "Google 官方宣布调整排名因素权重。",
      "content": "Google 的最新算法更新反映了搜索行业的长期演变方向。",
      "category": "seo",
      "source": "Google SearchCentral",
      "date": "2026-04-28",
      "impact": "high",
      "tags": ["Google", "算法更新", "E-E-A-T", "排名因素"],
      "link": "https://example.com/google-algorithm-update"
    },
    {
      "title": "微软 Copilot 新增企业搜索功能",
      "description": "Microsoft Copilot 现在可以从企业内部数据源和公网进行搜索。",
      "content": "Microsoft 扩展了 Copilot 的搜索能力。",
      "category": "ai",
      "source": "Microsoft Blog",
      "date": "2026-04-25",
      "impact": "medium",
      "tags": ["Microsoft", "Copilot", "企业搜索", "AI"],
      "link": "https://example.com/copilot-enterprise-search"
    }
  ]' > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ 成功上传 6 条新闻"
else
  echo "❌ 新闻上传失败"
fi

echo ""
echo "============================================================"
echo "✅ 数据上传完成！"
echo "============================================================"
echo "📄 文章：4 篇"
echo "📚 教程：4 门"
echo "📰 新闻：6 条"
echo "============================================================"
echo ""
echo "✨ 您现在可以："
echo "1. 在 Supabase Dashboard 中查看数据"
echo "2. 运行 npm run dev 启动本地开发服务器"
echo "3. 访问 http://localhost:5173 查看网站"
