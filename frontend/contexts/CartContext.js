"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("yw_cart");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("yw_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, selectedSize = product.sizes?.[0] || "M") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product._id && i.selectedSize === selectedSize);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          selectedSize,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id, selectedSize) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.selectedSize === selectedSize)));
  };

  const updateQuantity = (id, selectedSize, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.selectedSize === selectedSize ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, total, addToCart, removeFromCart, updateQuantity, clearCart }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
