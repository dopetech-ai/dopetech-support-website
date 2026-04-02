import { Link, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { setSeo } from '@/lib/seo'
import {
  Smartphone, Globe, Monitor,
  Key, RotateCcw, Download, RefreshCw, Battery, Bell,
  CreditCard, Palette, ShoppingCart, BarChart3, Users,
  Plug, Shield, FileText, Settings, Zap,
  Layout, Search, Package, MapPin, Headphones,
  Rocket, ArrowRight, ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ContactCTA } from '@/components/common/ContactCTA'

interface HelpTopic {
  icon: LucideIcon
  title: string
  description: string
  href?: string
}

interface ProductConfig {
  name: string
  tagline: string
  icon: LucideIcon
  heroImage: string
  heroPosition?: string
  gradient: string
  accentColor: string
  gettingStarted: { title: string; description: string }
  topics: HelpTopic[]
  guides: HelpTopic[]
}

const PRODUCTS: Record<string, ProductConfig> = {
  dopeapps: {
    name: 'DopeApps',
    tagline: 'Everything you need to run your app like a pro',
    icon: Smartphone,
    heroImage: '/images/hero-dopeapps.avif',
    gradient: 'from-dt-cyan to-dt-blue',
    accentColor: 'dt-cyan',
    gettingStarted: {
      title: 'Getting Started with DopeApps',
      description: 'Just signed up? Walk through every onboarding step: connect your POS, upload your branding, configure your menu, and get your app published to the App Store and Google Play.',
    },
    topics: [
      { icon: Download, title: 'Set Up Your App', description: 'Get your custom DopeApps mobile app installed, configured, and ready for customers.' },
      { icon: Key, title: 'Account & Login', description: 'Manage admin access, reset passwords, and configure user permissions.' },
      { icon: Bell, title: 'Push Notifications', description: 'Create and schedule push campaigns to engage your customers and drive sales.' },
      { icon: ShoppingCart, title: 'Ordering & Cart', description: 'Configure your menu, manage orders, and customize the checkout experience.' },
      { icon: CreditCard, title: 'Payments & Billing', description: 'Set up payment methods, manage subscriptions, and view invoices.' },
      { icon: Palette, title: 'Branding & Design', description: 'Customize your app\'s colors, logo, splash screen, and overall look and feel.' },
      { icon: RefreshCw, title: 'App Updates', description: 'Understand the update process for iOS and Android, and how to request changes.' },
      { icon: Users, title: 'Loyalty Programs', description: 'Set up points, rewards, and customer retention programs within your app.' },
      { icon: BarChart3, title: 'Analytics & Reports', description: 'Track downloads, active users, order volume, and customer engagement metrics.' },
    ],
    guides: [
      { icon: Plug, title: 'POS Integration', description: 'Connect your DopeApps menu to your point-of-sale system.' },
      { icon: Shield, title: 'App Store Compliance', description: 'Ensure your app meets Apple and Google Play requirements.' },
      { icon: Battery, title: 'Performance Tips', description: 'Optimize load times, images, and menu sync for the best experience.' },
    ],
  },
  dopesites: {
    name: 'DopeSites',
    tagline: 'SEO-first dispensary websites',
    icon: Globe,
    heroImage: '/images/hero-dopesites.avif',
    gradient: 'from-dt-blue to-[#6366f1]',
    accentColor: 'dt-blue',
    gettingStarted: {
      title: 'New to DopeSites?',
      description: 'Get your dispensary website live with a custom domain, branded design, and synced menu, optimized for Google from day one.',
    },
    topics: [
      { icon: Layout, title: 'Site Setup & Launch', description: 'Get your DopeSites website live with your custom domain and branding.' },
      { icon: Palette, title: 'Design & Themes', description: 'Customize your website\'s layout, colors, fonts, and homepage sections.' },
      { icon: Search, title: 'SEO & Search', description: 'Optimize your site for Google, manage meta tags, and improve search rankings.' },
      { icon: ShoppingCart, title: 'Menu & Ordering', description: 'Configure your online menu, product display, and order flow.' },
      { icon: Key, title: 'Domain & SSL', description: 'Connect your custom domain, manage DNS settings, and ensure HTTPS is active.' },
      { icon: MapPin, title: 'Multi-Location', description: 'Manage multiple store locations, hours, and location-specific menus.' },
      { icon: BarChart3, title: 'Analytics & Traffic', description: 'Track visitors, conversions, and top-performing pages.' },
      { icon: Shield, title: 'Age Gate & Compliance', description: 'Configure age verification, state disclaimers, and legal requirements.' },
      { icon: FileText, title: 'Content & Pages', description: 'Add custom pages, blog posts, banners, and promotional content.' },
    ],
    guides: [
      { icon: Plug, title: 'POS Integration', description: 'Sync your menu and inventory with your point-of-sale system.' },
      { icon: Zap, title: 'Speed Optimization', description: 'Improve page load times and Core Web Vitals scores.' },
      { icon: RefreshCw, title: 'Migrating to DopeSites', description: 'Move from another platform with zero downtime.' },
    ],
  },
  dopetender: {
    name: 'DopeTender',
    tagline: 'In-store kiosks for dispensaries',
    icon: Monitor,
    heroImage: '/images/hero-dopetender.png',
    heroPosition: 'center 30%',
    gradient: 'from-[#6366f1] to-dt-cyan',
    accentColor: 'dt-cyan',
    gettingStarted: {
      title: 'New to DopeTender?',
      description: 'Set up your in-store kiosk hardware, connect your POS menu, and start taking self-service orders from day one.',
    },
    topics: [
      { icon: Download, title: 'Kiosk Setup', description: 'Install, configure, and deploy your DopeTender kiosk hardware and software.' },
      { icon: Settings, title: 'Admin & Configuration', description: 'Manage kiosk settings, store hours, idle screens, and admin PIN codes.' },
      { icon: ShoppingCart, title: 'Menu & Ordering', description: 'Configure your kiosk menu, product display, and checkout flow.' },
      { icon: CreditCard, title: 'Payments', description: 'Set up payment terminals, cash handling, and receipt printing.' },
      { icon: Users, title: 'Customer Experience', description: 'Customize the ordering flow, upsells, and loyalty check-in at the kiosk.' },
      { icon: RotateCcw, title: 'Troubleshooting', description: 'Fix common issues with display, connectivity, printer, and payment hardware.' },
      { icon: Shield, title: 'Compliance & Age Verification', description: 'Configure ID scanning, age-gate prompts, and purchase limits.' },
      { icon: Package, title: 'Hardware & Maintenance', description: 'Clean, maintain, and replace kiosk components and peripherals.' },
      { icon: BarChart3, title: 'Reports & Analytics', description: 'Track kiosk orders, peak hours, and customer usage patterns.' },
    ],
    guides: [
      { icon: Plug, title: 'POS Integration', description: 'Connect your kiosk to your point-of-sale for real-time inventory sync.' },
      { icon: Headphones, title: 'Staff Training', description: 'Train your budtenders to assist customers and manage the kiosk.' },
      { icon: Zap, title: 'Offline Mode', description: 'Keep your kiosk running when internet connectivity is intermittent.' },
    ],
  },
}

export function ProductSupportPage() {
  const location = useLocation()
  const product = location.pathname.replace('/', '')
  const config = PRODUCTS[product]

  useEffect(() => {
    if (config) {
      setSeo({
        title: `${config.name} Support`,
        description: `Get help with ${config.name}. ${config.tagline}`,
        path: location.pathname,
      })
    }
  }, [config])

  if (!config) return <Navigate to="/404" replace />

  return (
    <>
      {/* Hero image banner */}
      <div className="h-[500px] w-full overflow-hidden">
        <img
          src={config.heroImage}
          alt={`${config.name} hero`}
          className="h-full w-full object-cover"
          style={{ objectPosition: config.heroPosition || 'center 70%' }}
        />
      </div>

      {/* Title */}
      <section className="pb-16 pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-[length:var(--font-size-hero)] font-bold text-dt-text">
            {config.name} Support
          </h1>
          <p className="mt-4 text-lg text-dt-text-muted">{config.tagline}</p>
        </div>
      </section>

      {/* ── Apple-style hero + issue cards (DopeApps only) ── */}
      {product === 'dopeapps' && (
        <>
          {/* Three issue cards */}
          <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Card 1 — Push Notifications */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
                <Bell className="mb-5 h-7 w-7 text-dt-text-dim" />
                <h3 className="text-base font-semibold text-dt-text">
                  Push notifications aren&apos;t sending or delivering
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-dt-text-muted">
                  If your scheduled notifications aren&apos;t going out or your subscriber count looks off, learn how to troubleshoot delivery issues.
                </p>
                <Link
                  to="/support/push-notifications"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright"
                >
                  Troubleshoot push notifications
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Card 2 — Menu Sync */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
                <RefreshCw className="mb-5 h-7 w-7 text-dt-text-dim" />
                <h3 className="text-base font-semibold text-dt-text">
                  My menu isn&apos;t syncing or products look wrong
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-dt-text-muted">
                  Menu data is pulled from your POS. Learn what to check when products appear out of stock, show incorrect info, or aren&apos;t updating.
                </p>
                <Link
                  to="/support/menu-sync"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright"
                >
                  Fix menu sync issues
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Card 3 — Admin Panel */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
                <Settings className="mb-5 h-7 w-7 text-dt-text-dim" />
                <h3 className="text-base font-semibold text-dt-text">
                  Get started with your admin panel
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-dt-text-muted">
                  Learn how to set up banners, configure integrations, and manage your app settings.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <Link
                    to="/support/banners"
                    className="inline-flex items-center gap-1 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright"
                  >
                    Set up banners
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/support/integrations"
                    className="inline-flex items-center gap-1 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright"
                  >
                    Configure integrations
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Getting Started banner ── */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <Link
          to={`/getting-started?product=${product}`}
          className={`group relative flex items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-r ${config.gradient} p-[1px]`}
        >
          <div className="flex w-full items-center gap-8 rounded-3xl bg-dt-bg-card px-8 py-8 sm:px-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08]">
              <Rocket className="h-8 w-8 text-dt-cyan" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-dt-text">
                {config.gettingStarted.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-dt-text-muted">
                {config.gettingStarted.description}
              </p>
            </div>
            <ArrowRight className="hidden h-6 w-6 shrink-0 text-dt-text-dim transition-transform duration-200 group-hover:translate-x-1 group-hover:text-dt-cyan sm:block" />
          </div>
        </Link>
      </section>

      {/* ── Help topics — 2-col horizontal cards ── */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-heading mb-8 text-[length:var(--font-size-h2)] font-bold text-dt-text">
          Common Topics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.topics.map((topic) => (
            <Link
              key={topic.title}
              to="/contact"
              className="group flex items-start gap-5 rounded-2xl px-6 py-5 transition-all duration-200 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] transition-colors group-hover:bg-dt-cyan/10">
                <topic.icon className="h-6 w-6 text-dt-text-dim transition-colors group-hover:text-dt-cyan" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-dt-text transition-colors group-hover:text-dt-cyan">
                  {topic.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-dt-text-muted">
                  {topic.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Guides — visual card style ── */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-heading mb-8 text-[length:var(--font-size-h2)] font-bold text-dt-text">
          Guides & Resources
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {config.guides.map((guide) => (
            <Link
              key={guide.title}
              to="/contact"
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-200 hover:border-dt-cyan/20 hover:bg-white/[0.04]"
            >
              <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${config.gradient} p-[1px]`}>
                <div className="rounded-xl bg-dt-bg-card p-3">
                  <guide.icon className="h-6 w-6 text-dt-cyan" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-dt-text transition-colors group-hover:text-dt-cyan">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dt-text-muted">
                {guide.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-dt-cyan opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Learn more <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Still need help? ── */}
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <ContactCTA />
      </div>
    </>
  )
}
