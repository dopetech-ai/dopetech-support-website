import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-display text-[length:var(--font-size-hero)] font-bold text-dt-text">
        How can we help?
      </h1>
      <p className="mt-4 max-w-lg text-lg text-dt-text-muted">
        Browse our guides and FAQs to get the most out of DopeTech products.
      </p>
    </div>
  )
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Layout>
  )
}
