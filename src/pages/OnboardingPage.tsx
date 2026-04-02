import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { setSeo } from '@/lib/seo'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { cn } from '@/lib/cn'
import {
  Rocket, CheckCircle2, ChevronRight,
  Download, Key, Plug, Palette, ShoppingCart,
  Bell, Shield, Users, Smartphone, Globe, Monitor,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Product = 'dopeapps' | 'dopesites' | 'dopetender'

interface ProductFilter {
  id: Product
  name: string
  icon: LucideIcon
}

const PRODUCTS: ProductFilter[] = [
  { id: 'dopeapps', name: 'Mobile App', icon: Smartphone },
  { id: 'dopesites', name: 'Website', icon: Globe },
  { id: 'dopetender', name: 'Self-Service Kiosk', icon: Monitor },
]

interface Step {
  number: number
  icon: LucideIcon
  title: string
  description: string
  details: string[]
  products: Product[]
}

const ONBOARDING_STEPS: Step[] = [
  {
    number: 1,
    icon: Key,
    title: 'Access your admin panel',
    description: 'Log in with the credentials we sent after signup. This is where you manage everything.',
    details: [
      'Check your email for your admin login link',
      'Set a strong password and enable two-factor authentication',
      'Familiarize yourself with the dashboard layout',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
  {
    number: 2,
    icon: Plug,
    title: 'Connect your POS',
    description: 'Link your point-of-sale system so your menu, inventory, and pricing stay in sync automatically.',
    details: [
      'Navigate to Settings > Integrations in your admin panel',
      'Select your POS provider and enter your API credentials',
      'Run a test sync to confirm products are pulling correctly',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
  {
    number: 3,
    icon: Palette,
    title: 'Set up your branding',
    description: 'Upload your logo, choose your colors, and configure your splash screen to match your dispensary.',
    details: [
      'Upload a high-resolution logo (PNG, at least 512x512)',
      'Set your primary and secondary brand colors',
      'Preview how your branding looks across different screens',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
  {
    number: 4,
    icon: ShoppingCart,
    title: 'Configure your menu',
    description: 'Organize your product categories, set featured items, and customize how your menu displays.',
    details: [
      'Review auto-imported categories from your POS',
      'Reorder or rename categories to match your store layout',
      'Set featured products and promotional banners',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
  {
    number: 5,
    icon: Bell,
    title: 'Enable push notifications',
    description: 'Set up push notification credentials so you can reach your customers with deals and updates.',
    details: [
      'Upload your APNs certificate (iOS) or Firebase key (Android)',
      'Send a test notification to verify delivery',
      'Create your first welcome campaign for new subscribers',
    ],
    products: ['dopeapps'],
  },
  {
    number: 6,
    icon: Shield,
    title: 'Review compliance settings',
    description: 'Make sure age verification, disclaimers, and store policies are configured for your state.',
    details: [
      'Enable the age gate with your state-required messaging',
      'Add required legal disclaimers and terms of service',
      'Verify your store hours and location info are accurate',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
  {
    number: 7,
    icon: Users,
    title: 'Invite your team',
    description: 'Add team members with the right permissions so your staff can manage day-to-day operations.',
    details: [
      'Go to Settings > Team Members',
      'Assign roles (Admin, Manager, or Staff) based on responsibilities',
      'Each member receives their own login credentials via email',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
  {
    number: 8,
    icon: Download,
    title: 'Go live',
    description: 'Submit your app for review, launch your site, or power on your kiosk. You are ready.',
    details: [
      'Run through the pre-launch checklist in your admin panel',
      'Submit for App Store / Google Play review (mobile app) or publish your site',
      'Share your live link with customers and start promoting',
    ],
    products: ['dopeapps', 'dopesites', 'dopetender'],
  },
]

export function OnboardingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialProduct = searchParams.get('product') as Product | null
  const [selected, setSelected] = useState<Product | null>(
    initialProduct && PRODUCTS.some((p) => p.id === initialProduct) ? initialProduct : null
  )

  useEffect(() => {
    setSeo({
      title: 'Getting Started',
      description: 'Step-by-step onboarding guide for DopeApps, DopeSites, and DopeTender. Get set up and running fast.',
      path: '/getting-started',
    })
  }, [])

  function handleSelect(id: Product) {
    const next = selected === id ? null : id
    setSelected(next)
    if (next) {
      setSearchParams({ product: next }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  function isRelevant(step: Step) {
    if (!selected) return true
    return step.products.includes(selected)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.05] blur-[120px]" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Getting Started' }]} />
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-dt-cyan/10">
              <Rocket className="h-7 w-7 text-dt-cyan" />
            </div>
            <div>
              <h1 className="font-heading text-[length:var(--font-size-h1)] font-bold text-dt-text">
                Getting Started
              </h1>
              <p className="mt-1 text-dt-text-muted">
                Everything you need to go from signup to live, step by step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product filter */}
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <p className="mb-3 text-sm font-medium text-dt-text-muted">
          Filter by product
        </p>
        <div className="flex flex-wrap gap-3">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200',
                selected === product.id
                  ? 'bg-dt-cyan/15 text-dt-cyan border border-dt-cyan/30'
                  : 'bg-white/[0.03] text-dt-text-muted border border-white/[0.08] hover:bg-white/[0.06] hover:text-dt-text',
              )}
            >
              <product.icon className={cn(
                'h-4.5 w-4.5 transition-colors',
                selected === product.id ? 'text-dt-cyan' : 'text-dt-text-dim',
              )} />
              {product.name}
            </button>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/[0.06] sm:left-7" />

          <div className="space-y-8">
            {ONBOARDING_STEPS.map((step) => {
              const relevant = isRelevant(step)
              return (
                <div
                  key={step.number}
                  className={cn(
                    'group relative flex gap-6 transition-all duration-300',
                    !relevant && 'opacity-20 pointer-events-none',
                  )}
                >
                  {/* Step number circle */}
                  <div className={cn(
                    'relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-dt-bg-card text-sm font-bold transition-colors sm:h-14 sm:w-14',
                    relevant
                      ? 'border-white/[0.08] text-dt-text-muted group-hover:border-dt-cyan/30 group-hover:text-dt-cyan'
                      : 'border-white/[0.04] text-dt-text-dim',
                  )}>
                    {step.number}
                  </div>

                  {/* Content card */}
                  <div className={cn(
                    'flex-1 rounded-2xl border p-6 transition-all duration-200',
                    relevant
                      ? 'border-white/[0.06] bg-white/[0.02] group-hover:border-white/[0.1] group-hover:bg-white/[0.04]'
                      : 'border-white/[0.03] bg-white/[0.01]',
                  )}>
                    <div className="flex items-start gap-4">
                      <step.icon className={cn(
                        'mt-0.5 h-5 w-5 shrink-0 transition-colors',
                        relevant ? 'text-dt-text-dim group-hover:text-dt-cyan' : 'text-dt-text-dim',
                      )} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="font-heading text-lg font-semibold text-dt-text">
                            {step.title}
                          </h2>
                          {selected && (
                            <div className="flex shrink-0 gap-1.5 pt-1">
                              {PRODUCTS.map((p) => (
                                <p.icon
                                  key={p.id}
                                  className={cn(
                                    'h-3.5 w-3.5 transition-colors',
                                    step.products.includes(p.id) ? 'text-dt-text-dim' : 'text-white/[0.08]',
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-dt-text-muted">
                          {step.description}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-dt-text-muted">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dt-cyan/50" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-dt-text">
            Need help with a specific step?
          </h2>
          <p className="mt-2 text-sm text-dt-text-muted">
            Our support team can walk you through any part of the setup process.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-dt-cyan to-dt-blue px-6 py-3 text-sm font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110"
          >
            Contact Support
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
