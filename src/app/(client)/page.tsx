import { Hero } from "@/components/ui/Hero";
import Link from "next/link";
export const dynamic = "force-dynamic";

import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import type { Product } from "@prisma/client";

const quickLinks = [
  { name: "MEN", href: "/products?category=men" },
  { name: "WOMEN", href: "/products?category=women" },
  { name: "SNEAKERS", href: "/products?category=sneakers" },
  { name: "SENIORS", href: "/products?category=seniors" },
  { name: "KIDS", href: "/products?category=kids" },
];

export default async function Home() {
  // Fetch up to 4 trending products from the dummy database seeded
  const trendingProductsDB = await prisma.product.findMany({
    take: 4,
  });

  const features = [
    { title: "STREETWEAR", image: "/images/hero-shoe-new.png" },
    { title: "ELEVATED COMFORT", image: "/images/hero-shoe-new.png" },
    { title: "PERFORMANCE", image: "/images/hero-shoe-new.png" },
  ];
  return (
    <>
      <Hero />
      
      {/* Local Delivery Trust Banner */}
      <div className="bg-brand-accent text-white py-4 px-6 text-center text-xs md:text-sm font-bold tracking-[0.2em] border-b border-brand-accent/20 uppercase">
        <span className="mr-3">✦</span> EXCLUSIVE FAST DELIVERY & DOORSTEP TRIALS ALL OVER INDIA <span className="ml-3">✦</span>
      </div>
      
      {/* Quick Links Section */}
      <section className="py-16 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 text-center">
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-10 text-brand-muted uppercase">Make them rightfully yours</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {quickLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-transparent group-hover:border-brand-accent transition-all duration-300 p-1">
                  <div className="w-full h-full rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-sm md:text-base tracking-widest text-brand-primary dark:text-brand-secondary group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
                    {link.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-20 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Featured Drops</h2>
          <div className="flex gap-2">
            <button className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <ChevronLeft size={24} />
            </button>
            <button className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProductsDB.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group cursor-pointer">
              <div className="relative aspect-square bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 mb-6 overflow-hidden flex items-center justify-center p-6 rounded-3xl transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:border-brand-accent/20">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-brand-accent text-white text-[9px] font-black px-3 py-1 rounded-full z-10 tracking-[0.1em] uppercase shadow-lg shadow-brand-accent/20">
                    {product.discount}
                  </span>
                )}
                
                <div className="w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3">
                  <Image 
                    src={product.imageUrl || "/images/hero-shoe-new.png"} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_20px_40px_rgba(240,75,35,0.2)]"
                  />
                </div>
              </div>
              
              <div className="px-1">
                <h3 className="font-bold text-base leading-tight uppercase tracking-tight truncate group-hover:text-brand-accent transition-colors duration-300 mb-1">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-brand-primary dark:text-brand-secondary">₹{product.price.toLocaleString()}</span>
                  {product.original && (
                    <span className="text-xs font-bold text-brand-muted/50 line-through">₹{product.original.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cutting-Edge Faves Section */}
      <section className="py-20 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl font-black tracking-tighter mb-10 uppercase">Cutting-Edge Faves</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="relative aspect-square group cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5">
              <div className="absolute inset-x-0 bottom-0 p-10 text-center bg-gradient-to-t from-black/60 to-transparent z-20">
                <h3 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase italic">{feature.title}</h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-3 z-10">
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  fill 
                  sizes="(max-width: 768px) 90vw, 32vw"
                  className="object-contain drop-shadow-2xl brightness-110 saturate-125 p-12"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="w-full bg-brand-accent mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-24 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="text-white max-w-xl">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              MADE FOR <br/> CHAMPIONS
            </h2>
            <p className="text-2xl opacity-90 mb-10 font-medium tracking-tight">The 2026 Exclusive Shoe Garden Collection.</p>
            <Link href="/products" className="inline-block bg-white text-brand-accent font-black uppercase tracking-widest px-12 py-5 rounded-full hover:bg-gray-100 transition-all shadow-2xl active:scale-95">
              Shop Now
            </Link>
          </div>
          <div className="w-full md:w-1/2 aspect-video glass rounded-[3rem] relative overflow-hidden flex items-center justify-center group shadow-inner">
            <Image 
              src="/images/hero-shoe-new.png" 
              alt="Exclusive Promo" 
              width={800} 
              height={500} 
              className="object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)] transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-3"
            />
          </div>
        </div>
      </section>
    </>
  );
}
