"use client";

import { createClient } from "@supabase/supabase-js";

let cachedBrowserClient;

function readPublicEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function getSiteUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  const envUrl =
    readPublicEnv("NEXT_PUBLIC_SITE_URL") ||
    readPublicEnv("NEXT_PUBLIC_VERCEL_URL") ||
    "http://localhost:3000";
  const withProtocol = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  return withProtocol.replace(/\/$/, "");
}

/**
 * Browser-only Supabase client. Loads URL + anon/publishable key from the Next.js
 * server (`/api/supabase-env`) so auth works even when client bundles miss inlined NEXT_PUBLIC_* vars.
 */
export async function getSupabaseBrowserClient() {
  if (cachedBrowserClient) return cachedBrowserClient;

  const urlInline = readPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
  const keyInline =
    readPublicEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    readPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (urlInline && keyInline) {
    cachedBrowserClient = createClient(urlInline, keyInline);
    return cachedBrowserClient;
  }

  const res = await fetch("/api/supabase-env", { cache: "no-store" });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      body.error ||
        "Could not load Supabase configuration from the server. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or ANON key), restart dev, or configure Vercel env and redeploy."
    );
  }

  const { url, key } = body;
  if (!url || !key) {
    throw new Error("Invalid Supabase configuration returned from server.");
  }

  cachedBrowserClient = createClient(url, key);
  return cachedBrowserClient;
}
