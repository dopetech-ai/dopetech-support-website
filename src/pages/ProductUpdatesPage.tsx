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
  'Platform',
  'Support Hub',
  'Infrastructure',
]

const UPDATES: Update[] = [
  // --- March 2026 ---
  {
    id: '202603-2',
    month: 'March 2026',
    date: 'March 13, 2026',
    title: 'Support Hub: P0 Production Fixes & New Pages',
    excerpt:
      'Resolved 7 production-blocking issues including XSS sanitization with DOMPurify, font rendering fix, image optimization (favicon 2.1MB→37KB, logo 288KB→8KB), CSP headers, WCAG AA contrast compliance, and CSP-safe Pagefind import. Added Contact Support form, Product Updates page, Developer Docs coming soon page, and product-specific support pages for DopeApps, DopeSites, and DopeTender.',
    categories: ['Support Hub', 'Infrastructure'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'DOMPurify XSS sanitization',
      'Contact support form (Formsubmit)',
      'Product-specific support pages',
      'Product Updates & Developer Docs pages',
      'CSP + HSTS security headers',
      'Image optimization (98% size reduction)',
    ],
  },
  {
    id: '202603-1',
    month: 'March 2026',
    date: 'March 12, 2026',
    title: 'Support Hub Launch: support.dopetech.ai Goes Live',
    excerpt:
      'Launched the DopeTech Support Hub — a customer-facing help center powered by React 19, Vite 7, Tailwind CSS 4, and Notion as CMS. Features include client-side Pagefind search, prerendered HTML for SEO, automatic sitemap generation, GitHub Actions for deploy and scheduled rebuilds, and the DopeTech dark neon design system.',
    categories: ['Support Hub', 'Platform'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Notion CMS content pipeline',
      'Pagefind client-side search',
      'Prerendered static HTML for SEO',
      'GitHub Actions CI/CD + scheduled rebuilds',
      'Cloudflare Pages deployment',
      '8 support categories wired to Notion database',
    ],
  },
  // --- February 2026 ---
  {
    id: '202602-4',
    month: 'February 2026',
    date: 'February 26, 2026',
    title: 'Website Polish: Blog Images, Favicon & Deploy Fixes',
    excerpt:
      'Updated blog post images and styling across the main dopetech.ai website. Replaced favicon with the official DopeTech logo in SVG, PNG, and Apple touch icon formats. Fixed deploy script configuration.',
    categories: ['Platform'],
    gradient: 'from-[#6366f1]/80 to-[#a855f7]/80',
    features: [
      'Blog images and styling update',
      'New DopeTech favicon (SVG + PNG + Apple touch)',
      'Deploy script fix',
    ],
  },
  {
    id: '202602-3',
    month: 'February 2026',
    date: 'February 24, 2026',
    title: 'Mobile Optimization, Privacy Policy & Claims Audit',
    excerpt:
      'Comprehensive mobile optimization for 390px screens. Added Privacy Policy page. Completed claims audit to fix false or misleading marketing statements. Added DopeTender kiosk carousel and UI polish across all product pages.',
    categories: ['Platform', 'DopeTender'],
    gradient: 'from-dt-cyan/80 to-[#6366f1]/80',
    features: [
      'Mobile optimization (390px screens)',
      'Privacy Policy page',
      'Claims audit and copy corrections',
      'DopeTender kiosk carousel',
      'UI polish across all pages',
    ],
  },
  {
    id: '202602-2',
    month: 'February 2026',
    date: 'February 20, 2026',
    title: 'Comprehensive Site Audit: SEO, Compliance & Copy',
    excerpt:
      'Major site audit covering SEO improvements, compliance copy, and messaging refinement. Replaced react-helmet-async with vanilla DOM-based SEO. Softened ownership language for compliance. Replaced all green accents with DopeTech blue color scheme. Hero headline changed from "Cannabis" to "Dispensary." Performance improvements including code splitting, lazy loading, and GPU optimization.',
    categories: ['Platform', 'DopeSites'],
    gradient: 'from-dt-blue/80 to-dt-cyan/80',
    features: [
      'SEO overhaul with vanilla DOM approach',
      'Compliance messaging refinement',
      'Color scheme: green → blue accent',
      'Hero: "Cannabis" → "Dispensary"',
      'Code splitting & lazy loading',
      '10 new blog posts added',
    ],
  },
  {
    id: '202602-1',
    month: 'February 2026',
    date: 'February 18, 2026',
    title: 'Critical QA Fixes, Social Links & Branding Standardization',
    excerpt:
      'Fixed CTA section issues, page titles, alt text, and support links. Added social media links and phone number to footer. Implemented typing animation with smooth fade transitions. Updated all demo booking links to TidyCal. Standardized branding to "DopeTech" across the entire site.',
    categories: ['Platform'],
    gradient: 'from-[#6366f1]/80 to-dt-blue/80',
    features: [
      'CTA, page title, and alt text fixes',
      'Social media links in footer',
      'Typing animation with fade transitions',
      'TidyCal demo booking integration',
      'Branding standardized to "DopeTech"',
    ],
  },
  {
    id: '202602-0',
    month: 'February 2026',
    date: 'February 16, 2026',
    title: 'Major Branding Update: New Logo & Cyan Accent',
    excerpt:
      'Rolled out the new DopeTech brand identity across the marketing site. New logo and signature cyan accent color (#00e5ff) applied globally.',
    categories: ['Platform'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'New DopeTech logo',
      'Cyan accent color (#00e5ff)',
    ],
  },
  // --- February early ---
  {
    id: '202602-e1',
    month: 'February 2026',
    date: 'February 6, 2026',
    title: 'About Page, Careers Page & Integration Partners',
    excerpt:
      'Launched the About and Careers pages with footer reveal animation. Added integration partner logos to the homepage orbital animation. Visual consistency improvements and missing sections filled in across product pages.',
    categories: ['Platform'],
    gradient: 'from-[#a855f7]/80 to-[#6366f1]/80',
    features: [
      'About page with team info',
      'Careers page with footer reveal animation',
      'Integration partner logos on homepage',
      'Visual consistency across product pages',
    ],
  },
  // --- January 2026 ---
  {
    id: '202601-2',
    month: 'January 2026',
    date: 'January 30, 2026',
    title: 'Product Pages Launch: DopeApps, DopeSites & DopeTender',
    excerpt:
      'Major feature sprint: launched dedicated product pages for all three DopeTech products as standalone routed pages. Also shipped Integrations page with partner profiles, Blog subsection, and solution pages for Adult Use, Medical, Delivery/Curbside, and Multi-Location dispensaries. Added scroll-to-top on navigation and sparkle/shimmer animations.',
    categories: ['DopeApps', 'DopeSites', 'DopeTender', 'Platform'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'DopeApps product page with feature showcase',
      'DopeSites product page',
      'DopeTender subsection with kiosk features',
      'Integrations page with partner profiles',
      'Blog subsection',
      'Adult Use, Medical, Delivery, Multi-Location pages',
      'Scroll-to-top on route navigation',
    ],
  },
  {
    id: '202601-1',
    month: 'January 2026',
    date: 'January 5, 2026',
    title: 'Interactive Demo, Chat Box & New Logo',
    excerpt:
      'Completed the interactive product demo on the marketing site. Fixed the chat box component. Added shimmer effects and updated the logo to the new SVG format.',
    categories: ['Platform'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Interactive product demo',
      'Chat box fix',
      'Shimmer effects',
      'New SVG logo',
    ],
  },
  // --- December 2025 ---
  {
    id: '202512-2',
    month: 'December 2025',
    date: 'December 21, 2025',
    title: 'Mobile API MCP Server for Claude Desktop',
    excerpt:
      'Built a read-only MCP (Model Context Protocol) server for Claude Desktop that enables AI-assisted troubleshooting of the mobile-api backend. Provides access to MongoDB queries, source code search, API documentation, and Sentry error logs.',
    categories: ['Infrastructure', 'DopeApps'],
    gradient: 'from-[#6366f1]/80 to-[#a855f7]/80',
    features: [
      'MCP server for Claude Desktop',
      'MongoDB query access',
      'Source code search',
      'API docs integration',
      'Sentry error log access',
    ],
  },
  {
    id: '202512-1',
    month: 'December 2025',
    date: 'December 11, 2025',
    title: 'DopeTech Website Launch: dopetech.ai Goes Live',
    excerpt:
      'Initial launch of the DopeTech marketing website built with React 19, TypeScript, and Vite 7 on Cloudflare Pages. Featured particle animation system, vector field effects, mobile responsiveness, timeline with scroll-locked stepper, contact form with Slack notifications via Cloudflare Pages Function, and GitHub Actions deployment.',
    categories: ['Platform'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'dopetech.ai goes live',
      'Particle animation system',
      'Vector field effects',
      'Scroll-locked timeline stepper',
      'Contact form with Slack notifications',
      'Cloudflare Pages deployment',
    ],
  },
]

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
]

const CATEGORY_COLORS: Record<string, string> = {
  DopeApps: 'bg-emerald-500',
  DopeSites: 'bg-dt-blue',
  DopeTender: 'bg-amber-500',
  Platform: 'bg-dt-cyan',
  'Support Hub': 'bg-violet-500',
  Infrastructure: 'bg-rose-500',
}

export function ProductUpdatesPage() {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>([])

  const filtered = UPDATES.filter((u) => {
    if (search && !u.title.toLowerCase().includes(search.toLowerCase()) && !u.excerpt.toLowerCase().includes(search.toLowerCase())) return false
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
                href="mailto:support@dopetech.ai"
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
                    <article key={update.id} className="group">
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
                          DopeTech {update.date}
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
                      <div className="rounded-b-2xl border border-t-0 border-white/[0.06] bg-white/[0.02] p-6">
                        {/* Category tags */}
                        <div className="flex flex-wrap items-center gap-3">
                          {update.categories.map((cat) => (
                            <span key={cat} className="flex items-center gap-1.5 text-xs text-dt-text-dim">
                              <span className={cn('h-2 w-2 rounded-full', CATEGORY_COLORS[cat] || 'bg-dt-text-dim')} />
                              {cat.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-dt-text">
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
