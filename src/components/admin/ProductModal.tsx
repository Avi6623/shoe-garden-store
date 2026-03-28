"use client";

import { useState, useRef } from "react";
import { createProduct } from "@/app/actions/product";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

export default function ProductModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("Image must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      if (imageBase64) {
        formData.append("imageUrl", imageBase64);
      } else {
        setError("Please upload a product image");
        setLoading(false);
        return;
      }

      const result = await createProduct(formData);
      
      if (result.success) {
        onClose();
        // Reset state
        setImageBase64("");
      } else {
        setError(result.error || "Something went wrong adding the product.");
      }
    } catch {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-2xl border border-gray-200 dark:border-white/10 shadow-2xl my-auto">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight uppercase">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 dark:bg-red-500/10 dark:border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="flex gap-6 flex-col md:flex-row">
            {/* Image Preview & Upload */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted">Product Image</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${imageBase64 ? 'border-brand-accent/50 bg-[#111]' : 'border-gray-300 dark:border-white/20 hover:border-brand-accent/50 hover:bg-brand-accent/5'}`}
              >
                {imageBase64 ? (
                  <Image src={imageBase64} alt="Preview" fill unoptimized className="object-contain p-4 drop-shadow-xl" />
                ) : (
                  <>
                    <ImagePlus size={32} className="text-brand-muted mb-2" />
                    <span className="text-xs font-medium text-brand-muted text-center px-4">Click to upload high-res image (Max 2MB)</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full md:w-2/3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Product Name</label>
                  <input name="name" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" placeholder="e.g. Aura React Pro" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Description</label>
                  <textarea name="description" required rows={2} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" placeholder="A brief description of the shoe..." />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Current Price (₹)</label>
                  <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" placeholder="e.g. 2999" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Original Price (₹)</label>
                  <input name="original" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Optional" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Category</label>
                  <select name="category" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="sneakers">Sneakers</option>
                    <option value="crocs">Crocs</option>
                    <option value="slippers">Slippers</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Stock count</label>
                  <input name="stock" type="number" required defaultValue="10" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Discount Badge</label>
                  <input name="discount" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" placeholder="e.g. -50% (Optional)" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Highlight Tag</label>
                  <input name="tag" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" placeholder="e.g. NEW (Optional)" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-brand-accent hover:bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center transition-all disabled:opacity-70 shadow-lg shadow-brand-accent/20">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
