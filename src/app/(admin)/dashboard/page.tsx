import { ArrowUpRight, ArrowDownRight, Package, DollarSign, Users, ShoppingCart } from "lucide-react";
import DashboardClientWrapper from "@/components/admin/DashboardClientWrapper";
import prisma from "@/lib/prisma";
import Image from "next/image";
import type { Prisma, Product } from "@prisma/client";

type DashboardOrder = Prisma.OrderGetPayload<{
  include: { user: true; orderItems: { include: { product: true } } };
}>;

export default async function DashboardOverview() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  const orders = await prisma.order.findMany({
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <DashboardClientWrapper>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Revenue" 
          value={`$${orders.reduce((acc: number, sum: DashboardOrder) => acc + sum.total, 0).toLocaleString()}`} 
          trend="+20.1%" 
          isPositive={true} 
          icon={<DollarSign className="text-brand-accent" />}
        />
        <StatCard 
          title="Orders" 
          value={orders.length.toString()} 
          trend="+12.5%" 
          isPositive={true} 
          icon={<ShoppingCart className="text-blue-500" />}
        />
        <StatCard 
          title="Active Users" 
          value="2,420" 
          trend="-4.1%" 
          isPositive={false} 
          icon={<Users className="text-purple-500" />}
        />
        <StatCard 
          title="Products" 
          value={products.length.toString()} 
          trend="+2 New" 
          isPositive={true} 
          icon={<Package className="text-green-500" />}
        />
      </div>

      {/* Real Orders Overview */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold">Recent Customer Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-brand-muted border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 uppercase tracking-widest font-bold">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-muted font-medium">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order: DashboardOrder) => (
                  <tr key={order.id} className="border-b last:border-0 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-xs uppercase tracking-widest">{order.id.slice(0, 8)}...</td>
                    <td className="p-4 text-brand-muted">{order.user?.email || "Guest"}</td>
                    <td className="p-4">{order.orderItems.length} item(s)</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        order.status === "DELIVERED" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                        order.status === "PROCESSING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-black text-brand-accent">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Inventory Overview */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold">Product Inventory</h2>
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

function StatCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <p className="text-brand-muted font-medium text-sm">{title}</p>
        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend} from last month
        </p>
      </div>
    </div>
  );
}
