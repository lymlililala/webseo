export interface SchemaTool {
  id: string
  name: string
  url: string
  description: string
  highlights: string[]
  tags: string[]
  isFree?: boolean
  hasFreeplan?: boolean
  pricing?: string
  level: 'beginner' | 'advanced' | 'auto' // 新手 / 进阶 / 全自动
  isOfficial?: boolean
  badge?: string
  supportedTypes?: string[] // 支持的 Schema 类型 ID
}

export interface SchemaType {
  id: string
  name: string // 类型名 Article / FAQ ...
  icon: string
  color: string
  stars: number // 站长需求频率 1-5
  description: string
  aeoTip?: string // AEO/GEO 相关提示
  internalLink?: string // 站内内链
  internalLinkLabel?: string
  jsonTemplate: string // JSON-LD 模板代码
  requiredFields: { name: string; desc: string }[]
  tools: string[] // 推荐工具 id 列表
}

// ── 工具数据 ──────────────────────────────────────────────────
export const schemaTools: SchemaTool[] = [
  // 全能型
  {
    id: 'merkle',
    name: 'Merkle Schema Generator',
    url: 'https://technicalseo.com/tools/schema-markup-generator/',
    description: 'The most popular free Schema generator — supports 20+ types with a clean UI and standard JSON-LD, no signup required.',
    highlights: ['Free, No Signup', '20+ Schema Types', 'Instant JSON-LD'],
    tags: ['All-Purpose', 'Free', 'JSON-LD'],
    isFree: true,
    level: 'beginner',
    badge: 'Top Pick',
    supportedTypes: [
      'article',
      'faq',
      'product',
      'breadcrumb',
      'howto',
      'video',
      'localbusiness',
      'event',
      'review',
      'person',
      'organization',
    ],
  },
  {
    id: 'google-rich-results',
    name: 'Google Rich Results Test',
    url: 'https://search.google.com/test/rich-results',
    description:
      'Google’s official Rich Results Test — validate your Schema here to ensure it meets Google’s indexing standards and qualifies for rich results.',
    highlights: ['Google Official', 'Validates Rich Results', 'Live Preview'],
    tags: ['Official Validator', 'Google', 'Free'],
    isFree: true,
    isOfficial: true,
    level: 'beginner',
    badge: 'Official Essential',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'video', 'recipe', 'review', 'event'],
  },
  {
    id: 'schema-org-validator',
    name: 'Schema.org Validator',
    url: 'https://validator.schema.org/',
    description: 'Schema.org’s official validator — checks whether your structured data fully complies with the Schema.org spec; the final word on compliance.',
    highlights: ['Schema.org Official', 'Authoritative Compliance Check', 'All Types Supported'],
    tags: ['Official Validator', 'Schema.org', 'Free'],
    isFree: true,
    isOfficial: true,
    level: 'advanced',
    badge: 'Authoritative',
    supportedTypes: [
      'article',
      'faq',
      'product',
      'breadcrumb',
      'howto',
      'video',
      'recipe',
      'localbusiness',
      'event',
      'review',
      'person',
      'organization',
    ],
  },
  {
    id: 'saijo-george',
    name: 'Saijo George JSON-LD',
    url: 'https://saijogeorge.com/json-ld-schema-generator/',
    description:
      'A minimal, fast JSON-LD generator with a clean, intuitive UI and no signup, covering common Schema types — ideal when you need code quickly.',
    highlights: ['Minimal & Fast', 'No Signup', 'Intuitive UI'],
    tags: ['Fast', 'Free', 'Simple'],
    isFree: true,
    level: 'beginner',
    supportedTypes: ['article', 'faq', 'howto', 'product', 'localbusiness', 'review', 'event', 'person'],
  },
  {
    id: 'hall-analysis',
    name: 'Hall Analysis Article Schema',
    url: 'https://hallanalysis.com/json-ld-generator/',
    description: 'A precise generator focused on article Schema with complete field coverage, supporting Article, BlogPosting, NewsArticle and other subtypes.',
    highlights: ['Article-Focused', 'Subtype Support', 'Complete Fields'],
    tags: ['Article-Specific', 'Free', 'Articles'],
    isFree: true,
    level: 'beginner',
    supportedTypes: ['article'],
  },
  {
    id: 'whitespark',
    name: 'Whitespark Local Schema',
    url: 'https://whitespark.ca/',
    description:
      'Whitespark’s LocalBusiness Schema generator for local businesses, with thorough field coverage including opening hours, service area and contact info.',
    highlights: ['Local-Business Focused', 'Opening Hours', 'Local SEO Essential'],
    tags: ['LocalBusiness', 'Local SEO', 'Free'],
    isFree: true,
    level: 'beginner',
    badge: 'Local SEO Pick',
    supportedTypes: ['localbusiness'],
  },
  {
    id: 'recipeschema',
    name: 'RecipeSchema.org',
    url: 'https://recipeschema.com/',
    description: 'A Recipe Schema generator for recipe sites, supporting ingredients, steps, cook time, nutrition and all recipe-related fields.',
    highlights: ['Recipe-Specific', 'Nutrition Info', 'Structured Steps'],
    tags: ['Recipe-Specific', 'Recipes', 'Free'],
    isFree: true,
    level: 'beginner',
    supportedTypes: ['recipe'],
  },
  // AI 自动化（付费进阶）
  {
    id: 'schema-app',
    name: 'Schema App',
    url: 'https://schemaapp.com/',
    description:
      'A fully automated enterprise Schema platform — AI auto-detects page types and generates structured data, with bulk deployment for large sites and ongoing monitoring.',
    highlights: ['AI Auto-Detection', 'Enterprise Management', 'Bulk Deploy & Monitor'],
    tags: ['AI Automation', 'Enterprise', 'Fully Automated'],
    hasFreeplan: false,
    pricing: 'From $99/mo',
    level: 'auto',
    badge: 'Fully Automated',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'video', 'localbusiness'],
  },
  {
    id: 'wordlift',
    name: 'WordLift',
    url: 'https://wordlift.io/',
    description:
      'An AI-driven content knowledge-graph and Schema auto-tagging platform that detects content entities, generates structured data and builds a site knowledge graph.',
    highlights: ['AI Entity Detection', 'Knowledge-Graph Building', 'Content Semantics'],
    tags: ['AI Automation', 'Knowledge Graph', 'Entity Detection'],
    hasFreeplan: true,
    pricing: 'From $49/mo',
    level: 'auto',
    supportedTypes: ['article', 'product', 'organization', 'person'],
  },
  {
    id: 'rankmath',
    name: 'RankMath',
    url: 'https://rankmath.com/wordpress/plugin/seo-suite/',
    description:
      'The most popular WordPress SEO plugin, with a built-in Schema module supporting 20+ types and smart type recommendations based on page content — set it once.',
    highlights: ['WordPress-Specific', 'Smart Type Recommendation', 'Set Once'],
    tags: ['WordPress', 'AI-Assisted', 'Plugin'],
    hasFreeplan: true,
    pricing: 'Free + Pro $59/yr',
    level: 'auto',
    badge: 'WordPress Pick',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'video', 'localbusiness', 'review', 'recipe'],
  },
  {
    id: 'yoast',
    name: 'Yoast SEO',
    url: 'https://yoast.com/wordpress/plugins/seo/',
    description:
      'A veteran WordPress SEO plugin with automatic Schema generation; alongside RankMath it’s a top choice for WordPress owners — stable and reliable.',
    highlights: ['WordPress Veteran', 'Stable & Reliable', 'Auto-Generation'],
    tags: ['WordPress', 'Schema Automation', 'Plugin'],
    hasFreeplan: true,
    pricing: 'Free + Premium €99/yr',
    level: 'auto',
    supportedTypes: ['article', 'faq', 'product', 'breadcrumb', 'howto', 'localbusiness'],
  },
]

// ── Schema 类型数据 ────────────────────────────────────────────
export const schemaTypes: SchemaType[] = [
  {
    id: 'article',
    name: 'Article',
    icon: 'article',
    color: '#6366F1',
    stars: 5,
    description:
      'Structured markup for articles, blog posts and news pages. Helps search engines identify publish date, author and content type — a foundation for content-site SEO.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your article title",
  "description": "Article summary (under 150 characters)",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Site name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-01-01",
  "dateModified": "2026-05-01",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/article-url"
  }
}`,
    requiredFields: [
      { name: 'headline', desc: 'Article title (required, ideally 50–60 characters)' },
      { name: 'author', desc: 'Author info, using the Person or Organization type' },
      { name: 'datePublished', desc: 'Original publish date, in ISO 8601 format' },
      { name: 'image', desc: 'Article featured-image URL, recommended 1200×628px' },
    ],
    tools: ['merkle', 'hall-analysis', 'saijo-george'],
  },
  {
    id: 'faq',
    name: 'FAQ',
    icon: 'quiz',
    color: '#10B981',
    stars: 5,
    description:
      'Structured markup for FAQ pages — shows expandable Q&A in Google results and is the format AI engines (ChatGPT, Perplexity) cite most directly.',
    aeoTip:
      'FAQ Schema is one of the most effective AEO tactics — the Q&A format matches AI search’s “direct answer” needs perfectly and greatly raises citation odds.',
    internalLink: '/aeo-nav',
    internalLinkLabel: 'View AEO optimization tools →',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question 1?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A detailed answer to question 1 (50–300 chars), answering directly."
      }
    },
    {
      "@type": "Question",
      "name": "Question 2?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A detailed answer to question 2."
      }
    }
  ]
}`,
    requiredFields: [
      { name: 'mainEntity', desc: 'An array of Q&A items, each with a Question and Answer' },
      { name: 'name', desc: 'Question text (Question.name) — use real user questions' },
      { name: 'acceptedAnswer.text', desc: 'Answer text, plain text, ideally 50–300 characters' },
    ],
    tools: ['saijo-george', 'merkle', 'google-rich-results'],
  },
  {
    id: 'product',
    name: 'Product',
    icon: 'shopping_bag',
    color: '#F59E0B',
    stars: 5,
    description: 'Structured markup for product pages — shows price, rating and stock in results to boost e-commerce click-through.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product name",
  "description": "Product description",
  "image": "https://example.com/product.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Brand name"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/product"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "128"
  }
}`,
    requiredFields: [
      { name: 'name', desc: 'Product name (required)' },
      { name: 'offers', desc: 'Price and availability info, using the Offer type' },
      { name: 'image', desc: 'Product image URL' },
      { name: 'aggregateRating', desc: 'Rating data, backed by real reviews' },
    ],
    tools: ['merkle', 'google-rich-results'],
  },
  {
    id: 'breadcrumb',
    name: 'BreadcrumbList',
    icon: 'account_tree',
    color: '#8B5CF6',
    stars: 4,
    description:
      'Structured markup for breadcrumb navigation — shows a clear page-path hierarchy in results, improving orientation and click-through.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Current page title",
      "item": "https://example.com/category/page/"
    }
  ]
}`,
    requiredFields: [
      { name: 'itemListElement', desc: 'Breadcrumb hierarchy array, in order' },
      { name: 'position', desc: 'Position number, starting from 1' },
      { name: 'name', desc: 'The page name at this level' },
      { name: 'item', desc: 'The page URL at this level' },
    ],
    tools: ['merkle', 'saijo-george'],
  },
  {
    id: 'howto',
    name: 'HowTo',
    icon: 'checklist',
    color: '#06B6D4',
    stars: 4,
    description:
      'Structured markup for tutorials and how-to content — shows a step list in results, ideal for “how to X” content and eligible for special rich results.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to do X — full tutorial",
  "description": "Tutorial summary",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Step 1 title",
      "text": "Detailed instructions for step 1."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Step 2 title",
      "text": "Detailed instructions for step 2."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Step 3 title",
      "text": "Detailed instructions for step 3."
    }
  ]
}`,
    requiredFields: [
      { name: 'name', desc: 'Tutorial title (required)' },
      { name: 'step', desc: 'HowToStep array, each with position, name and text' },
      { name: 'totalTime', desc: 'Estimated total time, ISO 8601 duration (e.g. PT30M = 30 min)' },
    ],
    tools: ['saijo-george', 'merkle'],
  },
  {
    id: 'localbusiness',
    name: 'LocalBusiness',
    icon: 'store',
    color: '#EF4444',
    stars: 4,
    description:
      'Structured markup for local-business info — shows address, phone, hours and rating; a core local-SEO config affecting Google Maps and local results.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business name",
  "description": "Business summary",
  "image": "https://example.com/shop.jpg",
  "telephone": "+86-xxx-xxxx-xxxx",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Street address",
    "addressLocality": "City",
    "addressRegion": "State/Province",
    "postalCode": "Postal code",
    "addressCountry": "CN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.9042,
    "longitude": 116.4074
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "url": "https://example.com"
}`,
    requiredFields: [
      { name: 'name', desc: 'Business name (required)' },
      { name: 'address', desc: 'Full address, using the PostalAddress type' },
      { name: 'telephone', desc: 'Contact phone number' },
      { name: 'openingHoursSpecification', desc: 'Opening hours, affecting the Google local panel' },
    ],
    tools: ['whitespark', 'merkle', 'saijo-george'],
  },
  {
    id: 'video',
    name: 'VideoObject',
    icon: 'play_circle',
    color: '#EC4899',
    stars: 3,
    description:
      'Structured markup for video content — shows thumbnail, duration and upload date in Google results; ideal for media and education sites with video.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video title",
  "description": "Video description",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2026-01-01",
  "duration": "PT10M30S",
  "contentUrl": "https://example.com/video.mp4",
  "embedUrl": "https://www.youtube.com/embed/xxxxx"
}`,
    requiredFields: [
      { name: 'name', desc: 'Video title (required)' },
      { name: 'thumbnailUrl', desc: 'Thumbnail URL (required), recommended 1280×720px' },
      { name: 'uploadDate', desc: 'Upload date, ISO 8601 format (required)' },
      { name: 'duration', desc: 'Video duration, ISO 8601 duration format' },
    ],
    tools: ['merkle', 'google-rich-results'],
  },
  {
    id: 'recipe',
    name: 'Recipe',
    icon: 'restaurant',
    color: '#F97316',
    stars: 3,
    description:
      'Structured markup for recipes — shows cook time, calories and rating in results; essential Schema for food blogs and recipe sites.',
    jsonTemplate: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Recipe name",
  "image": "https://example.com/dish.jpg",
  "author": {
    "@type": "Person",
    "name": "Author name"
  },
  "datePublished": "2026-01-01",
  "description": "Dish summary",
  "prepTime": "PT15M",
  "cookTime": "PT30M",
  "totalTime": "PT45M",
  "recipeYield": "Serves 4",
  "recipeIngredient": [
    "Ingredient 1 200g",
    "Ingredient 2 to taste"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "Step 1 description"
    }
  ]
}`,
    requiredFields: [
      { name: 'name', desc: 'Recipe name (required)' },
      { name: 'image', desc: 'Dish image (required, affects rich-result display)' },
      { name: 'recipeIngredient', desc: 'Ingredient list array' },
      { name: 'recipeInstructions', desc: 'Cooking steps, using a HowToStep array' },
    ],
    tools: ['recipeschema', 'merkle'],
  },
]

// ── 辅助函数 ─────────────────────────────────────────────────
export function getToolById(id: string): SchemaTool | undefined {
  return schemaTools.find((t) => t.id === id)
}

export function getToolsForType(typeId: string): SchemaTool[] {
  const type = schemaTypes.find((t) => t.id === typeId)
  if (!type) return []
  return type.tools.map((tid) => getToolById(tid)).filter(Boolean) as SchemaTool[]
}
