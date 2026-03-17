import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getArticlesByCategory, getCategoryDef } from '@/lib/content'
import type { Article } from '@/types/article'

interface RelatedArticlesProps {
  currentSlug: string
  category: string
}

export function RelatedArticles({ currentSlug, category }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    getArticlesByCategory(category).then((all) => {
      setArticles(all.filter((a) => a.slug !== currentSlug).slice(0, 5))
    })
  }, [currentSlug, category])

  const categoryDef = getCategoryDef(category)

  if (articles.length === 0) return null

  return (
    <section className="mt-12">
      <h3 className="font-heading text-lg font-semibold text-dt-text">
        Related articles in {categoryDef?.name ?? category}
      </h3>
      <div className="mt-4 space-y-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 transition-all duration-200 hover:border-dt-cyan/20 hover:bg-white/[0.04]"
          >
            <span className="text-sm font-medium text-dt-text-muted transition-colors group-hover:text-dt-cyan">
              {article.title}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-dt-text-dim transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-dt-cyan" />
          </Link>
        ))}
      </div>
    </section>
  )
}
