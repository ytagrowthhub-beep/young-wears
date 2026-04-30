"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function ProductCard({ product, compact }) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const isLowStock = typeof product.stock === "number" && product.stock <= 8;
  const badgeClasses =
    "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white";

  const outer =
    compact
      ? "group overflow-hidden bg-white transition hover:bg-slate-50"
      : "group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

  return (
    <div className={outer}>
      <div className={`relative w-full overflow-hidden ${compact ? "h-48 md:h-52" : "h-64"}`}>
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {product.trending && <span className={`${badgeClasses} bg-[#FF7A00]`}>Best Seller</span>}
          {product.isNew && <span className={`${badgeClasses} bg-[#0A1F44]`}>New</span>}
          {isLowStock && <span className={`${badgeClasses} bg-rose-500`}>Low Stock</span>}
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes={compact ? "(max-width: 768px) 50vw, 25vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
        <button
          onClick={() => setLiked((prev) => !prev)}
          className={`absolute right-3 top-3 z-10 rounded-full p-2 transition ${liked ? "bg-rose-500 text-white" : "bg-white/90 text-slate-700 hover:bg-white"}`}
          aria-label="Toggle wishlist reaction"
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>
        {!compact && (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-10 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            Quick view + smooth hover interaction
          </div>
        )}
      </div>
      <div className={compact ? "p-3 md:p-4" : "p-4"}>
        <p className="text-[10px] uppercase tracking-wide text-[#FF7A00] md:text-xs">{product.category}</p>
        <h3 className={`mt-1 font-semibold text-[#0A1F44] ${compact ? "text-sm md:text-base line-clamp-2" : "text-lg"}`}>{product.name}</h3>
        <p className={`mt-2 text-slate-500 ${compact ? "line-clamp-2 text-xs" : "text-sm line-clamp-2"}`}>{product.description}</p>
        {typeof product.stock === "number" && (
          <p className="mt-2 text-xs text-slate-500">
            {product.stock <= 8 ? `${product.stock} left in stock` : "In stock"}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className={`font-bold text-[#0A1F44] ${compact ? "text-sm md:text-base" : "text-lg"}`}>${product.price.toFixed(2)}</span>
          <div className={`flex gap-1.5 ${compact ? "md:gap-2" : "gap-2"}`}>
            <Link
              href={`/product/${product._id}`}
              className={`rounded-lg border border-slate-200 hover:bg-slate-100 ${compact ? "px-2 py-1.5 text-xs md:px-3 md:py-2 md:text-sm" : "px-3 py-2 text-sm"}`}
            >
              View
            </Link>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className={`rounded-lg bg-[#FF7A00] text-white hover:opacity-90 ${compact ? "px-2 py-1.5 text-xs md:px-3 md:py-2 md:text-sm" : "px-3 py-2 text-sm"}`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
