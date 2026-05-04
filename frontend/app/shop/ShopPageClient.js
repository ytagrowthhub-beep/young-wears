"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { sampleProducts } from "@/lib/sampleProducts";
import ProductCard from "@/components/ProductCard";
import LoadingGrid from "@/components/LoadingGrid";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import DealCountdown from "@/components/DealCountdown";
import { categoryDisplayOrder } from "@/lib/categories";
import { enrichProductForShop } from "@/lib/shopFacets";

const CATEGORY_ORDER = categoryDisplayOrder;
const PAGE_SIZE = 12;
const PRICE_MIN = 0;
const PRICE_MAX = 500;

function parseFilters(searchParams) {
  const maxRaw = searchParams.get("maxPrice");
  let maxPrice = PRICE_MAX;
  if (maxRaw !== null && maxRaw !== "") {
    const n = Number(maxRaw);
    if (Number.isFinite(n)) maxPrice = Math.min(PRICE_MAX, Math.max(PRICE_MIN, n));
  }

  return {
    sort: searchParams.get("sort") || "featured",
    category: searchParams.get("category") || "",
    size: searchParams.get("size") || "",
    q: searchParams.get("q") || "",
    maxPrice,
    ptype: searchParams.get("ptype") || "",
    gender: searchParams.get("gender") || "",
    color: searchParams.get("color") || "",
    feat: searchParams.get("feat") || searchParams.get("feature") || "",
  };
}

function buildShopQuery(searchParams, patch) {
  const next = new URLSearchParams(searchParams.toString());
  const merged = { ...parseFilters(searchParams), ...patch };
  Object.entries({
    sort: merged.sort === "featured" ? "" : merged.sort,
    category: merged.category,
    size: merged.size,
    q: merged.q,
    maxPrice: merged.maxPrice >= PRICE_MAX ? "" : String(merged.maxPrice),
    ptype: merged.ptype,
    gender: merged.gender,
    color: merged.color,
    feat: merged.feat,
  }).forEach(([key, val]) => {
    if (val === "" || val == null) next.delete(key);
    else next.set(key, String(val));
  });
  next.delete("feature");
  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function FacetGroup({ title, children }) {
  return (
    <details className="group border-b border-slate-200 py-2 last:border-b-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-3 pt-1">{children}</div>
    </details>
  );
}

function sizesFromCatalog(products) {
  const base = products.length ? products : sampleProducts;
  return [...new Set(base.flatMap((item) => item.sizes || []))].sort();
}

function filterAndSortCatalog(enrichedProducts, filters) {
  const { sort: sortBy, category, size, q: search, maxPrice, ptype, gender, color, feat } = filters;

  let list = enrichedProducts.filter((p) => {
    if (category && p.category !== category) return false;
    if (size && !(p.sizes || []).includes(size)) return false;
    if (typeof p.price === "number" && p.price > maxPrice) return false;
    const blob = `${p.name} ${p.description}`.toLowerCase();
    if (search && !blob.includes(search.toLowerCase().trim())) return false;
    if (ptype && p.shopProductType !== ptype) return false;
    if (gender && p.shopGender !== gender) return false;
    if (color && !(p.shopColors || []).includes(color)) return false;
    if (feat && !(p.shopFeatures || []).includes(feat)) return false;
    return true;
  });

  const catRank = (c) => CATEGORY_ORDER.indexOf(c);
  const popularitySort = (a, b) => {
    if (!!b.trending !== !!a.trending) return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    const ra = catRank(a.category);
    const rb = catRank(b.category);
    if (ra !== rb) return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
    return a.name.localeCompare(b.name);
  };

  if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (sortBy === "newest") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  else list = [...list].sort(popularitySort);

  return list;
}

const FILTER_SECTIONS = [
  {
    title: "Product Type",
    param: "ptype",
    options: ["T-Shirts & Tops", "Shorts", "Leggings", "Jackets", "Accessories"],
  },
  {
    title: "Gender",
    param: "gender",
    options: ["Women", "Men", "Unisex", "Kids"],
  },
  {
    title: "Features",
    param: "feat",
    options: ["Breathable", "Lightweight", "Seamless", "Pockets"],
  },
  {
    title: "Color",
    param: "color",
    options: ["Black", "Blue", "White", "Green", "Pink", "Grey"],
  },
];

const POPULAR_TAGS = [
  { label: "Women's picks", patch: { category: "Women Clothes" } },
  { label: "Men's essentials", patch: { category: "Adult Clothes" } },
  { label: "Kids", patch: { category: "Child Clothes" } },
  { label: "Activewear", patch: { category: "Activewear & Gym" } },
  { label: "Sneakers", patch: { category: "Footwear & Sneakers" } },
  { label: "Accessories", patch: { category: "Other Wears" } },
];

function FetchedProducts({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/products")
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .catch(() => {
        if (!cancelled) setProducts(sampleProducts);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return children({ products, loading });
}

function ShopListingSection({ sortedProducts, loading, resetFilters, sortBy, pushFilters }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleSlice = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <p className="text-sm text-slate-500">
          Viewing{" "}
          <span className="font-semibold text-[#0A1F44]">
            {loading ? "…" : visibleSlice.length}
          </span>
        </p>
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:hidden"
          value={sortBy}
          onChange={(e) => pushFilters({ sort: e.target.value })}
        >
          <option value="featured">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="bg-white px-0 pb-10 pt-0">
        {loading ? (
          <div className="px-4 pt-6 md:px-6">
            <LoadingGrid />
          </div>
        ) : sortedProducts.length ? (
          <>
            <div className="grid grid-cols-2 gap-px bg-slate-200 md:grid-cols-4">
              {visibleSlice.map((p) => (
                <div key={p._id} className="bg-white">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center px-4 py-8">
                <button
                  type="button"
                  className="rounded-full border-2 border-[#0A1F44] px-8 py-3 text-sm font-semibold text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  Load more
                </button>
              </div>
            )}
            <p className="text-center text-xs text-slate-500">
              Viewing 1 – {visibleSlice.length} of {sortedProducts.length} products
            </p>
          </>
        ) : (
          <div className="mx-4 rounded-2xl bg-white p-10 text-center shadow-sm md:mx-6">
            <p className="text-lg font-semibold text-[#0A1F44]">No products match your filters.</p>
            <button type="button" className="mt-4 rounded-lg bg-[#0A1F44] px-4 py-2 text-white" onClick={resetFilters}>
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function ShopPageLayout({
  products,
  loading,
  router,
  filters,
  pushFilters,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filterGridKey,
}) {
  const { sort: sortBy, category, size, q: search, maxPrice, ptype, gender, color, feat } = filters;

  const enrichedAll = useMemo(() => products.map(enrichProductForShop), [products]);

  const sizes = useMemo(() => sizesFromCatalog(products), [products]);

  const sortedProducts = useMemo(
    () => filterAndSortCatalog(enrichedAll, filters),
    [enrichedAll, filters]
  );

  const resetFilters = useCallback(() => {
    router.replace("/shop", { scroll: false });
  }, [router]);

  const facetButtonClass = (active) =>
    `rounded-full border px-2.5 py-1 text-xs ${
      active ? "border-[#0A1F44] bg-[#0A1F44] text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
    }`;

  const toggleFacet = (param, option, current) => {
    pushFilters({ [param]: current === option ? "" : option });
  };

  const sidebarFilters = (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Filter &amp; Sort</h2>
        <button type="button" className="text-xs font-semibold text-[#0A1F44]" onClick={resetFilters}>
          Clear All
        </button>
      </div>

      <FacetGroup title="Sort By">
        <select
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => pushFilters({ sort: e.target.value })}
        >
          <option value="featured">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </FacetGroup>

      <FacetGroup title="Category">
        <select
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={category}
          onChange={(e) => pushFilters({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categoryDisplayOrder.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FacetGroup>

      <FacetGroup title="Size">
        <select
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={size}
          onChange={(e) => pushFilters({ size: e.target.value })}
        >
          <option value="">All Sizes</option>
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FacetGroup>

      <FacetGroup title="Price">
        <div className="rounded-lg border border-slate-200 px-3 py-2">
          <label className="text-xs text-slate-500">
            Max price: ${maxPrice} <span className="text-slate-400">(0 – ${PRICE_MAX})</span>
          </label>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step="5"
            value={maxPrice}
            onChange={(e) => pushFilters({ maxPrice: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </FacetGroup>

      {FILTER_SECTIONS.map((section) => (
        <FacetGroup key={section.title} title={section.title}>
          <div className="flex flex-wrap gap-1.5">
            {section.options.map((option) => {
              const current = filters[section.param];
              return (
                <button
                  key={option}
                  type="button"
                  className={facetButtonClass(current === option)}
                  onClick={() => toggleFacet(section.param, option, current)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </FacetGroup>
      ))}

      <FacetGroup title="Search">
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={search}
          onChange={(e) => pushFilters({ q: e.target.value })}
          placeholder="Search products..."
        />
      </FacetGroup>
    </>
  );

  return (
    <div className="w-full">
      <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
        <h1 className="text-3xl font-bold text-[#0A1F44]">All Products</h1>
        <p className="mt-2 text-sm text-slate-500">
          <strong>{sortedProducts.length}</strong> products · Sort &amp; filters sync with URL
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-600">
            <strong>{sortedProducts.length}</strong> matching filters · Use load more for the grid below
          </span>
          <DealCountdown durationHours={18} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Popular:</span>
          {POPULAR_TAGS.map(({ label, patch }) => (
            <button
              key={label}
              type="button"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-[#0A1F44] hover:bg-slate-50"
              onClick={() => pushFilters(patch)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mx-4 mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-semibold text-white lg:hidden"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <SlidersHorizontal size={16} />
        Filter &amp; Sort
      </button>

      <div className="flex w-full">
        <aside className="hidden w-[280px] shrink-0 border-r border-slate-200 bg-white lg:block lg:sticky lg:top-[7.5rem] lg:max-h-[calc(100vh-7.5rem)] lg:self-start lg:overflow-y-auto lg:px-4 lg:py-6">
          {sidebarFilters}
        </aside>

        <section className="min-w-0 flex-1">
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters backdrop"
              />
              <div className="absolute right-0 top-0 flex h-full w-[90%] max-w-md flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h2 className="text-lg font-semibold text-[#0A1F44]">Filters</h2>
                  <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                    <X />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">{sidebarFilters}</div>
                <div className="border-t border-slate-100 p-4">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-[#0A1F44] py-3 text-sm font-semibold text-white"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <ShopListingSection
            key={filterGridKey}
            sortedProducts={sortedProducts}
            loading={loading}
            resetFilters={resetFilters}
            sortBy={sortBy}
            pushFilters={pushFilters}
          />
        </section>
      </div>
    </div>
  );
}

export default function ShopPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams.toString()]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const pushFilters = useCallback(
    (patch) => {
      router.replace(buildShopQuery(searchParams, patch), { scroll: false });
    },
    [router, searchParams]
  );

  const { sort: sortBy, category, size, q: search, maxPrice, ptype, gender, color, feat } = filters;

  const filterGridKey = `${category}|${size}|${search}|${maxPrice}|${sortBy}|${ptype}|${gender}|${color}|${feat}`;

  return (
    <FetchedProducts>
      {({ products, loading }) => (
        <ShopPageLayout
          products={products}
          loading={loading}
          router={router}
          filters={filters}
          pushFilters={pushFilters}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filterGridKey={filterGridKey}
        />
      )}
    </FetchedProducts>
  );
}
