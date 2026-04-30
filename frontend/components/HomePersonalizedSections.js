"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePersonalizedSections({ products }) {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("yw_recently_viewed") || "[]");
  });

  useEffect(() => {
    const onUpdate = () => {
      const items = JSON.parse(localStorage.getItem("yw_recently_viewed") || "[]");
      setRecentlyViewed(items);
    };
    window.addEventListener("yw:recently-viewed-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("yw:recently-viewed-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const recommended = useMemo(() => {
    if (!products?.length) return [];
    if (!recentlyViewed.length) return products.filter((p) => p.trending).slice(0, 4);

    const viewedCategories = new Set(recentlyViewed.map((item) => item.category));
    const viewedIds = new Set(recentlyViewed.map((item) => item._id));

    const byAffinity = products.filter(
      (item) => viewedCategories.has(item.category) && !viewedIds.has(item._id)
    );
    return (byAffinity.length ? byAffinity : products).slice(0, 4);
  }, [products, recentlyViewed]);

  const [visibleCards, setVisibleCards] = useState(4);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(4);
    };
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxSlideIndex = Math.max(0, recommended.length - visibleCards);
  const effectiveSlideIndex = Math.min(slideIndex, maxSlideIndex);

  useEffect(() => {
    if (recommended.length <= visibleCards) return undefined;
    const timer = setInterval(() => {
      setSlideIndex((prev) => {
        const at = Math.min(prev, maxSlideIndex);
        return at >= maxSlideIndex ? 0 : at + 1;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [recommended.length, visibleCards, maxSlideIndex]);

  const goNext = () => {
    setSlideIndex((prev) => {
      const at = Math.min(prev, maxSlideIndex);
      return at >= maxSlideIndex ? 0 : at + 1;
    });
  };

  const goPrev = () => {
    setSlideIndex((prev) => {
      const at = Math.min(prev, maxSlideIndex);
      return at <= 0 ? maxSlideIndex : at - 1;
    });
  };

  return (
    <>
      {recentlyViewed.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0A1F44]">Recently Viewed Products</h2>
            <span className="text-sm text-slate-500">{recentlyViewed.length} items</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0A1F44]">Recommended For You</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Based on your browsing</span>
            {recommended.length > visibleCards && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="rounded-full border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                  aria-label="Previous recommended products"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                  aria-label="Next recommended products"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${effectiveSlideIndex * (100 / visibleCards)}%)` }}
          >
            {recommended.map((product) => (
              <div
                key={product._id}
                className="shrink-0 px-3"
                style={{ flexBasis: `${100 / visibleCards}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
