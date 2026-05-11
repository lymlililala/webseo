-- ============================================================================
-- WEBSEO PROJECT - TOOLS DATA INSERT
-- Generated: 2026-05-11
-- 包含: Schema 工具、GEO 工具、AEO 工具 的完整数据
-- ============================================================================

-- ============================================================================
-- 1. SCHEMA TOOLS DATA
-- ============================================================================
INSERT INTO wseo_schema_tools (tool_id, name, url, description, highlights, tags, is_free, has_freeplan, pricing, level, is_official, badge, supported_types)
VALUES
(
  'merkle',
  'Merkle Schema Generator',
  'https://technicalseo.com/tools/schema-markup-generator/',
  '最受站长欢迎的免费 Schema 生成器，支持 20+ 类型，界面清晰，无需注册即可生成标准 JSON-LD 代码。',
  '["免费无需注册","20+ Schema类型","即时生成JSON-LD"]'::jsonb,
  '["全能","免费","JSON-LD"]'::jsonb,
  TRUE, FALSE, NULL, 'beginner', FALSE, '站长首选',
  '["article","faq","product","breadcrumb","howto","video","localbusiness","event","review","person","organization"]'::jsonb
),
(
  'google-rich-results',
  'Google Rich Results Test',
  'https://search.google.com/test/rich-results',
  'Google 官方出品的富结果验证工具，生成 Schema 代码后必须在此验证，确保符合 Google 索引标准并能获得富结果展示。',
  '["Google官方","验证富结果资格","实时预览效果"]'::jsonb,
  '["官方验证","Google","免费"]'::jsonb,
  TRUE, FALSE, NULL, 'beginner', TRUE, '官方必备',
  '["article","faq","product","breadcrumb","howto","video","recipe","review","event"]'::jsonb
),
(
  'schema-org-validator',
  'Schema.org Validator',
  'https://validator.schema.org/',
  'Schema.org 官方权威验证器，检查结构化数据是否完全符合 Schema.org 规范，是合规性验证的最终标准。',
  '["Schema.org官方","合规性权威验证","支持所有类型"]'::jsonb,
  '["官方验证","Schema.org","免费"]'::jsonb,
  TRUE, FALSE, NULL, 'advanced', TRUE, '权威验证',
  '["article","faq","product","breadcrumb","howto","video","recipe","localbusiness","event","review","person","organization"]'::jsonb
),
(
  'saijo-george',
  'Saijo George JSON-LD',
  'https://saijogeorge.com/json-ld-schema-generator/',
  '极简快速的 JSON-LD 生成器，界面简洁直观，无需注册，覆盖常用 Schema 类型，适合需要快速生成代码的场景。',
  '["极简快速","无需注册","界面直观"]'::jsonb,
  '["快速","免费","简洁"]'::jsonb,
  TRUE, FALSE, NULL, 'beginner', FALSE, NULL,
  '["article","faq","howto","product","localbusiness","review","event","person"]'::jsonb
),
(
  'hall-analysis',
  'Hall Analysis Article Schema',
  'https://hallanalysis.com/json-ld-generator/',
  '专注文章类 Schema 的精准生成器，字段覆盖完整，支持 Article、BlogPosting、NewsArticle 等文章子类型。',
  '["文章类型专精","子类型支持","字段完整"]'::jsonb,
  '["Article专项","免费","文章"]'::jsonb,
  TRUE, FALSE, NULL, 'beginner', FALSE, NULL,
  '["article"]'::jsonb
),
(
  'whitespark',
  'Whitespark Local Schema',
  'https://whitespark.ca/',
  'Whitespark 专为本地商家打造的 LocalBusiness Schema 生成器，字段覆盖全面，支持营业时间、服务区域、联系方式等本地 SEO 关键字段。',
  '["本地商家专精","营业时间支持","本地SEO必备"]'::jsonb,
  '["LocalBusiness","本地SEO","免费"]'::jsonb,
  TRUE, FALSE, NULL, 'beginner', FALSE, '本地SEO推荐',
  '["localbusiness"]'::jsonb
),
(
  'recipeschema',
  'RecipeSchema.org',
  'https://recipeschema.com/',
  '专为食谱网站设计的 Recipe Schema 生成器，支持食材、步骤、烹饪时间、营养信息等所有食谱相关字段。',
  '["食谱专属","营养信息支持","步骤结构化"]'::jsonb,
  '["Recipe专项","食谱","免费"]'::jsonb,
  TRUE, FALSE, NULL, 'beginner', FALSE, NULL,
  '["recipe"]'::jsonb
),
(
  'schema-app',
  'Schema App',
  'https://schemaapp.com/',
  '全自动企业级 Schema 管理平台，AI 自动识别页面类型并生成结构化数据，支持大规模网站批量部署，提供持续监测。',
  '["AI自动识别","企业级管理","批量部署监测"]'::jsonb,
  '["AI自动化","企业级","全自动"]'::jsonb,
  FALSE, FALSE, '$99/月起', 'auto', FALSE, '全自动',
  '["article","faq","product","breadcrumb","howto","video","localbusiness"]'::jsonb
),
(
  'wordlift',
  'WordLift',
  'https://wordlift.io/',
  'AI 驱动的内容知识图谱和 Schema 自动标注平台，能自动识别内容实体并生成结构化数据，同时构建网站知识图谱。',
  '["AI实体识别","知识图谱构建","内容语义分析"]'::jsonb,
  '["AI自动化","知识图谱","实体识别"]'::jsonb,
  FALSE, TRUE, '$49/月起', 'auto', FALSE, NULL,
  '["article","product","organization","person"]'::jsonb
),
(
  'rankmath',
  'RankMath',
  'https://rankmath.com/wordpress/plugin/seo-suite/',
  'WordPress 最流行的 SEO 插件，内置 Schema 自动生成模块，支持 20+ 类型，根据页面内容智能推荐 Schema 类型，设置一次持续生效。',
  '["WordPress专属","智能推荐类型","设置一次持续"]'::jsonb,
  '["WordPress","AI辅助","插件"]'::jsonb,
  FALSE, TRUE, '免费版 + Pro $59/年', 'auto', FALSE, 'WordPress推荐',
  '["article","faq","product","breadcrumb","howto","video","localbusiness","review","recipe"]'::jsonb
),
(
  'yoast',
  'Yoast SEO',
  'https://yoast.com/wordpress/plugins/seo/',
  'WordPress 老牌 SEO 插件，支持 Schema 自动生成，与 RankMath 并列为 WordPress 站长的两大首选，稳定可靠。',
  '["WordPress老牌","稳定可靠","自动生成"]'::jsonb,
  '["WordPress","Schema自动化","插件"]'::jsonb,
  FALSE, TRUE, '免费版 + Premium €99/年', 'auto', FALSE, NULL,
  '["article","faq","product","breadcrumb","howto","localbusiness"]'::jsonb
)
ON CONFLICT (tool_id) DO NOTHING;

-- ============================================================================
-- 2. GEO TOOLS DATA（国内 SaaS + 国内服务商 + 国际专项）
-- ============================================================================
INSERT INTO wseo_geo_tools (name, description, region, open_source, price, url, tags) VALUES

-- 国内 SaaS 工具
('AIDSO 爱搜', 'DSO（DeepSearch Optimization）+ GEO 双引擎平台。提供品牌在国内外主流 AI 搜索引擎中的可见度监测、提及率追踪、关键词优化建议，是国内 GEO 工具的参照标准。', 'cn', FALSE, 'freemium', 'https://geo.aidso.com', '["DSO","GEO双引擎","品牌监测","关键词追踪","国内标杆"]'::jsonb),
('透镜 GEO', '国内永久免费的 GEO 监测工具，操作简单易用。支持检测品牌在豆包、DeepSeek、元宝、Kimi、通义千问等主流国产 AI 中的可见度与提及情况。', 'cn', FALSE, 'free', 'https://geo.timus.cn', '["永久免费","国产AI覆盖","豆包","DeepSeek","快速上手"]'::jsonb),
('ImpetaAI', '上市公司慧辰股份旗下 GEO 监测平台，提供 50+ 项评估指标，覆盖豆包、DeepSeek、元宝、Kimi、通义千问 5 大国产 AI。支持多维度品牌可见度分析与竞品对比。', 'cn', FALSE, 'freemium', 'https://impetaai.hcr.com.cn', '["上市公司","50+指标","5大国产AI","竞品对比","慧辰股份"]'::jsonb),
('新榜智汇 GEOWISE', '新榜旗下 GEO 一体化平台，将内容创作、分发渠道和 AI 可见度监测三合一。覆盖 12 款主流 AI 平台，帮助品牌在 AI 内容生态中实现全链路布局。', 'cn', FALSE, 'paid', 'https://www.newrank.cn', '["新榜旗下","内容+分发+监测","12款AI平台","全链路布局"]'::jsonb),
('SheepGeo', '提供 SHEEP 五维评分体系，全面检测品牌在 9 大 AI 模型中的可见性。支持定时巡检、报告导出，有永久免费版可满足个人和小团队基础需求。', 'cn', FALSE, 'freemium', 'https://sheepgeo.com', '["SHEEP五维评分","9大AI模型","免费版","定时巡检","报告导出"]'::jsonb),
('GEO 多模态系统', '专门适配国内多模态 AI 场景的 GEO 系统，兼容 DeepSeek、豆包、元宝、通义千问、文心一言、Kimi 六大平台。支持图文多模态内容的 AI 可见度优化。', 'cn', FALSE, 'freemium', 'https://tp10.ymyhn.com', '["多模态","DeepSeek","豆包","元宝","文心一言","国产全覆盖"]'::jsonb),

-- 国内服务商工具
('移山科技', '国内 GEO 领域早期技术标杆，拥有 7 套自研系统，发布过 GEO 技术白皮书。提供完整的 GEO 战略咨询、内容优化和持续监测服务，技术深度业内领先。', 'cn', FALSE, 'paid', 'https://geokeji.com', '["GEO技术标杆","7套自研系统","技术白皮书","战略咨询"]'::jsonb),
('数珀 AI（Supro AI）', '宝洁、联合利华背景团队创立。提供网站雷达（AI可见度检测）和 AI 建站工具，擅长品牌在 AI 搜索场景下的内容策略与工具化建设。', 'cn', FALSE, 'freemium', 'https://suproai.com', '["宝洁背景","网站雷达","AI建站","品牌内容策略"]'::jsonb),
('万汇搜（移山文化）', '拥有专利技术，覆盖 500+ 行业，承诺 72 小时见效。提供免费诊断入口，适合快速启动 GEO 优化的中小企业。', 'cn', FALSE, 'freemium', 'https://wanhuys.com', '["专利技术","500+行业","72h见效","免费诊断"]'::jsonb),
('星辰汇 AI', '基于普林斯顿大学 GEO 研究（KDD 2024）的国内实践平台，专注垂直行业 GEO 优化与 AI 智能体集成，适合有技术基础的企业深度应用。', 'cn', FALSE, 'paid', 'https://starlinkgeo.cn', '["基于Princeton研究","垂直行业","智能体集成","技术派"]'::jsonb),
('传声港（杭州龙投）', '以内容投放见长，整合 128 家央媒资源和 15 万+ 自媒体矩阵，通过高权威媒体发稿提升品牌在 AI 引擎中的 E-E-A-T 信号与引用率。', 'cn', FALSE, 'paid', 'https://chuanshenggang.com', '["128家央媒","15万+自媒体","内容投放型","E-E-A-T建设"]'::jsonb),
('GEO 智达', '专注国内 AI 生态的 GEO 增长服务商，通过精准内容策略和多平台分发，帮助客户实现品牌在国产 AI 中的提及率平均提升 78%。', 'cn', FALSE, 'paid', 'https://geozhida.com', '["国内AI生态","品牌提及率+78%","多平台分发","增长服务"]'::jsonb),

-- 国际 GEO 专项工具
('LLMrefs', '聚焦关键词级别的 AI 搜索模式追踪，监测品牌在 ChatGPT、Perplexity、Claude 等 200+ 主流工具中的引用情况。同时提供全球最大 GEO 工具目录（200+ 工具收录）。', 'global', FALSE, 'freemium', 'https://llmrefs.com', '["关键词模式追踪","200+工具目录","$13.5/mo起","国际知名"]'::jsonb),
('Profound', 'G2 2026 企业级 AI 监测领导者，获得 Sequoia Capital 领投 5500 万美元融资。企业级 AI 答案监测平台，适合大规模品牌追踪 AI 搜索可见度，提供深度竞品分析。', 'global', FALSE, 'paid', 'https://tryprofound.com', '["Sequoia $55M融资","G2企业级领导者","企业级","竞品分析"]'::jsonb),
('Otterly.AI', '每日自动追踪品牌在 ChatGPT、Perplexity、Google AI Overviews 等平台的可见度，15000+ 用户选择，$29/月起价格亲民，提供竞品监测和内容优化建议。', 'global', FALSE, 'freemium', 'https://otterly.ai', '["每日追踪","$29/月","15000+用户","多平台监测"]'::jsonb),
('Peec AI', '德国团队开发的 AI Share of Voice 监测平台，代理商友好，支持白标报告。€89/月起，适合数字营销公司批量管理多客户的 AI 可见度数据。', 'global', FALSE, 'paid', 'https://peec.ai', '["德国团队","€89/月","代理商友好","白标报告","Share of Voice"]'::jsonb),
('AthenaHQ', '首创 QVEM（查询量估算模型）技术，提供 AI 搜索关键词的预测流量数据。$295/月定位高端市场，适合需要数据驱动决策的 SEO 和 GEO 团队。', 'global', FALSE, 'paid', 'https://athenahq.ai', '["QVEM查询量模型","$295/月","AI流量预测","高端定位"]'::jsonb),
('Rankscale', '采用积分制灵活追踪体系，用户按实际监测需求购买积分，无需绑定固定套餐。约 $20/月起，适合预算有限的中小企业灵活使用。', 'global', FALSE, 'freemium', 'https://rankscale.io', '["积分制灵活计费","~$20/月","按需购买","中小企业友好"]'::jsonb),
('AIclicks', '约 $39/月的 AI 可见度追踪与优化建议平台，不仅监测品牌出现情况，还提供针对性的内容优化建议，帮助用户将监测数据转化为实际改进行动。', 'global', FALSE, 'freemium', 'https://aiclicks.io', '["~$39/月","追踪+优化建议","内容改进指导","监测转化行动"]'::jsonb),
('AppearOnAI', '提供免费扫描入口，对 ChatGPT、Perplexity、Claude、Gemini 4 大 AI 引擎进行快速可见度审计，生成可视化报告，适合初次了解 GEO 现状的团队使用。', 'global', FALSE, 'freemium', 'https://appearonai.com', '["免费扫描","4大AI引擎审计","可视化报告","GEO入门"]'::jsonb),
('Geneo', '提供 Prompt（提示词）级别的历史追踪记录，可查看不同时间点、不同 Prompt 下 AI 对品牌的描述变化，帮助团队精确理解 AI 内容的演变趋势。', 'global', FALSE, 'freemium', 'https://geneo.app', '["Prompt级追踪","历史记录","AI描述演变","精细化分析"]'::jsonb),
('Passionfruit', '将 AI 搜索可见度与实际业务收入归因相关联，帮助品牌量化 GEO 优化的商业价值，建立 AI 搜索可见度与销售转化之间的数据链路。', 'global', FALSE, 'paid', 'https://getpassionfruit.com', '["可见度+收入归因","商业价值量化","转化关联","ROI分析"]'::jsonb),
('BrandLight', '集品牌监测与 AI 内容优化于一体，内置 AI 内容优化工具可直接生成符合 GEO 标准的优化内容建议，从发现问题到生成解决方案形成闭环。', 'global', FALSE, 'freemium', 'https://brandlight.ai', '["品牌监测","内置AI优化工具","内容生成","闭环优化"]'::jsonb),
('Goodie AI', '同时覆盖 AEO（答案引擎优化）和 AI 购物推荐可见度，自动识别内容缺口并生成优化建议，适合电商和 B2C 品牌在 AI 购物场景中提升曝光。', 'global', FALSE, 'freemium', 'https://goodie.ai', '["AEO","AI购物可见度","电商场景","内容缺口识别"]'::jsonb),
('Knowatoa', 'AI 搜索可见度与引用来源追踪平台，可分析 AI 答案中引用了哪些外部来源，帮助品牌理解竞品被引用的原因，找到内容建设的差距所在。', 'global', FALSE, 'freemium', 'https://knowatoa.com', '["引用来源分析","竞品被引原因","内容建设指导","来源追踪"]'::jsonb),

-- 传统 SEO 新增 GEO 模块
('Semrush AI Visibility', 'Semrush 在其旗舰 SEO 平台中新增 AI Visibility 模块，追踪品牌关键词在 Google AI Overviews、ChatGPT、Perplexity 中的出现频次，与传统 SEO 数据无缝整合。', 'global', FALSE, 'paid', 'https://www.semrush.com', '["Semrush","AI Visibility模块","SEO+GEO","Google AI概述"]'::jsonb),
('Ahrefs Brand Radar', 'Ahrefs 推出的 AI 搜索品牌追踪模块，监测品牌在多个 AI 搜索引擎中的提及率和引用情况，与 Ahrefs 丰富的反链和关键词数据融合使用效果更佳。', 'global', FALSE, 'paid', 'https://ahrefs.com/brand-radar', '["Ahrefs","Brand Radar","品牌追踪","反链联动"]'::jsonb),
('SE Ranking AI Overview Tracker', 'SE Ranking 新增 AI Overview 追踪功能，监测目标关键词在 Google AI 概述中的出现情况，并分析哪些内容被 AI 引用，提供优化建议。', 'global', FALSE, 'paid', 'https://seranking.com', '["SE Ranking","AI Overview追踪","Google优化","内容引用分析"]'::jsonb),
('Nightwatch AI Snippets', 'Nightwatch 在排名追踪基础上新增 AI Snippets 监测，追踪 SERP 中 AI 生成内容块的出现规律，帮助用户把握 Featured Snippet 到 AI Overview 的过渡趋势。', 'global', FALSE, 'paid', 'https://nightwatch.io', '["Nightwatch","AI Snippets","排名追踪","SERP特征"]'::jsonb),
('AccuRanker AccuLLM', 'AccuRanker 推出的 AccuLLM 模块，专为 GEO 设计的 LLM 可见度追踪系统，将传统关键词排名与 AI 引用情况并排对比，帮助用户发现 SEO 与 GEO 的协同机会。', 'global', FALSE, 'paid', 'https://accuranker.com', '["AccuRanker","AccuLLM","LLM可见度","SEO+GEO对比"]'::jsonb),
('Frase.io GEO Optimization', 'Frase 在其 AI 内容优化平台中融入 GEO 思路，分析 AI 答案中的高频引用内容结构，帮助用户优化 FAQ、How-to、结构化摘要，提升被 AI 引用的概率。', 'global', FALSE, 'paid', 'https://www.frase.io', '["Frase","AI内容优化","FAQ结构","How-to优化"]'::jsonb),
('BrightEdge Generative Parser', 'BrightEdge 企业级 SEO 平台推出 Generative Parser，实时解析 Google AI Overviews 内容，识别哪些来源被引用，为企业内容团队提供精准的 GEO 优化方向。', 'global', FALSE, 'paid', 'https://www.brightedge.com', '["BrightEdge","企业级","Generative Parser","AI概述解析"]'::jsonb),
('seoClarity AI Search Visibility', 'seoClarity 在企业 SEO 平台中新增 AI Search Visibility 功能，提供品牌在 AI 搜索中的市场份额分析、竞品对比和内容机会识别，面向大型企业用户。', 'global', FALSE, 'paid', 'https://www.seoclarity.net', '["seoClarity","企业级","AI搜索市场份额","竞品对比"]'::jsonb),
('Adobe LLM Optimizer', 'Adobe 推出的企业级 LLM 内容优化工具，帮助品牌优化数字资产在 LLM 训练和推理中的权重，与 Adobe Experience Cloud 深度集成，适合大型品牌内容运营。', 'global', FALSE, 'paid', 'https://business.adobe.com/products/experience-cloud.html', '["Adobe","LLM优化","Experience Cloud","企业内容运营"]'::jsonb),

-- 免费 GEO 工具
('透镜 GEO（免费版）', '永久免费的国内 GEO 监测入口，无需注册即可检测品牌在豆包、DeepSeek、Kimi 等主流国产 AI 中的可见度，是国内个人和小团队的首选免费工具。', 'cn', FALSE, 'free', 'https://geo.timus.cn', '["永久免费","无需注册","国产AI检测","个人首选"]'::jsonb),
('SheepGeo 免费检测', '提供 SHEEP 五维 GEO 免费检测，支持单次扫描 9 大 AI 模型可见度，生成基础诊断报告，适合快速了解 GEO 现状，无需付费即可上手。', 'cn', FALSE, 'free', 'https://sheepgeo.com', '["免费检测","SHEEP五维","9大AI模型","基础报告"]'::jsonb),
('HubSpot AI Search Grader', 'HubSpot 推出的免费 AI 搜索评分工具，输入品牌名称即可获得在 ChatGPT 等 AI 工具中的品牌情感、提及率和竞争对手对比评分，无需注册。', 'global', FALSE, 'free', 'https://www.hubspot.com/ai-search-grader', '["HubSpot","完全免费","品牌评分","情感分析","无需注册"]'::jsonb),
('llms.txt Generator（LLMrefs）', 'LLMrefs 提供的免费 llms.txt 生成工具，输入网站 URL 即可自动扫描并生成标准化 llms.txt 文件，同时提供 AI 爬虫可读性检测报告。', 'global', FALSE, 'free', 'https://llmrefs.com/tools/llms-txt-generator', '["llms.txt生成","免费工具","AI爬虫","自动扫描"]'::jsonb),
('AppearOnAI 免费扫描', '免费对 4 大 AI 引擎（ChatGPT、Perplexity、Claude、Gemini）进行品牌可见度快速审计，无需注册即可获得可视化报告，适合 GEO 入门快速摸底。', 'global', FALSE, 'free', 'https://appearonai.com', '["完全免费","4大AI引擎","可视化报告","GEO入门"]'::jsonb),

-- 开源 GEO 工具
('GTM Engineer Skills', 'Claude Code skill for improving website AEO/GEO scores — 16 foundational checks, 6 intelligence dimensions, framework-specific fixes. Based on structured AI optimization principles.', 'global', TRUE, 'free', 'https://github.com/onvoyage-ai/gtm-engineer-skills', '["AEO","GEO","Claude Code","llms.txt","结构化数据"]'::jsonb),
('GEO Optimizer Skill', 'GEO toolkit — audit, optimize websites for AI search engines (ChatGPT, Perplexity, Claude, Gemini). Based on Princeton KDD 2024 research. Python CLI + MCP support.', 'global', TRUE, 'free', 'https://github.com/Auriti-Labs/geo-optimizer-skill', '["Python","CLI","AI可见度","Schema标记","Princeton研究","MCP"]'::jsonb),
('Awesome GEO', 'Curated guide to Generative Engine Optimization resources: guides, tools & research to boost visibility in AI-powered search engines.', 'global', TRUE, 'free', 'https://github.com/amplifying-ai/awesome-generative-engine-optimization', '["Awesome List","GEO资源","研究论文","工具合集"]'::jsonb),
('aeo.js', 'Answer Engine Optimization for the modern web. Generates llms.txt, robots.txt, sitemap, JSON-LD. Supports Next.js, Nuxt, Astro, Vite.', 'global', TRUE, 'free', 'https://github.com/multivmlabs/aeo.js', '["TypeScript","Next.js","Nuxt","llms.txt","JSON-LD","npm包"]'::jsonb),
('Searchstack AEO', 'Open-source AEO/GEO/SEO CLI stack. Monitor visibility across Google, AI Overviews, ChatGPT, Perplexity, Claude & Grok. 22 commands, 9 APIs, llms.txt generator.', 'global', TRUE, 'free', 'https://github.com/alexpospekhov/searchstack-aeo', '["Python","CLI","22条命令","9个API","llms.txt"]'::jsonb),
('GEO/AEO Tracker', '开源、本地优先的 AI 可见度仪表板，免费自托管追踪品牌在 ChatGPT、Perplexity、Claude 等 AI 工具中的提及率与排名情况。', 'global', TRUE, 'free', 'https://github.com/danishashko/geo-aeo-tracker', '["开源","AI可见度","品牌监测","自托管","仪表板"]'::jsonb)

ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. AEO TOOLS DATA
-- ============================================================================
INSERT INTO wseo_aeo_tools (name, description, category, open_source, price, url, tags) VALUES

-- AEO 专项 SaaS 平台
('HeyAmos', 'Antler 投资的端到端 AEO 平台，以 AEO Playbook 驱动全流程优化，JAPAC 市场覆盖强，帮助品牌在 AI 引擎答案中系统化建立可见度。', 'aeo-saas', FALSE, 'paid', 'https://heyamos.com', '["AEO","Antler融资","JAPAC","AEO Playbook","端到端","品牌监测"]'::jsonb),
('Profound', 'Sequoia 5500 万美金融资的企业级 AEO 平台，SOC2+HIPAA 合规，支持 AI Agent 分析，帮助 Fortune 500 企业追踪并优化品牌在 AI 搜索中的表现。', 'aeo-saas', FALSE, 'paid', 'https://tryprofound.com', '["AEO","Sequoia融资","SOC2","HIPAA","企业级","Agent分析"]'::jsonb),
('AthenaHQ', 'YC 背书的 GEO/AEO 综合平台，内置 AI Copilot 自动推荐优化策略，独创 QVEM 查询量估算模型，帮助品牌量化 AI 搜索可见度增长机会。', 'aeo-saas', FALSE, 'paid', 'https://athenahq.ai', '["AEO","GEO","YC","AI Copilot","QVEM","查询量估算"]'::jsonb),
('Otterly.AI', 'AEO 监测入门首选，每日追踪 15+ Prompt，覆盖 ChatGPT、Perplexity、Gemini 等主流 AI 引擎，15000+ 用户使用，性价比最高的 AEO 入门工具。', 'aeo-saas', FALSE, 'freemium', 'https://otterly.ai', '["AEO","监测入门","每日追踪","15000+用户","性价比","ChatGPT"]'::jsonb),
('Peec AI', '专为代理商设计的品牌 AI 可见度监测工具，数据呈现简洁清晰，支持多客户账号管理，适合数字营销代理商追踪客户品牌在 AI 引擎中的表现。', 'aeo-saas', FALSE, 'paid', 'https://peec.ai', '["AEO","代理商","品牌监测","多账号","数据可视化"]'::jsonb),
('Goodie AI', '专注 AEO 与 AI 购物可见度的综合平台，追踪品牌在 ChatGPT、Amazon Rufus、Perplexity Shopping 等 AI 购物引擎中的推荐表现，适合电商品牌。', 'aeo-saas', FALSE, 'paid', 'https://higoodie.com', '["AEO","AI购物","Amazon Rufus","ChatGPT Shopping","Perplexity","电商"]'::jsonb),
('Evertune', '服务 Fortune 500 的企业级 AEO 平台，每月处理 100 万+ Prompt，具有统计置信度分析，提供最精准的 AI 搜索可见度数据，适合超大型企业。', 'aeo-saas', FALSE, 'paid', 'https://evertune.ai', '["AEO","Fortune500","企业级","100万Prompt","统计置信度"]'::jsonb),
('Omnibound AI', 'B2B 内容 AEO 专项平台，以买家对话驱动内容策略，支持批量内容刷新和 AI 引擎优化，帮助 B2B 企业提升在采购决策场景下的 AI 可见度。', 'aeo-saas', FALSE, 'paid', 'https://omnibound.ai', '["AEO","B2B","内容策略","买家对话","批量刷新"]'::jsonb),
('AIclicks', '中市场 AEO 综合工具，支持 Prompt 聚类映射、GEO 审计和多语言追踪，帮助中小企业以低成本进行全面的 AI 搜索优化。', 'aeo-saas', FALSE, 'freemium', 'https://aiclicks.io', '["AEO","GEO审计","Prompt聚类","多语言","中市场"]'::jsonb),
('Rankscale', '积分制灵活 AI 可见度追踪工具，高精度监测品牌在多个 AI 引擎中的深度排名表现，按需购买积分，适合预算有限但追求高精度数据的团队。', 'aeo-saas', FALSE, 'freemium', 'https://rankscale.io', '["AEO","积分制","高精度","AI可见度","灵活计费"]'::jsonb),
('GetCito', '全球首个开源 AIO/AEO/GEO 一体化优化平台，追踪品牌在 ChatGPT、Claude、Perplexity、Google AI Overviews 等 AI 引擎中的曝光，提供可操作的优化建议，支持自托管或云端 SaaS 使用。', 'aeo-saas', TRUE, 'freemium', 'https://getcito.com/dashboard', '["AEO","GEO","AIO","开源","Next.js","TypeScript","自托管"]'::jsonb),
('Elmo AI Visibility', '开源 AI 可见度追踪平台，实时监控品牌在 ChatGPT、Perplexity、Gemini、Grok、Copilot 等主流 AI 引擎中的曝光情况，提供 AEO/GEO/AIO/LLMO 多维度分析报告，BYOK 设计，数据隐私友好。', 'aeo-saas', TRUE, 'free', 'https://www.elmohq.com', '["AEO","AIO","LLMO","GEO","开源","BYOK","Grok","Copilot"]'::jsonb),
('Aperture', '开源 AI 可见度监控与分析平台，BYOK 设计，可自托管部署，追踪品牌在 ChatGPT、Perplexity、Google AI Overviews 等 LLM 中的出现频率与语境，是 Profound 和 Peec AI 的免费开源替代品。', 'aeo-saas', TRUE, 'free', 'https://github.com/anyin-ai/aperture', '["AEO","BYOK","自托管","开源","品牌监测","TypeScript","LLM监控"]'::jsonb),
('AEO Radar', '开源 AEO 品牌可见度监控工具，实时追踪品牌在 ChatGPT、Perplexity、Gemini 等 AI 搜索引擎中的提及情况，提供可视化 Dashboard 和告警功能，帮助市场团队快速响应 AI 搜索动态。', 'aeo-saas', TRUE, 'free', 'https://github.com/hellowalt/aeo-radar', '["AEO","开源","品牌监测","Dashboard","告警","Python"]'::jsonb),
('Canonry', 'Agent-first 的 AEO 监测与运营平台（AINYC 出品），专为 AI 搜索时代设计，帮助品牌在 AI 引擎答案中持续保持可见性，提供自动化监控、竞品对比和内容优化建议。', 'aeo-saas', TRUE, 'paid', 'https://github.com/AINYC/canonry', '["AEO","Agent-first","品牌监测","竞品对比","TypeScript","开源"]'::jsonb),

-- 企业级 SEO 平台（内置 AEO 模块）
('Conductor', '企业级 SEO + AEO 一体化平台，提供实时 LLM 查询分析、AI 写作助手和 24/7 AI 可见度监控，帮助大型企业系统化整合传统 SEO 与 AEO 优化策略。', 'aeo-enterprise', FALSE, 'paid', 'https://conductor.com', '["AEO","SEO","企业级","LLM查询","AI写作","24/7监控"]'::jsonb),
('Semrush AI Visibility', 'Semrush 旗下 AI 可见度追踪模块，支持 AI Overviews 追踪、竞争对手基准对比和时期对比分析，与 Semrush 强大的 SEO 数据体系深度联动。', 'aeo-enterprise', FALSE, 'paid', 'https://www.semrush.com', '["AEO","AI Overviews","竞争对手","Semrush","SEO联动","基准对比"]'::jsonb),
('Ahrefs Brand Radar', 'Ahrefs 的 AI 品牌追踪模块，覆盖 ChatGPT、Perplexity、Gemini、Copilot、Claude、Grok 六大 AI 引擎，与 Ahrefs 海量 SEO 数据无缝联动，品牌可见度分析最全面。', 'aeo-enterprise', FALSE, 'paid', 'https://ahrefs.com/brand-radar', '["AEO","Ahrefs","6大AI引擎","品牌追踪","SEO联动"]'::jsonb),
('SE Ranking', '内置生成引擎追踪（GEO/AEO）模块的 SEO 平台，支持代理商多客户管理，追踪品牌在主流 AI 搜索引擎中的可见度变化，性价比高适合中小代理商。', 'aeo-enterprise', FALSE, 'freemium', 'https://seranking.com', '["AEO","GEO","代理商","生成引擎追踪","SEO工具","多客户"]'::jsonb),
('BrightEdge', '企业 AI 内容与 AEO 整合平台，系统化实现 AEO 与内容策略融合，提供大规模 AI 搜索可见度监控和内容优化建议，服务全球顶级企业。', 'aeo-enterprise', FALSE, 'paid', 'https://brightedge.com', '["AEO","SEO","企业级","AI内容","大规模监控"]'::jsonb),
('seoClarity', '集成 AI 智能的企业 SEO + AEO 平台，支持企业规模化 AEO 实施，提供内容优化、AI 搜索可见度分析和自动化工作流，适合大型内容团队。', 'aeo-enterprise', FALSE, 'paid', 'https://seoclarity.net', '["AEO","SEO","企业级","AI智能","自动化工作流","内容优化"]'::jsonb),
('Authoritas', '企业 SEO 平台内含 AI 品牌监测模块，追踪品牌在 AI 生成内容中的表现，结合传统 SEO 数据提供全方位的搜索可见度分析和优化建议。', 'aeo-enterprise', FALSE, 'paid', 'https://authoritas.com', '["AEO","SEO","品牌监测","AI生成内容","企业级"]'::jsonb),

-- 内容优化工具
('Frase.io', 'AI 内容摘要与答案优化平台，专为 AEO 内容导向设计，支持 FAQ 生成、内容结构化和 AI 搜索就绪评分，帮助内容团队快速生成被 AI 引擎引用的答案友好型内容。', 'aeo-content', FALSE, 'freemium', 'https://frase.io', '["AEO","内容优化","FAQ生成","AI摘要","答案优化","内容结构化"]'::jsonb),
('Surfer SEO', '内容评分与 AI 结构优化平台，提供语义相关词分析、内容覆盖度评分和 LLM 优化策略，帮助内容团队创作既能排名 Google 又能被 AI 引用的高质量内容。', 'aeo-content', FALSE, 'paid', 'https://surferseo.com', '["AEO","内容评分","LLM优化","语义分析","AI结构","SEO"]'::jsonb),
('Clearscope', '语义相关词分析与内容覆盖度评分工具，帮助内容团队创作语义完整、主题权威的内容，提高在传统搜索和 AI 搜索中同时获得引用的概率。', 'aeo-content', FALSE, 'paid', 'https://clearscope.io', '["AEO","语义分析","内容覆盖度","主题权威","内容质量"]'::jsonb),
('MarketMuse', 'AI 驱动的主题权威建立与内容差距分析平台，帮助品牌系统化覆盖核心话题，建立内容护城河，提升在 AI 引擎和传统搜索引擎中的权威度。', 'aeo-content', FALSE, 'freemium', 'https://marketmuse.com', '["AEO","主题权威","内容差距","AI驱动","内容护城河"]'::jsonb),
('NeuronWriter', '基于 NLP 的内容优化工具，适合欧洲市场，支持多语言内容评分和 AI 搜索优化建议，性价比高，是欧洲企业进行 AEO 内容优化的热门选择。', 'aeo-content', FALSE, 'paid', 'https://neuronwriter.com', '["AEO","NLP","多语言","欧洲市场","内容评分","性价比"]'::jsonb),
('InLinks', '实体优化与内部链接自动化工具，通过构建知识图谱和实体关联帮助网站建立 AI 搜索权威度，与 Schema 结构化数据深度整合，提升 AI 引擎对品牌的实体识别。', 'aeo-content', FALSE, 'freemium', 'https://inlinks.com', '["AEO","实体优化","内部链接","知识图谱","Schema","AI权威度"]'::jsonb),
('Writesonic', 'AI 内容生成平台，支持 GEO + SEO + AEO 友好的内容结构，自动生成语义完整、适合 AI 引用的文章、FAQ 和落地页内容，适合内容量大的团队。', 'aeo-content', FALSE, 'freemium', 'https://writesonic.com', '["AEO","GEO","SEO","AI内容生成","FAQ","落地页"]'::jsonb),
('SEOBuild Onpage', 'AI Agent 驱动的页面 SEO + AEO 写作工具（⭐ 205 Stars），输入一条命令即可生成 Google 排名 + LLM 引用双目标优化的落地页，内置 500-token 分块架构、实体共识和验证标签，集成 GSC、DataforSEO。', 'aeo-content', TRUE, 'freemium', 'https://github.com/gbessoni/seobuild-onpage', '["SEO+AEO","AI写作","Claude Code","DataforSEO","GSC","落地页","Python"]'::jsonb),

-- 问题研究工具
('AlsoAsked', '可视化 PAA（People Also Ask）问题树工具，帮助挖掘 Google 搜索中的语义问题网络，发现用户真实提问意图，为 AEO 内容创作和 FAQ 优化提供数据支撑。', 'aeo-research', FALSE, 'freemium', 'https://alsoasked.com', '["AEO","PAA","问题研究","语义网络","FAQ挖掘","关键词发现"]'::jsonb),
('AnswerThePublic', '经典 5W1H 长尾问题聚合工具，通过搜索联想词自动生成关于某话题的 Who/What/When/Where/Why/How 问题集，是 AEO 问题研究的必备入门工具。', 'aeo-research', FALSE, 'freemium', 'https://answerthepublic.com', '["AEO","5W1H","长尾问题","问题聚合","关键词研究","经典工具"]'::jsonb),
('Google PAA（免费）', '直接从 Google 搜索结果中挖掘"People Also Ask"答案框机会，免费且实时，通过手动扩展 PAA 块可发现大量 AEO 内容机会，是最直接的竞争洞察来源。', 'aeo-research', FALSE, 'free', 'https://google.com', '["AEO","PAA","免费","答案框","Google","竞争洞察"]'::jsonb),
('Exploding Topics', '发现爆发式增长的问题话题和行业趋势，提前布局 AI 搜索热点，帮助品牌在 AEO 内容创作上抢占先机，覆盖科技、商业、健康等多个垂直领域。', 'aeo-research', FALSE, 'freemium', 'https://explodingtopics.com', '["AEO","趋势发现","爆发话题","提前布局","内容选题"]'::jsonb),
('QuestionDB', '基于 Reddit 真实问题的长尾词库工具，收集来自真实用户的问题讨论，帮助 AEO 内容团队发现在 Reddit、Quora 等社区中被频繁讨论的问题类型。', 'aeo-research', FALSE, 'freemium', 'https://questiondb.io', '["AEO","Reddit","长尾词库","社区问题","用户真实提问"]'::jsonb),
('Keyword Tool', '多平台搜索联想词工具，覆盖 Google、Bing、YouTube、Amazon、Reddit 等平台的问题词和长尾词，为 AEO 内容优化提供多渠道问题研究支持。', 'aeo-research', FALSE, 'freemium', 'https://keywordtool.io', '["AEO","多平台","搜索联想词","问题词","Google","YouTube","Amazon"]'::jsonb),

-- 结构化数据工具（AEO 方向）
('Geordy.ai', 'GEO 专用自动化 JSON-LD 生成平台，支持 llms.txt 文件生成，帮助网站快速完成 AI 引擎适配改造，通过结构化数据标记提升在 AI 搜索中的可见度。', 'aeo-schema', FALSE, 'paid', 'https://geordy.ai', '["AEO","JSON-LD","llms.txt","GEO","自动化","结构化数据"]'::jsonb),
('Schema App（AEO）', '企业级 Schema.org 结构化数据管理平台，支持复杂知识图谱构建、Schema 部署和效果追踪，帮助大型企业系统化管理所有页面的结构化数据标记。', 'aeo-schema', FALSE, 'paid', 'https://schemaapp.com', '["AEO","Schema.org","知识图谱","企业级","结构化数据管理","效果追踪"]'::jsonb),
('Google 富媒体结果测试', '官方免费 Schema 验证工具，检测 FAQ、HowTo、Article、Product 等 Schema 标记是否正确，确保结构化数据符合 Google 富媒体结果和 AI Overviews 要求。', 'aeo-schema', FALSE, 'free', 'https://search.google.com/test/rich-results', '["AEO","Schema验证","FAQ","HowTo","免费","Google官方","AI Overviews"]'::jsonb),
('Schema 标记生成器', '在线 Schema 代码生成工具，无需编程知识，通过表单填写即可生成符合 Schema.org 规范的 JSON-LD 代码，支持 FAQ、Article、Organization、Product 等常用类型。', 'aeo-schema', FALSE, 'free', 'https://technicalseo.com/tools/schema-markup-generator', '["AEO","JSON-LD","Schema生成","免费","在线工具","无需编程"]'::jsonb),
('Rank Math', 'WordPress AEO 优化插件，自动生成 FAQ Schema、HowTo Schema 和 Article Schema，支持 AI Overviews 优化，免费版功能强大，是 WordPress 站点 AEO 改造的首选插件。', 'aeo-schema', FALSE, 'freemium', 'https://rankmath.com', '["AEO","WordPress","FAQ Schema","HowTo Schema","插件","AI Overviews"]'::jsonb),
('Yoast SEO', '全球最流行的 WordPress SEO 插件，内置 Schema 支持，自动为页面添加 Article、BreadcrumbList 和 Organization 等结构化数据，是 AEO 基础设施建设的经典工具。', 'aeo-schema', FALSE, 'freemium', 'https://yoast.com', '["AEO","WordPress","Schema","SEO","经典插件","全球最流行"]'::jsonb),
('aeo.js（AEO）', '现代 Web 框架的 AEO npm 包，一键生成 llms.txt、robots.txt、站点地图和 JSON-LD 结构化数据，支持 Next.js、Nuxt、Astro、Vite，让网站快速符合 AI 引擎爬取标准。', 'aeo-schema', TRUE, 'free', 'https://github.com/multivmlabs/aeo.js', '["npm","TypeScript","llms.txt","JSON-LD","Next.js","Nuxt","Astro","Vite"]'::jsonb),
('AEO Schema Skill', 'Claude AI 专用的 Schema.org JSON-LD 标记技能，覆盖 Google 富媒体结果 + AEO AI 答案引擎优化，包含实体图谱构建、Speakable 属性、sameAs 策略，适用于 Claude.ai、Claude Code、Cursor 等 AI 编程环境。', 'aeo-schema', TRUE, 'free', 'https://github.com/yulia-glukhova/aeo-schema-skill', '["JSON-LD","Schema.org","Claude","Speakable","实体图谱","sameAs","开源"]'::jsonb),

-- 国内 AEO / GEO 平台
('AIDSO 爱搜（AEO）', 'DSO + GEO + AEO 双引擎监测平台，深度覆盖 DeepSeek、豆包、小红书等国内 AI 平台，同步支持国际 AI 搜索引擎，是国内 AEO/GEO 综合平台代表。', 'aeo-china', FALSE, 'freemium', 'https://geo.aidso.com', '["AEO","GEO","DSO","DeepSeek","豆包","小红书","国内平台"]'::jsonb),
('透镜 GEO（AEO）', '国内免费 GEO/AEO 监测工具，提供国内 AI 平台排名监测服务，无需费用即可开始追踪品牌在豆包、Kimi、DeepSeek 等平台中的可见度，入门用户首选。', 'aeo-china', FALSE, 'free', 'https://geo.timus.cn', '["AEO","GEO","免费","国内AI平台","豆包","Kimi","DeepSeek"]'::jsonb),
('ImpetaAI（AEO）', '50+ 维度评估指标的国内 AI 可见度监测平台，覆盖豆包、DeepSeek、元宝、Kimi、通义千问等主流国内 AI 引擎，提供全面的 AEO 诊断报告和优化建议。', 'aeo-china', FALSE, 'freemium', 'https://impetaai.hcr.com.cn', '["AEO","GEO","50+指标","豆包","DeepSeek","元宝","Kimi","通义千问"]'::jsonb),
('PallasAI', '专注 B2B 场景的 AEO Agent 平台，由蚂蚁大模型架构师创立，将 AI Agent 技术与 AEO 优化深度融合，帮助 B2B 企业在 AI 搜索时代获得精准客户触达。', 'aeo-china', FALSE, 'paid', 'https://pallasai.net', '["AEO","B2B","AI Agent","蚂蚁","架构师创业","精准营销"]'::jsonb),
('潮树渔（CSYGEO）', 'GEO + AEO 全覆盖平台，监测国内外 85+ AI 平台，提供专业 AEO 白皮书和操作指南，是国内 AEO 方法论研究最深入的平台之一，同时提供 AI 内容优化和品牌可见度提升服务。', 'aeo-china', FALSE, 'freemium', 'https://csygeo.cn', '["AEO","GEO","85+AI平台","AEO白皮书","国内外覆盖","内容优化"]'::jsonb),
('SheepGeo（AEO）', '采用 SHEEP 五维评分体系的 GEO/AEO 监测平台，覆盖 9 大主流 AI 模型，提供免费基础版，适合中小企业快速了解品牌在国内 AI 引擎中的表现。', 'aeo-china', FALSE, 'freemium', 'https://sheepgeo.com', '["AEO","GEO","SHEEP五维评分","9大模型","免费版","中小企业"]'::jsonb),
('移山科技（AEO）', '技术实力最强的国内 GEO/AEO 服务商，自研 7 套核心系统，提供从诊断、优化到监测的全链路 GEO/AEO 服务，包括 AI 内容重构、实体图谱构建和 Schema 标记等。', 'aeo-china', FALSE, 'paid', 'https://geokeji.com', '["AEO","GEO","7套自研系统","全链路服务","实体图谱","Schema标记"]'::jsonb),
('数珀 AI（AEO）', '提供网站 AI 可见度雷达和 AI 建站工具的综合平台，帮助企业快速搭建 AI 引擎友好的网站，同时提供持续的 AEO 监测服务，适合需要从零开始建立 AI 搜索存在感的企业。', 'aeo-china', FALSE, 'freemium', 'https://suproai.com', '["AEO","GEO","网站雷达","AI建站","全流程","新站优化"]'::jsonb)

ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. SEO TOOLS DATA
-- ============================================================================
INSERT INTO wseo_seo_tools (name, description, category, ai_supported, price, url, tags) VALUES

-- 综合 SEO 平台
('Ahrefs', '行业领先的全能 SEO 套件，关键词研究、反链分析、内容挖掘、排名追踪一应俱全', 'all-in-one', FALSE, 'paid', 'https://ahrefs.com/', '["反链分析","关键词研究","全能工具"]'::jsonb),
('SEMrush', '集 SEO、内容营销、竞品分析、PPC 和社交媒体营销于一体的综合数字营销平台', 'all-in-one', TRUE, 'paid', 'https://www.semrush.com/', '["全能平台","PPC分析","竞品研究"]'::jsonb),
('Seodity', '完整的 SEO 工具套件，帮助企业在搜索引擎中获得更高排名和更多流量', 'all-in-one', FALSE, 'paid', 'https://seodity.com/', '["全套工具","排名提升","流量增长"]'::jsonb),
('Ubersuggest', 'Neil Patel 出品，提供关键词建议、搜索量、SEO 难度一站式分析，有免费版', 'all-in-one', FALSE, 'freemium', 'https://neilpatel.com/ubersuggest/', '["关键词建议","SEO难度","搜索量"]'::jsonb),
('Mangools', '界面友好的 SEO 工具套件，含 KWFinder 关键词研究和 SERPChecker 排名分析', 'all-in-one', FALSE, 'paid', 'https://mangools.com/', '["用户友好","KWFinder","SERP分析"]'::jsonb),
('SERanking', '专为 SEO 机构量身打造的全能平台，支持白标报告和完整客户管理', 'all-in-one', FALSE, 'paid', 'https://seranking.com/', '["机构工具","白标报告","排名追踪"]'::jsonb),
('Moz Pro', 'SEO 老牌权威，提供网站权威评分 (DA)、关键词难度和页面优化建议', 'all-in-one', FALSE, 'paid', 'https://moz.com/', '["DA评分","权威工具","全套SEO"]'::jsonb),
('Serpstat', 'SEO 管理平台，涵盖关键词研究、竞品分析、网站审计、排名追踪四大核心模块', 'all-in-one', FALSE, 'paid', 'https://serpstat.com/', '["竞品分析","网站审计","SEO管理"]'::jsonb),
('SEO PowerSuite', '一套含排名追踪、页面分析、反链管理和报告生成的完整桌面 SEO 工具集', 'all-in-one', FALSE, 'freemium', 'https://www.link-assistant.com/', '["桌面工具","全套SEO","反链管理"]'::jsonb),
('WebCEO', '专为代理机构设计的 SEO 与数字营销工具平台，提供分析报告和线索生成', 'all-in-one', FALSE, 'paid', 'https://www.webceo.com/', '["代理机构","营销工具","线索生成"]'::jsonb),
('SpyFu', '专注竞品关键词和广告策略分析，查看竞争对手多年 SEO/PPC 历史数据', 'all-in-one', FALSE, 'freemium', 'https://www.spyfu.com/', '["竞品关键词","PPC分析","SEO历史"]'::jsonb),
('Zutrix', '以 AI 为核心的 SEO 工具，提供精准关键词排名追踪和竞争对手监控', 'all-in-one', TRUE, 'paid', 'https://zutrix.com/', '["AI驱动","排名追踪","竞争监控"]'::jsonb),
('BrightEdge SEO', '企业级 SEO 平台，专为大型企业提供数据驱动的内容优化和竞争分析', 'all-in-one', TRUE, 'paid', 'https://www.brightedge.com/', '["企业级","内容优化","数据驱动"]'::jsonb),
('CognitiveSEO', '提供深度反链分析和内容审计功能，全面提升网站 SEO 策略效果', 'all-in-one', FALSE, 'paid', 'https://cognitiveseo.com/', '["反链分析","内容审计","策略优化"]'::jsonb),
('Keyword Insights', '利用 AI 技术加速内容创作，通过语义聚类和内容规划升级 SEO 策略', 'all-in-one', TRUE, 'paid', 'https://www.keywordinsights.ai/', '["AI关键词","语义聚类","内容规划"]'::jsonb),
('Clicks.so', '专为 SEO 初学者设计的友好工具，操作简单、价格亲民，快速上手优化', 'all-in-one', FALSE, 'paid', 'https://www.clicks.so/', '["新手友好","简单易用","性价比高"]'::jsonb),
('SEO Utils', '原生支持 macOS、Windows、Linux 三平台的桌面端 SEO 应用，无需浏览器', 'all-in-one', FALSE, 'paid', 'https://seoutils.app/', '["桌面应用","跨平台","离线使用"]'::jsonb),
('DiagnoSEO', 'AI 驱动的 SEO 和内容营销工具，含 WordPress SEO 插件，一站式优化方案', 'all-in-one', TRUE, 'paid', 'https://diagnoseo.com/', '["AI诊断","WordPress插件","内容营销"]'::jsonb),
('Telescope SEO', '价格亲民的全能 SEO 工具，涵盖关键词研究、技术审计、排名追踪和内链优化', 'all-in-one', FALSE, 'paid', 'https://withtelescope.com/', '["全能工具","性价比高","内链优化"]'::jsonb),
('DAXRM', '专为数字营销机构设计的全能 CRM，集 SEO、PPC、客户报告和团队协作于一体', 'all-in-one', FALSE, 'paid', 'https://www.daxrm.com/', '["营销CRM","机构管理","团队协作"]'::jsonb),
('SEO Toolbox', '结合逐页分析、AI 洞察和深度报告的全能 SEO 平台，适合个人到大型机构', 'all-in-one', TRUE, 'paid', 'https://seotoolbox.site', '["AI洞察","深度报告","页面分析"]'::jsonb),
('Bishopi.io', '企业级 SEO 与域名情报工具，提供全面的竞争分析和域名监控能力', 'all-in-one', FALSE, 'paid', 'https://www.bishopi.io/', '["企业级","域名情报","竞争分析"]'::jsonb),

-- 关键词研究
('Google Keyword Planner', 'Google Ads 官方免费工具，提供精准搜索量和竞价建议，数据来源最权威', 'keyword-research', FALSE, 'free', 'https://ads.google.com/home/tools/keyword-planner/', '["Google官方","搜索量","免费工具"]'::jsonb),
('Keyword Tool', '聚合 Google、YouTube、Amazon、Play Store 等多平台搜索联想词', 'keyword-research', FALSE, 'freemium', 'https://keywordtool.io/', '["多平台","搜索联想","YouTube","Amazon"]'::jsonb),
('KeySearch LSI Keyword', '输入任意关键词，生成语义相关的 LSI 关键词，提升内容的语义覆盖度', 'keyword-research', FALSE, 'free', 'https://www.keysearch.co/tools/lsi-keywords-generator', '["LSI关键词","语义分析","内容覆盖"]'::jsonb),
('WordStream Keywords', '一站式发现并优先排序最佳目标关键词，兼顾 SEO 和 PPC 双重用途', 'keyword-research', FALSE, 'free', 'https://www.wordstream.com/keywords', '["关键词优先级","SEO+PPC","关键词发现"]'::jsonb),
('Ahrefs Keywords Generator', 'Ahrefs 出品的免费关键词生成器，快速获取关键词创意和基础搜索量数据', 'keyword-research', FALSE, 'free', 'https://ahrefs.com/keyword-generator', '["免费工具","关键词创意","Ahrefs"]'::jsonb),
('Semrush Keyword Magic Tool', 'Semrush 旗舰关键词工具，从数以百万计的建议中找到最佳目标词', 'keyword-research', FALSE, 'paid', 'https://www.semrush.com/analytics/keywordmagic/start', '["关键词库","搜索意图","Semrush"]'::jsonb),
('Serp Miner', '利用 Google 自动补全挖掘长尾词，支持批量检查关键词精确搜索量', 'keyword-research', FALSE, 'free', 'https://serpminer.com/free-seo-tools', '["长尾词","批量检查","搜索量"]'::jsonb),
('kwrds.ai', 'AI 驱动的关键词和问题发现工具，深入挖掘用户搜索意图和相关问题', 'keyword-research', TRUE, 'paid', 'https://www.kwrds.ai', '["AI关键词","用户意图","问题挖掘"]'::jsonb),
('AnswerThePublic', '可视化呈现用户最常问的 5W1H 问题，是长尾词挖掘的经典利器', 'keyword-research', TRUE, 'freemium', 'https://answerthepublic.com/', '["长尾词","用户问题","内容创作"]'::jsonb),
('Keywordideas.xyz', '基于真实 Google 搜索数据，通过 URL 或示例关键词获取关键词建议', 'keyword-research', FALSE, 'free', 'https://keywordideas.xyz/', '["关键词建议","Google数据","URL分析"]'::jsonb),
('Exploding Topics', '通过大数据监测爆发式增长的潜力词，UI 极简，提前发现下一个爆款话题', 'keyword-research', TRUE, 'freemium', 'https://explodingtopics.com', '["趋势发现","潜力词","大数据"]'::jsonb),
('Google Trends', 'Google 官方趋势工具，实时查看搜索热度变化趋势，支持地区和时间筛选', 'keyword-research', FALSE, 'free', 'https://trends.google.com', '["趋势","实时数据","Google官方"]'::jsonb),

-- 反链分析
('Majestic', '老牌反链分析权威，以庞大的链接数据库著称，提供信任流量和引用流量双指标', 'backlink-analysis', FALSE, 'paid', 'https://majestic.com/', '["反链数据库","信任流量","权威工具"]'::jsonb),
('Monitor Backlinks', '实时监控自己和竞争对手的反链变化，区分好坏链接并发出预警', 'backlink-analysis', FALSE, 'paid', 'https://monitorbacklinks.com/', '["实时监控","反链对比","链接预警"]'::jsonb),
('Respona', '集外链挖掘和邮件推广于一体的链接建设工具，AI 辅助撰写个性化推广邮件', 'backlink-analysis', TRUE, 'paid', 'https://respona.com/', '["链接建设","邮件推广","AI辅助"]'::jsonb),
('BacklinkGPT', 'AI 驱动的链接建设平台，智能发现高价值外链机会并自动生成个性化推广文案', 'backlink-analysis', TRUE, 'paid', 'https://www.backlinkgpt.com/', '["AI链接","推广邮件","自动化"]'::jsonb),
('BacklinkScan', '简单而强大的反链检查工具，快速分析任意网站的反链质量和来源分布', 'backlink-analysis', FALSE, 'free', 'https://backlinkscan.com/', '["反链检查","链接质量","来源分析"]'::jsonb),

-- 内容优化
('Clearscope', '业界最佳的 SEO 内容优化平台，通过词频分析和语义建议提升内容搜索排名', 'content-optimization', TRUE, 'paid', 'https://www.clearscope.io/', '["内容评分","语义优化","关键词密度"]'::jsonb),
('SurferSEO', '通过实时 SERP 分析提供内容评分和优化建议，系统化提升有机流量', 'content-optimization', TRUE, 'paid', 'https://surferseo.com/', '["内容优化","NLP分析","SERP对比"]'::jsonb),
('NeuronWriter', '基于 NLP 语义分析的内容优化工具，帮助创作 Google 喜爱的高质量内容', 'content-optimization', TRUE, 'paid', 'https://neuronwriter.com/', '["NLP语义","内容评分","AI写作"]'::jsonb),
('ContentSwift', '开源内容研究和 SEO 优化工具，完全免费，适合技术型 SEO 人员使用', 'content-optimization', FALSE, 'free', 'https://github.com/hilmanski/contentswift', '["开源工具","内容研究","免费"]'::jsonb),
('Market Muse', 'AI 分析整个网站并给出个性化客观见解，帮助更快更好地规划内容战略', 'content-optimization', TRUE, 'paid', 'https://www.marketmuse.com/', '["AI内容规划","内容评分","主题权威"]'::jsonb),
('Frase.io', '最快捷高效的 Google 排名内容创作工具，AI 辅助研究和撰写高质量 SEO 文章', 'content-optimization', TRUE, 'paid', 'https://www.frase.io/', '["AI写作","内容创作","FAQ结构"]'::jsonb),
('GrowthBar', 'AI 驱动的博客内容创作工具，以 10 倍速度撰写 SEO 友好的博客文章', 'content-optimization', TRUE, 'paid', 'https://www.growthbarseo.com/', '["AI博客","快速写作","内容优化"]'::jsonb),
('LSIGraph', '通过 LSI 语义关键词优化内容，全面提升网站流量并增强内容主题权威性', 'content-optimization', FALSE, 'freemium', 'https://lsigraph.com/', '["LSI语义","流量提升","内容权威"]'::jsonb),
('Yoast SEO Plugin', 'WordPress 最受欢迎的 SEO 插件，提供页面实时 SEO 建议和可读性评分', 'content-optimization', FALSE, 'freemium', 'https://yoast.com/', '["WordPress插件","实时建议","可读性"]'::jsonb),
('GrackerAI', '专为 B2B 网络安全 SaaS 企业打造的 AI 内容编辑和程序化 SEO 解决方案', 'content-optimization', TRUE, 'paid', 'https://gracker.ai/', '["B2B","程序化SEO","网络安全"]'::jsonb),
('TailorTask', 'AI 智能体自动化完成内链优化、客座博客提案、博客创作等重复性 SEO 工作', 'content-optimization', TRUE, 'paid', 'https://www.tailortask.ai/', '["AI自动化","内链优化","智能体"]'::jsonb),
('SearchAttention', '优化内容以适应 AI 搜索引擎，如 Google AI Overview、Perplexity 和 SearchGPT', 'content-optimization', TRUE, 'paid', 'https://searchattention.com', '["AI搜索优化","AI Overview","GEO"]'::jsonb),
('Koala AI', 'AI 内容创作平台，支持 SEO 代理、内链优化、实体图谱生成等高级功能', 'content-optimization', TRUE, 'paid', 'https://koala.sh', '["AI平台","内链优化","实体图谱"]'::jsonb),
('AltTextLab', 'AI 生成 SEO 优化且无障碍的图片 Alt 文本，提升图片在搜索引擎中的可见度', 'content-optimization', TRUE, 'free', 'https://www.alttextlab.com/', '["Alt文本","图片SEO","无障碍"]'::jsonb),
('SERPrecon', '基于真实语义搜索指标进行竞争分析的内容优化工具，支持 AI 搜索份额追踪', 'content-optimization', TRUE, 'paid', 'https://www.serprecon.com/', '["语义分析","AI份额","竞争分析"]'::jsonb),
('TuxSEO', '全自动 SEO 优化博客创作系统，为企业提供完全自动化的内容发布方案', 'content-optimization', TRUE, 'paid', 'https://tuxseo.com/', '["全自动","博客创作","企业工具"]'::jsonb),

-- 排名追踪
('SerpBear', '开源搜索引擎排名追踪应用，支持自部署，完全免费，数据完全自主掌控', 'rank-tracking', FALSE, 'free', 'https://docs.serpbear.com/', '["开源","自部署","免费"]'::jsonb),
('SERPWatcher', '面向营销人员和代理机构的最先进排名追踪器，提供自动报告和异常预警', 'rank-tracking', FALSE, 'paid', 'https://serpwatch.io/', '["自动报告","代理机构","异常预警"]'::jsonb),
('AccuRanker', '全球速度最快、精度最高的关键词排名追踪工具，支持按需刷新排名数据', 'rank-tracking', FALSE, 'paid', 'https://www.accuranker.com/', '["高精度","快速刷新","专业工具"]'::jsonb),
('Nightwatch', '基于云端的 SEO 与分析工具，专注于排名追踪和可视化报告，数据直观易懂', 'rank-tracking', FALSE, 'paid', 'https://nightwatch.io/', '["云端工具","可视化报告","排名监控"]'::jsonb),
('DAXRM Rank Tracker', '实时关键词排名追踪，支持多地区、多设备组合追踪，适合本地 SEO 需求', 'rank-tracking', FALSE, 'paid', 'https://www.daxrm.com/integrations/rank-tracker/', '["实时追踪","多地区","多设备"]'::jsonb),
('That''s Rank!', '即时了解网站在 Google 中每个关键词的排名，极简界面，随时掌握动态', 'rank-tracking', FALSE, 'free', 'https://www.thatisrank.com/', '["即时排名","极简界面","实时数据"]'::jsonb),

-- 技术 SEO
('Google Search Console', 'Google 官方站长工具，免费监控索引状态、搜索表现和 Core Web Vitals', 'technical-seo', FALSE, 'free', 'https://search.google.com/search-console/about', '["Google官方","索引监控","搜索表现"]'::jsonb),
('Bing Webmaster Tools', '微软 Bing 官方站长工具，含关键词研究和技术 SEO 建议，Copilot AI 整合', 'technical-seo', TRUE, 'free', 'https://www.bing.com/webmasters/about', '["Bing官方","Copilot","AI搜索"]'::jsonb),
('Yandex Webmaster', '俄罗斯 Yandex 官方站长工具，含索引状态、爬虫统计和技术 SEO 建议', 'technical-seo', FALSE, 'free', 'https://webmaster.yandex.com/', '["Yandex","俄语SEO","国际市场"]'::jsonb),
('Screaming Frog SEO Spider', '最权威的网站爬虫工具，抓取全站 URL 并系统分析断链、重复内容等技术问题', 'technical-seo', FALSE, 'freemium', 'https://www.screamingfrog.co.uk/seo-spider/', '["爬虫","技术审计","本地工具"]'::jsonb),
('SiteAnalyzer', '扫描整站并生成每个页面的详细 SEO 信息报告，快速发现页面级优化机会', 'technical-seo', FALSE, 'free', 'https://site-analyzer.pro/', '["全站扫描","页面报告","SEO信息"]'::jsonb),
('Screpy', '一站式监控网站核心指标，无需切换多个平台，统一查看 SEO 与性能状态', 'technical-seo', FALSE, 'paid', 'https://screpy.com/', '["综合监控","多维指标","一站式"]'::jsonb),
('Sitebulb', '专为 SEO 顾问和代理机构打造的可视化网站审计工具，图表清晰直观', 'technical-seo', FALSE, 'paid', 'https://sitebulb.com/', '["可视化审计","SEO顾问","代理机构"]'::jsonb),
('Moz On-Page Grader', 'Moz 出品的单页面优化分析，针对目标关键词给出详细页面优化评分', 'technical-seo', FALSE, 'free', 'https://moz.com/tools/onpage-grader', '["页面评分","优化分析","Moz"]'::jsonb),
('BROWSEO', '用搜索引擎的视角查看网站，获得爬虫"X 光透视"效果，发现爬虫所见内容', 'technical-seo', FALSE, 'free', 'https://www.browseo.net', '["搜索引擎视角","X光检测","爬虫视图"]'::jsonb),
('linkok.com', '现代化断链检查工具，界面友好，快速发现并修复网站中的无效链接', 'technical-seo', FALSE, 'free', 'https://linkok.com', '["断链检查","链接修复","现代工具"]'::jsonb),
('PressProxy', '无代码工具，利用 Cloudflare Workers 将 blog.domain.tld 无缝部署到 domain.tld/blog', 'technical-seo', FALSE, 'free', 'https://pressproxy.io/', '["Cloudflare","子域迁移","无代码"]'::jsonb),
('Wizardstool', '简洁易用的断链检查工具，快速扫描并列出网站上所有失效的链接', 'technical-seo', FALSE, 'free', 'https://wizardstool.com/', '["断链扫描","简洁工具","链接修复"]'::jsonb),
('SEOnaut', '开源的技术 SEO 审计工具，支持自部署，完全免费，适合有技术能力的站长', 'technical-seo', FALSE, 'free', 'https://seonaut.org', '["开源","技术审计","自部署"]'::jsonb),
('Siteliner', '免费识别重复内容、断链及其他影响网站质量和搜索排名问题的检测工具', 'technical-seo', FALSE, 'free', 'https://www.siteliner.com/', '["重复内容","断链检测","免费工具"]'::jsonb),
('Black SEO Analyzer', '专业命令行 SEO 分析工具，同时优化传统搜索和 AI 答案引擎中的内容可见性', 'technical-seo', TRUE, 'free', 'https://github.com/sethblack/black-seo-analyzer', '["命令行","AI答案引擎","开源工具"]'::jsonb),
('Python SEO Analyzer', '开源 SEO 分析工具，爬取网站并分析页面结构、词频统计，自动警告技术问题', 'technical-seo', FALSE, 'free', 'https://github.com/sethblack/python-seo-analyzer', '["开源","Python工具","命令行"]'::jsonb),
('IncRev JavaScript Crawler', '能渲染 JavaScript 的 SEO 爬虫，支持 React、Vue、Angular 等现代框架站点审计', 'technical-seo', FALSE, 'free', 'https://github.com/VesterlundCoder/SEO-JavaScript-Crawler-IncRev', '["JS渲染","开源爬虫","现代框架"]'::jsonb),
('SSR Checker', '通过视觉对比检测 URL 的服务端渲染状态，判断内容是否对爬虫可见', 'technical-seo', FALSE, 'free', 'https://www.crawlably.com/ssr-checker/', '["SSR检测","爬虫可见性","渲染对比"]'::jsonb),
('LibreCrawl', '免费开源 SEO 爬虫，支持无限 URL 爬取、Playwright JS 渲染，适合企业级审计', 'technical-seo', FALSE, 'free', 'https://librecrawl.com/', '["开源爬虫","JS渲染","企业级"]'::jsonb),
('PageSpeed Insights', 'Google 官方网页速度诊断，提供 Core Web Vitals 详细数据，SEO 技术的基石', 'technical-seo', FALSE, 'free', 'https://pagespeed.web.dev', '["速度","Core Web Vitals","Google官方"]'::jsonb),
('GTmetrix', '聚合多项性能指标的全面分析平台，提供瀑布图和可操作的详细优化建议', 'technical-seo', FALSE, 'free', 'https://gtmetrix.com', '["性能分析","瀑布图","优化建议"]'::jsonb),
('DebugBear', '专注于 Core Web Vitals 监控，提供实时性能数据、趋势追踪和 Google CrUX 数据', 'technical-seo', FALSE, 'paid', 'https://www.debugbear.com/test/website-speed', '["Core Web Vitals","实时监控","CrUX数据"]'::jsonb),

-- 本地 SEO
('BrightLocal', '完整的本地 SEO 监控、审计和优化平台，专为本地商家和机构提供解决方案', 'local-seo', FALSE, 'paid', 'https://www.brightlocal.com/local-seo-tools/', '["本地SEO","审计工具","机构平台"]'::jsonb),
('Whitespark SEO', '本地 SEO 全套工具，含本地引用查找器、排名追踪器和评价管理工具', 'local-seo', FALSE, 'paid', 'https://whitespark.ca/', '["本地引用","评价管理","排名追踪"]'::jsonb),
('LocalFalcon', '最精准的本地关键词排名追踪工具，以地图网格可视化方式展示本地可见度', 'local-seo', FALSE, 'paid', 'https://www.localfalcon.com/', '["地图网格","本地排名","可视化追踪"]'::jsonb),
('Grid My Business', '快速发现本地业务在地图各区域的可见度分布，找出覆盖盲区并针对性优化', 'local-seo', FALSE, 'free', 'https://gridmybusiness.com/', '["本地可见度","网格分析","快速检测"]'::jsonb),
('Moz Local', 'Moz 出品的本地 SEO 和口碑管理工具，自动同步商家信息到主要目录和地图平台', 'local-seo', FALSE, 'paid', 'https://moz.com/products/local', '["商家信息同步","口碑管理","Moz"]'::jsonb),

-- SEO 数据分析
('SEO Gets', '注重隐私保护的分析工具，专为 SEO 机构和联盟营销人员打造，替代 GSC', 'seo-analytics', FALSE, 'paid', 'https://seogets.com/', '["隐私保护","机构工具","流量分析"]'::jsonb),
('Similarweb', '聚合全球流量趋势数据的最强平台，提供竞品流量来源、受众画像和渠道分析', 'seo-analytics', FALSE, 'freemium', 'https://similarweb.com', '["流量分析","竞品研究","受众画像"]'::jsonb),

-- SEO 浏览器扩展
('SEO Minion', '助力日常 SEO 任务的全能扩展，支持页面分析、断链检测、SERP 预览等', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/seo-minion/giihipjfimkajhlcilipnjeohabimjhi', '["Chrome扩展","页面分析","断链检测"]'::jsonb),
('SEOquake', '功能强大的 SEO 工具箱浏览器扩展，实时显示页面各项 SEO 指标和 SERP 数据', 'browser-extensions', FALSE, 'free', 'https://www.seoquake.com/index.html', '["SEO指标","SERP分析","浏览器工具"]'::jsonb),
('Woorank', '即时生成网站综合审查报告，提供 SEO、可用性和安全性多维度改进建议', 'browser-extensions', FALSE, 'free', 'https://www.woorank.com/en/privacy', '["网站审查","综合报告","改进建议"]'::jsonb),
('Keyword Surfer', 'SurferSEO 出品的 Chrome 扩展，在 Google 搜索页面直接显示关键词搜索量', 'browser-extensions', FALSE, 'free', 'https://surferseo.com/keyword-surfer-extension/', '["关键词数据","搜索量","SurferSEO"]'::jsonb),
('MozBar', 'Moz 官方 Chrome 扩展，浏览任意页面或 SERP 时即时显示 DA/PA 权威指标', 'browser-extensions', FALSE, 'free', 'https://moz.com/products/pro/seo-toolbar', '["DA/PA","即时指标","Moz扩展"]'::jsonb),
('Ahrefs SEO Toolbar', 'Ahrefs 官方扩展，集页面 SEO 报告、断链检测、重定向追踪于一体', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/ahrefs-seo-toolbar-on-pag/hgmoccdbjhknikckedaaebbpdeebhiei', '["Ahrefs扩展","页面报告","断链检测"]'::jsonb),
('Redirect Path', '专业的 HTTP 头和重定向检查扩展，快速诊断所有类型的网址跳转问题', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/redirect-path/aomidfkchockcldhbkggjokdkkebmdll', '["重定向检查","HTTP头","跳转诊断"]'::jsonb),
('META SEO inspector', '轻松检查网页内部的 Meta 数据，发现问题并获得针对性修复建议', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/meta-seo-inspector/ibkclpciafdglkjkcibmohobjkcfkaef', '["Meta检测","页面元数据","修复建议"]'::jsonb),
('Similarweb Extension', '浏览器扩展版本，即时显示任意网站的全球排名、流量来源和地域分布数据', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/similarweb-traffic-rank-w/hoklmmgfnpapgjgcpechhaamimifchmp', '["流量排名","即时分析","Similarweb"]'::jsonb),
('MST SERP Counter', '精确显示关键词搜索结果数量，查看搜索结果的排名位置和竞争程度', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/mst-serp-counter-seo-free/dgpekiojagcbjhgfpmmngnkchekcfifn', '["SERP统计","排名位置","竞争分析"]'::jsonb),
('TextOptimizer', '分析搜索结果中的相关词汇，提取"意图表格"建议内容词汇，匹配搜索引擎期望', 'browser-extensions', TRUE, 'free', 'https://chrome.google.com/webstore/detail/textoptimizer/fdbbkmpdjmpnebmdgbhcodhlafiicnkd', '["内容词汇","意图分析","NLP优化"]'::jsonb),
('SEO Search Simulator', '模拟任意地区的 Google 搜索，检查指定 URL 是否出现在前 100 名结果中', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/seo-search-simulator-by-n/edfjfgjklednkencfhnokmkajbgfhpon', '["搜索模拟","地区检测","排名查询"]'::jsonb),
('BuzzSumo Extension', '浏览器扩展版 BuzzSumo，快速分析内容传播、链接和社交媒体影响力数据', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/buzzsumo/phpihcpfhciibkmlllgcjkbmhhpcaojc', '["内容传播","社交影响力","链接分析"]'::jsonb),
('Google Lighthouse', 'Google 官方性能审计扩展，提供页面加载速度、无障碍访问和 SEO 详细报告', 'browser-extensions', FALSE, 'free', 'https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk', '["Google官方","性能审计","无障碍"]'::jsonb),
('Checkbot SEO Checker', '同时爬取数百个页面，检查 50 多种常见网站 SEO、页面速度和安全问题', 'browser-extensions', FALSE, 'free', 'https://www.checkbot.io/', '["批量爬取","安全检查","页面速度"]'::jsonb),
('SEO Sidebar', '以侧边栏形式实时显示页面 SEO 数据，支持一键导出文本报告', 'browser-extensions', FALSE, 'free', 'https://chromewebstore.google.com/detail/seo-sidebar/gmmiickdcmghfpliaiefhjafccapgmpp', '["侧边栏","实时SEO","报告导出"]'::jsonb),

-- 验证检测工具
('Broken Link Checker', '自动检测并报告网站上所有损坏的外部和内部链接，网站维护的必备工具', 'validator-checker', FALSE, 'free', 'https://www.brokenlinkcheck.com/', '["断链检测","链接报告","网站维护"]'::jsonb),
('Robots.txt Checker', 'Google 官方 Robots.txt 测试工具，检查文件语法和爬虫访问规则是否正确', 'validator-checker', FALSE, 'free', 'https://search.google.com/search-console', '["Robots.txt","爬虫规则","Google官方"]'::jsonb),
('Rich Result Checker', 'Google 官方富媒体结果测试，检测网站是否符合 Google 富摘要展示资格', 'validator-checker', TRUE, 'free', 'https://search.google.com/test/rich-results', '["富媒体","结构化数据","资格测试"]'::jsonb),
('XML Sitemap Checker', 'XML 网站地图在线验证工具，检查 Sitemap 格式错误和 URL 有效性', 'validator-checker', FALSE, 'free', 'https://www.xml-sitemaps.com/validate-xml-sitemap.html', '["Sitemap验证","XML格式","URL检查"]'::jsonb),

-- 社交媒体与 OG
('ShotOG', '开源边缘原生 OG 图片生成 API，约 50 ms 超低延迟，提升社交媒体点击率', 'social-og', FALSE, 'free', 'https://github.com/nicepkg/shotog', '["OG图片","开源","边缘计算"]'::jsonb),
('ogimg.xyz', '程序化生成 Open Graph 图片的 API 服务，10 种模板、自定义品牌、URL 自动抓取', 'social-og', FALSE, 'free', 'https://ogimg.xyz/', '["OG图片API","自定义模板","品牌定制"]'::jsonb),

-- 其他实用工具
('Pingdom', '网站加载时间测试和性能分析工具，提供全球多地区速度测试和可用性监控', 'miscellaneous', FALSE, 'freemium', 'https://tools.pingdom.com/', '["速度测试","可用性监控","全球测试"]'::jsonb),
('GEO AEO Tracker', '开源、本地优先的 AI 可见度仪表板，免费自托管追踪品牌在 AI 工具中的提及率', 'miscellaneous', TRUE, 'free', 'https://github.com/danishashko/geo-aeo-tracker', '["开源","AI可见度","品牌监测"]'::jsonb),
('MozCast', '实时监测 Google 搜索算法波动温度，今日算法变化情况一目了然', 'miscellaneous', FALSE, 'free', 'https://moz.com/mozcast', '["算法波动","Google更新","实时监测"]'::jsonb),
('IndexNow', '即时通知搜索引擎收录新页面的开放协议工具，加速 Bing/Yandex 等引擎收录', 'miscellaneous', FALSE, 'free', 'https://www.indexnow.org', '["收录加速","IndexNow","即时收录"]'::jsonb),
('SSL Shopper', 'SSL 证书检测和 HTTPS 安全诊断工具，检查证书有效性和 HTTPS 配置问题', 'miscellaneous', FALSE, 'free', 'https://www.sslshopper.com/ssl-checker.html', '["SSL","HTTPS","安全检测"]'::jsonb),
('DataForSEO', '专业 SEO 数据 API 提供商，涵盖排名、关键词、反链等全套 SEO 数据接口', 'miscellaneous', FALSE, 'paid', 'https://dataforseo.com', '["API数据","开发者工具","SEO数据"]'::jsonb),
('SerpApi', '快速、简单、完整的搜索引擎结果 API，支持 Google、Bing 等多个引擎数据抓取', 'miscellaneous', FALSE, 'paid', 'https://serpapi.com', '["搜索结果API","多搜索引擎","开发者"]'::jsonb),
('AlternativeTo', '寻找 SEO 工具替代品的最佳去处，用户评价系统完善，社区活跃', 'miscellaneous', FALSE, 'free', 'https://alternativeto.net', '["工具替代","用户评价","软件对比"]'::jsonb),
('Product Hunt SEO', '获取最新最时髦 SEO 小工具的源头，每日更新最新发布工具，社区活跃', 'miscellaneous', FALSE, 'free', 'https://www.producthunt.com/topics/seo', '["新工具","社区推荐","每日更新"]'::jsonb)

ON CONFLICT DO NOTHING;
