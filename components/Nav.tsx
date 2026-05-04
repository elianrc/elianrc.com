'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function Nav() {
  const { lang, toggle } = useLanguage()
  const tr = t[lang].nav

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-8 bg-zinc-950">
      <a href="#">
        <img src="/images/dark-back-logo.png" alt="Elián RC" className="h-16 md:h-20 w-auto" />
      </a>

      <div className="flex items-center gap-8">
        <a href="#" className="text-zinc-300 hover:text-green-400 transition-colors">
          Inicio
        </a>
        <a href="#services" className="text-zinc-300 hover:text-green-400 transition-colors">
          {tr.services}
        </a>
        <a href="#portfolio" className="text-zinc-300 hover:text-green-400 transition-colors">
          Portfolio
        </a>
        <button
          onClick={toggle}
          className="text-sm font-semibold text-zinc-300 hover:text-green-400 transition-colors border border-zinc-700 hover:border-green-400 rounded px-2 py-1"
        >
          {tr.langToggle}
        </button>
      </div>
    </nav>
  )
}
