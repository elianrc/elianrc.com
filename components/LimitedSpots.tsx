'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Container from '@/components/Container'
import { t } from '@/lib/translations'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function LimitedSpots() {
  const { lang } = useLanguage()
  const tr = t[lang].limitedSpots

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full rounded border border-zinc-300/80 bg-zinc-950/60 px-4 py-3 text-base text-white transition-colors focus:border-brand focus:outline-none'

  return (
    <section className="contact-overlap-section relative px-4 pt-14 pb-0 sm:px-6 sm:pt-20 md:px-8 lg:px-12 bg-zinc-950">
      <Container>
        <div className="relative z-20 mx-auto -mb-16 max-w-4xl space-y-7 rounded-lg bg-[#0b0f1d] p-5 shadow-2xl shadow-black/35 sm:p-7 md:-mb-28 md:p-12 lg:p-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">{tr.headline}</h2>
            <p className="max-w-2xl mx-auto text-white text-base leading-relaxed">{tr.subtext}</p>
          </div>

          {status === 'success' ? (
            <p className="text-center text-brand font-semibold">{tr.success}</p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
              <div>
                <label className="block text-base font-medium mb-2">{tr.namePlaceholder}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">{tr.phonePlaceholder}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">{tr.emailPlaceholder}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              {status === 'error' && (
                <p className="text-red-400 text-sm">{tr.error}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
              >
                {status === 'loading' ? '...' : tr.submit}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}
