import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
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
      <section className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Layered gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Primary cyan glow */}
          <div className="absolute left-1/3 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.06] blur-[150px]" />
          {/* Blue accent glow */}
          <div className="absolute right-0 top-1/4 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-dt-blue/[0.04] blur-[130px]" />
          {/* Subtle bottom edge gradient */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-dt-cyan/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl">
          <h1 className="font-heading text-[length:var(--font-size-hero)] font-bold leading-tight text-dt-text">
            How can we help
            <span className="bg-gradient-to-r from-dt-cyan to-dt-blue bg-clip-text text-transparent"> you</span>?
          </h1>
          <p className="mt-4 max-w-xl text-lg text-dt-text-muted">
            Search our guides and FAQs to get the most out of DopeTech products.
          </p>

          {/* Search bar with gradient button */}
          <div className="mt-8 flex">
            <SearchInput
              size="large"
              className="flex-1 [&_input]:rounded-r-none [&_input]:border-r-0"
            />
            <button className="shrink-0 rounded-r-xl bg-gradient-to-r from-dt-cyan to-dt-blue px-8 text-base font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110">
              Search
            </button>
          </div>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
      </section>

      {/* Get started — 4 column grid */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-heading mb-8 text-[length:var(--font-size-h1)] font-bold text-dt-text">
          Get started with DopeTech
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {primaryCategories.map((cat) => {
            const def = getCategoryDef(cat.slug)
            if (!def) return null
            return <CategoryCard key={cat.slug} category={cat} def={def} />
          })}
        </div>
      </section>

      {/* More resources — 3 column grid */}
      {secondaryCategories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
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
        </section>
      )}

      {/* Popular articles — accordion style */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
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
        </section>
      )}
    </>
  )
}
