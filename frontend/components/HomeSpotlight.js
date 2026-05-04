"use client";

import Image from "next/image";
import Link from "next/link";
import DigitalProductCountdown from "@/components/DigitalProductCountdown";

/**
 * Spotlight block — timer sits directly under CTA buttons (left column).
 */
export default function HomeSpotlight({ spotlight }) {
  if (!spotlight) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-14">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">Single Product Spotlight</p>
        <div className="mt-3 grid gap-6 md:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-[#0A1F44]">{spotlight.name}</h2>
            <p className="mt-3 text-slate-600">{spotlight.description}</p>
            <p className="mt-4 text-2xl font-bold text-[#0A1F44]">${Number(spotlight.price).toFixed(2)}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/product/${spotlight._id}`} className="rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-semibold text-white">
                View Product
              </Link>
              <Link href="/shop" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-[#0A1F44]">
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 max-w-md border-t border-slate-200 pt-8">
              <DigitalProductCountdown durationHours={26} label="Spotlight price ends" size="sm" variant="light" />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="relative mb-4 h-56 overflow-hidden rounded-xl">
              <Image src={spotlight.image} alt={spotlight.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
            <h3 className="text-lg font-semibold text-[#0A1F44]">Why this product?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>- Popular fit and easy styling for daily wear</li>
              <li>- Best value in current weekly deal</li>
              <li>- Available in multiple sizes for family matching</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
