import fs from 'node:fs'
import path from 'node:path'
import type { ContentData } from '../src/types/article.ts'
import { CATEGORIES } from '../src/config/site.ts'

const DIST_DIR = path.resolve('dist')
const SITE_URL = 'https://support.dopetech.ai'

function main() {
  console.log('Generating sitemap.xml...')

  let data: ContentData
  try {
    const raw = fs.readFileSync(
      path.resolve('src/data/articles.json'),
      'utf-8',
    )
    data = JSON.parse(raw) as ContentData
  } catch {
    data = { articles: [], categories: [], buildTime: '' }
  }

  const urls: Array<{ loc: string; lastmod?: string; priority: string }> = []

  // Homepage
  urls.push({ loc: '/', priority: '1.0', lastmod: data.buildTime.split('T')[0] })

  // Category pages
  for (const cat of CATEGORIES) {
    const hasArticles = data.articles.some((a) => a.category === cat.slug)
    if (!hasArticles && data.articles.length > 0) continue
    urls.push({ loc: `/${cat.slug}`, priority: '0.8' })
  }

  // Article pages
  for (const article of data.articles) {
    urls.push({
      loc: `/articles/${article.slug}`,
      lastmod: article.lastEdited.split('T')[0],
      priority: '0.6',
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml)
  console.log(`Sitemap generated with ${urls.length} URLs`)
}

main()
