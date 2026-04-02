import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ArticlePage } from '@/pages/ArticlePage'
import { ProductUpdatesPage } from '@/pages/ProductUpdatesPage'
import { DeveloperDocsPage } from '@/pages/DeveloperDocsPage'
import { ContactPage } from '@/pages/ContactPage'
import { ProductSupportPage } from '@/pages/ProductSupportPage'
import { SearchPage } from '@/pages/SearchPage'
import { StatusPage } from '@/pages/StatusPage'
import { FaqPage } from '@/pages/FaqPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-updates" element={<ProductUpdatesPage />} />
        <Route path="/developer-docs" element={<DeveloperDocsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/getting-started" element={<OnboardingPage />} />
        <Route path="/dopeapps" element={<ProductSupportPage />} />
        <Route path="/dopesites" element={<ProductSupportPage />} />
        <Route path="/dopetender" element={<ProductSupportPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
