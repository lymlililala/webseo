#!/usr/bin/env python3
"""
从 Supabase 拉取文章、新闻、教程数据，生成含详细条目的 sitemap.xml
"""

import httpx
import re
from datetime import date

SUPABASE_URL = "https://tixgzezefjjsyuzgdhcd.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E"
BASE_URL = "https://sgaindex.com"
SITEMAP_PATH = "/Users/lym/Documents/code/webseo/public/sitemap.xml"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

def fetch_all(table, select="id,title,date,updated_at", order="date.desc"):
    records = []
    offset = 0
    limit = 1000
    while True:
        resp = httpx.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers={**HEADERS, "Prefer": "count=exact"},
            params={"select": select, "order": order, "limit": limit, "offset": offset},
            timeout=20,
        )
        data = resp.json()
        records.extend(data)
        if len(data) < limit:
            break
        offset += limit
    return records

def title_to_slug(title: str) -> str:
    """将中文标题转为 URL 友好的 slug（用拼音首字母或序号兜底）"""
    # 先尝试提取英文/数字部分
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[\s_]+', '-', slug).strip('-')
    # 如果 slug 全是中文（为空或只剩连字符），用 id 的 hash 代替
    if not slug or slug == '-':
        slug = str(abs(hash(title)) % 100000)
    return slug[:80]

def format_date(d):
    if not d:
        return date.today().isoformat()
    return str(d)[:10]

def build_sitemap(articles, news, tutorials):
    urls = []

    # ── 静态页面 ─────────────────────────────────────────────
    static_pages = [
        ("seo-nav",        "1.0", "weekly",  "2026-05-01"),
        ("geo-nav",        "0.9", "weekly",  "2026-05-01"),
        ("aeo-nav",        "0.9", "weekly",  "2026-05-01"),
        ("schema-generator","0.9","weekly",  "2026-05-01"),
        ("ai-checker",     "0.8", "weekly",  "2026-05-01"),
        ("llms-txt",       "0.8", "weekly",  "2026-05-01"),
        ("glossary",       "0.8", "weekly",  "2026-05-01"),
        ("articles",       "0.8", "daily",   "2026-05-01"),
        ("tutorials",      "0.7", "weekly",  "2026-05-01"),
        ("news",           "0.7", "daily",   "2026-05-01"),
        ("faq",            "0.6", "monthly", "2026-05-01"),
    ]
    for path, priority, freq, lastmod in static_pages:
        urls.append(f"""  <url>
    <loc>{BASE_URL}/{path}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    # ── 文章详情（articles?id=xxx 格式）─────────────────────
    for item in articles:
        item_id = item.get("id", "")
        lastmod = format_date(item.get("date") or item.get("updated_at"))
        urls.append(f"""  <url>
    <loc>{BASE_URL}/articles?id={item_id}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>""")

    # ── 新闻详情 ─────────────────────────────────────────────
    for item in news:
        item_id = item.get("id", "")
        lastmod = format_date(item.get("date") or item.get("updated_at"))
        urls.append(f"""  <url>
    <loc>{BASE_URL}/news?id={item_id}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

    # ── 教程详情 ─────────────────────────────────────────────
    for item in tutorials:
        item_id = item.get("id", "")
        lastmod = format_date(item.get("updated_at"))
        urls.append(f"""  <url>
    <loc>{BASE_URL}/tutorials?id={item_id}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

    content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    content += '\n'.join(urls)
    content += '\n</urlset>\n'
    return content

def main():
    print("🔍 从 Supabase 拉取数据...")
    articles  = fetch_all("wseo_articles",  select="id,title,date,updated_at", order="date.desc")
    news      = fetch_all("wseo_news",      select="id,title,date,updated_at", order="date.desc")
    tutorials = fetch_all("wseo_tutorials", select="id,title,updated_at",      order="updated_at.desc")

    print(f"   文章: {len(articles)} 篇")
    print(f"   新闻: {len(news)} 篇")
    print(f"   教程: {len(tutorials)} 篇")

    sitemap = build_sitemap(articles, news, tutorials)

    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(sitemap)

    total = 11 + len(articles) + len(news) + len(tutorials)
    print(f"\n✅ sitemap.xml 已生成，共 {total} 条 URL")
    print(f"   路径：{SITEMAP_PATH}")

if __name__ == "__main__":
    main()
