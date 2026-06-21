-- 公众号源文持久化表（供 GitHub Actions 跨运行稳定去重，不依赖 actions/cache）。
-- 在 Supabase SQL Editor 执行一次即可。与文章表 wseo_articles 同库。
-- 源文仅作采集中间产物（合规：不对外展示原文，成品是多源综合翻译的原创英文）。

create table if not exists wseo_wx_sources (
  sn           text primary key,              -- 公众号文章唯一标识（去重键）
  account      text,                          -- 来源公众号名
  wxid         text,                          -- 公众号 wxid
  title        text,
  digest       text default '',
  content_url  text,
  published_at timestamptz,
  body_text    text default '',               -- 清洗后的正文纯文本
  updated_at   timestamptz default now()
);

create index if not exists idx_wseo_wx_sources_published
  on wseo_wx_sources (published_at desc);
