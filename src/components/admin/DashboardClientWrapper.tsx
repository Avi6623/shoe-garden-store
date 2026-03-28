"use client";

import { useState } from "react";
import ProductModal from "@/components/admin/ProductModal";

export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto relative">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-brand-muted">Welcome back! Manage the Shoe Garden inventory.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-xl shadow-brand-accent/20"
        >
          + Add New Product
        </button>
      </header>

      {children}
      
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
