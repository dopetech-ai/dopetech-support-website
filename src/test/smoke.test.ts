/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'
import articles from '@/data/articles.json'
import faqData from '@/data/faqData.json'
import status from '@/data/status.json'

describe('articles.json', () => {
  it('has valid top-level structure', () => {
    expect(articles).toHaveProperty('articles')
    expect(articles).toHaveProperty('categories')
    expect(articles).toHaveProperty('buildTime')
    expect(articles.articles.length).toBeGreaterThan(0)
    expect(articles.categories.length).toBeGreaterThan(0)
    expect(typeof articles.buildTime).toBe('string')
  })

  it('each article has required fields', () => {
    for (const article of articles.articles) {
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('slug')
      expect(article).toHaveProperty('category')
      expect(article).toHaveProperty('html')
      expect(article).toHaveProperty('lastEdited')
      expect(article.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('each category has required fields', () => {
    for (const cat of articles.categories) {
      expect(cat).toHaveProperty('slug')
      expect(cat).toHaveProperty('name')
      expect(cat).toHaveProperty('description')
      expect(cat).toHaveProperty('articleCount')
      expect(cat.articleCount).toBeGreaterThan(0)
    }
  })
})

describe('faqData.json', () => {
  it('has at least one product', () => {
    expect(Object.keys(faqData).length).toBeGreaterThan(0)
  })

  it('each product has required fields', () => {
    for (const [, product] of Object.entries(faqData)) {
      const p = product as { label: string; subtitle: string; topics: unknown[] }
      expect(p).toHaveProperty('label')
      expect(p).toHaveProperty('subtitle')
      expect(p).toHaveProperty('topics')
      expect(p.topics.length).toBeGreaterThan(0)
    }
  })

  it('each topic has questions with q and a', () => {
    for (const [, product] of Object.entries(faqData)) {
      const p = product as {
        topics: Array<{ title: string; questions: Array<{ q: string; a: string }> }>
      }
      for (const topic of p.topics) {
        expect(topic).toHaveProperty('title')
        expect(topic).toHaveProperty('questions')
        for (const q of topic.questions) {
          expect(typeof q.q).toBe('string')
          expect(typeof q.a).toBe('string')
          expect(q.q.length).toBeGreaterThan(0)
          expect(q.a.length).toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('status.json', () => {
  it('has valid top-level structure', () => {
    expect(status).toHaveProperty('services')
    expect(status).toHaveProperty('incidents')
    expect(status).toHaveProperty('lastUpdated')
    expect(status.services.length).toBeGreaterThan(0)
  })

  it('each service has required fields', () => {
    for (const service of status.services) {
      expect(service).toHaveProperty('name')
      expect(service).toHaveProperty('status')
      expect(typeof service.name).toBe('string')
      expect(typeof service.status).toBe('string')
    }
  })
})
