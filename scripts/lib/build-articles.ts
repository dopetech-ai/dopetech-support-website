import { Client } from '@notionhq/client'
import { fetchPublishedArticles } from './notion.ts'
import { renderPageToHtml } from './notion-renderer.ts'
import { processImagesInHtml } from './notion-images.ts'
import {
  CATEGORIES,
  RESERVED_SLUGS,
  isValidCategory,
} from '../../src/config/site.ts'
import type { Article, Category, ContentData } from '../../src/types/article.ts'

/**
 * Sanitize a slug: lowercase, replace spaces with hyphens, strip unsafe chars.
 */
function sanitizeSlug(raw: string): string {
  const sanitized = raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (sanitized !== raw) {
    console.warn(`  ⚠ Slug sanitized: "${raw}" → "${sanitized}"`)
  }
  return sanitized
}

/**
 * Match a category value from Notion to a category slug.
 * Tries exact slug match first, then case-insensitive name match.
 */
function matchCategory(notionCategory: string): string | null {
  // Direct slug match
  if (isValidCategory(notionCategory)) return notionCategory

  // Case-insensitive name match
  const lower = notionCategory.toLowerCase()
  const match = CATEGORIES.find(
    (c) => c.name.toLowerCase() === lower || c.slug === lower,
  )
  return match?.slug ?? null
}

export async function buildAllArticles(): Promise<ContentData> {
  const auth = process.env.NOTION_API_KEY
  if (!auth) throw new Error('NOTION_API_KEY is required')

  const notionClient = new Client({ auth })

  console.log('Fetching published articles from Notion...')
  const rawArticles = await fetchPublishedArticles()
  console.log(`Found ${rawArticles.length} published articles`)

  const articles: Article[] = []
  const seenSlugs = new Set<string>()

  for (const raw of rawArticles) {
    const slug = sanitizeSlug(raw.slug)

    // Validate slug
    if (!slug) {
      console.warn(`⚠ Skipping "${raw.title}": empty slug after sanitization`)
      continue
    }
    if (RESERVED_SLUGS.has(slug)) {
      console.warn(
        `⚠ Skipping "${raw.title}": slug "${slug}" is reserved`,
      )
      continue
    }
    if (seenSlugs.has(slug)) {
      console.warn(
        `⚠ Skipping "${raw.title}": duplicate slug "${slug}"`,
      )
      continue
    }

    // Validate category
    const categorySlug = matchCategory(raw.category)
    if (!categorySlug) {
      console.warn(
        `⚠ Skipping "${raw.title}": unrecognized category "${raw.category}"`,
      )
      continue
    }

    console.log(`  Processing: ${raw.title}`)

    // Render to HTML
    let html: string
    try {
      html = await renderPageToHtml(notionClient, raw.id)
    } catch (err) {
      console.warn(`⚠ Error rendering "${raw.title}":`, err)
      continue
    }

    // Download and re-host images
    html = await processImagesInHtml(html, slug)

    seenSlugs.add(slug)
    articles.push({
      id: raw.id,
      title: raw.title,
      slug,
      category: categorySlug,
      metaDescription: raw.metaDescription,
      lastEdited: raw.lastEdited,
      html,
    })
  }

  // Build category summaries
  const categories: Category[] = CATEGORIES.map((def) => ({
    slug: def.slug,
    name: def.name,
    description: def.description,
    icon: def.icon,
    articleCount: articles.filter((a) => a.category === def.slug).length,
  })).filter((c) => c.articleCount > 0)

  console.log(
    `\nBuild complete: ${articles.length} articles in ${categories.length} categories`,
  )

  return {
    articles,
    categories,
    buildTime: new Date().toISOString(),
  }
}
