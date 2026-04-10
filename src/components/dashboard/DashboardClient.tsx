"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, LogOut, Presentation, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
interface Props {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
  presentations: Array<{ id: string; title: string; thumbnail: string | null; updatedAt: Date; slides: { id: string }[] }>;
}
export function DashboardClient({ user, presentations }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const createPresentation = async () => {
    setCreating(true);
    try { const res = await fetch("/api/presentations", { method: "POST" }); const data = await res.json(); router.push("/editor/" + data.id); } catch { setCreating(false); }
  };
  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <header className="h-[54px] border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl flex items-center px-6">
        <div className="flex items-center gap-3 flex-1">
          <Link href="/" className="flex items-center gap-2">
            <svg width="22" height="18" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="#050505"/></svg>
            <span className="text-sm font-medium">Together</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-neutral-500">{user.email}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-neutral-400 hover:text-neutral-700 transition-colors"><LogOut size={16}/></button>
        </div>
      </header>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl tracking-tight text-neutral-950">Presentations</h1><p className="text-[13px] text-neutral-500 mt-1">{presentations.length} presentations</p></div>
          <Button onClick={createPresentation} disabled={creating} className="rounded-full text-[13px] gap-2"><Plus size={16}/>{creating ? "Creating..." : "New presentation"}</Button>
        </div>
        {presentations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Presentation size={48} className="mx-auto text-neutral-300 mb-4"/><h3 className="text-lg text-neutral-700 mb-2">No presentations yet</h3><p className="text-[13px] text-neutral-500 mb-6">Create your first presentation to get started.</p>
            <Button onClick={createPresentation} disabled={creating} className="rounded-full text-[13px] gap-2"><Plus size={16}/>Create presentation</Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {presentations.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
                <Link href={"/editor/" + p.id} className="block slide-card">
                  <div className="aspect-[16/10] rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center mb-3 overflow-hidden"><div className="text-center px-4"><p className="text-sm text-neutral-400">{p.slides.length} slides</p></div></div>
                  <div className="flex items-start justify-between">
                    <div><h4 className="text-[14px] font-medium text-neutral-900 tracking-tight truncate max-w-[200px]">{p.title}</h4><p className="text-[12px] text-neutral-400 flex items-center gap-1 mt-0.5"><Clock size={10}/>{new Date(p.updatedAt).toLocaleDateString()}</p></div>
                    <button className="text-neutral-400 hover:text-neutral-700 p-1"><MoreHorizontal size={16}/></button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
