"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DigitalProductCountdown from "@/components/DigitalProductCountdown";
import { sampleProducts } from "@/lib/sampleProducts";

const SLIDE_MS = 5000;
const SLIDE_COUNT = 5;

const MODEL_PRESETS = [
  {
    src: "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?q=80&w=900",
    alt: "Model wearing Young Wears casual look",
  },
  {
    src: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=900",
    alt: "Model in street outfit",
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900",
    alt: "Model in contemporary style",
  },
  {
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900",
    alt: "Model in core tee look",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900",
    alt: "Model portrait",
  },
];

export default function HomeHero({ products }) {
  const slides = useMemo(() => {
    const pool = Array.isArray(products) && products.length ? products : sampleProducts;
    const chosen = [];
    for (let i = 0; i < SLIDE_COUNT; i++) {
      chosen.push(pool[i % pool.length]);
    }
    return chosen.map((product, i) => ({
      product,
      model: MODEL_PRESETS[i % MODEL_PRESETS.length],
      key: `hero-${String(product._id ?? i)}-${i}`,
    }));
  }, [products]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % SLIDE_COUNT);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  const current = slides[active];

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl">
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={s.key}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${active === i ? "z-[1] opacity-100" : "z-0 opacity-0"}`}
          >
            <Image
              src={s.product.image}
              alt=""
              fill
              className="scale-105 object-cover blur-[1.5px]"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={i === 0}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f44]/90 via-[#0d2a5c]/78 to-[#0a1f44]/68" />
          </div>
        ))}
      </div>

      <div className="relative z-10 grid items-center gap-8 px-5 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,360px)] md:gap-10 md:px-8 md:py-12 lg:py-14">
        <div className="max-w-xl text-white">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-sm">
            Style for every generation
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
            Young Wears — fashion that moves with you
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
            Discover pieces styled on real models while the full look rotates with your catalog — a new hero feature every{" "}
            {SLIDE_MS / 1000} seconds.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-[#FF7A00] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:brightness-110"
            >
              Shop now
            </Link>
            <Link
              href="/categories"
              className="rounded-full border border-white/50 px-6 py-2.5 text-sm font-semibold text-white/95 backdrop-blur-sm transition hover:bg-white/10"
            >
              Browse categories
            </Link>
          </div>
          <div className="mt-7 max-w-md">
            <DigitalProductCountdown durationHours={18} label="Flash deal ends" size="md" variant="dark" />
          </div>
          <div className="mt-5 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(i)}
                className={`h-1.5 flex-1 max-w-[3.5rem] rounded-full transition ${active === i ? "bg-[#FF7A00]" : "bg-white/35 hover:bg-white/55"}`}
                aria-label={`Hero slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] justify-self-center md:justify-self-end">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/25 bg-black/25 shadow-2xl backdrop-blur-[2px]">
            {slides.map((s, i) => (
              <div
                key={`model-${s.key}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-out ${active === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <Image
                  src={s.model.src}
                  alt={s.model.alt}
                  fill
                  className="object-cover object-[center_15%]"
                  sizes="(max-width: 768px) 85vw, 360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
              </div>
            ))}

            <div className="absolute bottom-3 left-3 right-3 z-20 rounded-xl border border-white/30 bg-black/50 p-3 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:p-3.5">
              <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white sm:h-16 sm:w-16">
                  <Image
                    src={current.product.image}
                    alt={current.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FFD166] sm:text-xs">On model</p>
                  <p className="truncate text-xs font-semibold text-white sm:text-sm">{current.product.name}</p>
                  <p className="text-base font-bold text-[#FFD166] sm:text-lg">${Number(current.product.price).toFixed(2)}</p>
                </div>
              </div>
              <Link
                href={`/product/${current.product._id}`}
                className="mt-2.5 block w-full rounded-lg bg-[#FF7A00] py-2 text-center text-xs font-semibold text-white transition hover:brightness-110"
              >
                Shop this piece
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
