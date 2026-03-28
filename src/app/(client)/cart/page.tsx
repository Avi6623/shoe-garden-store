"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-32 min-h-[80vh]">
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 uppercase">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-32 glass dark:glass-dark rounded-[3rem] border border-gray-100 dark:border-white/5">
          <p className="text-brand-muted text-xl mb-10 font-medium">Your shopping bag is empty.</p>
          <Link href="/products" className="group relative px-12 py-5 bg-brand-accent text-white font-black uppercase tracking-[0.2em] rounded-full overflow-hidden shadow-2xl shadow-brand-accent/30 transition-transform active:scale-95">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative flex items-center gap-3">
              <ArrowLeft size={20} /> Continue Shopping
            </span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-8 p-8 bg-gray-50 dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 group hover:border-brand-accent/20 transition-all duration-500">
                <div className="w-24 h-24 md:w-40 md:h-40 relative bg-white dark:bg-black/50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tighter group-hover:text-brand-accent transition-colors">{item.name}</h3>
                      <p className="font-black text-brand-accent text-xl mt-2 tabular-nums">₹{item.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-muted hover:text-red-500 transition-colors p-3 hover:bg-red-500/10 rounded-full"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">Quantity</label>
                    <div className="relative">
                      <select 
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="appearance-none bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-6 py-2.5 font-black text-sm focus:ring-2 focus:ring-brand-accent outline-none pr-10"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="glass dark:glass-dark p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 sticky top-32 shadow-2xl">
              <h2 className="text-2xl font-black mb-10 tracking-tighter uppercase">Order Summary</h2>
              
              <div className="space-y-6 mb-10 text-sm font-black uppercase tracking-widest">
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="tabular-nums">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Delivery</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-brand-muted/60">
                  <span>Taxes</span>
                  <span>Calculated later</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-white/5 pt-8 mb-10 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-muted mb-1">Total</span>
                <span className="text-5xl font-black text-brand-accent tracking-tighter tabular-nums">₹{cartTotal.toLocaleString()}</span>
              </div>
              
              <Link 
                href="/checkout"
                className="group relative w-full bg-brand-primary dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] py-6 rounded-3xl flex items-center justify-center gap-3 overflow-hidden shadow-2xl transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-brand-accent translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative flex items-center gap-3 group-hover:text-white transition-colors">
                  Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
