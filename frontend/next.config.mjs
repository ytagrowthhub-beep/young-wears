import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";

const { combinedEnv } = loadEnvConfig(__dirname, isDev);

function trimEnv(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

/** Prefer OS env (e.g. Vercel dashboard) — loadEnvConfig in production often skips .env.local. */
function mergeEnv(fileVal, osVal) {
  const f = trimEnv(fileVal);
  if (f) return f;
  return trimEnv(osVal);
}

const supabaseProjectRef = mergeEnv(
  combinedEnv.NEXT_PUBLIC_SUPABASE_PROJECT_REF,
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF
);
const supabaseUrlExplicit = mergeEnv(combinedEnv.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_URL);
const resolvedSupabaseUrl =
  supabaseUrlExplicit ||
  (supabaseProjectRef ? `https://${supabaseProjectRef}.supabase.co` : "");

const publishableOrAnon = mergeEnv(
  combinedEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || combinedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const publicEnv = {
  NEXT_PUBLIC_SUPABASE_PROJECT_REF: supabaseProjectRef,
  NEXT_PUBLIC_SUPABASE_URL: resolvedSupabaseUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableOrAnon,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: mergeEnv(combinedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  NEXT_PUBLIC_API_URL: mergeEnv(combinedEnv.NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_SITE_URL: mergeEnv(combinedEnv.NEXT_PUBLIC_SITE_URL, process.env.NEXT_PUBLIC_SITE_URL),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: publicEnv,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "ae01.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "ae-pic-a.aliexpress-media.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
