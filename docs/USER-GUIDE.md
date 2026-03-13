# DopeTech Support Website — User Guide

## Overview

The DopeTech Support Website is a public-facing help center at **support.dopetech.ai**. Content is managed in Notion and published automatically — no code changes needed to add, edit, or remove articles.

**How it works:** Every 2 hours (and on every push to `main`), GitHub Actions pulls articles from Notion, builds the site, and deploys to Cloudflare Pages. You write in Notion, the website updates itself.

---

## Managing Content in Notion

### The Support Hub Database

All support content lives in the **Support Hub Database** in Notion. Each row is an article.

**Database URL:** https://www.notion.so/dopeapps/2af3680799a680388bcde1e8dc7f2ef6

### Article Properties

| Property | Type | Purpose |
|---|---|---|
| **Name** | Title | The article title displayed on the website |
| **Status** | Status | Controls publication — only **"Live"** articles appear on the site |
| **Category** | Select | Determines which section the article appears in |
| **Type** | Select | Article type (Onboarding, Tutorial/How-to, Troubleshooting, FAQ, Marketing/Tips) |
| **Product Association** | Select | Which product this applies to (DopeTender, Kiosk, Website, App) |
| **Integration Association** | Select | Related integration (AIQ, POSaBIT, SpringBig) |

### Publishing an Article

1. Create a new page in the Support Hub Database
2. Set a **Name** (this becomes the article title and URL slug)
3. Choose a **Category** (required — articles without a category are skipped)
4. Write the article content in the page body
5. Set **Status** to **"Live"**

The article will appear on the website within 2 hours (next scheduled rebuild), or you can trigger an immediate deploy.

### Unpublishing an Article

Change the **Status** to **"Need Revision"** or **"Archived"**. The article will be removed from the site on the next rebuild.

### Categories

The website displays these categories. The **Category** select in Notion must match one of these exactly:

| Notion Category | Website Section | Description |
|---|---|---|
| Onboarding Tasks | /onboarding-tasks | Getting set up with DopeTech products |
| Admin Panel | /admin-panel | Dashboard and settings management |
| Push Notifications | /push-notifications | Push campaign setup and management |
| Customer Questions | /customer-questions | Common customer questions |
| Integrations | /integrations | POS and platform connections |
| Marketing and Growth | /marketing-and-growth | Growth tips and strategies |
| Compliance/App Store Requirements | /compliance-app-store-requirements | App store policies and compliance |
| Support Documents | /support-documents | Reference docs and resources |

**Note:** Only categories with at least one "Live" article will appear on the homepage. Empty categories are hidden automatically.

### URL Slugs

Article URLs are auto-generated from the title:
- "How to: Invite DopeTech to Your Apple Developer Account" → `/articles/how-to-invite-dopetech-to-your-apple-developer-account`
- "POSaBIT Integration Setup Guide" → `/articles/posabit-integration-setup-guide`

Slugs are lowercase, spaces become hyphens, special characters are stripped.

### Writing Article Content

Write articles directly in the Notion page body. The following Notion blocks are supported:

- **Headings** (H1, H2, H3) — Use for section structure
- **Paragraphs** — Regular text with bold, italic, underline, strikethrough, code
- **Bulleted lists** — Unordered lists
- **Numbered lists** — Ordered lists
- **Code blocks** — Syntax-highlighted code (specify the language)
- **Images** — Uploaded or embedded images (automatically downloaded and re-hosted)
- **Links** — External links open in a new tab automatically
- **Callouts** — Tip/warning/info boxes
- **Dividers** — Horizontal rules
- **Tables** — Data tables
- **Toggle blocks** — Expandable sections

**Tips for good articles:**
- Start with a brief overview of what the article covers
- Use H2 headings to break content into scannable sections
- Include screenshots where helpful — just paste them into the Notion page
- Keep paragraphs short (2-3 sentences)
- End with a "Still need help?" note or next steps

### Images

Images pasted or uploaded in Notion are automatically:
1. Downloaded during the build
2. Saved with content-hash filenames (so identical images aren't duplicated)
3. Served from the same domain (no external image loading)
4. Given explicit width/height attributes (prevents layout shift)
5. Lazy-loaded (except the first image in each article)

Just paste images into your Notion page — no special handling needed.

### Links

- **External links** (to other websites) automatically open in a new tab with `rel="noopener noreferrer"`
- **Internal links** (to other support articles) should use the full URL: `https://support.dopetech.ai/articles/article-slug`
- **Avoid Notion internal links** (notion.so URLs) — the build will warn about these, and they won't work for website visitors

---

## Deploying Changes

### Automatic Deploys

The site rebuilds and deploys automatically:

1. **On push to `main`** — Any code change triggers a full rebuild + deploy
2. **Every 2 hours** — Scheduled rebuild picks up Notion content changes

### Manual Deploy (Immediate)

To deploy right now without waiting for the schedule:

**Option A: Trigger from GitHub**
1. Go to https://github.com/dopetech-ai/dopetech-support-website/actions
2. Click "Scheduled Content Rebuild" (or "Deploy to Cloudflare Pages")
3. Click "Run workflow" → "Run workflow"

**Option B: Deploy from your machine**
```bash
cd dopetech-support-website

# Set env vars (or use .env file)
export NOTION_API_KEY=your-token
export NOTION_DATABASE_ID=2af36807-99a6-80b9-90a7-000b5870b126
export CLOUDFLARE_ACCOUNT_ID=280beaae537de108cccfb4b097f95d6e

# Full build + deploy
npm run deploy
```

### Preview Deploys

To preview changes without affecting the live site:

```bash
# Build
npm run build:full

# Deploy to preview URL (not production)
CLOUDFLARE_ACCOUNT_ID=280beaae537de108cccfb4b097f95d6e \
npx wrangler pages deploy dist --project-name=dopetech-support --branch=preview --commit-dirty=true
```

This deploys to `https://preview.dopetech-support.pages.dev` instead of the production URL.

---

## Site Features

### Search

The homepage has a prominent search bar. Search is powered by Pagefind — it indexes all article content at build time and runs entirely in the browser (no server needed). Search results appear as you type with keyboard navigation (arrow keys + Enter).

### Categories

The homepage shows a grid of category cards. Each card displays the category name, description, icon, and article count. Clicking a card shows all articles in that category.

### Article Pages

Each article page shows:
- Breadcrumb navigation (Home → Category → Article)
- Article title and last-edited date
- Category badge
- Full article content with typography styling
- "Still need help?" contact section at the bottom

### 404 Page

If someone visits a URL that doesn't exist, they see a helpful 404 page with:
- A search bar to find what they were looking for
- Quick links to all categories

### SEO

Each page has:
- Unique `<title>` and `<meta description>` tags
- Open Graph tags for social sharing
- Sitemap at `/sitemap.xml` for search engines
- Prerendered HTML for every route (search engines see full content)
- `robots.txt` allowing all crawlers

---

## Adding a New Category

If you need a new category beyond the existing 8:

1. **In Notion:** Add a new option to the **Category** select property in the Support Hub Database

2. **In code:** Update three files:

   **`src/config/site.ts`** — Add the category definition:
   ```typescript
   {
     slug: 'your-category-slug',
     name: 'Your Category Name',  // Must match the Notion select option exactly
     description: 'Description shown on the homepage card.',
     icon: 'IconName',  // Lucide icon name
   },
   ```

   **`src/lib/icons.ts`** — Import the new icon:
   ```typescript
   import { ..., YourIcon } from 'lucide-react'
   // Add to iconMap:
   const iconMap = { ..., YourIcon }
   ```

   Browse available icons at https://lucide.dev/icons

3. **Commit, push, and deploy.** The new category will appear once articles are assigned to it.

---

## GitHub Secrets

The following secrets must be set in the GitHub repo for CI/CD to work:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value | Purpose |
|---|---|---|
| `NOTION_API_KEY` | Your Notion integration token (`ntn_...`) | Fetches articles from Notion |
| `NOTION_DATABASE_ID` | `2af36807-99a6-80b9-90a7-000b5870b126` | Identifies the Support Hub Database |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages edit permission | Deploys to Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | `280beaae537de108cccfb4b097f95d6e` | DopeTech Cloudflare account |

### Creating a Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template (or custom with Cloudflare Pages edit permission)
4. Restrict to the DopeTech account
5. Copy the token and add it as `CLOUDFLARE_API_TOKEN` in GitHub Secrets

---

## Custom Domain Setup

To serve the site at `support.dopetech.ai`:

1. Go to Cloudflare Pages dashboard → `dopetech-support` project → Custom domains
2. Click "Set up a custom domain"
3. Enter `support.dopetech.ai`
4. If the `dopetech.ai` DNS zone is already on Cloudflare, the CNAME record is added automatically
5. If not, add a CNAME record: `support` → `dopetech-support.pages.dev`

---

## Troubleshooting

### Articles not appearing on the site

1. **Check Status** — Is the article's Status set to "Live" in Notion?
2. **Check Category** — Does the article have a Category assigned? Articles without a category are skipped.
3. **Wait for rebuild** — The site rebuilds every 2 hours. Trigger a manual rebuild for immediate updates.
4. **Check build logs** — Go to GitHub Actions and look at the latest "Scheduled Content Rebuild" run. The build output shows which articles were processed and which were skipped (with reasons).

### Article content looks wrong

- **Unsupported blocks** — Some Notion block types (databases, embeds, synced blocks) may not render correctly. Stick to standard text, headings, lists, images, and code blocks.
- **Notion internal links** — Links like `notion.so/...` won't work for visitors. Use full external URLs instead.
- **Missing images** — If an image fails to download during build, it's replaced with a hidden comment. Re-upload the image in Notion.

### Search not finding articles

Search indexes are rebuilt with every deploy. If a new article isn't appearing in search:
1. Make sure the article has been deployed (check the latest build)
2. Search uses the article title and body text — make sure the content contains the search terms
3. Very short articles (just a title, no body) may not have enough content to index

### Build failures

Common causes:
- **Notion API rate limiting** — The build automatically retries with exponential backoff. If you have hundreds of articles, builds may take longer.
- **Invalid Notion token** — Check that `NOTION_API_KEY` is correct and the integration still has access to the database.
- **Missing secrets** — All 4 GitHub Secrets must be set for CI/CD to work.

---

## Architecture Overview

```
Notion Database (Support Hub)
  ↓ Build trigger (push to main, cron schedule, or manual)
  ↓
GitHub Actions
  ↓ npm run build:content
  ↓   → Fetches all "Live" articles via Notion SDK v5
  ↓   → Converts Notion blocks → Markdown → HTML
  ↓   → Downloads and re-hosts images
  ↓   → Outputs src/data/articles.json
  ↓
  ↓ npm run build
  ↓   → TypeScript check + Vite production build
  ↓
  ↓ prerender.ts
  ↓   → Generates static HTML for every route (for SEO + Pagefind)
  ↓
  ↓ generate-sitemap.ts
  ↓   → Creates dist/sitemap.xml
  ↓
  ↓ pagefind --site dist
  ↓   → Indexes all prerendered HTML for client-side search
  ↓
Cloudflare Pages
  → Serves static files globally via CDN
  → support.dopetech.ai
```

### Key Files

| File | Purpose |
|---|---|
| `src/config/site.ts` | Site metadata, category definitions |
| `src/pages/HomePage.tsx` | Homepage with search and category grid |
| `src/pages/CategoryPage.tsx` | Category listing page |
| `src/pages/ArticlePage.tsx` | Individual article page |
| `src/components/common/SearchInput.tsx` | Pagefind search with keyboard navigation |
| `scripts/lib/notion.ts` | Notion API client with rate limiting |
| `scripts/lib/notion-renderer.ts` | Notion → Markdown → HTML pipeline |
| `scripts/lib/notion-images.ts` | Image downloading and optimization |
| `scripts/lib/build-articles.ts` | Build orchestrator |
| `.github/workflows/deploy.yml` | Deploy on push to main |
| `.github/workflows/scheduled-rebuild.yml` | Scheduled rebuild every 2 hours |

---

## Local Development

### Prerequisites

- Node.js 22+
- npm
- Access to the Notion integration token and database ID

### Setup

```bash
git clone git@github.com:dopetech-ai/dopetech-support-website.git
cd dopetech-support-website
npm install

# Create .env file
cp .env.example .env
# Fill in NOTION_API_KEY and NOTION_DATABASE_ID
```

### Development Server

```bash
# Fetch content from Notion first
npm run build:content

# Start dev server with hot reload
npm run dev
```

The dev server runs at `http://localhost:5173` (or next available port). Changes to React components update instantly. To pick up new Notion content, re-run `npm run build:content`.

### Full Local Build

```bash
npm run build:full
npm run preview  # Preview the production build locally
```

---

## Contact

- **Phone:** (866) WEED-APP
- **Email:** hello@dopetech.ai
- **Website:** https://dopetech.ai
