import fs from 'node:fs'
import path from 'node:path'
import type { ContentData } from '../src/types/article.ts'
import { CATEGORIES } from '../src/config/site.ts'

const DIST_DIR = path.resolve('dist')

/**
 * Generates static HTML pages from the Vite SPA output + articles.json.
 * Each route gets its own index.html with article content inlined for
 * Pagefind indexing and SEO crawling.
 *
 * This is a lightweight approach: we inject article content into the
 * existing SPA shell HTML rather than doing full React SSR, which would
 * require a separate server build. The article content is placed in a
 * hidden div with data-pagefind-body so Pagefind can index it.
 */
async function main() {
  console.log('=== Prerender Static Pages ===\n')

  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8')

  // Load content data
  let data: ContentData
  try {
    const raw = fs.readFileSync(
      path.resolve('src/data/articles.json'),
      'utf-8',
    )
    data = JSON.parse(raw) as ContentData
  } catch {
    console.warn('No articles.json found, generating shell pages only')
    data = { articles: [], categories: [], buildTime: '' }
  }

  const routes: Array<{ path: string; title: string; content: string }> = []

  // Homepage
  routes.push({
    path: '/',
    title: 'DopeTech Support — Help Center',
    content: `<h1>How can we help you?</h1><p>Search our guides and FAQs to get the most out of DopeTech products.</p>`,
  })

  // Category pages
  for (const cat of CATEGORIES) {
    const articles = data.articles.filter((a) => a.category === cat.slug)
    if (articles.length === 0 && data.articles.length > 0) continue

    const articleList = articles
      .map((a) => `<li><a href="/articles/${a.slug}">${a.title}</a></li>`)
      .join('\n')

    routes.push({
      path: `/${cat.slug}`,
      title: `${cat.name} — DopeTech Support`,
      content: `<h1>${cat.name}</h1><p>${cat.description}</p><ul>${articleList}</ul>`,
    })
  }

  // Article pages
  for (const article of data.articles) {
    routes.push({
      path: `/articles/${article.slug}`,
      title: `${article.title} — DopeTech Support`,
      content: `<h1>${article.title}</h1>\n${article.html}`,
    })
  }

  // 404 page
  routes.push({
    path: '/404',
    title: '404 — DopeTech Support',
    content: `<h1>Page not found</h1><p>The page you're looking for doesn't exist or has been moved.</p>`,
  })

  // Write each route
  for (const route of routes) {
    const html = indexHtml
      .replace(
        '<title>DopeTech Support | Help Center</title>',
        `<title>${escapeHtml(route.title)}</title>`,
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root"></div>\n<div data-pagefind-body style="display:none">${route.content}</div>`,
      )

    const filePath =
      route.path === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, route.path, 'index.html')

    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, html)
  }

  // Copy 404 as dist/404.html for Cloudflare Pages
  const notFoundSrc = path.join(DIST_DIR, '404', 'index.html')
  if (fs.existsSync(notFoundSrc)) {
    fs.copyFileSync(notFoundSrc, path.join(DIST_DIR, '404.html'))
  }

  console.log(`Prerendered ${routes.length} pages`)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
