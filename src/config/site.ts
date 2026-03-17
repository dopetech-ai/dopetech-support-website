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
    slug: 'onboarding-tasks',
    name: 'Onboarding Tasks',
    description: 'Get set up and running with your DopeTech products.',
    icon: 'Rocket',
  },
  {
    slug: 'admin-panel',
    name: 'Admin Panel',
    description: 'Manage your store, menu, and settings from the admin dashboard.',
    icon: 'Settings',
  },
  {
    slug: 'push-notifications',
    name: 'Push Notifications',
    description: 'Set up and manage push campaigns to engage your customers.',
    icon: 'Bell',
  },
  {
    slug: 'customer-questions',
    name: 'Customer Questions',
    description: 'Common questions from customers and how to handle them.',
    icon: 'MessageCircleQuestion',
  },
  {
    slug: 'integrations',
    name: 'Integrations',
    description: 'Connect DopeTech with your POS and other platforms.',
    icon: 'Puzzle',
  },
  {
    slug: 'marketing-and-growth',
    name: 'Marketing and Growth',
    description: 'Tips and strategies to grow your business with DopeTech.',
    icon: 'TrendingUp',
  },
  {
    slug: 'compliance-app-store-requirements',
    name: 'Compliance/App Store Requirements',
    description: 'Stay compliant with app store policies and regulations.',
    icon: 'Shield',
  },
  {
    slug: 'support-documents',
    name: 'Support Documents',
    description: 'Reference documents, policies, and resources.',
    icon: 'FileText',
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
  'product-updates',
  'developer-docs',
  'contact',
  'dopeapps',
  'dopesites',
  'dopetender',
  'search',
  'status',
])

export function isValidCategory(slug: string): boolean {
  return CATEGORIES.some((c) => c.slug === slug)
}
