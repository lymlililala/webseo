<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '../../composables/usePageSeo'
import { getLimits } from '../../config/plans'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

// 当前套餐限额(单一事实源见 src/config/plans.js)。现阶段 = default 档,全部放开。
// 所有"可收费"动作都从这里读上限,不在本文件写死数字。
const limits = getLimits()

// 按 tldMax 夹住实际查询的后缀数(Infinity 时不变)
function usableTlds(): string[] {
  return limits.tldMax === Infinity ? selectedTlds.value : selectedTlds.value.slice(0, limits.tldMax)
}

// 每日"起名"次数闸门 —— 结构占位。dailyRuns=Infinity 时直接放行。
// 无登录态时用 localStorage 粗略计数(可被绕过;真正限制需后端 + 登录,见 plans.js 的 resolvePlanId)。
function takeDailyRun(): boolean {
  if (limits.dailyRuns === Infinity) return true
  const key = 'dn_runs_' + new Date().toISOString().slice(0, 10)
  const used = parseInt(localStorage.getItem(key) || '0', 10)
  if (used >= limits.dailyRuns) return false
  localStorage.setItem(key, String(used + 1))
  return true
}

usePageSeo({
  title: t('domainNamerPage.seoTitle'),
  description: t('domainNamerPage.seoDescription'),
  path: '/domain-namer',
  keywords: t('domainNamerPage.seoKeywords'),
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SGAIndex AI Domain Namer',
      description: 'AI-powered domain name generator with live registration and brand-collision checks',
      url: 'https://sgaindex.com/domain-namer',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
})

// ---------------- 类型 ----------------
type DomStatus = 'checking' | 'available' | 'registered' | 'unknown'
interface Rec {
  id: number
  name: string
  reason: string
  domains: Record<string, DomStatus>
  regYears: Record<string, string>
  brand: 'checking' | 'clear' | 'risk' | 'error' | 'hidden'
  brandWhy: string
  brandTitle: string
  brandLink: string
  risk: boolean
}
interface RdapInfo {
  existed: 'yes' | 'no' | null
  registered?: string
}

// ---------------- 表单状态 ----------------
const need = ref(
  isZh.value
    ? '一个帮独立开发者快速给项目起名并查域名的工具'
    : 'A tool that helps indie developers name a project and check domain availability',
)
const tlds = ref<{ ext: string; on: boolean; custom?: boolean }[]>([
  { ext: '.com', on: true },
  { ext: '.ai', on: true },
  { ext: '.io', on: true },
  { ext: '.app', on: false },
  { ext: '.co', on: false },
  { ext: '.dev', on: false },
])
const tldInput = ref('')
const autofill = ref(false)
const autofillN = ref(6)
const myNames = ref('')

const selectedTlds = computed(() => tlds.value.filter((t) => t.on).map((t) => t.ext))

function toggleTld(i: number) {
  tlds.value[i].on = !tlds.value[i].on
}
function addTld() {
  let v = tldInput.value.trim().toLowerCase()
  if (!v) return
  if (!v.startsWith('.')) v = '.' + v
  v = v.replace(/[^a-z0-9.]/g, '')
  if (v.length < 2 || tlds.value.some((t) => t.ext === v)) {
    tldInput.value = ''
    return
  }
  tlds.value.push({ ext: v, on: true, custom: true })
  tldInput.value = ''
}
function delTld(i: number) {
  tlds.value.splice(i, 1)
}

// ---------------- 运行状态 ----------------
const records = ref<Rec[]>([])
const recoText = ref('')
const recoShow = ref(false)
const statusMsg = ref('')
const statusCls = ref<'run' | 'ok' | 'err' | ''>('')
const running = ref(false)
const showMore = ref(false)
const arranged = ref(false)
const badOpen = ref(false)

let seen = new Set<string>()
let idx = 0

function setStatus(msg: string, cls: 'run' | 'ok' | 'err' | '' = '') {
  statusMsg.value = msg
  statusCls.value = cls
}

// ---------------- 限流队列:任务间至少隔 gapMs,错误不阻塞后续 ----------------
type QueueFn = ((task: () => Promise<unknown>) => Promise<unknown>) & { reset: () => void }
function makeQueue(gapMs: number): QueueFn {
  let chain: Promise<unknown> = Promise.resolve()
  let last = 0
  const fn = ((task: () => Promise<unknown>) => {
    const p = chain.then(async () => {
      const wait = Math.max(0, gapMs - (Date.now() - last))
      if (wait) await new Promise((r) => setTimeout(r, wait))
      last = Date.now()
      try {
        return await task()
      } catch {
        /* 单任务失败不阻塞队列 */
      }
    })
    chain = p.catch(() => {})
    return p
  }) as QueueFn
  fn.reset = () => {
    chain = Promise.resolve()
    last = 0
  }
  return fn
}
const qdQueue = makeQueue(500)
const serperQueue = makeQueue(800)

// ---------------- LLM(经 /api/namer 转发 deepseek,SSE 流式;按 OpenAI delta 解析)----------------
async function llmChat(
  messages: { role: string; content: string }[],
  onLine?: (line: string) => void,
  onChunk?: (full: string) => void,
): Promise<string> {
  const resp = await fetch('/api/namer', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!resp.ok || !resp.body) {
    let msg = `HTTP ${resp.status}`
    try {
      const j = await resp.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }

  let answer = ''
  let emitted = 0
  const pumpLines = (isFinal: boolean) => {
    let nl: number
    while ((nl = answer.indexOf('\n', emitted)) >= 0) {
      const line = answer.slice(emitted, nl).trim()
      emitted = nl + 1
      if (line && onLine) onLine(line)
    }
    if (isFinal) {
      const tail = answer.slice(emitted).trim()
      if (tail && onLine) onLine(tail)
    }
  }
  const handleData = (payload: string) => {
    if (!payload || payload === '[DONE]') return
    let j: { choices?: { delta?: { content?: string } }[] }
    try {
      j = JSON.parse(payload)
    } catch {
      return
    }
    const delta = j.choices?.[0]?.delta?.content
    if (delta) {
      answer += delta
      pumpLines(false)
      if (onChunk) onChunk(answer)
    }
  }

  const reader = resp.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    let nl: number
    while ((nl = buf.indexOf('\n')) >= 0) {
      const raw = buf.slice(0, nl).replace(/\r$/, '')
      buf = buf.slice(nl + 1)
      if (raw.startsWith('data:')) handleData(raw.slice(5).trim())
    }
  }
  if (buf.startsWith('data:')) handleData(buf.slice(5).trim())
  pumpLines(true)
  return answer
}

// 解析单行 "Name | 寓意" → {name, reason},非法名返回 null
function parseLine(line: string): { name: string; reason: string } | null {
  const s = line.replace(/^[\s\-*\d.、)]+/, '').trim()
  let name = ''
  let reason = ''
  const m = s.match(/^(.*?)(?:\s*[|｜:：]\s*|\s+[—–-]+\s+)(.*)$/)
  if (m) {
    name = m[1].trim()
    reason = m[2].trim()
  } else {
    name = s.trim()
  }
  if (!/^[a-zA-Z][a-zA-Z0-9]{1,29}$/.test(name)) return null
  return { name, reason }
}

// 解析用户粘贴的候选名
function parseUserNames(raw: string): string[] {
  const set = new Set<string>()
  const out: string[] = []
  raw.split(/[\s,，、\n\r]+/).forEach((tok) => {
    let s = tok.trim().toLowerCase()
    if (!s) return
    s = s.replace(/\.[a-z]{2,}$/, '')
    if (!/^[a-z][a-z0-9]{1,29}$/.test(s)) return
    if (set.has(s)) return
    set.add(s)
    out.push(s)
  })
  return out
}

// ---------------- RDAP(浏览器直连,无需密钥)----------------
async function rdapCheckOne(domain: string): Promise<RdapInfo> {
  try {
    const resp = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: 'application/rdap+json' },
    })
    if (resp.status === 404) return { existed: 'no' }
    if (resp.ok) {
      const info: RdapInfo = { existed: 'yes' }
      let j: { events?: { eventAction?: string; eventDate?: string }[] } | null = null
      try {
        j = await resp.json()
      } catch {
        j = null
      }
      const events = (j && j.events) || []
      const reg = events.find((e) => e.eventAction === 'registration')
      if (reg && reg.eventDate) info.registered = reg.eventDate
      return info
    }
    return { existed: null }
  } catch {
    return { existed: null }
  }
}

function existedToStatus(info: RdapInfo): DomStatus {
  if (!info || info.existed == null) return 'unknown'
  if (info.existed === 'no') return 'available'
  if (info.existed === 'yes') return 'registered'
  return 'unknown'
}
function regYear(s?: string): string {
  if (!s) return ''
  const m1 = String(s).match(/(\d{4})-\d{2}-\d{2}/)
  if (m1) return m1[1]
  const m2 = String(s).match(/\d{2}\/\d{2}\/(\d{4})/)
  if (m2) return m2[1]
  return ''
}

// ---------------- Serper 撞名检测(经 /api/serper)----------------
async function checkBrand(name: string) {
  const resp = await fetch('/api/serper', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ q: name, num: 10 }),
  })
  if (!resp.ok) throw new Error(`serper HTTP ${resp.status}`)
  const j = await resp.json()

  const norm = (s: string) => (s || '').toLowerCase().replace(/[\s\-_.]/g, '')
  const ln = norm(name)
  const kg = j.knowledgeGraph
  let hit = false
  let why = ''
  let title = ''
  let link = ''

  for (const o of (j.organic || []).slice(0, 5)) {
    try {
      const host = new URL(o.link).hostname.replace(/^www\./, '')
      const root = host.split('.')[0]
      if (norm(root) === ln) {
        hit = true
        why = (isZh.value ? '已有人注册同名域名 ' : 'Same-name domain already registered: ') + host
        title = o.title
        link = o.link
        break
      }
    } catch {
      /* ignore */
    }
  }
  if (!hit && kg && norm(kg.title).includes(ln)) {
    hit = true
    why = isZh.value ? 'Google 知识图谱已有该实体' : 'Entity already in Google Knowledge Graph'
    title = kg.title
    link = kg.website || ''
  }
  if (!hit) {
    for (const o of (j.organic || []).slice(0, 3)) {
      if (norm(o.title).includes(ln)) {
        hit = true
        why = isZh.value ? 'Google 前排已出现该名' : 'Name already appears in top Google results'
        title = o.title
        link = o.link || ''
        break
      }
    }
  }
  return { risk: hit, why, title, link }
}

// ---------------- 候选入库 + 触发查询 ----------------
function intakeCandidate(name: string, reason: string, pending: Promise<unknown>[]): boolean {
  const key = name.toLowerCase()
  if (seen.has(key)) return false
  seen.add(key)

  const sel = usableTlds()
  const domains: Record<string, DomStatus> = {}
  sel.forEach((tld) => (domains[(name + tld).toLowerCase()] = 'checking'))
  const rec: Rec = {
    id: idx++,
    name,
    reason,
    domains,
    regYears: {},
    brand: sel.length ? 'checking' : 'hidden',
    brandWhy: '',
    brandTitle: '',
    brandLink: '',
    risk: false,
  }
  records.value.push(rec)

  const doms = sel.map((t) => (name + t).toLowerCase())
  pending.push(
    qdQueue(async () => {
      await Promise.all(
        doms.map(async (dom) => {
          const info = await rdapCheckOne(dom)
          rec.domains[dom] = existedToStatus(info)
          const yr = regYear(info.registered)
          if (yr) rec.regYears[dom] = yr
        }),
      )
    }),
  )

  pending.push(
    serperQueue(async () => {
      try {
        const r = await checkBrand(name)
        rec.risk = r.risk
        rec.brand = r.risk ? 'risk' : 'clear'
        rec.brandWhy = r.why
        rec.brandTitle = r.title
        rec.brandLink = r.link
      } catch {
        rec.brand = 'error'
      }
    }),
  )
  return true
}

// ---------------- 起名提示词 ----------------
function buildNamingPrompt(avoid: string[] | null, feedback: string): string {
  let prompt = isZh.value
    ? `你是一个专业的英文域名/品牌起名专家。根据下面的产品需求,起 10 个适合做域名的英文名字。

要求:
- 简短好记,2~14 个字母,纯英文字母(可含数字,但不要连字符、空格、点)
- 适合国际化产品品牌,发音顺口;风格多样:有直白、有造词、有隐喻
- 严格每行输出一个,格式为:英文名 | 一句话中文寓意
- 不要编号、不要 markdown、不要多余说明,直接逐行输出

示例:
Namora | 源自 name + aura,命名的光环
Zeplo | 简洁造词,科技感强

产品需求:${need.value}`
    : `You are a professional English domain/brand naming expert. Based on the product need below, create 10 English names suitable as domains.

Requirements:
- Short and memorable, 2-14 letters, letters only (digits allowed, but no hyphens, spaces or dots)
- Good for an international product brand, easy to pronounce; varied styles: literal, coined, metaphorical
- Output strictly one per line, format: EnglishName | one-line meaning in English
- No numbering, no markdown, no extra commentary — just the lines

Example:
Namora | from name + aura, the aura of naming
Zeplo | clean coinage, techy feel

Product need: ${need.value}`

  if (avoid && avoid.length) {
    prompt += isZh.value
      ? `\n\n已经起过下面这些名字,请换一批完全不同的、风格也尽量不重复:\n${avoid.join('、')}`
      : `\n\nThe following names were already generated — produce a completely different batch, varying the style too:\n${avoid.join(', ')}`
  }
  if (feedback) prompt += `\n\n${feedback}`
  return prompt
}

function buildFeedback(): string {
  const recs = records.value
  if (!recs.length) return ''
  const hasAvail = (r: Rec) => Object.values(r.domains).includes('available')
  const bad = recs.filter((r) => r.risk || !hasAvail(r)).map((r) => r.name)
  const good = recs.filter((r) => !r.risk && hasAvail(r)).map((r) => r.name)
  if (isZh.value) {
    let fb = '请从上一批的实际结果中学习,明显降低"被占用 / 撞名"的比例:'
    if (bad.length)
      fb += `\n- 下面这些已被注册或撞名(说明这类构词太大众、太容易撞),请避开同类套路与词根:${bad.join('、')}`
    if (good.length)
      fb += `\n- 下面这些可注册且无撞名(是好方向,但不要重复),请延续这种更独特的造词风格:${good.join('、')}`
    fb +=
      '\n- 具体做法:多用自创词根、不常见的字母组合、冷门双词拼接;少用常见英文单词和大众词根;适当加长或加入独特音节,以降低 .com 被占和撞名的概率。'
    return fb
  }
  let fb = 'Learn from the actual results above and clearly lower the share of taken / colliding names:'
  if (bad.length)
    fb += `\n- These are already registered or collide (too common a pattern) — avoid similar patterns and roots: ${bad.join(', ')}`
  if (good.length)
    fb += `\n- These are registrable and collision-free (good direction, but do not repeat) — continue this more distinctive coinage style: ${good.join(', ')}`
  fb +=
    '\n- Concretely: use invented roots, uncommon letter combos, rare two-word blends; avoid common English words and overused roots; lengthen slightly or add a distinctive syllable to reduce .com collisions.'
  return fb
}

function countGood(): number {
  return records.value.filter((r) => !r.risk && Object.values(r.domains).includes('available')).length
}

// ---------------- 一轮起名 ----------------
async function roundOfNaming(avoid: string[] | null, feedback: string) {
  const pending: Promise<unknown>[] = []
  let roundCount = 0
  const prompt = buildNamingPrompt(avoid, feedback)
  const onLine = (line: string) => {
    const p = parseLine(line)
    if (!p) return
    if (roundCount >= 10) return
    if (intakeCandidate(p.name, p.reason, pending)) roundCount++
  }
  await llmChat([{ role: 'user', content: prompt }], onLine)
  await Promise.allSettled(pending)
}

async function runAutoFill(targetN: number): Promise<{ reached: boolean; round: number }> {
  const MAX = 8
  for (let round = 1; round <= MAX; round++) {
    const avoid = round === 1 ? null : records.value.map((r) => r.name)
    const feedback = round === 1 ? '' : buildFeedback()
    setStatus(
      isZh.value
        ? `自动凑满中 · 第 ${round}/${MAX} 轮起名…已凑到 ${countGood()} / ${targetN} 个可用候选`
        : `Auto-filling · round ${round}/${MAX}… ${countGood()} / ${targetN} usable so far`,
      'run',
    )
    await roundOfNaming(avoid, feedback)
    if (countGood() >= targetN) return { reached: true, round }
  }
  return { reached: false, round: MAX }
}

// ---------------- 综合推荐(流式)----------------
async function summarize() {
  setStatus(isZh.value ? 'AI 正在综合分析,给出推荐…' : 'AI is analyzing and recommending…', 'run')
  const lines = records.value
    .map((r) => {
      const avail = Object.entries(r.domains)
        .filter(([, s]) => s === 'available')
        .map(([d]) => d)
      const taken = Object.entries(r.domains)
        .filter(([, s]) => s === 'registered')
        .map(([d]) => d)
      if (isZh.value) {
        let s = `${r.name}(${r.reason || '无寓意'}):`
        s += avail.length ? `可注册域名 ${avail.join('、')}` : '无可注册域名'
        if (taken.length) s += `;已被占 ${taken.join('、')}`
        if (r.brand === 'risk') s += `;疑似撞名(${r.brandWhy || '已有占位'})`
        else if (r.brand === 'clear') s += ';无明显撞名'
        return s
      }
      let s = `${r.name} (${r.reason || 'no meaning'}): `
      s += avail.length ? `registrable ${avail.join(', ')}` : 'no registrable domain'
      if (taken.length) s += `; taken ${taken.join(', ')}`
      if (r.brand === 'risk') s += `; possible collision (${r.brandWhy || 'occupied'})`
      else if (r.brand === 'clear') s += '; no obvious collision'
      return s
    })
    .join('\n')

  const prompt = isZh.value
    ? `下面是为某个产品起的一批候选名,以及每个名字的域名可注册情况和 Google 撞名结论。请你作为品牌顾问,给出简短推荐。

判断优先级(重要,必须遵守):
- "疑似撞名"是强负面信号:说明已有人在用这个名字。这类名字原则上不进首推、不进备选,即使它还有别的后缀能注册——因为撞名会带来品牌混淆和法律风险。
- 首推必须是"无明显撞名 + 有完整可注册域名"的名字。
- 只有在实在没有"不撞名又可注册"的候选时,才可降格推荐撞名名字,且必须明确警示撞名风险。

输出格式:
1. 首推 1 个,说明为什么(一句话)
2. 备选 2~3 个,各一句话
3. 单独列出"建议避开"的名字,说明原因(撞名 / 无可注册域名)

凡提到"可注册",必须写出完整可注册域名,不要只说后缀。直接输出中文,简洁,不要 markdown 标题。

产品需求:${need.value}

候选结果:
${lines}`
    : `Below is a batch of candidate names for a product, with each name's domain availability and Google collision verdict. As a brand advisor, give a concise recommendation.

Priority (important, must follow):
- "Possible collision" is a strong negative signal — someone already uses the name. Such names should not be the top pick or an alternative, even if another TLD is registrable, due to brand confusion and legal risk.
- The top pick must be collision-free AND have a fully registrable domain.
- Only when there is genuinely no collision-free registrable candidate may you downgrade to recommending a colliding name, and you must clearly warn about the collision.

Output format:
1. One top pick, with a one-line reason
2. 2-3 alternatives, one line each
3. A separate "avoid" list with reasons (collision / no registrable domain)

Whenever you say "registrable", write the full domain, not just the TLD. Output English, concise, no markdown headings.

Product need: ${need.value}

Candidates:
${lines}`

  recoShow.value = true
  recoText.value = ''
  await llmChat(
    [{ role: 'user', content: prompt }],
    () => {},
    (full) => {
      recoText.value = full
    },
  )
}

async function finishRound() {
  if (limits.aiSummary) {
    try {
      await summarize()
    } catch {
      /* 推荐失败不影响结果 */
    }
  }
  arranged.value = true
  showMore.value = true
  setStatus(
    isZh.value
      ? `✓ 完成,共 ${seen.size} 个候选,其中 ${countGood()} 个可用(无撞名+可注册)`
      : `✓ Done — ${seen.size} candidates, ${countGood()} usable (no collision + registrable)`,
    'ok',
  )
}

// ---------------- 入口动作 ----------------
function resetRun() {
  records.value = []
  recoText.value = ''
  recoShow.value = false
  showMore.value = false
  arranged.value = false
  badOpen.value = false
  qdQueue.reset()
  serperQueue.reset()
  seen = new Set()
  idx = 0
}

async function run() {
  if (!need.value.trim()) return setStatus(isZh.value ? '请先描述你的需求' : 'Please describe your need first', 'err')
  if (!selectedTlds.value.length) return setStatus(isZh.value ? '至少选一个后缀' : 'Pick at least one TLD', 'err')
  if (!takeDailyRun())
    return setStatus(
      isZh.value ? `今日起名次数已用完(上限 ${limits.dailyRuns} 次)` : `Daily naming limit reached (${limits.dailyRuns})`,
      'err',
    )

  running.value = true
  resetRun()
  const targetN = Math.max(1, Math.min(limits.autofillMax, autofillN.value || 6))
  setStatus(
    autofill.value
      ? isZh.value
        ? `自动凑满模式:目标 ${targetN} 个可用候选…`
        : `Auto-fill mode: target ${targetN} usable candidates…`
      : isZh.value
        ? 'AI 正在起名…名字会陆续出现'
        : 'AI is naming… names will appear shortly',
    'run',
  )

  try {
    if (autofill.value) {
      const res = await runAutoFill(targetN)
      if (!res.reached)
        setStatus(
          isZh.value
            ? `已起 ${res.round} 轮,仅凑到 ${countGood()} / ${targetN} 个可用候选(已达轮数上限)`
            : `Ran ${res.round} rounds, only ${countGood()} / ${targetN} usable (round limit reached)`,
          'run',
        )
    } else {
      await roundOfNaming(null, '')
    }
  } catch (e) {
    setStatus((isZh.value ? '起名失败:' : 'Naming failed: ') + (e as Error).message, 'err')
    running.value = false
    return
  }

  if (seen.size === 0) {
    setStatus(isZh.value ? '没解析出有效名字,可重试一次。' : 'No valid names parsed — please retry.', 'err')
    running.value = false
    return
  }
  await finishRound()
  running.value = false
}

async function continueRecommend() {
  running.value = true
  qdQueue.reset()
  serperQueue.reset()
  recoShow.value = false
  setStatus(isZh.value ? 'AI 正在起新一批名字…' : 'AI is generating a new batch…', 'run')
  const avoid = records.value.map((r) => r.name)
  try {
    await roundOfNaming(avoid, buildFeedback())
  } catch (e) {
    setStatus((isZh.value ? '继续起名失败:' : 'Continue failed: ') + (e as Error).message, 'err')
    running.value = false
    return
  }
  await finishRound()
  running.value = false
}

async function rankUserNames() {
  const all = parseUserNames(myNames.value || '')
  if (!all.length)
    return setStatus(
      isZh.value ? '没解析出合法候选名(仅支持字母开头、字母或数字,2~30 位)' : 'No valid candidate names parsed',
      'err',
    )
  if (!selectedTlds.value.length) return setStatus(isZh.value ? '至少选一个后缀' : 'Pick at least one TLD', 'err')

  // 按套餐上限截断排名数量 M
  const names = limits.rankMax === Infinity ? all : all.slice(0, limits.rankMax)
  const truncated = names.length < all.length

  running.value = true
  resetRun()
  setStatus(
    isZh.value
      ? `正在查询你的 ${names.length} 个候选(域名 + 撞名)…${truncated ? `(已按上限 ${limits.rankMax} 个截断)` : ''}`
      : `Checking your ${names.length} candidates (domains + collision)…${truncated ? ` (capped at ${limits.rankMax})` : ''}`,
    'run',
  )
  const pending: Promise<unknown>[] = []
  names.forEach((n) => intakeCandidate(n, isZh.value ? '(你提供的候选)' : '(your candidate)', pending))
  try {
    await Promise.allSettled(pending)
  } catch {
    /* ignore */
  }
  await finishRound()
  running.value = false
}

// ---------------- 排序 / 分组视图 ----------------
function cardScore(rec: Rec): number {
  const vals = Object.values(rec.domains)
  const availCount = vals.filter((s) => s === 'available').length
  const comAvail = Object.entries(rec.domains).some(([d, s]) => d.endsWith('.com') && s === 'available')
  let score = 0
  if (!rec.risk) score += 1000
  if (availCount > 0) score += 500
  score += availCount * 30
  if (comAvail) score += 60
  score += Math.max(0, 16 - (rec.name || '').length) * 2
  return score
}
const isBad = (r: Rec) => r.risk || !Object.values(r.domains).includes('available')

// 未整理前按到达顺序;整理后好候选排前、差候选进折叠组
const goodRecs = computed(() =>
  arranged.value ? records.value.filter((r) => !isBad(r)).sort((a, b) => cardScore(b) - cardScore(a)) : records.value,
)
const badRecs = computed(() =>
  arranged.value ? records.value.filter((r) => isBad(r)).sort((a, b) => cardScore(b) - cardScore(a)) : [],
)
const medals = ['🥇', '🥈', '🥉']
function rankLabel(i: number): string {
  return i < 3 ? medals[i] : '#' + (i + 1)
}

function openLink(url: string) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="dn-page">
    <!-- Hero -->
    <div class="dn-hero">
      <div class="dn-hero-bg" />
      <div class="dn-hero-content">
        <div class="dn-hero-badge">
          <VaIcon name="dns" size="14px" />
          <span>{{ t('domainNamerPage.badge') }}</span>
        </div>
        <h1 class="dn-hero-title">
          {{ t('domainNamerPage.heroTitleMain') }}<br />
          <span class="dn-hero-accent">{{ t('domainNamerPage.heroTitleAccent') }}</span>
        </h1>
        <p class="dn-hero-subtitle">{{ t('domainNamerPage.heroSubtitle') }}</p>
      </div>
    </div>

    <div class="dn-body">
      <!-- 输入区 -->
      <div class="dn-card">
        <label class="dn-label">{{ t('domainNamerPage.needLabel') }}</label>
        <textarea v-model="need" class="dn-textarea" :placeholder="t('domainNamerPage.needPlaceholder')" rows="3" />

        <label class="dn-label">{{ t('domainNamerPage.tldLabel') }}</label>
        <div class="dn-tldbar">
          <span v-for="(tld, i) in tlds" :key="tld.ext" class="dn-tld" :class="{ on: tld.on }" @click="toggleTld(i)">
            {{ tld.ext }}
            <span v-if="tld.custom" class="dn-x" @click.stop="delTld(i)">×</span>
          </span>
        </div>
        <div class="dn-tldadd">
          <input
            v-model="tldInput"
            class="dn-input"
            :placeholder="t('domainNamerPage.tldAddPlaceholder')"
            @keydown.enter="addTld"
          />
          <VaButton preset="secondary" @click="addTld">{{ t('domainNamerPage.tldAddBtn') }}</VaButton>
        </div>

        <label class="dn-check">
          <input v-model="autofill" type="checkbox" />
          {{ t('domainNamerPage.autofillLabel') }}
        </label>
        <div v-if="autofill" class="dn-autofill">
          <label class="dn-label">{{ t('domainNamerPage.autofillTargetLabel') }}</label>
          <input v-model.number="autofillN" class="dn-input dn-num" type="number" min="1" :max="limits.autofillMax" />
          <div class="dn-hint">{{ t('domainNamerPage.autofillHint') }}</div>
        </div>

        <VaButton class="dn-go" :loading="running" :disabled="running" @click="run">
          {{ t('domainNamerPage.runBtn') }}
        </VaButton>

        <div v-if="statusMsg" class="dn-status" :class="statusCls">{{ statusMsg }}</div>
      </div>

      <!-- 已有候选排名 -->
      <details class="dn-card dn-details">
        <summary>{{ t('domainNamerPage.haveCandidates') }}</summary>
        <label class="dn-label">{{ t('domainNamerPage.myNamesLabel') }}</label>
        <textarea
          v-model="myNames"
          class="dn-textarea"
          :placeholder="t('domainNamerPage.myNamesPlaceholder')"
          rows="3"
        />
        <VaButton class="dn-go" preset="secondary" :disabled="running" @click="rankUserNames">
          {{ t('domainNamerPage.rankBtn') }}
        </VaButton>
      </details>

      <!-- 综合推荐 -->
      <div v-if="recoShow" class="dn-card dn-reco">
        <div class="dn-reco-h">
          <VaIcon name="explore" size="16px" />
          {{ t('domainNamerPage.recoTitle') }}
        </div>
        <div class="dn-reco-body">{{ recoText }}</div>
        <VaButton
          v-if="showMore && limits.continueRecommend"
          class="dn-go"
          preset="secondary"
          :disabled="running"
          @click="continueRecommend"
        >
          {{ t('domainNamerPage.moreBtn') }}
        </VaButton>
      </div>

      <!-- 结果列表 -->
      <div class="dn-results">
        <div v-for="(rec, i) in goodRecs" :key="rec.id" class="dn-namecard">
          <div class="dn-nc-top">
            <div>
              <div class="dn-name">
                <span v-if="arranged" class="dn-rank" :class="{ medal: i < 3 }">{{ rankLabel(i) }}</span>
                {{ rec.name }}
              </div>
              <div class="dn-reason">{{ rec.reason }}</div>
            </div>
            <span v-if="rec.brand !== 'hidden'" class="dn-brand" :class="rec.brand">
              <template v-if="rec.brand === 'checking'">{{ t('domainNamerPage.brandChecking') }}</template>
              <template v-else-if="rec.brand === 'risk'">{{ t('domainNamerPage.brandClash') }}</template>
              <template v-else-if="rec.brand === 'clear'">{{ t('domainNamerPage.brandClear') }}</template>
              <template v-else>{{ t('domainNamerPage.brandFailed') }}</template>
            </span>
          </div>
          <div class="dn-tldrow">
            <span v-for="(st, dom) in rec.domains" :key="dom" class="dn-dchip" :class="st">
              <span class="dn-dot" :class="st" />
              <span class="dn-tn">{{ dom }}</span>
              <span v-if="st === 'registered' && rec.regYears[dom]" class="dn-traf"
                >· {{ rec.regYears[dom] }}{{ t('domainNamerPage.regYearSuffix') }}</span
              >
              <span v-else-if="st === 'unknown'" class="dn-traf warn">· {{ t('domainNamerPage.unknownTag') }}</span>
            </span>
          </div>
          <div v-if="rec.brand === 'risk'" class="dn-brandhint">
            {{ rec.brandWhy }}<template v-if="rec.brandTitle">：{{ rec.brandTitle }}</template>
            <a v-if="rec.brandLink" href="#" @click.prevent="openLink(rec.brandLink)">{{
              t('domainNamerPage.viewLink')
            }}</a>
          </div>
        </div>

        <!-- 折叠:已占用 / 撞名 -->
        <div v-if="arranged && badRecs.length" class="dn-card dn-badgroup">
          <div class="dn-badhead" @click="badOpen = !badOpen">
            {{ badOpen ? '▾' : '▸' }} {{ t('domainNamerPage.takenGroup', { n: badRecs.length }) }}
          </div>
          <div v-show="badOpen" class="dn-badbody">
            <div v-for="rec in badRecs" :key="rec.id" class="dn-namecard">
              <div class="dn-nc-top">
                <div>
                  <div class="dn-name">{{ rec.name }}</div>
                  <div class="dn-reason">{{ rec.reason }}</div>
                </div>
                <span v-if="rec.brand !== 'hidden'" class="dn-brand" :class="rec.brand">
                  <template v-if="rec.brand === 'risk'">{{ t('domainNamerPage.brandClash') }}</template>
                  <template v-else-if="rec.brand === 'clear'">{{ t('domainNamerPage.brandClear') }}</template>
                  <template v-else-if="rec.brand === 'checking'">{{ t('domainNamerPage.brandChecking') }}</template>
                  <template v-else>{{ t('domainNamerPage.brandFailed') }}</template>
                </span>
              </div>
              <div class="dn-tldrow">
                <span v-for="(st, dom) in rec.domains" :key="dom" class="dn-dchip" :class="st">
                  <span class="dn-dot" :class="st" />
                  <span class="dn-tn">{{ dom }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div class="dn-legend">
        <span><span class="dn-dot available" /> {{ t('domainNamerPage.legendAvailable') }}</span>
        <span><span class="dn-dot registered" /> {{ t('domainNamerPage.legendRegistered') }}</span>
        <span><span class="dn-dot unknown" /> {{ t('domainNamerPage.legendUnknown') }}</span>
        <span
          ><span class="dn-brand clear dn-legend-pill">{{ t('domainNamerPage.brandClear') }}</span></span
        >
        <span
          ><span class="dn-brand risk dn-legend-pill">{{ t('domainNamerPage.brandClash') }}</span></span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.dn-page {
  color: var(--va-text-primary);
}

/* Hero */
.dn-hero {
  position: relative;
  margin: -1rem -1rem 0;
  padding: 3rem 1.5rem 2.5rem;
  overflow: hidden;
  text-align: center;
}
.dn-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  opacity: 0.12;
}
.dn-hero-content {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
}
.dn-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(168, 85, 247, 0.14);
  color: #a855f7;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.dn-hero-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 10px;
}
.dn-hero-accent {
  background: linear-gradient(90deg, #a855f7, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dn-hero-subtitle {
  color: var(--va-text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.dn-body {
  margin: 0 -1rem;
  padding: 1.5rem 1rem 3rem;
  max-width: 920px;
  margin-left: auto;
  margin-right: auto;
}

.dn-card {
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.dn-label {
  display: block;
  font-size: 12px;
  color: var(--va-text-secondary);
  margin: 14px 0 5px;
}
.dn-label:first-child {
  margin-top: 0;
}
.dn-textarea,
.dn-input {
  width: 100%;
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-border, rgba(0, 0, 0, 0.15));
  border-radius: 8px;
  color: var(--va-text-primary);
  padding: 9px 11px;
  font-size: 13px;
  font-family: inherit;
}
.dn-textarea {
  resize: vertical;
  min-height: 70px;
}

.dn-tldbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dn-tld {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--va-background-element, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--va-background-border, rgba(0, 0, 0, 0.15));
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}
.dn-tld.on {
  background: rgba(99, 102, 241, 0.16);
  border-color: #6366f1;
  color: #6366f1;
}
.dn-x {
  color: var(--va-text-secondary);
  font-weight: 700;
}
.dn-tldadd {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.dn-tldadd .dn-input {
  flex: 1;
}

.dn-check {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 16px;
  font-size: 13px;
  color: var(--va-text-primary);
}
.dn-autofill {
  margin-top: 8px;
}
.dn-num {
  width: 140px;
}
.dn-hint {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 4px;
}

.dn-go {
  margin-top: 18px;
  width: 100%;
}

.dn-status {
  font-size: 13px;
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
}
.dn-status.run {
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
}
.dn-status.ok {
  background: rgba(16, 185, 129, 0.14);
  color: #10b981;
}
.dn-status.err {
  background: rgba(248, 81, 73, 0.14);
  color: #f85149;
}

.dn-details summary {
  cursor: pointer;
  font-size: 13px;
  color: var(--va-text-secondary);
  user-select: none;
}

/* 推荐 */
.dn-reco-h {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  margin-bottom: 10px;
}
.dn-reco-body {
  white-space: pre-wrap;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--va-text-primary);
}

/* 结果卡片 */
.dn-namecard {
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
}
.dn-nc-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.dn-name {
  font-size: 18px;
  font-weight: 700;
}
.dn-rank {
  margin-right: 6px;
  font-size: 14px;
}
.dn-rank.medal {
  font-size: 18px;
}
.dn-reason {
  color: var(--va-text-secondary);
  font-size: 13px;
  margin-top: 4px;
}

.dn-brand {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.dn-brand.checking {
  background: var(--va-background-element, rgba(0, 0, 0, 0.05));
  color: var(--va-text-secondary);
}
.dn-brand.clear {
  background: rgba(16, 185, 129, 0.14);
  color: #10b981;
}
.dn-brand.risk {
  background: rgba(227, 179, 65, 0.18);
  color: #d99e00;
}
.dn-brand.error {
  background: var(--va-background-element, rgba(0, 0, 0, 0.05));
  color: var(--va-text-secondary);
}

.dn-tldrow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.dn-dchip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--va-background-element, rgba(0, 0, 0, 0.04));
  border: 1px solid var(--va-background-border, rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 13px;
}
.dn-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  background: var(--va-text-secondary);
}
.dn-dot.checking {
  background: #888;
  animation: dn-pulse 1s infinite;
}
.dn-dot.available {
  background: #10b981;
}
.dn-dot.registered {
  background: #f85149;
}
.dn-dot.unknown {
  background: #e3b341;
}
@keyframes dn-pulse {
  50% {
    opacity: 0.35;
  }
}
.dn-traf {
  color: var(--va-text-secondary);
  font-size: 11px;
}
.dn-traf.warn {
  color: #d99e00;
}

.dn-brandhint {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 8px;
}
.dn-brandhint a {
  color: #6366f1;
  margin-left: 6px;
}

.dn-badgroup {
  padding: 0;
  overflow: hidden;
}
.dn-badhead {
  cursor: pointer;
  padding: 14px 18px;
  font-size: 13px;
  color: var(--va-text-secondary);
  user-select: none;
}
.dn-badbody {
  padding: 0 14px 6px;
}

.dn-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 10px;
}
.dn-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.dn-legend-pill {
  font-size: 11px;
}

@media (max-width: 600px) {
  .dn-hero-title {
    font-size: 1.5rem;
  }
}
</style>
