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
    'w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors'

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl p-10 md:p-16 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">{tr.headline}</h2>
          <p className="text-zinc-400">{tr.subtext}</p>
        </div>

        {status === 'success' ? (
          <p className="text-center text-green-400 font-semibold">{tr.success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">{tr.namePlaceholder}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tr.phonePlaceholder}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tr.emailPlaceholder}</label>
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
              className="bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded transition-colors"
            >
              {status === 'loading' ? '...' : tr.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
