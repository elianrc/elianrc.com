import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LanguageProvider, useLanguage } from '@/context/LanguageContext'

function Toggle() {
  const { lang, toggle } = useLanguage()
  return (
    <>
      <span data-testid="lang">{lang}</span>
      <button onClick={toggle}>toggle</button>
    </>
  )
}

describe('LanguageContext', () => {
  it('defaults to es', () => {
    render(<LanguageProvider><Toggle /></LanguageProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })

  it('toggles to en on first click', () => {
    render(<LanguageProvider><Toggle /></LanguageProvider>)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('toggles back to es on second click', () => {
    render(<LanguageProvider><Toggle /></LanguageProvider>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })
})
