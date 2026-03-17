import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { ArticleListItem } from '@/components/common/ArticleListItem'
import { ContactCTA } from '@/components/common/ContactCTA'
import { getArticlesByCategory, getCategoryDef } from '@/lib/content'
import { getIcon } from '@/lib/icons'
import type { Article } from '@/types/article'

export function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const def = category ? getCategoryDef(category) : undefined

  useEffect(() => {
    if (!category || !def) return
    document.title = `${def.name} | DopeTech Support Hub`
    getArticlesByCategory(category).then((a) => {
      setArticles(a)
      setLoading(false)
    })
  }, [category, def])

  if (!def) return <Navigate to="/404" replace />

  const Icon = getIcon(def.icon)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: def.name }]} />

      {/* Category header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-xl bg-dt-cyan-muted p-3">
          <Icon className="h-6 w-6 text-dt-cyan" />
        </div>
        <div>
          <h1 className="font-heading text-[length:var(--font-size-h1)] font-bold text-dt-text">
            {def.name}
          </h1>
          <p className="mt-1 text-dt-text-muted">{def.description}</p>
        </div>
      </div>

      {/* Article list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-dt-bg-card"
            />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-1">
          {articles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-dt-text-muted">
          No articles in this category yet.
        </p>
      )}

      <ContactCTA />
    </div>
  )
}
