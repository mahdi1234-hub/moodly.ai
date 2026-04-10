"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, Download, Share2, Play, Wand2, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideEditor } from "./SlideEditor";
import { AiPanel } from "./AiPanel";
import { toast } from "sonner";
interface Slide { id: string; order: number; content: string; layout: string; background?: string | null; transition: string; notes?: string | null; }
interface Props { presentation: { id: string; title: string; slides: Slide[] }; user: { id?: string; name?: string | null; email?: string | null }; }
export function EditorClient({ presentation, user }: Props) {
  const [title, setTitle] = useState(presentation.title);
  const [slides, setSlides] = useState<Slide[]>(presentation.slides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAi, setShowAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentSlide = slides[currentIndex];
  const savePresentation = useCallback(async () => {
    setSaving(true);
    try { await fetch("/api/presentations/" + presentation.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, slides }) }); toast.success("Saved"); } catch { toast.error("Failed to save"); }
    setSaving(false);
  }, [title, slides, presentation.id]);
  const addSlide = async () => {
    const res = await fetch("/api/presentations/" + presentation.id + "/slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: slides.length }) });
    const newSlide = await res.json();
    setSlides([...slides, newSlide]);
    setCurrentIndex(slides.length);
  };
  const deleteSlide = (index: number) => { if (slides.length <= 1) return; const updated = slides.filter((_, i) => i !== index); setSlides(updated); if (currentIndex >= updated.length) setCurrentIndex(updated.length - 1); };
  const updateSlideContent = (content: string) => { const updated = [...slides]; updated[currentIndex] = { ...updated[currentIndex], content }; setSlides(updated); };
  return (
    <div className="h-screen flex flex-col bg-[#f3f3f3]">
      <header className="h-[54px] border-b border-neutral-200/60 bg-white flex items-center px-4 gap-3 shrink-0">
        <Link href="/dashboard" className="text-neutral-400 hover:text-neutral-700 transition-colors"><ChevronLeft size={18}/></Link>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-[14px] font-medium text-neutral-900 bg-transparent border-none outline-none tracking-tight flex-1" placeholder="Untitled Presentation"/>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAi(!showAi)} className="gap-1.5 text-[12px]"><Wand2 size={14}/> AI</Button>
          <Button variant="ghost" size="sm" onClick={savePresentation} disabled={saving} className="gap-1.5 text-[12px]"><Save size={14}/> {saving ? "Saving..." : "Save"}</Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-[12px]"><Download size={14}/> Export</Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-[12px]"><Share2 size={14}/> Share</Button>
          <Button size="sm" className="gap-1.5 text-[12px] rounded-full"><Play size={14}/> Present</Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[200px] border-r border-neutral-200/60 bg-white overflow-y-auto p-3 space-y-2 shrink-0">
          {slides.map((slide, i) => (
            <motion.div key={slide.id || i} layout onClick={() => setCurrentIndex(i)} className={"group relative aspect-[16/10] rounded-lg border cursor-pointer overflow-hidden transition-all " + (i === currentIndex ? "border-neutral-900 shadow-sm" : "border-neutral-200 hover:border-neutral-300")}>
              <div className="absolute inset-0 bg-white flex items-center justify-center p-2"><p className="text-[9px] text-neutral-500 text-center truncate">Slide {i + 1}</p></div>
              <button onClick={(e) => { e.stopPropagation(); deleteSlide(i); }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-red-500 text-white transition-opacity"><Trash2 size={10}/></button>
            </motion.div>
          ))}
          <button onClick={addSlide} className="w-full aspect-[16/10] rounded-lg border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors"><Plus size={16}/></button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <div className="w-full max-w-4xl">{currentSlide && <SlideEditor content={currentSlide.content} layout={currentSlide.layout} onChange={updateSlideContent}/>}</div>
        </div>
        <AnimatePresence>
          {showAi && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-l border-neutral-200/60 bg-white overflow-hidden shrink-0">
              <AiPanel presentationId={presentation.id} onSlidesGenerated={(ns) => { setSlides(ns); setCurrentIndex(0); setShowAi(false); }} onClose={() => setShowAi(false)}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
