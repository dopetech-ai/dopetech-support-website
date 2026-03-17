import { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import DOMPurify from 'dompurify'
import { getArticles, getCategoryDef } from '@/lib/content'
import type { Article } from '@/types/article'
import { cn } from '@/lib/cn'

interface PagefindResult {
  url: string
  meta: { title: string }
  excerpt: string
}

interface PagefindInstance {
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<PagefindResult> }>
  }>
}

interface SearchResultItem {
  title: string
  url: string
  excerpt: string
  category?: string
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const pagefindRef = useRef<PagefindInstance | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)

    // Try Pagefind first (production)
    let pagefindResults: SearchResultItem[] = []
    try {
      if (!pagefindRef.current) {
        const pagefindPath = '/_pagefind/pagefind.js'
        const pf = await import(/* @vite-ignore */ pagefindPath) as PagefindInstance
        pagefindRef.current = pf
      }
      const searchResult = await pagefindRef.current.search(trimmed)
      const data = await Promise.all(
        searchResult.results.slice(0, 20).map((r) => r.data()),
      )
      pagefindResults = data.map((d) => ({
        title: d.meta.title,
        url: d.url.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/',
        excerpt: d.excerpt,
      }))
    } catch {
      // Pagefind not available — fall through to client-side search
    }

    if (pagefindResults.length > 0) {
      setResults(pagefindResults)
      setLoading(false)
      return
    }

    // Client-side fallback: search articles by title, description, and content
    const articles = await getArticles()
    const lower = trimmed.toLowerCase()
    const matched = articles
      .filter((a) =>
        a.title.toLowerCase().includes(lower) ||
        a.metaDescription.toLowerCase().includes(lower) ||
        a.html.toLowerCase().includes(lower),
      )
      .slice(0, 20)
      .map((a): SearchResultItem => ({
        title: a.title,
        url: `/articles/${a.slug}`,
        excerpt: getExcerpt(a, lower),
        category: a.category,
      }))

    setResults(matched)
    setLoading(false)
  }, [])

  // Run search on mount if query param present
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery)
    }
    inputRef.current?.focus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearchParams(query.trim() ? { q: query.trim() } : {})
    search(query)
  }

  return (
    <section className="relative min-h-[60vh] px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.04] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex gap-0">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dt-text-dim" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-l-xl border border-r-0 border-dt-border bg-dt-bg-elevated py-4 pl-12 pr-4 text-lg text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/50 focus:outline-none focus:ring-1 focus:ring-dt-cyan/30 focus:shadow-[0_0_12px_rgba(0,229,255,0.15)]"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-r-xl bg-gradient-to-r from-dt-cyan to-dt-blue px-8 text-base font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110"
          >
            Search
          </button>
        </form>

        {/* Results */}
        <div className="mt-8">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-dt-cyan" />
              <span className="ml-3 text-dt-text-muted">Searching...</span>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-dt-text-dim" />
              <h2 className="mt-4 text-lg font-semibold text-dt-text">
                No results found
              </h2>
              <p className="mt-2 text-sm text-dt-text-muted">
                We couldn&apos;t find anything matching &ldquo;{searchParams.get('q')}&rdquo;.
                Try a different search term or browse our categories.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-dt-cyan/10 to-dt-blue/10 border border-dt-cyan/20 px-5 py-2 text-sm font-medium text-dt-cyan transition-all hover:border-dt-cyan/40"
              >
                Browse Help Center <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="mb-4 text-sm text-dt-text-muted">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{searchParams.get('q')}&rdquo;
              </p>
              <div className="space-y-3">
                {results.map((result) => {
                  const catDef = result.category ? getCategoryDef(result.category) : null
                  return (
                    <Link
                      key={result.url}
                      to={result.url}
                      className="group flex flex-col gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 transition-all duration-200 hover:border-dt-cyan/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-dt-text transition-colors duration-200 group-hover:text-dt-cyan">
                          {result.title}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-dt-text-dim transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-dt-cyan" />
                      </div>
                      {catDef && (
                        <span className="text-xs font-medium text-dt-text-dim">
                          {catDef.name}
                        </span>
                      )}
                      {result.excerpt && (
                        <p
                          className={cn(
                            'text-sm text-dt-text-muted line-clamp-2',
                            '[&_mark]:bg-dt-cyan/20 [&_mark]:text-dt-cyan [&_mark]:rounded-sm',
                          )}
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.excerpt) }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </>
          )}

          {!loading && !searched && (
            <div className="py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-dt-text-dim" />
              <p className="mt-4 text-dt-text-muted">
                Type a search term to find articles
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/** Extract a snippet around the matched term from article content */
function getExcerpt(article: Article, term: string): string {
  // Strip HTML tags for plain text search
  const text = article.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  const idx = text.toLowerCase().indexOf(term)

  if (idx === -1) {
    // Match was in title/description, use meta description
    return article.metaDescription || text.slice(0, 150) + '...'
  }

  const start = Math.max(0, idx - 60)
  const end = Math.min(text.length, idx + term.length + 100)
  let snippet = ''
  if (start > 0) snippet += '...'
  snippet += text.slice(start, end)
  if (end < text.length) snippet += '...'

  // Highlight the matched term
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  snippet = snippet.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark>$1</mark>',
  )

  return snippet
}
