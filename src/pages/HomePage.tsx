import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
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

  useEffect(() => {
    getCategories().then(setCategories)
    getArticles().then((a) => setArticles(a.slice(0, 8)))
  }, [])

  const primaryCategories = categories.slice(0, 4)
  const secondaryCategories = categories.slice(4)

  return (
    <>
      {/* Hero — atmospheric gradient backdrop */}
      <section className="relative overflow-hidden px-4 pb-28 pt-32 sm:px-6 lg:px-8">
        {/* Layered gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.06] blur-[150px]" />
          <div className="absolute right-0 top-1/4 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-dt-blue/[0.04] blur-[130px]" />
          {/* Floating orbs for depth */}
          <div className="absolute left-[10%] top-[60%] h-2 w-2 rounded-full bg-dt-cyan/30 animate-float" />
          <div className="absolute right-[15%] top-[30%] h-1.5 w-1.5 rounded-full bg-dt-blue/40 animate-float-delay" />
          <div className="absolute left-[60%] top-[20%] h-1 w-1 rounded-full bg-dt-cyan/20 animate-float-delay-2" />
        </div>

        <div className="mx-auto max-w-4xl">
          <h1 className="animate-fade-up font-heading text-[length:var(--font-size-hero)] font-bold leading-tight text-dt-text">
            Need help? Start
            <span className="bg-gradient-to-r from-dt-cyan to-dt-blue bg-clip-text text-transparent"> here</span>.
          </h1>
          <p className="animate-fade-up-delay-1 mt-4 max-w-xl text-lg text-dt-text-muted">
            Search our guides and FAQs to get the most out of DopeTech products.
          </p>

          {/* Search bar with gradient button */}
          <div className="animate-fade-up-delay-2 mt-8 flex">
            <SearchInput
              size="large"
              className="flex-1 [&_input]:rounded-r-none [&_input]:border-r-0"
            />
            <button className="shrink-0 rounded-r-xl bg-gradient-to-r from-dt-cyan to-dt-blue px-8 text-base font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110">
              Search
            </button>
          </div>

          {/* Popular searches */}
          <div className="animate-fade-up-delay-3 mt-6 flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-medium text-dt-text-dim">
              Popular searches :
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <span
                key={term}
                className="cursor-pointer rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm text-dt-text-muted transition-all duration-200 hover:border-dt-cyan/30 hover:bg-dt-cyan/[0.08] hover:text-dt-cyan"
              >
                {term}
              </span>
            ))}
          </div>
        </div>

        {/* Products row */}
        <div className="mx-auto mt-20 flex max-w-4xl items-center justify-center gap-20 sm:gap-28">
          {[
            { name: 'DopeApps', Icon: SmartphoneIcon, desc: 'Mobile Apps', to: '/dopeapps', delay: 'animate-float' },
            { name: 'DopeSites', Icon: LaptopIcon, desc: 'Websites', to: '/dopesites', delay: 'animate-float-delay' },
            { name: 'DopeTender', Icon: KioskIcon, desc: 'Kiosks', to: '/dopetender', delay: 'animate-float-delay-2' },
          ].map((product) => (
            <Link
              key={product.name}
              to={product.to}
              className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
            >
              <div className={product.delay}>
                <product.Icon className="h-28 w-28 text-dt-text-muted transition-colors duration-300 group-hover:text-dt-cyan drop-shadow-[0_0_12px_rgba(0,229,255,0.08)] group-hover:drop-shadow-[0_0_24px_rgba(0,229,255,0.25)]" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-dt-text transition-colors group-hover:text-dt-cyan">
                  {product.name}
                </span>
                <span className="block text-xs text-dt-text-dim">
                  {product.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Get started — 4 column grid */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute -left-40 top-0 h-[300px] w-[300px] rounded-full bg-dt-blue/[0.03] blur-[100px]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
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
            <div className="absolute -right-10 top-0 h-[600px] w-[600px] rounded-full bg-dt-cyan/[0.12] blur-[160px]" />
            <div className="absolute -left-10 bottom-0 h-[550px] w-[550px] rounded-full bg-dt-blue/[0.10] blur-[140px]" />
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366f1]/[0.07] blur-[150px]" />
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
        <section className="relative border-t border-white/[0.04] bg-gradient-to-b from-white/[0.015] to-transparent py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading mb-8 text-[length:var(--font-size-h1)] font-bold text-dt-text">
            Popular articles
          </h2>
          <div className="space-y-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 transition-all duration-200 hover:border-dt-cyan/20 hover:bg-white/[0.04]"
              >
                <span className="text-base font-medium text-dt-text transition-colors duration-200 group-hover:text-dt-cyan">
                  {article.title}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-dt-text-dim transition-all duration-200 group-hover:-rotate-90 group-hover:text-dt-cyan" />
              </Link>
            ))}
          </div>
          </div>
        </section>
      )}
    </>
  )
}
