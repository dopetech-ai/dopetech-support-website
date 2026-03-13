export const SITE_CONFIG = {
  name: 'DopeTech',
  supportName: 'DopeTech Support',
  tagline: 'How can we help you?',
  phone: '(866) WEED-APP',
  phoneHref: 'tel:+18669333277',
  email: 'hello@dopetech.ai',
  mainSiteUrl: 'https://dopetech.ai',
  supportUrl: 'https://support.dopetech.ai',
  bookDemoUrl: 'https://tidycal.com/dopetech/see-dopetech-in-action',
} as const

export interface CategoryDef {
  slug: string
  name: string
  description: string
  icon: string
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description: 'Set up your DopeTech products and get running quickly.',
    icon: 'Rocket',
  },
  {
    slug: 'dopeapps',
    name: 'DopeApps',
    description: 'Mobile app setup, customization, and troubleshooting.',
    icon: 'Smartphone',
  },
  {
    slug: 'dopesites',
    name: 'DopeSites',
    description: 'Website management, SEO, and content updates.',
    icon: 'Globe',
  },
  {
    slug: 'dopetender',
    name: 'DopeTender',
    description: 'In-store kiosk setup, hardware, and configuration.',
    icon: 'Monitor',
  },
  {
    slug: 'how-do-i',
    name: 'How Do I...?',
    description: 'Step-by-step guides for common tasks.',
    icon: 'HelpCircle',
  },
]

/** Slugs reserved for routes and static assets — category slugs must not collide. */
export const RESERVED_SLUGS = new Set([
  'articles',
  '404',
  'images',
  '_pagefind',
  'fonts',
  '_headers',
  'api',
])

export function isValidCategory(slug: string): boolean {
  return CATEGORIES.some((c) => c.slug === slug)
}
