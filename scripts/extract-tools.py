#!/usr/bin/env python3
"""
从 TypeScript 数据文件中提取工具数据，转换为 JSON 格式
"""

import json
import re
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def read_ts_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_string(content, key, start_pos):
    """从指定位置提取 key: 'value' 或 key: "value" 的值"""
    # 匹配单引号或双引号
    pattern = rf"{re.escape(key)}:\s*['\"]([^'\"]*)['\"]"
    match = re.search(pattern, content[start_pos:start_pos+2000])
    if match:
        return match.group(1)
    return None

def parse_tools_from_ts(content):
    """通用 TypeScript 工具对象解析器"""
    tools = []
    # 找到所有 { id: '...', name: '...', ... } 形式的工具对象
    # 使用括号深度追踪来提取完整对象
    i = 0
    while i < len(content):
        # 找到以 id: 开头的对象
        match = re.search(r'\{\s*\n?\s*id:\s*[\'"]', content[i:])
        if not match:
            break
        start = i + match.start()
        # 找到对应的结束括号
        depth = 0
        end = start
        for j, ch in enumerate(content[start:], start):
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = j
                    break
        obj_text = content[start:end+1]
        tools.append(obj_text)
        i = end + 1
    return tools

def extract_value(obj_text, key):
    """从对象文本中提取字段值"""
    # 处理字符串值（单引号或双引号）
    patterns = [
        rf'\b{re.escape(key)}:\s*\'((?:[^\'\\]|\\.)*)\'',
        rf'\b{re.escape(key)}:\s*"((?:[^"\\]|\\.)*)"',
        rf'\b{re.escape(key)}:\s*`((?:[^`\\]|\\.)*)`',
    ]
    for p in patterns:
        m = re.search(p, obj_text, re.DOTALL)
        if m:
            return m.group(1).replace("\\'", "'").replace('\\"', '"')
    
    # 处理布尔值
    bool_pattern = rf'\b{re.escape(key)}:\s*(true|false)\b'
    m = re.search(bool_pattern, obj_text)
    if m:
        return m.group(1) == 'true'
    
    # 处理数字
    num_pattern = rf'\b{re.escape(key)}:\s*(\d+(?:\.\d+)?)\b'
    m = re.search(num_pattern, obj_text)
    if m:
        return float(m.group(1)) if '.' in m.group(1) else int(m.group(1))
    
    return None

def extract_array(obj_text, key):
    """从对象文本中提取数组字段"""
    pattern = rf'\b{re.escape(key)}:\s*\['
    m = re.search(pattern, obj_text)
    if not m:
        return []
    
    start = m.end() - 1  # 括号位置
    depth = 0
    end = start
    for i, ch in enumerate(obj_text[start:], start):
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                end = i
                break
    
    arr_text = obj_text[start+1:end]
    # 提取字符串元素
    items = re.findall(r"['\"]([^'\"]+)['\"]", arr_text)
    return items

# ══════════════════════════════════════════════════════════
# 解析 SEO Tools
# ══════════════════════════════════════════════════════════
print("📦 提取 SEO Tools...")

seo_content = read_ts_file(os.path.join(ROOT, 'src/data/seo-tools.ts'))

# 提取分类信息
category_pattern = r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"],\s*description:\s*[\'"]([^\'"]+)[\'"]'
categories_raw = []

# 找到 seoCategories 数组
sc_match = re.search(r'export const seoCategories[^=]*=\s*\[', seo_content)
if sc_match:
    # 从这个位置开始解析
    start_idx = sc_match.end()
    # 提取分类 id -> name 映射
    cat_id_name = {}
    for cm in re.finditer(r"id:\s*'([\w-]+)'.*?name:\s*'([^']+)'", seo_content[start_idx:start_idx+50000], re.DOTALL):
        # 只取第一次出现的分类（不含工具）
        pass

# 更简单的方法：直接扫描文件中所有工具对象
# 先建立 category id -> name 映射（分类对象有 icon 和 color 字段）
cat_map = {}
for cm in re.finditer(r"id:\s*'([\w-]+)',\s*name:\s*'([^']+)',\s*description:\s*'[^']*',\s*icon:", seo_content):
    cat_map[cm.group(1)] = cm.group(2)

print(f"  发现 {len(cat_map)} 个分类: {list(cat_map.keys())}")

# 提取工具：找到所有有 isFree/hasApi/isAiFriendly 字段的对象
seo_rows = []
# 使用更精确的正则，匹配工具对象（以 id 开始，包含特有的 isAiFriendly 字段）
tool_pattern = re.compile(
    r"\{\s*id:\s*'([\w-]+)',\s*"
    r"name:\s*'([^']+)',\s*"
    r"description:\s*'((?:[^'\\]|\\.)*)',\s*"
    r"url:\s*'([^']+)',\s*"
    r"tags:\s*\[((?:[^\]]*?))\],\s*"
    r"isFree:\s*(true|false),\s*"
    r"hasApi:\s*(true|false),\s*"
    r"isAiFriendly:\s*(true|false)",
    re.DOTALL
)

# 找到每个工具的分类
# 方法：扫描文件，记录每个工具之前最近的分类
lines = seo_content.split('\n')
current_cat = 'unknown'
current_cat_name = 'Unknown'

for i, line in enumerate(lines):
    # 检测分类开始（有 icon: 的对象）
    if "icon:" in line and i > 0:
        # 向前找 id:
        for j in range(i-1, max(0, i-10), -1):
            id_match = re.search(r"id:\s*'([\w-]+)'", lines[j])
            if id_match:
                cat_id = id_match[1]
                if cat_id in cat_map:
                    current_cat = cat_id
                    current_cat_name = cat_map[cat_id]
                break

for m in tool_pattern.finditer(seo_content):
    tool_id = m.group(1)
    name = m.group(2)
    description = m.group(3).replace("\\'", "'")
    url = m.group(4)
    tags_raw = m.group(5)
    tags = re.findall(r"'([^']+)'", tags_raw)
    is_free = m.group(6) == 'true'
    has_api = m.group(7) == 'true'
    is_ai_friendly = m.group(8) == 'true'

    # 找到工具所在的分类
    tool_pos = m.start()
    cat_id = 'unknown'
    cat_name = 'Unknown'
    # 向前扫描找最近的分类 id
    prefix = seo_content[:tool_pos]
    for cm in re.finditer(r"id:\s*'([\w-]+)',\s*name:\s*'([^']+)',\s*description:\s*'[^']*',\s*icon:", prefix):
        cat_id = cm.group(1)
        cat_name = cm.group(2)

    seo_rows.append({
        'tool_id': tool_id,
        'name': name,
        'description': description,
        'url': url,
        'category': cat_id,
        'category_name': cat_name,
        'tags': tags,
        'is_free': is_free,
        'has_api': has_api,
        'is_ai_friendly': is_ai_friendly,
        'price': 'free' if is_free else 'paid',
    })

# 去重
seen_ids = set()
unique_seo = []
for row in seo_rows:
    if row['tool_id'] not in seen_ids:
        seen_ids.add(row['tool_id'])
        unique_seo.append(row)

with open(os.path.join(DATA_DIR, 'seo-tools.json'), 'w', encoding='utf-8') as f:
    json.dump(unique_seo, f, ensure_ascii=False, indent=2)
print(f"  ✅ {len(unique_seo)} 条 SEO 工具 → data/seo-tools.json")


# ══════════════════════════════════════════════════════════
# 解析 GEO Tools
# ══════════════════════════════════════════════════════════
print("\n📦 提取 GEO Tools...")

geo_content = read_ts_file(os.path.join(ROOT, 'src/data/geo-tools.ts'))

# GEO 工具有 region 和 isFree/hasFreeplan/isOpenSource/hasApi 字段
geo_tool_pattern = re.compile(
    r"\{\s*id:\s*'([\w-]+)',\s*"
    r"name:\s*'([^']+)',\s*"
    r"(?:nameEn:\s*'([^']*)',\s*)?"
    r"description:\s*\n?\s*'((?:[^'\\]|\\.)*)',\s*"
    r"url:\s*'([^']+)',",
    re.DOTALL
)

geo_rows = []
for m in geo_tool_pattern.finditer(geo_content):
    tool_id = m.group(1)
    name = m.group(2)
    name_en = m.group(3) or None
    description = m.group(4).replace("\\'", "'").replace('\\n', '\n').strip()
    url = m.group(5)

    # 提取工具后续字段
    rest = geo_content[m.end():m.end()+1500]

    tags = re.findall(r"'([^']+)'", (re.search(r'tags:\s*\[(.*?)\]', rest, re.DOTALL) or re.match('', '')).group(0) if re.search(r'tags:\s*\[(.*?)\]', rest, re.DOTALL) else '')
    is_free_m = re.search(r'isFree:\s*(true|false)', rest)
    is_free = is_free_m.group(1) == 'true' if is_free_m else False
    has_free_m = re.search(r'hasFreeplan:\s*(true|false)', rest)
    has_free = has_free_m.group(1) == 'true' if has_free_m else False
    is_open_m = re.search(r'isOpenSource:\s*(true|false)', rest)
    is_open = is_open_m.group(1) == 'true' if is_open_m else False
    has_api_m = re.search(r'hasApi:\s*(true|false)', rest)
    has_api = has_api_m.group(1) == 'true' if has_api_m else False
    region_m = re.search(r"region:\s*'(cn|global)'", rest)
    region = region_m.group(1) if region_m else 'global'
    featured_m = re.search(r'featured:\s*(true|false)', rest)
    featured = featured_m.group(1) == 'true' if featured_m else False
    pricing_m = re.search(r"pricing:\s*'([^']+)'", rest)
    pricing = pricing_m.group(1) if pricing_m else None

    # 找所在分类
    prefix = geo_content[:m.start()]
    cat_id = 'unknown'
    cat_name = 'Unknown'
    for cm in re.finditer(r"id:\s*'([\w-]+)',\s*name:\s*'([^']+)',\s*icon:", prefix):
        cat_id = cm.group(1)
        cat_name = cm.group(2)

    geo_rows.append({
        'tool_id': tool_id,
        'name': name,
        'name_en': name_en,
        'description': description,
        'url': url,
        'category': cat_id,
        'category_name': cat_name,
        'tags': tags,
        'is_free': is_free,
        'has_free_plan': has_free,
        'is_open_source': is_open,
        'has_api': has_api,
        'pricing': pricing,
        'region': region,
        'featured': featured,
        'price': 'free' if is_free else ('freemium' if has_free else 'paid'),
    })

# 去重
seen_ids = set()
unique_geo = []
for row in geo_rows:
    if row['tool_id'] not in seen_ids:
        seen_ids.add(row['tool_id'])
        unique_geo.append(row)

with open(os.path.join(DATA_DIR, 'geo-tools.json'), 'w', encoding='utf-8') as f:
    json.dump(unique_geo, f, ensure_ascii=False, indent=2)
print(f"  ✅ {len(unique_geo)} 条 GEO 工具 → data/geo-tools.json")


# ══════════════════════════════════════════════════════════
# 解析 AEO Tools
# ══════════════════════════════════════════════════════════
print("\n📦 提取 AEO Tools...")

aeo_content = read_ts_file(os.path.join(ROOT, 'src/data/aeo-tools.ts'))

# AEO 工具和 GEO 工具结构类似
aeo_rows = []
for m in geo_tool_pattern.finditer(aeo_content):
    tool_id = m.group(1)
    name = m.group(2)
    name_en = m.group(3) or None
    description = m.group(4).replace("\\'", "'").replace('\\n', '\n').strip()
    url = m.group(5)

    rest = aeo_content[m.end():m.end()+1500]

    tags_m = re.search(r'tags:\s*\[(.*?)\]', rest, re.DOTALL)
    tags = re.findall(r"'([^']+)'", tags_m.group(0)) if tags_m else []

    is_free_m = re.search(r'isFree:\s*(true|false)', rest)
    is_free = is_free_m.group(1) == 'true' if is_free_m else False
    has_free_m = re.search(r'hasFreeplan:\s*(true|false)', rest)
    has_free = has_free_m.group(1) == 'true' if has_free_m else False
    is_open_m = re.search(r'isOpenSource:\s*(true|false)', rest)
    is_open = is_open_m.group(1) == 'true' if is_open_m else False
    has_api_m = re.search(r'hasApi:\s*(true|false)', rest)
    has_api = has_api_m.group(1) == 'true' if has_api_m else False
    featured_m = re.search(r'featured:\s*(true|false)', rest)
    featured = featured_m.group(1) == 'true' if featured_m else False
    pricing_m = re.search(r"pricing:\s*'([^']+)'", rest)
    pricing = pricing_m.group(1) if pricing_m else None

    prefix = aeo_content[:m.start()]
    cat_id = 'unknown'
    cat_name = 'Unknown'
    for cm in re.finditer(r"id:\s*'([\w-]+)',\s*name:\s*'([^']+)',\s*icon:", prefix):
        cat_id = cm.group(1)
        cat_name = cm.group(2)

    aeo_rows.append({
        'tool_id': tool_id,
        'name': name,
        'name_en': name_en,
        'description': description,
        'url': url,
        'category': cat_id,
        'category_name': cat_name,
        'tags': tags,
        'is_free': is_free,
        'has_free_plan': has_free,
        'is_open_source': is_open,
        'has_api': has_api,
        'pricing': pricing,
        'featured': featured,
        'price': 'free' if is_free else ('freemium' if has_free else 'paid'),
    })

seen_ids = set()
unique_aeo = []
for row in aeo_rows:
    if row['tool_id'] not in seen_ids:
        seen_ids.add(row['tool_id'])
        unique_aeo.append(row)

with open(os.path.join(DATA_DIR, 'aeo-tools.json'), 'w', encoding='utf-8') as f:
    json.dump(unique_aeo, f, ensure_ascii=False, indent=2)
print(f"  ✅ {len(unique_aeo)} 条 AEO 工具 → data/aeo-tools.json")


# ══════════════════════════════════════════════════════════
# 解析 Schema Tools
# ══════════════════════════════════════════════════════════
print("\n📦 提取 Schema Tools...")

schema_content = read_ts_file(os.path.join(ROOT, 'src/data/schema-tools.ts'))

# 找到 schemaTools 数组
st_match = re.search(r'export const schemaTools[^=]*=\s*\[', schema_content)
if st_match:
    schema_body = schema_content[st_match.end():]
else:
    schema_body = schema_content

schema_rows = []
# Schema 工具有 level/isOfficial 等字段
schema_pattern = re.compile(
    r"\{\s*id:\s*'([\w-]+)',\s*"
    r"name:\s*'([^']+)',\s*"
    r"url:\s*'([^']+)',\s*"
    r"description:\s*'((?:[^'\\]|\\.)*)',",
    re.DOTALL
)

for m in schema_pattern.finditer(schema_content):
    tool_id = m.group(1)
    name = m.group(2)
    url = m.group(3)
    description = m.group(4).replace("\\'", "'")

    rest = schema_content[m.end():m.end()+2000]

    highlights_m = re.search(r'highlights:\s*\[(.*?)\]', rest, re.DOTALL)
    highlights = re.findall(r"'([^']+)'", highlights_m.group(0)) if highlights_m else []

    tags_m = re.search(r'tags:\s*\[(.*?)\]', rest, re.DOTALL)
    tags = re.findall(r"'([^']+)'", tags_m.group(0)) if tags_m else []

    is_free_m = re.search(r'isFree:\s*(true|false)', rest)
    is_free = is_free_m.group(1) == 'true' if is_free_m else True  # 默认 free

    has_free_m = re.search(r'hasFreeplan:\s*(true|false)', rest)
    has_free = has_free_m.group(1) == 'true' if has_free_m else False

    pricing_m = re.search(r"pricing:\s*'([^']+)'", rest)
    pricing = pricing_m.group(1) if pricing_m else None

    level_m = re.search(r"level:\s*'(beginner|advanced|auto)'", rest)
    level = level_m.group(1) if level_m else 'beginner'

    is_official_m = re.search(r'isOfficial:\s*(true|false)', rest)
    is_official = is_official_m.group(1) == 'true' if is_official_m else False

    badge_m = re.search(r"badge:\s*'([^']+)'", rest)
    badge = badge_m.group(1) if badge_m else None

    supported_m = re.search(r'supportedTypes:\s*\[(.*?)\]', rest, re.DOTALL)
    supported_types = re.findall(r"'([^']+)'", supported_m.group(0)) if supported_m else []

    schema_rows.append({
        'tool_id': tool_id,
        'name': name,
        'url': url,
        'description': description,
        'highlights': highlights,
        'tags': tags,
        'is_free': is_free,
        'has_free_plan': has_free,
        'pricing': pricing,
        'level': level,
        'is_official': is_official,
        'badge': badge,
        'supported_types': supported_types,
        'price': 'free' if is_free else ('freemium' if has_free else 'paid'),
    })

seen_ids = set()
unique_schema = []
for row in schema_rows:
    if row['tool_id'] not in seen_ids:
        seen_ids.add(row['tool_id'])
        unique_schema.append(row)

with open(os.path.join(DATA_DIR, 'schema-tools.json'), 'w', encoding='utf-8') as f:
    json.dump(unique_schema, f, ensure_ascii=False, indent=2)
print(f"  ✅ {len(unique_schema)} 条 Schema 工具 → data/schema-tools.json")

print("\n🎉 所有数据提取完成！")
print(f"  SEO: {len(unique_seo)} 条")
print(f"  GEO: {len(unique_geo)} 条")
print(f"  AEO: {len(unique_aeo)} 条")
print(f"  Schema: {len(unique_schema)} 条")
