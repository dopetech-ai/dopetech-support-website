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
  notionIdToSlug?: Map<string, string>,
): Promise<string> {
  const n2m = new NotionToMarkdown({ notionClient })
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const mdString = n2m.toMarkdownString(mdBlocks)
  const markdown = mdString.parent

  // Custom renderer to handle Notion internal links and external links
  const renderer = new marked.Renderer()
  renderer.link = function ({ href, title, text }: Tokens.Link) {
    const titleAttr = title ? ` title="${title}"` : ''

    // Rewrite Notion links to support hub article URLs
    // Handles: notion.so/page-id, notion.site/page-id, and bare /page-id from mention links
    if (notionIdToSlug) {
      let notionPageId: string | null = null

      // Full Notion URL: https://notion.so/workspace/page-id
      const notionUrlMatch = href.match(/(?:notion\.so|notion\.site)\/(?:[^/]+\/)?([a-f0-9-]{32,36})/)
      if (notionUrlMatch) {
        notionPageId = notionUrlMatch[1]
      }

      // Bare Notion page ID path: /abc123def456 (32 hex chars, from mention links)
      if (!notionPageId) {
        const bareIdMatch = href.match(/^\/([a-f0-9]{32})$/)
        if (bareIdMatch) {
          notionPageId = bareIdMatch[1]
        }
      }

      if (notionPageId) {
        const normalizedId = notionPageId.replace(/-/g, '')
        let slug: string | undefined
        for (const [id, s] of notionIdToSlug) {
          if (id.replace(/-/g, '') === normalizedId) {
            slug = s
            break
          }
        }

        if (slug) {
          console.log(`  ✓ Rewrote Notion link → /articles/${slug}`)
          return `<a href="/articles/${slug}"${titleAttr}>${text}</a>`
        } else {
          console.warn(`  ⚠ Notion link points to unknown page: ${href}`)
        }
      }
    }

    if (/notion\.(so|site)/.test(href)) {
      console.warn(`  ⚠ Unresolved Notion link: ${href}`)
    }

    // External links get target="_blank"
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
