import prisma from "@/lib/prisma";
import Image from "next/image";
import type { Prisma } from "@prisma/client";

type AdminOrder = Prisma.OrderGetPayload<{
  include: { user: true; orderItems: { include: { product: true } } };
}>;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 md:p-12 max-w-[1920px] mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Order Management</h1>
        <p className="text-brand-muted">Review and process all customer transactions.</p>
      </header>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold">All Orders ({orders.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="text-sm text-brand-muted border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 uppercase tracking-widest font-bold">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Dispatch Details</th>
                <th className="p-4">Ordered Items</th>
                <th className="p-4">Total Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-muted font-medium">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order: AdminOrder) => (
                  <tr key={order.id} className="border-b last:border-0 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-black text-sm uppercase tracking-widest text-[#D4AF37]">ORD-{order.id.slice(-6)}</td>
                    <td className="p-4 font-bold text-brand-primary">{order.user?.email || "Guest"}<br/><span className="text-xs font-medium text-brand-muted">{order.user?.role || "N/A"}</span></td>
                    <td className="p-4">
                      <div className="max-w-xs text-xs opacity-90 leading-relaxed bg-brand-surface text-brand-secondary p-3 rounded-lg font-mono border border-gray-200 dark:border-white/10 whitespace-pre-wrap">
                        {order.address || "No address provided."}
                      </div>
                    </td>
                    <td className="p-4 min-w-[300px]">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === "DELIVERED" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                            order.status === "PROCESSING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                            "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-white bg-black dark:text-black dark:bg-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{order.paymentMethod}</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                              <div className="relative w-12 h-12 bg-white dark:bg-black rounded-md overflow-hidden flex-shrink-0">
                                <Image src={item.product.imageUrl || "/images/hero-shoe.png"} alt={item.product.name} fill className="object-cover" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-xs line-clamp-1">{item.product.name}</span>
                                <span className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-black text-xl">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
