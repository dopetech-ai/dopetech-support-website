import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { marked, type Tokens } from 'marked'
import { SITE_CONFIG } from '../../src/config/site.ts'

const SUPPORT_HOST = new URL(SITE_CONFIG.supportUrl).hostname

/**
 * Renders a Notion page to HTML.
 * Chain: Notion blocks → notion-to-md → Markdown → marked → HTML
 */
export async function renderPageToHtml(
  notionClient: Client,
  pageId: string,
): Promise<string> {
  const n2m = new NotionToMarkdown({ notionClient })
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const mdString = n2m.toMarkdownString(mdBlocks)
  const markdown = mdString.parent

  // Warn about Notion internal links
  const notionLinkPattern = /https?:\/\/(www\.)?(notion\.so|notion\.site)/g
  const matches = markdown.match(notionLinkPattern)
  if (matches) {
    console.warn(
      `  ⚠ Found ${matches.length} Notion internal link(s) in page ${pageId}. Authors should use full URLs instead.`,
    )
  }

  // Custom renderer to add target="_blank" to external links
  const renderer = new marked.Renderer()
  renderer.link = function ({ href, title, text }: Tokens.Link) {
    const titleAttr = title ? ` title="${title}"` : ''
    try {
      const url = new URL(href, SITE_CONFIG.supportUrl)
      if (url.hostname !== SUPPORT_HOST) {
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
      }
    } catch {
      // Relative URL or invalid — keep as internal
    }
    return `<a href="${href}"${titleAttr}>${text}</a>`
  }

  const html = await marked.parse(markdown, { gfm: true, renderer })
  return html
}
