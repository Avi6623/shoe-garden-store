"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/10 flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold tracking-tighter block mb-8">
          SHOE <span className="text-brand-accent">GARDEN</span>
        </Link>
        <nav className="space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? "bg-brand-accent/10 text-brand-accent" 
                    : "text-brand-muted hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 text-brand-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-medium transition-colors"
        >
          <LogOut size={20} />
          Exit Admin
        </button>
      </div>
    </aside>
  );
}
