import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from '@/components/common/ScrollToTop'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-dt-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-dt-bg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
