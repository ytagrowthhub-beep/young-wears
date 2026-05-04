"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomeProductCarousel({ products, title = "Trending picks", subtitle = "Fresh styles from your catalog — scroll or tap the arrows." }) {
  const scrollerRef = useRef(null);
  const items = Array.isArray(products) ? products.slice(0, 24) : [];

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.82, 280);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1F44]">{title}</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0A1F44] shadow-sm transition hover:bg-slate-50"
            aria-label="Previous products"
          >
            <ChevronLeft size={20} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0A1F44] shadow-sm transition hover:bg-slate-50"
            aria-label="Next products"
          >
            <ChevronRight size={20} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-hide mt-6 flex gap-4 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {items.map((p) => (
          <Link
            key={String(p._id)}
            href={`/product/${p._id}`}
            className="yw-card snap-start shrink-0 overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-lg w-[210px] sm:w-[236px]"
          >
            <div className="relative aspect-[4/5] bg-slate-100">
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="240px" />
            </div>
            <div className="border-t border-slate-100 bg-white p-3.5">
              <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[#FF7A00]">{p.category}</p>
              <p className="mt-1 truncate text-sm font-semibold text-[#0A1F44]">{p.name}</p>
              <p className="mt-2 text-base font-bold text-[#0A1F44]">${Number(p.price).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
