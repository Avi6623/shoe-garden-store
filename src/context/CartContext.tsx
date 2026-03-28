"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  releaseAllInventory,
  releaseInventory,
  reserveInventory,
  syncInventoryReservation,
} from "@/app/actions/reservation";

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cartId: string;
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<boolean>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("shoe-garden-cart");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse cart", error);
      return [];
    }
  });

  const [cartId] = useState<string>(() => {
    if (typeof window === "undefined") return "server-cart";

    const savedId = localStorage.getItem("shoe-garden-cart-id");
    if (savedId) return savedId;

    const newId = crypto.randomUUID();
    localStorage.setItem("shoe-garden-cart-id", newId);
    return newId;
  });

  // Save to localStorage when items change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("shoe-garden-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = async (newItem: CartItem) => {
    const reservation = await reserveInventory(cartId, newItem.id, newItem.quantity);
    
    if (!reservation.success) {
      alert("Failed to add: " + reservation.error);
      return false;
    }

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === newItem.id);
      if (existing) {
        return currentItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...currentItems, newItem];
    });
    return true;
  };

  const removeFromCart = async (id: string) => {
    await releaseInventory(cartId, id);
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return true;
    }

    const result = await syncInventoryReservation(cartId, id, quantity);
    if (!result.success) {
      alert("Failed to update quantity: " + result.error);
      return false;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    return true;
  };

  const clearCart = async () => {
    await releaseAllInventory(cartId);
    setItems([]);
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartId, items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
