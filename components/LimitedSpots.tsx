'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
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
    'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400 transition-colors'

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-900">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold uppercase">{tr.headline}</h2>
          <p className="text-zinc-400">{tr.subtext}</p>
        </div>

        {status === 'success' ? (
          <p className="text-center text-green-400 font-semibold">{tr.success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={tr.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder={tr.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="email"
              placeholder={tr.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
            {status === 'error' && (
              <p className="text-red-400 text-sm">{tr.error}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 text-black font-semibold py-3 rounded-lg transition-colors"
            >
              {status === 'loading' ? '...' : tr.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
