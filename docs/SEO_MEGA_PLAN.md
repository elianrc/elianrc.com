# SEO Mega Plan

Last updated: 2026-07-22

## Purpose

Turn elianrc.com into a strong local SEO engine for people in Puerto Rico searching for web design, web development, and websites for their business.

The goal is not just more traffic. The goal is more qualified business owners landing on the right page, trusting the offer quickly, and starting a WhatsApp conversation or submitting the contact form.

## Primary Audience

Business owners in Puerto Rico who need a website, especially:

- Small businesses with no website yet.
- Businesses relying mostly on Instagram, Facebook, or word of mouth.
- Service businesses that need more leads.
- Restaurants, clinics, contractors, consultants, churches, nonprofits, creators, and local shops.
- Existing businesses with outdated websites that do not feel professional or do not convert.

## Core Positioning

Recommended positioning:

> Websites para negocios en Puerto Rico que quieren verse profesionales, generar confianza y convertir visitantes en clientes.

English version:

> Websites for Puerto Rico businesses that want to look professional, build trust, and turn visitors into customers.

This should become the strategic center of the site. The homepage can still feel personal and premium, but the SEO pages should be more literal and search-driven.

## Current Site Read

The current site is a static Astro project with:

- Spanish homepage: `/`
- English homepage: `/en/`
- Shared layout: `src/layouts/SiteLayout.astro`
- Shared copy data: `src/data/translations.ts`
- Empty portfolio data: `src/data/projects.ts`
- Contact API: `functions/api/contact.js`

What is already good:

- Astro static output is a strong foundation for speed.
- Spanish and English now have separate crawlable URLs.
- The site has clear calls to action.
- The visual identity is memorable and polished.
- The service offer already includes design, domain, hosting, security, maintenance, email, SEO, and content.

Main SEO gaps:

- Homepage copy is more brand/conversion focused than search focused.
- Spanish metadata is not specifically targeting Puerto Rico yet.
- Open Graph locale is currently `es_CR`; this should likely be `es_PR`.
- No sitemap or robots file is present.
- No canonical or hreflang links are present yet.
- No dedicated service landing pages exist.
- Portfolio/case studies are empty.
- Local proof is limited.
- There is no educational content targeting buyer questions.

## SEO Strategy Summary

The site should become a local service hub, not just a one-page portfolio.

The structure should be:

1. Homepage for brand, trust, broad Puerto Rico positioning, and conversion.
2. Service pages for high-intent searches.
3. Business-type pages for industry-specific searches.
4. Case studies for proof.
5. Educational articles for top-of-funnel and comparison searches.
6. Local authority signals through Google Business Profile, citations, reviews, and consistent contact details.

## Keyword Clusters

### Spanish Primary Keywords

- diseno web puerto rico
- diseno de paginas web puerto rico
- disenador web puerto rico
- desarrollo web puerto rico
- desarrollador web puerto rico
- paginas web puerto rico
- paginas web para negocios puerto rico
- crear pagina web para negocio puerto rico
- websites para negocios puerto rico
- landing pages puerto rico
- tiendas online puerto rico
- mantenimiento web puerto rico
- seo puerto rico
- seo para negocios puerto rico

Use the accented Spanish naturally in the copy:

- diseño web en Puerto Rico
- diseño de páginas web en Puerto Rico
- diseñador web en Puerto Rico
- desarrollo web en Puerto Rico
- páginas web para negocios en Puerto Rico

Do not force awkward keyword stuffing. The page should sound like a real person explaining the service.

### English Primary Keywords

- web designer Puerto Rico
- web developer Puerto Rico
- web design Puerto Rico
- website designer Puerto Rico
- website developer Puerto Rico
- websites for small businesses Puerto Rico
- landing page designer Puerto Rico
- SEO services Puerto Rico

English pages should exist, but Spanish should be the first priority because the local buying audience is likely stronger there.

## Recommended Site Architecture

### Phase 1 Pages

Build these first:

- `/diseno-web-puerto-rico/`
- `/desarrollo-web-puerto-rico/`
- `/paginas-web-para-negocios-puerto-rico/`
- `/en/web-design-puerto-rico/`

These pages should all be reachable from the homepage navigation or footer. They should also cross-link to each other where natural.

### Phase 2 Pages

Build after the first pages have enough quality:

- `/landing-pages-puerto-rico/`
- `/mantenimiento-web-puerto-rico/`
- `/seo-para-negocios-puerto-rico/`
- `/tiendas-online-puerto-rico/`
- `/portfolio/`
- `/casos-de-estudio/`

### Phase 3 Industry Pages

Build only when there is enough real insight, examples, or offers for each industry:

- `/paginas-web-para-restaurantes-puerto-rico/`
- `/paginas-web-para-contratistas-puerto-rico/`
- `/paginas-web-para-iglesias-puerto-rico/`
- `/paginas-web-para-clinicas-puerto-rico/`
- `/paginas-web-para-consultores-puerto-rico/`

These pages should not be thin doorway pages. Each one needs specific copy, examples, FAQs, and a real reason to exist.

## Page Template For SEO Landing Pages

Every SEO landing page should include:

1. One clear H1 with the target phrase.
2. Short intro explaining who the page is for.
3. Problem section: what business owners are struggling with.
4. Solution section: what Elián builds.
5. What is included.
6. Process/timeline.
7. Proof: portfolio, screenshots, testimonials, or personal credibility.
8. Pricing guidance or "starting at" framing if comfortable.
9. FAQs.
10. Strong WhatsApp CTA and contact form CTA.
11. Internal links to related services.

Example H1:

> Diseño de páginas web en Puerto Rico para negocios que quieren crecer

Example meta title:

> Diseño Web en Puerto Rico | Websites para Negocios | Elián RC

Example meta description:

> Diseño websites rápidos, modernos y profesionales para negocios en Puerto Rico. Landing pages, páginas web, mantenimiento, SEO y soporte directo por WhatsApp.

## Homepage Improvements

Recommended Spanish homepage title:

> Diseño Web en Puerto Rico | Websites para Negocios | Elián RC

Recommended Spanish homepage description:

> Diseño websites modernos, rápidos y profesionales para negocios en Puerto Rico que quieren generar confianza, recibir más leads y convertir visitantes en clientes.

Recommended H1 direction:

> Websites para negocios en Puerto Rico que impulsan ventas

Alternative:

> Diseño web en Puerto Rico para negocios que quieren crecer

The homepage does not need to become robotic. It can keep the current emotional promise, but it should mention Puerto Rico, businesses, web design, and websites clearly in the first viewport.

## Technical SEO Checklist

### Metadata

- Add unique `title` and `description` props per page.
- Fix Spanish Open Graph locale from `es_CR` to `es_PR`.
- Use page-specific `og:url`.
- Add `og:image` using a strong branded preview image.
- Add `twitter:card`.

### Canonicals

Each page should output a canonical URL.

Examples:

- `/` canonical: `https://elianrc.com/`
- `/en/` canonical: `https://elianrc.com/en/`
- `/diseno-web-puerto-rico/` canonical: `https://elianrc.com/diseno-web-puerto-rico/`

### Hreflang

Spanish and English equivalents should link to each other.

Homepage example:

- `rel="alternate" hreflang="es-PR" href="https://elianrc.com/"`
- `rel="alternate" hreflang="en-US" href="https://elianrc.com/en/"`
- `rel="alternate" hreflang="x-default" href="https://elianrc.com/"`

Google recommends separate URLs for different language versions and hreflang annotations when language alternates exist.

### Sitemap

Add `@astrojs/sitemap` and set `site` in `astro.config.mjs`.

Target config direction:

```js
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://elianrc.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### Robots

Add `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://elianrc.com/sitemap-index.xml
```

Confirm final sitemap URL after Astro build.

### Images

- Use descriptive alt text.
- Replace generic alt text like "Project showcase" with local/business context where accurate.
- Compress images.
- Consider modern formats if image quality and deployment support are good.
- Make sure the hero image reinforces the service, not only decoration.

### Performance

- Keep pages static where possible.
- Avoid adding heavy client-side JavaScript.
- Use Lighthouse/PageSpeed as a check, but prioritize real usability.
- Make sure mobile layout is excellent.

## Structured Data Plan

Add JSON-LD for:

- `Person`
- `ProfessionalService` or a relevant local service type
- `WebSite`
- `Service` on service pages
- `FAQPage` on pages with visible FAQs
- `BreadcrumbList` on nested pages

Important: structured data should match visible page content. Do not add fake reviews, fake ratings, or invisible FAQ content.

Potential organization/service fields:

- Name: Elián RC
- URL: `https://elianrc.com`
- Area served: Puerto Rico
- Language: Spanish and English
- Contact: WhatsApp and form
- SameAs: LinkedIn, GitHub, other public profiles

## Local SEO Plan

### Google Business Profile

Create or optimize a Google Business Profile.

Action items:

- Use a consistent business name.
- Add website URL.
- Add phone number.
- Add service area: Puerto Rico.
- Add service categories related to website designer, web designer, web developer, and marketing services if appropriate.
- Add photos/screenshots of work.
- Add service descriptions.
- Ask real clients for reviews.
- Respond to reviews.
- Keep profile information updated.

Google says local ranking is influenced by relevance, distance, and prominence. Complete and accurate business info helps Google understand what the business does and where it serves customers.

### Citation Consistency

Keep name, phone, URL, and service description consistent across:

- Google Business Profile
- LinkedIn
- GitHub profile
- Instagram, if used for business
- Facebook page, if used for business
- Local directories
- Any partner/client credit links

### Local Trust Signals On Site

Add visible local proof:

- "Based in Puerto Rico" or "Sirviendo negocios en Puerto Rico."
- Puerto Rico service area mention.
- Case studies from Puerto Rico businesses when available.
- Testimonials from local clients.
- Local context in FAQs.

## Portfolio And Case Study Plan

The empty portfolio is one of the highest-impact gaps.

Each project should include:

- Business name.
- Industry.
- Location or service area if approved by client.
- Screenshot.
- Problem.
- Solution.
- Services provided.
- Link to live site.
- Outcome, even if qualitative.

Example case study structure:

1. Client snapshot.
2. What they needed.
3. What was built.
4. What changed after launch.
5. Screenshots.
6. CTA: "Quiere algo similar para su negocio?"

Even if metrics are not available, use honest outcomes:

- More professional first impression.
- Easier inquiry flow.
- Clearer services.
- Faster website.
- Better mobile experience.

## Content Plan

### First 10 Articles

1. Cuanto cuesta una pagina web en Puerto Rico?
2. Que debe tener el website de un negocio pequeno en Puerto Rico?
3. Website vs pagina de Facebook: que necesita realmente tu negocio?
4. Como saber si tu negocio necesita una landing page o un website completo
5. Checklist antes de contratar un disenador web en Puerto Rico
6. Como un website puede ayudarte a recibir mas mensajes por WhatsApp
7. Errores comunes en websites de negocios pequenos
8. Que incluye un servicio de mantenimiento web?
9. Como preparar el contenido para tu nuevo website
10. SEO basico para negocios locales en Puerto Rico

Use Spanish titles with proper accents on the published site. ASCII is used here only to keep this planning file simple and portable.

### Content Principles

- Write for business owners, not developers.
- Answer pricing and timeline questions directly.
- Use examples from Puerto Rico when possible.
- Include a CTA, but do not turn every article into a sales page.
- Link articles to the relevant service page.
- Keep each article focused on one search intent.

## Conversion Plan

SEO pages should not just rank. They should move people toward action.

Recommended conversion elements:

- Sticky or repeated WhatsApp CTA on long pages.
- Short contact form.
- "Free 20-minute call" CTA.
- Clear service packages or starting points.
- FAQ answers near the CTA.
- Trust section before the final CTA.
- Short "what happens after you message me" explanation.

Recommended CTA copy:

- "Hablemos por WhatsApp"
- "Quiero mejorar el website de mi negocio"
- "Solicitar una consulta gratis"
- "Ver si mi negocio necesita un website"

## Measurement Plan

Set up:

- Google Search Console.
- Google Analytics or a privacy-friendly analytics tool.
- Conversion tracking for WhatsApp clicks.
- Conversion tracking for contact form submissions.
- Basic rank tracking for main local terms.

Track monthly:

- Search impressions.
- Clicks.
- Top queries.
- Top pages.
- Pages indexed.
- Form submissions.
- WhatsApp clicks.
- Conversion rate by page.

Do not judge SEO too early. Technical fixes can help quickly, but content and local authority usually compound over months.

## Priority Roadmap

### Sprint 1: Technical Foundation

- Fix Spanish locale to `es_PR`.
- Add canonical URLs.
- Add hreflang alternates.
- Add sitemap.
- Add robots.txt.
- Add page-specific metadata support in `SiteLayout.astro`.
- Improve hero image alt text.
- Add basic structured data.

### Sprint 2: Homepage Local Positioning

- Update homepage title and description.
- Add Puerto Rico language to the first viewport.
- Add a local trust line.
- Add more explicit service language.
- Fix English nav copy.
- Add internal links to new service pages.

### Sprint 3: First SEO Landing Page

Build:

- `/diseno-web-puerto-rico/`

This should be the flagship local SEO page. Make it strong before creating many pages.

### Sprint 4: Service Page Cluster

Build:

- `/desarrollo-web-puerto-rico/`
- `/paginas-web-para-negocios-puerto-rico/`
- `/en/web-design-puerto-rico/`

### Sprint 5: Proof Layer

- Add real projects to `src/data/projects.ts`.
- Build portfolio detail pages or case studies.
- Add testimonials if available.
- Add project screenshots with descriptive alt text.

### Sprint 6: Local Content Engine

- Publish 2-4 high-quality articles per month.
- Link every article to a service page.
- Add FAQs based on real sales conversations.
- Review Search Console data monthly and adjust content.

## Feedback Questions

Use these questions when asking for feedback:

1. Is the positioning clear enough for a Puerto Rico business owner?
2. Are the recommended service pages too broad, too narrow, or just right?
3. Which page should be built first?
4. Should pricing be visible, partial, or handled only by consultation?
5. Which industries should get dedicated pages first?
6. What proof do we already have permission to publish?
7. Should the site sound more formal, more local, or more direct?
8. Should English be a full SEO priority or mainly a support version?

## Definition Of Success

This plan is working if:

- The site starts ranking for Puerto Rico web design/development queries.
- Search Console shows impressions for service-intent keywords.
- Visitors land on more specific pages, not only the homepage.
- More qualified leads arrive through WhatsApp and the form.
- Prospects understand the service before the first conversation.
- The site becomes a reusable sales asset, not just a digital business card.

## Official References

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google localized versions and hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Business Profile local ranking: https://support.google.com/business/answer/7091
- Astro sitemap integration: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Schema.org Service: https://schema.org/Service
- Schema.org ProfessionalService: https://schema.org/ProfessionalService
