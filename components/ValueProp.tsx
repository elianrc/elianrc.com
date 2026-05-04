'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function ValueProp() {
  const { lang } = useLanguage()
  const tr = t[lang].valueProp
  const di = t[lang].digitalIdentity

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-brand text-sm font-semibold uppercase tracking-widest">
          {tr.badge}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold italic">{tr.headline}</h2>
        <p className="text-white leading-relaxed">{tr.body}</p>
        <div className="pt-4">
          <p className="text-white">{tr.tagline}</p>
          <p className="font-bold">{tr.taglineBold}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 relative">
        <img
          src="/images/project-ohd-2.jpg"
          alt="Website showcase"
          className="w-full h-auto rounded-xl"
        />

        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-zinc-900/95 rounded-xl px-5 py-4 max-w-[200px]">
          <p>
            <span className="text-brand font-bold italic">{di.headlineGreen}</span>
            <br />
            <span className="text-white">{di.headlineWhite}</span>
          </p>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 md:right-0 md:translate-x-8 bg-white rounded-xl px-6 py-5 shadow-xl">
          <p className="font-bold italic text-zinc-900 mb-3">{di.specializedTitle}</p>
          <ul className="space-y-2">
            {di.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-zinc-800 text-sm">
                <Check className="w-4 h-4 text-zinc-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-zinc-600 text-sm mt-2 pl-6">{di.more}</p>
        </div>
      </div>
    </section>
  )
}
