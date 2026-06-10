import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
  for (const line of env.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
} catch (_) {}

const s = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 脏 slug 判断：包含特殊字符 <>{}$`\'"() 或空格
function isDirtySlug(slug) {
  if (!slug) return false;
  return /[<>{}`$\\'"\s()]/.test(slug);
}

async function fixTable(tableName) {
  const { data, error } = await s.from(tableName).select('id, slug, title');
  if (error) { console.error(`查询 ${tableName} 失败:`, error.message); return; }

  const dirty = (data || []).filter(r => isDirtySlug(r.slug));
  console.log(`\n=== ${tableName}: 总记录 ${data?.length}, 脏 slug ${dirty.length} 条 ===`);

  for (const r of dirty) {
    console.log(`  脏: id=${r.id.substring(0,8)} slug="${r.slug?.substring(0, 80)}"`);

    // 基于 title 重新生成干净 slug
    const newSlug = r.title
      ? r.title.toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 80) + '-' + r.id.substring(0, 8)
      : 'article-' + r.id.substring(0, 8);

    const { error: uErr } = await s.from(tableName).update({ slug: newSlug }).eq('id', r.id);
    if (uErr) {
      console.log(`  ❌ 修复失败: ${uErr.message}`);
    } else {
      console.log(`  ✅ 已修复 → "${newSlug}"`);
    }
  }
}

await fixTable('wseo_articles');
await fixTable('wseo_tutorials');
await fixTable('wseo_news');

console.log('\n✅ 完成');
