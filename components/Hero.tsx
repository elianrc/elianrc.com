'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { whatsappUrl } from '@/lib/constants'

export default function Hero() {
  const { lang } = useLanguage()
  const tr = t[lang].hero

  return (
    <section className="min-h-screen flex items-center pt-20 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight uppercase">
            {tr.headline}
          </h1>
          <p className="text-zinc-400 text-lg">{tr.subtext}</p>
          <a
            href={whatsappUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {tr.cta}
          </a>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/project-ohd.jpg"
            alt="Project showcase"
            className="max-w-full h-auto rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
