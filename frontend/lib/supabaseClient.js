"use client";

import { createClient } from "@supabase/supabase-js";

let client;

export function getSiteUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
  const withProtocol = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  return withProtocol.replace(/\/$/, "");
}

export function getSupabaseClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env is missing (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).");
  }

  client = createClient(supabaseUrl, supabaseKey);
  return client;
}
