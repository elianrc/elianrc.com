'use client'

import { CircleCheckBig } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Container from '@/components/Container'
import { t } from '@/lib/translations'
import { whatsappUrl } from '@/lib/constants'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function MeetingCTA() {
  const { lang } = useLanguage()
  const tr = t[lang].meetingCTA

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-24 bg-zinc-950">
      <Container>
        <h2 className="mb-10 text-center text-2xl font-bold italic sm:text-3xl md:mb-16 md:text-4xl lg:text-5xl">
          {tr.headline}
        </h2>

        <div className="grid min-w-0 grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-12">
          <div className="flex min-w-0 justify-center">
            <img
              src="/images/google-meet.png"
              alt="Google Meet"
              className="min-w-0 w-full max-w-md object-contain"
            />
          </div>

          <div className="min-w-0 space-y-6">
            <p className="leading-relaxed text-white">{tr.intro}</p>
            <ul className="space-y-3">
              {tr.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CircleCheckBig className="text-brand w-5 h-5 mt-0.5 shrink-0" />
                  <span className="text-white">{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="text-brand font-bold italic underline">{tr.closing}</p>
            <a
              href={whatsappUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover sm:w-auto"
            >
              <WhatsAppIcon className="w-5 h-5" />
              {tr.cta}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
