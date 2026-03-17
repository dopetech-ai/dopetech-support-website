import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Update {
  id: string
  month: string
  date: string
  title: string
  excerpt: string
  categories: string[]
  gradient: string
  features: string[]
}

const CATEGORIES = [
  'DopeApps',
  'DopeSites',
  'DopeTender',
]

const UPDATES: Update[] = [
  // --- March 2026 ---
  {
    id: 'mar-2026-discount-cart',
    month: 'March 2026',
    date: 'March 10, 2026',
    title: 'Cart Discount & Pricing Overhaul',
    excerpt: 'Major improvements to how discounts stack, calculate, and display in your cart. Correct per-unit savings, subtotal accuracy, and discount breakdown visibility.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Fixed cart-level discount stacking so multiple promotions apply correctly',
      'Cart discount breakdown now visible during checkout',
      'Per-unit discount savings scale correctly by quantity',
      'Stale discount schedules automatically cleaned up during sync',
    ],
  },
  {
    id: 'mar-2026-legal-limits',
    month: 'March 2026',
    date: 'March 5, 2026',
    title: 'Custom Legal Limit Messaging',
    excerpt: 'Stores can now configure custom error messages for legal purchase limits, giving customers clearer guidance when cart limits are reached.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Custom legal limit error messages configurable per store',
      'Legal purchase limits enforced on guest carts',
    ],
  },
  {
    id: 'mar-2026-search',
    month: 'March 2026',
    date: 'March 6, 2026',
    title: 'Product Search Enhancements',
    excerpt: 'Search now supports filtering by active specials and better handles edge cases when browsing by product slug.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'New specials facet lets customers filter products currently on sale',
      'Product pages fall back to search when a direct slug match fails',
      'Option for consolidated search results',
    ],
  },
  {
    id: 'mar-2026-posabit-sync',
    month: 'March 2026',
    date: 'March 9, 2026',
    title: 'POSaBIT Menu Sync Improvements',
    excerpt: 'Tag collections imported from POSaBIT now sync automatically, and product naming is more accurate with weight and pack quantity options.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'Imported tag collections sync during POSaBIT menu sync',
      'Weight and pack quantity naming flags for accurate product titles',
      'Schedule-based filtering for POSaBIT collections',
    ],
  },
  {
    id: 'mar-2026-android',
    month: 'March 2026',
    date: 'March 11, 2026',
    title: 'Android Stability Fixes',
    excerpt: 'Resolved several Android-specific issues for a smoother experience across devices.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'Fixed multiple Android-specific rendering and interaction issues',
    ],
  },
  // --- February 2026 ---
  {
    id: 'feb-2026-audience',
    month: 'February 2026',
    date: 'February 26, 2026',
    title: 'Audience Targeting for Push Notifications',
    excerpt: 'Send push notifications to specific customer segments. Import audiences from your integrations and target them directly from the admin panel.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Audience import and sync from integration platforms',
      'Target specific audiences when creating notification templates',
      'Support for multiple audiences per notification',
      'Audience targeting UI in the admin panel',
    ],
  },
  {
    id: 'feb-2026-filtering',
    month: 'February 2026',
    date: 'February 20, 2026',
    title: 'Improved Product Filtering',
    excerpt: 'Product search now supports selecting multiple filter values within the same category, making it easier for customers to find exactly what they want.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Disjunctive faceting allows selecting multiple values per filter',
      'Menu type filtering for collections and specials',
      'Category sort parameter for customized browsing order',
    ],
  },
  {
    id: 'feb-2026-guest-analytics',
    month: 'February 2026',
    date: 'February 20, 2026',
    title: 'Analytics Accuracy Improvements',
    excerpt: 'Guest orders are now excluded from admin analytics, giving store owners a more accurate picture of registered customer behavior.',
    categories: ['DopeApps', 'DopeTender'],
    gradient: 'from-dt-blue/80 to-emerald-500/80',
    features: [
      'Guest orders excluded from admin analytics dashboards',
      'Auto-discount specials visibility configurable per integration',
    ],
  },
  {
    id: 'feb-2026-app-ui',
    month: 'February 2026',
    date: 'February 10, 2026',
    title: 'App Display & Status Bar Improvements',
    excerpt: 'Fullscreen images now respect device safe areas, and store owners can customize the status bar appearance.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Safe area insets for fullscreen images prevent content hiding behind notches',
      'Customizable status bar style per app configuration',
      'Empty carousels no longer display when they contain no products',
    ],
  },
  {
    id: 'feb-2026-treez',
    month: 'February 2026',
    date: 'February 5, 2026',
    title: 'Treez Integration Refinements',
    excerpt: 'Treez webhook handling is now more reliable with per-location configuration and improved response handling.',
    categories: ['DopeApps'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Per-location webhook configuration for Treez',
      'Improved Treez webhook response handling',
    ],
  },
  {
    id: 'feb-2026-notifications',
    month: 'February 2026',
    date: 'February 5, 2026',
    title: 'Push Notification Reliability',
    excerpt: 'Notifications are now more reliable with automatic recovery for stuck messages and improved push subscription syncing.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Automatic cron recovery for stuck pending notifications',
      'OneSignal push subscription sync keeps delivery lists current',
      'Draft notification templates can now be processed correctly',
    ],
  },
  {
    id: 'feb-2026-legal-pages',
    month: 'February 2026',
    date: 'February 2, 2026',
    title: 'Dynamic Terms of Service & Privacy Policy',
    excerpt: 'Terms of Service and Privacy Policy pages are now dynamically loaded, so updates take effect immediately without requiring an app update.',
    categories: ['DopeApps'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'Dynamic Terms of Service on profile creation and edit screens',
      'Dynamic Privacy Policy on profile creation and edit screens',
    ],
  },
  // --- January 2026 ---
  {
    id: 'jan-2026-dopesites',
    month: 'January 2026',
    date: 'January 22, 2026',
    title: 'DopeSites Infrastructure Launch',
    excerpt: 'DopeSites is now deployed and running on dedicated infrastructure, bringing the DopeApps shopping experience to the browser with SEO-ready web storefronts.',
    categories: ['DopeSites'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'SEO image fields and website name support for stores',
      'Product slug-based URLs for sitemap generation',
      'Store slug support for clean web URLs',
    ],
  },
  {
    id: 'jan-2026-category-images',
    month: 'January 2026',
    date: 'January 15, 2026',
    title: 'Category Image Management',
    excerpt: 'Store owners can now upload and manage images for product categories, with alt text support for better accessibility and SEO.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Category image upload and management in admin panel',
      'Alt text support for category images',
      'Consolidated category image fields for consistency',
    ],
  },
  {
    id: 'jan-2026-dutchie',
    month: 'January 2026',
    date: 'January 22, 2026',
    title: 'Dutchie Integration Improvements',
    excerpt: 'Better error handling for Dutchie order fetching and specials now respect scheduling rules.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Improved error handling when fetching Dutchie orders',
      'Dutchie specials now respect schedule configuration',
      'Auto discount visibility control in admin panel',
    ],
  },
  {
    id: 'jan-2026-collections',
    month: 'January 2026',
    date: 'January 19, 2026',
    title: 'Product Collections',
    excerpt: 'A new Collections feature lets stores organize products into curated groups with slug-based URLs and active status control.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-dt-blue/80 to-emerald-500/80',
    features: [
      'Collections with URL-friendly links and active status control',
      'Collections support specials filtering',
    ],
  },
  {
    id: 'jan-2026-treez-inventory',
    month: 'January 2026',
    date: 'January 11, 2026',
    title: 'Real-Time Treez Inventory Checks',
    excerpt: 'Cart submission now verifies product availability against Treez inventory in real time, preventing orders for out-of-stock items.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Real-time Treez inventory check on cart submission',
      'POSaBIT date parsing fix for multiple formats',
    ],
  },
  {
    id: 'jan-2026-menu-sync',
    month: 'January 2026',
    date: 'January 13, 2026',
    title: 'Menu Sync Reliability',
    excerpt: 'Menu syncing is now more reliable with fixes for stalled jobs and better tolerance for startup latency.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Improved menu sync reliability',
      'Improved sync job reliability on startup',
      'Improved notification delivery stability',
    ],
  },
  {
    id: 'jan-2026-admin-notif',
    month: 'January 2026',
    date: 'January 25, 2026',
    title: 'Notification Management Improvements',
    excerpt: 'A new cancelled notifications tab in the admin panel lets you review and permanently delete cancelled notification templates.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Cancelled notifications tab in admin panel',
      'Permanent delete for cancelled notifications',
      'Cart savings calculation fix',
    ],
  },
  // --- December 2025 ---
  {
    id: 'dec-2025-flowhub',
    month: 'December 2025',
    date: 'December 26, 2025',
    title: 'Flowhub Order Status Sync',
    excerpt: 'Orders placed through Flowhub-integrated stores now sync status updates automatically via webhooks, keeping customers informed about order progress.',
    categories: ['DopeApps'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'Automatic order status sync from Flowhub',
      'Flowhub webhook handler for real-time updates',
      'Fixed AIQ loyalty points lookup for accurate point balances',
    ],
  },
  {
    id: 'dec-2025-guest-checkout',
    month: 'December 2025',
    date: 'December 19, 2025',
    title: 'Guest Checkout',
    excerpt: 'Customers can now browse and complete purchases without creating an account, reducing friction and speeding up the checkout process.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'Full guest cart and checkout support',
      'Guest checkout URL generation',
      'Guest web checkout redirect for DopeSites',
    ],
  },
  {
    id: 'dec-2025-pickup-hours',
    month: 'December 2025',
    date: 'December 24, 2025',
    title: 'Pickup Orders Respect Store Hours',
    excerpt: 'Pickup orders are now restricted to store operating hours, preventing customers from placing orders when the store is closed.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Pickup orders restricted to store operating hours',
      'Fixed duplicate notification queue entries',
    ],
  },
  {
    id: 'dec-2025-potency-search',
    month: 'December 2025',
    date: 'December 18, 2025',
    title: 'Potency Search & Filtering',
    excerpt: 'Customers can now search and filter products by potency range, making it easy to find products at the desired strength.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Potency range filter in product search',
      'Potency data included in the search index',
      'Category children flag respected in search facets',
    ],
  },
  {
    id: 'dec-2025-treez-migration',
    month: 'December 2025',
    date: 'December 9, 2025',
    title: 'Treez API Migration',
    excerpt: 'Treez-integrated stores migrated to the latest Treez API for improved reliability and data accuracy.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-emerald-500/80',
    features: [
      'Migrated to latest Treez API version',
      'Flowhub strain mapping fix',
      'POSaBIT weight-based product sync fix',
    ],
  },
  {
    id: 'dec-2025-tos-medical',
    month: 'December 2025',
    date: 'December 23, 2025',
    title: 'Terms of Service & Medical Checkout Fixes',
    excerpt: 'Fixed TOS link navigation and streamlined how medical data is collected during checkout.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Fixed Terms of Service link navigation',
      'Medical data collection streamlined at checkout',
    ],
  },
  {
    id: 'dec-2025-notification-reliability',
    month: 'December 2025',
    date: 'December 27, 2025',
    title: 'Notification Delivery Fixes',
    excerpt: 'Fixed issues with stalled notification jobs and duplicate deliveries for more reliable push notifications.',
    categories: ['DopeApps'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Improved notification delivery reliability and de-duplication',
    ],
  },
  // --- November 2025 ---
  {
    id: 'nov-2025-seo-slugs',
    month: 'November 2025',
    date: 'November 24, 2025',
    title: 'SEO-Friendly URLs',
    excerpt: 'Products, brands, categories, and stores now support slug-based URLs, improving SEO and making links easier to share.',
    categories: ['DopeApps', 'DopeSites'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Slug support for products, brands, categories, and stores',
      'Collection slug support with database migration',
      'Structured store hours data',
    ],
  },
  {
    id: 'nov-2025-consent',
    month: 'November 2025',
    date: 'November 18, 2025',
    title: 'Messaging Consent at Signup',
    excerpt: 'New users now see a clear messaging consent checkbox during signup, ensuring compliance with messaging regulations.',
    categories: ['DopeApps'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'Messages consent checkbox on signup form',
      'SpringBig consent support for user sync',
    ],
  },
  {
    id: 'nov-2025-deeplinks',
    month: 'November 2025',
    date: 'November 21, 2025',
    title: 'Image & Deeplink Navigation Fixes',
    excerpt: 'Fixed several issues with deeplink navigation from image carousels and sections, ensuring customers land on the correct page.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'Fixed image carousel deeplink navigation',
      'Fixed deeplink navigation for image sections',
    ],
  },
  {
    id: 'nov-2025-product-card',
    month: 'November 2025',
    date: 'November 7, 2025',
    title: 'Product Card Redesign',
    excerpt: 'Product cards refreshed with clearer information and now show when more options are available for a product.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Refactored product card with improved layout',
      'Text indicator when more product options are available',
      'Custom discount redemption alert text',
    ],
  },
  {
    id: 'nov-2025-storefront-sync',
    month: 'November 2025',
    date: 'November 5, 2025',
    title: 'Store Storefront Sync',
    excerpt: 'Store configuration now syncs automatically from your POS integration, reducing manual setup for new locations.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Automatic storefront configuration sync from integrations',
      'POSaBIT strain name mapping for accurate product info',
    ],
  },
  // --- October 2025 ---
  {
    id: 'oct-2025-kiosk-guest',
    month: 'October 2025',
    date: 'October 27, 2025',
    title: 'DopeTender Guest Mode',
    excerpt: 'Kiosk customers can now browse and shop as guests with a new guest button on the splash screen, speeding up in-store ordering.',
    categories: ['DopeTender'],
    gradient: 'from-dt-blue/80 to-emerald-500/80',
    features: [
      'Guest button on kiosk splash screen',
      'Full guest cart support for kiosk mode',
      'Medical guest cart support',
    ],
  },
  {
    id: 'oct-2025-pos-pricing',
    month: 'October 2025',
    date: 'October 21, 2025',
    title: 'POS Pricing & Cart Fixes',
    excerpt: 'Resolved pricing discrepancies in cart and checkout for Dutchie and Flowhub integrations, ensuring accurate totals.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Dutchie cart and checkout item pricing fix',
      'Flowhub sales tax calculation fix',
      'Duplicate cart items bug fix',
      'Standardized order status display across integrations',
    ],
  },
  {
    id: 'oct-2025-search-filters',
    month: 'October 2025',
    date: 'October 23, 2025',
    title: 'New Search Filters',
    excerpt: 'Product search now supports additional filters including sort options, battery products, half-gram weights, and THC potency.',
    categories: ['DopeApps'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Sort filters for product search results',
      'Battery product filter',
      'Half gram weight filter',
      'POSaBIT THC potency data in product listings',
    ],
  },
  {
    id: 'oct-2025-notif-redirect',
    month: 'October 2025',
    date: 'October 21, 2025',
    title: 'Notification Deep Linking',
    excerpt: 'Push notifications can now redirect customers to specific pages in the app, making promotional notifications more actionable.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Push notifications support page-specific redirects',
      'OneSignal notification redirect and page support',
    ],
  },
  {
    id: 'oct-2025-admin-orders',
    month: 'October 2025',
    date: 'October 9, 2025',
    title: 'Order Export & Analytics',
    excerpt: 'The admin panel now supports CSV order exports with store filtering, date range sliders, and optimized performance for large datasets.',
    categories: ['DopeApps'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'Order CSV export with store filtering',
      'Daily and monthly date range sliders',
      'Optimized for large datasets',
    ],
  },
  {
    id: 'oct-2025-image-zoom',
    month: 'October 2025',
    date: 'October 20, 2025',
    title: 'Image Section Zoom',
    excerpt: 'Customers can now pinch-to-zoom on image sections within the app on iOS.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'Pinch-to-zoom on image sections (iOS)',
    ],
  },
  // --- September 2025 ---
  {
    id: 'sep-2025-notification-service',
    month: 'September 2025',
    date: 'September 29, 2025',
    title: 'Push Notification Scheduling Service',
    excerpt: 'A dedicated notification service now handles push notification delivery with template queueing, giving store owners more control over when messages go out.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Dedicated notification service for reliable delivery',
      'Notification template queueing in admin panel',
      'Integration access and login fixes',
    ],
  },
  {
    id: 'sep-2025-store-fix',
    month: 'September 2025',
    date: 'September 13, 2025',
    title: 'Store Selection Bug Fixes',
    excerpt: 'Fixed issues with the store selection screen, including a syntax error and georestriction button behavior.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Fixed store selection loading issue',
      'Fixed georestriction button behavior',
    ],
  },
  // --- August 2025 ---
  {
    id: 'aug-2025-push-overhaul',
    month: 'August 2025',
    date: 'August 29, 2025',
    title: 'Push Notification System Overhaul',
    excerpt: 'Rebuilt push notification infrastructure with native token recording, updated SDKs, and smarter tag management for more reliable delivery.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Native push token recording for improved delivery',
      'Updated push notification SDK for improved delivery reliability',
      'Fixed push notification behavior on logout',
    ],
  },
  {
    id: 'aug-2025-checkout',
    month: 'August 2025',
    date: 'August 29, 2025',
    title: 'Checkout Stability Fix',
    excerpt: 'Resolved a crash that could occur during checkout, along with improved link handling on the checkout screen.',
    categories: ['DopeApps'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Resolved a rare checkout stability issue',
      'Improved link handling on checkout screen',
      'Input field trimming during account setup',
    ],
  },
  {
    id: 'aug-2025-custom-colors',
    month: 'August 2025',
    date: 'August 5, 2025',
    title: 'Add-to-Cart Button Customization',
    excerpt: 'Store owners can now customize the add-to-cart button colors to match their brand.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Custom color support for add-to-cart buttons',
      'Fixed product card color defaults',
      'Fixed horizontal product card colors',
    ],
  },
  // --- July 2025 ---
  {
    id: 'jul-2025-notifications-layout',
    month: 'July 2025',
    date: 'July 10, 2025',
    title: 'Notification & Layout Fixes',
    excerpt: 'Resolved push notification delivery issues and fixed a product grid layout bug.',
    categories: ['DopeApps'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'Fixed OneSignal notification delivery issues',
      'Fixed product grid column layout bug',
    ],
  },
  // --- May 2025 ---
  {
    id: 'may-2025-kiosk-mode',
    month: 'May 2025',
    date: 'May 27, 2025',
    title: 'DopeTender Kiosk Mode',
    excerpt: 'The all-new kiosk mode transforms tablets into in-store ordering stations with a dedicated color scheme and streamlined browsing.',
    categories: ['DopeTender'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'Kiosk mode with dedicated color theming',
      'Kiosk-specific build system for iOS',
      'Fixed multiple kiosk mode interaction issues',
    ],
  },
  {
    id: 'may-2025-recently-viewed',
    month: 'May 2025',
    date: 'May 24, 2025',
    title: 'Recently Viewed Products',
    excerpt: 'Customers can now quickly find products they recently browsed, filtered by their selected store.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Recently viewed products section on the home screen',
      'Recently viewed filtered by selected store',
      'Option to hide recently viewed section title',
    ],
  },
  {
    id: 'may-2025-product-cards',
    month: 'May 2025',
    date: 'May 18, 2025',
    title: 'Product Card & Search Improvements',
    excerpt: 'Updated product cards with strain color overrides, plus fixes to search and cart interactions.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Strain color override on product cards',
      'New product card design replacing legacy layout',
      'Fixed search page error',
      'Fixed add-to-cart modal back navigation',
    ],
  },
  // --- April 2025 ---
  {
    id: 'apr-2025-notifications',
    month: 'April 2025',
    date: 'April 29, 2025',
    title: 'Notification Display & Navigation Fixes',
    excerpt: 'Push notifications now display correctly when the app is open, and image aspect ratios in notifications are preserved.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-emerald-500/80',
    features: [
      'Fixed notifications not displaying when app is open',
      'Fixed notification image aspect ratio',
      'Removed repeating allow notifications prompt',
    ],
  },
  {
    id: 'apr-2025-category-carousel',
    month: 'April 2025',
    date: 'April 29, 2025',
    title: 'Category Carousel Links & Empty States',
    excerpt: 'Category carousels now support custom links, and the orders section shows helpful messaging when empty.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-cyan/80',
    features: [
      'Link field added to category carousels',
      'Empty state text for the orders section',
      'Fixed repeated link navigation not updating',
    ],
  },
  {
    id: 'apr-2025-link-overrides',
    month: 'April 2025',
    date: 'April 7, 2025',
    title: 'Link Override System',
    excerpt: 'A new link override system gives store owners flexible control over where buttons and elements navigate within the app.',
    categories: ['DopeApps'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Link override support for custom navigation targets',
      'Fixed link override parameter parsing',
      'Fixed filter behavior to account for link overrides',
    ],
  },
  // --- March 2025 ---
  {
    id: 'mar-2025-carousels',
    month: 'March 2025',
    date: 'March 13, 2025',
    title: 'Product Carousel Enhancements',
    excerpt: 'Product carousels now include "View All" cards and smarter facet loading for a better browsing experience.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'View All cards in product carousels',
      'Removed View All from carousels without titles',
      'Additional facet loading points',
      'Fixed carousel auto aspect ratio',
    ],
  },
  {
    id: 'mar-2025-kiosk-ios',
    month: 'March 2025',
    date: 'March 21, 2025',
    title: 'DopeTender iOS Kiosk Build System',
    excerpt: 'New build system for deploying DopeTender kiosk mode on iOS devices.',
    categories: ['DopeTender'],
    gradient: 'from-[#6366f1]/80 to-emerald-500/80',
    features: [
      'iOS kiosk build system',
      'Fixed kiosk build issues',
    ],
  },
  {
    id: 'mar-2025-cart-status',
    month: 'March 2025',
    date: 'March 31, 2025',
    title: 'Cart Color Customization',
    excerpt: 'Store owners can now customize cart colors and the status bar adapts to match the header color.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-dt-cyan/80',
    features: [
      'Custom cart colors for brand consistency',
      'Status bar color matches header color',
    ],
  },
  {
    id: 'mar-2025-filters',
    month: 'March 2025',
    date: 'March 4, 2025',
    title: 'Filters & Android Touch Fix',
    excerpt: 'Fixed product filters and resolved an Android issue where touch input was not being recognized.',
    categories: ['DopeApps'],
    gradient: 'from-amber-500/80 to-[#6366f1]/80',
    features: [
      'Fixed product filter behavior',
      'Fixed Android not receiving touch input',
    ],
  },
  // --- February 2025 ---
  {
    id: 'feb-2025-search-discounts',
    month: 'February 2025',
    date: 'February 26, 2025',
    title: 'Search Bar Actions & Discount Images',
    excerpt: 'New search bar buttons for quicker navigation and discount sections now display promotional images.',
    categories: ['DopeApps'],
    gradient: 'from-emerald-500/80 to-dt-blue/80',
    features: [
      'Search bar action buttons',
      'Discount images in promotional sections',
      'Discount image sizing adapts to remote dimensions',
      'Select store deeplink support',
    ],
  },
  {
    id: 'feb-2025-multi-store',
    month: 'February 2025',
    date: 'February 21, 2025',
    title: 'Multi-Store Header & Stability Fixes',
    excerpt: 'A new store selection header makes it easier for customers to switch between locations, plus several stability improvements.',
    categories: ['DopeApps'],
    gradient: 'from-dt-cyan/80 to-dt-blue/80',
    features: [
      'Select Store header for multi-location dispensaries',
      'Fixed iOS 17 crash related to image loading',
      'Fixed search not clearing properly',
      'Fixed iOS tab bar and icon clipping',
    ],
  },
  {
    id: 'feb-2025-onesignal',
    month: 'February 2025',
    date: 'February 18, 2025',
    title: 'Push Notification SDK Update',
    excerpt: 'Updated the push notification SDK for better reliability on both iOS and Android.',
    categories: ['DopeApps'],
    gradient: 'from-dt-blue/80 to-[#6366f1]/80',
    features: [
      'Updated OneSignal SDK for improved stability',
      'Fixed Android OneSignal initialization',
      'Fixed notification crash on startup',
    ],
  },
]

function groupByMonth(updates: Update[]) {
  const groups: { month: string; updates: Update[] }[] = []
  for (const update of updates) {
    const last = groups[groups.length - 1]
    if (last && last.month === update.month) {
      last.updates.push(update)
    } else {
      groups.push({ month: update.month, updates: [update] })
    }
  }
  return groups
}

const JUMP_MONTHS = [...new Set(UPDATES.map((u) => u.month))]

const CATEGORY_COLORS: Record<string, string> = {
  DopeApps: 'bg-emerald-500',
  DopeSites: 'bg-dt-blue',
  DopeTender: 'bg-amber-500',
}

export function ProductUpdatesPage() {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [activeMonth, setActiveMonth] = useState('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filtered = UPDATES.filter((u) => {
    if (search) {
      const q = search.toLowerCase()
      const matchesTitle = u.title.toLowerCase().includes(q)
      const matchesExcerpt = u.excerpt.toLowerCase().includes(q)
      const matchesFeatures = u.features.some((f) => f.toLowerCase().includes(q))
      const matchesDate = u.date.toLowerCase().includes(q)
      if (!matchesTitle && !matchesExcerpt && !matchesFeatures && !matchesDate) return false
    }
    if (activeCategories.length > 0 && !u.categories.some((c) => activeCategories.includes(c))) return false
    return true
  })

  const grouped = groupByMonth(filtered)

  useEffect(() => {
    observerRef.current?.disconnect()

    const monthIds = grouped.map((g) => g.month.replace(/\s+/g, '-').toLowerCase())
    const elements = monthIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          const id = visible[0].target.id
          const month = JUMP_MONTHS.find((m) => m.replace(/\s+/g, '-').toLowerCase() === id) || ''
          setActiveMonth(month)
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((el) => observerRef.current!.observe(el))

    return () => observerRef.current?.disconnect()
  }, [grouped])

  function toggleCategory(cat: string) {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-dt-blue/[0.08] via-dt-cyan/[0.04] to-transparent" />
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-blue/[0.06] blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-[length:var(--font-size-hero)] font-bold text-dt-text">
            Product Updates
          </h1>
          <p className="mt-3 text-dt-text-muted">
            The latest features and improvements for DopeApps, DopeSites, and DopeTender.
          </p>
        </div>
      </section>

      {/* Search */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dt-text-dim" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search updates..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
          />
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Main content: sidebar + updates + jump nav */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr_200px]">
          {/* Left sidebar */}
          <aside className="space-y-6">
            {/* Feedback card */}
            <div className="rounded-2xl bg-gradient-to-br from-dt-cyan/20 to-dt-blue/20 border border-dt-cyan/10 p-5">
              <p className="text-sm font-medium text-dt-text">
                Have an idea or feature request?
              </p>
              <a
                href="mailto:support@dopetech.ai"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-dt-cyan transition-colors hover:text-dt-cyan-bright"
              >
                Leave feedback
              </a>
            </div>

            {/* Category filters */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-dt-text">Products</h3>
                {activeCategories.length > 0 && (
                  <button
                    onClick={() => setActiveCategories([])}
                    className="text-xs text-dt-text-dim transition-colors hover:text-dt-text"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                      activeCategories.includes(cat)
                        ? 'bg-dt-cyan/20 text-dt-cyan border border-dt-cyan/30'
                        : 'bg-white/[0.04] text-dt-text-muted border border-white/[0.06] hover:bg-white/[0.08] hover:text-dt-text',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Center: update cards */}
          <div className="space-y-12">
            {grouped.map((group) => (
              <div key={group.month} id={group.month.replace(/\s+/g, '-').toLowerCase()}>
                {/* Month divider */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-sm font-medium text-dt-text-muted">
                    {group.month}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <div className="space-y-8">
                  {group.updates.map((update) => (
                    <article key={update.id} className="group">
                      {/* Gradient banner */}
                      <div
                        className={cn(
                          'rounded-t-2xl bg-gradient-to-br p-6 pb-8',
                          update.gradient,
                        )}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                          Product Update
                        </p>
                        <p className="mt-2 font-heading text-lg font-bold text-white">
                          {update.title}
                        </p>
                        <div className="mt-4 space-y-1">
                          {update.features.map((f) => (
                            <p key={f} className="text-sm text-white/80">
                              {f}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="rounded-b-2xl border border-t-0 border-white/[0.06] bg-white/[0.02] p-6">
                        {/* Category tags */}
                        <div className="flex flex-wrap items-center gap-3">
                          {update.categories.map((cat) => (
                            <span key={cat} className="flex items-center gap-1.5 text-xs text-dt-text-dim">
                              <span className={cn('h-2 w-2 rounded-full', CATEGORY_COLORS[cat] || 'bg-dt-text-dim')} />
                              {cat}
                            </span>
                          ))}
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-dt-text">
                          {update.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-dt-text-muted">
                          {update.excerpt}
                        </p>
                        <p className="mt-3 text-xs text-dt-text-dim">{update.date}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-dt-text-muted">
                No updates match your filters.
              </div>
            )}
          </div>

          {/* Right sidebar: jump to month */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-dt-text">Jump to Month</h3>
              <nav className="mt-3 space-y-1.5">
                {JUMP_MONTHS.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      const el = document.getElementById(month.replace(/\s+/g, '-').toLowerCase())
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={cn(
                      'block w-full text-right text-sm transition-colors hover:text-dt-cyan',
                      activeMonth === month ? 'text-dt-cyan font-medium' : 'text-dt-text-muted',
                    )}
                  >
                    {month}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
