# Supabase Setup

This app expects Supabase Auth, Postgres, Storage, and RLS.

## Local Setup

1. Create a Supabase project or start a local Supabase stack.
2. Apply migrations from `supabase/migrations`.
3. Apply `supabase/seed.sql` if you want demo sellers, listings, and confirmed transaction history.
4. Create `.env.local` from `.env.example`.
5. Fill:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Storage

The migration creates the public `listing-photos` bucket with:

- max object size: 6 MB
- allowed MIME types: JPEG, PNG, WebP
- path convention inside the bucket: `{seller_id}/{listing_id}/{photo_id}.{ext}`

## RLS Expectations

Every public table has RLS enabled.

- Profiles are publicly readable.
- Public listings are readable.
- Sellers can mutate only their own listings/photos/transactions.
- Raw transaction rows are private.
- Public trust UI reads `seller_public_stats` and `seller_public_transactions`, which expose aggregate counts and confirmed transaction history without buyer emails or confirmation tokens.
- Public event insertion is allowed for lightweight analytics.

## Demo Seed

`supabase/seed.sql` creates three demo auth users:

```text
aki@example.com
garage@example.com
resin@example.com
```

Each uses the local development password:

```text
password123
```

The app still uses magic-link login by default, so these accounts mainly exist to satisfy profile foreign keys and to support local Supabase inspection.
