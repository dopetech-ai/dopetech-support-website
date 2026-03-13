import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type IssueType = 'bug' | 'feature' | 'account' | 'billing' | 'other'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'account', label: 'Account Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'other', label: 'Other' },
]

const PRODUCTS = ['DopeApps', 'DopeSites', 'DopeTender', 'Admin Panel', 'Other']

const PRIORITIES = [
  { value: 'low', label: 'Low', description: 'No immediate impact' },
  { value: 'medium', label: 'Medium', description: 'Workaround available' },
  { value: 'high', label: 'High', description: 'Blocking my work' },
  { value: 'critical', label: 'Critical', description: 'System down' },
]

export function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [issueType, setIssueType] = useState<IssueType>('bug')
  const [product, setProduct] = useState('')
  const [priority, setPriority] = useState('medium')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [expected, setExpected] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const issueLabel = ISSUE_TYPES.find((t) => t.value === issueType)?.label
    const priorityLabel = PRIORITIES.find((p) => p.value === priority)?.label

    // Build structured message
    const message = [
      `Issue Type: ${issueLabel}`,
      `Product: ${product}`,
      `Priority: ${priorityLabel}`,
      '',
      description,
      ...(issueType === 'bug'
        ? [
            '',
            '--- Steps to Reproduce ---',
            steps || 'N/A',
            '',
            '--- Expected Behavior ---',
            expected || 'N/A',
          ]
        : []),
      '',
      '--- Environment ---',
      `Browser: ${navigator.userAgent}`,
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n')

    try {
      const res = await fetch('https://formsubmit.co/ajax/support@dopetech.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          _subject: `[${issueLabel}] ${subject}`,
          message,
          _template: 'table',
        }),
      })

      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center px-4">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dt-cyan/[0.06] blur-[120px]" />
        </div>
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-dt-cyan" />
          <h1 className="font-heading mt-6 text-3xl font-bold text-dt-text">
            Message sent!
          </h1>
          <p className="mt-3 text-dt-text-muted">
            We've received your request and will respond to{' '}
            <span className="text-dt-cyan">{email}</span> shortly.
          </p>
          <p className="mt-1 text-sm text-dt-text-dim">
            Typical response time: within 24 hours.
          </p>
          <button
            onClick={() => {
              setStatus('idle')
              setSubject('')
              setDescription('')
              setSteps('')
              setExpected('')
            }}
            className="mt-8 rounded-full border border-white/[0.08] px-6 py-2.5 text-sm font-medium text-dt-text-muted transition-all hover:border-white/[0.15] hover:text-dt-text"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-dt-cyan/[0.05] blur-[120px]" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-[length:var(--font-size-h1)] font-bold text-dt-text">
            Contact Support
          </h1>
          <p className="mt-3 text-dt-text-muted">
            Describe your issue and we'll get back to you at{' '}
            <span className="text-dt-cyan">support@dopetech.ai</span>
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-text">
                Your name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-text">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@dispensary.com"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
              />
            </div>
          </div>

          {/* Issue type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dt-text">
              What type of issue?
            </label>
            <div className="flex flex-wrap gap-2">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setIssueType(type.value)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                    issueType === type.value
                      ? 'bg-dt-cyan/20 text-dt-cyan border border-dt-cyan/30'
                      : 'bg-white/[0.03] text-dt-text-muted border border-white/[0.08] hover:bg-white/[0.06] hover:text-dt-text',
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product & Priority row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-text">
                Product
              </label>
              <select
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20 [&>option]:bg-dt-bg-card [&>option]:text-dt-text"
              >
                <option value="" disabled>
                  Select a product...
                </option>
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-text">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20 [&>option]:bg-dt-bg-card [&>option]:text-dt-text"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label} — {p.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dt-text">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your issue"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dt-text">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell us what's happening..."
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
            />
          </div>

          {/* Bug-specific fields */}
          {issueType === 'bug' && (
            <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-dt-text-dim">
                Bug details
              </p>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dt-text">
                  Steps to reproduce
                </label>
                <textarea
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={3}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                  className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dt-text">
                  Expected behavior
                </label>
                <textarea
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                  rows={2}
                  placeholder="What did you expect to happen?"
                  className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-dt-text placeholder:text-dt-text-dim transition-all focus:border-dt-cyan/30 focus:outline-none focus:ring-1 focus:ring-dt-cyan/20"
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {status === 'error' && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">
                Something went wrong. Please try again or email us directly at{' '}
                <a href="mailto:support@dopetech.ai" className="underline">
                  support@dopetech.ai
                </a>
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dt-cyan to-dt-blue py-3.5 text-sm font-semibold text-dt-bg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>

          <p className="text-center text-xs text-dt-text-dim">
            We typically respond within 24 hours.
          </p>
        </form>
      </section>
    </>
  )
}
