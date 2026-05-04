# elianrc.com — WordPress to Next.js Migration Design

**Date:** 2026-05-04
**Goal:** Migrate existing single-page WordPress site to Next.js 14+ (App Router) + TypeScript + Tailwind CSS, deployed on Vercel, with bilingual (ES/EN) support.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Email | Resend |
| i18n | Client-side React Context (language toggle, no URL routing) |

---

## Project Structure

```
elianrc.com/
├── app/
│   ├── layout.tsx              # Root layout, fonts, global metadata
│   ├── page.tsx                # Single page — renders all sections in order
│   ├── globals.css             # Tailwind base + any global styles
│   └── api/
│       └── contact/
│           └── route.ts        # POST handler — validates form, sends via Resend
├── components/
│   ├── Nav.tsx                 # Logo, anchor links, ES/EN toggle
│   ├── Hero.tsx                # Headline, subtext, WhatsApp CTA, laptop image
│   ├── ValueProp.tsx           # "Confianza y resultados" + brand mockup image
│   ├── Services.tsx            # Checklist + extra services + WhatsApp CTA
│   ├── Features.tsx            # 3 cards: Pagos Flexibles, Diseño, Soporte
│   ├── MeetingCTA.tsx          # "Agenda 20 min" + WhatsApp button
│   ├── About.tsx               # Photo, bio, social icons
│   ├── LimitedSpots.tsx        # "Espacios Limitados" + contact form
│   └── Footer.tsx              # Mini bio, quick links, social icons, copyright
├── context/
│   └── LanguageContext.tsx     # Language state (ES default), toggle function, useLanguage hook
├── lib/
│   ├── translations.ts         # All ES/EN strings keyed by section
│   └── projects.ts             # Portfolio data array
└── public/
    └── images/                 # Static assets (photos, logos)
```

---

## i18n

Language state lives in `LanguageContext`. Default is Spanish (`es`). A toggle button in `Nav.tsx` switches to English (`en`) and back.

```ts
// context/LanguageContext.tsx
type Lang = 'es' | 'en'
const LanguageContext = createContext<{ lang: Lang; toggle: () => void }>()
```

All UI strings live in `lib/translations.ts`:

```ts
export const t = {
  es: {
    nav: { services: 'Servicios', portfolio: 'Portfolio' },
    hero: { headline: 'Websites que Impulsan Ventas', cta: 'Háblame por WhatsApp' },
    // ...
  },
  en: {
    nav: { services: 'Services', portfolio: 'Portfolio' },
    hero: { headline: 'Websites That Drive Sales', cta: 'Message me on WhatsApp' },
    // ...
  },
}
```

Components consume via `const { lang } = useLanguage()` then access `t[lang].sectionName`.

---

## Sections (in render order)

1. **Nav** — Logo, anchor links (`#services`, `#portfolio`, `#about`), ES/EN toggle button
2. **Hero** — Main headline, tagline, "Yo puedo ayudarte" text, WhatsApp CTA button, laptop image (right side)
3. **ValueProp** — "Moderno. Funcional. Diseñado con propósito" badge, trust headline, body text, brand mockup image
4. **Services** — "Soluciones y Resultados" heading, two-column checklist (Dominio, Alojamiento, Diseño, Seguridad, Mantenimiento, Emails), extra services text, WhatsApp CTA
5. **Features** — 3 icon cards: Pagos Flexibles, Diseño Personalizado, Soporte de Confianza
6. **MeetingCTA** — "Agenda una cita gratuita de 20 minutos", Meet icon, bullet list, WhatsApp button
7. **About** — "Sobre Mí" heading, photo, bio paragraph, LinkedIn mention, social icon row
8. **LimitedSpots** — "Espacios Limitados" heading, subtext, form (Nombre, Teléfono, Email, submit)
9. **Footer** — Mini bio, quick links column, social icons column, copyright line

---

## Portfolio Data

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
  // entries added manually as projects grow
]
```

---

## Contact Form (LimitedSpots)

**Fields:** Nombre (text), Teléfono (text), Email (email)

**Flow:**
1. User submits form → `fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })`
2. API route validates fields (non-empty, valid email format)
3. Sends email via Resend to `CONTACT_EMAIL` env var
4. Returns `200` on success, `400` on validation error, `500` on Resend failure
5. UI shows inline success message or error message — no page reload

**Environment variables:**
```
RESEND_API_KEY=
CONTACT_EMAIL=
```

---

## Constraints & Out of Scope

- No database
- No authentication
- No CMS — portfolio managed via `projects.ts`
- No blog (can be added later)
- No separate routes — single page, anchor-scroll navigation
- CAPTCHA not included in v1 (was present on WordPress site — can add later)
