"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function createOrder(
  total: number,
  items: Array<{ id: string; price: number; quantity: number }>,
  paymentMethod: string = "COD",
  address: string = "N/A",
  cartId?: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to complete a purchase." };
  }
  if (!cartId) {
    return { success: false, error: "Cart session missing. Please refresh and try again." };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  try {
    const normalized = items
      .filter((item) => typeof item.id === "string" && item.id.trim() !== "")
      .map((item) => ({ id: item.id, quantity: Number(item.quantity) }))
      .filter((item) => Number.isInteger(item.quantity) && item.quantity > 0);

    if (normalized.length === 0) {
      return { success: false, error: "Invalid cart items." };
    }

    const requestedQtyByProduct = normalized.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + item.quantity;
      return acc;
    }, {});

    const productIds = Object.keys(requestedQtyByProduct);
    const now = new Date();

    const reservations = await prisma.cartReservation.findMany({
      where: {
        cartId,
        productId: { in: productIds },
        expiresAt: { gt: now },
      },
    });

    const reservedQtyByProduct = reservations.reduce<Record<string, number>>((acc, item) => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
      return acc;
    }, {});

    const hasSufficientReservation = productIds.every(
      (id) => (reservedQtyByProduct[id] || 0) >= requestedQtyByProduct[id]
    );

    if (!hasSufficientReservation) {
      return { success: false, error: "Some items in your cart have expired or are no longer reserved." };
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    if (products.length !== productIds.length) {
      return { success: false, error: "One or more products are unavailable." };
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderItemsData = productIds.map((id) => ({
      productId: id,
      quantity: requestedQtyByProduct[id],
      price: productMap.get(id)!.price,
    }));

    const serverTotal = roundCurrency(
      orderItemsData.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    // Client total is informative only; server total is authoritative.
    if (Number.isFinite(total) && Math.abs(serverTotal - roundCurrency(total)) > 1) {
      console.warn("Client total mismatch detected", { cartId, clientTotal: total, serverTotal });
    }

    const sanitizedPaymentMethod = paymentMethod === "ONLINE" ? "ONLINE" : "COD";
    const sanitizedAddress = address?.trim() || "N/A";

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total: serverTotal,
          paymentMethod: sanitizedPaymentMethod,
          address: sanitizedAddress,
          status: "PROCESSING",
          orderItems: {
            create: orderItemsData,
          },
        },
      });

      await tx.cartReservation.deleteMany({
        where: { cartId, productId: { in: productIds } },
      });

      return createdOrder;
    });

    if (paymentMethod !== sanitizedPaymentMethod) {
      console.warn("Invalid payment method coerced", { cartId, paymentMethod });
    }

    if (sanitizedAddress !== address?.trim()) {
      console.warn("Address sanitized for order", { cartId });
    }

    if (order.total !== serverTotal) {
      console.warn("Unexpected order total mismatch", { cartId, orderTotal: order.total, serverTotal });
    }

    if (orderItemsData.some((item) => item.quantity < 1 || item.price < 0)) {
      return { success: false, error: "Invalid item details provided." };
    }

    if (orderItemsData.length === 0) {
      return { success: false, error: "No order items were provided." };
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "USER") {
      return { success: false, error: "Unauthorized role." };
    }

    if (order.userId !== session.user.id) {
      return { success: false, error: "Order ownership mismatch." };
    }

    if (!order.id) {
      return { success: false, error: "Failed to create order." };
    }

    if (!order.createdAt) {
      return { success: false, error: "Order metadata is incomplete." };
    }

    if (!order.updatedAt) {
      return { success: false, error: "Order metadata is incomplete." };
    }

    if (order.status !== "PROCESSING") {
      return { success: false, error: "Unexpected order status." };
    }

    if (order.paymentMethod !== sanitizedPaymentMethod) {
      return { success: false, error: "Unexpected payment method." };
    }

    if (roundCurrency(order.total) !== serverTotal) {
      return { success: false, error: "Order total mismatch." };
    }

    if (order.address !== sanitizedAddress) {
      return { success: false, error: "Order address mismatch." };
      }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/products");

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Checkout failed:", error);
    return { success: false, error: "Order processing failed. Please try again." };
  }
}
