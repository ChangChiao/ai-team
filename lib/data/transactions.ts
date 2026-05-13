import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getEffectiveTransactionStatus } from "@/lib/transactions/state";
import { hashConfirmationToken } from "@/lib/transactions/token";
import { transactions as mockTransactions } from "@/lib/mock-data";
import type { Database } from "@/lib/supabase/database.types";
import type { Transaction } from "@/lib/types";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type DbTransactionWithRelations = TransactionRow & {
  listings: Pick<ListingRow, "title"> | null;
  profiles: Pick<ProfileRow, "display_name" | "slug"> | null;
};

export type TransactionConfirmation = {
  id: string;
  listingTitle: string;
  sellerName: string;
  sellerSlug: string;
  transactionType: "sale" | "exchange";
  status: "pending_buyer_confirmation" | "confirmed" | "expired" | "cancelled";
  expiresAt: string;
};

export async function getCurrentSellerTransactions(): Promise<Transaction[]> {
  if (!hasSupabaseEnv()) return mockTransactions;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      listings(title),
      profiles!transactions_seller_id_fkey(display_name, slug)
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as DbTransactionWithRelations[]).map((row) => ({
    id: row.id,
    listingId: row.listing_id,
    sellerSlug: row.profiles?.slug ?? row.seller_id,
    listingTitle: row.listings?.title ?? "Unknown listing",
    transactionType: row.transaction_type,
    status: row.status === "cancelled" ? "expired" : row.status,
    confirmedAt: row.confirmed_at ?? undefined
  }));
}

export async function getTransactionConfirmationByToken(token: string): Promise<TransactionConfirmation | null> {
  if (!hasSupabaseEnv()) {
    if (token === "expired") {
      return {
        id: "demo-expired",
        listingTitle: "Mini GT Nissan Skyline GT-R R34 Bayside Blue",
        sellerName: "Aki Models",
        sellerSlug: "aki-models",
        transactionType: "sale",
        status: "expired",
        expiresAt: "2026-05-01"
      };
    }

    return {
      id: "demo-pending",
      listingTitle: "Mini GT Nissan Skyline GT-R R34 Bayside Blue",
      sellerName: "Aki Models",
      sellerSlug: "aki-models",
      transactionType: "sale",
      status: token === "confirmed" ? "confirmed" : "pending_buyer_confirmation",
      expiresAt: "2026-12-31"
    };
  }

  const tokenHash = hashConfirmationToken(token);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      listings(title),
      profiles!transactions_seller_id_fkey(display_name, slug)
    `)
    .eq("confirmation_token_hash", tokenHash)
    .single();

  if (error || !data) return null;

  const row = data as DbTransactionWithRelations;
  const status = getEffectiveTransactionStatus({
    expiresAt: row.expires_at,
    status: row.status
  });

  return {
    id: row.id,
    listingTitle: row.listings?.title ?? "Unknown listing",
    sellerName: row.profiles?.display_name ?? "Unknown seller",
    sellerSlug: row.profiles?.slug ?? row.seller_id,
    transactionType: row.transaction_type,
    status,
    expiresAt: row.expires_at
  };
}
