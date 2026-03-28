"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/order";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { cartId, items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && items.length === 0 && !success) {
      router.replace("/cart");
    }
  }, [items.length, success, status, router]);

  if (items.length === 0 && !success) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return setError("Cart is empty");
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const address = `${formData.get("fullName")}\nPh: ${formData.get("phone")}\n${formData.get("address")}\n${formData.get("city")}, ${formData.get("state")} - ${formData.get("zip")}`;

    const orderItems = items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity
    }));

    const result = await createOrder(cartTotal, orderItems, paymentMethod, address, cartId);

    if (result.success) {
      setSuccess(true);
      await clearCart();
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } else {
      setError(result.error || "Checkout failed");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-[1920px] mx-auto">
        <CheckCircle2 size={100} className="text-green-500 mb-8" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">Order Confirmed!</h1>
        <p className="text-brand-muted text-lg mb-8 max-w-md">
          {paymentMethod === "COD" ? "Please prepare exact change at the time of delivery." : "Payment verified. Your premium footwear is being prepared for dispatch."} Redirecting to your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-10 uppercase">Checkout</h1>
      
      <div className="glass dark:glass-dark rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] rounded-full" />
        
        <div className="mb-16 text-center border-b border-gray-100 dark:border-white/5 pb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-muted mb-4">Total Amount Due</h2>
          <p className="text-6xl md:text-7xl font-black text-brand-accent tracking-tighter tabular-nums">₹{cartTotal.toLocaleString()}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-sm border border-red-500/20 mb-10 text-center font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-12">
          <div className="space-y-8">
            <h3 className="font-black uppercase tracking-[0.3em] text-[10px] text-brand-accent">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="fullName" required className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none font-bold placeholder:text-brand-muted/40 transition-all" placeholder="Full Name *" />
              <input name="phone" required type="tel" className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none font-bold placeholder:text-brand-muted/40 transition-all" placeholder="Phone Number *" />
            </div>
            <input name="address" required className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none font-bold placeholder:text-brand-muted/40 transition-all" placeholder="Street Address *" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input name="city" required className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none font-bold placeholder:text-brand-muted/40 transition-all" placeholder="City *" />
              <input name="state" required className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none font-bold placeholder:text-brand-muted/40 transition-all" placeholder="State *" />
              <input name="zip" required className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none font-bold placeholder:text-brand-muted/40 transition-all" placeholder="PIN Code *" />
            </div>
          </div>

          <div className="space-y-8 pt-10 border-t border-gray-100 dark:border-white/5">
            <h3 className="font-black uppercase tracking-[0.3em] text-[10px] text-brand-accent">Payment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className={`cursor-pointer group flex items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'COD' ? 'border-brand-accent bg-brand-accent/5' : 'border-gray-200 dark:border-white/10 hover:border-brand-accent/30'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                <span className={`font-black uppercase tracking-widest ${paymentMethod === 'COD' ? 'text-brand-accent' : 'text-brand-muted group-hover:text-white'}`}>Cash on Delivery</span>
              </label>
              <label className={`cursor-pointer group flex items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'ONLINE' ? 'border-brand-accent bg-brand-accent/5' : 'border-gray-200 dark:border-white/10 hover:border-brand-accent/30'}`}>
                <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="hidden" />
                <span className={`font-black uppercase tracking-widest ${paymentMethod === 'ONLINE' ? 'text-brand-accent' : 'text-brand-muted group-hover:text-white'}`}>Pay Online</span>
              </label>
            </div>
          </div>

          <div className="pt-10">
            <button
              type="submit"
              disabled={loading || status !== "authenticated"}
              className="w-full group relative bg-brand-accent hover:bg-[#b32629] text-white font-black uppercase tracking-[0.2em] py-6 rounded-3xl transition-all shadow-2xl shadow-brand-accent/20 flex items-center justify-center disabled:opacity-70 text-xl overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative flex items-center gap-4">
                {loading ? <Loader2 className="animate-spin" size={24} /> : (paymentMethod === "COD" ? "Complete Purchase" : "Verify & Pay")}
              </span>
            </button>
            <p className="text-center text-[10px] text-brand-muted mt-6 font-black tracking-[0.4em] uppercase opacity-50">
              Authenticated & Encrypted Transaction
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
