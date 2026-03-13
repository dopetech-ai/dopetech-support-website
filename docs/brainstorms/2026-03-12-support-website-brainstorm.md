# DopeTech Support Website — Brainstorm

**Date:** 2026-03-12
**Status:** Draft
**Author:** George + Claude

---

## What We're Building

A publicly-facing support and help center website for DopeTech at **support.dopetech.ai**. This is a pure knowledge base (no live chat or ticketing at launch) that serves as the canonical destination for product help, onboarding, troubleshooting, and product updates across the DopeTech ecosystem (DopeApps, DopeSites, DopeTender).

### Audience

- **Primary:** Existing DopeTech customers — dispensary owners and staff using the products daily
- **Secondary:** Prospects evaluating DopeTech's support quality, and integration partners needing technical docs

### Content Types

| Content Type | Description | Priority |
|---|---|---|
| Help articles & guides | Step-by-step how-tos, feature docs per product | P0 — Launch |
| FAQs | Common questions (migrate/expand from dopetech.ai homepage) | P0 — Launch |
| Troubleshooting | Issue diagnosis and resolution guides | P0 — Launch |
| Onboarding materials | Getting started guides for new customers | P0 — Launch |
| Integration guides | Technical docs for POS and partner integrations | P1 — Fast follow |
| Product updates / changelog | Release notes and feature announcements | P1 — Fast follow |
| Video tutorials | Embedded training walkthroughs | P1 — Fast follow |
| Marketing materials | Brand assets and co-marketing resources for partners | P2 — Future (may belong on main site or partner portal instead) |

---

## Why This Approach

### Tech Stack: UNDECIDED — Framework Comparison

SEO is paramount for a help center. Google discoverability drives self-service adoption. Here's how the two main options compare:

#### Option A: Astro + React Islands

| Factor | Assessment |
|---|---|
| **SEO** | Best-in-class. Static HTML by default, zero JS shipped unless opted in. Google sees full content immediately. Built-in sitemap, RSS, and structured data support. |
| **Content** | Purpose-built for content sites. Content collections, MDX, and optimized build pipeline for hundreds of pages. |
| **Interactivity** | React "islands" hydrate only interactive components (search, feedback widgets). Rest of page is pure HTML. |
| **Performance** | Fastest — no framework JS in the bundle for static pages. Perfect Lighthouse scores out of the box. |
| **Cloudflare Pages** | First-class adapter (`@astrojs/cloudflare`). SSR and static both supported. |
| **Learning curve** | New framework for the team. `.astro` template syntax is different from React. |
| **Ecosystem alignment** | Open PR on dopetech-website to migrate to Astro. If that lands, both sites share the framework. If it doesn't, this becomes the odd one out. |

#### Option B: React + Vite + Prerendering

| Factor | Assessment |
|---|---|
| **SEO** | Good with prerendering (already proven on dopetech.ai). `scripts/prerender.js` generates static HTML per route. Google sees content, but requires maintaining the prerender script as pages grow. |
| **Content** | No built-in content system. Would need custom Notion→React rendering pipeline. More manual but full control. |
| **Interactivity** | Full React everywhere. Hydrates the entire page. More JS shipped, but familiar DX. |
| **Performance** | Heavier — full React runtime loaded on every page even for static content. Can be mitigated with code splitting. |
| **Cloudflare Pages** | Proven — exact same deployment pipeline as current dopetech.ai. |
| **Learning curve** | Zero. Same stack the team already uses. |
| **Ecosystem alignment** | Matches current dopetech.ai production stack. Consistent with what exists today. |

#### SEO Head-to-Head

| SEO Factor | Astro | React + Vite + Prerender |
|---|---|---|
| Initial HTML content | Full page, zero JS | Full page via prerender script |
| Core Web Vitals (LCP) | Excellent (no hydration delay) | Good (hydration can delay LCP) |
| JS bundle size | Near-zero for content pages | ~150-200KB React runtime |
| Crawl budget efficiency | Optimal (clean HTML) | Good (prerendered HTML) |
| Sitemap generation | Built-in | Manual (add to prerender script) |
| Structured data | Built-in helpers | Manual (existing SEOHead component) |
| Scaling to 500+ pages | Designed for this | Prerender script needs maintenance |

**Bottom line:** Astro wins on SEO and performance. React+Vite wins on team familiarity and ecosystem consistency. The decision hinges on whether the Astro migration PR on dopetech.ai lands — if it does, Astro is the clear choice for both. If it doesn't, React+Vite avoids being the odd project out.

**This decision does not need to be made now.** The wireframes, design system, Notion pipeline, and information architecture are framework-agnostic. We can lock the framework when the dopetech.ai migration decision is finalized.

**Tailwind CSS 4** with DopeTech design tokens because:

1. **Rapid content layout building** — Utility-first is dramatically faster for cards, grids, and article typography
2. **Visual consistency** — Port the exact design tokens from dopetech.ai's `variables.css` (colors, typography, spacing, glows, radii) into Tailwind's `@theme` directive
3. **Proven in ecosystem** — Already used in the social portal with the same brand tokens
4. **Premium feel** — The premium look comes from the tokens (neon cyan glows, Space Grotesk headlines, dark backgrounds), not the styling tool

**Notion as CMS** because:

1. **Already in the stack** — Used in the dopetech-social project (Notion API client exists)
2. **Visual editor** — Non-technical team members can author and edit articles
3. **Build-time fetch** — Pull content from Notion at build time, render to static HTML
4. **Formatting pipeline** — Notion blocks → custom renderer → styled HTML with DopeTech components. Allows reformatting and enriching Notion content beyond what Notion natively supports.

### Design: Dark Theme Throughout

The full dark neon DopeTech aesthetic carries through:

- **Backgrounds:** `#050508` → `#0a0a12` → `#12121c` (same depth hierarchy as dopetech.ai)
- **Article content areas:** Slightly elevated card backgrounds (`#12121c`) with bright `#ffffff` text
- **Accent:** Neon cyan `#00e5ff` for links, hover states, search highlights, category icons
- **Typography:** Space Grotesk for headings, Inter for body text, JetBrains Mono for code blocks
- **Effects:** Neon glow on CTAs and interactive elements, glass-morphism for elevated surfaces, section blending fades

---

## Key Decisions

### 1. URL: support.dopetech.ai

Subdomain on existing domain. Clean separation from marketing site, independent deployment pipeline, consistent with industry pattern (support.dutchie.com, help.flowhub.com). The marketing site's Header and Footer "Support" links (currently pointing to `/#cta`) will be updated to point here.

### 2. Information Architecture — 6-8 Top-Level Categories

Learned from competitors: Flowhub and Treez both have 18 flat categories which is too many to scan. Group into digestible top-level categories with subcategories inside.

**Proposed categories:**

| Category | Covers | Icon Concept |
|---|---|---|
| Getting Started | Onboarding, setup guides, first steps per product | Rocket |
| DopeApps | Native app features, configuration, publishing | Smartphone |
| DopeSites | Website builder, themes, SEO, menus, ordering | Globe |
| DopeTender | Kiosk setup, hardware, customer-facing display | Monitor |
| Integrations | POS systems, delivery, payments, compliance | Plug |
| Account & Billing | User management, plans, invoicing | Settings |
| Troubleshooting | Common issues, error messages, diagnostics | Wrench |
| FAQs | "How do I...?" cross-product questions (inspired by Treez pattern) | CircleHelp |
| What's New | Product updates, changelog, release notes | Sparkles |

### 3. Homepage Layout Pattern

Inspired by best competitor patterns, adapted for DopeTech:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER  [Logo]  [Categories ▾]  [Search]        [dopetech.ai →]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ✦  HERO SECTION  ✦                             │
│                                                             │
│     "How can we help you today?"                            │
│     ┌──────────────────────────────────────────┐            │
│     │  🔍  Search articles, guides, FAQs...    │            │
│     └──────────────────────────────────────────┘            │
│                                                             │
│     Popular: Getting started · Connect your POS ·           │
│              Set up online ordering · ...                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              CATEGORY GRID (3 cols desktop)                 │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ 🚀       │  │ 📱       │  │ 🌐       │                  │
│  │ Getting  │  │ DopeApps │  │ DopeSites│                  │
│  │ Started  │  │          │  │          │                  │
│  │ 12 arts  │  │ 34 arts  │  │ 28 arts  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ 🖥️       │  │ 🔌       │  │ ⚙️       │                  │
│  │ Dope     │  │ Integra- │  │ Account  │                  │
│  │ Tender   │  │ tions    │  │ & Billing│                  │
│  │ 15 arts  │  │ 20 arts  │  │ 8 arts   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ 🔧       │  │ ❓       │  │ ✨       │                  │
│  │ Trouble- │  │ FAQs     │  │ What's   │                  │
│  │ shooting │  │          │  │ New      │                  │
│  │ 18 arts  │  │ 10 arts  │  │ 5 arts   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              FEATURED / POPULAR ARTICLES                    │
│                                                             │
│  Manually curated at launch (no analytics data yet).       │
│  Switch to analytics-driven once traffic data exists.      │
│  Competitors don't do this well — opportunity.             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              "STILL NEED HELP?" CTA                         │
│                                                             │
│     Can't find what you're looking for?                     │
│     [📞 Call (866) WEED-APP]  [📧 Email Support]           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FOOTER (matches dopetech.ai — 4 col grid, brand, legal)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Article Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Breadcrumb: Home > DopeApps > Push Notifications           │
│                                                             │
│  ┌──────────────────────────────────┬────────────────────┐  │
│  │                                  │  ON THIS PAGE       │  │
│  │  # Article Title                 │  • Section 1        │  │
│  │                                  │  • Section 2        │  │
│  │  Last updated: Mar 10, 2026      │  • Section 3        │  │
│  │  Product: DopeApps               │                     │  │
│  │                                  │  RELATED ARTICLES   │  │
│  │  Article body content with       │  • Article A        │  │
│  │  rich formatting, images,        │  • Article B        │  │
│  │  code blocks, callouts,          │  • Article C        │  │
│  │  embedded videos...              │                     │  │
│  │                                  │                     │  │
│  │  ─────────────────────────────── │                     │  │
│  │                                  │                     │  │
│  │  Was this helpful?  👍  👎       │                     │  │
│  │                                  │                     │  │
│  └──────────────────────────────────┴────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Still need help?  [Contact Support →]                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### 5. Category Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Breadcrumb: Home > DopeApps                                │
│                                                             │
│  # DopeApps                                                 │
│  Everything you need to get the most out of your            │
│  DopeTech native mobile app.                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🔍  Search within DopeApps...                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  SUBCATEGORIES                                              │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Setup &      │ │ Menu &       │ │ Push          │        │
│  │ Configuration│ │ Products     │ │ Notifications │        │
│  │ 5 articles   │ │ 8 articles   │ │ 4 articles    │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  ALL ARTICLES                                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 📄 How to set up your DopeApps dashboard            │    │
│  │    Setup & Configuration · 5 min read               │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ 📄 Customizing your app's home screen               │    │
│  │    Setup & Configuration · 3 min read               │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ 📄 Managing your product menu                       │    │
│  │    Menu & Products · 4 min read                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### 6. Search Strategy

- **Client-side search** via Pagefind (framework-agnostic, works with any static output)
- Indexes all rendered article content at build time
- Instant results as you type
- Zero API dependency, zero cost
- Fallback: category browsing and popular articles

### 7. Notion Content Pipeline

```
Notion Database → Notion API (build time) → Block renderer → Static pages
                                                    ↓
                                         Custom formatting:
                                         • Callout blocks → DopeTech alert components
                                         • Code blocks → syntax-highlighted with JetBrains Mono
                                         • Images → download + re-host (see note below)
                                         • Videos → responsive embed component
                                         • Tables → styled dark-theme tables
                                         • Headings → auto-generate TOC sidebar
```

Content can be reformatted beyond Notion's native rendering — the block renderer maps each Notion block type to a custom DopeTech-styled component with full control over HTML/CSS output.

**Important constraint: Notion image URLs expire.** Notion's API returns temporary signed URLs (~1 hour TTL). The build pipeline must download all images and re-host them as static assets or to Cloudflare R2. Referencing Notion image URLs directly in deployed HTML will result in broken images.

### 8. Navigation Connection to dopetech.ai

- **Support site header**: Simplified nav with category links + prominent search + "Back to dopetech.ai" link
- **Marketing site update**: Change Header and Footer "Support" links from `/#cta` to `https://support.dopetech.ai`
- **Shared brand elements**: Same logo, same footer structure, same font loading
- **Cross-linking**: Articles can link to marketing site product pages and vice versa

---

## Competitor Insights Applied

| Pattern | Source | How We Apply It |
|---|---|---|
| Prominent centered search | All competitors | Hero section with large search bar, search in header |
| 3-column category grid | Treez | Category cards in responsive 3→2→1 grid |
| "How do I...?" FAQ style | Treez | Dedicated FAQ section or category |
| Product changelog | Treez (117 articles) | "What's New" category with release notes |
| Article helpfulness reactions | Flowhub, Treez | Thumbs up/down on every article |
| Status page link | Flowhub footer | Footer link (when status page exists) |
| Explicit contact escalation | Missing in most! | "Still need help?" section on homepage + every article |
| State-specific compliance | Treez | Subcategory under Integrations or dedicated section |

**Where we differentiate:**
- Premium dark neon aesthetic (vs. generic Intercom/Zendesk templates)
- Featured/popular articles on homepage (competitors don't do this well)
- Custom Notion rendering pipeline (better content than static templates)
- Brand-consistent experience (feels like dopetech.ai, not a third-party embed)

---

## Resolved Questions

1. **Notion database** — Existing Notion workspace has something started. Will build on it and define additional properties as needed.
2. **Build triggers** — Automated rebuilds when Notion content changes. Note: Notion's native webhook support is limited. Implementation options: polling via scheduled GitHub Action (simplest, e.g. every 15 min), third-party trigger (Zapier/Make watching the Notion DB), or custom Cloudflare Worker that polls for changes. Start with scheduled rebuilds, upgrade to event-driven if latency matters.

## Open Questions

1. **Framework decision** — Astro vs React+Vite. Depends on whether the Astro migration PR on dopetech.ai lands. SEO analysis above. **This is the biggest open decision.**

2. **Analytics** — What analytics platform? Cloudflare Web Analytics (free, privacy-friendly), Google Analytics, or Plausible/Fathom?

3. **Notion database schema** — What properties does the existing Notion database have? What do we need to add (category, product, tags, status, author, slug)?

## Deferred to V1 Implementation (not blockers for planning)

- **Article feedback storage** — Skip for v1. Add when analytics show enough traffic to justify it. When ready, Cloudflare KV is the simplest option.
- **Search scope** — V1 indexes support articles only. Cross-site search (blog/FAQ from dopetech.ai) is a V2 consideration.

---

## V1 Scope — Ship Fast, Content First

The real constraint is content, not tech. The best support site with no articles is worse than a basic one with 30 solid guides. V1 is about getting articles in front of customers.

### V1 Must-Haves

- **Homepage**: Hero with search bar + category grid (only categories that have content) + "Still need help?" CTA
- **Category pages**: List of articles in that category (no subcategories yet — add when a category exceeds ~15 articles)
- **Article pages**: Title, breadcrumb, body content, "Still need help?" CTA at bottom
- **Notion integration**: Fetch articles at build time using an existing Notion rendering library (e.g., `notion-to-md` or `react-notion-x`) — don't build a custom block renderer until the defaults look wrong
- **Search**: Pagefind (indexes static output, zero config)
- **Responsive**: Mobile-first
- **SEO**: Meta tags, sitemap, structured data
- **Deploy**: Cloudflare Pages at support.dopetech.ai
- **Header/footer**: Matching dopetech.ai brand

### V1 Explicitly NOT (add when content/traffic demands it)

- TOC sidebar on articles (add when articles get long)
- Related articles (add when there are enough to relate)
- Helpfulness reactions / thumbs up-down (add when traffic justifies storage)
- Featured/popular articles on homepage (add when analytics exist)
- Subcategories (add when categories get crowded)
- Custom Notion block renderer (use a library first, customize only what looks wrong)
- 9 categories (start with 4-5 that have real content, expand as you publish)

### North Star (V2+, evaluate based on demand)

- Live chat widget (Intercom/Crisp)
- Ticket submission system
- AI-powered search / chatbot ("Ask DopeTech")
- State-specific compliance content filtering
- Video tutorial library / training platform
- Full custom Notion rendering pipeline with all block types
