import { Link } from 'react-router-dom'
import { SearchInput } from '@/components/common/SearchInput'
import { CATEGORIES } from '@/config/site'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-heading text-6xl font-bold text-dt-cyan">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-dt-text">
        Page not found
      </h1>
      <p className="mt-2 text-dt-text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <SearchInput className="mx-auto mt-8 max-w-md" />

      <div className="mt-10">
        <p className="mb-4 text-sm font-medium text-dt-text-muted">
          Browse by category
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="rounded-full border border-dt-border px-4 py-1.5 text-sm text-dt-text-muted transition-all hover:border-dt-cyan/30 hover:text-dt-cyan"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
