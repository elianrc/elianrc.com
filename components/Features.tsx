'use client'

import { CreditCard, Palette, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

const icons = [CreditCard, Palette, MessageCircle]

export default function Features() {
  const { lang } = useLanguage()
  const features = t[lang].features

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => {
          const Icon = icons[i]
          return (
            <div key={feature.title} className="space-y-4 p-6 rounded-xl border border-zinc-800">
              <Icon className="text-green-400 w-8 h-8" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
