'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function ValueProp() {
  const { lang } = useLanguage()
  const tr = t[lang].valueProp

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-green-400 text-sm font-semibold uppercase tracking-widest mb-6">
          {tr.badge}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">{tr.headline}</h2>
            <p className="text-zinc-400 leading-relaxed">{tr.body}</p>
            <p className="text-white font-semibold border-l-4 border-green-400 pl-4">
              {tr.tagline}
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/project-ohd-2.jpg"
              alt="Website showcase"
              className="max-w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
