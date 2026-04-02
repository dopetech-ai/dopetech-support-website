import fs from 'node:fs'
import path from 'node:path'
import type { ContentData } from '../src/types/article.ts'
import { CATEGORIES, SITE_CONFIG } from '../src/config/site.ts'

const DIST_DIR = path.resolve('dist')
const BASE_URL = SITE_CONFIG.supportUrl
const DEFAULT_DESC = 'Get help with DopeTech products. Browse guides, troubleshooting articles, and FAQs for DopeApps, DopeSites, and DopeTender.'

interface Route {
  path: string
  title: string
  description: string
  content: string
  type?: 'article'
  modifiedTime?: string
}

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

  const routes: Route[] = []

  // Homepage
  routes.push({
    path: '/',
    title: 'DopeTech Support | Help Center',
    description: DEFAULT_DESC,
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
      title: `${cat.name} | DopeTech Support Hub`,
      description: cat.description,
      content: `<h1>${cat.name}</h1><p>${cat.description}</p><ul>${articleList}</ul>`,
    })
  }

  // Article pages
  for (const article of data.articles) {
    routes.push({
      path: `/articles/${article.slug}`,
      title: `${article.title} | DopeTech Support Hub`,
      description: article.metaDescription || `${article.title} - DopeTech Support`,
      content: `<h1>${article.title}</h1>\n${article.html}`,
      type: 'article',
      modifiedTime: article.lastEdited,
    })
  }

  // Static pages
  routes.push({
    path: '/faq',
    title: 'FAQ | DopeTech Support Hub',
    description: 'Frequently asked questions about DopeApps, DopeSites, and DopeTender.',
    content: '<h1>Frequently Asked Questions</h1>',
  })
  routes.push({
    path: '/status',
    title: 'System Status | DopeTech Support Hub',
    description: 'Current system status for DopeTech services.',
    content: '<h1>System Status</h1>',
  })
  routes.push({
    path: '/product-updates',
    title: 'Product Updates | DopeTech Support Hub',
    description: 'The latest features, improvements, and fixes for DopeApps, DopeSites, and DopeTender.',
    content: '<h1>Product Updates</h1>',
  })
  routes.push({
    path: '/contact',
    title: 'Contact Support | DopeTech Support Hub',
    description: 'Get in touch with DopeTech support. Report bugs, request features, or ask questions.',
    content: '<h1>Contact Support</h1>',
  })
  routes.push({
    path: '/developer-docs',
    title: 'Developer Docs | DopeTech Support Hub',
    description: 'API documentation and developer resources for DopeTech products.',
    content: '<h1>Developer Docs</h1>',
  })

  // 404 page
  routes.push({
    path: '/404',
    title: '404 | DopeTech Support Hub',
    description: 'Page not found.',
    content: `<h1>Page not found</h1><p>The page you're looking for doesn't exist or has been moved.</p>`,
  })

  // Write each route
  for (const route of routes) {
    const canonicalUrl = `${BASE_URL}${route.path === '/' ? '' : route.path}`

    // Build meta tags to inject
    const metaTags = [
      `<title>${escapeHtml(route.title)}</title>`,
      `<meta name="description" content="${escapeAttr(route.description)}" />`,
      `<link rel="canonical" href="${canonicalUrl}" />`,
      `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
      `<meta property="og:url" content="${canonicalUrl}" />`,
      `<meta property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" />`,
    ]

    if (route.modifiedTime) {
      metaTags.push(`<meta property="article:modified_time" content="${route.modifiedTime}" />`)
    }

    let html = indexHtml
      // Replace title
      .replace(
        /<title>[^<]*<\/title>/,
        metaTags[0],
      )
      // Replace meta description
      .replace(
        /<meta name="description"[^>]*\/>/,
        metaTags[1],
      )
      // Add canonical + OG tags before </head>
      .replace(
        '</head>',
        `${metaTags.slice(2).join('\n    ')}\n  </head>`,
      )
      // Inject content for Pagefind
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

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
