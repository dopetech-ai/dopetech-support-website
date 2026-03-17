import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ArticleFeedbackProps {
  articleId: string
}

export function ArticleFeedback({ articleId }: ArticleFeedbackProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [choice, setChoice] = useState<'helpful' | 'not_helpful' | null>(null)

  async function submit(helpful: boolean) {
    if (status !== 'idle') return
    const value = helpful ? 'helpful' : 'not_helpful'
    setChoice(value)
    setStatus('loading')

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, helpful }),
      })
    } catch {
      // Fire and forget — don't block UX on failure
    }
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <p className="mt-8 text-center text-sm text-dt-text-muted">
        {choice === 'helpful'
          ? 'Glad this helped! Thanks for the feedback.'
          : 'Sorry about that. We\'ll work on improving this article.'}
      </p>
    )
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <span className="text-sm text-dt-text-muted">Was this helpful?</span>
      <button
        onClick={() => submit(true)}
        disabled={status === 'loading'}
        className={cn(
          'inline-flex items-center gap-1 text-sm text-dt-text-dim transition-colors duration-200 hover:text-green-400',
          status === 'loading' && 'opacity-50 cursor-not-allowed',
        )}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        Yes
      </button>
      <button
        onClick={() => submit(false)}
        disabled={status === 'loading'}
        className={cn(
          'inline-flex items-center gap-1 text-sm text-dt-text-dim transition-colors duration-200 hover:text-red-400',
          status === 'loading' && 'opacity-50 cursor-not-allowed',
        )}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        No
      </button>
    </div>
  )
}
