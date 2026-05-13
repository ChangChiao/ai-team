"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { profileSchema } from "@/lib/validation/profile";

export type ProfileState = {
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  success?: string;
};

export async function saveProfileAction(_previousState: ProfileState, formData: FormData): Promise<ProfileState> {
  const parsed = profileSchema.safeParse({
    bio: formData.get("bio"),
    displayName: formData.get("displayName"),
    facebookUrl: formData.get("facebookUrl"),
    lineId: formData.get("lineId"),
    location: formData.get("location"),
    slug: formData.get("slug")
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
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
      formError: "Sign in before saving your seller profile."
    };
  }

  const input = parsed.data;
  const { error } = await supabase.from("profiles").upsert({
    bio: input.bio || null,
    display_name: input.displayName,
    facebook_url: input.facebookUrl || null,
    id: user.id,
    line_id: input.lineId || null,
    location: input.location || null,
    slug: input.slug
  });

  if (error) {
    return {
      formError: error.message
    };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath(`/sellers/${input.slug}`);

  return {
    success: "Seller profile saved."
  };
}
