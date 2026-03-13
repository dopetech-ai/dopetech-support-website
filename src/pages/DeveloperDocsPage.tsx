import { Code2, Terminal, Webhook, Wrench } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'

export function DeveloperDocsPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dt-blue/[0.06] blur-[150px]" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-dt-cyan/[0.04] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        {/* Animated terminal icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <Terminal className="h-10 w-10 text-dt-cyan" />
        </div>

        <h1 className="font-heading text-[length:var(--font-size-hero)] font-bold text-dt-text">
          Developer Docs
        </h1>

        <p className="mt-4 text-lg text-dt-text-muted">
          Our API documentation is getting the{' '}
          <span className="bg-gradient-to-r from-dt-cyan to-dt-blue bg-clip-text text-transparent font-semibold">
            DOPE treatment
          </span>
          . We're building something worth waiting for.
        </p>

        <p className="mt-2 text-dt-text-dim">
          REST API, webhooks, SDKs, and more — coming soon.
        </p>

        {/* Feature preview cards */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Code2, label: 'REST API' },
            { icon: Webhook, label: 'Webhooks' },
            { icon: Terminal, label: 'SDKs' },
            { icon: Wrench, label: 'CLI Tools' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4"
            >
              <Icon className="mx-auto h-5 w-5 text-dt-text-dim" />
              <p className="mt-2 text-xs font-medium text-dt-text-dim">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${SITE_CONFIG.email}?subject=Developer%20Docs%20Interest`}
            className="inline-flex rounded-full bg-gradient-to-r from-dt-cyan to-dt-blue px-6 py-2.5 text-sm font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110"
          >
            Notify me when it's ready →
          </a>
          <a
            href={SITE_CONFIG.mainSiteUrl}
            className="inline-flex rounded-full border border-white/[0.08] px-6 py-2.5 text-sm font-medium text-dt-text-muted transition-all hover:border-white/[0.15] hover:text-dt-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Back to dopetech.ai
          </a>
        </div>

        {/* Cheeky footer note */}
        <p className="mt-16 font-mono text-xs text-dt-text-dim">
          <span className="text-dt-cyan">$</span> curl api.dopetech.ai/v1/docs
          <br />
          <span className="text-dt-text-dim">→ {"{"} "status": "brewing", "eta": "soon™" {"}"}</span>
        </p>
      </div>
    </div>
  )
}
