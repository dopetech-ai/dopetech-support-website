import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { ContactCTA } from '@/components/common/ContactCTA'
import { getArticleBySlug, getCategoryDef } from '@/lib/content'
import type { Article } from '@/types/article'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getArticleBySlug(slug).then((a) => {
      if (a) {
        setArticle(a)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
  }, [slug])

  if (notFound) return <Navigate to="/404" replace />

  if (loading || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-dt-bg-card" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-dt-bg-card" />
          <div className="h-4 w-32 animate-pulse rounded bg-dt-bg-card" />
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-dt-bg-card"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const categoryDef = getCategoryDef(article.category)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          ...(categoryDef
            ? [{ label: categoryDef.name, href: `/${article.category}` }]
            : []),
          { label: article.title },
        ]}
      />

      {/* Article header */}
      <header className="mb-10">
        <h1 className="font-display text-[length:var(--font-size-h1)] font-bold leading-tight text-dt-text">
          {article.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-dt-text-muted">
          <time dateTime={article.lastEdited}>
            Last updated: {formatDate(article.lastEdited)}
          </time>
          {categoryDef && (
            <>
              <span className="text-dt-text-dim">·</span>
              <span className="rounded-full bg-dt-cyan-muted px-2.5 py-0.5 text-xs font-medium text-dt-cyan">
                {categoryDef.name}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Article body */}
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />

      <ContactCTA />
    </div>
  )
}
