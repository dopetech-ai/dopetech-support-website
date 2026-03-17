import fs from 'node:fs'
import path from 'node:path'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js'

const DATA_DIR = path.resolve('src/data')
const OUTPUT_FILE = path.join(DATA_DIR, 'status.json')
const STATUS_DATABASE_ID = 'c2262b3b-bf9a-41db-8faa-6ffc953fa0ee'

async function main() {
  const auth = process.env.NOTION_API_KEY
  if (!auth) throw new Error('NOTION_API_KEY is required')

  const notion = new Client({ auth })

  console.log('Fetching system status from Notion...')

  const response = await notion.dataSources.query({
    data_source_id: STATUS_DATABASE_ID,
  })

  const services: Array<{ name: string; status: string; message: string }> = []
  const incidents: Array<{ name: string; status: string; message: string; date: string }> = []

  let mostRecentEdit = ''

  for (const page of response.results) {
    if (!('properties' in page)) continue
    const p = page as PageObjectResponse
    const props = p.properties

    const name = extractTitle(props.Service)
    const status = extractSelect(props.Status) || 'Operational'
    const message = extractText(props.Message)
    const type = extractSelect(props.Type) || 'Service'

    if (p.last_edited_time > mostRecentEdit) {
      mostRecentEdit = p.last_edited_time
    }

    if (type === 'Service') {
      services.push({ name, status, message })
    } else if (type === 'Incident') {
      incidents.push({
        name,
        status,
        message,
        date: new Date(p.last_edited_time).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })
    }
  }

  const data = {
    services,
    incidents,
    lastUpdated: mostRecentEdit || new Date().toISOString(),
  }

  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))

  console.log(`Status: ${services.length} services, ${incidents.length} incidents`)
  console.log(`Written to ${OUTPUT_FILE}`)
}

function extractTitle(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'title' && Array.isArray(p.title)) {
    return (p.title as Array<{ plain_text: string }>).map((t) => t.plain_text).join('')
  }
  return ''
}

function extractSelect(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'select' && p.select && typeof p.select === 'object') {
    return (p.select as { name: string }).name || ''
  }
  return ''
}

function extractText(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, unknown>
  if (p.type === 'rich_text' && Array.isArray(p.rich_text)) {
    return (p.rich_text as Array<{ plain_text: string }>).map((t) => t.plain_text).join('')
  }
  return ''
}

main().catch((err) => {
  console.error('Status build failed:', err)
  process.exit(1)
})
