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

const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: trimEnv(combinedEnv.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: trimEnv(
    combinedEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || combinedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: trimEnv(combinedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  NEXT_PUBLIC_API_URL: trimEnv(combinedEnv.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_SITE_URL: trimEnv(combinedEnv.NEXT_PUBLIC_SITE_URL),
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
    ],
  },
};

export default nextConfig;
