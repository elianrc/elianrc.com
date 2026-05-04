'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function DigitalIdentity() {
  const { lang } = useLanguage()
  const tr = t[lang].digitalIdentity

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold">{tr.headline}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {tr.items.map((item) => (
            <span
              key={item}
              className="border border-zinc-700 rounded-full px-6 py-2 text-zinc-300 text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
