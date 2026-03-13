export interface Article {
  id: string
  title: string
  slug: string
  category: string
  metaDescription: string
  lastEdited: string
  html: string
}

export interface Category {
  slug: string
  name: string
  description: string
  icon: string
  articleCount: number
}

export interface ContentData {
  articles: Article[]
  categories: Category[]
  buildTime: string
}
