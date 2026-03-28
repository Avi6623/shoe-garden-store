import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";
import AddToCartButton from "@/components/products/AddToCartButton";
import { SizeGuide } from "@/components/products/SizeGuide";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Product Not Found</h1>
        <Link href="/products" className="text-brand-accent hover:underline font-bold">Return to Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-32 min-h-screen">
      <Link href="/products" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-brand-accent transition-colors mb-12">
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <ProductGallery 
          mainImage={product.imageUrl || "/images/hero-shoe.png"} 
          imagesJson={product.images} 
        />

        <div className="flex flex-col space-y-10 sticky top-32">
          <div>
            <div className="inline-flex gap-3 items-center mb-6">
              <span className="glass px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                {product.category}
              </span>
              {product.discount && (
                <span className="bg-brand-accent text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-accent/20">
                  {product.discount}
                </span>
              )}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-6">
              <span className="text-4xl md:text-5xl font-black text-brand-accent tabular-nums">₹{product.price.toLocaleString()}</span>
              {product.original && (
                <span className="text-2xl font-bold text-brand-muted/40 line-through tabular-nums">₹{product.original.toLocaleString()}</span>
              )}
            </div>
          </div>

          <p className="text-xl text-brand-muted leading-relaxed max-w-xl font-medium">
            {product.description || "Experience unparalleled comfort and dynamic style. Engineered for peak performance and everyday wear."}
          </p>

          <div className="flex flex-col gap-8 py-10 my-6 border-y border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">
                  <Info size={18} /> 
                </div>
                <span className="text-brand-muted">Material:</span> 
                <span className="text-brand-primary dark:text-white">{product.material || "Premium Suede & Original Leather"}</span>
              </div>
              <SizeGuide />
            </div>

            <div className={`flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? (
                `In Stock: ${product.stock} Units Available`
              ) : (
                "Temporarily Reserved / Out of Stock"
              )}
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
