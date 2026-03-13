import type { ContentData, Article, Category } from '@/types/article'
import { CATEGORIES } from '@/config/site'

let cachedData: ContentData | null = null

async function loadContentData(): Promise<ContentData> {
  if (cachedData) return cachedData
  try {
    const mod = await import('@/data/articles.json')
    cachedData = mod.default as ContentData
  } catch {
    // Fallback: empty data for dev without content build
    cachedData = {
      articles: [],
      categories: CATEGORIES.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        icon: c.icon,
        articleCount: 0,
      })),
      buildTime: new Date().toISOString(),
    }
  }
  return cachedData
}

export async function getArticles(): Promise<Article[]> {
  const data = await loadContentData()
  return data.articles
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const articles = await getArticles()
  return articles.find((a) => a.slug === slug)
}

export async function getCategories(): Promise<Category[]> {
  const data = await loadContentData()
  return data.categories
}

export async function getArticlesByCategory(
  categorySlug: string,
): Promise<Article[]> {
  const articles = await getArticles()
  return articles
    .filter((a) => a.category === categorySlug)
    .sort(
      (a, b) =>
        new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime(),
    )
}

export function getCategoryDef(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}
