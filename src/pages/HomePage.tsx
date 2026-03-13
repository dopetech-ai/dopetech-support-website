import { useEffect, useState } from 'react'
import { SearchInput } from '@/components/common/SearchInput'
import { CategoryCard } from '@/components/common/CategoryCard'
import { ContactCTA } from '@/components/common/ContactCTA'
import { getCategories, getCategoryDef } from '@/lib/content'
import type { Category } from '@/types/article'

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-dt-cyan/[0.04] blur-[120px]" />
        </div>

        <h1 className="font-display text-[length:var(--font-size-hero)] font-bold leading-tight text-dt-text">
          How can we help you?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-dt-text-muted">
          Search our guides and FAQs to get the most out of DopeTech products.
        </p>

        <SearchInput
          size="large"
          className="mx-auto mt-8 max-w-2xl"
        />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const def = getCategoryDef(cat.slug)
            if (!def) return null
            return <CategoryCard key={cat.slug} category={cat} def={def} />
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <ContactCTA />
      </div>
    </>
  )
}
