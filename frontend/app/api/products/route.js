import { NextResponse } from "next/server";
import { sampleProducts } from "@/lib/sampleProducts";
import {
  createCatalogClient,
  filterCatalogQuery,
  mapProductRow,
} from "@/lib/catalog-supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const supabase = createCatalogClient();

  if (!supabase) {
    const mapped = sampleProducts.map((p) => ({ ...p, created_at: new Date().toISOString() }));
    return NextResponse.json(filterCatalogQuery(mapped, searchParams));
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/products]", error.message);
    const mapped = sampleProducts.map((p) => ({ ...p, created_at: new Date().toISOString() }));
    return NextResponse.json(filterCatalogQuery(mapped, searchParams));
  }

  if (!data?.length) {
    const mapped = sampleProducts.map((p) => ({ ...p, created_at: new Date().toISOString() }));
    return NextResponse.json(filterCatalogQuery(mapped, searchParams));
  }

  const mapped = data.map(mapProductRow).filter(Boolean);
  return NextResponse.json(filterCatalogQuery(mapped, searchParams));
}
