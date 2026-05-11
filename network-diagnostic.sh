#!/bin/bash

echo "🔍 Supabase 网络连接诊断"
echo "=================================================="
echo ""

# 1. DNS 检查
echo "1️⃣ DNS 解析检查..."
if command -v nslookup &> /dev/null; then
  nslookup tixgzezefj.supabase.co 2>&1 | grep -E "Name:|Address:"
elif command -v dig &> /dev/null; then
  dig tixgzezefj.supabase.co +short
else
  echo "   ⚠️ 未找到 nslookup 或 dig 命令"
fi
echo ""

# 2. 网络连接检查
echo "2️⃣ HTTP 连接检查..."
response=$(curl -s -o /dev/null -w "%{http_code}" -I https://tixgzezefj.supabase.co/rest/v1/ --connect-timeout 5)
if [ "$response" = "401" ] || [ "$response" = "200" ]; then
  echo "   ✅ HTTP 连接正常 (HTTP $response)"
else
  echo "   ❌ HTTP 连接失败 (HTTP $response)"
fi
echo ""

# 3. REST API 检查
echo "3️⃣ Supabase REST API 检查..."
api_response=$(curl -s \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDkzNzgsImV4cCI6MjA5MzcyNTM3OH0.Hpr0F_kgFc9OkOla-UGHBioR6y2OBB2jbI-0xKMU1M4" \
  "https://tixgzezefj.supabase.co/rest/v1/wseo_articles?limit=0" \
  --connect-timeout 5 2>&1)

if echo "$api_response" | grep -q "error"; then
  echo "   ❌ API 请求失败:"
  echo "   $api_response"
elif [ -z "$api_response" ]; then
  echo "   ⚠️ 无响应（可能是超时）"
else
  echo "   ✅ API 连接正常"
  echo "   响应: $api_response"
fi
echo ""

# 4. Python 环境检查
echo "4️⃣ Python 环境检查..."
if command -v python3 &> /dev/null; then
  python_version=$(python3 --version 2>&1)
  echo "   ✅ Python: $python_version"
  
  # 检查 supabase 包
  if python3 -c "import supabase" 2>/dev/null; then
    echo "   ✅ supabase 包已安装"
  else
    echo "   ❌ supabase 包未安装"
  fi
else
  echo "   ❌ Python3 未安装"
fi
echo ""

# 5. 代理检查
echo "5️⃣ 代理配置检查..."
if [ -n "$HTTP_PROXY" ] || [ -n "$HTTPS_PROXY" ]; then
  echo "   ⚠️ 检测到代理配置:"
  echo "   HTTP_PROXY: $HTTP_PROXY"
  echo "   HTTPS_PROXY: $HTTPS_PROXY"
else
  echo "   ℹ️ 未配置代理"
fi
echo ""

# 6. 防火墙检查
echo "6️⃣ 防火墙检查..."
if command -v pfctl &> /dev/null; then
  pfctl -sr 2>/dev/null | head -5
  echo "   ℹ️ 防火墙可能配置了规则"
else
  echo "   ℹ️ 无法访问防火墙信息"
fi
echo ""

echo "=================================================="
echo "✅ 诊断完成"
echo ""
echo "💡 建议："
echo "1. 如果 DNS 无法解析，检查网络连接"
echo "2. 如果 HTTP 返回非 401/200 状态码，可能有网络限制"
echo "3. 如果 API 无响应，尝试在浏览器直接访问"
echo "4. 推荐：直接在 Supabase Dashboard 的 SQL Editor 中执行脚本"
