#!/usr/bin/env python3
"""
解析 supabase-batchXX.sql 文件，输出 JSON 格式的数据
用法: python3 parse_sql.py <batch_number>
"""
import json, sys, re

batch_num = int(sys.argv[1])
filename = f'/Users/lym/Documents/code/webseo/supabase-batch{batch_num}.sql'

try:
    with open(filename, 'r', encoding='utf-8') as f:
        sql = f.read()
except:
    print(json.dumps({'error': 'file not found'}))
    sys.exit(0)

# 移除注释行
sql = re.sub(r'^--.*$', '', sql, flags=re.MULTILINE)

# 找所有 INSERT INTO _staging_xxx (...) VALUES/values
pattern = re.compile(
    r"INSERT\s+INTO\s+(_staging_\w+)\s*\(([^)]+)\)\s*(?:VALUES|values)\s*",
    re.DOTALL
)

positions = [(m.start(), m.group(1).lower(), m.group(2), m.end())
             for m in pattern.finditer(sql)]

results = {'batches': []}

def parse_values(text):
    """解析 VALUES 部分，返回行数据列表"""
    rows = []
    i = 0
    
    while i < len(text):
        # 跳过空白
        while i < len(text) and text[i] in ' \t\n\r': i += 1
        if i >= len(text): break
        
        if text[i] != '(':
            i += 1
            continue
        
        i += 1  # 跳过 (
        values = []
        
        while i < len(text):
            # 跳过空白
            while i < len(text) and text[i] in ' \t\n\r': i += 1
            if i >= len(text): break
            
            ch = text[i]
            
            if ch == ')':
                i += 1
                break
            elif ch == ',':
                i += 1
                continue
            elif ch == "'":
                # 字符串值
                i += 1
                val = ''
                while i < len(text):
                    if text[i] == "'" and i+1 < len(text) and text[i+1] == "'":
                        val += "'"
                        i += 2
                    elif text[i] == "'":
                        i += 1
                        break
                    else:
                        val += text[i]
                        i += 1
                values.append(val)
            elif text[i:i+5].upper() == 'ARRAY':
                # ARRAY['a','b'] 格式
                i += 5
                while i < len(text) and text[i] != '[': i += 1
                i += 1  # 跳过 [
                arr = []
                while i < len(text) and text[i] != ']':
                    while i < len(text) and text[i] in " ,\t\n\r": i += 1
                    if i < len(text) and text[i] == "'":
                        i += 1
                        s = ''
                        while i < len(text) and text[i] != "'":
                            s += text[i]; i += 1
                        i += 1  # 跳过结束引号
                        arr.append(s)
                    elif i < len(text) and text[i] == ']':
                        break
                    elif i < len(text):
                        i += 1
                while i < len(text) and text[i] != ']': i += 1
                i += 1  # 跳过 ]
                values.append(arr)
            elif text[i:i+4].lower() == 'true':
                values.append(True)
                i += 4
            elif text[i:i+5].lower() == 'false':
                values.append(False)
                i += 5
            elif text[i:i+4].lower() == 'null':
                values.append(None)
                i += 4
            else:
                # 数值或其他
                s = ''
                while i < len(text) and text[i] not in ',)':
                    s += text[i]; i += 1
                s = s.strip()
                if s == '':
                    values.append(None)
                else:
                    try:
                        values.append(int(s))
                    except:
                        try:
                            values.append(float(s))
                        except:
                            values.append(s)
        
        if len(values) > 0:
            rows.append(values)
    
    return rows

for idx, (start, table, cols_str, vals_start) in enumerate(positions):
    if idx + 1 < len(positions):
        vals_end = positions[idx+1][0]
    else:
        vals_end = len(sql)
    
    vals_text = sql[vals_start:vals_end].rstrip().rstrip(';').strip()
    
    cols = [c.strip().strip('"').strip("'") for c in cols_str.split(',')]
    
    rows = parse_values(vals_text)
    
    objects = []
    for row in rows:
        obj = {}
        for ci, col in enumerate(cols):
            obj[col] = row[ci] if ci < len(row) else None
        objects.append(obj)
    
    if objects:
        results['batches'].append({
            'table': table,
            'rows': objects
        })

print(json.dumps(results, ensure_ascii=False))
