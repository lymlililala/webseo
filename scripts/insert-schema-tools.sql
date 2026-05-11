
INSERT INTO wseo_schema_tools (tool_id, name, url, description, highlights, tags, is_free, has_freeplan, pricing, level, is_official, badge, supported_types)
VALUES 
('merkle', 'Merkle Schema Generator', 'https://technicalseo.com/tools/schema-markup-generator/', '最受站长欢迎的免费 Schema 生成器，支持 20+ 类型，界面清晰，无需注册即可生成标准 JSON-LD 代码。', '["免费无需注册","20+ Schema类型","即时生成JSON-LD"]'::jsonb, '["全能","免费","JSON-LD"]'::jsonb, TRUE, FALSE, NULL, 'beginner', TRUE, '站长首选', '["article","faq","product","breadcrumb","howto","video","localbusiness","event","review","person","organization"]'::jsonb),
('google-rich-results', 'Google Rich Results Test', 'https://search.google.com/test/rich-results', 'Google 官方出品的富结果验证工具，生成 Schema 代码后必须在此验证，确保符合 Google 索引标准并能获得富结果展示。', '["Google官方","验证富结果资格","实时预览效果"]'::jsonb, '["官方验证","Google","免费"]'::jsonb, TRUE, FALSE, NULL, 'beginner', TRUE, '官方必备', '["article","faq","product","breadcrumb","howto","video","recipe","review","event"]'::jsonb),
('schema-org-validator', 'Schema.org Validator', 'https://validator.schema.org/', 'Schema.org 官方权威验证器，检查结构化数据是否完全符合 Schema.org 规范，是合规性验证的最终标准。', '["Schema.org官方","合规性权威验证","支持所有类型"]'::jsonb, '["官方验证","Schema.org","免费"]'::jsonb, TRUE, FALSE, NULL, 'advanced', TRUE, '权威验证', '["article","faq","product","breadcrumb","howto","video","recipe","localbusiness","event","review","person","organization"]'::jsonb),
('saijo-george', 'Saijo George JSON-LD', 'https://saijogeorge.com/json-ld-schema-generator/', '极简快速的 JSON-LD 生成器，界面简洁直观，无需注册，覆盖常用 Schema 类型，适合需要快速生成代码的场景。', '["极简快速","无需注册","界面直观"]'::jsonb, '["快速","免费","简洁"]'::jsonb, TRUE, FALSE, '$99/月起', 'beginner', FALSE, '本地SEO推荐', '["article","faq","howto","product","localbusiness","review","event","person"]'::jsonb),
('hall-analysis', 'Hall Analysis Article Schema', 'https://hallanalysis.com/json-ld-generator/', '专注文章类 Schema 的精准生成器，字段覆盖完整，支持 Article、BlogPosting、NewsArticle 等文章子类型。', '["文章类型专精","子类型支持","字段完整"]'::jsonb, '["Article专项","免费","文章"]'::jsonb, TRUE, FALSE, '$99/月起', 'beginner', FALSE, '本地SEO推荐', '["article"]'::jsonb),
('whitespark', 'Whitespark Local Schema', 'https://whitespark.ca/', 'Whitespark 专为本地商家打造的 LocalBusiness Schema 生成器，字段覆盖全面，支持营业时间、服务区域、联系方式等本地 SEO 关键字段。', '["本地商家专精","营业时间支持","本地SEO必备"]'::jsonb, '["LocalBusiness","本地SEO","免费"]'::jsonb, TRUE, FALSE, '$99/月起', 'beginner', FALSE, '本地SEO推荐', '["localbusiness"]'::jsonb),
('recipeschema', 'RecipeSchema.org', 'https://recipeschema.com/', '专为食谱网站设计的 Recipe Schema 生成器，支持食材、步骤、烹饪时间、营养信息等所有食谱相关字段。', '["食谱专属","营养信息支持","步骤结构化"]'::jsonb, '["Recipe专项","食谱","免费"]'::jsonb, TRUE, FALSE, '$99/月起', 'beginner', FALSE, '全自动', '["recipe"]'::jsonb),
('schema-app', 'Schema App', 'https://schemaapp.com/', '全自动企业级 Schema 管理平台，AI 自动识别页面类型并生成结构化数据，支持大规模网站批量部署，提供持续监测。', '["AI自动识别","企业级管理","批量部署监测"]'::jsonb, '["AI自动化","企业级","全自动"]'::jsonb, TRUE, FALSE, '$99/月起', 'auto', FALSE, '全自动', '["article","faq","product","breadcrumb","howto","video","localbusiness"]'::jsonb),
('wordlift', 'WordLift', 'https://wordlift.io/', 'AI 驱动的内容知识图谱和 Schema 自动标注平台，能自动识别内容实体并生成结构化数据，同时构建网站知识图谱。', '["AI实体识别","知识图谱构建","内容语义分析"]'::jsonb, '["AI自动化","知识图谱","实体识别"]'::jsonb, TRUE, TRUE, '$49/月起', 'auto', FALSE, 'WordPress推荐', '["article","product","organization","person"]'::jsonb),
('rankmath', 'RankMath', 'https://rankmath.com/wordpress/plugin/seo-suite/', 'WordPress 最流行的 SEO 插件，内置 Schema 自动生成模块，支持 20+ 类型，根据页面内容智能推荐 Schema 类型，设置一次持续生效。', '["WordPress专属","智能推荐类型","设置一次持续"]'::jsonb, '["WordPress","AI辅助","插件"]'::jsonb, TRUE, TRUE, '免费版 + Pro $59/年', 'auto', FALSE, 'WordPress推荐', '["article","faq","product","breadcrumb","howto","video","localbusiness","review","recipe"]'::jsonb),
('yoast', 'Yoast SEO', 'https://yoast.com/wordpress/plugins/seo/', 'WordPress 老牌 SEO 插件，支持 Schema 自动生成，与 RankMath 并列为 WordPress 站长的两大首选，稳定可靠。', '["WordPress老牌","稳定可靠","自动生成"]'::jsonb, '["WordPress","Schema自动化","插件"]'::jsonb, TRUE, TRUE, '免费版 + Premium €99/年', 'auto', FALSE, NULL, '["article","faq","product","breadcrumb","howto","localbusiness"]'::jsonb)
ON CONFLICT (tool_id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  tags = EXCLUDED.tags,
  is_free = EXCLUDED.is_free,
  has_freeplan = EXCLUDED.has_freeplan,
  pricing = EXCLUDED.pricing,
  level = EXCLUDED.level,
  is_official = EXCLUDED.is_official,
  badge = EXCLUDED.badge,
  supported_types = EXCLUDED.supported_types,
  updated_at = NOW();
