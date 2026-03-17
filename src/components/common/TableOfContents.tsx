import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  html: string
  minHeadings?: number
}

/** Extract heading text, stripping nested HTML tags */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

/** Generate a URL-safe ID from heading text */
function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Parse headings from article HTML */
export function parseHeadings(html: string): TocItem[] {
  const regex = /<h([2-3])[^>]*>([\s\S]*?)<\/h[2-3]>/gi
  const items: TocItem[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const text = stripTags(match[2])
    if (text) {
      items.push({ id: toId(text), text, level })
    }
  }

  return items
}

/** Inject IDs into heading tags in the HTML so anchor links work */
export function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-3])([^>]*)>([\s\S]*?)<\/h([2-3])>/gi,
    (_match, level, attrs, content, closeLevel) => {
      const text = stripTags(content)
      const id = toId(text)
      // Don't double-add IDs
      if (attrs.includes('id=')) {
        return `<h${level}${attrs}>${content}</h${closeLevel}>`
      }
      return `<h${level}${attrs} id="${id}">${content}</h${closeLevel}>`
    },
  )
}

export function TableOfContents({ html, minHeadings = 3 }: TableOfContentsProps) {
  const headings = parseHeadings(html)
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length < minHeadings) return

    // Small delay to let the DOM render with injected IDs
    const timer = setTimeout(() => {
      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[]

      if (elements.length === 0) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Find the first heading that's intersecting (visible)
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          if (visible.length > 0) {
            setActiveId(visible[0].target.id)
          }
        },
        {
          rootMargin: '-80px 0px -60% 0px',
          threshold: 0,
        },
      )

      elements.forEach((el) => observerRef.current!.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [html, headings, minHeadings])

  if (headings.length < minHeadings) return null

  return (
    <nav aria-label="Table of contents" className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-dt-text-dim">
          On this page
        </p>
        <ul className="space-y-1 border-l border-white/[0.06]">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={cn(
                  'block border-l-2 py-1 text-sm transition-all duration-200',
                  heading.level === 2 ? 'pl-4' : 'pl-7',
                  activeId === heading.id
                    ? 'border-dt-cyan text-dt-cyan'
                    : 'border-transparent text-dt-text-dim hover:text-dt-text-muted hover:border-white/20',
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
    </nav>
  )
}
