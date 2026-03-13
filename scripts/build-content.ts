import fs from 'node:fs'
import path from 'node:path'
import { buildAllArticles } from './lib/build-articles.ts'

const DATA_DIR = path.resolve('src/data')
const OUTPUT_FILE = path.join(DATA_DIR, 'articles.json')

async function main() {
  console.log('=== DopeTech Support Content Build ===\n')

  const data = await buildAllArticles()

  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))

  console.log(`\nWritten to ${OUTPUT_FILE}`)
  console.log(`  Articles: ${data.articles.length}`)
  console.log(`  Categories: ${data.categories.length}`)
  console.log(`  Build time: ${data.buildTime}`)
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
