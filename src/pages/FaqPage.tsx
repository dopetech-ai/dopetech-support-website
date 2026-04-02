import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { SmartphoneIcon, LaptopIcon, KioskIcon } from '@/components/common/ProductIcons'
import faqJson from '@/data/faqData.json'
import { cn } from '@/lib/cn'

interface FaqQuestion {
  q: string
  a: string
}

interface FaqTopic {
  title: string
  questions: FaqQuestion[]
}

interface FaqProduct {
  label: string
  subtitle: string
  topics: FaqTopic[]
}

const faqData = faqJson as Record<string, FaqProduct>

const PRODUCT_TABS = [
  { key: 'general', Icon: null },
  { key: 'dopeapps', Icon: SmartphoneIcon },
  { key: 'dopesites', Icon: LaptopIcon },
  { key: 'dopetender', Icon: KioskIcon },
] as const

export function FaqPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [expandedQ, setExpandedQ] = useState<string | null>(null)

  const product = faqData[activeTab]

  function toggleQuestion(id: string) {
    setExpandedQ((prev) => (prev === id ? null : id))
  }

  return (
    <div className="relative overflow-clip">
      {/* Page-level ambient glow — extends well past the hero, fades gradually to black */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1400px]"
        style={{ zIndex: 0 }}
      >
        <div className="absolute left-1/2 top-0 h-[1200px] w-[1400px] -translate-x-1/2 rounded-full bg-[#00e5ff] opacity-[0.15] blur-[250px]" />
        <div className="absolute right-0 top-[5%] h-[900px] w-[900px] rounded-full bg-[#0088ff] opacity-[0.12] blur-[220px]" />
        <div className="absolute left-[10%] top-[15%] h-[600px] w-[600px] rounded-full bg-[#6366f1] opacity-[0.06] blur-[200px]" />
        <div className="absolute inset-x-0 bottom-0 h-[700px] bg-gradient-to-b from-transparent to-[#050508]" />
      </div>

      {/* Header */}
      <section className="relative z-10 px-4 pb-8 pt-32 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="animate-fade-up font-heading text-[length:var(--font-size-hero)] font-bold leading-tight text-dt-text">
            Frequently Asked
            <span className="shimmer-text"> Questions</span>
          </h1>
          <p className="animate-fade-up-delay-1 mt-4 text-lg text-dt-text-muted">
            Quick answers to common questions about DopeTech products.
          </p>
        </div>
      </section>

      {/* Product tabs */}
      <section className="relative z-10 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-4 sm:gap-6">
          {PRODUCT_TABS.map(({ key, Icon }) => {
            const data = faqData[key]
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key)
                  setExpandedQ(null)
                }}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-2xl border px-6 py-4 transition-all duration-300',
                  isActive
                    ? 'border-dt-cyan/40 bg-dt-cyan/[0.08] shadow-[0_0_30px_rgba(0,229,255,0.12)]'
                    : 'border-white/[0.08] bg-white/[0.04] hover:border-dt-cyan/20 hover:bg-white/[0.06]',
                )}
              >
                {Icon ? (
                  <Icon
                    className={cn(
                      'h-12 w-12 transition-all duration-300',
                      isActive
                        ? 'text-dt-cyan drop-shadow-[0_0_16px_rgba(0,229,255,0.35)]'
                        : 'text-dt-text-muted group-hover:text-dt-cyan',
                    )}
                  />
                ) : (
                  <HelpCircle
                    className={cn(
                      'h-12 w-12 transition-all duration-300',
                      isActive
                        ? 'text-dt-cyan drop-shadow-[0_0_16px_rgba(0,229,255,0.35)]'
                        : 'text-dt-text-muted group-hover:text-dt-cyan',
                    )}
                  />
                )}
                <div className="text-center">
                  <span
                    className={cn(
                      'block text-sm font-semibold transition-colors',
                      isActive ? 'text-dt-cyan' : 'text-dt-text group-hover:text-dt-cyan',
                    )}
                  >
                    {data.label}
                  </span>
                  <span className="block text-xs text-dt-text-muted">{data.subtitle}</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* FAQ topics */}
      <section className="relative z-10 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {product.topics.map((topic, topicIdx) => (
            <TopicSection
              key={`${activeTab}-${topicIdx}`}
              topic={topic}
              productKey={activeTab}
              topicIdx={topicIdx}
              expandedQ={expandedQ}
              onToggle={toggleQuestion}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function TopicSection({
  topic,
  productKey,
  topicIdx,
  expandedQ,
  onToggle,
}: {
  topic: FaqTopic
  productKey: string
  topicIdx: number
  expandedQ: string | null
  onToggle: (id: string) => void
}) {
  if (topic.questions.length === 0) return null

  return (
    <div>
      <h2 className="font-heading mb-4 text-[length:var(--font-size-h3)] font-bold text-dt-text">
        {topic.title}
      </h2>
      <div className="space-y-3">
        {topic.questions.map((item, qIdx) => {
          const id = `${productKey}-${topicIdx}-${qIdx}`
          const isExpanded = expandedQ === id

          return (
            <div
              key={id}
              className="rounded-2xl border border-white/[0.12] bg-white/[0.06] transition-all duration-200 hover:border-dt-cyan/30 hover:bg-white/[0.10] hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]"
            >
              <button
                onClick={() => onToggle(id)}
                className="group flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-medium text-dt-text transition-colors duration-200 group-hover:text-dt-cyan">
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-dt-text-dim transition-all duration-200 group-hover:text-dt-cyan',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>
              {isExpanded && (
                <div className="border-t border-white/[0.06] px-6 py-6">
                  <p className="text-sm leading-relaxed text-dt-text-muted">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
