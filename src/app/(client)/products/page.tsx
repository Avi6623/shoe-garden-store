export const dynamic = "force-dynamic";

import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductGridClient from "./ProductGridClient";

// Next.js Server Component
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const categoryFilter = typeof categoryParam === 'string' ? categoryParam : undefined;

  // Fetch from the SQLite database
  const products = categoryFilter 
    ? await prisma.product.findMany({ where: { category: categoryFilter } })
    : await prisma.product.findMany();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-muted">Loading products...</div>}>
      <ProductGridClient key={categoryFilter || 'all'} initialProducts={products} category={categoryFilter} />
    </Suspense>
  );
}
