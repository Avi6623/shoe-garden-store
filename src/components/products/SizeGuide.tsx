"use client";
import { useState } from "react";
import { Ruler, X } from "lucide-react";

export function SizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-muted hover:text-brand-accent transition-colors">
        <Ruler size={16} /> Size Guide
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-3xl p-8 md:p-12 relative shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 p-2 text-brand-muted hover:text-red-500 bg-gray-50 dark:bg-white/5 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-3xl font-black tracking-tighter mb-2 uppercase">Size Guide</h3>
            <p className="text-sm font-medium text-brand-muted mb-8 uppercase tracking-widest">Find your perfect premium fit.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-white/10">
                  <th className="py-4 font-black text-brand-primary">UK / India</th>
                  <th className="py-4 font-black text-brand-primary">US</th>
                  <th className="py-4 font-black text-brand-primary">EU</th>
                  <th className="py-4 font-black text-brand-primary">CM</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                <tr className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"><td className="py-4 px-2">6</td><td>7</td><td>40</td><td>25</td></tr>
                <tr className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"><td className="py-4 px-2">7</td><td>8</td><td>41</td><td>26</td></tr>
                <tr className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"><td className="py-4 px-2">8</td><td>9</td><td>42</td><td>27</td></tr>
                <tr className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"><td className="py-4 px-2">9</td><td>10</td><td>43</td><td>28</td></tr>
                <tr className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"><td className="py-4 px-2">10</td><td>11</td><td>44</td><td>29</td></tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-white/5"><td className="py-4 px-2">11</td><td>12</td><td>45</td><td>30</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
