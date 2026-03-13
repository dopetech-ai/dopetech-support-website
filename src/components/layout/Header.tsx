import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SITE_CONFIG } from '@/config/site'
import { cn } from '@/lib/cn'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-dt-bg/90 backdrop-blur-md border-b border-dt-border'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/dopetech-logo.png"
              alt={SITE_CONFIG.name}
              className="h-8 w-auto"
            />
            <span className="text-sm font-medium text-dt-text-muted">
              Support
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
            >
              Home
            </Link>
            <a
              href={SITE_CONFIG.mainSiteUrl}
              className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              dopetech.ai
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-dt-cyan/30 px-4 py-1.5 text-sm font-medium text-dt-cyan transition-all hover:border-dt-cyan/60 hover:shadow-[0_0_12px_rgba(0,229,255,0.2)]"
            >
              Contact Support
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="relative flex h-10 w-10 items-center justify-center md:hidden"
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
      {menuOpen && (
        <div className="border-t border-dt-border bg-dt-bg/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-dt-text-muted transition-colors hover:bg-dt-bg-elevated hover:text-dt-text"
            >
              Home
            </Link>
            <a
              href={SITE_CONFIG.mainSiteUrl}
              className="rounded-lg px-3 py-2 text-dt-text-muted transition-colors hover:bg-dt-bg-elevated hover:text-dt-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              dopetech.ai
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="mt-2 rounded-lg border border-dt-cyan/30 px-3 py-2 text-center text-sm font-medium text-dt-cyan"
            >
              Contact Support
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
