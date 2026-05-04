/**
 * Server-side fetch base for `/products` (Next `app/api/products` or legacy Express `/api`).
 */
export function getServerApiBaseUrl() {
  const pub = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (pub) return pub;

  const back = (process.env.BACKEND_URL || process.env.API_URL || "").trim().replace(/\/$/, "");
  if (back) return `${back}/api`;

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  if (site) return `${site}/api`;

  const vercel = (process.env.VERCEL_URL || "").trim();
  if (vercel) return `https://${vercel}/api`;

  return `http://127.0.0.1:${process.env.PORT || 3000}/api`;
}
