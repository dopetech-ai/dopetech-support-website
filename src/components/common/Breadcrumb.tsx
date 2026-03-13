import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-dt-text-muted">
        <li>
          <Link to="/" className="transition-colors hover:text-dt-text">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-dt-text-dim" />
            {item.href ? (
              <Link
                to={item.href}
                className="transition-colors hover:text-dt-text"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-dt-text">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
