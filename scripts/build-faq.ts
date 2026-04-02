import fs from 'node:fs'
import path from 'node:path'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js'

const FAQ_DATABASE_ID = process.env.NOTION_FAQ_DATABASE_ID || '967cb391-8c24-46dc-9352-1c22e2384ea8'
const DATA_DIR = path.resolve('src/data')
const OUTPUT_FILE = path.join(DATA_DIR, 'faqData.json')

/** Product key mapping from Notion select values to site keys */
const PRODUCT_KEY_MAP: Record<string, string> = {
  General: 'general',
  DopeApps: 'dopeapps',
  DopeSites: 'dopesites',
  DopeTender: 'dopetender',
}

const PRODUCT_META: Record<string, { label: string; subtitle: string }> = {
  general: { label: 'General', subtitle: 'Account & Support' },
  dopeapps: { label: 'DopeApps', subtitle: 'Mobile Apps' },
  dopesites: { label: 'DopeSites', subtitle: 'Websites' },
  dopetender: { label: 'DopeTender', subtitle: 'Kiosks' },
}

interface RawFaq {
  question: string
  answer: string
  product: string
  topic: string
  sortOrder: number
  status: string
}

async function fetchFaqs(): Promise<RawFaq[]> {
  const auth = process.env.NOTION_API_KEY
  if (!auth) throw new Error('NOTION_API_KEY is required')

  const client = new Client({ auth })
  const faqs: RawFaq[] = []
  let cursor: string | undefined

  do {
    const response = await client.dataSources.query({
      data_source_id: FAQ_DATABASE_ID,
      filter: {
        property: 'Status',
        status: { equals: 'Done' },
      },
      sorts: [{ property: 'Sort Order', direction: 'ascending' }],
      start_cursor: cursor,
    })

    for (const page of response.results) {
      if (!('properties' in page)) continue
      const p = page as PageObjectResponse
      const props = p.properties

      const question = extractTitle(props.Question)
      const answer = extractRichText(props.Answer)
      const product = extractSelect(props.Product)
      const topic = extractSelect(props.Topic)
      const sortOrder = extractNumber(props['Sort Order'])

      if (!question || !product || !topic) continue

      faqs.push({ question, answer, product, topic, sortOrder, status: 'Done' })
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return faqs
}

function buildFaqData(faqs: RawFaq[]) {
  const result: Record<string, { label: string; subtitle: string; topics: { title: string; questions: { q: string; a: string }[] }[] }> = {}

  // Initialize all products
  for (const [key, meta] of Object.entries(PRODUCT_META)) {
    result[key] = { ...meta, topics: [] }
  }

  // Group by product → topic
  for (const faq of faqs) {
    const productKey = PRODUCT_KEY_MAP[faq.product]
    if (!productKey || !result[productKey]) continue

    let topic = result[productKey].topics.find((t) => t.title === faq.topic)
    if (!topic) {
      topic = { title: faq.topic, questions: [] }
      result[productKey].topics.push(topic)
    }

    topic.questions.push({ q: faq.question, a: faq.answer })
  }

  // Remove products with no topics
  for (const key of Object.keys(result)) {
    if (result[key].topics.length === 0) {
      delete result[key]
    }
  }

  return result
}

// ── Property extractors ─────────────────────────────────────────────

function extractTitle(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'title' && Array.isArray(p.title)) {
    return (p.title as Array<{ plain_text: string }>).map((t) => t.plain_text).join('')
  }
  return ''
}

function extractRichText(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'rich_text' && Array.isArray(p.rich_text)) {
    return (p.rich_text as Array<{ plain_text: string }>).map((t) => t.plain_text).join('')
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

function extractNumber(prop: unknown): number {
  if (!prop || typeof prop !== 'object') return 0
  const p = prop as Record<string, unknown>
  if (p.type === 'number' && typeof p.number === 'number') return p.number
  return 0
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('=== DopeTech FAQ Build ===\n')

  const faqs = await fetchFaqs()
  console.log(`Fetched ${faqs.length} FAQ entries with status "Done"`)

  const data = buildFaqData(faqs)
  const productCount = Object.keys(data).length
  const questionCount = Object.values(data).reduce(
    (sum, p) => sum + p.topics.reduce((s, t) => s + t.questions.length, 0),
    0,
  )

  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))

  console.log(`\nWritten to ${OUTPUT_FILE}`)
  console.log(`  Products: ${productCount}`)
  console.log(`  Questions: ${questionCount}`)
}

main().catch((err) => {
  console.error('FAQ build failed:', err)
  process.exit(1)
})
