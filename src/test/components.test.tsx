/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { FaqPage } from '@/pages/FaqPage'
import { StatusPage } from '@/pages/StatusPage'

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('FaqPage', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Frequently Asked/i)).toBeInTheDocument()
  })
})

describe('StatusPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <StatusPage />
      </MemoryRouter>,
    )
    expect(container.firstChild).toBeTruthy()
  })
})
