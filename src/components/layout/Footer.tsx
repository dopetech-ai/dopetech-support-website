import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-dt-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer row */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src="/dopetech-logo.png"
              alt={SITE_CONFIG.name}
              className="h-7 w-auto"
            />
          </Link>

          {/* Center links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={SITE_CONFIG.mainSiteUrl}
              className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              dopetech.ai
            </a>
            <a
              href={`${SITE_CONFIG.mainSiteUrl}/blog`}
              className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              Product Updates
            </a>
            <a
              href={SITE_CONFIG.bookDemoUrl}
              className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Demo
            </a>
            <Link
              to="/status"
              className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
            >
              System Status
            </Link>
          </nav>

          {/* Contact CTA */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-dt-cyan/10 to-dt-blue/10 border border-dt-cyan/20 px-5 py-2 text-sm font-medium text-dt-cyan transition-all hover:border-dt-cyan/40 hover:shadow-[0_0_16px_rgba(0,229,255,0.15)]"
          >
            Contact Support
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-5 text-center text-xs text-dt-text-dim">
          &copy; {new Date().getFullYear()} Dope Technologies LLC. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
