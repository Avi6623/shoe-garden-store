"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Loader2 } from "lucide-react";
import type { Product } from "@prisma/client";

type AddToCartProduct = Pick<Product, "id" | "name" | "price" | "stock" | "imageUrl">;

export default function AddToCartButton({ product }: { product: AddToCartProduct }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (product.stock < 1) return;
    setLoading(true);
    
    // Add to cart triggers the 1-hour inventory reservation hold
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "/images/hero-shoe.png",
      quantity: 1
    });

    setLoading(false);
  };

  if (product.stock < 1) {
    return (
      <button disabled className="mt-8 w-full md:w-auto bg-gray-200 dark:bg-white/5 text-brand-muted font-black uppercase tracking-widest px-12 py-5 rounded-xl cursor-not-allowed">
        Out of Stock / Reserved
      </button>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      className="mt-8 w-full md:w-auto bg-brand-accent text-white font-black uppercase tracking-[0.2em] px-14 py-6 rounded-[2rem] hover:bg-[#b32629] hover:shadow-[0_20px_40px_-10px_rgba(240,75,35,0.4)] transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed text-xl active:scale-95"
    >
      {loading ? <Loader2 className="animate-spin" size={28} /> : <ShoppingBag size={28} />}
      {loading ? "PROCESSING..." : "ADD TO CART"}
    </button>
  );
}
