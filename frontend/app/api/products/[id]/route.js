import { NextResponse } from "next/server";
import { sampleProducts } from "@/lib/sampleProducts";
import { createCatalogClient, mapProductRow } from "@/lib/catalog-supabase";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const rawId = decodeURIComponent(id || "");

  const supabase = createCatalogClient();

  if (!supabase) {
    const fallback =
      sampleProducts.find((p) => String(p._id) === rawId) || sampleProducts.find((p) => String(p.id) === rawId);
    if (!fallback) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    return NextResponse.json(fallback);
  }

  const byLegacy = await supabase.from("products").select("*").eq("legacy_id", rawId).maybeSingle();
  if (!byLegacy.error && byLegacy.data) {
    return NextResponse.json(mapProductRow(byLegacy.data));
  }

  const byId = await supabase.from("products").select("*").eq("id", rawId).maybeSingle();
  if (!byId.error && byId.data) {
    return NextResponse.json(mapProductRow(byId.data));
  }

  const byExt = await supabase.from("products").select("*").eq("external_id", rawId).maybeSingle();
  if (!byExt.error && byExt.data) {
    return NextResponse.json(mapProductRow(byExt.data));
  }

  const fallback =
    sampleProducts.find((p) => String(p._id) === rawId) || sampleProducts.find((p) => String(p.externalId) === rawId);
  if (fallback) return NextResponse.json(fallback);

  return NextResponse.json({ message: "Product not found." }, { status: 404 });
}
