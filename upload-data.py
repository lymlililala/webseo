#!/usr/bin/env python3
"""
Supabase Data Upload Script
自动上传数据到 Supabase 数据库
"""

import json
import sys
from datetime import datetime

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ 缺少 supabase 依赖，请运行: pip install supabase")
    sys.exit(1)

# Supabase 配置
SUPABASE_URL = "https://tixgzezefjjsyuzgdhcd.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E"

def print_status(status, message):
    """打印状态信息"""
    icons = {
        "info": "ℹ️",
        "success": "✅",
        "error": "❌",
        "warning": "⚠️",
    }
    print(f"{icons.get(status, '📝')} {message}")

def upload_data():
    """上传所有数据"""
    try:
        # 初始化 Supabase 客户端（使用 service role key 绕过 RLS）
        print_status("info", "正在连接 Supabase...")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        print_status("success", "Supabase 连接成功")

        # =====================================================================
        # 验证已有数据
        # =====================================================================
        print_status("info", "📊 检查现有数据...")
        for table in ['wseo_articles', 'wseo_tutorials', 'wseo_news', 'wseo_seo_tools', 'wseo_geo_tools', 'wseo_aeo_tools']:
            try:
                count = len(supabase.table(table).select("id").execute().data)
                print(f"  ✅ {table}: {count} 行")
            except Exception as e:
                print(f"  ❌ {table}: {e}")

        # =====================================================================
        # 上传 Schema Tools
        # =====================================================================
        print_status("info", "🔧 开始上传 Schema Tools 数据...")

        schema_tools = [
            {
                "tool_id": "merkle",
                "name": "Merkle Schema Generator",
                "url": "https://technicalseo.com/tools/schema-markup-generator/",
                "description": "最受站长欢迎的免费 Schema 生成器，支持 20+ 类型，界面清晰，无需注册即可生成标准 JSON-LD 代码。",
                "highlights": ["免费无需注册", "20+ Schema类型", "即时生成JSON-LD"],
                "tags": ["全能", "免费", "JSON-LD"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "beginner",
                "is_official": False,
                "badge": "站长首选",
                "supported_types": ["article", "faq", "product", "breadcrumb", "howto", "video", "localbusiness", "event", "review", "person", "organization"],
            },
            {
                "tool_id": "google-rich-results",
                "name": "Google Rich Results Test",
                "url": "https://search.google.com/test/rich-results",
                "description": "Google 官方出品的富结果验证工具，生成 Schema 代码后必须在此验证，确保符合 Google 索引标准并能获得富结果展示。",
                "highlights": ["Google官方", "验证富结果资格", "实时预览效果"],
                "tags": ["官方验证", "Google", "免费"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "beginner",
                "is_official": True,
                "badge": "官方必备",
                "supported_types": ["article", "faq", "product", "breadcrumb", "howto", "video", "recipe", "review", "event"],
            },
            {
                "tool_id": "schema-org-validator",
                "name": "Schema.org Validator",
                "url": "https://validator.schema.org/",
                "description": "Schema.org 官方验证工具，检查结构化数据是否符合 Schema.org 标准规范，适合对标准合规性要求较高的场景。",
                "highlights": ["官方标准验证", "支持全部类型", "免费使用"],
                "tags": ["官方", "Schema.org", "验证"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "advanced",
                "is_official": True,
                "badge": None,
                "supported_types": [],
            },
            {
                "tool_id": "saijo-george",
                "name": "Saijo George Schema Generator",
                "url": "https://saijogeorge.com/json-ld-schema-generator/",
                "description": "高人气的在线 Schema 生成器，支持 FAQ、HowTo、Product 等常见类型，生成的代码质量高，深受 SEO 从业者欢迎。",
                "highlights": ["高人气SEO工具", "代码质量高", "免费使用"],
                "tags": ["免费", "FAQ", "HowTo", "Product"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "beginner",
                "is_official": False,
                "badge": None,
                "supported_types": ["faq", "howto", "product", "article", "event", "review", "person", "organization"],
            },
            {
                "tool_id": "hall-analysis",
                "name": "Hall Analysis JSON-LD Generator",
                "url": "https://hallanalysis.com/json-ld-generator/",
                "description": "支持多类型 Schema 生成，界面简洁，本地商家 (LocalBusiness) 和事件 (Event) 类型尤为出色，适合本地 SEO 场景。",
                "highlights": ["本地商家Schema强项", "Event类型出色", "界面简洁"],
                "tags": ["本地SEO", "LocalBusiness", "Event"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "beginner",
                "is_official": False,
                "badge": None,
                "supported_types": ["localbusiness", "event", "person", "organization", "product"],
            },
            {
                "tool_id": "whitespark",
                "name": "Whitespark Local Business Schema Generator",
                "url": "https://whitespark.ca/local-business-schema-generator/",
                "description": "专为本地 SEO 优化的 Schema 生成器，LocalBusiness 类型覆盖最完整，包含 NAP 信息、营业时间、服务区域等字段。",
                "highlights": ["本地SEO专用", "NAP信息完整", "营业时间支持"],
                "tags": ["本地SEO", "LocalBusiness", "NAP"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "beginner",
                "is_official": False,
                "badge": "本地SEO首选",
                "supported_types": ["localbusiness"],
            },
            {
                "tool_id": "recipeschema",
                "name": "RecipeSchema.org",
                "url": "https://recipeschema.org/",
                "description": "专为食谱网站设计的 Schema 生成器，Recipe 类型字段覆盖最全，支持营养信息、食材、步骤等所有关键字段，可直接获得 Google 富结果。",
                "highlights": ["食谱Schema专家", "营养信息支持", "直达Google富结果"],
                "tags": ["Recipe", "食谱", "免费"],
                "is_free": True,
                "has_freeplan": False,
                "pricing": None,
                "level": "beginner",
                "is_official": False,
                "badge": None,
                "supported_types": ["recipe"],
            },
            {
                "tool_id": "schema-app",
                "name": "Schema App",
                "url": "https://www.schemaapp.com/",
                "description": "企业级 Schema 管理平台，支持大规模网站自动生成和管理结构化数据，提供 Schema 审计、知识图谱构建和富结果追踪功能。",
                "highlights": ["企业级管理平台", "知识图谱构建", "自动化Schema部署"],
                "tags": ["企业级", "自动化", "知识图谱"],
                "is_free": False,
                "has_freeplan": True,
                "pricing": "按需定价",
                "level": "advanced",
                "is_official": False,
                "badge": "企业首选",
                "supported_types": ["article", "product", "organization", "person", "event", "faq", "review"],
            },
            {
                "tool_id": "wordlift",
                "name": "WordLift",
                "url": "https://wordlift.io/",
                "description": "AI 驱动的结构化数据平台，自动从内容中识别实体并生成 Schema，构建知识图谱，提升 E-E-A-T 和语义 SEO 表现。",
                "highlights": ["AI自动识别实体", "知识图谱构建", "语义SEO增强"],
                "tags": ["AI驱动", "实体识别", "知识图谱", "WordPress"],
                "is_free": False,
                "has_freeplan": False,
                "pricing": "月付订阅",
                "level": "auto",
                "is_official": False,
                "badge": "AI推荐",
                "supported_types": ["article", "product", "recipe", "event", "person", "organization"],
            },
            {
                "tool_id": "rankmath",
                "name": "Rank Math SEO",
                "url": "https://rankmath.com/",
                "description": "功能最全的 WordPress SEO 插件之一，内置 Schema 生成器支持 20+ 类型，自动为文章和页面添加适合的结构化数据，免费版已够用。",
                "highlights": ["WordPress最佳SEO插件", "20+ Schema类型", "免费版功能强大"],
                "tags": ["WordPress", "SEO插件", "自动化"],
                "is_free": False,
                "has_freeplan": True,
                "pricing": "免费/高级版$6.99/月",
                "level": "auto",
                "is_official": False,
                "badge": "WordPress必装",
                "supported_types": ["article", "faq", "product", "breadcrumb", "howto", "video", "recipe", "review", "event", "person", "organization"],
            },
            {
                "tool_id": "yoast",
                "name": "Yoast SEO",
                "url": "https://yoast.com/",
                "description": "WordPress 最流行的 SEO 插件，自动为网站生成基础 Schema（Website、WebPage、Article 等），配置简单，适合入门用户和内容团队。",
                "highlights": ["WordPress最流行SEO插件", "自动Schema生成", "入门友好"],
                "tags": ["WordPress", "SEO插件", "自动化", "入门"],
                "is_free": False,
                "has_freeplan": True,
                "pricing": "免费/Premium €99/年",
                "level": "auto",
                "is_official": False,
                "badge": None,
                "supported_types": ["article", "product", "breadcrumb", "organization", "person", "website"],
            },
        ]

        # 逐条上传（upsert 通过 tool_id 去重）
        success = 0
        failed = 0
        for item in schema_tools:
            try:
                supabase.table("wseo_schema_tools").upsert(item, on_conflict="tool_id").execute()
                print(f"  ✅ {item['tool_id']}: {item['name']}")
                success += 1
            except Exception as e:
                print(f"  ❌ {item['tool_id']}: {e}")
                failed += 1

        print_status("success", f"Schema Tools 上传完成: 成功 {success}, 失败 {failed}")

        # =====================================================================
        # 验证所有数据
        # =====================================================================
        print_status("info", "📊 验证最终数据...")
        tables = ['wseo_articles', 'wseo_tutorials', 'wseo_tutorial_lessons', 'wseo_news',
                  'wseo_seo_tools', 'wseo_geo_tools', 'wseo_aeo_tools', 'wseo_schema_tools']
        print("\n" + "="*60)
        print("📊 数据库数据统计")
        print("="*60)
        for table in tables:
            try:
                count = len(supabase.table(table).select("id").execute().data)
                print(f"  ✅ {table}: {count} 行")
            except Exception as e:
                print(f"  ❌ {table}: {e}")
        print("="*60 + "\n")

    except Exception as e:
        print_status("error", f"上传失败: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    upload_data()
