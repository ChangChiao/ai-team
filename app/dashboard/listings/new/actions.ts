"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  buildListingPhotoPath,
  extractUploadedPhotos,
  getListingPhotoExtension,
  validateListingPhotos
} from "@/lib/storage/listing-photos";
import { listingSchema } from "@/lib/validation/listing";

export type CreateListingState = {
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  success?: string;
};

export async function createListingAction(
  _previousState: CreateListingState,
  formData: FormData
): Promise<CreateListingState> {
  const parsed = listingSchema.safeParse({
    title: formData.get("title"),
    brand: formData.get("brand"),
    modelName: formData.get("modelName"),
    scale: formData.get("scale"),
    carCondition: formData.get("carCondition"),
    boxCondition: formData.get("boxCondition"),
    defects: formData.get("defects"),
    price: formData.get("price") ? formData.get("price") : null,
    listingMode: formData.get("listingMode"),
    location: formData.get("location"),
    contactMethod: formData.get("contactMethod")
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const photos = extractUploadedPhotos(formData);
  const photoErrors = validateListingPhotos(photos);

  if (photoErrors.length > 0) {
    return {
      fieldErrors: {
        photos: photoErrors
      }
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      formError: "Supabase is not configured yet. Copy .env.example to .env.local and add your project credentials."
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      formError: "Sign in before creating a listing."
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      formError: "Create your seller profile before publishing listings."
    };
  }

  const input = parsed.data;
  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
    brand: input.brand,
    box_condition: input.boxCondition || null,
    car_condition: input.carCondition,
    contact_method: input.contactMethod,
    defects: input.defects || null,
    listing_mode: input.listingMode,
    location: input.location,
    model_name: input.modelName,
    price: input.price,
    scale: input.scale,
    seller_id: user.id,
    status: "available",
    title: input.title,
      visibility: "draft"
    })
    .select("id")
    .single();

  if (error || !listing) {
    return {
      formError: error?.message ?? "Listing could not be created."
    };
  }

  const photoRows = [];

  for (const [index, photo] of photos.entries()) {
    const extension = getListingPhotoExtension(photo.type);
    if (!extension) {
      return {
        formError: "Unsupported photo type. Your listing was saved as a draft."
      };
    }

    const photoId = randomUUID();
    const storagePath = buildListingPhotoPath({
      extension,
      listingId: listing.id,
      photoId,
      sellerId: user.id
    });

    const { error: uploadError } = await supabase.storage
      .from("listing-photos")
      .upload(storagePath, photo, {
        contentType: photo.type,
        upsert: false
      });

    if (uploadError) {
      return {
        formError: `Photo upload failed. Your listing was saved as a draft. ${uploadError.message}`
      };
    }

    photoRows.push({
      alt_text: `${input.title} photo ${index + 1}`,
      listing_id: listing.id,
      seller_id: user.id,
      sort_order: index,
      storage_path: storagePath
    });
  }

  const { error: photoRowError } = await supabase.from("listing_photos").insert(photoRows);

  if (photoRowError) {
    return {
      formError: `Photo records could not be saved. Your listing was saved as a draft. ${photoRowError.message}`
    };
  }

  const { error: publishError } = await supabase
    .from("listings")
    .update({
      visibility: "public"
    })
    .eq("id", listing.id)
    .eq("seller_id", user.id);

  if (publishError) {
    return {
      formError: `Listing was saved as a draft but could not be published. ${publishError.message}`
    };
  }

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/dashboard");

  return {
    success: "Listing published with photos."
  };
}
