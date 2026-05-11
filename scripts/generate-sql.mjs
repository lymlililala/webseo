/**
 * 从 TypeScript 数据文件生成 SQL INSERT 语句
 * 使用正则表达式提取工具数据，生成 supabase-tools-data.sql
 *
 * 使用方式: node scripts/generate-sql.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = join(__dirname, '../src/data')

// ── 工具函数 ──────────────────────────────────────────────────

function esc(str) {
  if (!str) return ''
  return str.replace(/'/g, "''")
}

function toJsonb(arr) {
  if (!arr || !Array.isArray(arr)) return "'[]'::jsonb"
  return `'${JSON.stringify(arr).replace(/'/g, "''")}'::jsonb`
}

function bool(val) {
  return val ? 'TRUE' : 'FALSE'
}

// ── 提取 SEO 工具 ──────────────────────────────────────────────

function extractSeoTools() {
  const content = readFileSync(join(srcDir, 'seo-tools.ts'), 'utf8')
  const tools = []
  // 匹配 tools 数组中的每个对象
  const toolPattern = /\{\s*id:\s*'([^']+)'[\s\S]*?isAiFriendly:\s*(true|false)\s*\}/g
  let match
  while ((match = toolPattern.exec(content)) !== null) {
    const block = match[0]
    const id = extractField(block, 'id')
    const name = extractField(block, 'name')
    const description = extractField(block, 'description')
    const url = extractField(block, 'url')
    const tags = extractArray(block, 'tags')
    const isFree = extractBool(block, 'isFree')
    const hasApi = extractBool(block, 'hasApi')
    const isAiFriendly = extractBool(block, 'isAiFriendly')
    if (id && name && url) {
      // 判断分类 - 需要从上下文中获取
      tools.push({ id, name, description, url, tags, isFree, hasApi, isAiFriendly })
    }
  }
  return tools
}

// ── 通用字段提取 ──────────────────────────────────────────────

function extractField(block, fieldName) {
  // 匹配 fieldName: 'value' 或 fieldName: "value"
  const m = block.match(new RegExp(`${fieldName}:\\s*['"\`]([^'"\`\\n]+)['"\`]`))
  return m ? m[1] : null
}

function extractArray(block, fieldName) {
  const m = block.match(new RegExp(`${fieldName}:\\s*\\[([^\\]]+)\\]`))
  if (!m) return []
  return m[1].match(/['"`]([^'"`]+)['"`]/g)?.map(s => s.replace(/['"`]/g, '')) || []
}

function extractBool(block, fieldName) {
  const m = block.match(new RegExp(`${fieldName}:\\s*(true|false)`))
  return m ? m[1] === 'true' : false
}

// ── 读取所有工具数据（用正则提取简化版本） ──────────────────────────────

function readGeoToolsSimple() {
  const content = readFileSync(join(srcDir, 'geo-tools.ts'), 'utf8')
  return extractToolsFromContent(content, ['region'])
}

function readAeoToolsSimple() {
  const content = readFileSync(join(srcDir, 'aeo-tools.ts'), 'utf8')
  return extractToolsFromContent(content, ['pricing', 'featured'])
}

function readSchemaToolsSimple() {
  const content = readFileSync(join(srcDir, 'schema-tools.ts'), 'utf8')
  const tools = []

  // 匹配 schemaTools 数组中的每个工具对象
  const toolsSection = content.match(/export const schemaTools[\s\S]*?= \[([\s\S]*?)\]/)
  if (!toolsSection) return tools

  const blockPattern = /\{\s*id:\s*'([^']+)'[\s\S]*?level:\s*'([^']+)'[\s\S]*?\}/g
  let match
  while ((match = blockPattern.exec(toolsSection[0])) !== null) {
    const block = match[0]
    const id = extractField(block, 'id')
    const name = extractField(block, 'name')
    const url = extractField(block, 'url')
    const description = extractField(block, 'description')
    const level = extractField(block, 'level')
    const badge = extractField(block, 'badge')
    const pricing = extractField(block, 'pricing')
    const isFree = extractBool(block, 'isFree')
    const hasFreeplan = extractBool(block, 'hasFreeplan')
    const isOfficial = extractBool(block, 'isOfficial')
    const highlights = extractArray(block, 'highlights')
    const tags = extractArray(block, 'tags')
    const supportedTypes = extractArray(block, 'supportedTypes')

    if (id && name && url && level) {
      tools.push({ id, name, url, description, level, badge, pricing, isFree, hasFreeplan, isOfficial, highlights, tags, supportedTypes })
    }
  }
  return tools
}

function extractToolsFromContent(content, extraFields = []) {
  const tools = []
  // 简化的块提取，找到每个 { id: '...' ... } 块
  const idPattern = /id:\s*'([^']+)'/g
  let idMatch
  const positions = []
  while ((idMatch = idPattern.exec(content)) !== null) {
    positions.push({ id: idMatch[1], pos: idMatch.index })
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].pos - 4  // 往前找 { 符号
    const end = i + 1 < positions.length ? positions[i + 1].pos : content.length
    const block = content.slice(Math.max(0, start), end)

    const id = positions[i].id
    const name = extractField(block, 'name')
    const url = extractField(block, 'url')
    const description = extractMultilineField(block, 'description')
    const tags = extractArray(block, 'tags')
    const isFree = extractBool(block, 'isFree')
    const hasFreeplan = extractBool(block, 'hasFreeplan')
    const isOpenSource = extractBool(block, 'isOpenSource')
    const hasApi = extractBool(block, 'hasApi')
    const pricing = extractField(block, 'pricing')
    const region = extractField(block, 'region')
    const highlights = extractArray(block, 'highlights')
    const featured = extractBool(block, 'featured')

    if (id && url && name) {
      const tool = { id, name, url, description: description || '', tags, isFree, hasFreeplan, isOpenSource, hasApi }
      if (pricing) tool.pricing = pricing
      if (region) tool.region = region
      if (highlights.length) tool.highlights = highlights
      if (featured) tool.featured = featured
      tools.push(tool)
    }
  }
  return tools
}

function extractMultilineField(block, fieldName) {
  // 匹配单行或多行的字段值（以模板字符串或普通字符串）
  const m = block.match(new RegExp(`${fieldName}:\\s*['"\`]([\\s\\S]*?)['"\`]\\s*,`))
  if (m) return m[1].trim()
  // 尝试多行拼接
  const m2 = block.match(new RegExp(`${fieldName}:\\s*\`([\\s\\S]*?)\``))
  if (m2) return m2[1].trim()
  return null
}

// ── 生成 SQL ──────────────────────────────────────────────────

function generateSeoToolsSql(tools) {
  if (!tools.length) return ''
  const lines = []
  lines.push('-- SEO Tools')
  lines.push('INSERT INTO wseo_seo_tools (name, description, category, ai_supported, price, url, tags) VALUES')

  const rows = tools.map(t => {
    const price = t.isFree ? 'free' : 'paid'
    const cat = 'seo'
    return `(
  '${esc(t.name)}',
  '${esc(t.description || '')}',
  '${cat}',
  ${bool(t.isAiFriendly)},
  '${price}',
  '${esc(t.url)}',
  ${toJsonb(t.tags)}
)`
  })

  return lines.join('\n') + '\n' + rows.join(',\n') + '\nON CONFLICT DO NOTHING;\n'
}

function generateGeoToolsSql(tools) {
  if (!tools.length) return ''
  const lines = []
  lines.push('-- GEO Tools')
  lines.push('INSERT INTO wseo_geo_tools (name, description, region, open_source, price, url, tags) VALUES')

  const rows = tools.map(t => {
    const price = t.isFree ? 'free' : (t.hasFreeplan ? 'freemium' : 'paid')
    const region = t.region || 'global'
    return `(
  '${esc(t.name)}',
  '${esc(t.description || '')}',
  '${region}',
  ${bool(t.isOpenSource)},
  '${price}',
  '${esc(t.url)}',
  ${toJsonb(t.tags)}
)`
  })

  return lines.join('\n') + '\n' + rows.join(',\n') + '\nON CONFLICT DO NOTHING;\n'
}

function generateAeoToolsSql(tools) {
  if (!tools.length) return ''
  const lines = []
  lines.push('-- AEO Tools')
  lines.push('INSERT INTO wseo_aeo_tools (name, description, category, open_source, price, url, tags) VALUES')

  const rows = tools.map(t => {
    const price = t.isFree ? 'free' : (t.hasFreeplan ? 'freemium' : 'paid')
    return `(
  '${esc(t.name)}',
  '${esc(t.description || '')}',
  'aeo',
  ${bool(t.isOpenSource)},
  '${price}',
  '${esc(t.url)}',
  ${toJsonb(t.tags)}
)`
  })

  return lines.join('\n') + '\n' + rows.join(',\n') + '\nON CONFLICT DO NOTHING;\n'
}

function generateSchemaToolsSql(tools) {
  if (!tools.length) return ''
  const lines = []
  lines.push('-- Schema Tools')
  lines.push('INSERT INTO wseo_schema_tools (tool_id, name, url, description, highlights, tags, is_free, has_freeplan, pricing, level, is_official, badge, supported_types) VALUES')

  const rows = tools.map(t => {
    return `(
  '${esc(t.id)}',
  '${esc(t.name)}',
  '${esc(t.url)}',
  '${esc(t.description || '')}',
  ${toJsonb(t.highlights)},
  ${toJsonb(t.tags)},
  ${bool(t.isFree)},
  ${bool(t.hasFreeplan)},
  ${t.pricing ? `'${esc(t.pricing)}'` : 'NULL'},
  '${t.level}',
  ${bool(t.isOfficial)},
  ${t.badge ? `'${esc(t.badge)}'` : 'NULL'},
  ${toJsonb(t.supportedTypes)}
)`
  })

  return lines.join('\n') + '\n' + rows.join(',\n') + '\nON CONFLICT (tool_id) DO NOTHING;\n'
}

// ── 主流程 ────────────────────────────────────────────────────

console.log('📦 开始从数据文件提取工具数据...\n')

const seoTools = extractSeoTools()
console.log(`  ✓ SEO 工具: ${seoTools.length} 个`)

const geoTools = readGeoToolsSimple()
console.log(`  ✓ GEO 工具: ${geoTools.length} 个`)

const aeoTools = readAeoToolsSimple()
console.log(`  ✓ AEO 工具: ${aeoTools.length} 个`)

const schemaTools = readSchemaToolsSimple()
console.log(`  ✓ Schema 工具: ${schemaTools.length} 个`)

const sql = [
  '-- ============================================================================',
  '-- WEBSEO PROJECT - TOOLS DATA INSERT',
  `-- Generated at: ${new Date().toISOString()}`,
  '-- ============================================================================\n',

  generateSchemaToolsSql(schemaTools),
  '\n',
  generateGeoToolsSql(geoTools),
  '\n',
  generateAeoToolsSql(aeoTools),
].join('\n')

const outputPath = join(__dirname, '../supabase-tools-data.sql')
writeFileSync(outputPath, sql)
console.log(`\n✅ SQL 文件已生成: supabase-tools-data.sql`)
console.log(`   总工具数: ${seoTools.length + geoTools.length + aeoTools.length + schemaTools.length}`)
