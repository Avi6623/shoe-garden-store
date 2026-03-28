"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/919125933101"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 shadow-[#25D366]/30 hover:shadow-[#25D366]/60 transition-all duration-300 group flex items-center justify-center cursor-pointer"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={32} />
      <span className="absolute right-full mr-4 bg-white/90 dark:bg-black/90 backdrop-blur-md text-brand-primary dark:text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-gray-200 dark:border-white/10">
        Chat with Support
      </span>
    </a>
  );
}
