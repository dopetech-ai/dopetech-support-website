# DopeTech Support Website — Notion Integration Handoff

## Context

We've built a complete support/help center website at `/Users/george/dopetech-support-website`. The site is fully functional and deployed as a preview at **https://preview.dopetech-support.pages.dev**. Everything works except the Notion content pipeline — it's built but hasn't been tested with real data yet.

You have access to DopeTech's Notion workspace. Your job is to wire up the existing Notion support hub to this website's content pipeline.

## What's Already Built

- **React 19 + Vite 7 + TypeScript + Tailwind CSS 4** static site
- **Notion SDK v5** content pipeline that fetches articles at build time
- **Pagefind** client-side search (indexes prerendered HTML)
- **Cloudflare Pages** deploy (DopeTech account, project name: `dopetech-support`)
- **GitHub Actions** CI/CD with scheduled rebuild every 2 hours
- Dark neon DopeTech design system matching dopetech.ai

## What You Need To Do

### 1. Find or Configure the Notion Database

The site expects a Notion database with these properties:

| Property Name | Type | Required | Notes |
|---|---|---|---|
| `Name` (or `Title` or `title`) | Title | Yes | Article title |
| `Slug` (or `slug`) | Rich Text | Yes | URL slug, e.g. `getting-started-with-dopeapps` |
| `Category` (or `category`) | Select | Yes | Must match one of the 5 categories below |
| `Status` | Status | Yes | Only articles with status `Published` are fetched |
| `Meta Description` (or `Description` or `description`) | Rich Text | No | SEO description, defaults to empty string |

**The code is flexible with property name casing** — it checks multiple variants (see `scripts/lib/notion.ts` lines 113-117).

### 2. Map Categories

The website has 5 hardcoded categories in `src/config/site.ts`. The Notion `Category` select values must match one of these (case-insensitive matching is supported):

| Category Name | Slug | Description |
|---|---|---|
| Getting Started | `getting-started` | Set up your DopeTech products and get running quickly |
| DopeApps | `dopeapps` | Mobile app setup, customization, and troubleshooting |
| DopeSites | `dopesites` | Website management, SEO, and content updates |
| DopeTender | `dopetender` | In-store kiosk setup, hardware, and configuration |
| How Do I...? | `how-do-i` | Step-by-step guides for common tasks |

**If the existing Notion support hub uses different category names**, you have two options:
- **Option A (preferred):** Update the select options in Notion to match these names
- **Option B:** Update `src/config/site.ts` CATEGORIES array to match whatever names are in Notion. If you add/change categories, also update `src/lib/icons.ts` to add any new icon mappings.

**If the existing hub has categories not covered above** (e.g. "Billing", "Compliance", "Account Management"), add them to the `CATEGORIES` array in `src/config/site.ts` with an appropriate Lucide icon name. Available icons are imported in `src/lib/icons.ts` — add new imports there too.

### 3. Ensure the Integration Has Access

The Notion integration token is already in `.env` (check the file for the value).

**You must ensure the database is shared with this integration.** In Notion:
1. Open the database page
2. Click "..." menu → Connections → Connect to → find the DopeTech integration
3. Confirm access

### 4. Get the Database ID

Find the database ID from the Notion URL or via the API. Add it to `.env`:
```
NOTION_DATABASE_ID=<the-database-id>
```

The ID is the 32-character hex string in the database URL (with or without dashes — both work).

### 5. Test the Content Pipeline

```bash
cd /Users/george/dopetech-support-website

# Load env vars
source .env
# or: export NOTION_API_KEY=... NOTION_DATABASE_ID=...

# Run just the content build
npm run build:content
```

This will:
1. Query the Notion database for all pages with `Status = Published`
2. For each article: extract title, slug, category, meta description
3. Convert Notion blocks → Markdown (via notion-to-md) → HTML (via marked)
4. Download and re-host any images with content-hash filenames
5. Output everything to `src/data/articles.json`

**Watch the console output carefully for:**
- `⚠ Skipping "...": empty slug after sanitization` — article needs a Slug property value
- `⚠ Skipping "...": unrecognized category "..."` — category name doesn't match any in CATEGORIES
- `⚠ Skipping "...": missing title/slug/category` — required properties are empty
- `⚠ Found N Notion internal link(s)` — authors used notion.so links instead of real URLs
- `Rate limited, retrying in Xms...` — Notion API rate limiting (handled automatically with exponential backoff, max 3 concurrent requests)

### 6. Run Full Build and Preview

```bash
# Full pipeline: content → vite build → prerender → sitemap → pagefind
npm run build:full

# Preview locally
npm run preview
```

### 7. Deploy Preview

```bash
CLOUDFLARE_ACCOUNT_ID=280beaae537de108cccfb4b097f95d6e npx wrangler pages deploy dist --project-name=dopetech-support --branch=preview --commit-dirty=true
```

### 8. Deploy Production (When Ready)

```bash
CLOUDFLARE_ACCOUNT_ID=280beaae537de108cccfb4b097f95d6e npx wrangler pages deploy dist --project-name=dopetech-support --branch=main --commit-dirty=true
```

## Content Pipeline Architecture

```
Notion Database
  ↓ @notionhq/client v5 (dataSources.query)
  ↓ Semaphore (max 3 concurrent) + exponential backoff on 429
Raw page properties (title, slug, category, status, meta description)
  ↓ notion-to-md v3 (pageToMarkdown)
Markdown string
  ↓ marked v17 (with custom link renderer for target="_blank" on external links)
HTML string
  ↓ notion-images.ts (download, content-hash, extract dimensions)
Final HTML with local images
  ↓ build-articles.ts (validate slugs, match categories, dedupe)
src/data/articles.json (imported by the React app at build time)
```

### Key Files

| File | Purpose |
|---|---|
| `scripts/build-content.ts` | Entry point — calls buildAllArticles(), writes articles.json |
| `scripts/lib/notion.ts` | Notion API client, rate limiting, property extractors |
| `scripts/lib/notion-renderer.ts` | Notion → Markdown → HTML rendering chain |
| `scripts/lib/notion-images.ts` | Image downloading, hashing, dimension extraction |
| `scripts/lib/build-articles.ts` | Orchestrator: fetch, validate, render, assemble |
| `src/config/site.ts` | Category definitions (slugs, names, icons) |
| `src/types/article.ts` | Article, Category, ContentData TypeScript types |
| `src/data/articles.json` | Generated output (gitignored, created by build:content) |

## Potential Issues You May Hit

### Notion SDK v5 API Change
The code uses `client.dataSources.query()` instead of the old `client.databases.query()`. This is correct for SDK v5. If you get a "dataSources is not a function" error, check the installed SDK version with `npm ls @notionhq/client`.

### Status Property
The filter expects `Status` to be a "status" type property (not a "select"). If the existing database uses a select property for status, you'll need to either:
- Convert it to a status property in Notion
- Or update the filter in `scripts/lib/notion.ts` line 102 from `status: { equals: 'Published' }` to `select: { equals: 'Published' }`

### Missing Slugs
If existing articles don't have a `Slug` property, they'll be skipped. You'll need to either:
- Add slugs manually to each article in Notion
- Or modify `scripts/lib/build-articles.ts` to auto-generate slugs from titles (add a `titleToSlug` function)

### Category Mismatch
Articles with categories not in the CATEGORIES array will be silently skipped with a warning. Check the console output and add any missing categories to `src/config/site.ts`.

## GitHub Secrets Needed for CI/CD

Once everything works locally, add these secrets to the GitHub repo (`dopetech-ai/dopetech-support-website`) under Settings → Secrets → Actions:

| Secret | Value |
|---|---|
| `NOTION_API_KEY` | (from `.env` file) |
| `NOTION_DATABASE_ID` | (the database ID you found) |
| `CLOUDFLARE_API_TOKEN` | (create at dash.cloudflare.com → API Tokens → Edit Cloudflare Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | `280beaae537de108cccfb4b097f95d6e` |

## Custom Domain Setup

To serve at `support.dopetech.ai`:
1. In Cloudflare Pages dashboard → dopetech-support → Custom domains → Add
2. Enter `support.dopetech.ai`
3. If the DNS zone is already on Cloudflare (dopetech.ai), the CNAME record will be added automatically
4. If not, add a CNAME record: `support` → `dopetech-support.pages.dev`
