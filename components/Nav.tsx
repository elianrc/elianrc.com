'use client'

import { useLanguage } from '@/context/LanguageContext'
import Container from '@/components/Container'
import { t } from '@/lib/translations'

export default function Nav() {
  const { lang, toggle } = useLanguage()
  const tr = t[lang].nav

  return (
    <nav className="px-4 py-4 sm:px-6 md:px-8 lg:px-12 bg-zinc-950">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <a href="#" className="shrink-0">
          <img src="/images/dark-back-logo.png" alt="Elián RC" className="h-12 w-auto sm:h-14 md:h-16" />
        </a>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:justify-end md:gap-x-8 md:text-base">
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
            className="min-h-9 rounded border border-zinc-700 px-3 py-1 text-sm font-semibold text-white transition-colors hover:border-brand hover:text-brand"
          >
            {tr.langToggle}
          </button>
        </div>
      </Container>
    </nav>
  )
}
