import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import RootLayout from '@/app/layout'
import localFont from 'next/font/local'

vi.mock('next/font/local', () => ({
  default: vi.fn(() => ({
    className: 'montserrat-class',
    variable: 'montserrat-variable',
  })),
}))

describe('RootLayout typography', () => {
  it('exposes and applies Montserrat globally', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>Typography</p>
      </RootLayout>,
    )

    expect(localFont).toHaveBeenCalledWith(
      expect.objectContaining({
        variable: '--font-montserrat',
      }),
    )
    expect(markup).toContain('montserrat-class')
    expect(markup).toContain('montserrat-variable')
  })
})
