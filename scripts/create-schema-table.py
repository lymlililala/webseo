#!/usr/bin/env python3
"""
通过 Python supabase 库 + postgrest-py 执行 DDL 创建 wseo_schema_tools 表
参考 upload-data.py 的成功方式，使用 service role key
"""

import json
import sys
import httpx

# Supabase 配置（使用完整正确的 URL）
SUPABASE_URL = "https://tixgzezefjjsyuzgdhcd.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

# ── 先检查 wseo_schema_tools 是否存在 ──────────────────────
print("🔍 检查 wseo_schema_tools 表是否存在...")
resp = httpx.get(f"{SUPABASE_URL}/rest/v1/wseo_schema_tools?limit=1", headers=headers, timeout=15)
print(f"   状态码: {resp.status_code}")
if resp.status_code == 200:
    print("✅ 表已存在！直接插入数据...")
    table_exists = True
elif resp.status_code == 404 or "PGRST205" in resp.text:
    print("❌ 表不存在，需要创建")
    print(f"   响应: {resp.text[:100]}")
    table_exists = False
else:
    print(f"⚠️  未知状态: {resp.text[:200]}")
    table_exists = False

if not table_exists:
    # ── 方式：通过 Supabase 的 pg 端点执行 SQL ──────────────
    # Supabase 不直接暴露 SQL 执行端点，但可以用 DB Function 来创建表
    # 我们先创建一个临时函数来建表
    
    # 实际上 Supabase service role 并不允许通过 REST API 执行 DDL
    # 最好的方式是：
    # 1. 用 supabase-js 的 `schema` API（不支持 DDL）
    # 2. 用 pg 直连
    # 3. 在 Supabase Dashboard SQL Editor 手动执行
    
    print("\n📋 wseo_schema_tools 表不存在，无法通过 REST API 创建")
    print("   需要在 Supabase SQL Editor 执行以下 SQL：")
    print(f"\n   🔗 https://app.supabase.com/project/tixgzezefjjsyuzgdhcd/sql/new")
    print("\n   复制以下内容并执行:")
    print("─" * 60)
    
    create_sql = """CREATE TABLE IF NOT EXISTS wseo_schema_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  highlights JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  is_free BOOLEAN DEFAULT FALSE,
  has_freeplan BOOLEAN DEFAULT FALSE,
  pricing VARCHAR(100),
  level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'advanced', 'auto')),
  is_official BOOLEAN DEFAULT FALSE,
  badge VARCHAR(100),
  supported_types JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE wseo_schema_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow public read on schema_tools" ON wseo_schema_tools FOR SELECT USING (true);
NOTIFY pgrst, 'reload schema';"""
    print(create_sql)
    print("─" * 60)
    
    print("\n执行后，再次运行此脚本以上传数据")
    sys.exit(1)

# ── 上传 Schema Tools 数据 ──────────────────────────────────
print("\n📤 上传 Schema Tools 数据...")

schema_tools = [
    {
        "tool_id": "merkle",
        "name": "Merkle Schema Generator",
        "url": "https://technicalseo.com/tools/schema-markup-generator/",
        "description": "最受站长欢迎的免费 Schema 生成器，支持 20+ 类型，界面清晰，无需注册即可生成标准 JSON-LD 代码。",
        "highlights": ["免费无需注册", "20+ Schema类型", "即时生成JSON-LD"],
        "tags": ["全能", "免费", "JSON-LD"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "beginner", "is_official": False, "badge": "站长首选",
        "supported_types": ["article", "faq", "product", "breadcrumb", "howto", "video", "localbusiness", "event", "review", "person", "organization"],
    },
    {
        "tool_id": "google-rich-results",
        "name": "Google Rich Results Test",
        "url": "https://search.google.com/test/rich-results",
        "description": "Google 官方出品的富结果验证工具，生成 Schema 代码后必须在此验证，确保符合 Google 索引标准并能获得富结果展示。",
        "highlights": ["Google官方", "验证富结果资格", "实时预览效果"],
        "tags": ["官方验证", "Google", "免费"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "beginner", "is_official": True, "badge": "官方必备",
        "supported_types": ["article", "faq", "product", "breadcrumb", "howto", "video", "recipe", "review", "event"],
    },
    {
        "tool_id": "schema-org-validator",
        "name": "Schema.org Validator",
        "url": "https://validator.schema.org/",
        "description": "Schema.org 官方验证工具，检查结构化数据是否符合 Schema.org 标准规范。",
        "highlights": ["官方标准验证", "支持全部类型", "免费使用"],
        "tags": ["官方", "Schema.org", "验证"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "advanced", "is_official": True, "badge": None, "supported_types": [],
    },
    {
        "tool_id": "saijo-george",
        "name": "Saijo George Schema Generator",
        "url": "https://saijogeorge.com/json-ld-schema-generator/",
        "description": "高人气的在线 Schema 生成器，支持 FAQ、HowTo、Product 等常见类型，生成的代码质量高。",
        "highlights": ["高人气SEO工具", "代码质量高", "免费使用"],
        "tags": ["免费", "FAQ", "HowTo", "Product"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "beginner", "is_official": False, "badge": None,
        "supported_types": ["faq", "howto", "product", "article", "event", "review", "person", "organization"],
    },
    {
        "tool_id": "hall-analysis",
        "name": "Hall Analysis JSON-LD Generator",
        "url": "https://hallanalysis.com/json-ld-generator/",
        "description": "支持多类型 Schema 生成，本地商家和事件类型尤为出色，适合本地 SEO 场景。",
        "highlights": ["本地商家Schema强项", "Event类型出色", "界面简洁"],
        "tags": ["本地SEO", "LocalBusiness", "Event"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "beginner", "is_official": False, "badge": None,
        "supported_types": ["localbusiness", "event", "person", "organization", "product"],
    },
    {
        "tool_id": "whitespark",
        "name": "Whitespark Local Business Schema Generator",
        "url": "https://whitespark.ca/local-business-schema-generator/",
        "description": "专为本地 SEO 优化的 Schema 生成器，LocalBusiness 类型覆盖最完整。",
        "highlights": ["本地SEO专用", "NAP信息完整", "营业时间支持"],
        "tags": ["本地SEO", "LocalBusiness", "NAP"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "beginner", "is_official": False, "badge": "本地SEO首选",
        "supported_types": ["localbusiness"],
    },
    {
        "tool_id": "recipeschema",
        "name": "RecipeSchema.org",
        "url": "https://recipeschema.org/",
        "description": "专为食谱网站设计的 Schema 生成器，Recipe 类型字段覆盖最全。",
        "highlights": ["食谱Schema专家", "营养信息支持", "直达Google富结果"],
        "tags": ["Recipe", "食谱", "免费"],
        "is_free": True, "has_freeplan": False, "pricing": None,
        "level": "beginner", "is_official": False, "badge": None,
        "supported_types": ["recipe"],
    },
    {
        "tool_id": "schema-app",
        "name": "Schema App",
        "url": "https://www.schemaapp.com/",
        "description": "企业级 Schema 管理平台，支持大规模网站自动生成和管理结构化数据。",
        "highlights": ["企业级管理平台", "知识图谱构建", "自动化Schema部署"],
        "tags": ["企业级", "自动化", "知识图谱"],
        "is_free": False, "has_freeplan": True, "pricing": "按需定价",
        "level": "advanced", "is_official": False, "badge": "企业首选",
        "supported_types": ["article", "product", "organization", "person", "event", "faq", "review"],
    },
    {
        "tool_id": "wordlift",
        "name": "WordLift",
        "url": "https://wordlift.io/",
        "description": "AI 驱动的结构化数据平台，自动从内容中识别实体并生成 Schema，构建知识图谱。",
        "highlights": ["AI自动识别实体", "知识图谱构建", "语义SEO增强"],
        "tags": ["AI驱动", "实体识别", "知识图谱", "WordPress"],
        "is_free": False, "has_freeplan": False, "pricing": "月付订阅",
        "level": "auto", "is_official": False, "badge": "AI推荐",
        "supported_types": ["article", "product", "recipe", "event", "person", "organization"],
    },
    {
        "tool_id": "rankmath",
        "name": "Rank Math SEO",
        "url": "https://rankmath.com/",
        "description": "功能最全的 WordPress SEO 插件之一，内置 Schema 生成器支持 20+ 类型。",
        "highlights": ["WordPress最佳SEO插件", "20+ Schema类型", "免费版功能强大"],
        "tags": ["WordPress", "SEO插件", "自动化"],
        "is_free": False, "has_freeplan": True, "pricing": "免费/高级版$6.99/月",
        "level": "auto", "is_official": False, "badge": "WordPress必装",
        "supported_types": ["article", "faq", "product", "breadcrumb", "howto", "video", "recipe", "review", "event", "person", "organization"],
    },
    {
        "tool_id": "yoast",
        "name": "Yoast SEO",
        "url": "https://yoast.com/",
        "description": "WordPress 最流行的 SEO 插件，自动为网站生成基础 Schema，配置简单。",
        "highlights": ["WordPress最流行SEO插件", "自动Schema生成", "入门友好"],
        "tags": ["WordPress", "SEO插件", "自动化", "入门"],
        "is_free": False, "has_freeplan": True, "pricing": "免费/Premium €99/年",
        "level": "auto", "is_official": False, "badge": None,
        "supported_types": ["article", "product", "breadcrumb", "organization", "person", "website"],
    },
]

upsert_headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal",
}

success = 0
failed = 0
# 批量 UPSERT：一次请求发送全部数据
resp = httpx.post(
    f"{SUPABASE_URL}/rest/v1/wseo_schema_tools",
    headers=upsert_headers,
    json=schema_tools,
    timeout=30,
)
if resp.status_code in (200, 201, 204):
    print(f"  ✅ 批量 UPSERT 成功！共 {len(schema_tools)} 条")
    success = len(schema_tools)
else:
    print(f"  ❌ 批量 UPSERT 失败: {resp.status_code} - {resp.text[:300]}")
    print("  ⚙️  尝试逐条 UPSERT...")
    # 逐条 UPSERT（使用 PATCH 按 tool_id 更新）
    for item in schema_tools:
        # 先尝试 PATCH（更新已有记录）
        patch_resp = httpx.patch(
            f"{SUPABASE_URL}/rest/v1/wseo_schema_tools?tool_id=eq.{item['tool_id']}",
            headers=upsert_headers,
            json=item,
            timeout=15,
        )
        if patch_resp.status_code in (200, 201, 204):
            print(f"  ✅ (更新) {item['tool_id']}: {item['name']}")
            success += 1
        else:
            # PATCH 失败则尝试 POST（插入新记录）
            post_resp = httpx.post(
                f"{SUPABASE_URL}/rest/v1/wseo_schema_tools",
                headers=upsert_headers,
                json=item,
                timeout=15,
            )
            if post_resp.status_code in (200, 201, 204):
                print(f"  ✅ (插入) {item['tool_id']}: {item['name']}")
                success += 1
            else:
                print(f"  ❌ {item['tool_id']}: {post_resp.status_code} - {post_resp.text[:100]}")
                failed += 1

print(f"\n📊 结果: 成功 {success}, 失败 {failed}")

# 最终验证
count_resp = httpx.get(
    f"{SUPABASE_URL}/rest/v1/wseo_schema_tools?select=count",
    headers={**upsert_headers, "Prefer": "count=exact"},
    timeout=15,
)
if count_resp.status_code == 200:
    total = count_resp.headers.get("content-range", "unknown")
    print(f"📋 wseo_schema_tools 表当前总行数: {total}")
