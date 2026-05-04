import { NextResponse } from "next/server";
import { sampleProducts } from "@/lib/sampleProducts";
import { createCatalogServiceClient } from "@/lib/catalog-supabase";

export const dynamic = "force-dynamic";

function productToRow(p) {
  const audience =
    p.audience ||
    (p.facets?.gender === "Women" ? "women" : "") ||
    (p.facets?.gender === "Men" ? "adult" : "") ||
    (p.facets?.gender === "Kids" ? "child" : "") ||
    (p.facets?.gender === "Unisex" ? "unisex" : "") ||
    "";

  return {
    external_id: p.externalId || p.facets?.externalId || null,
    legacy_id: String(p._id),
    name: p.name,
    category: p.category,
    audience,
    price: p.price,
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    image: p.image,
    description: p.description || "",
    trending: !!p.trending,
    stock: typeof p.stock === "number" ? p.stock : 20,
    is_new: !!p.isNew,
    source: p.source || "seed",
    product_url: p.productUrl || null,
    facets: p.facets || {},
  };
}

export async function POST(request) {
  const secret = (process.env.SEED_CATALOG_SECRET || "").trim();
  const header = request.headers.get("x-young-wears-seed-secret") || "";

  if (!secret || header !== secret) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const supabase = createCatalogServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { message: "SUPABASE_SERVICE_ROLE_KEY and Supabase URL are required for seeding." },
      { status: 503 }
    );
  }

  const rows = sampleProducts.map(productToRow);
  const chunkSize = 80;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("products").upsert(chunk, {
      onConflict: "legacy_id",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error("[seed-catalog]", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    inserted += chunk.length;
  }

  return NextResponse.json({ ok: true, upserted: inserted });
}
