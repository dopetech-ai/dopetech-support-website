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
    slug: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Diagnose and fix common issues with your DopeTech products.',
    icon: 'Wrench',
  },
  {
    slug: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions about DopeTech products and services.',
    icon: 'MessageCircleQuestion',
  },
  {
    slug: 'how-to',
    name: 'How-to',
    description: 'Step-by-step guides for common tasks.',
    icon: 'BookOpen',
  },
  {
    slug: 'billing',
    name: 'Billing',
    description: 'Billing, invoices, and payment information.',
    icon: 'CreditCard',
  },
  {
    slug: 'account',
    name: 'Account',
    description: 'Account settings, access, and user management.',
    icon: 'UserCog',
  },
  {
    slug: 'security',
    name: 'Security',
    description: 'Security best practices, compliance, and data protection.',
    icon: 'Shield',
  },
  {
    slug: 'integrations',
    name: 'Integrations',
    description: 'Connect DopeTech with your existing tools and platforms.',
    icon: 'Puzzle',
  },
  {
    slug: 'release-notes',
    name: 'Release Notes',
    description: 'Latest updates, features, and improvements.',
    icon: 'Megaphone',
  },
]

/** Slugs reserved for routes and static assets -- category slugs must not collide. */
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
