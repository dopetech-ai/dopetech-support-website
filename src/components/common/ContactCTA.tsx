import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'

export function ContactCTA() {
  return (
    <section className="mt-16 rounded-2xl border border-dt-border bg-dt-bg-card p-8 text-center">
      <h2 className="font-heading text-xl font-semibold text-dt-text">
        Still need help?
      </h2>
      <p className="mt-2 text-sm text-dt-text-muted">
        Our support team is here for you.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-dt-cyan/30 px-6 py-2.5 text-sm font-medium text-dt-cyan transition-all hover:border-dt-cyan/60 hover:shadow-[0_0_16px_rgba(0,229,255,0.2)]"
        >
          <Mail className="h-4 w-4" />
          Contact Support
        </Link>
        <a
          href={SITE_CONFIG.phoneHref}
          className="inline-flex items-center gap-2 rounded-full border border-dt-border px-6 py-2.5 text-sm font-medium text-dt-text-muted transition-all hover:border-dt-text-dim hover:text-dt-text"
        >
          <Phone className="h-4 w-4" />
          {SITE_CONFIG.phone}
        </a>
      </div>
    </section>
  )
}
