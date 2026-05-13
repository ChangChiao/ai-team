"use server";

import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type LoginState = {
  error?: string;
  success?: string;
};

export async function sendMagicLinkAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  if (!hasSupabaseEnv()) {
    return {
      error: "Supabase is not configured yet. Copy .env.example to .env.local and add your project credentials."
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return {
      error: "Email is required."
    };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://127.0.0.1:3000";
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard/profile`
    }
  });

  if (error) {
    return {
      error: error.message
    };
  }

  return {
    success: "Check your email for a sign-in link."
  };
}
