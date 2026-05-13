import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  getListing as getMockListing,
  getSeller as getMockSeller,
  getSellerListings as getMockSellerListings,
  getSellerTransactions as getMockSellerTransactions,
  listings as mockListings,
  sellers as mockSellers,
  transactions as mockTransactions
} from "@/lib/mock-data";
import type { Database } from "@/lib/supabase/database.types";
import type { Listing, Seller, Transaction } from "@/lib/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
type PhotoRow = Database["public"]["Tables"]["listing_photos"]["Row"];
type SellerPublicStatsRow = Database["public"]["Views"]["seller_public_stats"]["Row"];
type SellerPublicTransactionRow = Database["public"]["Views"]["seller_public_transactions"]["Row"];

type ListingResult = {
  listing: Listing;
  seller?: Seller;
};

type DbListingWithRelations = ListingRow & {
  listing_photos: Pick<PhotoRow, "alt_text" | "sort_order" | "storage_path">[] | null;
  profiles: ProfileRow | null;
};

type PublicSellerStats = {
  activeListings: number;
  confirmedTransactions: number;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80";

function sellerFromProfile(profile: ProfileRow, listingsCount = 0, confirmedTransactions = 0): Seller {
  return {
    slug: profile.slug,
    displayName: profile.display_name,
    bio: profile.bio ?? "",
    location: profile.location ?? "Unknown",
    joinedAt: profile.created_at.slice(0, 10),
    confirmedTransactions,
    activeListings: listingsCount,
    facebookUrl: profile.facebook_url ?? undefined
  };
}

function listingFromRow(row: DbListingWithRelations, imageUrl: string): Listing {
  return {
    id: row.id,
    sellerSlug: row.profiles?.slug ?? row.seller_id,
    title: row.title,
    brand: row.brand,
    modelName: row.model_name,
    scale: row.scale ?? "",
    series: row.series ?? "",
    carCondition: row.car_condition,
    boxCondition: row.box_condition ?? "Not specified",
    defects: row.defects ?? "No defects listed.",
    price: row.price,
    currency: "TWD",
    listingMode: row.listing_mode,
    location: row.location ?? "",
    deliveryPreference: row.delivery_preference ?? "Ask seller",
    contactMethod: row.contact_method,
    status: row.status,
    visibility: row.visibility,
    imageUrl,
    createdAt: row.created_at.slice(0, 10)
  };
}

async function publicImageUrl(storagePath?: string | null) {
  if (!storagePath || !hasSupabaseEnv()) return PLACEHOLDER_IMAGE;

  const supabase = await createServerSupabaseClient();
  const { data } = supabase.storage.from("listing-photos").getPublicUrl(storagePath);
  return data.publicUrl || PLACEHOLDER_IMAGE;
}

function mockListingResults(source = mockListings): ListingResult[] {
  return source.map((listing) => ({
    listing,
    seller: getMockSeller(listing.sellerSlug)
  }));
}

async function getPublicSellerStats(sellerIds: string[]): Promise<Map<string, PublicSellerStats>> {
  const uniqueSellerIds = [...new Set(sellerIds)].filter(Boolean);
  const stats = new Map<string, PublicSellerStats>();
  if (uniqueSellerIds.length === 0 || !hasSupabaseEnv()) return stats;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("seller_public_stats")
    .select("seller_id, active_listings, confirmed_transactions")
    .in("seller_id", uniqueSellerIds);

  if (error || !data) return stats;

  for (const row of data as SellerPublicStatsRow[]) {
    stats.set(row.seller_id, {
      activeListings: row.active_listings,
      confirmedTransactions: row.confirmed_transactions
    });
  }

  return stats;
}

function sellerWithStats(profile: ProfileRow, stats?: PublicSellerStats): Seller {
  return sellerFromProfile(profile, stats?.activeListings ?? 0, stats?.confirmedTransactions ?? 0);
}

export async function getLatestListings(limit = 4): Promise<ListingResult[]> {
  if (!hasSupabaseEnv()) return mockListingResults(mockListings.slice(0, limit));

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      profiles!listings_seller_id_fkey(*),
      listing_photos(storage_path, alt_text, sort_order)
    `)
    .eq("visibility", "public")
    .neq("status", "sold")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return mockListingResults(mockListings.slice(0, limit));

  const sellerStats = await getPublicSellerStats((data as DbListingWithRelations[]).map((row) => row.seller_id));

  return Promise.all(
    (data as DbListingWithRelations[]).map(async (row) => {
      const sortedPhotos = [...(row.listing_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      return {
        listing: listingFromRow(row, await publicImageUrl(sortedPhotos[0]?.storage_path)),
        seller: row.profiles ? sellerWithStats(row.profiles, sellerStats.get(row.seller_id)) : undefined
      };
    })
  );
}

export async function getVisibleListings(): Promise<ListingResult[]> {
  if (!hasSupabaseEnv()) return mockListingResults(mockListings.filter((listing) => listing.status !== "sold"));

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      profiles!listings_seller_id_fkey(*),
      listing_photos(storage_path, alt_text, sort_order)
    `)
    .eq("visibility", "public")
    .neq("status", "sold")
    .order("created_at", { ascending: false });

  if (error || !data) return mockListingResults(mockListings.filter((listing) => listing.status !== "sold"));

  const sellerStats = await getPublicSellerStats((data as DbListingWithRelations[]).map((row) => row.seller_id));

  return Promise.all(
    (data as DbListingWithRelations[]).map(async (row) => {
      const sortedPhotos = [...(row.listing_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      return {
        listing: listingFromRow(row, await publicImageUrl(sortedPhotos[0]?.storage_path)),
        seller: row.profiles ? sellerWithStats(row.profiles, sellerStats.get(row.seller_id)) : undefined
      };
    })
  );
}

export async function getFeaturedSellers(): Promise<Seller[]> {
  if (!hasSupabaseEnv()) return mockSellers;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data) return mockSellers;

  const profiles = data as ProfileRow[];
  const sellerStats = await getPublicSellerStats(profiles.map((profile) => profile.id));
  return profiles.map((profile) => sellerWithStats(profile, sellerStats.get(profile.id)));
}

export async function getListingById(id: string): Promise<ListingResult | null> {
  if (!hasSupabaseEnv()) {
    const listing = getMockListing(id);
    return listing ? { listing, seller: getMockSeller(listing.sellerSlug) } : null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      profiles!listings_seller_id_fkey(*),
      listing_photos(storage_path, alt_text, sort_order)
    `)
    .eq("id", id)
    .eq("visibility", "public")
    .single();

  if (error || !data) return null;

  const row = data as DbListingWithRelations;
  const sortedPhotos = [...(row.listing_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const sellerStats = await getPublicSellerStats([row.seller_id]);

  return {
    listing: listingFromRow(row, await publicImageUrl(sortedPhotos[0]?.storage_path)),
    seller: row.profiles ? sellerWithStats(row.profiles, sellerStats.get(row.seller_id)) : undefined
  };
}

export async function getSellerProfile(slug: string): Promise<{
  seller: Seller;
  listings: ListingResult[];
  transactions: Transaction[];
} | null> {
  if (!hasSupabaseEnv()) {
    const seller = getMockSeller(slug);
    if (!seller) return null;
    return {
      seller,
      listings: mockListingResults(getMockSellerListings(slug)),
      transactions: getMockSellerTransactions(slug)
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const listings = await getVisibleListings();
  const sellerListings = listings.filter((entry) => entry.listing.sellerSlug === slug);
  const sellerStats = await getPublicSellerStats([data.id]);
  const { data: transactionRows } = await supabase
    .from("seller_public_transactions")
    .select("*")
    .eq("seller_id", data.id)
    .order("confirmed_at", { ascending: false })
    .limit(20);

  const transactions = ((transactionRows ?? []) as SellerPublicTransactionRow[]).map((transaction) => ({
    id: transaction.id,
    listingId: transaction.listing_id,
    sellerSlug: transaction.seller_slug,
    listingTitle: transaction.listing_title,
    transactionType: transaction.transaction_type,
    status: transaction.status,
    confirmedAt: transaction.confirmed_at
  }));

  return {
    seller: sellerWithStats(data, sellerStats.get(data.id)),
    listings: sellerListings,
    transactions
  };
}

export async function getCurrentSellerProfile(): Promise<Seller | undefined> {
  if (!hasSupabaseEnv()) return undefined;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) return undefined;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return undefined;

  const sellerStats = await getPublicSellerStats([data.id]);
  return sellerWithStats(data, sellerStats.get(data.id));
}

export async function getCurrentSellerListings(): Promise<ListingResult[]> {
  if (!hasSupabaseEnv()) return mockListingResults(mockListings);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      profiles!listings_seller_id_fkey(*),
      listing_photos(storage_path, alt_text, sort_order)
    `)
    .eq("seller_id", user.id)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  const sellerStats = await getPublicSellerStats([user.id]);

  return Promise.all(
    (data as DbListingWithRelations[]).map(async (row) => {
      const sortedPhotos = [...(row.listing_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      return {
        listing: listingFromRow(row, await publicImageUrl(sortedPhotos[0]?.storage_path)),
        seller: row.profiles ? sellerWithStats(row.profiles, sellerStats.get(row.seller_id)) : undefined
      };
    })
  );
}
