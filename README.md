# Young Wears E-commerce Platform

Modern full-stack fashion e-commerce app for **Young Wears**.

## Stack
- Frontend: Next.js 16 + Tailwind CSS
- Backend: Node.js + Express (in-memory product catalog; no database)
- Auth & profiles: **Supabase Auth** (email/password + Google)

## Project Structure
- `frontend/` - storefront, Supabase auth, profile UI
- `backend/` - REST API for **products** only (`/api/products`, `/api/health`)

## Run Locally
1. **Supabase:** Create a project, set URL + publishable (or anon) key in `frontend/.env.local`. Enable Email auth and (optional) Google. Add redirect URL `http://localhost:3000/auth/callback`.
2. **Backend (catalog API):**
   - `cd backend && npm install && npm run dev` (default port 5000)
3. **Frontend:**
   - Copy `frontend/.env.example` to `frontend/.env.local` and fill Supabase vars + `BACKEND_URL=http://127.0.0.1:5000` (or set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`).
   - `cd frontend && npm install && npm run dev`
4. From repo root, **`npm run dev:all`** starts API + web together.

Optional: add **`SUPABASE_SERVICE_ROLE_KEY`** to `frontend/.env.local` so **Delete account** works (server route uses it once per delete).

## Features
- Premium homepage, shop filters, product details, cart (local storage)
- Sign up / sign in / sign out via **Supabase**
- Profile edits stored in **Supabase** `user_metadata`
- Seeded in-memory products (no MongoDB)
