# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Next.js App Router site with an Astro static site while preserving the existing visual design, bilingual content, contact form, Cloudflare Pages deploy path, Montserrat typography, and favicon.

**Architecture:** Build a static Astro site with two pre-rendered routes: `/` for Spanish and `/en/` for English. Move shared page structure into Astro layouts and components, use Tailwind 4 through Astro/Vite, use vanilla browser scripts only for small interactions, and keep `functions/api/contact.js` as the Cloudflare Pages Function for `POST /api/contact`.

**Tech Stack:** Astro, TypeScript, Tailwind CSS 4, `@fontsource-variable/montserrat`, Cloudflare Pages Functions, Vitest.

---

## Source References

- Astro integrations support official React/Tailwind/Cloudflare integrations, but this migration should avoid React unless needed: https://docs.astro.build/en/guides/integrations/
- Astro Tailwind 4 support uses `astro add tailwind` or the Tailwind Vite plugin and imports `@import "tailwindcss";` in a global stylesheet: https://docs.astro.build/en/guides/styling/
- Astro Cloudflare Pages uses build command `npm run build` and output directory `dist`: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Cloudflare’s current Astro Workers guide notes that static Astro does not need the Cloudflare adapter; static assets can simply be uploaded: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/

---

## File Structure

Create:
- `astro.config.mjs`: Astro config with Tailwind 4 Vite plugin.
- `src/layouts/SiteLayout.astro`: Shared HTML shell, metadata, Montserrat font CSS, favicon tags.
- `src/pages/index.astro`: Spanish home page.
- `src/pages/en/index.astro`: English home page.
- `src/components/Container.astro`: Shared max-width wrapper.
- `src/components/BubbleBackground.astro`: Static bubble markup plus small pointer-follow script.
- `src/components/Nav.astro`: Header navigation and language route link.
- `src/components/Hero.astro`: Hero section.
- `src/components/ValueProp.astro`: Value proposition section.
- `src/components/Services.astro`: Services section.
- `src/components/Features.astro`: Feature cards section.
- `src/components/MeetingCTA.astro`: Meeting CTA section.
- `src/components/Portfolio.astro`: Portfolio section.
- `src/components/About.astro`: About section.
- `src/components/LimitedSpots.astro`: Contact form section with vanilla submit script.
- `src/components/Footer.astro`: Footer section.
- `src/components/icons.ts`: String-rendered SVG helpers or exported icon path constants for non-React icons.
- `src/data/translations.ts`: Existing bilingual copy.
- `src/data/constants.ts`: Existing WhatsApp URL and social links helpers.
- `src/data/projects.ts`: Existing project data if still needed.
- `src/styles/global.css`: Port of `app/globals.css`, including Tailwind import, colors, Montserrat, bubble CSS.
- `__tests__/astro-build-config.test.ts`: Config/package smoke test.
- `__tests__/astro-content.test.ts`: Translation and route-content smoke test.

Modify:
- `package.json`: Replace Next scripts/dependencies with Astro scripts/dependencies.
- `package-lock.json`: Regenerate with `npm install`.
- `tsconfig.json`: Replace Next plugin/path setup with Astro-compatible TypeScript settings.
- `vitest.config.ts`: Keep aliases pointing `@` to repo root or update to `src`.
- `README.md`: Replace Cloudflare Pages instructions with Astro settings.

Keep:
- `functions/api/contact.js`: Keep Cloudflare Pages Function behavior.
- `__tests__/api/contact.test.ts`: Keep contact function tests with updated import only if path changes.
- `public/images/*`: Keep all image assets, including `public/images/favicon.png`.

Remove after Astro parity is verified:
- `app/`
- `components/`
- `context/`
- `next.config.ts`
- `next-env.d.ts`
- Next-specific tests that no longer apply: `__tests__/layout-font.test.tsx`, `__tests__/Container.test.tsx`, `__tests__/LanguageContext.test.tsx`

---

## Task 1: Add Astro Dependencies And Scripts

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Update package scripts and dependencies**

Replace `package.json` with Astro scripts:

```json
{
  "name": "elianrc.com",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "pages:build": "astro build",
    "preview": "astro preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "@fontsource-variable/montserrat": "^5.2.8",
    "astro": "latest",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "latest",
    "eslint": "^9",
    "jsdom": "^29.1.1",
    "vitest": "^4.1.5"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: npm completes and updates `package-lock.json`.

- [ ] **Step 3: Create Astro config**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
})
```

- [ ] **Step 4: Update TypeScript config**

Replace the Next-specific plugin and includes in `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Verify setup**

Run:

```bash
npm run build
```

Expected at this point: build may fail until `src/pages/index.astro` exists. If it fails only because there are no Astro pages yet, proceed to Task 2.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "Set up Astro project tooling"
```

---

## Task 2: Create Shared Data And Layout

**Files:**
- Create: `src/data/translations.ts`
- Create: `src/data/constants.ts`
- Create: `src/data/projects.ts`
- Create: `src/styles/global.css`
- Create: `src/layouts/SiteLayout.astro`

- [ ] **Step 1: Move data modules**

Copy the contents of:
- `lib/translations.ts` to `src/data/translations.ts`
- `lib/constants.ts` to `src/data/constants.ts`
- `lib/projects.ts` to `src/data/projects.ts`

Change imports later from `@/lib/...` to `@/data/...`.

- [ ] **Step 2: Create global stylesheet**

Create `src/styles/global.css` by porting `app/globals.css`, then add Montserrat:

```css
@import "tailwindcss";
@import "@fontsource-variable/montserrat";

@theme {
  --font-sans: "Montserrat Variable", Montserrat, Arial, sans-serif;
  --color-brand: #51c634;
  --color-brand-hover: #3faa25;
}

:where(body, button, input, textarea, select) {
  font-family: "Montserrat Variable", Montserrat, Arial, sans-serif;
}
```

Keep the existing bubble background CSS from `app/globals.css` after these rules.

- [ ] **Step 3: Create site layout**

Create `src/layouts/SiteLayout.astro`:

```astro
---
import '../styles/global.css'

type Props = {
  lang: 'es' | 'en'
  title?: string
  description?: string
}

const {
  lang,
  title = 'Elián RC — Web Designer & Developer',
  description = 'Diseño websites modernos, rápidos y funcionales que generan confianza y resultados. / I design modern, fast, and functional websites that build trust and deliver results.',
} = Astro.props
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content="Websites que impulsan ventas." />
    <meta property="og:url" content="https://elianrc.com" />
    <meta property="og:site_name" content="Elián RC" />
    <meta property="og:locale" content={lang === 'es' ? 'es_CR' : 'en_US'} />
    <meta property="og:type" content="website" />
    <link rel="icon" href="/images/favicon.png" />
    <link rel="apple-touch-icon" href="/images/favicon.png" />
  </head>
  <body class="bg-zinc-950 text-white antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add src/data src/styles/global.css src/layouts/SiteLayout.astro
git commit -m "Add Astro layout and shared data"
```

---

## Task 3: Port Static Page Shell

**Files:**
- Create: `src/components/Container.astro`
- Create: `src/components/BubbleBackground.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Create Container**

Create `src/components/Container.astro`:

```astro
---
const { class: className = '' } = Astro.props
---

<div class:list={['mx-auto w-full max-w-6xl min-w-0', className]}>
  <slot />
</div>
```

- [ ] **Step 2: Create BubbleBackground**

Create `src/components/BubbleBackground.astro` using the same classes as the React component:

```astro
<div class="bubble-background" aria-hidden="true">
  <svg class="bubble-background-filter" aria-hidden="true" focusable="false">
    <filter id="bubble-goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"></feColorMatrix>
      <feBlend in="SourceGraphic" in2="goo"></feBlend>
    </filter>
  </svg>
  <div class="bubble-background-gradients">
    <span class="bubble bubble-one" style="--bubble-color:18, 64, 145"></span>
    <span class="bubble bubble-two" style="--bubble-color:22, 91, 188"></span>
    <span class="bubble bubble-three" style="--bubble-color:9, 33, 92"></span>
    <span class="bubble bubble-four" style="--bubble-color:35, 104, 197"></span>
    <span class="bubble bubble-five" style="--bubble-color:16, 70, 158"></span>
    <span class="bubble bubble-six" style="--bubble-color:12, 45, 112"></span>
    <span class="bubble bubble-interactive" style="--bubble-color:42, 111, 203"></span>
  </div>
</div>

<script>
  const bubble = document.querySelector<HTMLElement>('.bubble-interactive')
  window.addEventListener('pointermove', (event) => {
    if (!bubble) return
    bubble.style.transform = `translate3d(calc(${event.clientX}px - 50%), calc(${event.clientY}px - 50%), 0)`
  })
</script>
```

- [ ] **Step 3: Create Spanish page skeleton**

Create `src/pages/index.astro`:

```astro
---
import SiteLayout from '@/layouts/SiteLayout.astro'
import BubbleBackground from '@/components/BubbleBackground.astro'
---

<SiteLayout lang="es">
  <main class="site-bubble-background">
    <BubbleBackground />
  </main>
</SiteLayout>
```

- [ ] **Step 4: Create English page skeleton**

Create `src/pages/en/index.astro`:

```astro
---
import SiteLayout from '@/layouts/SiteLayout.astro'
import BubbleBackground from '@/components/BubbleBackground.astro'
---

<SiteLayout lang="en">
  <main class="site-bubble-background">
    <BubbleBackground />
  </main>
</SiteLayout>
```

- [ ] **Step 5: Verify routes build**

Run:

```bash
npm run build
```

Expected: Astro builds `dist/index.html` and `dist/en/index.html`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Container.astro src/components/BubbleBackground.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "Create Astro page shell"
```

---

## Task 4: Port Page Sections To Astro

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/ValueProp.astro`
- Create: `src/components/Services.astro`
- Create: `src/components/Features.astro`
- Create: `src/components/MeetingCTA.astro`
- Create: `src/components/Portfolio.astro`
- Create: `src/components/About.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/icons.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Create icon helpers**

Create `src/components/icons.ts` with functions returning SVG strings for `whatsapp`, `linkedin`, `github`, `check`, `circleCheck`, `banknote`, and `paintbrush`. Copy the existing SVG path data from current React components and lucide-rendered output, and expose them as strings:

```ts
export const icons = {
  whatsapp: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>',
}
```

Add the remaining icons in the same file before using them.

- [ ] **Step 2: Port each section**

For each current React component, create the matching `.astro` component with a `lang: 'es' | 'en'` prop and the same markup/classes:
- `components/Nav.tsx` -> `src/components/Nav.astro`
- `components/Hero.tsx` -> `src/components/Hero.astro`
- `components/ValueProp.tsx` -> `src/components/ValueProp.astro`
- `components/Services.tsx` -> `src/components/Services.astro`
- `components/Features.tsx` -> `src/components/Features.astro`
- `components/MeetingCTA.tsx` -> `src/components/MeetingCTA.astro`
- `components/Portfolio.tsx` -> `src/components/Portfolio.astro`
- `components/About.tsx` -> `src/components/About.astro`
- `components/Footer.tsx` -> `src/components/Footer.astro`

Use this frontmatter pattern in each section:

```astro
---
import Container from '@/components/Container.astro'
import { t } from '@/data/translations'

type Props = { lang: 'es' | 'en' }
const { lang } = Astro.props
const tr = t[lang].hero
---
```

Replace `hero` with the relevant translation key in each component.

- [ ] **Step 3: Wire sections into routes**

Update `src/pages/index.astro` and `src/pages/en/index.astro` to render sections in this order:

```astro
<Nav lang="es" />
<Hero lang="es" />
<ValueProp lang="es" />
<Services lang="es" />
<Features lang="es" />
<MeetingCTA lang="es" />
<About lang="es" />
<LimitedSpots lang="es" />
<Footer lang="es" />
```

Use `lang="en"` in `src/pages/en/index.astro`.

- [ ] **Step 4: Verify visual content builds**

Run:

```bash
npm run build
rg "Websites que impulsan ventas|Websites That Drive Sales|/images/project-ohd.jpg" dist
```

Expected: build passes and `rg` finds Spanish, English, and image references.

- [ ] **Step 5: Commit**

```bash
git add src/components src/pages
git commit -m "Port marketing sections to Astro"
```

---

## Task 5: Port Contact Form Interactivity

**Files:**
- Create: `src/components/LimitedSpots.astro`
- Keep: `functions/api/contact.js`
- Keep: `__tests__/api/contact.test.ts`

- [ ] **Step 1: Create LimitedSpots Astro component**

Create `src/components/LimitedSpots.astro` with the current form markup and `lang` prop. Add field IDs using the language so duplicate routes stay valid:

```astro
---
import Container from '@/components/Container.astro'
import { t } from '@/data/translations'

type Props = { lang: 'es' | 'en' }
const { lang } = Astro.props
const tr = t[lang].limitedSpots
---

<section class="contact-overlap-section relative px-4 pt-14 pb-0 sm:px-6 sm:pt-20 md:px-8 lg:px-12 bg-zinc-950">
  <Container>
    <div class="relative z-20 mx-auto -mb-16 max-w-4xl space-y-7 rounded-lg bg-[#0b0f1d] p-5 shadow-2xl shadow-black/35 sm:p-7 md:-mb-28 md:p-12 lg:p-16">
      <div class="text-center space-y-4">
        <h2 class="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">{tr.headline}</h2>
        <p class="max-w-2xl mx-auto text-white text-base leading-relaxed">{tr.subtext}</p>
      </div>
      <form data-contact-form class="max-w-2xl mx-auto space-y-5">
        <div>
          <label for={`name-${lang}`} class="block text-base font-medium mb-2">{tr.namePlaceholder}</label>
          <input id={`name-${lang}`} name="name" type="text" required class="w-full rounded border border-zinc-300/80 bg-zinc-950/60 px-4 py-3 text-base text-white transition-colors focus:border-brand focus:outline-none" />
        </div>
        <div>
          <label for={`phone-${lang}`} class="block text-base font-medium mb-2">{tr.phonePlaceholder}</label>
          <input id={`phone-${lang}`} name="phone" type="text" required class="w-full rounded border border-zinc-300/80 bg-zinc-950/60 px-4 py-3 text-base text-white transition-colors focus:border-brand focus:outline-none" />
        </div>
        <div>
          <label for={`email-${lang}`} class="block text-base font-medium mb-2">{tr.emailPlaceholder}</label>
          <input id={`email-${lang}`} name="email" type="email" required class="w-full rounded border border-zinc-300/80 bg-zinc-950/60 px-4 py-3 text-base text-white transition-colors focus:border-brand focus:outline-none" />
        </div>
        <p data-contact-status class="hidden text-sm"></p>
        <button type="submit" class="w-full rounded bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-auto">{tr.submit}</button>
      </form>
    </div>
  </Container>
</section>
```

- [ ] **Step 2: Add vanilla submit script**

Add this script to the bottom of `LimitedSpots.astro`:

```astro
<script>
  for (const form of document.querySelectorAll<HTMLFormElement>('[data-contact-form]')) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const status = form.querySelector<HTMLElement>('[data-contact-status]')
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
      const formData = new FormData(form)

      if (status) {
        status.className = 'text-sm text-white'
        status.textContent = '...'
      }
      if (button) button.disabled = true

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: String(formData.get('name') ?? ''),
            phone: String(formData.get('phone') ?? ''),
            email: String(formData.get('email') ?? ''),
          }),
        })

        if (!status) return
        if (response.ok) {
          form.reset()
          status.className = 'text-sm text-brand font-semibold'
          status.textContent = document.documentElement.lang === 'en'
            ? "Message sent! I'll get back to you soon."
            : '¡Mensaje enviado! Le responderé pronto.'
        } else {
          status.className = 'text-sm text-red-400'
          status.textContent = document.documentElement.lang === 'en'
            ? 'There was an error. Please try again.'
            : 'Hubo un error. Por favor intente de nuevo.'
        }
      } catch {
        if (status) {
          status.className = 'text-sm text-red-400'
          status.textContent = document.documentElement.lang === 'en'
            ? 'There was an error. Please try again.'
            : 'Hubo un error. Por favor intente de nuevo.'
        }
      } finally {
        if (button) button.disabled = false
      }
    })
  }
</script>
```

- [ ] **Step 3: Verify contact tests**

Run:

```bash
npm test -- __tests__/api/contact.test.ts
```

Expected: all contact API tests pass unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/LimitedSpots.astro functions/api/contact.js __tests__/api/contact.test.ts
git commit -m "Port contact form to Astro"
```

---

## Task 6: Replace Next-Specific Tests With Astro Tests

**Files:**
- Create: `__tests__/astro-build-config.test.ts`
- Create: `__tests__/astro-content.test.ts`
- Delete: `__tests__/layout-font.test.tsx`
- Delete: `__tests__/Container.test.tsx`
- Delete: `__tests__/LanguageContext.test.tsx`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Update Vitest config**

Keep alias support, remove React plugin if no longer needed:

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 2: Add config smoke test**

Create `__tests__/astro-build-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import pkg from '../package.json'

describe('Astro build config', () => {
  it('uses Astro build scripts and Cloudflare Pages output directory', () => {
    expect(pkg.scripts.build).toContain('astro build')
    expect(pkg.scripts['pages:build']).toBe('astro build')
    expect(pkg.dependencies).toHaveProperty('astro')
    expect(pkg.dependencies).not.toHaveProperty('next')
  })
})
```

- [ ] **Step 3: Add content smoke test**

Create `__tests__/astro-content.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { t } from '../src/data/translations'
import { whatsappUrl } from '../src/data/constants'

describe('Astro content data', () => {
  it('keeps Spanish and English hero copy', () => {
    expect(t.es.hero.headline).toBe('Websites que impulsan ventas')
    expect(t.en.hero.headline).toBe('Websites That Drive Sales')
  })

  it('keeps language-specific WhatsApp messages', () => {
    expect(whatsappUrl('es')).toContain('Hola')
    expect(whatsappUrl('en')).toContain('Hi')
  })
})
```

- [ ] **Step 4: Remove obsolete React/Next tests**

Delete:

```text
__tests__/layout-font.test.tsx
__tests__/Container.test.tsx
__tests__/LanguageContext.test.tsx
```

- [ ] **Step 5: Verify tests**

Run:

```bash
npm test
```

Expected: Astro config/content tests and contact API tests pass.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts __tests__
git commit -m "Update tests for Astro migration"
```

---

## Task 7: Remove Next Files And Update Docs

**Files:**
- Delete: `app/`
- Delete: `components/`
- Delete: `context/`
- Delete: `lib/`
- Delete: `next.config.ts`
- Delete: `next-env.d.ts`
- Modify: `README.md`
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Remove Next source files**

Delete the old Next-only source after Astro pages build and tests pass:

```bash
rm -rf app components context lib next.config.ts next-env.d.ts
```

- [ ] **Step 2: Update README Cloudflare section**

Replace the Cloudflare Pages instructions with:

```md
## Cloudflare Pages

Use the Cloudflare Pages **Astro** preset.

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

The contact form posts to `/api/contact`, handled by `functions/api/contact.js`.

Set these Cloudflare Pages environment variables/secrets for Production and Preview:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
```

- [ ] **Step 3: Update verification docs**

Keep:

```md
## Verification

```bash
npm run lint
npm test
npm run build
```
```

- [ ] **Step 4: Update ESLint config**

Remove `eslint-config-next` usage from `eslint.config.mjs`. Keep TypeScript/JS linting simple:

```js
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', '.astro/**'],
  },
]
```

- [ ] **Step 5: Commit**

```bash
git add README.md eslint.config.mjs
git add -u app components context lib next.config.ts next-env.d.ts
git commit -m "Remove Next.js implementation"
```

---

## Task 8: Final Verification And Cloudflare Readiness

**Files:**
- Inspect: `dist/`
- Inspect: `README.md`
- Inspect: `package.json`

- [ ] **Step 1: Clean install verification**

Run:

```bash
npm ci
```

Expected: dependencies install from `package-lock.json`.

- [ ] **Step 2: Full quality verification**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected:
- lint exits 0
- tests exit 0
- Astro build exits 0 and writes `dist/`

- [ ] **Step 3: Verify generated output**

Run:

```bash
rg "Websites que impulsan ventas|Websites That Drive Sales|/images/favicon.png|/api/contact" dist
```

Expected: all four strings appear in generated output.

- [ ] **Step 4: Verify Cloudflare Pages Function remains testable**

Run:

```bash
npm test -- __tests__/api/contact.test.ts
```

Expected: all contact API tests pass.

- [ ] **Step 5: Optional local Cloudflare Pages preview**

Run:

```bash
npx wrangler pages dev dist
```

Expected: local Pages preview starts, static routes load, and `/api/contact` is available through the Pages Functions runtime.

- [ ] **Step 6: Final commit if verification files changed**

If Task 8 required any fixes:

```bash
git add .
git commit -m "Verify Astro Cloudflare build"
```

If Task 8 required no fixes, do not create an empty commit.

---

## Cloudflare Settings After Migration

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Required environment variables:
  - `RESEND_API_KEY`
  - `CONTACT_EMAIL`

---

## Self-Review

- Spec coverage: The plan covers Astro tooling, routes, layout, all visible page sections, bilingual content, contact form, favicon, Montserrat typography, Cloudflare Pages settings, tests, and cleanup of Next-specific files.
- Placeholder scan: No task uses TBD/TODO/implement-later placeholders. The only deliberate judgment step is icon path copying from existing components, with exact source and target files named.
- Type consistency: The selected route language type is consistently `'es' | 'en'`, shared data imports consistently use `@/data/...`, and route components consistently receive `lang`.
