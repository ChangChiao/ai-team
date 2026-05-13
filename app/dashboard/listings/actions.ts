"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { ListingStatus, ListingVisibility } from "@/lib/types";

export type ListingManagementState = {
  error?: string;
  success?: string;
};

const allowedStatuses = new Set<ListingStatus>(["available", "reserved", "sold"]);
const allowedVisibility = new Set<ListingVisibility>(["draft", "public", "archived"]);

export async function updateListingStatusAction(
  _previousState: ListingManagementState,
  formData: FormData
): Promise<ListingManagementState> {
  if (!hasSupabaseEnv()) {
    return {
      error: "Supabase is not configured yet. Listing status changes are disabled in demo mode."
    };
  }

  const listingId = String(formData.get("listingId") ?? "");
  const status = String(formData.get("status") ?? "") as ListingStatus;

  if (!listingId || !allowedStatuses.has(status)) {
    return {
      error: "Invalid listing status update."
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Sign in before updating listings."
    };
  }

  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    return {
      error: error.message
    };
  }

  revalidateDashboardListingPaths();
  return {
    success: `Listing marked ${status}.`
  };
}

export async function updateListingVisibilityAction(
  _previousState: ListingManagementState,
  formData: FormData
): Promise<ListingManagementState> {
  if (!hasSupabaseEnv()) {
    return {
      error: "Supabase is not configured yet. Listing visibility changes are disabled in demo mode."
    };
  }

  const listingId = String(formData.get("listingId") ?? "");
  const visibility = String(formData.get("visibility") ?? "") as ListingVisibility;

  if (!listingId || !allowedVisibility.has(visibility)) {
    return {
      error: "Invalid listing visibility update."
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Sign in before updating listings."
    };
  }

  const { error } = await supabase
    .from("listings")
    .update({ visibility })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    return {
      error: error.message
    };
  }

  revalidateDashboardListingPaths();
  return {
    success: visibility === "archived" ? "Listing archived." : `Listing visibility set to ${visibility}.`
  };
}

function revalidateDashboardListingPaths() {
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/listings");
}
