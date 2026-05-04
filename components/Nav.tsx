'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function Nav() {
  const { lang, toggle } = useLanguage()
  const tr = t[lang].nav

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <a href="#" className="flex items-center gap-2">
        <span className="text-green-400 font-bold text-xl">⊟ ELIAN RC</span>
        <span className="hidden sm:block text-zinc-400 text-xs uppercase tracking-widest">
          Web Designer + Developer
        </span>
      </a>

      <div className="flex items-center gap-6">
        <a href="#services" className="text-sm text-zinc-300 hover:text-green-400 transition-colors">
          {tr.services}
        </a>
        <a href="#portfolio" className="text-sm text-zinc-300 hover:text-green-400 transition-colors">
          {tr.portfolio}
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
