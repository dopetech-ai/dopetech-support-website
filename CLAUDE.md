# DopeTech Support Website

## Stack
- **Framework:** React 19 + Vite 7 + TypeScript
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite` plugin, `@theme` directive for tokens)
- **CMS:** Notion (build-time fetching via `@notionhq/client` v5)
- **Search:** Pagefind (client-side, indexes prerendered HTML)
- **Deploy:** Cloudflare Pages at `support.dopetech.ai`

## Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + Vite build
- `npm run build:content` — Fetch articles from Notion → `src/data/articles.json`
- `npm run build:full` — Content + build + prerender + sitemap + Pagefind index
- `npm run deploy` — Full build + deploy to Cloudflare Pages
- `npm run typecheck` — TypeScript type check only

## Content Pipeline
Notion blocks → `notion-to-md` v3 → Markdown → `marked` v17 → HTML

Build scripts live in `scripts/` and run via `tsx`:
- `build-content.ts` — Fetches and renders Notion articles
- `prerender.ts` — Generates static HTML for all routes (required for Pagefind + SEO)
- `generate-sitemap.ts` — Generates `dist/sitemap.xml`

## Environment Variables
Required for content build:
- `NOTION_API_KEY` — Notion integration token
- `NOTION_DATABASE_ID` — Notion database ID for articles

Required for deploy:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Notion Database Schema
Articles database should have these properties:
- `Name` (title) — Article title
- `Slug` (rich_text) — URL slug (auto-sanitized during build)
- `Category` (select) — One of: Getting Started, DopeApps, DopeSites, DopeTender, How Do I...?
- `Status` (status) — Must be "Published" to appear on site
- `Meta Description` (rich_text) — SEO description

## Design System
DopeTech dark neon theme. Tokens in `src/styles/theme.css` via Tailwind `@theme`.
- Backgrounds: `dt-bg` (#050508), `dt-bg-elevated`, `dt-bg-card`
- Primary accent: `dt-cyan` (#00e5ff) with glow effects
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code)

## File Structure
```
src/
  pages/           # Route-level page components
  components/
    layout/        # Header, Footer, Layout
    common/        # Shared UI (Breadcrumb, SearchInput, CategoryCard, etc.)
  config/site.ts   # Site metadata, category definitions
  lib/             # Utilities (content loader, icons, cn)
  styles/          # global.css, theme.css
  types/           # TypeScript types
scripts/           # Build-time scripts (Node/tsx)
public/            # Static assets (fonts, favicon, _headers)
```
