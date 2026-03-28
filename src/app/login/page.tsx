"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setIsLoading(false);
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const destination = session?.user?.role === "ADMIN" ? "/dashboard" : "/profile";
      router.push(destination);
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_15%_10%,#fff7eb_0%,#fff3df_40%,#fffdf8_100%)] flex items-center justify-center p-6 overflow-hidden">
      {/* Premium Background Watermark */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff7eb]/95 via-[#fff7eb]/70 to-white/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-0">
          <div className="relative w-[150%] h-[150%] md:w-[120%] md:h-[120%] -left-[20%] opacity-70">
            <Image 
              src="/images/hero-shoe.png"
              alt="Shoe Garden Watermark"
              fill
              className="object-contain saturate-0 brightness-95 mix-blend-screen"
              priority
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-widest uppercase">Back to Store</span>
        </Link>
        
        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-[#e9dfcf] shadow-[0_20px_50px_rgba(67,46,24,0.15)]">
          <div className="text-center mb-10">
            <Link href="/" className="text-4xl font-black tracking-tighter inline-block mb-3 text-brand-primary">
              SHOE <span className="text-brand-accent">GARDEN</span>
            </Link>
            <p className="text-brand-muted font-medium">Welcome back. Enter your credentials to access the portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#b32629]/20 text-[#ff4d50] p-4 rounded-xl text-sm border border-[#b32629]/50 font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-brand-muted mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-white border border-[#eadfcf] focus:outline-none focus:ring-2 focus:ring-brand-accent text-brand-primary transition-all placeholder:text-zinc-400"
                  placeholder="admin@shoegarden.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-brand-muted mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-white border border-[#eadfcf] focus:outline-none focus:ring-2 focus:ring-brand-accent text-brand-primary transition-all placeholder:text-zinc-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-accent hover:bg-[#b32629] text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Authenticate"}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-[#eadfcf] text-center">
            <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-[250px] mx-auto">
              Secure portal entry for verified account holders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
