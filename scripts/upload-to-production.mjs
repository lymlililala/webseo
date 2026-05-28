/**
 * 批量上传 Batch 23~54 数据直接写入 Supabase 正式表
 * 已修复：category/difficulty 约束、字段长度截断
 * 使用方法: node scripts/upload-to-production.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARSE_SCRIPT = join(__dirname, 'parse_sql.py');

const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ============================================================================
// 约束修复辅助函数
// ============================================================================
const ARTICLE_CATEGORIES = new Set(['seo', 'geo', 'aeo', 'tools']);
const NEWS_CATEGORIES = new Set(['seo', 'geo', 'aeo', 'ai']);
const TUTORIAL_CATEGORIES = new Set(['seo', 'geo', 'aeo']);
const DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);

function normalizeCategory(cat, validSet, defaultVal = 'seo') {
  if (!cat) return defaultVal;
  const lower = String(cat).toLowerCase().trim();
  if (validSet.has(lower)) return lower;
  const aliases = {
    'technical-seo': 'seo', 'technical seo': 'seo', 'on-page': 'seo',
    'on-page-seo': 'seo', 'local-seo': 'seo', 'local seo': 'seo',
    'link-building': 'seo', 'content-seo': 'seo', 'seo news': 'seo',
    'seo tools': 'tools', 'ai content tools': 'tools', 'tool': 'tools',
    'geo news': 'geo', 'aeo news': 'aeo',
    'google-update': 'seo', 'industry-news': 'seo',
    'ai': 'aeo', 'ai-search': 'aeo',
    'geo-seo': 'geo', 'ai-overview': 'geo',
    'news': 'seo', 'article': 'seo', 'tutorial': 'seo',
  };
  const mapped = aliases[lower];
  if (mapped && validSet.has(mapped)) return mapped;
  if (lower.includes('geo')) return validSet.has('geo') ? 'geo' : defaultVal;
  if (lower.includes('aeo')) return validSet.has('aeo') ? 'aeo' : defaultVal;
  if (lower.includes('tool')) return validSet.has('tools') ? 'tools' : defaultVal;
  if (lower.includes('ai')) return validSet.has('ai') ? 'ai' : (validSet.has('aeo') ? 'aeo' : defaultVal);
  return defaultVal;
}

function normalizeDifficulty(diff) {
  if (!diff) return 'beginner';
  const lower = String(diff).toLowerCase().trim();
  if (DIFFICULTIES.has(lower)) return lower;
  const aliases = {
    'easy': 'beginner', 'hard': 'advanced', 'medium': 'intermediate',
    'entry': 'beginner', 'basic': 'beginner', 'expert': 'advanced',
    '初级': 'beginner', '中级': 'intermediate', '高级': 'advanced',
  };
  return aliases[lower] || 'beginner';
}

function truncate(str, maxLen) {
  if (!str) return '';
  return String(str).substring(0, maxLen);
}

// ============================================================================
// 字段映射：_staging_* -> wseo_*
// ============================================================================
function mapArticle(row) {
  return {
    title: row.title,
    slug: truncate(row.slug, 100),
    description: row.summary || row.description || '',
    content: row.content || '',
    author: truncate(row.author || 'SGAIndex', 100),
    date: row.publish_date || row.date || new Date().toISOString().split('T')[0],
    category: normalizeCategory(row.category, ARTICLE_CATEGORIES, 'seo'),
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? [row.tags] : []),
    read_time: Number(row.reading_time || row.read_time || 5) || 5,
  };
}

function mapTutorial(row) {
  return {
    title: row.title,
    slug: truncate(row.slug, 100),
    description: row.summary || row.description || '',
    category: normalizeCategory(row.category, TUTORIAL_CATEGORIES, 'seo'),
    instructor: truncate(row.author || row.instructor || 'SGAIndex', 100),
    difficulty: normalizeDifficulty(row.difficulty),
    duration: Number(row.duration) || (Number(row.reading_time) ? Number(row.reading_time) * 3 : 60),
    students: Number(row.students) || 0,
    rating: Number(row.rating) || 4.5,
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? [row.tags] : []),
  };
}

function mapNews(row) {
  return {
    title: row.title,
    slug: truncate(row.slug, 100),
    description: row.summary || row.description || '',
    content: row.content || '',
    category: normalizeCategory(row.category, NEWS_CATEGORIES, 'seo'),
    source: truncate(row.source || row.author || 'SGAIndex', 50),
    date: row.publish_date || row.date || new Date().toISOString().split('T')[0],
    impact: ['high', 'medium', 'low'].includes(String(row.impact || '').toLowerCase()) ? String(row.impact).toLowerCase() : 'medium',
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? [row.tags] : []),
    link: truncate(row.link || '', 500),
  };
}

// ============================================================================
// 解析单个批次文件
// ============================================================================
function parseBatch(batchNum) {
  try {
    const output = execSync(`python3 "${PARSE_SCRIPT}" ${batchNum}`, {
      maxBuffer: 100 * 1024 * 1024,
      timeout: 60000
    }).toString();
    return JSON.parse(output);
  } catch (e) {
    return { error: e.message.substring(0, 200) };
  }
}

// ============================================================================
// 上传单个批次
// ============================================================================
async function uploadBatch(batchNum) {
  const parsed = parseBatch(batchNum);
  if (parsed.error) return { status: 'error', message: parsed.error };
  if (!parsed.batches || parsed.batches.length === 0) return { status: 'empty' };

  let articles = 0, tutorials = 0, news = 0, skipped = 0, errors = 0;
  const errorMessages = [];

  for (const { table, rows } of parsed.batches) {
    if (!rows || rows.length === 0) continue;

    let mappedRows, targetTable;
    if (table === '_staging_articles') {
      mappedRows = rows.map(mapArticle);
      targetTable = 'wseo_articles';
    } else if (table === '_staging_tutorials') {
      mappedRows = rows.map(mapTutorial);
      targetTable = 'wseo_tutorials';
    } else if (table === '_staging_news') {
      mappedRows = rows.map(mapNews);
      targetTable = 'wseo_news';
    } else {
      continue;
    }

    // 过滤掉缺失关键字段的行
    mappedRows = mappedRows.filter(r => r.title && r.slug && r.slug.length > 2);

    if (mappedRows.length === 0) continue;

    // 逐行插入（避免批量约束冲突掩盖具体错误）
    for (const row of mappedRows) {
      const { error } = await supabase
        .from(targetTable)
        .upsert(row, { onConflict: 'slug', ignoreDuplicates: true });

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          skipped++;
        } else {
          errors++;
          if (errorMessages.length < 3) {
            errorMessages.push(`${targetTable}[${row.slug?.substring(0, 30)}]: ${error.message?.substring(0, 80)}`);
          }
        }
      } else {
        if (targetTable === 'wseo_articles') articles++;
        else if (targetTable === 'wseo_tutorials') tutorials++;
        else if (targetTable === 'wseo_news') news++;
      }
    }
  }

  return { status: 'done', articles, tutorials, news, skipped, errors, errorMessages };
}

// ============================================================================
// 主程序
// ============================================================================
async function main() {
  console.log('🚀 批量上传 Batch 23~54 → 直接写入 wseo_* 正式表（修复约束版本）\n');

  const { error: connErr } = await supabase.from('wseo_articles').select('count').limit(1);
  if (connErr) {
    console.error('❌ 连接失败:', connErr.message);
    process.exit(1);
  }
  console.log('✅ Supabase 连接成功\n');

  let totalArticles = 0, totalTutorials = 0, totalNews = 0, totalSkipped = 0;
  const failedBatches = [];

  for (let batchNum = 23; batchNum <= 54; batchNum++) {
    process.stdout.write(`⏳ Batch ${String(batchNum).padStart(2, '0')}: 处理中...`);

    const result = await uploadBatch(batchNum);

    if (result.status === 'error') {
      process.stdout.write(`\r🔴 Batch ${String(batchNum).padStart(2, '0')}: ${result.message}\n`);
      failedBatches.push(batchNum);
    } else if (result.status === 'empty') {
      process.stdout.write(`\r⚠️  Batch ${String(batchNum).padStart(2, '0')}: 无数据\n`);
    } else {
      totalArticles += result.articles;
      totalTutorials += result.tutorials;
      totalNews += result.news;
      totalSkipped += result.skipped;

      const icon = result.errors > 0 ? '⚠️ ' : '✅';
      let line = `\r${icon} Batch ${String(batchNum).padStart(2, '0')}: `;
      line += `文章 +${result.articles} | 教程 +${result.tutorials} | 新闻 +${result.news}`;
      if (result.skipped > 0) line += ` | 跳过 ${result.skipped}`;
      if (result.errors > 0) line += ` | 错误 ${result.errors}`;
      process.stdout.write(line + '\n');

      if (result.errorMessages.length > 0) {
        result.errorMessages.forEach(msg => console.log(`       ↳ ${msg}`));
      }
    }

    await new Promise(r => setTimeout(r, 80));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 本次上传汇总:');
  console.log(`  文章:  +${totalArticles} 条`);
  console.log(`  教程:  +${totalTutorials} 条`);
  console.log(`  新闻:  +${totalNews} 条`);
  console.log(`  新增总计: +${totalArticles + totalTutorials + totalNews} 条`);
  if (totalSkipped > 0) console.log(`  跳过(重复): ${totalSkipped} 条`);
  if (failedBatches.length > 0) console.log(`  失败批次: ${failedBatches.join(', ')}`);

  // 最终统计
  const [a, t, n] = await Promise.all([
    supabase.from('wseo_articles').select('count', {count:'exact',head:true}),
    supabase.from('wseo_tutorials').select('count', {count:'exact',head:true}),
    supabase.from('wseo_news').select('count', {count:'exact',head:true}),
  ]);
  console.log('\n📈 正式表最终数量:');
  console.log(`  wseo_articles:  ${a.count} 条`);
  console.log(`  wseo_tutorials: ${t.count} 条`);
  console.log(`  wseo_news:      ${n.count} 条`);
  console.log('='.repeat(60));
}

main().catch(e => {
  console.error('致命错误:', e);
  process.exit(1);
});
