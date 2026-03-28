import DashboardClientWrapper from "@/components/admin/DashboardClientWrapper";
import prisma from "@/lib/prisma";
import Image from "next/image";
import type { Product } from "@prisma/client";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardClientWrapper>
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold">Product Inventory ({products.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-brand-muted border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 uppercase tracking-widest font-bold">
                <th className="p-4">Image</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-muted font-medium">No products found. Add a new product to get started!</td>
                </tr>
              ) : (
                products.map((product: Product) => (
                  <tr key={product.id} className="border-b last:border-0 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 relative bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-gray-200 dark:border-white/10">
                        <Image src={product.imageUrl || "/images/hero-shoe.png"} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold max-w-[200px] truncate">{product.name}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-100 dark:bg-white/10 text-brand-muted">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-black">₹{product.price.toLocaleString()}</td>
                    <td className="p-4 font-medium text-brand-muted">{product.stock} units</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardClientWrapper>
  );
}
