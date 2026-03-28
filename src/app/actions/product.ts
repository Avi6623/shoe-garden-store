"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized action." };
  }

  try {
    const name = (formData.get("name") as string | null)?.trim() || "";
    const description = (formData.get("description") as string | null)?.trim() || "";
    const category = (formData.get("category") as string | null)?.trim() || "uncategorized";
    const imageUrl = (formData.get("imageUrl") as string | null)?.trim() || "";

    const rawPrice = (formData.get("price") as string | null) || "0";
    const rawOriginal = (formData.get("original") as string | null) || "";
    const rawStock = (formData.get("stock") as string | null) || "0";

    const price = Number(rawPrice);
    const original = rawOriginal ? Number(rawOriginal) : null;
    const stock = Number(rawStock);

    if (!name || !description || !imageUrl) {
      return { success: false, error: "Name, description, and image are required." };
    }
    if (!Number.isFinite(price) || price <= 0) {
      return { success: false, error: "Price must be a valid number greater than 0." };
    }
    if (original !== null && (!Number.isFinite(original) || original <= 0)) {
      return { success: false, error: "Original price must be a valid positive number." };
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return { success: false, error: "Stock must be a whole number 0 or greater." };
    }
    if (imageUrl.length > 3_000_000) {
      return { success: false, error: "Uploaded image is too large." };
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        original,
        discount: (formData.get("discount") as string) || null,
        tag: (formData.get("tag") as string) || null,
        category,
        imageUrl,
        stock,
      },
    });

    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}
