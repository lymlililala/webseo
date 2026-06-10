/**
 * 从数据库拉取所有内容，重新生成 sitemap.xml
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITEMAP_PATH = join(ROOT, 'public', 'sitemap.xml');

// 手动加载 .env.local（无需 dotenv），CI 环境直接用注入的环境变量
try {
  const envContent = readFileSync(join(ROOT, '.env.local'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
} catch {
  // 忽略：使用进程本身的环境变量
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const TODAY = new Date().toISOString().split('T')[0]; // 2026-05-28

// 静态页面（保持原有内容）
const STATIC_PAGES = `  <url>
    <loc>https://sgaindex.com/seo-nav</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/geo-nav</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/aeo-nav</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/schema-generator</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/ai-checker</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/llms-txt</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/articles</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/news</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/tutorials</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/glossary</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/faq</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sgaindex.com/pricing-plans</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod || TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchAllSlugs(table, path, changefreq, priority) {
  const entries = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const selectFields = table === 'wseo_tutorials' ? 'slug, created_at' : 'slug, date, created_at';
    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .not('slug', 'is', null)
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) { console.error(`${table} error:`, error.message); break; }
    if (!data || data.length === 0) break;

    for (const row of data) {
      const lastmod = row.date || row.created_at?.split('T')[0] || TODAY;
      entries.push(urlEntry(`https://sgaindex.com/${path}/${row.slug}`, lastmod, changefreq, priority));
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return entries;
}

async function main() {
  console.log('🗺️  生成 sitemap.xml...\n');

  const [articles, news, tutorials] = await Promise.all([
    fetchAllSlugs('wseo_articles', 'articles', 'weekly', '0.8'),
    fetchAllSlugs('wseo_news', 'news', 'daily', '0.7'),
    fetchAllSlugs('wseo_tutorials', 'tutorials', 'weekly', '0.7'),
  ]);

  console.log(`  文章:  ${articles.length} 条`);
  console.log(`  新闻:  ${news.length} 条`);
  console.log(`  教程:  ${tutorials.length} 条`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES}
${articles.join('\n')}
${news.join('\n')}
${tutorials.join('\n')}
</urlset>`;

  writeFileSync(SITEMAP_PATH, xml, 'utf-8');

  const totalUrls = STATIC_PAGES.split('<url>').length - 1 + articles.length + news.length + tutorials.length;
  console.log(`\n✅ sitemap.xml 已更新: ${totalUrls} 个 URL`);
  console.log(`   文件路径: public/sitemap.xml`);
}

main().catch(console.error);
