/**
 * Server-side fetch base for `/products`, etc. Use BACKEND_URL when NEXT_PUBLIC_API_URL is unset (e.g. Vercel → Railway API).
 */
export function getServerApiBaseUrl() {
  const pub = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (pub) return pub;
  const back = (process.env.BACKEND_URL || process.env.API_URL || "").trim().replace(/\/$/, "");
  if (back) return `${back}/api`;
  return "http://127.0.0.1:5000/api";
}
