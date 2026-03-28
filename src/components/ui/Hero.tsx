"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center pt-28 md:pt-32 pb-12 bg-[radial-gradient(circle_at_top_left,#fff7eb_0%,#fff4e2_35%,#fffdf9_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(216,177,111,0.19)_0%,transparent_40%,rgba(240,75,35,0.14)_100%)]" />
      <div className="absolute -right-28 top-28 w-[360px] h-[360px] rounded-full bg-brand-accent/10 blur-[90px] pointer-events-none" />
      <div className="absolute left-[-140px] bottom-0 w-[300px] h-[300px] rounded-full bg-[#d8b16f]/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="text-[#1f1f1f]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-8 h-[2px] bg-[#d8b16f]" />
            <span className="text-[#d8b16f] font-black tracking-widest uppercase text-[10px]">
              The Ultimate Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter"
          >
            SHOE <br />
            <span className="text-brand-accent">GARDEN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 mb-10 max-w-lg font-medium leading-relaxed"
          >
            Welcome to the sanctuary of style and performance. Your premium footwear destination for 2026.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-brand-accent text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-brand-accent/30 active:scale-95"
            >
              Shop Collection <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[22rem] sm:min-h-[26rem] lg:min-h-[32rem] xl:min-h-[35rem] max-w-[760px] mx-auto w-full"
        >
          <div className="absolute inset-0 bg-brand-accent/12 blur-[95px] rounded-full scale-75" />
          <div className="absolute inset-0 rounded-[2.8rem] border border-[#ddc7a7]/70 bg-gradient-to-br from-white/85 via-[#fff7ed]/85 to-[#fff2e8]/90 p-6 sm:p-8 shadow-[0_30px_70px_rgba(58,35,14,0.16)]">
            <div className="absolute inset-0 rounded-[2.8rem] bg-[linear-gradient(140deg,rgba(240,75,35,0.08)_0%,transparent_45%,rgba(216,177,111,0.11)_100%)]" />
            <Image
              src="/images/hero-shoe-new.png"
              alt="Shoe Garden Signature"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 45vw"
              className="object-contain p-4 sm:p-8 drop-shadow-[0_30px_55px_rgba(0,0,0,0.22)]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
