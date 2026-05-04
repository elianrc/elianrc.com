# elianrc.com Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate elianrc.com from WordPress to a Next.js 14+ App Router single-page site with Tailwind CSS, TypeScript, bilingual ES/EN toggle, and Resend contact form, deployed on Vercel.

**Architecture:** Single `app/page.tsx` renders all sections as React components. Language state lives in `LanguageContext` and is consumed by every component via `useLanguage()`. All UI strings are in `lib/translations.ts`; portfolio data in `lib/projects.ts`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Resend, Vitest + React Testing Library, Lucide React (icons), Vercel

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: fonts, metadata, wraps children in `LanguageProvider` |
| `app/page.tsx` | Composes all section components in order |
| `app/globals.css` | Tailwind directives + any global resets |
| `app/api/contact/route.ts` | POST handler: validates fields, sends email via Resend |
| `context/LanguageContext.tsx` | `Lang` type, `LanguageProvider`, `useLanguage` hook |
| `lib/translations.ts` | All ES/EN strings keyed by section |
| `lib/projects.ts` | `Project` type + `projects` array |
| `lib/constants.ts` | `whatsappUrl(lang)` helper, social links |
| `components/Nav.tsx` | Logo, anchor links, ES/EN toggle button |
| `components/Hero.tsx` | Headline, subtext, WhatsApp CTA, laptop image |
| `components/ValueProp.tsx` | Badge, trust headline, body, brand mockup image |
| `components/Services.tsx` | Two-column checklist, extra text, WhatsApp CTA |
| `components/Features.tsx` | 3 icon cards |
| `components/Portfolio.tsx` | Project grid from `projects.ts`, empty state |
| `components/MeetingCTA.tsx` | 20-min consultation, bullet list, WhatsApp button |
| `components/About.tsx` | Photo, bio, social icon row |
| `components/LimitedSpots.tsx` | Contact form with fetch submission and inline feedback |
| `components/Footer.tsx` | Mini bio, quick links, social icons, copyright |
| `__tests__/LanguageContext.test.tsx` | Unit tests for toggle logic |
| `__tests__/api/contact.test.ts` | Unit tests for API route validation |
| `.env.local` | `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| `.env.example` | Template for the above (committed to git) |

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: all project files via `create-next-app`
- Delete: `app/page.tsx` boilerplate content, `public/` placeholder files

- [ ] **Step 1: Run create-next-app in the existing directory**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted about the existing directory, choose to continue. Accept all other defaults.

- [ ] **Step 2: Clear boilerplate from app/page.tsx**

Replace the entire file content with:

```tsx
// app/page.tsx
export default function Home() {
  return <main>elianrc.com</main>
}
```

- [ ] **Step 3: Clear app/globals.css down to Tailwind directives only**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Delete unused public files**

```bash
rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 5: Add .superpowers to .gitignore**

Open `.gitignore` and add at the bottom:
```
.superpowers/
.env.local
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000 — should show "elianrc.com" text with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 App Router project"
```

---

## Task 2: Install dependencies + configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install resend lucide-react
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Create vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 4: Create vitest.setup.ts**

```ts
// vitest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

Open `package.json` and add to the `scripts` object:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Create __tests__ directories**

```bash
mkdir -p __tests__/api
```

- [ ] **Step 7: Verify Vitest runs (no tests yet)**

```bash
npm test
```

Expected output: `No test files found` or similar — no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: add resend, lucide-react, vitest + RTL testing setup"
```

---

## Task 3: lib/constants.ts

**Files:**
- Create: `lib/constants.ts`

- [ ] **Step 1: Create the constants file**

```ts
// lib/constants.ts
export function whatsappUrl(lang: 'es' | 'en'): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const message =
    lang === 'es'
      ? 'Hola, me gustaría saber más sobre tus servicios.'
      : 'Hi, I would like to know more about your services.'
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/elianrc',
  linkedin: 'https://linkedin.com/in/elianrc',
  github: 'https://github.com/elianrc',
  whatsapp: () => whatsappUrl('es'),
}
```

> **Note:** Update `SOCIAL_LINKS` URLs to your actual handles before deploying.

- [ ] **Step 2: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: add whatsappUrl helper and social links constants"
```

---

## Task 4: LanguageContext (with tests)

**Files:**
- Create: `context/LanguageContext.tsx`
- Create: `__tests__/LanguageContext.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// __tests__/LanguageContext.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LanguageProvider, useLanguage } from '@/context/LanguageContext'

function Toggle() {
  const { lang, toggle } = useLanguage()
  return (
    <>
      <span data-testid="lang">{lang}</span>
      <button onClick={toggle}>toggle</button>
    </>
  )
}

describe('LanguageContext', () => {
  it('defaults to es', () => {
    render(<LanguageProvider><Toggle /></LanguageProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })

  it('toggles to en on first click', () => {
    render(<LanguageProvider><Toggle /></LanguageProvider>)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('toggles back to es on second click', () => {
    render(<LanguageProvider><Toggle /></LanguageProvider>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: `Cannot find module '@/context/LanguageContext'`

- [ ] **Step 3: Create the context**

```tsx
// context/LanguageContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'es' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')
  const toggle = () => setLang((l) => (l === 'es' ? 'en' : 'es'))
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add context/LanguageContext.tsx __tests__/LanguageContext.test.tsx
git commit -m "feat: add LanguageContext with ES/EN toggle"
```

---

## Task 5: lib/translations.ts

**Files:**
- Create: `lib/translations.ts`

- [ ] **Step 1: Create translations file with all ES/EN strings**

```ts
// lib/translations.ts
export const t = {
  es: {
    nav: {
      services: 'Servicios',
      portfolio: 'Portfolio',
      langToggle: 'EN',
    },
    hero: {
      headline: 'Websites que Impulsan Ventas',
      subtext:
        'Cuando sus clientes visitan su website, deberían pensar "Wow, esta empresa sabe lo que hace".',
      help: 'Yo puedo ayudarte a lograr eso.',
      cta: 'Háblame por WhatsApp',
    },
    valueProp: {
      badge: 'Moderno. Funcional. Diseñado con propósito',
      headline: 'Websites que generan confianza y resultados',
      body: 'Cada empresa merece una presencia online que hable por sí misma. Yo diseño websites que no solo se ven bien, sino que conectan con su público y ayudan a convertir visitantes en clientes.',
      tagline:
        'Desde la idea hasta la publicación, mi meta es una sola: que su negocio crezca con un website claro, rápido y profesional.',
    },
    services: {
      headline: 'Soluciones y Resultados',
      subtext:
        'Me encargo de todo lo que su website necesita para destacar y funcionar sin preocupaciones.',
      items: ['Dominio', 'Alojamiento', 'Diseño', 'Seguridad', 'Mantenimiento', 'Emails'],
      extra:
        'Además, puede complementar su proyecto con servicios como creación de contenido, SEO, optimización de imágenes y videos, y mucho más.',
      cta: 'Háblame por WhatsApp',
    },
    features: [
      {
        title: 'Pagos Flexibles',
        body: 'Planes de pago ajustados a su presupuesto. Mi meta es que pueda invertir en su website sin afectar su crecimiento.',
      },
      {
        title: 'Diseño Personalizado',
        body: 'Cada website refleja la esencia de su marca. Integro su logo, colores e identidad para proyectar profesionalismo y coherencia visual.',
      },
      {
        title: 'Soporte de Confianza',
        body: 'Comunicación directa por WhatsApp. Le acompaño personalmente en cada etapa para garantizarle atención rápida y confiable.',
      },
    ],
    meetingCTA: {
      headline: 'Agenda una cita gratuita de 20 minutos',
      bullets: [
        'Le mostraré ejemplos de mis proyectos.',
        'Le brindaré una propuesta ajustada a su negocio.',
        'Todo en una conversación breve y sin compromisos.',
      ],
      cta: 'Agendar por WhatsApp',
    },
    portfolio: {
      headline: 'Portfolio',
      empty: 'Proyectos próximamente.',
    },
    about: {
      headline: 'Sobre Mí',
      body: 'Desde pequeño me interesó profundamente la tecnología. Estudié Ciencias de Computadores en el Silicon Valley, donde fortalecí mi enfoque en resolver problemas reales a través del diseño y la programación. Puede conocer mi experiencia laboral en mi LinkedIn.',
      connect: '¡Conectemos!',
    },
    limitedSpots: {
      headline: 'Espacios Limitados',
      subtext:
        'Trabajo con una cantidad limitada de clientes al mes. Reserve su espacio y reciba atención personalizada para su website.',
      namePlaceholder: 'Nombre',
      phonePlaceholder: 'Teléfono',
      emailPlaceholder: 'Email',
      submit: 'Enviar',
      success: '¡Mensaje enviado! Le responderé pronto.',
      error: 'Hubo un error. Por favor intente de nuevo.',
    },
    footer: {
      aboutTitle: 'Sobre Mí',
      aboutText:
        'Desde pequeño me interesó profundamente la tecnología. Hoy en día, vivo ayudando a negocios a crecer mediante el uso de la misma, especialmente websites.',
      quickLinks: 'Quick Links',
      connect: 'Connect with Me!',
      copyright: `© ${new Date().getFullYear()} Elián RC.`,
      terms: 'Términos y Condiciones',
    },
  },
  en: {
    nav: {
      services: 'Services',
      portfolio: 'Portfolio',
      langToggle: 'ES',
    },
    hero: {
      headline: 'Websites That Drive Sales',
      subtext:
        'When your clients visit your website, they should think "Wow, this company knows what they\'re doing."',
      help: 'I can help you get there.',
      cta: 'Message me on WhatsApp',
    },
    valueProp: {
      badge: 'Modern. Functional. Designed with purpose',
      headline: 'Websites that build trust and deliver results',
      body: "Every business deserves an online presence that speaks for itself. I design websites that don't just look good — they connect with your audience and turn visitors into clients.",
      tagline:
        'From idea to launch, my goal is simple: grow your business with a clear, fast, and professional website.',
    },
    services: {
      headline: 'Solutions & Results',
      subtext: 'I handle everything your website needs to stand out and run without worry.',
      items: ['Domain', 'Hosting', 'Design', 'Security', 'Maintenance', 'Email'],
      extra:
        'You can also add services like content creation, SEO, image and video optimization, and more.',
      cta: 'Message me on WhatsApp',
    },
    features: [
      {
        title: 'Flexible Payments',
        body: 'Payment plans adjusted to your budget. My goal is for you to invest in your website without affecting your growth.',
      },
      {
        title: 'Custom Design',
        body: "Every website reflects your brand's essence. I integrate your logo, colors, and identity to project professionalism and visual consistency.",
      },
      {
        title: 'Reliable Support',
        body: 'Direct communication via WhatsApp. I accompany you personally at every stage to guarantee fast, trustworthy attention.',
      },
    ],
    meetingCTA: {
      headline: 'Schedule a free 20-minute call',
      bullets: [
        "I'll show you examples of my projects.",
        "I'll provide a proposal tailored to your business.",
        'All in a brief, no-commitment conversation.',
      ],
      cta: 'Schedule via WhatsApp',
    },
    portfolio: {
      headline: 'Portfolio',
      empty: 'Projects coming soon.',
    },
    about: {
      headline: 'About Me',
      body: "I've had a deep interest in technology since I was young. I studied Computer Science in Silicon Valley, where I sharpened my focus on solving real problems through design and programming. Check out my work experience on LinkedIn.",
      connect: "Let's connect!",
    },
    limitedSpots: {
      headline: 'Limited Spots',
      subtext:
        'I work with a limited number of clients per month. Reserve your spot and receive personalized attention for your website.',
      namePlaceholder: 'Name',
      phonePlaceholder: 'Phone',
      emailPlaceholder: 'Email',
      submit: 'Send',
      success: "Message sent! I'll get back to you soon.",
      error: 'There was an error. Please try again.',
    },
    footer: {
      aboutTitle: 'About Me',
      aboutText:
        "I've had a deep interest in technology since I was young. Today I help businesses grow through it, especially websites.",
      quickLinks: 'Quick Links',
      connect: 'Connect with Me!',
      copyright: `© ${new Date().getFullYear()} Elián RC.`,
      terms: 'Terms & Conditions',
    },
  },
} as const
```

- [ ] **Step 2: Commit**

```bash
git add lib/translations.ts
git commit -m "feat: add full ES/EN translations"
```

---

## Task 6: lib/projects.ts

**Files:**
- Create: `lib/projects.ts`

- [ ] **Step 1: Create projects data file**

```ts
// lib/projects.ts
export type Project = {
  title: string
  description: string
  url: string
  tags: string[]
  image?: string
}

export const projects: Project[] = [
  // Add your projects here. Example:
  // {
  //   title: 'My Client Site',
  //   description: 'E-commerce for a local bakery.',
  //   url: 'https://example.com',
  //   tags: ['E-commerce', 'WordPress'],
  //   image: '/images/projects/bakery.png',
  // },
]
```

- [ ] **Step 2: Commit**

```bash
git add lib/projects.ts
git commit -m "feat: add projects data file"
```

---

## Task 7: app/layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout with fonts, metadata, and LanguageProvider**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elián RC — Web Designer & Developer',
  description:
    'Diseño websites modernos, rápidos y funcionales que generan confianza y resultados. / I design modern, fast, and functional websites that build trust and deliver results.',
  metadataBase: new URL('https://elianrc.com'),
  openGraph: {
    title: 'Elián RC — Web Designer & Developer',
    description: 'Websites que impulsan ventas.',
    url: 'https://elianrc.com',
    siteName: 'Elián RC',
    locale: 'es_CR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify dev server still loads**

```bash
npm run dev
```

Open http://localhost:3000 — page loads, no console errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: configure root layout with fonts, metadata, LanguageProvider"
```

---

## Task 8: Nav component

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Create Nav.tsx**

```tsx
// components/Nav.tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function Nav() {
  const { lang, toggle } = useLanguage()
  const tr = t[lang].nav

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <a href="#" className="flex items-center gap-2">
        <span className="text-green-400 font-bold text-xl">⊟ ELIAN RC</span>
        <span className="hidden sm:block text-zinc-400 text-xs uppercase tracking-widest">
          Web Designer + Developer
        </span>
      </a>

      <div className="flex items-center gap-6">
        <a href="#services" className="text-sm text-zinc-300 hover:text-green-400 transition-colors">
          {tr.services}
        </a>
        <a href="#portfolio" className="text-sm text-zinc-300 hover:text-green-400 transition-colors">
          {tr.portfolio}
        </a>
        <button
          onClick={toggle}
          className="text-sm font-semibold text-zinc-300 hover:text-green-400 transition-colors border border-zinc-700 hover:border-green-400 rounded px-2 py-1"
        >
          {tr.langToggle}
        </button>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Add Nav to page.tsx and verify**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'

export default function Home() {
  return (
    <main>
      <Nav />
    </main>
  )
}
```

Open http://localhost:3000 — nav bar visible, language toggle switches between EN/ES labels.

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx app/page.tsx
git commit -m "feat: add Nav with language toggle"
```

---

## Task 9: Hero component

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Add hero image to public/images/**

```bash
mkdir -p public/images
```

Copy your laptop/hero image from the WordPress site to `public/images/hero.png`. If you don't have it yet, use a placeholder — the `<img>` tag will just show broken until the image is added.

- [ ] **Step 2: Create Hero.tsx**

```tsx
// components/Hero.tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { whatsappUrl } from '@/lib/constants'

export default function Hero() {
  const { lang } = useLanguage()
  const tr = t[lang].hero

  return (
    <section className="min-h-screen flex items-center pt-20 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight uppercase">
            {tr.headline}
          </h1>
          <p className="text-zinc-400 text-lg">{tr.subtext}</p>
          <p className="text-green-400 font-medium">{tr.help}</p>
          <a
            href={whatsappUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {tr.cta}
          </a>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/hero.png"
            alt="Hero"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add Hero to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
    </main>
  )
}
```

- [ ] **Step 4: Verify**

Open http://localhost:3000 — Hero section visible below nav. WhatsApp link opens WhatsApp (you'll need `NEXT_PUBLIC_WHATSAPP_NUMBER` set in `.env.local` for a valid link).

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx app/page.tsx public/images/
git commit -m "feat: add Hero section"
```

---

## Task 10: ValueProp component

**Files:**
- Create: `components/ValueProp.tsx`

- [ ] **Step 1: Add brand mockup image**

Copy your brand mockup image (the one showing devices with your brand) to `public/images/valueprop.png`.

- [ ] **Step 2: Create ValueProp.tsx**

```tsx
// components/ValueProp.tsx
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
              src="/images/valueprop.png"
              alt="Brand mockup"
              className="max-w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
    </main>
  )
}
```

- [ ] **Step 4: Verify at http://localhost:3000**

- [ ] **Step 5: Commit**

```bash
git add components/ValueProp.tsx app/page.tsx
git commit -m "feat: add ValueProp section"
```

---

## Task 11: Services component

**Files:**
- Create: `components/Services.tsx`

- [ ] **Step 1: Add services image to public/images/**

Copy the laptop/workspace image used in the services section to `public/images/services.png`.

- [ ] **Step 2: Create Services.tsx**

```tsx
// components/Services.tsx
'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { whatsappUrl } from '@/lib/constants'

export default function Services() {
  const { lang } = useLanguage()
  const tr = t[lang].services

  const half = Math.ceil(tr.items.length / 2)
  const col1 = tr.items.slice(0, half)
  const col2 = tr.items.slice(half)

  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{tr.headline}</h2>
          <p className="text-zinc-400">{tr.subtext}</p>
          <div className="grid grid-cols-2 gap-3">
            {col1.map((item) => (
              <div key={item} className="flex items-center gap-2 text-white">
                <Check className="text-green-400 w-4 h-4 shrink-0" />
                {item}
              </div>
            ))}
            {col2.map((item) => (
              <div key={item} className="flex items-center gap-2 text-white">
                <Check className="text-green-400 w-4 h-4 shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm">{tr.extra}</p>
          <a
            href={whatsappUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {tr.cta}
          </a>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/services.png"
            alt="Services"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
    </main>
  )
}
```

- [ ] **Step 4: Verify at http://localhost:3000**

- [ ] **Step 5: Commit**

```bash
git add components/Services.tsx app/page.tsx
git commit -m "feat: add Services section"
```

---

## Task 12: Features component

**Files:**
- Create: `components/Features.tsx`

- [ ] **Step 1: Create Features.tsx**

```tsx
// components/Features.tsx
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
```

- [ ] **Step 2: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
    </main>
  )
}
```

- [ ] **Step 3: Verify at http://localhost:3000**

- [ ] **Step 4: Commit**

```bash
git add components/Features.tsx app/page.tsx
git commit -m "feat: add Features section (3 cards)"
```

---

## Task 13: Portfolio component

**Files:**
- Create: `components/Portfolio.tsx`

- [ ] **Step 1: Create Portfolio.tsx**

```tsx
// components/Portfolio.tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { projects } from '@/lib/projects'
import { ExternalLink } from 'lucide-react'

export default function Portfolio() {
  const { lang } = useLanguage()
  const tr = t[lang].portfolio

  return (
    <section id="portfolio" className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{tr.headline}</h2>
        {projects.length === 0 ? (
          <p className="text-center text-zinc-500">{tr.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-zinc-800 rounded-xl overflow-hidden hover:border-green-400 transition-colors"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold group-hover:text-green-400 transition-colors">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-zinc-500" />
                  </div>
                  <p className="text-zinc-400 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Portfolio from '@/components/Portfolio'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <Portfolio />
    </main>
  )
}
```

- [ ] **Step 3: Verify — empty state message visible at http://localhost:3000#portfolio**

- [ ] **Step 4: Commit**

```bash
git add components/Portfolio.tsx app/page.tsx
git commit -m "feat: add Portfolio section with empty state"
```

---

## Task 14: MeetingCTA component

**Files:**
- Create: `components/MeetingCTA.tsx`

- [ ] **Step 1: Create MeetingCTA.tsx**

```tsx
// components/MeetingCTA.tsx
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
          {/* Google Meet icon placeholder — replace with actual image if desired */}
          <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center text-5xl">
            📅
          </div>
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
```

- [ ] **Step 2: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Portfolio from '@/components/Portfolio'
import MeetingCTA from '@/components/MeetingCTA'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <Portfolio />
      <MeetingCTA />
    </main>
  )
}
```

- [ ] **Step 3: Verify at http://localhost:3000**

- [ ] **Step 4: Commit**

```bash
git add components/MeetingCTA.tsx app/page.tsx
git commit -m "feat: add MeetingCTA section"
```

---

## Task 15: About component

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Add your photo**

Copy your profile photo to `public/images/elian.png`.

- [ ] **Step 2: Create About.tsx**

```tsx
// components/About.tsx
'use client'

import { Twitter, Linkedin, Github } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function About() {
  const { lang } = useLanguage()
  const tr = t[lang].about

  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{tr.headline}</h2>
          <p className="text-zinc-400 leading-relaxed">{tr.body}</p>
          <p className="text-green-400 font-semibold">{tr.connect}</p>
          <div className="flex gap-4">
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/elian.png"
            alt="Elián RC"
            className="w-64 h-64 object-cover rounded-full border-4 border-green-400"
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Portfolio from '@/components/Portfolio'
import MeetingCTA from '@/components/MeetingCTA'
import About from '@/components/About'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <Portfolio />
      <MeetingCTA />
      <About />
    </main>
  )
}
```

- [ ] **Step 4: Verify at http://localhost:3000**

- [ ] **Step 5: Commit**

```bash
git add components/About.tsx app/page.tsx
git commit -m "feat: add About section with social links"
```

---

## Task 16: LimitedSpots component (form UI only)

**Files:**
- Create: `components/LimitedSpots.tsx`

- [ ] **Step 1: Create LimitedSpots.tsx with form UI and local state**

```tsx
// components/LimitedSpots.tsx
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
```

- [ ] **Step 2: Add to page.tsx**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Portfolio from '@/components/Portfolio'
import MeetingCTA from '@/components/MeetingCTA'
import About from '@/components/About'
import LimitedSpots from '@/components/LimitedSpots'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <Portfolio />
      <MeetingCTA />
      <About />
      <LimitedSpots />
    </main>
  )
}
```

- [ ] **Step 3: Verify form renders at http://localhost:3000 (submission will fail until API route is built)**

- [ ] **Step 4: Commit**

```bash
git add components/LimitedSpots.tsx app/page.tsx
git commit -m "feat: add LimitedSpots section with contact form UI"
```

---

## Task 17: Contact API route (with tests)

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `__tests__/api/contact.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/api/contact.test.ts
import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/contact/route'

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    },
  })),
}))

function makeRequest(body: Record<string, string>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ name: '', phone: '123', email: 'a@b.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when phone is missing', async () => {
    const res = await POST(makeRequest({ name: 'Test', phone: '', email: 'a@b.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is invalid', async () => {
    const res = await POST(makeRequest({ name: 'Test', phone: '123', email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 200 when all fields are valid', async () => {
    const res = await POST(makeRequest({ name: 'Test', phone: '123', email: 'test@example.com' }))
    expect(res.status).toBe(200)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: `Cannot find module '@/app/api/contact/route'`

- [ ] **Step 3: Create the API route**

```ts
// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  const { name, phone, email } = await req.json()

  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'elianrc.com <noreply@elianrc.com>',
    to: process.env.CONTACT_EMAIL ?? '',
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}`,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected: `4 passed` (3 from LanguageContext + 4 new = 7 total)

- [ ] **Step 5: Commit**

```bash
git add app/api/contact/route.ts __tests__/api/contact.test.ts
git commit -m "feat: add contact API route with Resend integration"
```

---

## Task 18: Footer component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create Footer.tsx**

```tsx
// components/Footer.tsx
'use client'

import { Twitter, Linkedin, Github, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { SOCIAL_LINKS, whatsappUrl } from '@/lib/constants'

export default function Footer() {
  const { lang } = useLanguage()
  const tr = t[lang].footer

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About mini */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">⊟ ELIAN RC</span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{tr.aboutText}</p>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-zinc-400">
            {tr.quickLinks}
          </h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-zinc-300 hover:text-green-400 text-sm transition-colors">Inicio</a></li>
            <li><a href="#services" className="text-zinc-300 hover:text-green-400 text-sm transition-colors">{t[lang].nav.services}</a></li>
            <li><a href="#portfolio" className="text-zinc-300 hover:text-green-400 text-sm transition-colors">{t[lang].nav.portfolio}</a></li>
            <li><a href={whatsappUrl(lang)} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-green-400 text-sm transition-colors">WhatsApp</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-zinc-400">
            {tr.connect}
          </h4>
          <div className="flex gap-4">
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href={whatsappUrl(lang)} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-zinc-500 text-sm">{tr.copyright}</p>
        <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          {tr.terms}
        </a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Add to page.tsx — final composition**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Portfolio from '@/components/Portfolio'
import MeetingCTA from '@/components/MeetingCTA'
import About from '@/components/About'
import LimitedSpots from '@/components/LimitedSpots'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <Portfolio />
      <MeetingCTA />
      <About />
      <LimitedSpots />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 3: Verify full page at http://localhost:3000**

Scroll through all sections. Language toggle in Nav should update all text. Anchor links should scroll to correct sections.

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: add Footer and complete page composition"
```

---

## Task 19: Environment variables + .env.example

**Files:**
- Create: `.env.local` (not committed)
- Create: `.env.example` (committed)

- [ ] **Step 1: Create .env.local**

Create the file (not in git — already in .gitignore):

```
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=elian_rc@yahoo.com
NEXT_PUBLIC_WHATSAPP_NUMBER=50688888888
```

Replace values with your actual:
- Resend API key from https://resend.com/api-keys
- Your phone number in international format without `+` (e.g. `50688888888` for Costa Rica)

- [ ] **Step 2: Create .env.example**

```
RESEND_API_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

- [ ] **Step 3: Verify contact form works end-to-end**

```bash
npm run dev
```

Open http://localhost:3000, scroll to Espacios Limitados, fill out the form, submit. Check your `CONTACT_EMAIL` inbox for the message.

- [ ] **Step 4: Commit .env.example**

```bash
git add .env.example
git commit -m "chore: add .env.example with required environment variables"
```

---

## Task 20: Deploy to Vercel

**Files:**
- No new files

- [ ] **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

- [ ] **Step 2: Login and link project**

```bash
vercel login
vercel link
```

Follow the prompts — create a new project named `elianrc-com`.

- [ ] **Step 3: Set environment variables in Vercel**

```bash
vercel env add RESEND_API_KEY
vercel env add CONTACT_EMAIL
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
```

Enter the values when prompted. Select `Production`, `Preview`, and `Development` for all three.

- [ ] **Step 4: Deploy**

```bash
vercel --prod
```

- [ ] **Step 5: Verify production site**

Open the deployment URL from the Vercel output. Check:
- All sections render
- Language toggle works
- WhatsApp links open correctly
- Contact form submits and email arrives

- [ ] **Step 6: Verify Resend domain**

In the Resend dashboard (https://resend.com/domains), add and verify `elianrc.com`. Until the domain is verified, use `onboarding@resend.dev` as the `from` address in `app/api/contact/route.ts` for testing.

- [ ] **Step 7: Point custom domain**

In Vercel dashboard → your project → Settings → Domains → Add `elianrc.com` and `www.elianrc.com`. Follow DNS instructions to update your domain registrar's nameservers or CNAME records.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "chore: finalize deployment configuration"
```

---

## Images Checklist

Before deploying you need these files in `public/images/`:

- [ ] `hero.png` — laptop/device image from Hero section
- [ ] `valueprop.png` — brand mockup image (devices showing your brand)
- [ ] `services.png` — workspace/laptop image from Services section
- [ ] `elian.png` — your profile photo

Export these from your WordPress site's media library or use fresh assets.
