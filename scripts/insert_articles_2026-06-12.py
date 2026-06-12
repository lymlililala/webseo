#!/usr/bin/env python3
"""一次性脚本：插入 3 篇 GSC 数据驱动的精准英文文章。运行后可删除。"""
import os, json, uuid, urllib.request, urllib.error

# 加载 .env.local
envp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env.local")
for line in open(envp, encoding="utf-8"):
    s = line.strip()
    if s and not s.startswith("#") and "=" in s:
        k, v = s.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())
URL = os.environ["VITE_SUPABASE_URL"]
KEY = os.environ["SUPABASE_SECRET_KEY"]

GA4 = r"""If you already track organic traffic in Universal Analytics' mental model, GA4 will feel backwards at first. There is no "Organic Search" landing-page report waiting for you on the home screen, the bounce-rate column you relied on is gone, and the data is event-based rather than session-based. This tutorial walks through the exact clicks to turn GA4 into a usable SEO reporting tool, and flags the places where it quietly lies to you.

## Step 1: Connect Search Console first

Before touching any report, link Search Console. GA4 and Search Console answer different questions — GSC tells you what happened *before* the click (impressions, queries, position), GA4 tells you what happened *after* (engagement, conversions). You want both in one place.

Go to **Admin** (the gear icon, bottom left) → under *Product links* choose **Search Console links** → **Link**. Pick the GSC property that matches your domain, choose the web stream, and confirm. The link takes effect immediately, but the two Search Console reports it unlocks stay hidden until you publish them to a collection.

To surface them: **Reports** → **Library** (bottom of the left nav) → find the *Search Console* collection card and click **Publish**. Now "Search Console" appears in your left-hand report list with two sub-reports: *Queries* and *Google organic search traffic*. If you skip the Library step, you will swear the integration is broken. It isn't — Google just hides it by default.

## Step 2: Build an organic-only lens

Most GA4 reports mix every channel together, which is useless for SEO. You have two ways to isolate organic search.

The quick way is a **comparison**. Open any report, click **Add comparison** at the top, set *Dimension* = `Session default channel group`, *Match type* = exactly matches, *Value* = `Organic Search`, and apply. Every chart on the page now shows organic alongside the all-traffic baseline. Comparisons are session-scoped and don't survive a page reload, so they're best for ad-hoc digging.

The durable way is an **exploration**. Go to **Explore** → blank exploration. Drag `Session default channel group` into *Rows*, drag `Sessions`, `Engaged sessions`, `Engagement rate` and `Conversions` into *Values*, then add a filter where `Session default channel group` exactly matches `Organic Search`. Save it and it becomes a reusable organic dashboard you can return to weekly.

## Step 3: The four reports that actually matter

**Landing pages.** This is the SEO workhorse. **Reports** → **Engagement** → **Landing page**. Add the organic comparison from Step 2. Now you can see which entry pages pull organic sessions, how engaged those visitors are, and which pages convert. Sort by *Sessions* descending and you have your top organic content; sort by *Engagement rate* ascending among high-traffic pages and you have your fix-it list.

**Queries (from the GSC link).** The *Queries* report under Search Console shows impressions, clicks, CTR and average position per query — the same data as GSC, but joinable with GA4 behaviour. Watch for queries with high impressions and a position between 8 and 20: those are page-two rankings a content refresh can often push onto page one.

**Pages and screens.** **Reports** → **Engagement** → **Pages and screens** tells you what people read *after* the landing page. Strong internal paths here are a signal your internal linking is working; dead-end pages with high exits are refresh candidates.

**Conversions.** Define at least one key event that represents SEO value — a demo request, a signup, a qualified pageview. Without a conversion, organic traffic is a vanity number. Mark the event as a key event under **Admin** → *Events*, and it flows into every report as a conversion column.

## Step 4: Know where GA4 misleads you

GA4 is free, which means you pay in caveats.

- **Sampling.** Explorations on large date ranges silently sample. If you see a shield icon at the top of an exploration, the numbers are estimated, not exact. Shorten the range or use the standard reports (which sample less) for anything you'll report upward.
- **"(not set)" and thresholding.** When traffic is low, GA4 applies data thresholds to protect identity and hides rows. Small sites see this constantly. It's not a bug; you just can't get clean low-volume breakdowns.
- **Attribution drift.** GA4's default channel grouping occasionally files genuine organic visits under "Unassigned" or "Direct," especially when referrer data is stripped. Cross-check totals against Search Console clicks; if GA4 organic is wildly lower than GSC clicks, attribution is the usual culprit.
- **No keyword-level landing data natively.** GA4 won't tell you which keyword drove a session — that link was severed years ago. The GSC integration is the closest you get, and it joins at the page level, not the session level.

## A weekly 15-minute routine

Once the setup above is in place, the recurring work is small. Open the saved organic exploration and note the week-over-week sessions trend. Open Landing pages, organic comparison applied, and scan for any page that dropped more than 20% — that's usually a ranking slip worth checking in GSC. Open Queries, sort by impressions, and look for new page-two queries to target. Fifteen minutes, and you're working from data instead of hunches.

GA4 is not a great SEO tool out of the box, but it's a capable one after these four steps. Pair it with Search Console for the pre-click half of the story, and you have everything most sites need without paying for a third-party platform."""

LOOKER = r"""A spreadsheet that you update by hand every Monday is not a dashboard — it's a chore you'll abandon by week three. The point of a real SEO dashboard is that it refreshes itself. Looker Studio (formerly Google Data Studio) does this for free, pulls directly from Search Console and GA4, and produces something you can share with a client or a CEO without exporting a single CSV. Here's how to build one that's actually worth opening.

## What you need before you start

Three things: a Search Console property, a GA4 property, and a Google account with access to both. That's it. Looker Studio is free, the connectors are first-party, and nothing needs installing. If you manage SEO for someone else, get *viewer* access to their GSC and GA4 rather than asking them to build it — the dashboard will live in your Looker Studio and update from their data.

## Step 1: Connect the data sources

Open [lookerstudio.google.com](https://lookerstudio.google.com), create a **Blank report**, and when prompted, add a data source. Add **Search Console** first. The connector asks you to choose the property and then a table type: *Site impression* (aggregated by query/date) or *URL impression* (aggregated by page). You'll want both eventually, so add the source twice — once as each table type. Then add a **Google Analytics** source and pick your GA4 property.

A common mistake is wiring every chart to GA4 because it feels more powerful. Don't. Search Console is the better source for rankings, impressions, CTR and queries; GA4 is the better source for engagement and conversions. Use each for what it's good at.

## Step 2: The top row — scorecards that answer "are we up or down?"

The first thing anyone looks at is the trend. Build a row of four **Scorecards** across the top, each with a comparison set to *previous period*:

- **Total clicks** (Search Console)
- **Total impressions** (Search Console)
- **Average CTR** (Search Console)
- **Average position** (Search Console — and remember, *down* is good here)

The previous-period comparison turns each scorecard into a green/red delta. For average position, flip your interpretation: a red "−3%" means you moved from position 12 to 11.6, which is an improvement. It's the one metric where the colour lies, so add a short text note next to it.

## Step 3: The trend chart — clicks and impressions over time

Add a **Time series chart** below the scorecards, source = Search Console, dimension = Date, metrics = Clicks and Impressions on two axes. Set the default date range to *Last 28 days* and enable a date-range control at the top of the page so viewers can widen it. This single chart tells the growth story; everything below it is diagnosis.

## Step 4: The diagnosis tables

Two tables do most of the analytical work.

**Top queries.** A table from the Site-impression source: dimension = Query, metrics = Clicks, Impressions, CTR, Position. Sort by impressions. Add a filter to hide branded queries if you want to see only the discovery traffic. The gold is queries with thousands of impressions but a position of 8–20 — page-two rankings one good edit can lift.

**Top landing pages.** A table from the URL-impression source joined with GA4: dimension = Landing page, metrics = Clicks (GSC) and Engagement rate / Conversions (GA4). This is where SEO meets outcome. A page with rising clicks but a collapsing engagement rate is a ranking you're about to lose.

## Step 5: Controls and filters

Add three controls to the report header: a **date-range control**, a **drop-down filter** on country (most sites have one or two markets that matter and a long tail that distorts averages), and a **drop-down filter** on device. With these, a single dashboard answers a dozen questions without you building a dozen pages.

## Step 6: Make it shareable and self-updating

Click **Share** and either grant view access to specific emails or schedule an email delivery — Looker Studio can mail a PDF snapshot every Monday at 8am, which is often all a stakeholder wants. Because the connectors are live, the report reflects the latest data every time it's opened; there is no manual refresh.

## The honest limitations

Looker Studio is generous but not unlimited. Search Console data is capped at 16 months and the API returns at most a few thousand rows per query, so very large sites will see sampling or truncation on the biggest tables. The GSC connector also lags by 2–3 days, same as Search Console itself, so "today" will always look empty. And joining GSC pages to GA4 landing pages relies on the URLs matching exactly — trailing slashes, parameters and protocol differences will silently split a page into two rows. Normalise your URLs or add a calculated field to strip parameters if this bites you.

None of that undermines the core value: ten minutes of setup replaces an hour of weekly CSV wrangling, and the result is a living dashboard you can hand to anyone. Start with the four scorecards and one trend chart, ship it, and add tables as questions come up. A dashboard that exists and gets opened beats the perfect one you never finish."""

LOCAL = r"""A technical SEO audit and a local SEO audit overlap less than people assume. Crawl depth and Core Web Vitals barely move the needle on whether you show up in the Google Map Pack for "plumber near me." Local ranking runs on a different engine — proximity, prominence, and relevance to a physical place — and the audit that improves it looks almost nothing like a site-wide technical sweep. This checklist is organised the way Google actually weighs local signals, from the assets that matter most to the ones that are nice-to-have.

## 1. Google Business Profile — the single biggest lever

For local search, your Business Profile usually outweighs your website. Audit it first.

- **Claim and verification status.** The profile must be claimed and verified. Unverified or unclaimed listings rank poorly and are vulnerable to third-party edits.
- **Primary category.** This is the highest-impact field on the entire profile. Pick the most specific category that describes the business, not the broadest. "Mexican restaurant" beats "restaurant"; "emergency plumber" beats "plumber" if that's the core service.
- **Secondary categories.** Add every genuinely relevant secondary category — they expand the set of searches you're eligible for without diluting the primary.
- **NAP exactness.** Name, address and phone must match your website and citations character-for-character. "Suite 200" in one place and "Ste 200" in another is the kind of inconsistency that quietly suppresses rankings.
- **Hours, including special hours.** Stale holiday hours frustrate users and the resulting negative signals (people arriving at a closed business) hurt. Keep them current.
- **Photos and recency.** Profiles with regularly added, geotagged photos tend to outperform abandoned ones. Check that the cover and logo are set and that new photos have been added in the last 30 days.
- **Products and services.** Populate the services list with descriptions. It's underused real estate that reinforces relevance.

## 2. Reviews — prominence you can influence

Reviews drive both ranking and click-through, and they're one of the few prominence signals you can actively build.

- **Volume and velocity.** A steady trickle of new reviews beats a big batch followed by silence. Check the date of the most recent review — anything older than a month suggests no acquisition process.
- **Average rating.** Below roughly 4.0 stars, click-through suffers regardless of position. Audit the recent negative reviews for patterns worth fixing operationally.
- **Owner responses.** Responding to reviews — positive and negative — is a documented best practice. Check the response rate; aim for close to 100% on recent reviews.
- **Keyword presence in reviews.** You can't script reviews, but the natural language customers use ("they fixed our water heater fast") reinforces relevance. Note whether reviews mention core services at all.

## 3. NAP consistency and citations

Citations — mentions of your name, address and phone across the web — are the connective tissue of local prominence.

- **Core directories.** Verify the listing exists and is consistent on the major aggregators and platforms: Apple Maps, Bing Places, Facebook, Yelp, and your industry-specific directories. Inconsistent or duplicate listings split your signal.
- **Duplicate listings.** Search the business name and phone number on Google Maps to surface accidental duplicates. Duplicates compete with each other and confuse Google; get them merged or removed.
- **Citation accuracy over quantity.** A handful of accurate, authoritative citations beats hundreds of scraped, inconsistent ones. Prioritise fixing wrong data over chasing new listings.

## 4. On-page local signals

Now the website. Local on-page work is narrower than general SEO but specific.

- **Location in title tags and H1s.** Service pages should name the city or service area in the title and heading where it reads naturally — not stuffed, but present.
- **A real, crawlable NAP on the site.** Put the name, address and phone in the footer as text (not baked into an image), and ideally in the header of contact pages.
- **LocalBusiness schema.** Add `LocalBusiness` (or the appropriate sub-type) structured data with name, address, geo coordinates, opening hours and phone. Validate it in the Rich Results Test. This is the cleanest way to hand Google your local facts.
- **Dedicated location pages.** If you serve multiple areas, each location deserves its own indexable page with unique content — not a doorway page with the city name swapped. Thin, templated location pages are a liability, not an asset.
- **Embedded map.** An embedded Google Map of the verified location on the contact page is a small but legitimate relevance signal.

## 5. Local links and relevance

- **Locally relevant backlinks.** Links from local news, chambers of commerce, sponsorships and community organisations carry geographic relevance that generic links don't. Audit whether any of your backlinks are genuinely local.
- **Local content.** Pages about local events, area guides or community involvement earn local links and reinforce that the business is part of the place. Note whether any exists.

## 6. The technical minimum

Local doesn't need a 200-point technical audit, but a few basics gate everything above.

- **Mobile usability.** The overwhelming majority of "near me" searches are on phones. A profile click that lands on a broken mobile page wastes the ranking you earned.
- **Page speed on the money pages.** You don't need a perfect Core Web Vitals score site-wide, but the contact and primary location pages should load fast.
- **HTTPS and a working click-to-call.** The phone number on mobile must be a tappable `tel:` link. It's a tiny detail that directly affects conversions from local search.

## How to use this

Work top to bottom and stop fixing once you hit diminishing returns. In practice, most local visibility problems trace back to the first three sections — an unoptimised Business Profile, a stalled review process, or inconsistent citations. The website work in sections 4–6 matters, but it rarely moves rankings if the profile and citations are a mess. Fix the foundation first, then refine."""

ARTICLES = [
    {
        "slug": "how-to-use-ga4-for-seo-step-by-step-tutorial",
        "title": "How to Use GA4 for SEO: A Step-by-Step Tutorial",
        "description": "A practical, click-by-click GA4 tutorial for SEO: link Search Console, isolate organic traffic, find the four reports that matter, and avoid the places GA4 quietly misleads you.",
        "content": GA4,
        "category": "seo",
        "tags": ["GA4", "Google Analytics", "Search Console", "organic traffic", "SEO reporting"],
        "date": "2026-06-09",
    },
    {
        "slug": "build-free-seo-dashboard-looker-studio-template",
        "title": "Build a Free SEO Dashboard in Looker Studio (Step-by-Step)",
        "description": "Build a self-updating SEO dashboard in Looker Studio for free: connect Search Console and GA4, lay out scorecards and trend charts, add filters, and share it — plus the limitations to know.",
        "content": LOOKER,
        "category": "seo",
        "tags": ["SEO dashboard", "Looker Studio", "Search Console", "GA4", "reporting"],
        "date": "2026-06-10",
    },
    {
        "slug": "local-seo-audit-checklist",
        "title": "Local SEO Audit Checklist: What Actually Moves Local Rankings",
        "description": "A local SEO audit checklist organised by impact: Google Business Profile, reviews, NAP and citations, on-page local signals, local links, and the technical minimum that gates them all.",
        "content": LOCAL,
        "category": "seo",
        "tags": ["local SEO", "Google Business Profile", "citations", "audit checklist", "NAP"],
        "date": "2026-06-11",
    },
]

def words(md):
    import re
    return len(re.findall(r"\w+", md))

inserted = []
for a in ARTICLES:
    rt = max(3, round(words(a["content"]) / 200))
    row = {
        "id": str(uuid.uuid4()),
        "slug": a["slug"],
        "title": a["title"],
        "description": a["description"],
        "content": a["content"],
        "author": "SGA Index",
        "date": a["date"],
        "category": a["category"],
        "tags": a["tags"],
        "read_time": rt,
    }
    data = json.dumps([row]).encode("utf-8")
    req = urllib.request.Request(
        f"{URL}/rest/v1/wseo_articles",
        data=data,
        method="POST",
        headers={
            "apikey": KEY,
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
    )
    try:
        resp = urllib.request.urlopen(req)
        out = json.loads(resp.read())
        inserted.append((a["slug"], rt, words(a["content"])))
        print(f"  ✅ 插入 {a['slug']}  (read_time={rt}min, {words(a['content'])} words)")
    except urllib.error.HTTPError as e:
        print(f"  ❌ {a['slug']}: {e.code} {e.read().decode()[:300]}")

print(f"\n成功插入 {len(inserted)}/{len(ARTICLES)} 篇")
