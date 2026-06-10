# Galaincha — गलैंचा

**Woven in Nepal · नेपालमा बुनिएको**

Bilingual (English / Nepali) website for a Kathmandu carpet & rug business: ready-made rugs, professional carpet washing, and custom orders. Content is fully managed through an embedded CMS.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| CMS | Payload 3 — embedded at `/admin`, field-level en/ne localization |
| Database | SQLite (`@payloadcms/db-sqlite`) — swap the adapter for Postgres in production |
| i18n | next-intl v4 — `/en` and `/ne` locale routing via `src/proxy.ts` |
| Styling | Tailwind CSS v4, design tokens in `src/app/(frontend)/styles.css` |
| Theme | next-themes — light / dark / system |
| Forms | Server Action + Zod validation + honeypot → `inquiries` collection |

## Getting started

```bash
npm install
npm run seed   # creates admin user + bilingual demo content (skips if users exist)
npm run dev
```

- Site: http://localhost:3000 (redirects to `/en`; Nepali at `/ne`)
- Admin: http://localhost:3000/admin — `admin@galaincha.com` / `galaincha2026` (**change after first login**)

## Content model

- **Collections**: Products (rugs), Categories, Services, Inquiries (form submissions), Media, Users
- **Globals**: Site Settings (contact, tagline, footer), Home Page (hero, featured rugs, story), About Page

All editorial fields are localized — edit in English, switch the locale dropdown in the admin to नेपाली, and translate in place. Untranslated fields fall back to English on the site.

## Two-layer i18n

- **UI chrome** (nav, buttons, form labels): `messages/en.json` / `messages/ne.json` via next-intl
- **Editorial content** (rugs, services, pages): Payload localization, fetched with the active locale

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run seed` | Seed admin + bilingual demo content (idempotent) |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `npm run lint` | ESLint |
