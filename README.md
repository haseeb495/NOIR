# NOIR — dark luxury concept store

A practice e-commerce store to learn Supabase + Stripe.
Stack: React + Vite + Tailwind + Framer Motion. Runs on free tiers.

## What works now (Phase 2)
- Animated dark homepage: hero, marquee, per-category carousels, footer
- Sticky navbar that shrinks on scroll, page-fade transitions
- Product cards with hover lift + image zoom, scroll-reveal animations
- Category pages, product detail pages
- Supabase auth (sign up / in / out), protected /orders route
- Cart saved in the browser

## What's next
- Phase 3: Stripe Checkout (test mode, no real money)
- Phase 4: Stripe webhook -> save order to Supabase -> show on Orders page
- Phase 5: cart drawer, mega-menu, polish

## Setup

### 1. Install
```
npm install
```

### 2. Database (run BOTH in Supabase > SQL Editor)
1. Paste `db/schema.sql` and Run. (Adds the new `category` column — safe to re-run.)
2. Paste `db/seed.sql` and Run. (Clears old demo rows, adds the NOIR catalogue.)

### 3. Env
Copy `.env.example` to `.env` and fill in your Supabase Project URL + anon key:
```
VITE_SUPABASE_URL=https://your-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
(URL is just the base domain — no trailing slash, no /rest/v1.)

### 4. Run
```
npm run dev
```

## Swapping in real product images
Each product has an `image_url`. The seed uses on-brand placeholders.
To use real photos: edit the `image_url` for any product in Supabase
(Table Editor > products), or upload images to Supabase Storage and paste
those URLs. Free sources: Unsplash, or your own AI-generated shots.

## Notes
- Prices are stored in cents (integer) to match Stripe later.
- Animations respect "reduce motion" OS settings.
