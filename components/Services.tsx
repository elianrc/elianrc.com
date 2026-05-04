'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { whatsappUrl } from '@/lib/constants'

export default function Services() {
  const { lang } = useLanguage()
  const tr = t[lang].services

  const half = Math.ceil(tr.items.length / 2)
  const col1 = tr.items.slice(0, half)
  const col2 = tr.items.slice(half)

  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{tr.headline}</h2>
          <p className="text-zinc-400">{tr.subtext}</p>
          <div className="grid grid-cols-2 gap-3">
            {col1.map((item) => (
              <div key={item} className="flex items-center gap-2 text-white">
                <Check className="text-green-400 w-4 h-4 shrink-0" />
                {item}
              </div>
            ))}
            {col2.map((item) => (
              <div key={item} className="flex items-center gap-2 text-white">
                <Check className="text-green-400 w-4 h-4 shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm">{tr.extra}</p>
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
            src="/images/services.png"
            alt="Services"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  )
}
