# Bakezilla — Deployment Guide

Production bakery storefront: TanStack Start (React 19 + Vite + Nitro SSR) on Vercel,
with Supabase (Postgres) for products, orders, cake requests and contact enquiries.

## Live URLs

| Environment | URL |
| --- | --- |
| Production (custom domain) | https://bakezilla.tarahutaibuilds.com |
| Production (Vercel alias) | https://bakezilla-three.vercel.app |
| Vercel project | `peeenudotcoms-projects/bakezilla` |
| GitHub repo | https://github.com/peeenudotcom/bakezilla (deploys `main` automatically) |
| Supabase project | `bakezilla` (`hafvnayowurzdeksvtmn`, Mumbai) — account sukhijaparveen@gmail.com — https://supabase.com/dashboard/project/hafvnayowurzdeksvtmn |

## Architecture

- **Framework**: TanStack Start with SSR. The Lovable build config defaults to a
  Cloudflare target; [vite.config.ts](vite.config.ts) pins `nitro: { preset: "vercel" }`
  so `vite build` emits the Vercel Build Output API format (`.vercel/output`).
- **Data**: Supabase Postgres. Schema lives in
  [supabase/migrations/20260703053000_init_bakezilla.sql](supabase/migrations/20260703053000_init_bakezilla.sql).
- **Server functions** ([src/lib/server-fns.ts](src/lib/server-fns.ts)):
  - `getProducts` — reads active products; homepage loader merges DB prices/availability
    over the bundled catalog and falls back to the static menu if the DB is unreachable.
  - `placeOrder` — validates input with zod, prices every line item from the
    `products` table (client-sent prices are never trusted), inserts the order +
    items, and records custom cakes in `cake_requests`. Returns the real order number.
  - `submitEnquiry` — stores contact-form submissions in `contact_enquiries`.
- **Security model**: all tables have Row Level Security enabled, deny-by-default.
  The only public policy is `SELECT` on active products. All writes go through
  server functions using the service role key, which exists only in server-side
  env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — intentionally **not**
  `VITE_`-prefixed, so Vite can never inline them into the browser bundle).

## Database tables

| Table | Purpose |
| --- | --- |
| `products` | Catalog (id, name, price ₹, category, tag, active). Seeded by the migration. |
| `orders` | Checkout orders — customer name/phone/address, server-computed total, status, unique `BZ-XXXXXX` order number. |
| `order_items` | Line items per order; custom cakes carry their full `cake_config` JSON. |
| `cake_requests` | Every "Build your own cake" order, linked to its order row. |
| `contact_enquiries` | Contact-form messages (name, email/phone, message). |

## Environment variables

Set in Vercel (Project → Settings → Environment Variables) and in local `.env`
(see [.env.example](.env.example) — never commit real values):

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API Keys (secret; server-only) |

## Setting up / recreating Supabase

```bash
supabase projects create bakezilla --org-id <org> --region ap-south-1 --db-password <strong-password>
supabase link --project-ref <project-ref>
supabase db push                     # applies supabase/migrations/*
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel redeploy <deployment-url>     # or push any commit
```

The site degrades gracefully without Supabase: pages render from the bundled
catalog, but checkout and the contact form return an error until the env vars
and database exist.

## Deploying

- **Normal**: push to `main` — Vercel builds and promotes automatically
  (GitHub integration is connected).
- **Manual**: `vercel deploy --prod` from the repo root.
- **Local dev**: `bun install && bun run dev` with a filled-in `.env`.
- **Checks**: `bun run lint`, `bunx tsc --noEmit`, `bun run build`.

## Custom domain

`bakezilla.tarahutaibuilds.com` is attached to the Vercel project. DNS for
`tarahutaibuilds.com` is at Hostinger (dns-parking nameservers); the subdomain
needs a record there (same pattern as `walksy`):

```
Type: A    Name: bakezilla    Value: 76.76.21.21
```

Vercel provisions the SSL certificate automatically once the record propagates.

## Testing the live site

1. Homepage renders all sections (hero, fresh picks, menu, cake builder, contact).
2. Add items to the basket → Checkout → fill name/phone/address → Place order →
   a real `BZ-XXXXXX` order number appears; the row exists in `orders` +
   `order_items` in the Supabase dashboard.
3. Build a custom cake → add to basket → order → row appears in `cake_requests`.
4. Contact section → "Or write to us" form → row appears in `contact_enquiries`.

## Notes

- This repo is connected to Lovable — never force-push or rewrite published
  history on `main` (see [AGENTS.md](AGENTS.md)).
- The Vercel deployment-hash URLs (e.g. `bakezilla-8bvxfhoe2-…vercel.app`) are
  protected by Vercel Authentication; use the aliases above for public access.
- `bakezilla.vercel.app` belongs to an unrelated third party — our Vercel alias
  is `bakezilla-three.vercel.app`.
