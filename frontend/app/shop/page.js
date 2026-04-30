import { Suspense } from "react";
import ShopPageClient from "./ShopPageClient";
import LoadingGrid from "@/components/LoadingGrid";

function ShopFallback() {
  return (
    <div className="w-full px-4 py-10 md:px-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <LoadingGrid />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopPageClient />
    </Suspense>
  );
}
