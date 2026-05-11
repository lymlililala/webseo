#!/usr/bin/env node

/**
 * WebSEO 内容上传脚本
 * 参考: next-shadcn-dashboard-starter/scripts/upload-content.mjs
 *
 * 用法：
 *   node scripts/upload-content.mjs articles data/articles.json
 *   node scripts/upload-content.mjs tutorials data/tutorials.json
 *   node scripts/upload-content.mjs news data/news.json
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 手动加载 .env.local（无需 dotenv）
const envPath = resolve(__dirname, '../.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {
  // 使用进程本身的环境变量
}

const sb = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// 验证表名是否有效
const VALID_TABLES = ['articles', 'tutorials', 'news'];
const KEY_FIELD = {
  articles: 'title',
  tutorials: 'title',
  news: 'title',
};

async function uploadContent(table, dataFile) {
  // 验证参数
  if (!VALID_TABLES.includes(table)) {
    console.error(`❌ 表名无效。支持的表：${VALID_TABLES.join(', ')}`);
    process.exit(1);
  }

  // 将表名转换为数据库表名（加 wseo_ 前缀）
  const dbTable = `wseo_${table}`;

  // 读取数据文件
  let items;
  try {
    const content = readFileSync(resolve(dataFile), 'utf-8');
    items = JSON.parse(content);
    if (!Array.isArray(items)) {
      throw new Error('数据必须是 JSON 数组');
    }
  } catch (err) {
    console.error(`❌ 读取文件失败: ${err.message}`);
    process.exit(1);
  }

  if (items.length === 0) {
    console.warn('⚠️  没有要上传的数据');
    return;
  }

  console.log(`\n📤 开始上传 ${items.length} 条数据到 ${dbTable} 表\n`);

  const keyField = KEY_FIELD[table];
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const keyValue = item[keyField];

    if (!keyValue) {
      console.error(`  ❌ [${i + 1}/${items.length}] 缺少字段 "${keyField}"`);
      errorCount++;
      errors.push(`行 ${i + 1}: 缺少 ${keyField} 字段`);
      continue;
    }

    // 检查是否已存在
    const { data: existing, error: checkError } = await sb
      .from(dbTable)
      .select('id')
      .eq(keyField, keyValue)
      .maybeSingle();

    if (checkError) {
      console.error(`  ⚠️  [${i + 1}/${items.length}] 查询失败: ${checkError.message}`);
      errorCount++;
      errors.push(`行 ${i + 1}: 查询失败 - ${checkError.message}`);
      continue;
    }

    if (existing) {
      console.log(`  ⏭  [${i + 1}/${items.length}] 跳过（已存在）: ${keyValue}`);
      skipCount++;
      continue;
    }

    // 插入新数据
    const { error: insertError } = await sb.from(dbTable).insert(item);

    if (insertError) {
      console.error(`  ❌ [${i + 1}/${items.length}] 插入失败: ${keyValue}`);
      console.error(`     错误: ${insertError.message}`);
      errorCount++;
      errors.push(`行 ${i + 1}: ${insertError.message}`);
    } else {
      console.log(`  ✅ [${i + 1}/${items.length}] 插入成功: ${keyValue}`);
      successCount++;
    }
  }

  // 输出总结
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`📊 上传完成`);
  console.log(`  ✅ 成功: ${successCount}`);
  console.log(`  ⏭  跳过: ${skipCount}`);
  console.log(`  ❌ 失败: ${errorCount}`);
  console.log(`${'─'.repeat(50)}\n`);

  if (errors.length > 0) {
    console.log('⚠️  错误详情：');
    errors.forEach((err) => console.log(`  • ${err}`));
    console.log();
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

// 命令行参数处理
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
📚 WebSEO 内容上传脚本

用法：
  node scripts/upload-content.mjs <table> <data-file>

参数：
  <table>       表名 (articles | tutorials | news)
  <data-file>   JSON 数据文件路径

示例：
  node scripts/upload-content.mjs articles data/articles.json
  node scripts/upload-content.mjs tutorials data/tutorials.json
  node scripts/upload-content.mjs news data/news.json

数据格式示例（JSON 数组）：
  [
    {
      "title": "文章标题",
      "description": "摘要内容",
      "content": "正文（可选）",
      ...其他字段
    }
  ]

支持的字段：
  Articles (文章):
    - title (必填)
    - description, content, author
    - date, category, tags, read_time

  Tutorials (教程):
    - title (必填)
    - description, category, instructor
    - difficulty, duration, students, rating, tags

  News (新闻):
    - title (必填)
    - description, content, category, source
    - date, impact, tags, link
  `);
  process.exit(1);
}

const [table, dataFile] = args;
uploadContent(table, dataFile).catch((err) => {
  console.error(`❌ 致命错误: ${err.message}`);
  process.exit(1);
});
