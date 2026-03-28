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

export async function syncInventoryReservation(cartId: string, productId: string, quantity: number) {
  await cleanupReservations();

  if (!cartId || !productId) {
    return { success: false, error: "Cart session missing." };
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    return { success: false, error: "Invalid quantity." };
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, error: "Product not found." };
    }

    const existingReservations = await tx.cartReservation.findMany({
      where: { cartId, productId },
      orderBy: { createdAt: "asc" },
    });

    const reservedQuantity = existingReservations.reduce((sum, item) => sum + item.quantity, 0);

    if (quantity === reservedQuantity) {
      return { success: true, quantity };
    }

    if (quantity === 0) {
      if (reservedQuantity > 0) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { increment: reservedQuantity } },
        });
        await tx.cartReservation.deleteMany({ where: { cartId, productId } });
      }

      return { success: true, quantity: 0 };
    }

    if (quantity > reservedQuantity) {
      const needed = quantity - reservedQuantity;

      if (product.stock < needed) {
        return { success: false, error: "Not enough stock available." };
      }

      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: needed } },
      });

      await tx.cartReservation.create({
        data: {
          cartId,
          productId,
          quantity: needed,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      return { success: true, quantity };
    }

    const quantityToRelease = reservedQuantity - quantity;
    let remaining = quantityToRelease;

    for (const reservation of existingReservations) {
      if (remaining === 0) break;

      if (reservation.quantity <= remaining) {
        remaining -= reservation.quantity;
        await tx.cartReservation.delete({ where: { id: reservation.id } });
      } else {
        await tx.cartReservation.update({
          where: { id: reservation.id },
          data: { quantity: reservation.quantity - remaining },
        });
        remaining = 0;
      }
    }

    await tx.product.update({
      where: { id: productId },
      data: { stock: { increment: quantityToRelease } },
    });

    return { success: true, quantity };
  });
}

export async function releaseAllInventory(cartId: string) {
  if (!cartId) return;

  const reservations = await prisma.cartReservation.findMany({
    where: { cartId },
  });

  if (reservations.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const reservation of reservations) {
      await tx.product.update({
        where: { id: reservation.productId },
        data: { stock: { increment: reservation.quantity } },
      });
    }

    await tx.cartReservation.deleteMany({ where: { cartId } });
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
