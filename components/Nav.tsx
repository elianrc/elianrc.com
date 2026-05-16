'use client'

import { useLanguage } from '@/context/LanguageContext'
import Container from '@/components/Container'
import { t } from '@/lib/translations'

export default function Nav() {
  const { lang, toggle } = useLanguage()
  const tr = t[lang].nav

  return (
    <nav className="px-6 md:px-12 lg:px-24 py-8 bg-zinc-950">
      <Container className="flex items-center justify-between">
        <a href="#">
          <img src="/images/dark-back-logo.png" alt="Elián RC" className="h-16 md:h-20 w-auto" />
        </a>

        <div className="flex items-center gap-8">
          <a href="#" className="text-white hover:text-brand transition-colors">
            Inicio
          </a>
          <a href="#services" className="text-white hover:text-brand transition-colors">
            {tr.services}
          </a>
          <a href="#portfolio" className="text-white hover:text-brand transition-colors">
            Portfolio
          </a>
          <button
            onClick={toggle}
            className="text-sm font-semibold text-white hover:text-brand transition-colors border border-zinc-700 hover:border-brand rounded px-2 py-1"
          >
            {tr.langToggle}
          </button>
        </div>
      </Container>
    </nav>
  )
}
