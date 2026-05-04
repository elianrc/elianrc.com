'use client'

import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { whatsappUrl } from '@/lib/constants'

export default function MeetingCTA() {
  const { lang } = useLanguage()
  const tr = t[lang].meetingCTA

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-900">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img
            src="/images/google-meet.png"
            alt="Google Meet"
            className="w-40 h-40 object-contain"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">{tr.headline}</h2>
          <ul className="space-y-3">
            {tr.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-zinc-300">{bullet}</span>
              </li>
            ))}
          </ul>
          <a
            href={whatsappUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {tr.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
