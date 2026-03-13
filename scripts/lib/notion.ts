import { Client } from '@notionhq/client'
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints.js'

const MAX_CONCURRENT = 3
const BLOCK_PAGE_SIZE = 100

let notion: Client

function getClient(): Client {
  if (!notion) {
    const auth = process.env.NOTION_API_KEY
    if (!auth) throw new Error('NOTION_API_KEY environment variable is required')
    notion = new Client({ auth })
  }
  return notion
}

// ── Semaphore for concurrency limiting ──────────────────────────────

const semaphoreQueue: (() => void)[] = []
let semaphoreActive = 0

async function semaphoreAcquire(): Promise<void> {
  if (semaphoreActive < MAX_CONCURRENT) {
    semaphoreActive++
    return
  }
  return new Promise<void>((resolve) => {
    semaphoreQueue.push(() => {
      semaphoreActive++
      resolve()
    })
  })
}

function semaphoreRelease(): void {
  semaphoreActive--
  const next = semaphoreQueue.shift()
  if (next) next()
}

async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  await semaphoreAcquire()
  try {
    return await retryWithBackoff(fn)
  } finally {
    semaphoreRelease()
  }
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err: unknown) {
      const isRateLimit =
        err instanceof Object &&
        'status' in err &&
        (err as { status: number }).status === 429
      if (!isRateLimit || attempt === maxRetries) throw err
      const delay = Math.pow(2, attempt) * 1000
      console.warn(`Rate limited, retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}

// ── Slug generation from title ──────────────────────────────────────

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Public API ──────────────────────────────────────────────────────

export interface RawArticle {
  id: string
  title: string
  slug: string
  category: string
  metaDescription: string
  lastEdited: string
}

export async function fetchPublishedArticles(): Promise<RawArticle[]> {
  const client = getClient()
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId)
    throw new Error('NOTION_DATABASE_ID environment variable is required')

  const articles: RawArticle[] = []
  let cursor: string | undefined

  do {
    // SDK v5: dataSources.query
    // Filter by Status (status type) = "Live"
    const response = await withRateLimit(() =>
      client.dataSources.query({
        data_source_id: databaseId,
        filter: {
          property: 'Status',
          status: { equals: 'Live' },
        },
        start_cursor: cursor,
      }),
    )

    for (const page of response.results) {
      if (!('properties' in page)) continue
      const p = page as PageObjectResponse
      const props = p.properties

      // Title: "Name" property (title type)
      const title = extractTitle(props.Name)

      // Slug: auto-generated from title (no Slug property in this database)
      const slug = titleToSlug(title)

      // Category: "Category" select property — pass raw name to build-articles for matching
      const category = extractSelect(props.Category)

      if (!title || !slug || !category) {
        console.warn(
          `Skipping page ${p.id}: missing title/slug/category (title=${title}, slug=${slug}, category=${category})`,
        )
        continue
      }

      articles.push({
        id: p.id,
        title,
        slug,
        category,
        metaDescription: '',
        lastEdited: p.last_edited_time,
      })
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return articles
}

export async function fetchArticleBlocks(
  pageId: string,
): Promise<BlockObjectResponse[]> {
  const client = getClient()
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await withRateLimit(() =>
      client.blocks.children.list({
        block_id: pageId,
        page_size: BLOCK_PAGE_SIZE,
        start_cursor: cursor,
      }),
    )

    for (const block of response.results) {
      blocks.push(block as BlockObjectResponse)
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

// ── Property extractors ─────────────────────────────────────────────

function extractTitle(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'title' && Array.isArray(p.title)) {
    return (p.title as Array<{ plain_text: string }>)
      .map((t) => t.plain_text)
      .join('')
  }
  return ''
}

function extractSelect(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'select' && p.select && typeof p.select === 'object') {
    return (p.select as { name: string }).name || ''
  }
  if (p.type === 'status' && p.status && typeof p.status === 'object') {
    return (p.status as { name: string }).name || ''
  }
  return ''
}
