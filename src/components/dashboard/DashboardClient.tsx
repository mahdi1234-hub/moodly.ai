"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreHorizontal, LogOut, Presentation, Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SlideData { id: string; content: string; layout: string; order: number; }
interface Props {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
  presentations: Array<{ id: string; title: string; thumbnail: string | null; updatedAt: Date; slides: SlideData[] }>;
}

const bgStyles: Record<string, string> = {
  white: "bg-white text-neutral-900",
  light: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-white",
  gradient: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white",
  accent: "bg-gradient-to-br from-blue-600 to-purple-700 text-white",
};

function SlidePreview({ content }: { content: string }) {
  let data: { title?: string; subtitle?: string; bullets?: string[]; emoji?: string; background?: string; [k: string]: unknown } = {};
  try { data = JSON.parse(content); } catch { data = {}; }
  const bg = bgStyles[(data.background as string) || "white"] || bgStyles.white;
  return (
    <div className={"aspect-[16/10] rounded-xl overflow-hidden p-4 flex flex-col justify-center " + bg}>
      {data.emoji && <span className="text-lg mb-1">{String(data.emoji || "")}</span>}
      {data.title ? (
        <p className="text-[11px] font-medium leading-tight tracking-tight line-clamp-2">{String(data.title || "")}</p>
      ) : (
        <p className="text-[11px] opacity-30 italic">Empty slide</p>
      )}
      {data.subtitle && <p className="text-[9px] opacity-50 mt-0.5 truncate">{String(data.subtitle || "")}</p>}
      {Array.isArray(data.bullets) && (data.bullets || []).length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {(data.bullets || []).slice(0, 2).map((b, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="w-1 h-1 rounded-full bg-current opacity-30 mt-1 shrink-0"/>
              <p className="text-[7px] opacity-50 truncate">{b}</p>
            </div>
          ))}
          {(data.bullets || []).length > 2 && <p className="text-[6px] opacity-30">+{(data.bullets || []).length - 2} more</p>}
        </div>
      )}
    </div>
  );
}

export function DashboardClient({ user, presentations: initialPresentations }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [presentations, setPresentations] = useState(initialPresentations);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const createPresentation = async () => {
    setCreating(true);
    try { const res = await fetch("/api/presentations", { method: "POST" }); const data = await res.json(); router.push("/editor/" + data.id); } catch { setCreating(false); toast.error("Failed to create"); }
  };

  const deletePresentation = async (id: string) => {
    setDeleting(true);
    try {
      await fetch("/api/presentations/" + id, { method: "DELETE" });
      setPresentations(presentations.filter(p => p.id !== id));
      toast.success("Presentation deleted");
    } catch { toast.error("Failed to delete"); }
    setDeleting(false);
    setDeleteId(null);
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
          <div><h1 className="text-2xl tracking-tight text-neutral-950">Presentations</h1><p className="text-[13px] text-neutral-500 mt-1">{presentations.length} presentation{presentations.length !== 1 ? "s" : ""}</p></div>
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
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative">
                <Link href={"/editor/" + p.id} className="block slide-card">
                  {/* First slide preview */}
                  {p.slides.length > 0 && p.slides[0].content ? (
                    <SlidePreview content={p.slides[0].content} />
                  ) : (
                    <div className="aspect-[16/10] rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center">
                      <p className="text-sm text-neutral-300">Empty</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[14px] font-medium text-neutral-900 tracking-tight truncate">{p.title}</h4>
                      <p className="text-[12px] text-neutral-400 flex items-center gap-1 mt-0.5"><Clock size={10}/>{new Date(p.updatedAt).toLocaleDateString()} &middot; {p.slides.length} slide{p.slides.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </Link>
                {/* Delete button */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(p.id); }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-all shadow-sm backdrop-blur-sm"
                >
                  <Trash2 size={14}/>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-neutral-900">Delete presentation?</h3>
                <button onClick={() => setDeleteId(null)} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button>
              </div>
              <p className="text-[13px] text-neutral-500 mb-6">This action cannot be undone. The presentation and all its slides will be permanently deleted.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setDeleteId(null)} className="text-[13px]">Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => deletePresentation(deleteId)} disabled={deleting} className="text-[13px] gap-1.5 bg-red-500 hover:bg-red-600">
                  <Trash2 size={14}/>{deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
