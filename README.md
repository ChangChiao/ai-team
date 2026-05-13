# ModelTrade

A collector-grade model car marketplace MVP.

The first vertical slice is a web-first marketplace shell with static demo data. It implements the planned UI/UX surfaces before wiring live Supabase reads and writes.

## What Exists

- Marketplace home
- Browse listings
- Listing detail page
- Seller profile page
- Seller dashboard
- Dashboard listing management for status and archive/restore
- New listing form UI
- Transaction confirmation page
- Listing validation schema
- Magic-link login flow
- Seller profile create/update form
- Supabase Storage upload for listing photos during listing creation
- Transaction confirmation link creation and buyer confirmation flow
- Transaction confirmation token hashing
- Supabase schema migration with RLS policies
- Public seller trust stats through aggregate Supabase views
- Playwright E2E coverage for public marketplace and seller workspace flows

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Supabase Auth / Postgres / Storage
- Zod
- Vitest

## Run Locally

```bash
pnpm install
pnpm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Checks

```bash
pnpm run typecheck
pnpm test
pnpm run build
pnpm run test:e2e
```

## Supabase

Copy environment variables:

```bash
cp .env.example .env.local
```

Fill:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Apply migrations from:

```text
supabase/migrations/
```

For local development, seed demo sellers, listings, and confirmed transactions from:

```text
supabase/seed.sql
```

See [supabase/README.md](supabase/README.md) for the schema and RLS expectations.

## Current Boundary

Public marketplace pages read through `lib/data/marketplace.ts`. If Supabase environment variables are present, the data layer queries Supabase; otherwise it falls back to `lib/mock-data.ts` so the demo stays runnable.

The login and seller profile forms are wired to Supabase. Listing creation validates input, uploads 1-8 photos to Supabase Storage, creates `listing_photos` rows, and publishes the listing once a signed-in user has a seller profile.

Public trust signals use `seller_public_stats` and `seller_public_transactions` views, so the public UI can show aggregate trust and confirmed transaction history without exposing buyer emails or confirmation tokens.

Next implementation step:

1. Connect a real Supabase project or local Supabase stack and run the migration plus seed.
2. Verify magic-link auth and listing photo upload against the live Storage bucket.
3. Add edit listing form for existing listings.
4. Add seller-facing transaction resend/cancel actions.
