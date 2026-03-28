import PasswordForm from "@/components/profile/PasswordForm";
import { Store } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Store Settings</h1>
        <p className="text-brand-muted">Configure your marketplace credentials.</p>
      </header>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-lg shadow-black/5 dark:shadow-white/5 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Store className="text-brand-accent" size={24} />
          <h3 className="font-bold tracking-tight text-xl">General Configurations</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-2">Store Name</label>
            <input type="text" defaultValue="Shoe Garden" className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none opacity-60 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-2">Contact Number</label>
            <input type="text" defaultValue="+91 25933101" className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none opacity-60 cursor-not-allowed" disabled />
          </div>
        </div>
      </div>

      <PasswordForm />
    </div>
  );
}
