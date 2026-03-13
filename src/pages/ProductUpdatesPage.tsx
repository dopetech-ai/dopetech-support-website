import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Update {
  id: string
  month: string
  date: string
  title: string
  excerpt: string
  categories: string[]
  gradient: string
  features: string[]
}

const CATEGORIES = [
  'DopeApps',
  'DopeSites',
  'DopeTender',
  'Admin Panel',
  'Integrations',
  'Analytics',
]

const UPDATES: Update[] = [
  {
    id: '1',
    month: 'March 2026',
    date: 'March 10, 2026',
    title: 'DopeTech Product Updates for March 10, 2026',
    excerpt:
      'New admin dashboard redesign, improved push notification scheduling, and enhanced analytics reporting for multi-location dispensaries...',
    categories: ['Admin Panel', 'Analytics'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Admin dashboard redesign',
      'Push notification scheduling v2',
      'Multi-location analytics',
    ],
  },
  {
    id: '2',
    month: 'March 2026',
    date: 'March 3, 2026',
    title: 'DopeTech Product Updates for March 3, 2026',
    excerpt:
      'Introducing new loyalty program templates, improved menu sync performance, and Dutchie POS integration enhancements...',
    categories: ['DopeApps', 'Integrations'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Loyalty program templates',
      'Menu sync performance boost',
      'Dutchie POS integration v3',
    ],
  },
  {
    id: '3',
    month: 'February 2026',
    date: 'February 24, 2026',
    title: 'DopeTech Product Updates for February 24, 2026',
    excerpt:
      'New mobile app builder features including custom checkout flows, age-gate improvements, and in-app messaging capabilities...',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-[#6366f1]/80 to-[#a855f7]/80',
    features: [
      'Custom checkout flows',
      'Age-gate improvements',
      'In-app messaging',
    ],
  },
  {
    id: '4',
    month: 'February 2026',
    date: 'February 10, 2026',
    title: 'DopeTech Product Updates for February 10, 2026',
    excerpt:
      'DopeTender kiosk mode now supports offline ordering, plus new compliance document auto-generation for state requirements...',
    categories: ['DopeTender', 'Admin Panel'],
    gradient: 'from-dt-cyan/80 to-[#6366f1]/80',
    features: [
      'Offline kiosk ordering',
      'Compliance doc auto-generation',
      'State requirement templates',
    ],
  },
  {
    id: '5',
    month: 'January 2026',
    date: 'January 20, 2026',
    title: 'DopeTech Product Updates for January 20, 2026',
    excerpt:
      'Major release: new website builder themes, SEO optimization toolkit, and Google Business Profile integration...',
    categories: ['DopeSites', 'Integrations'],
    gradient: 'from-dt-blue/80 to-dt-cyan/80',
    features: [
      'New website builder themes',
      'SEO optimization toolkit',
      'Google Business Profile sync',
    ],
  },
]

// Group updates by month
function groupByMonth(updates: Update[]) {
  const groups: { month: string; updates: Update[] }[] = []
  for (const update of updates) {
    const last = groups[groups.length - 1]
    if (last && last.month === update.month) {
      last.updates.push(update)
    } else {
      groups.push({ month: update.month, updates: [update] })
    }
  }
  return groups
}

const JUMP_MONTHS = [
  'March 2026',
  'February 2026',
  'January 2026',
  'December 2025',
  'November 2025',
  'October 2025',
  'September 2025',
  'August 2025',
  'July 2025',
]

const CATEGORY_COLORS: Record<string, string> = {
  DopeApps: 'bg-emerald-500',
  DopeSites: 'bg-dt-blue',
  DopeTender: 'bg-amber-500',
  'Admin Panel': 'bg-dt-cyan',
  Integrations: 'bg-violet-500',
  Analytics: 'bg-rose-500',
}

export function ProductUpdatesPage() {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>([])

  const filtered = UPDATES.filter((u) => {
    if (search && !u.title.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategories.length > 0 && !u.categories.some((c) => activeCategories.includes(c))) return false
    return true
  })

  const grouped = groupByMonth(filtered)

  function toggleCategory(cat: string) {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-dt-blue/[0.08] via-dt-cyan/[0.04] to-transparent" />
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-blue/[0.06] blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-[length:var(--font-size-hero)] font-bold text-dt-text">
            Product updates
          </h1>
          <a
            href="#subscribe"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-dt-cyan to-dt-blue px-6 py-2.5 text-sm font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110"
          >
            Subscribe to updates
          </a>
        </div>
      </section>

      {/* Search */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dt-text-dim" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search updates..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
          />
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Main content: sidebar + updates + jump nav */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr_200px]">
          {/* Left sidebar */}
          <aside className="space-y-6">
            {/* Feedback card */}
            <div className="rounded-2xl bg-gradient-to-br from-dt-cyan/20 to-dt-blue/20 border border-dt-cyan/10 p-5">
              <p className="text-sm font-medium text-dt-text">
                Have an idea or feature request?
              </p>
              <a
                href="mailto:hello@dopetech.ai"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright"
              >
                💬 Leave feedback
              </a>
            </div>

            {/* Category filters */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-dt-text">Categories</h3>
                {activeCategories.length > 0 && (
                  <button
                    onClick={() => setActiveCategories([])}
                    className="text-xs text-dt-text-dim transition-colors hover:text-dt-text"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                      activeCategories.includes(cat)
                        ? 'bg-dt-cyan/20 text-dt-cyan border border-dt-cyan/30'
                        : 'bg-white/[0.04] text-dt-text-muted border border-white/[0.06] hover:bg-white/[0.08] hover:text-dt-text',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Center: update cards */}
          <div className="space-y-12">
            {grouped.map((group) => (
              <div key={group.month}>
                {/* Month divider */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-sm font-medium text-dt-text-muted">
                    {group.month}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <div className="space-y-8">
                  {group.updates.map((update) => (
                    <article key={update.id} className="group cursor-pointer">
                      {/* Gradient banner */}
                      <div
                        className={cn(
                          'rounded-t-2xl bg-gradient-to-br p-6 pb-8',
                          update.gradient,
                        )}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                          Product Update
                        </p>
                        <p className="mt-2 font-heading text-lg font-bold text-white">
                          DopeTech {update.date.split(', ')[0].replace(update.month.split(' ')[0] + ' ', '')}
                        </p>
                        <div className="mt-4 space-y-1">
                          {update.features.map((f) => (
                            <p key={f} className="text-sm text-white/80">
                              {f}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="rounded-b-2xl border border-t-0 border-white/[0.06] bg-white/[0.02] p-6 transition-colors group-hover:bg-white/[0.04]">
                        {/* Category tags */}
                        <div className="flex flex-wrap items-center gap-3">
                          {update.categories.map((cat) => (
                            <span key={cat} className="flex items-center gap-1.5 text-xs text-dt-text-dim">
                              <span className={cn('h-2 w-2 rounded-full', CATEGORY_COLORS[cat] || 'bg-dt-text-dim')} />
                              {cat.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-dt-text transition-colors group-hover:text-dt-cyan">
                          {update.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-dt-text-muted">
                          {update.excerpt}
                        </p>
                        <p className="mt-3 text-xs text-dt-text-dim">{update.date}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-dt-text-muted">
                No updates match your filters.
              </div>
            )}
          </div>

          {/* Right sidebar: jump to month */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-dt-text">Jump to Month</h3>
              <nav className="mt-3 space-y-1.5">
                {JUMP_MONTHS.map((month) => {
                  const hasContent = UPDATES.some((u) => u.month === month)
                  return (
                    <button
                      key={month}
                      className={cn(
                        'block w-full text-right text-sm transition-colors',
                        hasContent
                          ? 'text-dt-cyan hover:text-dt-cyan-bright'
                          : 'text-dt-text-dim hover:text-dt-text-muted',
                      )}
                    >
                      {month}
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
