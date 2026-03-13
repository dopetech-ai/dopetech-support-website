import { Link } from 'react-router-dom'
import type { Category } from '@/types/article'
import type { CategoryDef } from '@/config/site'
import { getIcon } from '@/lib/icons'

export function CategoryCard({
  category,
  def,
}: {
  category: Category
  def: CategoryDef
}) {
  const Icon = getIcon(def.icon)

  return (
    <Link
      to={`/${category.slug}`}
      className="group rounded-2xl border border-dt-border bg-dt-bg-card p-6 transition-all hover:border-dt-border-accent hover:bg-dt-bg-card-hover hover:shadow-[0_0_24px_rgba(0,229,255,0.08)]"
    >
      <div className="mb-3 inline-flex rounded-xl bg-dt-cyan-muted p-2.5">
        <Icon className="h-5 w-5 text-dt-cyan" />
      </div>
      <h2 className="font-display text-lg font-semibold text-dt-text">
        {category.name}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-dt-text-muted">
        {def.description}
      </p>
      <p className="mt-3 text-xs text-dt-text-dim">
        {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
      </p>
    </Link>
  )
}
