"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { generateConfirmationToken, hashConfirmationToken } from "@/lib/transactions/token";

export type CreateTransactionState = {
  error?: string;
  success?: string;
  confirmationUrl?: string;
};

export async function createTransactionAction(
  _previousState: CreateTransactionState,
  formData: FormData
): Promise<CreateTransactionState> {
  if (!hasSupabaseEnv()) {
    return {
      error: "Supabase is not configured yet. Transaction links are disabled in demo mode."
    };
  }

  const listingId = String(formData.get("listingId") ?? "");
  const buyerEmail = String(formData.get("buyerEmail") ?? "").trim() || null;
  const transactionType = String(formData.get("transactionType") ?? "sale");

  if (!listingId || !["sale", "exchange"].includes(transactionType)) {
    return {
      error: "Invalid transaction request."
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Sign in before creating transaction confirmations."
    };
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, seller_id, status")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .single();

  if (listingError || !listing) {
    return {
      error: "Listing was not found or does not belong to you."
    };
  }

  if (listing.status === "sold") {
    return {
      error: "This listing is already marked sold."
    };
  }

  const rawToken = generateConfirmationToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

  const { error: transactionError } = await supabase.from("transactions").insert({
    buyer_email: buyerEmail,
    confirmation_token_hash: hashConfirmationToken(rawToken),
    expires_at: expiresAt,
    listing_id: listing.id,
    seller_id: user.id,
    status: "pending_buyer_confirmation",
    transaction_type: transactionType as "sale" | "exchange"
  });

  if (transactionError) {
    return {
      error: transactionError.message
    };
  }

  await supabase
    .from("listings")
    .update({
      status: "sold"
    })
    .eq("id", listing.id)
    .eq("seller_id", user.id);

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://127.0.0.1:3000";
  const confirmationUrl = `${origin}/transactions/confirm/${rawToken}`;

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/transactions");

  return {
    confirmationUrl,
    success: "Confirmation link created. Send it to the buyer after the transaction is complete."
  };
}
