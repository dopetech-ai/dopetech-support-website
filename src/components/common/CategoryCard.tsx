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
      className="group rounded-2xl border border-dt-border bg-dt-bg-card p-6 pb-8 transition-all hover:border-dt-border-accent hover:bg-dt-bg-card-hover hover:shadow-[0_0_24px_rgba(0,229,255,0.08)]"
    >
      <div className="mb-4 inline-flex rounded-xl border border-dt-border bg-dt-bg-elevated p-3 transition-colors group-hover:border-dt-cyan/30">
        <Icon className="h-6 w-6 text-dt-text-muted transition-colors group-hover:text-dt-cyan" />
      </div>
      <h2 className="font-heading text-base font-semibold text-dt-text">
        {category.name}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dt-text-muted">
        {def.description}
      </p>
    </Link>
  )
}
