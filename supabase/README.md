# Supabase Setup

This app expects Supabase Auth, Postgres, Storage, and RLS.

## Local Setup

1. Create a Supabase project or start a local Supabase stack.
2. Apply migrations from `supabase/migrations`.
3. Create `.env.local` from `.env.example`.
4. Fill:

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
- Raw transaction rows are private; public UI should show aggregate confirmed counts.
- Public event insertion is allowed for lightweight analytics.
