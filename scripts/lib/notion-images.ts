import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { imageSize } from 'image-size'

const DIST_DIR = path.resolve('dist')

export interface ImageResult {
  originalUrl: string
  localPath: string
  width: number | undefined
  height: number | undefined
}

/**
 * Downloads an image from a URL, saves it locally, and extracts dimensions.
 * Returns the local path and dimensions for setting explicit width/height.
 */
export async function downloadImage(
  url: string,
  articleSlug: string,
): Promise<ImageResult | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`  ⚠ Failed to download image (${response.status}): ${url}`)
      return null
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    // Generate content-hash filename
    const hash = createHash('md5').update(buffer).digest('hex').slice(0, 12)
    const ext = guessExtension(url, response.headers.get('content-type'))

    const relDir = `images/articles/${articleSlug}`
    const absDir = path.join(DIST_DIR, relDir)
    fs.mkdirSync(absDir, { recursive: true })

    const filename = `${hash}.${ext}`
    const absPath = path.join(absDir, filename)
    fs.writeFileSync(absPath, buffer)

    // Extract dimensions
    let width: number | undefined
    let height: number | undefined
    try {
      const dimensions = imageSize(buffer)
      width = dimensions.width
      height = dimensions.height
    } catch {
      console.warn(`  ⚠ Could not read dimensions for image: ${url}`)
    }

    return {
      originalUrl: url,
      localPath: `/${relDir}/${filename}`,
      width,
      height,
    }
  } catch (err) {
    console.warn(`  ⚠ Error downloading image: ${url}`, err)
    return null
  }
}

/**
 * Processes HTML to download and replace all image URLs.
 * First image gets loading="eager", rest get loading="lazy".
 */
export async function processImagesInHtml(
  html: string,
  articleSlug: string,
): Promise<string> {
  const imgRegex = /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/g
  const matches = [...html.matchAll(imgRegex)]

  if (matches.length === 0) return html

  let result = html
  let imageIndex = 0

  for (const match of matches) {
    const [fullMatch, beforeSrc, src, afterSrc] = match
    // Skip already-local images
    if (src.startsWith('/') || src.startsWith('./')) {
      imageIndex++
      continue
    }

    const imageResult = await downloadImage(src, articleSlug)
    if (!imageResult) {
      // Remove broken image
      result = result.replace(fullMatch, '<!-- image download failed -->')
      continue
    }

    const loading = imageIndex === 0 ? 'eager' : 'lazy'
    const dims =
      imageResult.width && imageResult.height
        ? ` width="${imageResult.width}" height="${imageResult.height}"`
        : ''

    const newTag = `<img${beforeSrc}src="${imageResult.localPath}"${afterSrc}${dims} loading="${loading}">`
    result = result.replace(fullMatch, newTag)
    imageIndex++
  }

  return result
}

function guessExtension(
  url: string,
  contentType: string | null,
): string {
  // Try content-type first
  if (contentType) {
    const typeMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
    }
    for (const [mime, ext] of Object.entries(typeMap)) {
      if (contentType.includes(mime)) return ext
    }
  }

  // Fallback: parse URL path
  const pathname = new URL(url).pathname
  const ext = path.extname(pathname).slice(1).toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext
  }

  return 'png' // default
}
