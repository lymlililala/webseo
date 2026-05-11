-- WebSEO Project Database Schema
-- Project Prefix: wseo_
-- Created for Supabase

-- ============================================================================
-- 1. ARTICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('seo', 'geo', 'aeo', 'tools')),
  tags JSONB DEFAULT '[]',
  read_time INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wseo_articles_category ON wseo_articles(category);
CREATE INDEX idx_wseo_articles_date ON wseo_articles(date DESC);

-- ============================================================================
-- 2. TUTORIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('seo', 'geo', 'aeo')),
  instructor VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER NOT NULL,
  students INTEGER DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 5.0,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wseo_tutorials_category ON wseo_tutorials(category);
CREATE INDEX idx_wseo_tutorials_difficulty ON wseo_tutorials(difficulty);

-- ============================================================================
-- 3. TUTORIAL LESSONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_tutorial_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutorial_id UUID NOT NULL REFERENCES wseo_tutorials(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tutorial_id, lesson_number)
);

CREATE INDEX idx_wseo_lessons_tutorial ON wseo_tutorial_lessons(tutorial_id);

-- ============================================================================
-- 4. NEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('seo', 'geo', 'aeo', 'ai', 'industry')),
  source VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  impact VARCHAR(50) NOT NULL CHECK (impact IN ('high', 'medium', 'low')),
  tags JSONB DEFAULT '[]',
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wseo_news_category ON wseo_news(category);
CREATE INDEX idx_wseo_news_date ON wseo_news(date DESC);
CREATE INDEX idx_wseo_news_impact ON wseo_news(impact);

-- ============================================================================
-- 5. SEO TOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_seo_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  ai_supported BOOLEAN DEFAULT FALSE,
  price VARCHAR(50) NOT NULL CHECK (price IN ('free', 'paid', 'freemium')),
  url VARCHAR(500) NOT NULL,
  rating NUMERIC(3,1) DEFAULT 4.5,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wseo_seo_tools_category ON wseo_seo_tools(category);
CREATE INDEX idx_wseo_seo_tools_price ON wseo_seo_tools(price);

-- ============================================================================
-- 6. GEO TOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_geo_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  region VARCHAR(100),
  open_source BOOLEAN DEFAULT FALSE,
  price VARCHAR(50) NOT NULL CHECK (price IN ('free', 'paid', 'freemium')),
  url VARCHAR(500) NOT NULL,
  rating NUMERIC(3,1) DEFAULT 4.5,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wseo_geo_tools_region ON wseo_geo_tools(region);
CREATE INDEX idx_wseo_geo_tools_price ON wseo_geo_tools(price);

-- ============================================================================
-- 7. AEO TOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wseo_aeo_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  open_source BOOLEAN DEFAULT FALSE,
  price VARCHAR(50) NOT NULL CHECK (price IN ('free', 'paid', 'freemium')),
  url VARCHAR(500) NOT NULL,
  rating NUMERIC(3,1) DEFAULT 4.5,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wseo_aeo_tools_category ON wseo_aeo_tools(category);
CREATE INDEX idx_wseo_aeo_tools_price ON wseo_aeo_tools(price);

-- ============================================================================
-- 8. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE wseo_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wseo_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE wseo_tutorial_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wseo_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE wseo_seo_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE wseo_geo_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE wseo_aeo_tools ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. RLS POLICIES - Allow Public Read Access
-- ============================================================================
CREATE POLICY "Allow public read on articles" ON wseo_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read on tutorials" ON wseo_tutorials FOR SELECT USING (true);
CREATE POLICY "Allow public read on lessons" ON wseo_tutorial_lessons FOR SELECT USING (true);
CREATE POLICY "Allow public read on news" ON wseo_news FOR SELECT USING (true);
CREATE POLICY "Allow public read on seo_tools" ON wseo_seo_tools FOR SELECT USING (true);
CREATE POLICY "Allow public read on geo_tools" ON wseo_geo_tools FOR SELECT USING (true);
CREATE POLICY "Allow public read on aeo_tools" ON wseo_aeo_tools FOR SELECT USING (true);
