"use server";

import prisma from "@/lib/prisma";

export async function reserveInventory(cartId: string, productId: string, quantity: number) {
  // First cleanup expired reservations
  await cleanupReservations();

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId }});
    if (!product || product.stock < quantity) {
      return { success: false, error: "Not enough stock available or item is reserved." };
    }

    // Decrement public stock
    await tx.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity }
    });

    // Create a 1-hour reservation hold
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const reservation = await tx.cartReservation.create({
      data: { cartId, productId, quantity, expiresAt }
    });

    return { success: true, reservation };
  });
}

export async function releaseInventory(cartId: string, productId: string) {
  await prisma.$transaction(async (tx) => {
    const reservations = await tx.cartReservation.findMany({
      where: { cartId, productId }
    });
    
    for (const res of reservations) {
      await tx.product.update({
        where: { id: res.productId },
        data: { stock: { increment: res.quantity } }
      });
      await tx.cartReservation.delete({ where: { id: res.id } });
    }
  });
}

export async function cleanupReservations() {
  const expired = await prisma.cartReservation.findMany({
    where: { expiresAt: { lt: new Date() } }
  });

  if (expired.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const res of expired) {
      await tx.product.update({
        where: { id: res.productId },
        data: { stock: { increment: res.quantity } }
      });
      await tx.cartReservation.delete({ where: { id: res.id } });
    }
  });
}
