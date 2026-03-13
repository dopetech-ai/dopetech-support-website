import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import type { Article } from '@/types/article'

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, '')
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function ArticleListItem({ article }: { article: Article }) {
  const readTime = estimateReadTime(article.html)

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex items-start gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-dt-border hover:bg-dt-bg-card"
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-dt-text-dim transition-colors group-hover:text-dt-cyan" />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-dt-text transition-colors group-hover:text-dt-cyan">
          {article.title}
        </h3>
        {article.metaDescription && (
          <p className="mt-0.5 truncate text-xs text-dt-text-dim">
            {article.metaDescription}
          </p>
        )}
      </div>
      <span className="shrink-0 text-xs text-dt-text-dim">
        {readTime} min read
      </span>
    </Link>
  )
}
