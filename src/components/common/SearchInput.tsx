import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchResult {
  url: string
  meta: { title: string }
  excerpt: string
}

interface PagefindInstance {
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<SearchResult> }>
  }>
}

interface SearchInputProps {
  size?: 'default' | 'large'
  className?: string
  onSearch?: (query: string) => void
}

export function SearchInput({ size = 'default', className, onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const pagefindRef = useRef<PagefindInstance | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Lazy-load Pagefind on first interaction
  const initPagefind = useCallback(async () => {
    if (pagefindRef.current) return
    try {
      const pagefindPath = '/_pagefind/pagefind.js'
      const pf = await import(/* @vite-ignore */ pagefindPath) as PagefindInstance
      pagefindRef.current = pf
    } catch {
      // Pagefind not available (dev mode or build not run)
    }
  }, [])

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      await initPagefind()
      if (!pagefindRef.current) return

      const search = await pagefindRef.current.search(query)
      const data = await Promise.all(
        search.results.slice(0, 8).map((r) => r.data()),
      )
      setResults(data)
      setOpen(data.length > 0 || query.trim().length > 0)
      setActiveIndex(-1)
    }, 150)

    return () => clearTimeout(timer)
  }, [query, initPagefind])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.closest('.search-container')?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateToResult(results[activeIndex])
      } else if (query.trim()) {
        setOpen(false)
        if (onSearch) {
          onSearch(query.trim())
        } else {
          navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  function navigateToResult(result: SearchResult) {
    setOpen(false)
    setQuery('')
    const url = result.url.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/'
    navigate(url)
  }

  /** Expose current query for external use (e.g. Search button) */
  function getQuery() {
    return query.trim()
  }

  // Attach getQuery to the input element so parent can access it
  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement & { getQuery: () => string }).getQuery = getQuery
    }
  })

  return (
    <div className={cn('search-container relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-dt-text-dim',
          size === 'large' ? 'h-5 w-5 left-4' : 'h-4 w-4',
        )}
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={initPagefind}
        onKeyDown={handleKeyDown}
        placeholder="Search articles..."
        className={cn(
          'w-full rounded-xl border border-dt-border bg-dt-bg-elevated text-dt-text placeholder:text-dt-text-dim transition-all',
          'focus:border-dt-cyan/50 focus:outline-none focus:ring-1 focus:ring-dt-cyan/30 focus:shadow-[0_0_12px_rgba(0,229,255,0.15)]',
          size === 'large'
            ? 'py-4 pl-12 pr-4 text-lg'
            : 'py-2.5 pl-10 pr-4 text-sm',
        )}
      />

      {/* Results dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-dt-border bg-dt-bg-elevated shadow-lg shadow-black/30">
          {results.length > 0 ? (
            <ul>
              {results.map((result, i) => (
                <li key={result.url}>
                  <button
                    onClick={() => navigateToResult(result)}
                    className={cn(
                      'w-full px-4 py-3 text-left transition-colors',
                      i === activeIndex
                        ? 'bg-dt-bg-card text-dt-text'
                        : 'text-dt-text-muted hover:bg-dt-bg-card',
                      i < results.length - 1 && 'border-b border-dt-border',
                    )}
                  >
                    <p className="text-sm font-medium text-dt-text">
                      {result.meta.title}
                    </p>
                    {result.excerpt && (
                      <p
                        className="mt-0.5 text-xs text-dt-text-dim line-clamp-2 [&_mark]:bg-dt-cyan/20 [&_mark]:text-dt-cyan"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.excerpt) }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-dt-text-muted">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
