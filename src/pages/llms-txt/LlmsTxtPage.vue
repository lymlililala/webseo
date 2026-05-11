<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'tools' | 'templates' | 'guide'>('tools')

// ── 外部工具（分类聚合）────────────────────────────────────────
const toolGroups = [
  {
    label: '自动生成（输入 URL）',
    color: '#6366F1',
    icon: 'auto_awesome',
    tools: [
      {
        name: 'LLMrefs 生成器',
        url: 'https://llmrefs.com/llms-txt-generator',
        desc: '粘贴网站 URL，一键抓取并生成 llms.txt，支持在线托管与自动更新',
        badge: '推荐',
        badgeColor: '#6366F1',
      },
      {
        name: 'llmstxt.io',
        url: 'https://llmstxt.io',
        desc: '输入 URL 自动爬取生成，支持在线编辑后下载，操作简单',
        badge: '',
        badgeColor: '',
      },
      {
        name: 'Firecrawl llms.txt',
        url: 'https://www.firecrawl.dev/llmstxt',
        desc: '基于 Firecrawl 爬虫引擎，支持复杂 SPA 网站，生成质量高',
        badge: '技术向',
        badgeColor: '#F59E0B',
      },
      {
        name: 'WordLift llms.txt Generator',
        url: 'https://wordlift.io/llms-txt-generator/',
        desc: '面向 SEO/内容营销从业者，结合结构化数据生成',
        badge: '',
        badgeColor: '',
      },
    ],
  },
  {
    label: '手动填写生成',
    color: '#10B981',
    icon: 'edit_note',
    tools: [
      {
        name: 'llms-txt.com 生成器',
        url: 'https://llms-txt.com/generator',
        desc: '规范官网自带生成器，手动填写各字段，直接复制下载',
        badge: '规范源',
        badgeColor: '#10B981',
      },
      {
        name: 'Geordy.ai',
        url: 'https://geordy.ai',
        desc: 'GEO 优化平台内置 llms.txt 编辑器，配合 AI 内容策略使用',
        badge: '',
        badgeColor: '',
      },
      {
        name: 'SiteSpeakAI llms.txt',
        url: 'https://sitespeak.ai/tools/llms-txt-generator',
        desc: '在线表单式生成，填写网站信息后一键导出',
        badge: '',
        badgeColor: '',
      },
    ],
  },
  {
    label: '提交 & 索引平台',
    color: '#0EA5E9',
    icon: 'send',
    tools: [
      {
        name: 'LLMrefs 提交',
        url: 'https://llmrefs.com/submit',
        desc: '将你的 llms.txt 提交到 LLMrefs 索引，增加被 AI 引用的曝光',
        badge: '推荐',
        badgeColor: '#6366F1',
      },
      {
        name: 'llmstxt.io 目录',
        url: 'https://llmstxt.io/directory',
        desc: '收录已部署 llms.txt 的网站目录，可查看他人实例参考',
        badge: '',
        badgeColor: '',
      },
      {
        name: 'llms-txt.com 示例库',
        url: 'https://llms-txt.com/directory',
        desc: '规范官网维护的真实案例目录，涵盖各类网站类型',
        badge: '',
        badgeColor: '',
      },
    ],
  },
  {
    label: '验证 & 检查工具',
    color: '#EC4899',
    icon: 'verified',
    tools: [
      {
        name: 'llms.txt Validator',
        url: 'https://llmstxt.io/validate',
        desc: '输入 URL 或粘贴内容，检查 llms.txt 格式是否符合规范',
        badge: '',
        badgeColor: '',
      },
      {
        name: 'llms-txt.com Checker',
        url: 'https://llms-txt.com/checker',
        desc: '官方格式检查器，同时给出优化建议',
        badge: '',
        badgeColor: '',
      },
    ],
  },
]

// ── 模板数据 ──────────────────────────────────────────────────
const templates = [
  {
    id: 'saas',
    label: 'SaaS 产品',
    icon: 'cloud',
    color: '#6366F1',
    desc: '适合 SaaS 平台、Web 应用',
    preview:
      '# 产品名称\n\n> 一句话描述你的 SaaS 产品核心价值\n\n## 核心功能\n- [功能A](https://example.com/features/a): 主要功能描述\n- [功能B](https://example.com/features/b): 次要功能描述\n\n## 定价\n- [定价页面](https://example.com/pricing): 免费版与付费版对比\n\n## 文档\n- [快速开始](https://example.com/docs/start): 5分钟上手指南\n- [API参考](https://example.com/docs/api): 完整接口文档\n\n## Optional\n- [博客](https://example.com/blog): 产品更新与行业洞察',
  },
  {
    id: 'ecommerce',
    label: '电商/零售',
    icon: 'shopping_cart',
    color: '#10B981',
    desc: '适合电商、品牌官网',
    preview:
      '# 品牌名称\n\n> 品牌定位与核心价值主张\n\n## 热销产品\n- [产品A](https://example.com/products/a): 产品核心卖点\n- [产品B](https://example.com/products/b): 产品核心卖点\n\n## 品牌故事\n- [关于我们](https://example.com/about): 品牌历史与理念\n\n## 服务保障\n- [售后服务](https://example.com/service): 退换货政策\n- [联系我们](https://example.com/contact): 客服支持\n\n## Optional\n- [新品上架](https://example.com/new): 最新产品',
  },
  {
    id: 'content',
    label: '内容/媒体',
    icon: 'article',
    color: '#F59E0B',
    desc: '适合博客、内容站、媒体',
    preview:
      '# 站点名称\n\n> 内容定位：聚焦领域、受众群体、核心价值\n\n## 精选内容\n- [文章A](https://example.com/article-a): 内容简介\n- [文章B](https://example.com/article-b): 内容简介\n\n## 分类专题\n- [专题一](https://example.com/topic/1): 专题说明\n\n## 关于\n- [关于作者](https://example.com/about): 作者背景与专业领域\n\n## Optional\n- [Newsletter](https://example.com/newsletter): 订阅周刊',
  },
  {
    id: 'enterprise',
    label: '企业官网',
    icon: 'business',
    color: '#0EA5E9',
    desc: '适合 B2B 企业、机构',
    preview:
      '# 公司名称\n\n> 公司业务描述：服务对象、核心能力、市场定位\n\n## 核心业务\n- [服务A](https://example.com/services/a): 服务描述\n- [服务B](https://example.com/services/b): 服务描述\n\n## 解决方案\n- [行业方案](https://example.com/solutions): 面向特定行业的解决方案\n\n## 关于公司\n- [公司简介](https://example.com/about): 成立时间、规模、荣誉\n- [团队](https://example.com/team): 核心团队介绍\n\n## Optional\n- [案例](https://example.com/cases): 成功案例',
  },
  {
    id: 'tool',
    label: '工具/开源',
    icon: 'build_circle',
    color: '#EC4899',
    desc: '适合开发者工具、开源项目',
    preview:
      '# 工具名称\n\n> 工具功能一句话描述：解决什么问题、适合谁用\n\n## 快速开始\n- [安装指南](https://example.com/install): 5步安装\n- [基础用法](https://example.com/usage): 基本使用示例\n\n## 文档\n- [API文档](https://example.com/api): 完整API参考\n- [配置项](https://example.com/config): 所有配置说明\n\n## 社区\n- [GitHub](https://github.com/user/repo): 源码、Issue、PR\n\n## Optional\n- [更新日志](https://example.com/changelog): 版本历史',
  },
]

// ── 复制模板内容 ──────────────────────────────────────────────
const copyingId = ref('')
async function copyTemplate(tpl: (typeof templates)[0]) {
  copyingId.value = tpl.id
  await navigator.clipboard.writeText(tpl.preview)
  setTimeout(() => (copyingId.value = ''), 2000)
}
</script>

<template>
  <div class="llms-page">
    <!-- ── Hero ──────────────────────────────────────────── -->
    <div class="llms-hero">
      <div class="llms-hero-bg" />
      <div class="llms-hero-content">
        <div class="llms-hero-badge">
          <VaIcon name="description" size="14px" />
          <span>llms.txt · AI 可读网站名片</span>
        </div>
        <h1 class="llms-hero-title">llms.txt<br /><span class="llms-hero-accent">工具导航</span></h1>
        <p class="llms-hero-sub">
          类似 <strong>robots.txt</strong>，但专为 <strong>AI 大模型</strong> 设计——告诉 ChatGPT、Perplexity、Gemini
          你的网站有什么。 由 <strong>Jeremy Howard（fast.ai）</strong> 于 2024 年提出，已成为 GEO/AEO
          生态基础设施标准。
        </p>
        <div class="llms-stats">
          <div class="llms-stat">
            <span class="llms-stat-n">2024</span><span class="llms-stat-l">📅 规范发布年</span>
          </div>
          <div class="llms-stat-sep" />
          <div class="llms-stat">
            <span class="llms-stat-n">{{ toolGroups.reduce((s, g) => s + g.tools.length, 0) }}</span
            ><span class="llms-stat-l">🔧 收录工具</span>
          </div>
          <div class="llms-stat-sep" />
          <div class="llms-stat">
            <span class="llms-stat-n">{{ templates.length }}</span
            ><span class="llms-stat-l">📋 内置模板</span>
          </div>
          <div class="llms-stat-sep" />
          <div class="llms-stat"><span class="llms-stat-n">免费</span><span class="llms-stat-l">✨ 全部免费</span></div>
        </div>
        <div class="llms-concept-bar">
          <div class="llms-ci">
            <VaIcon name="description" size="14px" color="#60A5FA" /><span
              ><strong>llms.txt</strong> = AI 可读结构标准</span
            >
          </div>
          <span class="llms-sep">·</span>
          <div class="llms-ci">
            <VaIcon name="smart_toy" size="14px" color="#A78BFA" /><span><strong>GEO/AEO</strong> 基础设施必备</span>
          </div>
          <span class="llms-sep">·</span>
          <div class="llms-ci">
            <VaIcon name="bolt" size="14px" color="#FCD34D" /><span>格式：Markdown + 链接列表</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tab 导航 ─────────────────────────────────────── -->
    <div class="llms-tabs">
      <button class="llms-tab" :class="{ active: activeTab === 'tools' }" @click="activeTab = 'tools'">
        <VaIcon name="grid_view" size="14px" />工具推荐
      </button>
      <button class="llms-tab" :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'">
        <VaIcon name="description" size="14px" />模板库
      </button>
      <button class="llms-tab" :class="{ active: activeTab === 'guide' }" @click="activeTab = 'guide'">
        <VaIcon name="menu_book" size="14px" />格式指南
      </button>
    </div>

    <!-- ── 工具推荐 Tab ────────────────────────────────────── -->
    <div v-if="activeTab === 'tools'" class="llms-tools-body">
      <div v-for="group in toolGroups" :key="group.label" class="llms-tool-group">
        <div class="llms-group-hd">
          <div class="llms-group-icon" :style="{ background: group.color + '18' }">
            <VaIcon :name="group.icon" size="16px" :style="{ color: group.color }" />
          </div>
          <span class="llms-group-label">{{ group.label }}</span>
          <span class="llms-group-count">{{ group.tools.length }}</span>
        </div>
        <div class="llms-tool-grid">
          <a
            v-for="tool in group.tools"
            :key="tool.name"
            :href="tool.url"
            target="_blank"
            rel="noopener"
            class="llms-tool-card"
          >
            <div class="llms-tool-top">
              <span class="llms-tool-name">{{ tool.name }}</span>
              <span
                v-if="tool.badge"
                class="llms-tool-badge"
                :style="{
                  background: tool.badgeColor + '18',
                  color: tool.badgeColor,
                  borderColor: tool.badgeColor + '40',
                }"
                >{{ tool.badge }}</span
              >
            </div>
            <p class="llms-tool-desc">{{ tool.desc }}</p>
            <div class="llms-tool-footer">
              <span class="llms-tool-link">{{ tool.url.replace(/^https?:\/\//, '').split('/')[0] }}</span>
              <VaIcon name="open_in_new" size="12px" />
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- ── 模板库 Tab ─────────────────────────────────────── -->
    <div v-if="activeTab === 'templates'" class="llms-tpl-body">
      <p class="llms-tpl-intro">
        <VaIcon name="info_outline" size="14px" color="#60A5FA" />
        按行业分类的 llms.txt 模板，点击复制后粘贴到任意编辑器修改，再上传至网站根目录即可
      </p>
      <div class="llms-tpl-grid">
        <div v-for="tpl in templates" :key="tpl.id" class="llms-tpl-card" :style="{ '--tc': tpl.color }">
          <div class="llms-tpl-hd">
            <div class="llms-tpl-icon" :style="{ background: tpl.color + '20' }">
              <VaIcon :name="tpl.icon" size="20px" :style="{ color: tpl.color }" />
            </div>
            <div>
              <h3 class="llms-tpl-name">{{ tpl.label }}</h3>
              <p class="llms-tpl-desc">{{ tpl.desc }}</p>
            </div>
          </div>
          <pre class="llms-tpl-preview">{{ tpl.preview }}</pre>
          <button
            class="llms-tpl-btn"
            :style="{ background: copyingId === tpl.id ? '#10B981' : tpl.color }"
            @click="copyTemplate(tpl)"
          >
            <VaIcon :name="copyingId === tpl.id ? 'check' : 'content_copy'" size="13px" />
            {{ copyingId === tpl.id ? '已复制！' : '复制模板' }}
          </button>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="llms-tpl-tip">
        <VaIcon name="lightbulb_outline" size="15px" color="#F59E0B" />
        <div>
          <strong>如何使用模板</strong>
          <ol>
            <li>点击"复制模板"将内容复制到剪贴板</li>
            <li>粘贴到任意文本编辑器，按实际情况修改网站名称、链接和描述</li>
            <li>将文件保存为 <code>llms.txt</code>，上传到网站根目录</li>
            <li>访问 <code>https://yoursite.com/llms.txt</code> 验证可访问</li>
            <li>前往"工具推荐"→"提交 & 索引平台"提交收录</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- ── 格式指南 Tab ────────────────────────────────────── -->
    <div v-if="activeTab === 'guide'" class="llms-guide-body">
      <div class="llms-guide-grid">
        <!-- 什么是 llms.txt -->
        <div class="llms-gc llms-gc--wide">
          <div class="llms-gc-hd">
            <VaIcon name="help_outline" size="18px" color="#60A5FA" />
            <h3>什么是 llms.txt？</h3>
          </div>
          <p>
            <code>llms.txt</code> 是放在网站根目录的纯文本文件，专门为 AI 大模型设计——告诉
            LLM"<strong>我这个网站是做什么的、哪些页面值得读、如何理解我</strong>"。
          </p>
          <p>
            由 <strong>Jeremy Howard（fast.ai 创始人）</strong> 于 2024 年提出，类比
            <code>robots.txt</code> 给搜索引擎爬虫，<code>llms.txt</code> 是给 AI 模型的语义索引。目前已有
            Cloudflare、Anthropic、Perplexity 等生态工具支持读取。
          </p>
        </div>

        <!-- 格式规范 -->
        <div class="llms-gc">
          <div class="llms-gc-hd">
            <VaIcon name="code" size="18px" color="#A78BFA" />
            <h3>标准格式</h3>
          </div>
          <pre class="llms-code">
# 网站名称

&gt; 一句话描述这个网站是做什么的

## 核心页面
- [页面名](URL): 简短说明
- [关于我们](https://example.com/about): 公司介绍

## 产品/服务
- [产品A](https://example.com/product): 功能说明

## Optional
- [博客](https://example.com/blog): 内容文章</pre
          >
          <p class="llms-note">格式极简：Markdown + 链接列表，LLM 一眼就能读懂网站结构</p>
        </div>

        <!-- 最佳实践 -->
        <div class="llms-gc">
          <div class="llms-gc-hd">
            <VaIcon name="tips_and_updates" size="18px" color="#10B981" />
            <h3>写作最佳实践</h3>
          </div>
          <ul class="llms-best">
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span
                ><strong>一句话描述要精准</strong>：包含业务类型 + 目标用户 + 核心价值</span
              >
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span
                ><strong>链接描述要具体</strong>：避免"查看更多"，要写清楚页面内容</span
              >
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span
                ><strong>用 Optional 区分优先级</strong>：核心内容在前，次要内容放 Optional</span
              >
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span
                ><strong>保持简洁</strong>：每个章节 3-8 个链接最佳</span
              >
            </li>
            <li>
              <VaIcon name="check_circle" size="13px" color="#10B981" /><span
                ><strong>定期更新</strong>：网站重大改版后同步更新 llms.txt</span
              >
            </li>
          </ul>
        </div>

        <!-- 部署方式 -->
        <div class="llms-gc">
          <div class="llms-gc-hd">
            <VaIcon name="cloud_upload" size="18px" color="#F59E0B" />
            <h3>如何部署</h3>
          </div>
          <ol class="llms-steps">
            <li>
              <span class="llms-step-n">1</span><span>参考模板库，编写或复制适合你的 <code>llms.txt</code> 内容</span>
            </li>
            <li>
              <span class="llms-step-n">2</span><span>将文件上传到网站根目录（与 <code>robots.txt</code> 同级）</span>
            </li>
            <li>
              <span class="llms-step-n">3</span><span>验证可访问：<code>https://yoursite.com/llms.txt</code></span>
            </li>
            <li><span class="llms-step-n">4</span><span>提交到 LLMrefs、llmstxt.io 等平台收录索引</span></li>
          </ol>
        </div>

        <!-- 与 robots.txt 对比 -->
        <div class="llms-gc llms-gc--wide">
          <div class="llms-gc-hd">
            <VaIcon name="compare_arrows" size="18px" color="#EC4899" />
            <h3>与 robots.txt 的对比</h3>
          </div>
          <div class="llms-cmp-table">
            <div class="llms-cmp-row llms-cmp-hd"><span>维度</span><span>robots.txt</span><span>llms.txt</span></div>
            <div class="llms-cmp-row"><span>目标读者</span><span>搜索引擎爬虫</span><span>AI 大模型（LLM）</span></div>
            <div class="llms-cmp-row"><span>核心功能</span><span>控制爬取权限</span><span>提供语义理解</span></div>
            <div class="llms-cmp-row"><span>格式</span><span>指令式语法</span><span>Markdown 描述</span></div>
            <div class="llms-cmp-row"><span>提出时间</span><span>1994 年</span><span>2024 年</span></div>
            <div class="llms-cmp-row">
              <span>GEO/AEO 作用</span><span>间接影响</span><span>直接提升 AI 引用率</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Root ──────────────────────────────────────────────── */
.llms-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ──────────────────────────────────────────────── */
.llms-hero {
  background: linear-gradient(135deg, #0a1628 0%, #0f2847 45%, #0a1e3a 100%);
  padding: 2.5rem 2rem 2rem;
  margin: -1rem -1rem 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.llms-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 50% at 80% 20%, rgba(96, 165, 250, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 15% 80%, rgba(167, 139, 250, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.llms-hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}
.llms-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: #93c5fd;
  padding: 4px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.9rem;
}
.llms-hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 0.7rem;
  letter-spacing: -0.5px;
}
.llms-hero-accent {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.llms-hero-sub {
  color: #bfdbfe;
  font-size: 0.92rem;
  line-height: 1.75;
  margin-bottom: 1.3rem;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
}
.llms-hero-sub strong {
  color: #93c5fd;
}

/* Stats */
.llms-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.llms-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.2rem;
}
.llms-stat-n {
  font-size: 1.4rem;
  font-weight: 700;
  color: #93c5fd;
  line-height: 1.1;
}
.llms-stat-l {
  font-size: 0.7rem;
  color: #818cf8;
  margin-top: 2px;
  white-space: nowrap;
}
.llms-stat-sep {
  width: 1px;
  height: 28px;
  background: rgba(96, 165, 250, 0.25);
}

/* Concept bar */
.llms-concept-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.75rem;
  color: #bfdbfe;
  margin-top: 0.7rem;
}
.llms-ci {
  display: flex;
  align-items: center;
  gap: 4px;
}
.llms-sep {
  color: rgba(191, 219, 254, 0.35);
}

/* ── Tabs ──────────────────────────────────────────────── */
.llms-tabs {
  display: flex;
  padding: 1rem 1.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
  background: var(--va-background-primary);
  flex-shrink: 0;
}
.llms-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 18px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--va-secondary);
  transition: all 0.15s;
  margin-bottom: -1px;
}
.llms-tab:hover {
  color: var(--va-text-primary);
}
.llms-tab.active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
  font-weight: 600;
}

/* ── Tools Tab ─────────────────────────────────────────── */
.llms-tools-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.llms-tool-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.llms-group-hd {
  display: flex;
  align-items: center;
  gap: 8px;
}
.llms-group-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.llms-group-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--va-text-primary);
}
.llms-group-count {
  font-size: 0.7rem;
  color: var(--va-secondary);
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-border);
  padding: 1px 7px;
  border-radius: 10px;
}
.llms-tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}
.llms-tool-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  background: var(--va-background-primary);
  text-decoration: none;
  transition: all 0.15s;
  position: relative;
}
.llms-tool-card:hover {
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 4px 16px rgba(96, 165, 250, 0.08);
  transform: translateY(-1px);
}
.llms-tool-top {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}
.llms-tool-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--va-text-primary);
}
.llms-tool-badge {
  font-size: 0.65rem;
  padding: 1px 7px;
  border-radius: 8px;
  border: 1px solid;
  font-weight: 600;
}
.llms-tool-desc {
  font-size: 0.78rem;
  color: var(--va-secondary);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}
.llms-tool-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}
.llms-tool-link {
  font-size: 0.72rem;
  color: #60a5fa;
  opacity: 0.8;
}
.llms-tool-footer .va-icon {
  color: var(--va-secondary);
  opacity: 0.5;
}

/* ── Templates Tab ─────────────────────────────────────── */
.llms-tpl-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.llms-tpl-intro {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.83rem;
  color: var(--va-secondary);
  margin: 0;
  line-height: 1.6;
  padding: 10px 14px;
  background: rgba(96, 165, 250, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 10px;
}
.llms-tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.llms-tpl-card {
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  background: var(--va-background-primary);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.18s;
}
.llms-tpl-card:hover {
  border-color: color-mix(in srgb, var(--tc) 40%, transparent);
  box-shadow: 0 4px 18px color-mix(in srgb, var(--tc) 10%, transparent);
}
.llms-tpl-hd {
  display: flex;
  align-items: center;
  gap: 10px;
}
.llms-tpl-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.llms-tpl-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--va-text-primary);
  margin: 0 0 2px;
}
.llms-tpl-desc {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin: 0;
}
.llms-tpl-preview {
  font-size: 0.72rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: var(--va-background-secondary);
  border-radius: 8px;
  padding: 10px;
  color: var(--va-secondary);
  line-height: 1.55;
  max-height: 140px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  overflow: hidden;
}
.llms-tpl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  opacity: 0.92;
}
.llms-tpl-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}

/* Template tip */
.llms-tpl-tip {
  display: flex;
  gap: 10px;
  padding: 16px 18px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  font-size: 0.82rem;
  color: var(--va-secondary);
  line-height: 1.6;
}
.llms-tpl-tip strong {
  color: var(--va-text-primary);
  display: block;
  margin-bottom: 6px;
}
.llms-tpl-tip ol {
  margin: 0;
  padding-left: 1.2rem;
}
.llms-tpl-tip li {
  margin-bottom: 3px;
}
.llms-tpl-tip code {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* ── Guide Tab ─────────────────────────────────────────── */
.llms-guide-body {
  padding: 1.5rem;
}
.llms-guide-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.llms-gc {
  border: 1px solid var(--va-background-border);
  border-radius: 12px;
  background: var(--va-background-primary);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.llms-gc--wide {
  grid-column: 1 / -1;
}
.llms-gc-hd {
  display: flex;
  align-items: center;
  gap: 8px;
}
.llms-gc-hd h3 {
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0;
  color: var(--va-text-primary);
}
.llms-gc p {
  font-size: 0.82rem;
  color: var(--va-secondary);
  line-height: 1.65;
  margin: 0;
}
.llms-gc p strong {
  color: var(--va-text-primary);
}
.llms-gc code {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}
.llms-code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.78rem;
  background: var(--va-background-secondary);
  border-radius: 8px;
  padding: 12px;
  color: #60a5fa;
  line-height: 1.65;
  white-space: pre-wrap;
  margin: 0;
  overflow-x: auto;
}
.llms-note {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin: 0;
  font-style: italic;
}
.llms-best {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.llms-best li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.8rem;
  color: var(--va-secondary);
  line-height: 1.5;
}
.llms-best li strong {
  color: var(--va-text-primary);
}
.llms-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.llms-steps li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--va-secondary);
  line-height: 1.5;
}
.llms-steps li code {
  background: var(--va-background-secondary);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.8em;
}
.llms-step-n {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 50%;
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Compare table */
.llms-cmp-table {
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
  overflow: hidden;
}
.llms-cmp-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
}
.llms-cmp-row > span {
  padding: 8px 12px;
  font-size: 0.78rem;
  color: var(--va-secondary);
  border-right: 1px solid var(--va-background-border);
  border-bottom: 1px solid var(--va-background-border);
}
.llms-cmp-row > span:last-child {
  border-right: none;
}
.llms-cmp-row:last-child > span {
  border-bottom: none;
}
.llms-cmp-hd > span {
  font-weight: 700;
  color: var(--va-text-primary);
  background: var(--va-background-secondary);
  font-size: 0.75rem;
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 900px) {
  .llms-guide-grid {
    grid-template-columns: 1fr;
  }
  .llms-gc--wide {
    grid-column: auto;
  }
}
@media (max-width: 640px) {
  .llms-hero-title {
    font-size: 1.8rem;
  }
  .llms-tpl-grid {
    grid-template-columns: 1fr;
  }
  .llms-tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
