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
      className="group rounded-2xl border border-white/[0.12] bg-dt-bg-card p-6 pb-8 transition-all hover:border-dt-cyan/40 hover:bg-dt-bg-card-hover hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]"
    >
      <div className="mb-4 inline-flex rounded-xl border border-white/[0.10] bg-dt-cyan/[0.06] p-3 transition-colors group-hover:border-dt-cyan/40 group-hover:bg-dt-cyan/[0.12]">
        <Icon className="h-6 w-6 text-dt-cyan/70 transition-colors group-hover:text-dt-cyan" />
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
