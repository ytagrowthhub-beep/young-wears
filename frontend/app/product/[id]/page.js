"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { sampleProducts } from "@/lib/sampleProducts";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetails({ params }) {
  const { id } = params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSize(res.data.sizes?.[0] || "");
      })
      .catch(() => {
        const fallback = sampleProducts.find((p) => p._id === id) || sampleProducts[0];
        setProduct(fallback);
        setSize(fallback.sizes?.[0] || "");
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const item = {
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      sizes: product.sizes,
      description: product.description,
      stock: product.stock,
      trending: product.trending,
      isNew: product.isNew,
    };
    const current = JSON.parse(localStorage.getItem("yw_recently_viewed") || "[]");
    const deduped = [item, ...current.filter((p) => p._id !== item._id)].slice(0, 8);
    localStorage.setItem("yw_recently_viewed", JSON.stringify(deduped));
    window.dispatchEvent(new Event("yw:recently-viewed-updated"));
  }, [product]);

  if (!product) return <div className="mx-auto max-w-7xl px-6 py-20">Loading product...</div>;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-2">
      <div className="relative h-[520px] w-full overflow-hidden rounded-2xl">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-[#FF7A00]">{product.category}</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0A1F44]">{product.name}</h1>
        <p className="mt-4 text-slate-600">{product.description}</p>
        <p className="mt-4 text-2xl font-bold text-[#0A1F44]">${product.price.toFixed(2)}</p>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-slate-700">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`rounded-lg border px-4 py-2 ${size === s ? "border-[#0A1F44] bg-[#0A1F44] text-white" : "border-slate-300"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => addToCart(product, 1, size)} className="mt-8 rounded-xl bg-[#FF7A00] px-6 py-3 font-semibold text-white hover:opacity-90">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
