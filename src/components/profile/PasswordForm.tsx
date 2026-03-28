"use client";
import { useState } from "react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-lg shadow-black/5 dark:shadow-white/5 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="text-brand-accent" size={24} />
        <h3 className="font-bold tracking-tight text-xl">Security Details</h3>
      </div>
      
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100 mb-6 font-medium">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100 mb-6 font-medium flex gap-2 items-center"><CheckCircle2 size={16} /> Password updated successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-2">Current Password</label>
          <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-2">New Password</label>
          <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-accent outline-none" />
        </div>
        <button disabled={loading} type="submit" className="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-xl hover:bg-brand-accent dark:hover:bg-brand-accent hover:text-white transition-all w-full flex justify-center items-center">
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
