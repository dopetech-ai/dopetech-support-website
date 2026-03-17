import { SITE_CONFIG } from '@/config/site'

interface SeoParams {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

const BASE_URL = SITE_CONFIG.supportUrl
const DEFAULT_DESCRIPTION = 'Get help with DopeTech products. Browse guides, troubleshooting articles, and FAQs for DopeApps, DopeSites, and DopeTender.'

function getOrCreate(selector: string, tag: string, attrs?: Record<string, string>): HTMLElement {
  let el = document.querySelector<HTMLElement>(selector)
  if (!el) {
    el = document.createElement(tag)
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    }
    document.head.appendChild(el)
  }
  return el
}

export function setSeo({ title, description, path, type = 'website', publishedTime, modifiedTime }: SeoParams) {
  const fullTitle = `${title} | DopeTech Support Hub`
  const url = `${BASE_URL}${path}`
  const desc = description || DEFAULT_DESCRIPTION

  // Title
  document.title = fullTitle

  // Meta description
  const metaDesc = getOrCreate('meta[name="description"]', 'meta', { name: 'description' })
  metaDesc.setAttribute('content', desc)

  // Canonical
  const canonical = getOrCreate('link[rel="canonical"]', 'link', { rel: 'canonical' }) as HTMLLinkElement
  canonical.setAttribute('href', url)

  // Open Graph
  const ogTitle = getOrCreate('meta[property="og:title"]', 'meta', { property: 'og:title' })
  ogTitle.setAttribute('content', fullTitle)

  const ogDesc = getOrCreate('meta[property="og:description"]', 'meta', { property: 'og:description' })
  ogDesc.setAttribute('content', desc)

  const ogUrl = getOrCreate('meta[property="og:url"]', 'meta', { property: 'og:url' })
  ogUrl.setAttribute('content', url)

  const ogType = getOrCreate('meta[property="og:type"]', 'meta', { property: 'og:type' })
  ogType.setAttribute('content', type)

  // Twitter
  const twTitle = getOrCreate('meta[name="twitter:title"]', 'meta', { name: 'twitter:title' })
  twTitle.setAttribute('content', fullTitle)

  const twDesc = getOrCreate('meta[name="twitter:description"]', 'meta', { name: 'twitter:description' })
  twDesc.setAttribute('content', desc)

  // Article dates (if applicable)
  if (type === 'article') {
    if (publishedTime) {
      const pub = getOrCreate('meta[property="article:published_time"]', 'meta', { property: 'article:published_time' })
      pub.setAttribute('content', publishedTime)
    }
    if (modifiedTime) {
      const mod = getOrCreate('meta[property="article:modified_time"]', 'meta', { property: 'article:modified_time' })
      mod.setAttribute('content', modifiedTime)
    }
  }
}

interface JsonLdArticle {
  title: string
  description: string
  path: string
  dateModified: string
  category?: string
}

export function setArticleJsonLd({ title, description, path, dateModified, category }: JsonLdArticle) {
  const url = `${BASE_URL}${path}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || undefined,
    url,
    dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'DopeTech',
      url: SITE_CONFIG.mainSiteUrl,
    },
    ...(category ? { articleSection: category } : {}),
  }

  injectJsonLd('article-jsonld', schema)
}

interface JsonLdBreadcrumb {
  items: { name: string; url?: string }[]
}

export function setBreadcrumbJsonLd({ items }: JsonLdBreadcrumb) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.name,
        ...(item.url ? { item: `${BASE_URL}${item.url}` } : {}),
      })),
    ],
  }

  injectJsonLd('breadcrumb-jsonld', schema)
}

export function setOrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DopeTech',
    url: SITE_CONFIG.mainSiteUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phoneHref.replace('tel:', ''),
      contactType: 'customer support',
      email: SITE_CONFIG.email,
    },
    sameAs: [SITE_CONFIG.mainSiteUrl],
  }

  injectJsonLd('org-jsonld', schema)
}

export function setSearchActionJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DopeTech Support Hub',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  injectJsonLd('search-jsonld', schema)
}

function injectJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}
