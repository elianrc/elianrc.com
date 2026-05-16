import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Container from '@/components/Container'

describe('Container', () => {
  it('provides the shared boxed content width', () => {
    render(<Container>Content</Container>)

    expect(screen.getByText('Content')).toHaveClass('mx-auto', 'w-full', 'max-w-6xl')
  })

  it('preserves additional layout classes', () => {
    render(<Container className="flex items-center">Content</Container>)

    expect(screen.getByText('Content')).toHaveClass(
      'mx-auto',
      'w-full',
      'max-w-6xl',
      'flex',
      'items-center',
    )
  })
})
