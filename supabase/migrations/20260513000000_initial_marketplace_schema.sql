create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  bio text,
  location text,
  facebook_url text,
  line_id text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 8 and 160),
  brand text not null,
  model_name text not null,
  scale text,
  series text,
  car_condition text not null,
  box_condition text,
  defects text,
  price numeric(12, 2) check (price is null or price >= 0),
  currency text not null default 'TWD',
  listing_mode text not null check (listing_mode in ('sale', 'trade', 'sale_or_trade')),
  location text,
  delivery_preference text,
  contact_method text not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  visibility text not null default 'draft' check (visibility in ('draft', 'public', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create index listings_public_recent_idx
  on public.listings (visibility, status, created_at desc);

create index listings_seller_status_idx
  on public.listings (seller_id, status);

create index listings_brand_idx
  on public.listings (brand);

create index listings_scale_idx
  on public.listings (scale);

create index listings_search_idx
  on public.listings
  using gin (
    to_tsvector(
      'simple',
      coalesce(title, '') || ' ' ||
      coalesce(brand, '') || ' ' ||
      coalesce(model_name, '') || ' ' ||
      coalesce(series, '')
    )
  );

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (listing_id, sort_order)
);

create index listing_photos_listing_order_idx
  on public.listing_photos (listing_id, sort_order);

create index listing_photos_seller_idx
  on public.listing_photos (seller_id);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  buyer_id uuid references public.profiles(id) on delete set null,
  buyer_email text,
  transaction_type text not null check (transaction_type in ('sale', 'exchange')),
  status text not null default 'pending_buyer_confirmation'
    check (status in ('pending_buyer_confirmation', 'confirmed', 'expired', 'cancelled')),
  confirmation_token_hash text unique,
  confirmed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status != 'confirmed'
    or confirmed_at is not null
  )
);

create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create index transactions_seller_status_idx
  on public.transactions (seller_id, status);

create index transactions_listing_status_idx
  on public.transactions (listing_id, status);

create table public.listing_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  seller_id uuid references public.profiles(id) on delete set null,
  event_type text not null check (event_type in ('listing_view', 'seller_profile_view', 'contact_click', 'share_click')),
  session_id text,
  referrer text,
  created_at timestamptz not null default now()
);

create index listing_events_listing_type_created_idx
  on public.listing_events (listing_id, event_type, created_at desc);

create index listing_events_seller_type_created_idx
  on public.listing_events (seller_id, event_type, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.transactions enable row level security;
alter table public.listing_events enable row level security;

create policy "Profiles are publicly readable"
on public.profiles for select
using (true);

create policy "Users can insert their own profile"
on public.profiles for insert
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Public listings are readable"
on public.listings for select
using (visibility = 'public');

create policy "Sellers can read their own listings"
on public.listings for select
using ((select auth.uid()) = seller_id);

create policy "Sellers can insert their own listings"
on public.listings for insert
with check ((select auth.uid()) = seller_id);

create policy "Sellers can update their own listings"
on public.listings for update
using ((select auth.uid()) = seller_id)
with check ((select auth.uid()) = seller_id);

create policy "Public photos for public listings are readable"
on public.listing_photos for select
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_photos.listing_id
      and listings.visibility = 'public'
  )
);

create policy "Sellers can read their own listing photos"
on public.listing_photos for select
using ((select auth.uid()) = seller_id);

create policy "Sellers can insert photos for their own listings"
on public.listing_photos for insert
with check (
  (select auth.uid()) = seller_id
  and exists (
    select 1
    from public.listings
    where listings.id = listing_photos.listing_id
      and listings.seller_id = (select auth.uid())
  )
);

create policy "Sellers can delete their own listing photos"
on public.listing_photos for delete
using ((select auth.uid()) = seller_id);

create policy "Sellers can read their own transactions"
on public.transactions for select
using ((select auth.uid()) = seller_id);

create policy "Buyers can read their own linked transactions"
on public.transactions for select
using ((select auth.uid()) = buyer_id);

create policy "Sellers can create transactions for their listings"
on public.transactions for insert
with check (
  (select auth.uid()) = seller_id
  and exists (
    select 1
    from public.listings
    where listings.id = transactions.listing_id
      and listings.seller_id = (select auth.uid())
  )
);

create policy "Sellers can cancel their pending transactions"
on public.transactions for update
using ((select auth.uid()) = seller_id and status = 'pending_buyer_confirmation')
with check ((select auth.uid()) = seller_id);

create policy "Public can insert listing events"
on public.listing_events for insert
with check (true);

create policy "Sellers can read their own listing events"
on public.listing_events for select
using ((select auth.uid()) = seller_id);

create policy "Public can read listing photo objects"
on storage.objects for select
using (bucket_id = 'listing-photos');

create policy "Authenticated sellers can upload listing photos"
on storage.objects for insert
with check (
  bucket_id = 'listing-photos'
  and (select auth.uid()) is not null
  and split_part(name, '/', 1) = (select auth.uid())::text
);

create policy "Authenticated sellers can update their listing photos"
on storage.objects for update
using (
  bucket_id = 'listing-photos'
  and split_part(name, '/', 1) = (select auth.uid())::text
)
with check (
  bucket_id = 'listing-photos'
  and split_part(name, '/', 1) = (select auth.uid())::text
);

create policy "Authenticated sellers can delete their listing photos"
on storage.objects for delete
using (
  bucket_id = 'listing-photos'
  and split_part(name, '/', 1) = (select auth.uid())::text
);
