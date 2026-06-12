#!/usr/bin/env python3
"""读取 /tmp/bitrans/<id>.<field> 译文文件,按方向写回 Supabase 对应列。
用法: python3 ingest_translations.py <items_json>
items_json 每项: {table, id, direction}  direction = zh2en | en2zh
zh2en -> 写英文到基础列 title/description/content
en2zh -> 写中文到 *_zh 列 title_zh/description_zh/content_zh
tutorials 无 content。
"""
import os, sys, json, urllib.request, urllib.error

envp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env.local")
for line in open(envp, encoding="utf-8"):
    s = line.strip()
    if s and not s.startswith("#") and "=" in s:
        k, v = s.split("=", 1); os.environ.setdefault(k.strip(), v.strip())
URL = os.environ["VITE_SUPABASE_URL"]; KEY = os.environ["SUPABASE_SECRET_KEY"]
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
OUT = "/tmp/bitrans"

items = json.load(open(sys.argv[1]))
ok = fail = skip = 0
report = []
for it in items:
    tid = it["id"]; tbl = it["table"]; direction = it["direction"]
    has_content = tbl != "wseo_tutorials"
    fields = ["title", "description"] + (["content"] if has_content else [])
    vals = {}
    missing = []
    for f in fields:
        p = os.path.join(OUT, f"{tid}.{f}")
        if os.path.exists(p) and os.path.getsize(p) > 0:
            vals[f] = open(p, encoding="utf-8").read()
        else:
            missing.append(f)
    # title + (content if has_content) 必须有
    required = ["title"] + (["content"] if has_content else ["description"])
    if any(r in missing for r in required):
        skip += 1; report.append((it.get("slug", tid), "SKIP 缺文件:" + ",".join(missing))); continue
    # 映射到目标列
    if direction == "zh2en":
        body = {f: vals[f] for f in vals}                 # 写基础列
    else:
        body = {f + "_zh": vals[f] for f in vals}          # 写 *_zh 列
    body["updated_at"] = "2026-06-12T10:00:00"
    try:
        req = urllib.request.Request(f"{URL}/rest/v1/{tbl}?id=eq.{tid}", data=json.dumps(body).encode(), method="PATCH", headers=H)
        urllib.request.urlopen(req)
        ok += 1; report.append((it.get("slug", tid), f"OK {direction} 字段:{list(vals)}"))
    except urllib.error.HTTPError as e:
        fail += 1; report.append((it.get("slug", tid), f"FAIL {e.code} {e.read().decode()[:120]}"))

for slug, st in report: print(f"  {st:40} {slug}")
print(f"\n入库: OK {ok} | FAIL {fail} | SKIP {skip} / 共 {len(items)}")
