import { createClient } from "@supabase/supabase-js";

export function getSupabaseProjectUrl() {
  const explicit = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const ref = (process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || "").trim();
  if (ref) return `https://${ref}.supabase.co`;
  return "";
}

export function getSupabaseAnonKey() {
  return (
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "").trim() ||
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
  );
}

/** Server-side reads (RLS: public SELECT on products). */
export function createCatalogClient() {
  const url = getSupabaseProjectUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Upserts / admin seed only — never expose this key to the browser. */
export function createCatalogServiceClient() {
  const url = getSupabaseProjectUrl() || (process.env.SUPABASE_URL || "").trim().replace(/\/$/, "");
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function mapProductRow(row) {
  if (!row) return null;
  return {
    _id: row.legacy_id || row.id,
    id: row.id,
    name: row.name,
    category: row.category,
    audience: row.audience || "",
    price: Number(row.price),
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    image: row.image,
    description: row.description || "",
    trending: !!row.trending,
    stock: typeof row.stock === "number" ? row.stock : 0,
    isNew: !!row.is_new,
    source: row.source || "seed",
    productUrl: row.product_url || undefined,
    facets: typeof row.facets === "object" && row.facets ? row.facets : {},
    externalId: row.external_id || undefined,
    created_at: row.created_at,
  };
}

export function filterCatalogQuery(mapped, searchParams) {
  const category = searchParams.get("category") || "";
  const size = searchParams.get("size") || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  let list = [...mapped];
  if (category) list = list.filter((p) => p.category === category);
  if (size) list = list.filter((p) => (p.sizes || []).includes(size));
  if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
  list.sort((a, b) => {
    const ta = new Date(a.created_at || 0).getTime();
    const tb = new Date(b.created_at || 0).getTime();
    return tb - ta;
  });
  return list;
}
