"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { hashConfirmationToken } from "@/lib/transactions/token";

export type ConfirmTransactionState = {
  error?: string;
  success?: string;
};

export async function confirmTransactionAction(
  _previousState: ConfirmTransactionState,
  formData: FormData
): Promise<ConfirmTransactionState> {
  const token = String(formData.get("token") ?? "");

  if (!token) {
    return {
      error: "Confirmation token is missing."
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      success: "Demo confirmation accepted. Configure Supabase to persist real transaction history."
    };
  }

  const supabase = await createServerSupabaseClient();
  const tokenHash = hashConfirmationToken(token);
  const { data: transaction, error } = await supabase
    .from("transactions")
    .select("id, seller_id, status, expires_at")
    .eq("confirmation_token_hash", tokenHash)
    .single();

  if (error || !transaction) {
    return {
      error: "This confirmation link is not valid."
    };
  }

  if (transaction.status === "confirmed") {
    return {
      success: "This transaction was already confirmed."
    };
  }

  if (transaction.status !== "pending_buyer_confirmation") {
    return {
      error: "This transaction can no longer be confirmed."
    };
  }

  if (new Date(transaction.expires_at).getTime() < Date.now()) {
    await supabase
      .from("transactions")
      .update({
        status: "expired"
      })
      .eq("id", transaction.id);

    return {
      error: "This confirmation link expired. Ask the seller to create a new one."
    };
  }

  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      confirmed_at: new Date().toISOString(),
      status: "confirmed"
    })
    .eq("id", transaction.id)
    .eq("status", "pending_buyer_confirmation");

  if (updateError) {
    return {
      error: updateError.message
    };
  }

  revalidatePath("/dashboard/transactions");

  return {
    success: "Transaction confirmed. The seller profile now has one more confirmed transaction."
  };
}
