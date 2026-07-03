# KSUM Web

React + Vite + TypeScript + Tailwind implementation of the KSUM-WEB Figma design.

## Quick start

```bash
cd ksum-web
npm install
npm run dev
```

Then open http://localhost:5173.

## Hosted Supabase

This project expects a hosted Supabase project, not the local Supabase stack.

1. Create or open the project in the Supabase dashboard.
2. Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings -> API.
3. Apply the single baseline migration in `supabase/migrations/20250110000000_v1_initial_schema.sql` through the Supabase SQL editor, or link the CLI with `supabase link --project-ref <project-ref>` and run `supabase db push`.
4. After linking the hosted project, run `npm run gen:types` to regenerate `src/lib/data/types.ts` from the hosted database schema.

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/App.tsx` — page composition
- `src/components/Hero.tsx` — purple hero with header, title, CTA, illustration
- `src/components/Header.tsx` — pill-style logo + nav
- `src/components/About.tsx` — split-purple about block with 6 stats
- `src/components/Initiatives.tsx` — 4-column grid of 16 initiative cards
- `src/components/InitiativeCard.tsx` — single card primitive
- `src/components/CTA.tsx` — Join Us purple CTA with placeholder tiles
- `src/components/Footer.tsx` — purple footer with logo + heading
- `src/components/icons.tsx` — inline SVG icons (no icon package)
- `src/index.css` — Tailwind + the `.hero-bg` and `.about-bg` custom utilities
- `tailwind.config.ts` — `brand.purple` / `brand.lightPurple` / `brand.darkPurple` and Montserrat font

Images currently reference the same `lh3.googleusercontent.com` URLs from the source HTML. Swap with local assets in `public/` when ready.
