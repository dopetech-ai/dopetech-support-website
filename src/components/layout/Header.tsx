import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'
import { cn } from '@/lib/cn'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  // Dynamic page title
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Home',
      '/product-updates': 'Product Updates',
      '/developer-docs': 'Developer Docs',
      '/contact': 'Contact Support',
      '/search': 'Search',
    }
    const page = titles[location.pathname]
    if (page) document.title = `${page} | DopeTech Support Hub`
  }, [location.pathname])

  function toggleMenu() {
    setMenuOpen((prev) => {
      document.body.style.overflow = prev ? '' : 'hidden'
      return !prev
    })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0a1628] backdrop-blur-xl border-b border-dt-blue/20 shadow-[0_4px_30px_rgba(0,136,255,0.12)]'
          : 'bg-[#0a1628] border-b border-dt-blue/20',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group translate-y-[4px]">
            <img
              src="/dopetech-logo.png"
              alt={SITE_CONFIG.name}
              className="h-8 w-auto -translate-y-[9px] transition-all duration-200 opacity-70 group-hover:opacity-100 group-hover:brightness-125"
            />
            <span className="hidden sm:block h-5 w-px bg-white/20 transition-colors duration-200 group-hover:bg-white/50" />
            <span className="hidden sm:block font-montserrat text-sm font-medium tracking-wide text-dt-text-muted transition-colors group-hover:text-dt-text">
              Support Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              to="/"
              className={cn(
                'rounded-full px-4 py-2 text-sm transition-all duration-200',
                location.pathname === '/'
                  ? 'bg-white/[0.08] text-dt-text border border-white/[0.08]'
                  : 'text-dt-text-muted hover:text-dt-text hover:bg-white/[0.05]',
              )}
            >
              Home
            </Link>
            <Link
              to="/product-updates"
              className={cn(
                'rounded-full px-4 py-2 text-sm transition-all duration-200',
                location.pathname === '/product-updates'
                  ? 'bg-white/[0.08] text-dt-text border border-white/[0.08]'
                  : 'text-dt-text-muted hover:text-dt-text hover:bg-white/[0.05]',
              )}
            >
              Product Updates
            </Link>
            <Link
              to="/developer-docs"
              className={cn(
                'rounded-full px-4 py-2 text-sm transition-all duration-200',
                location.pathname === '/developer-docs'
                  ? 'bg-white/[0.08] text-dt-text border border-white/[0.08]'
                  : 'text-dt-text-muted hover:text-dt-text hover:bg-white/[0.05]',
              )}
            >
              Developer Docs
            </Link>
          </nav>

          {/* Search + CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                  setSearchQuery('')
                }
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dt-text-dim" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-44 rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 pl-9 pr-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:w-56 focus:border-dt-cyan/40 focus:bg-white/[0.06] focus:outline-none"
              />
            </form>
            <a
              href={SITE_CONFIG.bookDemoUrl}
              className="relative rounded-full bg-gradient-to-r from-dt-cyan to-dt-blue px-5 py-2 text-sm font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Demo
              <span className="ml-1.5">→</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="relative flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                'absolute h-0.5 w-5 bg-dt-text transition-all duration-200',
                menuOpen ? 'rotate-45' : '-translate-y-1.5',
              )}
            />
            <span
              className={cn(
                'absolute h-0.5 w-5 bg-dt-text transition-opacity duration-200',
                menuOpen && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'absolute h-0.5 w-5 bg-dt-text transition-all duration-200',
                menuOpen ? '-rotate-45' : 'translate-y-1.5',
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 lg:hidden',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="border-t border-white/[0.06] bg-[#080816]/95 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            <Link
              to="/"
              className={cn(
                'rounded-xl px-4 py-3 text-sm transition-colors',
                location.pathname === '/'
                  ? 'bg-white/[0.08] text-dt-text'
                  : 'text-dt-text-muted hover:bg-white/[0.05] hover:text-dt-text',
              )}
            >
              Home
            </Link>
            <Link
              to="/product-updates"
              className={cn(
                'rounded-xl px-4 py-3 text-sm transition-colors',
                location.pathname === '/product-updates'
                  ? 'bg-white/[0.08] text-dt-text'
                  : 'text-dt-text-muted hover:bg-white/[0.05] hover:text-dt-text',
              )}
            >
              Product Updates
            </Link>
            <Link
              to="/developer-docs"
              className={cn(
                'rounded-xl px-4 py-3 text-sm transition-colors',
                location.pathname === '/developer-docs'
                  ? 'bg-white/[0.08] text-dt-text'
                  : 'text-dt-text-muted hover:bg-white/[0.05] hover:text-dt-text',
              )}
            >
              Developer Docs
            </Link>
            <a
              href={SITE_CONFIG.bookDemoUrl}
              className="mt-2 rounded-xl bg-gradient-to-r from-dt-cyan to-dt-blue px-4 py-3 text-center text-sm font-semibold text-dt-bg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Demo →
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
