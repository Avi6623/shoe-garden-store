"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Filter, ChevronDown, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import type { Product } from "@prisma/client";

export default function ProductGridClient({
  initialProducts,
  category,
}: {
  initialProducts: Product[];
  category?: string;
}) {
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [sortBy, setSortBy] = useState("featured");

  const categories = useMemo(() => {
    return Array.from(
      new Set(initialProducts.map((product) => product.category).filter(Boolean))
    ).sort();
  }, [initialProducts]);

  const visibleProducts = useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? [...initialProducts]
        : initialProducts.filter((product) => product.category === selectedCategory);

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [initialProducts, selectedCategory, sortBy]);

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-32 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-14 border-b border-gray-200 dark:border-white/10 pb-8 mt-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 capitalize">
            {category ? `${category.replace("-", " ")} Collection` : "All Products"}
          </h1>
          <p className="text-brand-muted text-base max-w-md">
            Curated premium footwear for ultimate performance and style.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-6 md:mt-0">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Filter size={14} /> Filters
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 pr-9 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mb-10 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] p-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-brand-accent text-white"
                  : "border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              All Categories
            </button>
            {categories.map((itemCategory) => (
              <button
                key={itemCategory}
                type="button"
                onClick={() => setSelectedCategory(itemCategory)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  selectedCategory === itemCategory
                    ? "bg-brand-accent text-white"
                    : "border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {itemCategory}
              </button>
            ))}
          </div>
        </div>
      )}

      {visibleProducts.length === 0 ? (
        <div className="py-20 text-center text-brand-muted">
          No products match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleProducts.map((product) => (
            <div key={product.id} className="group border border-gray-100 dark:border-white/10 p-4 rounded-xl hover:shadow-xl transition-shadow bg-white dark:bg-[#111]">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50 dark:bg-[#050505]">
                  <Image
                    src={product.imageUrl || "/images/hero-shoe.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-brand-accent text-white text-[10px] font-bold px-2 py-1 rounded">
                      {product.discount}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1 truncate dark:text-white">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-brand-primary dark:text-white">₹{product.price.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      await addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl || "/images/hero-shoe.png",
                        quantity: 1,
                      });
                    }}
                    className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-brand-accent hover:text-white transition-colors"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
                {product.original && (
                  <span className="text-sm text-gray-500 line-through">₹{product.original.toLocaleString()}</span>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
