import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '@/config/site'

const footerLinks = {
  Products: [
    { label: 'DopeApps', href: `${SITE_CONFIG.mainSiteUrl}/dopeapps` },
    { label: 'DopeSites', href: `${SITE_CONFIG.mainSiteUrl}/dopesites` },
    { label: 'DopeTender', href: `${SITE_CONFIG.mainSiteUrl}/dopetender` },
  ],
  Company: [
    { label: 'About', href: `${SITE_CONFIG.mainSiteUrl}/about` },
    { label: 'Book a Demo', href: SITE_CONFIG.bookDemoUrl },
    { label: 'Blog', href: `${SITE_CONFIG.mainSiteUrl}/blog` },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-dt-border bg-dt-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src="/dopetech-logo.png"
                alt={SITE_CONFIG.name}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-dt-text-muted">
              Apps. Sites. Kiosks. All DOPE.
            </p>
            <a
              href={SITE_CONFIG.phoneHref}
              className="mt-2 inline-block text-sm text-dt-text-muted transition-colors hover:text-dt-cyan"
            >
              {SITE_CONFIG.phone}
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-dt-text">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-dt-text-muted transition-colors hover:text-dt-text"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-dt-border pt-6 text-center text-xs text-dt-text-dim">
          &copy; {new Date().getFullYear()} Dope Technologies LLC. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}
