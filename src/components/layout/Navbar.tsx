"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCart } from "@/context/CartContext";

const navLinks = [
  {
    href: "/products?category=new",
    label: "NEW RELEASES",
    className: "text-brand-accent hover:text-[#cf3d16]",
  },
  {
    href: "/products?category=men",
    label: "MEN",
    className: "text-zinc-700 dark:text-zinc-200 hover:text-brand-accent",
  },
  {
    href: "/products?category=women",
    label: "WOMEN",
    className: "text-[#c46a58] hover:text-brand-accent",
  },
  {
    href: "/products?category=seniors",
    label: "SENIORS",
    className: "text-zinc-700 dark:text-zinc-200 hover:text-brand-accent",
  },
  {
    href: "/products",
    label: "COLLECTIONS",
    className: "text-zinc-700 dark:text-zinc-200 hover:text-brand-accent",
  },
];

function CartBadge() {
  const { cartCount } = useCart();

  if (cartCount === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
      {cartCount}
    </span>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-white/92 backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0b0b0b]/92 ${
        isScrolled ? "shadow-[0_18px_40px_rgba(15,23,42,0.08)]" : ""
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 whitespace-nowrap text-base font-black tracking-tighter text-zinc-900 transition-transform dark:text-white sm:text-2xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-white transition-transform group-hover:scale-105">
              S
            </div>
            <span>
              SHOE <span className="text-brand-accent">GARDEN</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {session ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href={session.user?.role === "ADMIN" ? "/dashboard" : "/profile"}
                  className="rounded-full border border-black/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:border-brand-accent hover:text-brand-accent dark:border-white/10 dark:text-white sm:px-4"
                >
                  {session.user?.role === "ADMIN" ? "Admin" : "Profile"}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-full bg-black px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-accent dark:bg-white dark:text-black dark:hover:bg-brand-accent dark:hover:text-white sm:px-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-accent dark:bg-white dark:text-black dark:hover:bg-brand-accent dark:hover:text-white sm:px-5"
              >
                Login
              </Link>
            )}

            <div className="ml-1 flex items-center gap-1 border-l border-black/10 pl-2 dark:border-white/10 sm:gap-2 sm:pl-3">
              <ThemeToggle />
              <Link
                href="/cart"
                className="relative rounded-full p-2 text-zinc-900 transition-colors hover:text-brand-accent dark:text-white"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                <CartBadge />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 dark:border-white/10">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex min-w-max items-center gap-3 py-3 text-[11px] font-bold uppercase tracking-[0.28em] sm:gap-4 sm:text-xs lg:justify-center">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex items-center gap-3 sm:gap-4">
                  <Link href={link.href} className={`transition-colors ${link.className}`}>
                    {link.label}
                  </Link>
                  {index < navLinks.length - 1 ? (
                    <span className="text-zinc-400 dark:text-zinc-500">|</span>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
