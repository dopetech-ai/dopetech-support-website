import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import DOMPurify from 'dompurify'
import { SearchInput } from '@/components/common/SearchInput'
import { SmartphoneIcon, LaptopIcon, KioskIcon } from '@/components/common/ProductIcons'
import { CategoryCard } from '@/components/common/CategoryCard'
import { getCategories, getArticles, getCategoryDef } from '@/lib/content'
import type { Category, Article } from '@/types/article'

const POPULAR_SEARCHES = [
  'Push Notifications',
  'Admin Panel',
  'Integrations',
  'Compliance',
]

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories().then(setCategories)
    getArticles().then((a) => setArticles(a.slice(0, 8)))
  }, [])

  const primaryCategories = categories.slice(0, 4)
  const secondaryCategories = categories.slice(4)

  return (
    <>
      {/* Hero — atmospheric gradient backdrop */}
      <section className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        {/* Layered gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.12] blur-[150px]" />
          <div className="absolute right-0 top-1/4 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-dt-blue/[0.08] blur-[130px]" />
          <div className="absolute left-[5%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-dt-pink/[0.05] blur-[120px]" />
          {/* Floating orbs for depth */}
          <div className="absolute left-[10%] top-[60%] h-2.5 w-2.5 rounded-full bg-dt-cyan/50 animate-float" />
          <div className="absolute right-[15%] top-[30%] h-2 w-2 rounded-full bg-dt-blue/60 animate-float-delay" />
          <div className="absolute left-[60%] top-[20%] h-1.5 w-1.5 rounded-full bg-dt-pink/40 animate-float-delay-2" />
        </div>

        <div className="mx-auto max-w-4xl">
          <h1 className="animate-fade-up font-heading text-[length:var(--font-size-hero)] font-bold leading-tight text-dt-text">
            Need help? Start
            <span className="shimmer-text"> here</span>.
          </h1>
          <p className="animate-fade-up-delay-1 mt-4 max-w-xl text-lg text-dt-text-muted">
            Search our guides and FAQs to get the most out of DopeTech products.
          </p>

          {/* Search bar with gradient button */}
          <div className="animate-fade-up-delay-2 mt-8 flex">
            <SearchInput
              size="large"
              className="flex-1 [&_input]:rounded-r-none [&_input]:border-r-0"
              onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
            />
            <button
              onClick={() => {
                const input = document.querySelector('.search-container input') as HTMLInputElement | null
                const value = input?.value?.trim()
                if (value) navigate(`/search?q=${encodeURIComponent(value)}`)
              }}
              className="shrink-0 rounded-r-xl bg-gradient-to-r from-dt-cyan to-dt-blue px-8 text-base font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110"
            >
              Search
            </button>
          </div>

          {/* Popular searches */}
          <div className="animate-fade-up-delay-3 mt-6 flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-medium text-dt-text-dim">
              Popular searches :
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="cursor-pointer rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-1.5 text-sm text-dt-text-muted transition-all duration-200 hover:border-dt-cyan/40 hover:bg-dt-cyan/[0.12] hover:text-dt-cyan hover:shadow-[0_0_12px_rgba(0,229,255,0.15)]"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Products row */}
        <div className="mx-auto mt-16 flex max-w-4xl items-center justify-center gap-20 sm:gap-28">
          {[
            { name: 'DopeApps', Icon: SmartphoneIcon, desc: 'Mobile Apps', to: '/dopeapps' },
            { name: 'DopeSites', Icon: LaptopIcon, desc: 'Websites', to: '/dopesites' },
            { name: 'DopeTender', Icon: KioskIcon, desc: 'Kiosks', to: '/dopetender' },
          ].map((product) => (
            <Link
              key={product.name}
              to={product.to}
              className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition-all duration-300 group-hover:border-dt-cyan/30 group-hover:bg-dt-cyan/[0.06] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]">
                <product.Icon className="h-28 w-28 text-dt-text-muted transition-colors duration-300 group-hover:text-dt-cyan drop-shadow-[0_0_12px_rgba(0,229,255,0.1)] group-hover:drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-dt-text transition-colors group-hover:text-dt-cyan">
                  {product.name}
                </span>
                <span className="block text-xs text-dt-text-muted">
                  {product.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Get started — 4 column grid */}
      <section className="relative pt-4 pb-20">
        <div className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-dt-blue/[0.08] blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-dt-cyan/[0.05] blur-[100px]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-heading text-[length:var(--font-size-h1)] font-bold text-dt-text">
              Get started with DopeTech
            </h2>
            <Link to="/contact" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright">
              Need help? <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {primaryCategories.map((cat) => {
              const def = getCategoryDef(cat.slug)
              if (!def) return null
              return <CategoryCard key={cat.slug} category={cat} def={def} />
            })}
          </div>
        </div>
      </section>

      {/* More resources — 3 column grid */}
      {secondaryCategories.length > 0 && (
        <section className="relative py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-10 top-0 h-[600px] w-[600px] rounded-full bg-dt-cyan/[0.16] blur-[160px]" />
            <div className="absolute -left-10 bottom-0 h-[550px] w-[550px] rounded-full bg-dt-blue/[0.14] blur-[140px]" />
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366f1]/[0.10] blur-[150px]" />
          </div>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading mb-8 text-[length:var(--font-size-h1)] font-bold text-dt-text">
              More resources
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {secondaryCategories.map((cat) => {
                const def = getCategoryDef(cat.slug)
                if (!def) return null
                return <CategoryCard key={cat.slug} category={cat} def={def} />
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular articles — accordion style */}
      {articles.length > 0 && (
        <section className="relative border-t border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading mb-8 text-[length:var(--font-size-h1)] font-bold text-dt-text">
            Popular articles
          </h2>
          <div className="space-y-3">
            {articles.map((article) => {
              const isExpanded = expandedArticle === article.id
              return (
                <div key={article.id} className="rounded-2xl border border-white/[0.12] bg-white/[0.06] transition-all duration-200 hover:border-dt-cyan/30 hover:bg-white/[0.10] hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]">
                  <button
                    onClick={() => setExpandedArticle(isExpanded ? null : article.id)}
                    className="group flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-base font-medium text-dt-text transition-colors duration-200 group-hover:text-dt-cyan">
                      {article.title}
                    </span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-dt-text-dim transition-all duration-200 group-hover:text-dt-cyan ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-white/[0.06] px-6 py-6">
                      <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.html) }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          </div>
        </section>
      )}
    </>
  )
}
