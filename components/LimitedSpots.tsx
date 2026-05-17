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
    'w-full bg-zinc-950/60 border border-zinc-300/80 rounded px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors'

  return (
    <section className="contact-overlap-section relative pt-20 pb-0 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <Container>
        <div className="relative z-20 -mb-20 md:-mb-28 max-w-4xl mx-auto bg-[#0b0f1d] rounded-xl p-7 md:p-12 lg:p-16 space-y-7 shadow-2xl shadow-black/35">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-none">{tr.headline}</h2>
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
                className="bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-semibold px-8 py-3 rounded transition-colors"
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
