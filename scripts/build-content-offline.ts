/**
 * Offline content builder — generates articles.json from a JSON data file
 * containing article content fetched via Notion MCP tools.
 *
 * The raw article data lives in scripts/data/notion-articles-raw.json.
 * This script reads that file, converts markdown to HTML, resolves
 * categories, generates slugs, and writes src/data/articles.json.
 *
 * Run: node --import tsx/esm scripts/build-content-offline.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { CATEGORIES } from '../src/config/site.ts'
import type { Article, Category, ContentData } from '../src/types/article.ts'

const SITE_CONFIG = {
  supportUrl: 'https://support.dopetech.ai',
}
const SUPPORT_HOST = new URL(SITE_CONFIG.supportUrl).hostname

// ── Custom marked renderer (matches notion-renderer.ts) ────────────
const renderer = new marked.Renderer()
renderer.link = function ({ href, title, text }) {
  const titleAttr = title ? ` title="${title}"` : ''
  try {
    const url = new URL(href, SITE_CONFIG.supportUrl)
    if (url.hostname !== SUPPORT_HOST) {
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
    }
  } catch {
    // Relative URL or invalid — keep as internal
  }
  return `<a href="${href}"${titleAttr}>${text}</a>`
}

function mdToHtml(markdown: string): string {
  // Strip Notion-specific markup that marked doesn't understand
  const cleaned = markdown
    // Remove <mention-page> references
    .replace(/<mention-page url="[^"]*"\/>/g, '')
    // Remove <mention-user> references
    .replace(/<mention-user url="[^"]*"><\/mention-user>/g, '')
    // Convert <callout> blocks to blockquotes
    .replace(/<callout[^>]*>\n?\t?([\s\S]*?)<\/callout>/g, (_, content) => {
      const lines = content.trim().split('\n').map((l: string) => `> ${l.replace(/^\t/, '')}`)
      return lines.join('\n')
    })
    // Remove <columns>/<column> wrappers, keep inner content
    .replace(/<\/?columns>/g, '')
    .replace(/<\/?column>/g, '')
    // Clean up excessive blank lines
    .replace(/\n{3,}/g, '\n\n')

  return marked.parse(cleaned, { gfm: true, renderer, async: false }) as string
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function matchCategory(notionCategory: string): string | null {
  const lower = notionCategory.toLowerCase()
  const match = CATEGORIES.find(
    (c) => c.name.toLowerCase() === lower || c.slug === lower,
  )
  return match?.slug ?? null
}

// Category inference from title prefix (fallback when Category property is empty)
function inferCategoryFromTitle(title: string): string | null {
  const prefixes: Record<string, string> = {
    'getting started': 'Getting started',
    'how-to': 'How-to',
    'how\u2011to': 'How-to', // non-breaking hyphen
    'troubleshooting': 'Troubleshooting',
    'faq': 'FAQ',
    'billing': 'Billing',
    'account': 'Account',
    'security': 'Security',
    'policy': 'Security',
    'integrations': 'Integrations',
    'release notes': 'Release notes',
  }

  const lower = title.toLowerCase()
  for (const [prefix, category] of Object.entries(prefixes)) {
    if (lower.startsWith(prefix)) return matchCategory(category)
  }
  return null
}

// ── Types ──────────────────────────────────────────────────────────

interface RawArticleInput {
  id: string
  title: string
  category: string
  summary: string
  lastEdited: string
  markdown: string
}

// ── Build ──────────────────────────────────────────────────────────

function main() {
  console.log('=== DopeTech Support Offline Content Build ===\n')

  // Read raw article data from JSON
  const rawDataPath = path.resolve('scripts/data/notion-articles-raw.json')
  if (!fs.existsSync(rawDataPath)) {
    console.error(`Error: ${rawDataPath} not found. Run the MCP fetch step first.`)
    process.exit(1)
  }
  const articles: RawArticleInput[] = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'))
  console.log(`Loaded ${articles.length} articles from ${rawDataPath}\n`)

  const built: Article[] = []
  const seenSlugs = new Set<string>()

  for (const raw of articles) {
    // Resolve category
    const categoryName = raw.category || null
    let categorySlug = categoryName ? matchCategory(categoryName) : null
    if (!categorySlug) {
      categorySlug = inferCategoryFromTitle(raw.title)
    }
    if (!categorySlug) {
      console.warn(`  Skipping "${raw.title}": no category resolved`)
      continue
    }

    const slug = titleToSlug(raw.title)
    if (!slug || seenSlugs.has(slug)) {
      console.warn(`  Skipping "${raw.title}": empty or duplicate slug "${slug}"`)
      continue
    }

    console.log(`  Processing: ${raw.title} [${categorySlug}]`)

    const html = mdToHtml(raw.markdown)
    seenSlugs.add(slug)

    built.push({
      id: raw.id,
      title: raw.title,
      slug,
      category: categorySlug,
      metaDescription: raw.summary,
      lastEdited: raw.lastEdited,
      html,
    })
  }

  // Build category summaries (only categories with articles)
  const categories: Category[] = CATEGORIES.map((def) => ({
    slug: def.slug,
    name: def.name,
    description: def.description,
    icon: def.icon,
    articleCount: built.filter((a) => a.category === def.slug).length,
  })).filter((c) => c.articleCount > 0)

  const data: ContentData = {
    articles: built,
    categories,
    buildTime: new Date().toISOString(),
  }

  const outDir = path.resolve('src/data')
  const outFile = path.join(outDir, 'articles.json')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2))

  console.log(`\nBuild complete: ${built.length} articles in ${categories.length} categories`)
  console.log(`Written to ${outFile}`)
}

main()
