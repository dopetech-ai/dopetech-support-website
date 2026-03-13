import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchInputProps {
  size?: 'default' | 'large'
  className?: string
}

export function SearchInput({ size = 'default', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-dt-text-dim',
          size === 'large' ? 'h-5 w-5 left-4' : 'h-4 w-4',
        )}
      />
      <input
        type="search"
        placeholder="Search articles..."
        className={cn(
          'w-full rounded-xl border border-dt-border bg-dt-bg-elevated text-dt-text placeholder:text-dt-text-dim transition-all',
          'focus:border-dt-cyan/50 focus:outline-none focus:ring-1 focus:ring-dt-cyan/30 focus:shadow-[0_0_12px_rgba(0,229,255,0.15)]',
          size === 'large'
            ? 'py-4 pl-12 pr-4 text-lg'
            : 'py-2.5 pl-10 pr-4 text-sm',
        )}
        id="search-input"
      />
    </div>
  )
}
