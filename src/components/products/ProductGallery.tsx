"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ mainImage, imagesJson }: { mainImage: string, imagesJson: string | null }) {
  let images = [mainImage];
  if (imagesJson) {
    try {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = [mainImage, ...parsed];
      }
    } catch {
      console.error("Failed to parse multiple images JSON.");
    }
  }

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="relative aspect-square bg-gray-50 dark:bg-[#0a0a0a] rounded-[3rem] p-12 overflow-hidden group border border-gray-100 dark:border-white/5 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <Image src={activeImage} alt="Product view" fill className="object-contain p-12 transform transition-transform duration-1000 ease-out group-hover:scale-105 z-10" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveImage(img)}
              className={`relative w-24 h-24 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-2 ${activeImage === img ? 'border-brand-accent bg-brand-accent/5' : 'border-gray-200 dark:border-white/10 hover:border-brand-accent/50 bg-gray-50 dark:bg-white/5'}`}
            >
              <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
