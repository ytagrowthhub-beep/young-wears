# Young Wears E-commerce Platform

Modern full-stack fashion e-commerce app for **Young Wears**.

## Stack
- Frontend: Next.js 16 + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT

## Project Structure
- `frontend/` - customer-facing storefront and user dashboard
- `backend/` - API, authentication, profile CRUD, product data

## Run Locally
1. Backend:
   - Copy `backend/.env.example` to `backend/.env`
   - Set `MONGODB_URI` and `JWT_SECRET`
   - Run:
     - `cd backend`
     - `npm install`
     - `npm run dev`
2. Frontend:
   - Create `frontend/.env.local` with:
     - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
   - Run:
     - `cd frontend`
     - `npm install`
     - `npm run dev`

## Features
- Premium homepage with hero, categories, best sellers, testimonials, and newsletter CTA
- Sticky navbar with logo, nav, cart, and profile icon
- Shop page with category/price/size filters
- Product details with size selection and add-to-cart
- Cart with quantity updates, removal, persistent local storage, and checkout UI
- JWT auth: register/login/logout
- Profile dashboard with full CRUD (view/edit/delete account)
- Seeded sample products for kids and adults
