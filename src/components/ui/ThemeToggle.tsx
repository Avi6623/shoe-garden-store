"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-brand-muted hover:text-brand-accent focus:outline-none group"
      aria-label="Toggle Dark Mode"
    >
      {resolvedTheme === "dark" ? (
         <Sun size={20} className="group-hover:rotate-90 transition-transform duration-500" />
      ) : (
         <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
