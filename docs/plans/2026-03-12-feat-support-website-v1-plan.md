---
title: "feat: Build DopeTech Support Website V1"
type: feat
status: active
date: 2026-03-12
origin: docs/brainstorms/2026-03-12-support-website-brainstorm.md
---

# feat: Build DopeTech Support Website V1

## Enhancement Summary

**Deepened on:** 2026-03-12
**Sections enhanced:** 8
**Research agents used:** Architecture Strategist, Performance Oracle, Security Sentinel, Simplicity Reviewer, TypeScript Reviewer, Pattern Recognition Specialist, Best Practices Researcher, Framework Docs Researcher, Frontend Races Reviewer, Deployment Verification Agent

### Key Improvements

1. **Performance: Self-host fonts** — Google Fonts adds 2-3 render-blocking requests. Self-host Space Grotesk, Inter, and JetBrains Mono with `font-display: swap`, subset to `latin`, and preload the primary weights.
2. **Performance: Image dimensions** — Extract `width`/`height` from downloaded images via `image-size` (pure JS, no native deps) for CLS prevention. Don't lazy-load above-fold images.
3. **Architecture: Notion pagination** — `blocks.children.list()` returns max 100 blocks per call. Pipeline must paginate with `start_cursor` for long articles.
4. **CI/CD: SHA-pin GitHub Actions and add permissions blocks** — Prevent supply-chain attacks via compromised action tags.
5. **CI/CD: Reduced rebuild frequency** — Scheduled rebuilds every 2 hours (not 15 min) to stay within Cloudflare Pages deployment limits. `workflow_dispatch` for urgent updates.
6. **CI/CD: Deployment guards** — Skip deploy if article count drops below threshold. Slack build summary for author feedback.

### Brainstorm Scope Compliance Fixes

The simplicity review identified three places where the plan re-introduced complexity the brainstorm explicitly deferred to V2+:
- **Popular article quick links on homepage hero** — Brainstorm V1 scope says "Featured/popular articles on homepage (add when analytics exist)". Removed from Phase 3 homepage spec.
- **Custom block renderer** — Brainstorm says "use a library first, customize only what looks wrong". Phase 2 now leads with `notion-to-md` v4 as the primary renderer.
- **Table of contents data extraction** — Brainstorm says "TOC sidebar on articles (add when articles get long)". Removed TOC extraction from Phase 2 metadata step.
- **DOMPurify removed** — Content comes from trusted Notion workspace. No pathway for arbitrary HTML injection. Revisit if CMS opens to external contributors.
- **Sharp replaced with image-size** — Only need dimensions for CLS prevention. WebP conversion deferred until image payload size matters at scale.
- **Single articles.json** — Per-article JSON files over-engineered for 10-20 articles. Trivially handled in one file. Split later if needed.
- **Cron reduced to every 2 hours** — 15-minute cron = 96 deploys/day, exceeds Cloudflare free tier. 2-hour cron + manual dispatch covers all needs.
- **CSP removed** — Static site with no user input. CSP would break Pagefind and Cloudflare Analytics. Kept simpler security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- **Categories reduced to 4-5** — 7 categories with 10-20 articles = anemic pages. Start with categories that have real content.

---

## Overview

Build a publicly-facing support and knowledge base website for DopeTech at **support.dopetech.ai**. The site pulls content from a Notion database at build time, renders it as static HTML with DopeTech's dark neon brand aesthetic, and deploys to Cloudflare Pages. V1 is a lean knowledge base — homepage with search, category pages, and article pages — focused on getting help content in front of customers fast.

(see brainstorm: docs/brainstorms/2026-03-12-support-website-brainstorm.md)

## Problem Statement

DopeTech's "Support" link in the marketing site header and footer currently scrolls to the demo contact form (`/#cta`) — there is no actual support destination. Customers using DopeApps, DopeSites, or DopeTender have no self-service resource for troubleshooting, onboarding, or product documentation. Competitors (Flowhub, Treez, Dutchie) all have dedicated help centers. This gap means every support question requires human intervention.

## Proposed Solution

A static knowledge base site that:
1. Fetches article content from Notion at build time
2. Renders to static HTML with Pagefind client-side search
3. Deploys to Cloudflare Pages at support.dopetech.ai
4. Matches the dopetech.ai dark neon brand aesthetic via shared Tailwind CSS 4 design tokens

## Technical Approach

### Architecture

```
┌──────────────┐     Build Time      ┌──────────────────┐
│              │  ──────────────────► │                  │
│  Notion DB   │   Notion API        │  Build Pipeline  │
│  (Articles)  │   blocks.children   │                  │
│              │   .list()           │  • Fetch articles │
└──────────────┘                     │  • Download images│
                                     │  • Render HTML    │
                                     │  • Run Pagefind   │
                                     └────────┬─────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │  Static Output   │
                                     │  dist/           │
                                     │  • index.html    │
                                     │  • articles/*.html│
                                     │  • [cat]/*.html  │
                                     │  • images/       │
                                     │  • _pagefind/    │
                                     └────────┬─────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │ Cloudflare Pages │
                                     │ support.dopetech │
                                     │ .ai              │
                                     └──────────────────┘
```

### Framework Decision: LOCKED — React + Vite

**Decision:** React 19 + Vite + TypeScript + Tailwind CSS 4. Matches the existing dopetech.ai production stack. Team familiarity wins over Astro's SEO advantages — prerendering closes the SEO gap sufficiently.

Key implementation notes vs. the Astro alternative:

| Concern | Astro | React + Vite |
|---|---|---|
| Page templates | `.astro` files | `.tsx` + CSS Modules or Tailwind |
| Static generation | Built-in `getStaticPaths()` | Custom `scripts/prerender.js` |
| React components | Islands with `client:*` directives | Standard React components |
| Pagefind | Plugin: `astro-pagefind` | Post-build: `npx pagefind --site dist` |
| Sitemap | `@astrojs/sitemap` | Custom generation in build script |
| Cloudflare deploy | `@astrojs/cloudflare` adapter | `wrangler pages deploy dist` |

**Implementation:** React + Vite with a prerender script (same pattern as dopetech.ai's `scripts/prerender.js`). `articles.json` generated at build time, prerender script reads it and generates static HTML for all routes.

(see brainstorm: "Tech Stack: UNDECIDED — Framework Comparison" section — React+Vite selected for ecosystem consistency)

### URL Structure

**Flat article URLs, category-prefixed category pages:**

```
/                           → Homepage
/getting-started            → Category page
/dopeapps                   → Category page
/dopesites                  → Category page
/dopetender                 → Category page
/integrations               → Category page
/account-billing            → Category page
/troubleshooting            → Category page
/articles/[slug]            → Article page
/404                        → Custom 404 page
```

**Why flat article URLs:** Moving an article between categories doesn't break its URL. Simpler routing. Breadcrumbs derive the category from the article's metadata, not the URL path.

**Slug strategy:** Manual `Slug` property in Notion (author-controlled). Build validates uniqueness and skips duplicates with a warning.

### Notion Database Schema

Required properties for the existing Notion database:

| Property | Type | Required | Purpose |
|---|---|---|---|
| Title | title | Yes | Article headline (Notion default) |
| Slug | rich_text | Yes | URL slug (e.g., `setup-dopeapps-dashboard`) |
| Category | select | Yes | V1 launch: Getting Started, DopeApps, DopeSites, Troubleshooting. Add more when content exists. |
| Status | status | Yes | Published, Draft, Archived |
| Meta Description | rich_text | No | SEO meta description (falls back to first paragraph) |
| Order | number | No | Sort order within category (lower = higher) |
| Last Updated | last_edited_time | Auto | Drives sitemap `lastmod` and "Last updated" display |

**Publishing rule:** Only articles with `Status = Published` AND non-empty `Slug` AND non-empty `Category` are rendered. All others are skipped with a build warning.

**Single category per article** in V1. Simplifies breadcrumbs, prevents URL ambiguity, and avoids duplicate content.

### Notion Content Pipeline

```
1. Fetch published articles from Notion database
   └─ Filter: Status = Published
   └─ Rate limit: 3 req/sec with exponential backoff (reuse dopetech-social retry pattern)

2. For each article, fetch page blocks
   └─ client.blocks.children.list({ block_id: page.id })
   └─ Recursively fetch children of nested blocks (toggles, columns, etc.)

3. Render blocks to HTML
   └─ Use notion-to-md or @notion-render library for initial pass
   └─ Apply DopeTech styling via Tailwind classes
   └─ Handle unsupported block types: render as <div class="unsupported"> with block type name

4. Download and re-host images
   └─ For each image block: download from Notion signed URL
   └─ Save to dist/images/[article-slug]/[hash].[ext]
   └─ Replace Notion URL with local path in rendered HTML
   └─ On download failure: log warning, render article without that image (do NOT fail build)

5. Extract metadata
   └─ First H1 or title property → page title
   └─ Meta Description property or first paragraph → meta description
   └─ Category + Slug → breadcrumb data

6. Validate
   └─ Skip articles missing required fields (Slug, Category, Title)
   └─ Skip duplicate slugs (keep first, warn on second)
   └─ Log all warnings to build output
   └─ Never fail entire build for one bad article
```

**Notion internal links:** V1 does not rewrite Notion-internal page links. Author guidelines will specify using full `support.dopetech.ai/articles/[slug]` URLs when linking between articles.

#### Research Insights: Content Pipeline

**Pagination (Architecture — HIGH):**
`blocks.children.list()` returns a maximum of 100 blocks per request. Long articles will silently truncate. The fetch loop must check `has_more` and use `start_cursor` to paginate:

```typescript
async function fetchAllBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results as BlockObjectResponse[]);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);
  return blocks;
}
```

**Rendering Library (Best Practices):**
Use `notion-to-md` v4 as the primary rendering library. It handles the Notion block→Markdown conversion with support for nested blocks, toggles, callouts, and tables. Convert to HTML via `marked`. Apply Tailwind `prose prose-invert` classes post-render rather than building a custom block renderer from scratch. Only customize block types that look visibly wrong after initial integration.

**Image Dimensions (Performance):**
After downloading images from Notion, extract `width` and `height` via `image-size` (pure JS, no native deps) to set explicit `<img>` dimensions (prevents Cumulative Layout Shift). Don't lazy-load the first image in an article — it's likely above the fold.

### Design System: Tailwind CSS 4 with DopeTech Tokens

Port the marketing site's CSS custom properties into Tailwind's `@theme` directive:

```css
/* src/styles/theme.css */
@import "tailwindcss";

@theme {
  /* Backgrounds — dopetech.ai depth hierarchy */
  --color-bg: #050508;
  --color-bg-elevated: #0a0a12;
  --color-bg-card: #12121c;
  --color-bg-card-hover: #1a1a28;

  /* Primary accent — neon cyan */
  --color-accent: #00e5ff;
  --color-accent-glow: rgba(0, 229, 255, 0.5);
  --color-accent-bright: #40eeff;

  /* Secondary accent */
  --color-accent-2: #0088ff;

  /* Text */
  --color-text-primary: #ffffff;
  --color-text-muted: #9999b0;
  --color-text-dim: #666680;

  /* Borders */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-accent: rgba(0, 229, 255, 0.4);

  /* Typography */
  --font-family-display: 'Space Grotesk', system-ui, sans-serif;
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Glow effects */
  --shadow-glow-cyan: 0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.3);
  --shadow-glow-blue: 0 0 20px rgba(0, 136, 255, 0.5), 0 0 40px rgba(0, 136, 255, 0.3);
}
```

(see brainstorm: "Design: Dark Theme Throughout" section, tokens sourced from `/Users/george/dopetech-website/src/styles/variables.css`)

#### Research Insights: Typography & Font Loading

**Self-Host Fonts (Performance — CRITICAL):**
Google Fonts adds 2-3 render-blocking network requests to a third-party origin (fonts.googleapis.com → fonts.gstatic.com). For a Lighthouse Performance score ≥ 95, self-host all three font families:

1. Download Space Grotesk (400, 700), Inter (400, 500, 600), JetBrains Mono (400) from Google Fonts as `.woff2`
2. Subset to `latin` charset (reduces file size ~60%)
3. Place in `public/fonts/`
4. Use `@font-face` declarations with `font-display: swap` (shows fallback text immediately, swaps when loaded)
5. Preload the primary weights in `<head>`:

```html
<link rel="preload" href="/fonts/inter-latin-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk-latin-700.woff2" as="font" type="font/woff2" crossorigin>
```

Only preload 2-3 most-used weights — preloading all weights defeats the purpose.

**Tailwind Typography Plugin:**
Use `@tailwindcss/typography` with `prose-invert` for dark-themed article content. Customize heading fonts via `prose-headings:font-display` utility.

### Implementation Phases

#### Phase 1: Project Scaffolding & Design System (Days 1-2)

Foundation work that is identical regardless of framework choice.

**Tasks:**

- [x] Initialize project with Vite + React 19 + TypeScript
  - `package.json`, `tsconfig.json`, `vite.config.ts`
- [x] Install Tailwind CSS 4 via `@tailwindcss/vite` plugin
- [x] Create `src/styles/theme.css` with DopeTech design tokens (from variables.css)
- [x] Create `src/styles/global.css` with base reset, self-hosted `@font-face` declarations (Space Grotesk, Inter, JetBrains Mono — see Research Insights), body dark background
- [x] Set up `wrangler.toml` for Cloudflare Pages (`project-name: dopetech-support`, `pages_build_output_dir: dist`)
- [ ] If React+Vite: prerender script generates static HTML for all routes; Cloudflare Pages serves `404.html` for unmatched routes automatically (no SPA `_redirects` needed)
- [x] Create `public/robots.txt` allowing all crawling
- [x] Copy brand assets from dopetech-website: `favicon.png`, `dopetech-logo.png`
- [x] Create shared layout component: `<Layout>` wrapper with dark bg, font classes, max-width container
- [x] Create `<Header>` component: logo + category nav links + search input + "dopetech.ai →" external link
- [x] Create `<Footer>` component: matching dopetech.ai 4-column grid (Platforms, Solutions, Integrations, Company), brand section, legal links
- [ ] Create `<Button>` component: primary (gradient + glow) and outline (border + hover glow) variants
- [x] Create site config (`src/config/site.ts`): site name, URL, phone, email, category definitions with slugs/icons/descriptions
- [x] Verify build produces static output in `dist/`
- [ ] Deploy empty shell to Cloudflare Pages to validate pipeline

**Files created:**
```
src/
  styles/
    theme.css              # Tailwind @theme with DopeTech tokens
    global.css             # Reset, fonts, base styles
  config/
    site.ts                # Site metadata, category definitions
  components/
    layout/
      Layout.tsx      Header.tsx      Footer.tsx    common/
      Button.tsx
  lib/
    cn.ts                  # clsx utility (class concatenation)
public/
  favicon.png
  dopetech-logo.png
  robots.txt
wrangler.toml
package.json
tsconfig.json
```

**Phase 1 additions from research:**
- [x] Download and self-host font files as `.woff2` (latin subset) in `public/fonts/`
- [ ] Add `<link rel="preload">` for Inter 400 and Space Grotesk 700 in layout `<head>`
- [x] Create `public/_headers` with security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

**Files added:**
```
public/
  fonts/
    space-grotesk-latin-400.woff2
    space-grotesk-latin-700.woff2
    inter-latin-400.woff2
    inter-latin-500.woff2
    inter-latin-600.woff2
    jetbrains-mono-latin-400.woff2
  _headers                   # Security headers (no CSP)
```

**Success criteria:** `npm run build` produces a `dist/` folder. `npm run dev` shows a styled dark page with header and footer. `npx wrangler pages deploy dist` succeeds.

---

#### Phase 2: Notion Content Pipeline (Days 3-5)

Build the content fetching, image handling, and rendering pipeline.

**Tasks:**

- [x] Install `@notionhq/client` (latest v5 with dataSources API)
- [x] Create `scripts/lib/notion.ts` — Notion client wrapper
  - Initialize with `NOTION_API_KEY` env var
  - `fetchPublishedArticles()`: query database filtered by `Status = Published`
  - `fetchArticleBlocks(pageId)`: recursively fetch all blocks for a page, **paginating with `start_cursor`** (max 100 blocks per response — see Research Insights)
  - Rate limiting: max 3 concurrent requests, exponential backoff on 429
  - Return typed article objects: `{ title, slug, category, metaDescription, lastEdited, blocks }`
- [x] Create `scripts/lib/notion-renderer.ts` — Block-to-HTML renderer
  - **Rendering chain:** Notion blocks → `notion-to-md` v3 → Markdown → `marked` v17 → HTML → output
  - Use `notion-to-md` v3 (stable) as the primary rendering library (brainstorm: "use a library first, customize only what looks wrong")
  - Convert Markdown output to HTML via `marked`
  - Apply Tailwind `prose prose-invert` classes for article typography
  - Add `target="_blank"` and `rel="noopener noreferrer"` to external links (non-support.dopetech.ai) during rendering
  - Customize only block types that look visibly wrong after initial integration (callouts, toggles may need attention since they lack standard Markdown representation)
  - Unsupported blocks: render a hidden comment `<!-- unsupported: {type} -->` (don't break the page)
  - Build warning for `notion.so` or `notion.site` URLs found in rendered content (author used internal link instead of full URL)
- [x] Create `scripts/lib/notion-images.ts` — Image download and re-hosting
  - Download each image from Notion signed URL during build
  - Extract `width`/`height` via `image-size` (pure JS, no native deps) for CLS prevention
  - Save to `dist/images/articles/[slug]/[content-hash].[ext]` (serve original format)
  - Return `{ path, width, height }` — set explicit `<img width height>` attributes in rendered HTML
  - **First image per article:** set `loading="eager"` (above-fold); subsequent images: `loading="lazy"`
  - On failure: log warning, return empty string (image omitted)
  - Respect alt text from Notion; if missing, log warning and set `alt=""`
- [x] Create `scripts/lib/build-articles.ts` — Orchestrator
  - Fetch all published articles
  - Validate required fields (slug, category, title) — skip invalid with warning
  - Sanitize slugs: lowercase, replace spaces with hyphens, strip unsafe characters. Log warning when sanitized differs from original.
  - Validate category values against site config definitions. Skip articles with unrecognized categories (with warning).
  - Validate category slugs against reserved path deny-list: `articles`, `404`, `images`, `_pagefind`, `fonts`, `_headers`, `api`
  - Check slug uniqueness — skip duplicates with warning
  - Fetch blocks for each article (with concurrency limit)
  - Render blocks to HTML
  - Download and re-host images
  - Output structured data: `{ articles: Article[], categories: CategoryWithArticles[] }`
- [x] Create build script entry point: `scripts/build-content.ts`
  - Runs as part of the build command
  - Writes article data to `src/data/articles.json` (single file, sufficient for V1 scale)
- [x] Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` to `.env` (gitignored) and document required env vars
- [ ] Write a test script that fetches 1-2 real articles and logs the rendered output

**Files created:**
```
src/
  lib/
    notion.ts              # Notion API client (with pagination)
    notion-renderer.ts     # notion-to-md v4 → marked → HTML
    notion-images.ts       # Image download + image-size dimensions + re-host
    build-articles.ts      # Build orchestrator
  data/
    articles.json          # Generated at build time (gitignored)
scripts/
  build-content.ts         # Build entry point
.env                       # NOTION_API_KEY, NOTION_DATABASE_ID (gitignored)
```

**Key dependencies:** `@notionhq/client`, `notion-to-md`, `marked`, `image-size`

**Success criteria:** `npm run build:content` fetches articles from Notion, downloads images (with dimensions), renders HTML, and writes `articles.json`. Build warnings logged for skipped articles, missing images, and Notion internal links.

---

#### Phase 3: Page Templates & Routing (Days 5-8)

Build the three page types: homepage, category pages, and article pages.

**Tasks:**

Homepage (`src/pages/index.tsx`):
- [ ] Hero section: headline "How can we help you today?", large search input (wired in Phase 4)
  - Dark background with subtle radial gradient flare (matching dopetech.ai hero pattern)
  - Neon cyan glow on search input focus
  - Note: Popular article quick links deferred to V2 (brainstorm: "add when analytics exist")
- [ ] Category grid: 3-col desktop, 2-col tablet, 1-col mobile
  - Each card: Lucide icon + category name + description + article count
  - Glass-morphism card style (elevated bg, subtle border, hover glow)
  - Only render categories that have ≥1 published article
  - Handle orphan cards: center the last row if not a full 3
- [ ] "Still need help?" CTA section: phone (`tel:` link on mobile, text on desktop) + email link
- [ ] SEO: title "DopeTech Support — Help Center", meta description, `WebSite` schema with `SearchAction`, `Organization` schema

Category page (`src/pages/[category].tsx`):
- [ ] Breadcrumb: Home > Category Name
- [ ] Category header: icon + name + description
- [ ] Article list: sorted by `Order` property (ascending), then `lastEdited` (descending)
  - Each row: article title + category + estimated read time (word count / 200)
  - Hover effect with accent border
- [ ] SEO: title "[Category] — DopeTech Support", description from category config

Article page (`src/pages/articles/[slug].tsx`):
- [ ] Breadcrumb: Home > Category > Article Title
- [ ] Article header: title, "Last updated: [date]", category badge
- [ ] Article body: rendered HTML from Notion pipeline, wrapped in Tailwind Typography (`prose`) classes customized for dark theme
  - Headings: Space Grotesk, cyan accent underline
  - Code blocks: JetBrains Mono, elevated bg card
  - Images: full-width, rounded corners, explicit `width`/`height` attributes (from Sharp metadata), `loading="lazy"` on below-fold images only (first image: `loading="eager"`)
  - Callouts: left-border accent, elevated bg
  - Links: cyan with underline, glow on hover
- [ ] "Still need help?" CTA at bottom
- [ ] SEO: title "[Article Title] — DopeTech Support", meta description from Notion property or first paragraph, `Article` schema, `BreadcrumbList` schema
- [ ] OG tags: title, description, generic DopeTech OG image (static asset for V1)

404 page (`src/pages/404.tsx`):
- [ ] Branded 404 with DopeTech styling
- [ ] Search input
- [ ] Category quick links
- [ ] "Still need help?" CTA
- [ ] Cloudflare Pages serves `dist/404.html` automatically

**Routing:**
- [ ] Add routes in `App.tsx` using `react-router-dom`: `/`, `/:category`, `/articles/:slug`, `*` (404)
- [ ] Create prerender script (`scripts/prerender.ts`) to generate static HTML for all routes (all category slugs + all article slugs + homepage + 404)

**Files created:**
```
src/
  pages/
    index.tsx (or .astro)         # Homepage
    [category].tsx      # Category pages
    articles/
      [slug].tsx (or .astro)      # Article pages
    404.tsx (or .astro)           # Custom 404
  components/
    common/
      Breadcrumb.tsx
      SearchInput.tsx             # UI shell, wired in Phase 4
      CategoryCard.tsx
      ArticleListItem.tsx
      ContactCTA.tsx              # "Still need help?" section
    article/
      ArticleBody.tsx             # Prose wrapper with dark theme styles
```

**Success criteria:** All four page types render with real Notion content. Navigation between pages works. Breadcrumbs are correct. Mobile responsive layout passes visual inspection. SEO meta tags render in view-source.

---

#### Phase 4: Search (Days 8-9)

Integrate Pagefind for client-side search.

**Tasks:**

- [ ] Install Pagefind: `npm install --save-dev pagefind`
- [ ] Add Pagefind indexing to build command:
  - After static HTML is generated: `npx pagefind --site dist`
- [ ] Mark searchable content with `data-pagefind-body` on article content areas
- [ ] Mark non-searchable areas (header, footer, nav) with `data-pagefind-ignore`
- [ ] Wire search UI in `SearchInput.tsx`:
  - Initialize Pagefind on first focus/type (lazy load the index)
  - Display results as inline dropdown below the input
  - Each result: article title + category + snippet with highlighted match
  - Keyboard navigation: arrow keys to select, Enter to navigate, Escape to close
  - Mobile: results appear below input, scroll-friendly
- [ ] No-results state: "No results for '[query]'" + "Browse categories" links + "Contact support" link
- [ ] `<noscript>` fallback: "Search requires JavaScript. Browse categories below or contact support."
- [ ] Global search in header search input (same component, smaller)
- [ ] Category page search: **global** search in V1 (remove "within [category]" qualifier — scoped search is V2)

**Files modified:**
```
src/components/common/SearchInput.tsx    # Wire Pagefind
package.json                             # Add pagefind dep
build command                            # Add pagefind indexing step
```

**Success criteria:** Typing in search bar shows relevant results instantly. No-results state displays helpful alternatives. Search works on mobile. Pagefind index is included in `dist/_pagefind/`.

---

#### Phase 5: SEO, Accessibility & Polish (Days 9-10)

**SEO tasks:**
- [ ] Generate `sitemap.xml` at build time with all article and category URLs
  - Include `lastmod` from Notion's `last_edited_time`
  - Generate in build script (`scripts/generate-sitemap.ts`)
- [ ] Structured data on all pages:
  - Homepage: `WebSite` with `SearchAction` (enables Google sitelinks searchbox) + `Organization`
  - Articles: `Article` schema with headline, dateModified, author (DopeTech), publisher
  - All pages: `BreadcrumbList` schema
- [ ] Canonical URLs: `<link rel="canonical" href="https://support.dopetech.ai/articles/[slug]">`
- [ ] OG meta tags: og:title, og:description, og:image (generic branded image), og:url, og:type
- [ ] Twitter card meta tags: twitter:card (summary_large_image), twitter:title, twitter:description

**Accessibility tasks:**
- [ ] Skip navigation link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`
- [ ] All images: `alt` attribute (from Notion or fallback empty string with build warning)
- [ ] Search results: `aria-live="polite"` region for screen reader announcements
- [ ] Focus styles: visible cyan outline on all interactive elements
- [ ] Color contrast verification: `#00e5ff` on `#050508` = 10.5:1 (passes AAA), on `#12121c` = 8.5:1 (passes AAA)
- [ ] Semantic HTML: `<main>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<section>`
- [ ] `prefers-reduced-motion` media query: disable glow animations and transitions

**Security headers:**
- [ ] Create `public/_headers` file for Cloudflare Pages with:
  ```
  /*
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```

**Polish tasks:**
- [ ] Scroll-to-top on page navigation
- [ ] Smooth anchor scrolling for in-page links
- [ ] `tel:` link for phone number on mobile, plain text with copy button on desktop
- [ ] Category grid orphan handling: center last row if fewer than 3 cards

**Files created/modified:**
```
src/components/common/SEOHead.tsx (or Astro <head>)
src/components/common/SkipNav.tsx
scripts/generate-sitemap.ts (if React+Vite)
public/og-image.png                      # Generic DopeTech branded OG image
```

**Success criteria:** Google Lighthouse scores: Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100. Sitemap validates. Structured data validates in Google's Rich Results Test. Screen reader can navigate the full site.

---

#### Phase 6: CI/CD & Deployment (Days 10-11)

**Tasks:**

- [ ] Create `.github/workflows/deploy.yml`:
  - Trigger: push to `main` branch
  - **Permissions block:** `contents: read` only (principle of least privilege)
  - Steps: checkout → Node 20 → `npm ci` → build content from Notion → build site → run Pagefind → deploy to Cloudflare Pages
  - **SHA-pin all actions** (e.g., `actions/checkout@<full-sha>` not `actions/checkout@v4`) — prevents supply-chain attacks via compromised tags
  - Env secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `NOTION_API_KEY`, `NOTION_DATABASE_ID`
  - Deploy command: `npx wrangler pages deploy dist --project-name=dopetech-support --branch=main`
- [ ] Create `.github/workflows/scheduled-rebuild.yml`:
  - Trigger: `schedule: cron: '0 */2 * * *'` (every 2 hours)
  - Same build + deploy steps as above
  - On failure: send Slack notification via webhook
  - Env secret: `SLACK_WEBHOOK_URL`
- [ ] Add `workflow_dispatch` trigger to both workflows (manual rebuild button for urgent updates)
- [ ] Add **deployment guard:** if published article count < 5 AND decreased from previous deploy → skip deploy, send Slack alert (prevents accidentally deploying empty site)
- [ ] Add **build summary Slack notification:** after each rebuild, post to Slack: articles published count, articles skipped (with reasons), live site URL
- [ ] Add `concurrency` group with `cancel-in-progress: true` to prevent simultaneous deploy races
- [ ] Create `CLAUDE.md` in repo root with project conventions:
  - Stack, commands, file structure, Notion schema, deployment info
- [ ] Configure Cloudflare Pages custom domain: `support.dopetech.ai`
  - Add CNAME DNS record pointing to Cloudflare Pages
- [ ] Verify 404 page works (Cloudflare Pages serves `dist/404.html`)
- [ ] Verify prerendered routes serve correctly and 404.html works for unmatched URLs

**Files created:**
```
.github/
  workflows/
    deploy.yml               # Deploy on push to main
    scheduled-rebuild.yml     # Scheduled Notion content rebuild
CLAUDE.md                     # Project conventions
```

**Success criteria:** Push to `main` auto-deploys. Scheduled rebuild runs every 2 hours. Failed builds send Slack notification. Build summary posted to Slack after each rebuild. Deployment guard prevents deploying if article count drops below threshold. `support.dopetech.ai` resolves and serves the site.

---

#### Phase 7: Content & Cross-Site Integration (Days 11-12)

**Tasks:**

- [ ] Populate Notion database with 10-20 initial articles across 4-5 categories:
  - Getting Started: 3-4 onboarding guides
  - DopeApps: 3-4 feature guides
  - DopeSites: 3-4 feature guides
  - Troubleshooting: 3-4 common issues
  - (Add more categories when content exists)
- [ ] Create Notion authoring guidelines document (in Notion or repo):
  - Supported block types and how they render
  - How to set Slug, Category, Status properties
  - Image requirements (add alt text!)
  - Avoid: Notion internal page links (use full URLs), synced blocks, linked databases
  - Publishing workflow: Draft → Published → live within 2 hours (or trigger manual rebuild for immediate)
- [ ] Update dopetech-website: change Header and Footer "Support" links from `/#cta` to `https://support.dopetech.ai`
- [ ] Add Cloudflare Web Analytics snippet (free, cookie-free, no consent banner needed)
- [ ] Verify end-to-end: write article in Notion → trigger manual rebuild (or wait for scheduled) → article appears on site → searchable via Pagefind
- [ ] Cross-browser testing: Chrome, Safari, Firefox, mobile Safari, Chrome Android
- [ ] Final Lighthouse audit

**Success criteria:** Site is live at support.dopetech.ai with real content. Marketing site links to it. New articles published in Notion appear within 2 hours (or immediately via manual rebuild). All four page types work across browsers.

---

## Alternative Approaches Considered

**Hosted help center (Intercom, Zendesk, GitBook):** Rejected because the generic template aesthetic conflicts with DopeTech's premium dark neon brand. Competitors all use Intercom/Zendesk and look identical. Custom-built lets us differentiate.
(see brainstorm: "Where we differentiate" section)

**Notion public page as V1:** Considered during brainstorm refinement. Rejected because it offers no custom branding, no search, no SEO control, and looks unprofessional for a customer-facing product.

**Next.js:** Rejected because it moves away from Cloudflare Pages to Vercel, adding a new deployment platform to manage.
(see brainstorm: framework comparison section)

## System-Wide Impact

### Interaction Graph

- **Build trigger:** Notion content change → scheduled GitHub Action (every 15 min) → build → Cloudflare Pages deploy
- **Marketing site:** Header/Footer "Support" links update from `/#cta` to `https://support.dopetech.ai`
- **DNS:** New CNAME record for `support.dopetech.ai` → Cloudflare Pages
- **Notion workspace:** New/updated database properties (Slug, Category, Status) on the existing support articles database

### Error Propagation

- **Notion API down during build:** Build fails, previous deployment stays live, Slack notified. No customer impact.
- **Single bad article (missing fields):** Article skipped, rest of site builds normally. Author sees warning in build logs.
- **Image download failure:** Image omitted from that article, warning logged. Article still renders.
- **Pagefind index failure:** Search doesn't work. Site still navigable via categories and direct links.

### State Lifecycle Risks

- **Stale content window:** Up to 2 hours between Notion publish and live deployment. Mitigated by `workflow_dispatch` manual rebuild trigger for urgent updates.
- **Deleted articles still in Google index:** Google will naturally de-index 404 pages over time. No redirect strategy needed unless we rename slugs (handle with `_redirects` file if needed).
- **Notion image URL expiry:** Fully mitigated by downloading and re-hosting images at build time.

## Acceptance Criteria

### Functional Requirements

- [ ] Homepage renders with search bar, category grid (only populated categories), and "Still need help?" CTA
- [ ] Category pages list articles sorted by Order then lastEdited
- [ ] Article pages render full Notion content with proper typography, images, code blocks
- [ ] Search returns relevant results with highlighted snippets
- [ ] No-results search state shows helpful alternatives (browse categories, contact support)
- [ ] 404 page is branded with search and navigation options
- [ ] Breadcrumbs display correct navigation path on all pages
- [ ] "Still need help?" CTA appears on homepage and every article page
- [ ] Phone number is a `tel:` link on mobile
- [ ] Articles with Status ≠ Published are not rendered
- [ ] Articles with missing required fields are skipped with build warnings
- [ ] Notion images are downloaded and served from static assets (not Notion signed URLs)
- [ ] Images have explicit `width`/`height` attributes (no CLS)
- [ ] Fonts are self-hosted (no Google Fonts network dependency)
- [ ] External links open in new tab with `rel="noopener noreferrer"`

### Non-Functional Requirements

- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility = 100
- [ ] Lighthouse SEO = 100
- [ ] Site loads in < 1 second on 4G connection
- [ ] Build completes in < 2 minutes for 50 articles
- [ ] Responsive: works on 320px to 2560px viewports
- [ ] Deploys automatically on push to main
- [ ] Scheduled rebuilds run every 2 hours
- [ ] Failed builds trigger Slack notification

### Quality Gates

- [ ] TypeScript strict mode, zero type errors
- [ ] All pages render valid HTML (no broken tags)
- [ ] GitHub Actions use SHA-pinned action versions
- [ ] Sitemap validates against schema
- [ ] Structured data validates in Google Rich Results Test
- [ ] WCAG 2.1 Level AA compliance (color contrast, alt text, keyboard navigation, skip nav)
- [ ] Cross-browser tested: Chrome, Safari, Firefox

## Success Metrics

| Metric | Target | How to Measure |
|---|---|---|
| Time to first article live | ≤ 2 weeks from project start | Ship date |
| Support ticket volume reduction | 10-20% within 3 months | Compare pre/post ticket counts |
| Search usage | > 50% of sessions use search | Cloudflare Web Analytics |
| Article coverage | 30+ articles within 1 month of launch | Notion database count |
| Bounce rate from 404 | < 30% (users find alternative path) | Analytics |

## Dependencies & Prerequisites

| Dependency | Status | Blocker? |
|---|---|---|
| Framework decision | **LOCKED: React + Vite** | No — resolved |
| Notion database with articles | Started | Partially — need schema update and content |
| Cloudflare Pages project creation | Not started | No — quick setup |
| DNS: support.dopetech.ai CNAME | Not started | No — quick setup |
| Notion API integration token | Unknown | Yes — needed for build pipeline |
| Cloudflare API token (for CI deploy) | Unknown | Yes — needed for CI/CD |

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ~~Framework decision delays project~~ | ~~Medium~~ | ~~High~~ | **Resolved: React + Vite selected.** |
| Notion API rate limits slow builds | Low | Medium | Concurrency limit (3 req/sec), exponential backoff, cache responses |
| Not enough content at launch | Medium | High | Start with 10-20 articles in 4 categories. Quality over quantity. |
| Notion rendering library doesn't handle all block types | Medium | Low | Unsupported blocks render as hidden comments. Customize incrementally. |
| Notion image downloads fail intermittently | Low | Low | Skip failed images with warning. Articles still render. |

## Future Considerations

(see brainstorm: "North Star (V2+)" section)

- **TOC sidebar** on articles when articles get long
- **Related articles** when article count justifies it
- **Helpfulness reactions** (thumbs up/down) with Cloudflare KV storage
- **Featured/popular articles** driven by analytics data
- **Scoped category search** using Pagefind filters
- **Live chat** (Intercom/Crisp) widget
- **AI-powered search** chatbot ("Ask DopeTech")
- **Subcategories** when categories exceed ~15 articles

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-03-12-support-website-brainstorm.md](docs/brainstorms/2026-03-12-support-website-brainstorm.md) — Key decisions carried forward: support.dopetech.ai subdomain, dark neon theme, Notion as CMS, Tailwind CSS 4 with dopetech.ai tokens, lean V1 scope

### Internal References

- Marketing site design tokens: `/Users/george/dopetech-website/src/styles/variables.css`
- Marketing site SEO pattern: `/Users/george/dopetech-website/src/components/common/SEOHead.tsx`
- Marketing site prerender pipeline: `/Users/george/dopetech-website/scripts/prerender.js`
- Notion client wrapper (retry pattern): `/Users/george/projects/dopetech-social/mcp-server/src/infrastructure/persistence/notion/NotionClient.ts`
- Notion webhook docs: `/Users/george/projects/dopetech-social/docs/archived/NOTION-WEBHOOKS.md`
- Portal Tailwind 4 theme pattern: `/Users/george/projects/dopetech-social/portal/src/index.css`
- Marketing site deployment: `/Users/george/dopetech-website/wrangler.toml`

### Competitor Research

- Flowhub Help Hub (help.flowhub.com): Intercom-based, purple header, centered search, ~210 articles
- Treez Help Center (support.treez.io): Intercom-based, green header, 3-column grid, ~760 articles, "How do I...?" FAQ category
- IndicaOnline Support (indicaonline.elevio.help): Elevio-based, deep subcategory nesting
- Weedmaps Help (help.weedmaps.com): Salesforce-based, enterprise feel
