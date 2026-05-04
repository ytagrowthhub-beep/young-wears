# Young Wears E-commerce Platform

Modern full-stack fashion e-commerce app for **Young Wears**.

## Stack
- Frontend: Next.js 16 + Tailwind CSS (deployed on **Vercel**)
- Catalog & SQL: **Supabase Postgres** (`products`, `profiles`) via Next Route Handlers `/api/products`
- Auth: **Supabase Auth** (email/password + Google); optional **`profiles`** row on signup (SQL trigger)
- Legacy **Express** (`backend/`) is optional for local/dev only — production catalog uses Supabase + Next API.

## Supabase setup (production / Vercel)
1. In Supabase **SQL Editor**, run `supabase/migrations/001_young_wears_catalog.sql`.
2. In **Vercel → Environment Variables**, set `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_SITE_URL`, **`SUPABASE_SERVICE_ROLE_KEY`** (Dashboard → Settings → API → service_role), and a random **`SEED_CATALOG_SECRET`**.
3. **Redeploy**, then seed once:
   ```bash
   curl -X POST https://YOUR_DOMAIN.vercel.app/api/admin/seed-catalog \
     -H "x-young-wears-seed-secret: YOUR_SEED_CATALOG_SECRET"
   ```
4. Remove `SEED_CATALOG_SECRET` from Vercel later if you want (optional).

## Run locally
1. Supabase project + `frontend/.env.local` with URL + anon/publishable key; redirect `http://localhost:3000/auth/callback`.
2. Run **`npm run dev`** in `frontend` (catalog uses **`http://localhost:3000/api/products`** by default).
3. Optional: `SUPABASE_SERVICE_ROLE_KEY` + `SEED_CATALOG_SECRET` in `.env.local`, then POST `/api/admin/seed-catalog` locally to fill Postgres.
4. Optional legacy Express: `npm run dev:all` from repo root + `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

## Features
- Shop, filters, product pages — data from Supabase when seeded; otherwise fallback sample JSON.
- Auth & profile metadata on Supabase.
