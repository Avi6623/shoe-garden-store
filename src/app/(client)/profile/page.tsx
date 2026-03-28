import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, CreditCard, Clock } from "lucide-react";
import PasswordForm from "@/components/profile/PasswordForm";
import type { Prisma } from "@prisma/client";

type ProfileOrder = Prisma.OrderGetPayload<{
  include: { orderItems: { include: { product: true } } };
}>;

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const uniqueAddresses = Array.from(
    new Set(orders.map((order) => order.address?.trim() || "").filter(Boolean))
  );
  const paymentMethods = Array.from(
    new Set(orders.map((order) => order.paymentMethod?.trim() || "").filter(Boolean))
  );

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-32 min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 uppercase">My Account</h1>
        <p className="text-brand-muted text-lg">Welcome back, {session.user.email}</p>
        <div className="mt-4">
          <span className="bg-brand-accent/10 px-3 py-1 text-brand-accent font-bold text-xs uppercase tracking-widest rounded-full">
            {session.user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-2">
          <Link href="#orders" className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 p-6 flex items-center gap-4 hover:border-brand-accent/50 cursor-pointer transition-colors shadow-lg shadow-black/5 dark:shadow-white/5">
            <Package className="text-brand-accent" size={24} />
            <h3 className="font-bold tracking-widest uppercase text-sm">Order History</h3>
          </Link>
          <Link href="#addresses" className="bg-transparent rounded-2xl border border-transparent p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors text-brand-muted">
            <MapPin size={24} />
            <h3 className="font-bold tracking-widest uppercase text-sm">Addresses</h3>
          </Link>
          <Link href="#payments" className="bg-transparent rounded-2xl border border-transparent p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors text-brand-muted">
            <CreditCard size={24} />
            <h3 className="font-bold tracking-widest uppercase text-sm">Payment Methods</h3>
          </Link>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <section id="orders" className="scroll-mt-28">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Recent Orders ({orders.length})</h2>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-white/10">
                <Package size={48} className="mx-auto text-brand-muted mb-4 opacity-50" />
                <p className="text-brand-muted font-medium mb-6">You haven&apos;t placed any orders yet.</p>
              </div>
            ) : (
              orders.map((order: ProfileOrder) => (
                <div key={order.id} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-lg shadow-black/5 dark:shadow-white/5">
                  <div className="p-6 bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <p className="text-xs font-bold text-brand-muted tracking-widest uppercase mb-1">Order Placed</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-muted tracking-widest uppercase mb-1">Total</p>
                      <p className="font-black text-brand-accent">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-muted tracking-widest uppercase mb-1">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 gap-1.5 uppercase tracking-wider">
                        <Clock size={12} /> {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <div className="w-20 h-20 relative bg-gray-50 dark:bg-[#111] rounded-xl overflow-hidden p-2">
                          <Image src={item.product.imageUrl || "/images/hero-shoe.png"} alt={item.product.name} fill className="object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{item.product.name}</h4>
                          <p className="text-sm font-medium text-brand-muted tracking-widest uppercase">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-bold">₹{item.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>

          <section id="addresses" className="scroll-mt-28 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-lg shadow-black/5 dark:shadow-white/5">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-brand-accent" size={24} />
              <h3 className="font-bold tracking-tight text-xl">Saved Addresses</h3>
            </div>
            {uniqueAddresses.length === 0 ? (
              <p className="text-brand-muted">Your delivery addresses will appear here after your first order.</p>
            ) : (
              <div className="space-y-4">
                {uniqueAddresses.map((address) => (
                  <div key={address} className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 whitespace-pre-line text-sm">
                    {address}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="payments" className="scroll-mt-28 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-lg shadow-black/5 dark:shadow-white/5">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-brand-accent" size={24} />
              <h3 className="font-bold tracking-tight text-xl">Payment Methods</h3>
            </div>
            {paymentMethods.length === 0 ? (
              <p className="text-brand-muted">Your payment methods will appear here after checkout.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <span key={method} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-muted">
                    {method}
                  </span>
                ))}
              </div>
            )}
          </section>

          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
