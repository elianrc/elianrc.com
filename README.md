# elianrc.com

Astro static site configured for Cloudflare Pages hosting.

## Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Cloudflare Pages

Use the Cloudflare Pages **Astro** preset.

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

## Contact Form

The contact form posts to `/api/contact`. On Cloudflare Pages, that route is handled by:

```text
functions/api/contact.js
```

Set these Cloudflare Pages environment variables/secrets for both Production and Preview as needed:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`

Local `astro dev` serves the static Astro app, but it does not run Cloudflare Pages Functions. To test the deployed function behavior locally, build the site and run it with Wrangler Pages:

```bash
npm run build
npx wrangler pages dev dist
```

## Verification

```bash
npm run lint
npm test
npm run build
```
