import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Wrench, Activity } from 'lucide-react'
import { cn } from '@/lib/cn'
import { setSeo } from '@/lib/seo'

interface ServiceStatus {
  name: string
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance'
  message: string
}

interface Incident {
  name: string
  status: string
  message: string
  date: string
}

interface StatusData {
  services: ServiceStatus[]
  incidents: Incident[]
  lastUpdated: string
}

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  Operational: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400', label: 'Operational' },
  'Degraded Performance': { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400', label: 'Degraded' },
  'Partial Outage': { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400', label: 'Partial Outage' },
  'Major Outage': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400', label: 'Major Outage' },
  Maintenance: { icon: Wrench, color: 'text-dt-blue', bg: 'bg-dt-blue', label: 'Maintenance' },
}

function getOverallStatus(services: ServiceStatus[]): string {
  if (services.some((s) => s.status === 'Major Outage')) return 'Major Outage'
  if (services.some((s) => s.status === 'Partial Outage')) return 'Partial Outage'
  if (services.some((s) => s.status === 'Degraded Performance')) return 'Degraded Performance'
  if (services.some((s) => s.status === 'Maintenance')) return 'Maintenance'
  return 'Operational'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null)

  useEffect(() => {
    setSeo({
      title: 'System Status',
      description: 'Current operational status of DopeTech services including DopeApps, DopeSites, DopeTender, Admin Panel, and API.',
      path: '/status',
    })

    import('@/data/status.json')
      .then((mod) => setData(mod.default as StatusData))
      .catch(() => {
        // No status data available
        setData({
          services: [
            { name: 'DopeApps (Mobile App)', status: 'Operational', message: '' },
            { name: 'DopeSites (Web Storefronts)', status: 'Operational', message: '' },
            { name: 'DopeTender (Kiosk)', status: 'Operational', message: '' },
            { name: 'Admin Panel', status: 'Operational', message: '' },
            { name: 'API & Menu Sync', status: 'Operational', message: '' },
            { name: 'Push Notifications', status: 'Operational', message: '' },
          ],
          incidents: [],
          lastUpdated: new Date().toISOString(),
        })
      })
  }, [])

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-dt-bg-card" />
          ))}
        </div>
      </div>
    )
  }

  const overall = getOverallStatus(data.services)
  const overallConfig = STATUS_CONFIG[overall]
  const OverallIcon = overallConfig.icon

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.04] blur-[120px]" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-[length:var(--font-size-h1)] font-bold text-dt-text">
            System Status
          </h1>

          {/* Overall status banner */}
          <div className={cn(
            'mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium',
            overall === 'Operational'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : overall === 'Major Outage'
                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400',
          )}>
            <OverallIcon className="h-4 w-4" />
            {overall === 'Operational'
              ? 'All Systems Operational'
              : `System Status: ${overallConfig.label}`}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {data.services.map((service) => {
            const config = STATUS_CONFIG[service.status] || STATUS_CONFIG.Operational
            const Icon = config.icon
            return (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-dt-text-dim" />
                  <div>
                    <p className="text-sm font-medium text-dt-text">{service.name}</p>
                    {service.message && (
                      <p className="mt-0.5 text-xs text-dt-text-muted">{service.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-medium', config.color)}>
                    {config.label}
                  </span>
                  <Icon className={cn('h-4 w-4', config.color)} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Incidents */}
      {data.incidents.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="font-heading mb-4 text-lg font-semibold text-dt-text">
            Recent Incidents
          </h2>
          <div className="space-y-3">
            {data.incidents.map((incident, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-dt-text">{incident.name}</p>
                  <span className="text-xs text-dt-text-dim">{incident.date}</span>
                </div>
                {incident.message && (
                  <p className="mt-1 text-sm text-dt-text-muted">{incident.message}</p>
                )}
                <span className={cn(
                  'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                  incident.status === 'Resolved'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-yellow-500/10 text-yellow-400',
                )}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Last updated */}
      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-dt-text-dim">
          Last updated: {formatDate(data.lastUpdated)}
        </p>
      </div>
    </>
  )
}
