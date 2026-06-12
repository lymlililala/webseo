#!/usr/bin/env python3
"""一次性脚本：加深 GA4 综合 guide(推首页)。重写 content + 内链 + 更新 updated_at。"""
import os, json, urllib.request, urllib.error

envp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env.local")
for line in open(envp, encoding="utf-8"):
    s = line.strip()
    if s and not s.startswith("#") and "=" in s:
        k, v = s.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())
URL = os.environ["VITE_SUPABASE_URL"]
KEY = os.environ["SUPABASE_SECRET_KEY"]
SLUG = "google-analytics-4-seo-complete-guide"

CONTENT = r"""Google Analytics 4 is the default analytics platform for almost every website, but it was not designed with SEO in mind. There is no "Organic Search" report on the home screen, the session-based mental model from Universal Analytics is gone, and several numbers you'll be tempted to report are estimates rather than facts. This guide is the comprehensive reference for using GA4 as an SEO measurement tool — how to set it up correctly, which reports earn their place in a weekly routine, how to go deeper with explorations and BigQuery, and where the platform will mislead you if you trust it blindly.

If you want a pure click-by-click walkthrough rather than a reference, start with the [step-by-step GA4 for SEO tutorial](/articles/how-to-use-ga4-for-seo-step-by-step-tutorial) and come back here for the depth.

## GA4 vs Universal Analytics: what changed for SEO

The shift that matters most is the data model. Universal Analytics counted sessions; GA4 counts events. A pageview, a scroll, a click, a conversion — all events. For SEO this is mostly good news (engagement is measured more honestly) and partly painful (the reports you knew are gone and you rebuild them yourself).

| Feature | Universal Analytics | GA4 |
|---------|--------------------|----|
| Data model | Session-based | Event-based |
| Organic report | Built-in | Build it yourself |
| Engagement metric | Bounce rate | Engagement rate / engaged sessions |
| BigQuery export | Paid (360) only | Free |
| Data retention | Up to 50 months | 2 or 14 months (you choose) |
| Predictive metrics | None | Purchase/churn probability |

The practical takeaway: don't look for the old reports. Learn to filter the new ones to organic, and the platform becomes capable.

## Setting up GA4 for SEO correctly

Three configuration choices separate a useful GA4 property from a frustrating one, and all three default to the wrong setting for SEO.

**Set data retention to 14 months.** Out of the box, GA4 keeps event-level data for two months. That means your year-over-year comparisons and any exploration older than eight weeks come back empty. Go to **Admin → Data settings → Data retention** and change it to 14 months on day one. It does not apply retroactively, so the longer you wait, the more history you lose.

**Link Search Console before anything else.** This is the single most important step for SEO, because GA4 cannot see search queries or impressions on its own — that data belongs to Search Console. Under **Admin → Search Console links → Link**, connect the matching property, then go to **Reports → Library** and *publish* the Search Console collection. Skipping the Library step is the most common reason people think the integration failed; the reports exist but stay hidden until published.

**Define at least one key event.** Organic sessions without a conversion are a vanity metric. Decide what an SEO win looks like — a demo request, a signup, a qualified product view — mark that event as a key event under **Admin → Events**, and it becomes a conversion column in every report. Without it you can grow traffic for months and never prove it produced anything.

## The reports that earn their place

GA4 has dozens of reports. Four do the real SEO work; the rest are noise for our purposes.

**Traffic acquisition, filtered to organic.** Found under **Reports → Acquisition → Traffic acquisition**, this is your top-line organic trend. Add a comparison (or change the channel dimension) so you're looking at *Organic Search* alone rather than all traffic blended together. Watch engaged sessions and engagement rate, not raw sessions — a thousand organic visits with a 20% engagement rate is a content-quality problem, not a win.

**Landing pages.** This is the SEO workhorse. **Reports → Engagement → Landing page**, organic comparison applied, tells you which entry pages pull search traffic, how engaged those visitors are, and which pages convert. Sort by sessions for your top content; then sort high-traffic pages by engagement rate ascending to find the pages bleeding value — those are your refresh candidates.

**Search Console queries.** Once linked, the *Queries* report shows impressions, clicks, CTR and average position per query. The opportunity hides in plain sight: queries with high impressions and an average position between 8 and 20 are page-two rankings, and a focused content refresh frequently lifts them onto page one. Export these monthly and treat them as your content backlog.

**Pages and screens.** **Reports → Engagement → Pages and screens** shows what visitors read *after* the landing page. Healthy internal paths here mean your internal linking is doing its job; pages that consistently dead-end are candidates for better contextual links.

For turning these into a shareable, self-updating view, build a dedicated dashboard rather than screenshotting reports — the [free Looker Studio SEO dashboard guide](/articles/build-free-seo-dashboard-looker-studio-template) walks through connecting GA4 and Search Console into one report.

## Going deeper: explorations and segments

Standard reports answer "what happened." Explorations answer "why." Open **Explore**, start a blank exploration, and you can drag any dimension and metric into a custom table. The four that pay off for SEO are funnel exploration (where organic visitors drop off on the way to a conversion), path exploration (the routes they actually take through the site), segment overlap (how organic compares to other channels), and cohort exploration (whether organic visitors come back).

Segments make organic analysis sharper. These four cover most needs:

```
Organic – Branded            medium = organic, query contains [brand]
Organic – Non-Branded        medium = organic, query does NOT contain [brand]
Organic – Commercial intent  medium = organic, query contains best, vs, review, buy
Organic – Informational      medium = organic, query contains how, what, why, guide
```

Splitting branded from non-branded is especially clarifying. Branded organic traffic measures demand you already created; non-branded measures the demand SEO is capturing. If your "organic growth" is all branded, SEO isn't actually working — your brand marketing is.

## BigQuery for analysis GA4's interface can't do

GA4's free BigQuery export is the platform's most underused SEO feature. It hands you raw, unsampled, event-level data you can query with SQL — no row limits, no thresholding, no shield icon. Link it under **Admin → BigQuery links**, configure a daily export, and within a day you can run analysis the interface refuses to give you.

```sql
-- Organic landing pages by engagement
SELECT
  page_location,
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(*) AS sessions,
  AVG(engagement_time_msec) / 1000 AS avg_engagement_seconds
FROM `project.analytics_dataset.events_*`
WHERE traffic_source.medium = 'organic'
  AND _TABLE_SUFFIX BETWEEN '20260101' AND '20260615'
GROUP BY page_location
ORDER BY sessions DESC
LIMIT 50;
```

```sql
-- Organic conversion rate by page (min 100 users)
SELECT
  page_location,
  COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_pseudo_id END) AS conversions,
  COUNT(DISTINCT user_pseudo_id) AS users,
  ROUND(COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_pseudo_id END)
        / COUNT(DISTINCT user_pseudo_id) * 100, 2) AS conversion_rate
FROM `project.analytics_dataset.events_*`
WHERE traffic_source.medium = 'organic'
GROUP BY page_location
HAVING users > 100
ORDER BY conversion_rate DESC;
```

## Where GA4 quietly misleads you

GA4 is free, and you pay for it in caveats. Knowing these prevents you from reporting fiction.

- **Sampling.** Explorations over large date ranges silently estimate. A shield icon at the top of an exploration means the numbers are sampled — shorten the range or use standard reports for anything you'll report upward.
- **Thresholding.** On low-traffic sites GA4 hides rows to protect user identity, which makes clean low-volume breakdowns impossible. It's a privacy feature, not a bug.
- **Organic vs Search Console mismatch.** GA4 organic sessions rarely match Search Console clicks, because one counts post-load sessions (after consent fires) and the other counts clicks on Google's results. A 10–20% gap is normal; a 60% gap usually means attribution is filing organic visits under "Direct" or "Unassigned."
- **No keyword-level session data.** GA4 will never tell you which keyword drove a specific session — that link was cut years ago. The Search Console integration is the closest substitute, and it joins at the page level, not the session level.

## A weekly SEO routine in GA4

Setup is a one-time cost; the recurring work is small. Each week: open your organic landing-pages report and flag any page that dropped more than ~20% (usually a ranking slip worth checking in Search Console); scan the Queries report for new page-two opportunities; confirm organic conversions are tracking. Fifteen minutes turns GA4 from a dashboard you ignore into a system that tells you where to spend your next hour of SEO work.

## Common GA4 SEO mistakes

1. **Not linking Search Console** — you lose all query and impression data.
2. **Leaving retention at 2 months** — no year-over-year, no long-range explorations.
3. **Reporting raw sessions** — engagement rate and conversions are what tie traffic to value.
4. **Never splitting branded vs non-branded** — you can't tell whether SEO or brand is driving "organic growth."
5. **Trusting sampled explorations** — the shield icon means the number is an estimate.
6. **Skipping BigQuery** — the one place you get unsampled, unthresholded truth, free.

## Frequently asked questions

**How do I use GA4 for SEO when there's no "organic search" report by default?** Build it. Create an exploration or apply a comparison, set the dimension to *Session default channel group* filtered to **Organic Search**, then add landing page and conversions. GA4 hides organic behind a filter rather than handing you a dedicated report like Universal Analytics did.

**How do I connect GA4 and Search Console?** In GA4 Admin, link the Search Console property, then publish the two Search Console reports to your report library. The link adds the query, impression and country data GA4 cannot collect on its own.

**Why don't GA4 sessions match Search Console clicks?** They measure different things — Search Console counts clicks from Google's results; GA4 counts sessions after the browser loads and consent fires. A gap of 10–20% is normal, not a tracking bug.

**Is GA4 enough for SEO, or do I need a paid tool?** For most sites, GA4 plus Search Console covers the whole funnel — impressions and queries from GSC, behavior and conversions from GA4 — for free. Paid platforms add rank tracking and competitive data, but they don't replace this core measurement stack.

**What should I actually track for SEO in GA4?** Organic sessions by landing page, engagement rate, and organic conversions. Those three connect traffic to behavior to outcome; everything else is supporting detail."""

DESC = "The complete guide to using Google Analytics 4 for SEO: correct setup, the four reports that matter, organic segments, BigQuery analysis, a weekly routine, and the GA4 limitations to know — with a step-by-step tutorial and dashboard companion."
TAGS = ["Google Analytics 4", "GA4", "SEO analytics", "organic traffic", "Search Console", "BigQuery", "Looker Studio"]

row = {
    "content": CONTENT,
    "description": DESC,
    "tags": TAGS,
    "read_time": max(3, round(len(CONTENT.split()) / 200)),
    "updated_at": "2026-06-12T09:00:00",
}
data = json.dumps(row).encode("utf-8")
req = urllib.request.Request(
    f"{URL}/rest/v1/wseo_articles?slug=eq.{SLUG}",
    data=data, method="PATCH",
    headers={"apikey": KEY, "Authorization": f"Bearer {KEY}",
             "Content-Type": "application/json", "Prefer": "return=representation"},
)
try:
    out = json.loads(urllib.request.urlopen(req).read())
    print(f"✅ 更新 {SLUG}")
    print(f"   词数: {len(CONTENT.split())} | read_time: {row['read_time']}min | updated_at: {row['updated_at']}")
    print(f"   内链数: {CONTENT.count('](/articles/')}")
except urllib.error.HTTPError as e:
    print("❌", e.code, e.read().decode()[:300])
