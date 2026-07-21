import { describe, expect, it } from 'vitest'
import { whatsappUrl } from '../src/data/constants'
import { t } from '../src/data/translations'

describe('Astro content data', () => {
  it('keeps Spanish and English hero copy', () => {
    expect(t.es.hero.headline).toBe('Websites que impulsan ventas')
    expect(t.en.hero.headline).toBe('Websites That Drive Sales')
  })

  it('keeps language-specific WhatsApp messages', () => {
    expect(whatsappUrl('es')).toContain('Hola')
    expect(whatsappUrl('en')).toContain('Hi')
  })
})
