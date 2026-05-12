#!/usr/bin/env python3
"""
解析 neirong/ 目录下的四个 Markdown 文件，分别上传到 Supabase 对应的表
- zh-news-batch.md       → wseo_news         (20 篇)
- zh-tutorials-batch.md  → wseo_tutorials     (15 篇)
- zh-casestudies-batch.md→ wseo_articles      (10 篇, category=geo)
- zh-comparisons-batch.md→ wseo_articles      (8 篇,  category=seo)
"""

import re
import httpx
import json
from datetime import date, timedelta
import random

SUPABASE_URL = "https://tixgzezefjjsyuzgdhcd.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal",
}

BASE_DIR = "/Users/lym/Documents/code/webseo/neirong"

# ── 工具函数 ─────────────────────────────────────────────────────────

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def estimate_read_time(content):
    """按 300 字/分钟估算阅读时间"""
    words = len(content.replace(" ", ""))
    return max(3, round(words / 300))

def upsert(table, records):
    """批量 upsert 到指定表，返回 (成功数, 失败数)"""
    ok = 0
    fail = 0
    for rec in records:
        resp = httpx.post(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            json=rec,
            timeout=20,
        )
        if resp.status_code in (200, 201, 204):
            ok += 1
        else:
            print(f"  ❌ 失败 [{table}]: {resp.status_code} - {resp.text[:200]}")
            fail += 1
    return ok, fail

# 递减日期生成器（从今天往前推）
def gen_dates(n, start_days_ago=10):
    base = date(2026, 5, 1)
    return [(base - timedelta(days=start_days_ago + i * 7)).isoformat() for i in range(n)]

# ── 1. 解析 zh-news-batch.md → wseo_news ────────────────────────────

def parse_news(text):
    # 按 "## <a id=" 切分
    parts = re.split(r'\n## <a id="article-\d+"></a>', text)
    records = []
    dates = gen_dates(20, start_days_ago=0)

    # 标签映射（根据标题关键词自动分配 category）
    def guess_category(title):
        t = title.lower()
        if any(k in t for k in ["schema", "结构化", "rich result", "markup"]):
            return "aeo"
        if any(k in t for k in ["geo", "生成式", "perplexity", "llm", "llms", "ai可见", "ai overview", "ai搜索", "chatgpt", "claude", "deepseek", "kimi", "豆包", "openai", "anthropic", "meta ai", "bing copilot", "mcp"]):
            return "geo"
        if any(k in t for k in ["seo", "google", "排名", "搜索", "e-e-a-t", "wordpress", "ahrefs", "semrush"]):
            return "seo"
        return "ai"

    def guess_impact(title):
        t = title.lower()
        high_kw = ["50%", "340%", "3倍", "5倍", "翻倍", "破亿", "10亿", "超万", "必须", "必选"]
        if any(k in t for k in high_kw):
            return "high"
        if any(k in t for k in ["新机会", "新特性", "新方向", "值得", "更新", "超越"]):
            return "medium"
        return "medium"

    for i, part in enumerate(parts[1:], 1):  # 跳过目录部分
        lines = part.strip().split("\n")
        # 第一行是标题（去掉序号）
        raw_title = lines[0].strip()
        title = re.sub(r'^\d+\.\s*', '', raw_title)

        # 提取发布时间和标签行
        pub_match = re.search(r'\*\*发布时间[：:]\s*(.+?)\s*\|.*?标签[：:]\s*(.+?)\*\*', part)
        pub_date = dates[i - 1]
        tags = []
        if pub_match:
            date_str = pub_match.group(1).strip()
            tag_str = pub_match.group(2).strip()
            tags = [t.strip() for t in tag_str.split("、") if t.strip()]
            # 尝试解析日期
            m = re.search(r'(\d{4})年(\d+)月', date_str)
            if m:
                pub_date = f"{m.group(1)}-{int(m.group(2)):02d}-01"

        # 提取导语（### 导语 下面的段落）
        desc_match = re.search(r'### 导语\n+(.+?)(?:\n\n|\n###)', part, re.DOTALL)
        if desc_match:
            description = desc_match.group(1).strip()[:300]
        else:
            # 取正文第一段
            paras = [l.strip() for l in part.split("\n\n") if l.strip() and not l.startswith("#") and not l.startswith("**")]
            description = paras[0][:300] if paras else title

        category = guess_category(title)
        impact = guess_impact(title)

        records.append({
            "title": title,
            "description": description,
            "content": part.strip(),
            "category": category,
            "source": "SGAIndex编辑部",
            "date": pub_date,
            "impact": impact,
            "tags": tags[:5],
            "link": None,
        })

    return records

# ── 2. 解析 zh-tutorials-batch.md → wseo_tutorials ──────────────────

def parse_tutorials(text):
    # 按 "## 教程X：" 切分
    parts = re.split(r'\n## (教程[一二三四五六七八九十]+[：:].+)', text)
    records = []

    # 难度映射
    diff_map = {
        "新手": "beginner", "入门": "beginner", "基础": "beginner",
        "进阶": "intermediate", "中级": "intermediate",
        "高级": "advanced", "深度": "advanced", "实战": "intermediate",
    }

    def guess_difficulty(title, content):
        t = (title + content[:200]).lower()
        for k, v in diff_map.items():
            if k in t:
                return v
        # 教程序号靠后的难度更高
        return "intermediate"

    def guess_category(title):
        t = title.lower()
        if any(k in t for k in ["schema", "结构化", "rich result", "product schema", "article schema", "faq schema"]):
            return "aeo"
        if any(k in t for k in ["geo", "生成式", "llms.txt", "ai可见", "ai搜索", "话题权威", "chatgpt", "perplexity", "deepseek", "豆包", "ai爬虫"]):
            return "geo"
        return "seo"

    titles = []
    contents = []
    for j in range(1, len(parts), 2):
        titles.append(parts[j].strip())
        contents.append(parts[j + 1].strip() if j + 1 < len(parts) else "")

    tag_pool = {
        "geo": ["GEO", "AI优化", "生成式引擎"],
        "aeo": ["AEO", "Schema", "结构化数据"],
        "seo": ["SEO", "内容优化", "搜索引擎"],
    }

    for i, (title, content) in enumerate(zip(titles, contents)):
        # 去掉"教程X："前缀作为干净标题
        clean_title = re.sub(r'^教程[一二三四五六七八九十]+[：:]\s*', '', title)
        category = guess_category(clean_title)
        difficulty = guess_difficulty(clean_title, content)

        # 提取简介（### 简介 或第一段）
        intro_match = re.search(r'### 简介\n+(.+?)(?:\n\n|\n###)', content, re.DOTALL)
        if intro_match:
            description = intro_match.group(1).strip()[:400]
        else:
            paras = [l.strip() for l in content.split("\n\n") if l.strip() and not l.startswith("#")]
            description = paras[0][:400] if paras else clean_title

        duration = estimate_read_time(content) * 3  # 教程时长 = 阅读时间 * 3
        tags = tag_pool.get(category, ["SEO"])[:3]

        records.append({
            "title": clean_title,
            "description": description,
            "category": category,
            "instructor": "SGAIndex团队",
            "difficulty": difficulty,
            "duration": duration,
            "students": random.randint(80, 500),
            "rating": round(random.uniform(4.5, 5.0), 1),
            "tags": tags,
        })

    return records

# ── 3. 解析 zh-casestudies-batch.md → wseo_articles ─────────────────

def parse_casestudies(text):
    parts = re.split(r'\n## (案例[一二三四五六七八九十]+[：:].+)', text)
    records = []
    dates = gen_dates(10, start_days_ago=14)

    for j in range(1, len(parts), 2):
        title_raw = parts[j].strip()
        content = parts[j + 1].strip() if j + 1 < len(parts) else ""
        clean_title = re.sub(r'^案例[一二三四五六七八九十]+[：:]\s*', '', title_raw)

        # 提取背景段作为 description
        bg_match = re.search(r'### 背景\n+(.+?)(?:\n\n|\n###)', content, re.DOTALL)
        if bg_match:
            description = bg_match.group(1).strip()[:400]
        else:
            paras = [l.strip() for l in content.split("\n\n") if l.strip() and not l.startswith("#")]
            description = paras[0][:400] if paras else clean_title

        idx = (j - 1) // 2
        records.append({
            "title": clean_title,
            "description": description,
            "content": content,
            "author": "SGAIndex编辑部",
            "date": dates[idx],
            "category": "geo",
            "tags": ["案例研究", "GEO", "AI优化"],
            "read_time": estimate_read_time(content),
        })

    return records

# ── 4. 解析 zh-comparisons-batch.md → wseo_articles ─────────────────

def parse_comparisons(text):
    parts = re.split(r'\n## (对比[一二三四五六七八九十]+[：:].+)', text)
    records = []
    dates = gen_dates(8, start_days_ago=21)

    def guess_cat(title):
        t = title.lower()
        if any(k in t for k in ["schema", "结构化"]):
            return "aeo"
        if any(k in t for k in ["geo", "llms", "ai可见", "生成式"]):
            return "geo"
        return "seo"

    for j in range(1, len(parts), 2):
        title_raw = parts[j].strip()
        content = parts[j + 1].strip() if j + 1 < len(parts) else ""
        clean_title = re.sub(r'^对比[一二三四五六七八九十]+[：:]\s*', '', title_raw)

        # 提取概述段作为 description
        desc_match = re.search(r'### 概述\n+(.+?)(?:\n\n|\n###)', content, re.DOTALL)
        if desc_match:
            description = desc_match.group(1).strip()[:400]
        else:
            paras = [l.strip() for l in content.split("\n\n") if l.strip() and not l.startswith("#")]
            description = paras[0][:400] if paras else clean_title

        idx = (j - 1) // 2
        category = guess_cat(clean_title)
        records.append({
            "title": clean_title,
            "description": description,
            "content": content,
            "author": "SGAIndex编辑部",
            "date": dates[idx],
            "category": category,
            "tags": ["对比评测", "工具横评"],
            "read_time": estimate_read_time(content),
        })

    return records

# ── 主流程 ────────────────────────────────────────────────────────────

def main():
    total_ok = 0
    total_fail = 0

    # 1. 新闻
    print("\n📰 上传 zh-news-batch.md → wseo_news ...")
    news_text = read_file(f"{BASE_DIR}/zh-news-batch.md")
    news_records = parse_news(news_text)
    print(f"   解析到 {len(news_records)} 篇新闻")
    ok, fail = upsert("wseo_news", news_records)
    print(f"   ✅ 成功 {ok} / ❌ 失败 {fail}")
    total_ok += ok; total_fail += fail

    # 2. 教程
    print("\n📚 上传 zh-tutorials-batch.md → wseo_tutorials ...")
    tut_text = read_file(f"{BASE_DIR}/zh-tutorials-batch.md")
    tut_records = parse_tutorials(tut_text)
    print(f"   解析到 {len(tut_records)} 篇教程")
    ok, fail = upsert("wseo_tutorials", tut_records)
    print(f"   ✅ 成功 {ok} / ❌ 失败 {fail}")
    total_ok += ok; total_fail += fail

    # 3. 案例研究
    print("\n📊 上传 zh-casestudies-batch.md → wseo_articles (category=geo) ...")
    case_text = read_file(f"{BASE_DIR}/zh-casestudies-batch.md")
    case_records = parse_casestudies(case_text)
    print(f"   解析到 {len(case_records)} 篇案例")
    ok, fail = upsert("wseo_articles", case_records)
    print(f"   ✅ 成功 {ok} / ❌ 失败 {fail}")
    total_ok += ok; total_fail += fail

    # 4. 对比评测
    print("\n🔍 上传 zh-comparisons-batch.md → wseo_articles ...")
    cmp_text = read_file(f"{BASE_DIR}/zh-comparisons-batch.md")
    cmp_records = parse_comparisons(cmp_text)
    print(f"   解析到 {len(cmp_records)} 篇对比")
    ok, fail = upsert("wseo_articles", cmp_records)
    print(f"   ✅ 成功 {ok} / ❌ 失败 {fail}")
    total_ok += ok; total_fail += fail

    print(f"\n{'='*50}")
    print(f"📦 全部完成！总计 成功 {total_ok} 条 / 失败 {total_fail} 条")

    # 验证行数
    print("\n📋 数据库行数验证：")
    for table in ["wseo_news", "wseo_tutorials", "wseo_articles"]:
        r = httpx.get(
            f"{SUPABASE_URL}/rest/v1/{table}?select=count",
            headers={**HEADERS, "Prefer": "count=exact"},
            timeout=15,
        )
        cr = r.headers.get("content-range", "?")
        print(f"   {table}: {cr}")

if __name__ == "__main__":
    main()
