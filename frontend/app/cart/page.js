"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block rounded-lg bg-[#0A1F44] px-5 py-2 text-white">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#0A1F44]">{item.name}</h3>
              <p className="text-sm text-slate-500">Size: {item.selectedSize}</p>
              <p className="mt-1 text-sm font-semibold">${item.price.toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="rounded border px-2">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="rounded border px-2">+</button>
                <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="ml-3 text-sm text-red-500">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-[#0A1F44]">Checkout</h2>
        <p className="mt-4 text-sm text-slate-500">Simple UI checkout flow</p>
        <div className="mt-5 border-t pt-4">
          <div className="mb-2 flex justify-between text-sm text-slate-500">
            <span>Items</span>
            <span>{items.length}</span>
          </div>
          <div className="mb-2 flex justify-between text-sm text-slate-500">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setPlaced(true);
            clearCart();
          }}
          className="mt-5 w-full rounded-lg bg-[#FF7A00] px-4 py-3 font-semibold text-white"
        >
          Place Order
        </button>
        {placed && <p className="mt-3 text-sm text-green-600">Order placed successfully.</p>}
      </div>
    </div>
  );
}
