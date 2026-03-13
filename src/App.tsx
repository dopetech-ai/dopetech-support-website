import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ArticlePage } from '@/pages/ArticlePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
