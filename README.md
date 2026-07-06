# elianrc.com

Next.js App Router site configured for Cloudflare Pages static hosting.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cloudflare Pages

Use the Cloudflare Pages **Next.js (Static HTML Export)** preset.

- Build command: `npm run pages:build`
- Build output directory: `out`
- Production branch: `main`

The site is exported statically with `output: 'export'` in `next.config.ts`.

## Contact Form

The contact form posts to `/api/contact`. On Cloudflare Pages, that route is handled by:

```text
functions/api/contact.js
```

Set these Cloudflare Pages environment variables/secrets for both Production and Preview as needed:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`

Local `next dev` serves the static Next app, but it does not run Cloudflare Pages Functions. To test the deployed function behavior locally, build the site and run it with Wrangler Pages:

```bash
npm run pages:build
npx wrangler pages dev out
```

## Verification

```bash
npm run lint
npm test
npm run build
```
