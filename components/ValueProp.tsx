'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Container from '@/components/Container'
import { t } from '@/lib/translations'

export default function ValueProp() {
  const { lang } = useLanguage()
  const tr = t[lang].valueProp
  const di = t[lang].digitalIdentity

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-24 bg-zinc-950">
      <Container>
        <div className="mx-auto max-w-4xl space-y-5 text-center sm:space-y-6">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest">
            {tr.badge}
          </p>
          <h2 className="text-2xl font-bold italic sm:text-3xl md:text-5xl">{tr.headline}</h2>
          <p className="leading-relaxed text-white">{tr.body}</p>
          <div className="pt-4">
            <p className="text-white">{tr.tagline}</p>
            <p className="font-bold">{tr.taglineBold}</p>
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-4xl sm:mt-16">
          <img
            src="/images/project-ohd-2.jpg"
            alt="Website showcase"
            className="h-auto w-full rounded-lg"
          />

          <div className="mt-4 max-w-full rounded-lg bg-zinc-900/95 px-5 py-4 sm:max-w-xs md:absolute md:bottom-8 md:left-8 md:mt-0 md:max-w-[200px]">
            <p>
              <span className="text-brand font-bold italic">{di.headlineGreen}</span>
              <br />
              <span className="text-white">{di.headlineWhite}</span>
            </p>
          </div>

          <div className="mt-4 max-w-full rounded-lg bg-white px-5 py-5 shadow-xl sm:max-w-xs md:absolute md:top-1/2 md:right-0 md:mt-0 md:-translate-y-1/2 md:translate-x-8 md:px-6">
            <p className="mb-3 font-bold italic text-zinc-900">{di.specializedTitle}</p>
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
      </Container>
    </section>
  )
}
