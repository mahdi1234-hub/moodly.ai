"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, Download, Share2, Play, Wand2, Trash2, Save, X, Copy, Check, FileJson, FileText, Globe, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideEditor } from "./SlideEditor";
import { AiPanel } from "./AiPanel";
import { PresentMode } from "./PresentMode";
import { SlideThumbnail } from "./SlideThumbnail";
import { toast } from "sonner";

interface Slide { id: string; order: number; content: string; layout: string; background?: string | null; transition: string; notes?: string | null; }
interface Props { presentation: { id: string; title: string; isPublished?: boolean; publishedUrl?: string | null; slides: Slide[] }; user: { id?: string; name?: string | null; email?: string | null }; }

const APP_URL = "https://moodlyai.vercel.app";

async function saveToDb(presId: string, title: string, slides: Slide[]) {
  const res = await fetch("/api/presentations/" + presId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      slides: slides.map((s, i) => ({
        content: s.content, layout: s.layout, order: i,
        notes: s.notes || null, background: s.background || null, transition: s.transition || "fade",
      })),
    }),
  });
  return res.json();
}

export function EditorClient({ presentation, user }: Props) {
  const [title, setTitle] = useState(presentation.title);
  const [slides, setSlides] = useState<Slide[]>(presentation.slides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAi, setShowAi] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState(presentation.publishedUrl ? APP_URL + "/view/" + presentation.publishedUrl : "");
  const [copied, setCopied] = useState(false);

  const currentSlide = slides[currentIndex];

  const savePresentation = useCallback(async () => {
    setSaving(true);
    try {
      const data = await saveToDb(presentation.id, title, slides);
      if (data.slides) setSlides(data.slides);
      toast.success("Saved successfully");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  }, [title, slides, presentation.id]);

  const addSlide = () => {
    const newSlide: Slide = { id: "new-" + Date.now(), order: slides.length, content: JSON.stringify({ title: "", subtitle: "", bullets: [], background: "white" }), layout: "blank", transition: "fade" };
    setSlides([...slides, newSlide]);
    setCurrentIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    if (currentIndex >= updated.length) setCurrentIndex(updated.length - 1);
  };

  const updateSlideContent = (content: string) => {
    const updated = [...slides];
    updated[currentIndex] = { ...updated[currentIndex], content };
    setSlides(updated);
  };

  const handleShare = async () => {
    setSaving(true);
    try { await saveToDb(presentation.id, title, slides); } catch {}
    setSaving(false);
    try {
      const res = await fetch("/api/presentations/" + presentation.id + "/share", { method: "POST" });
      const data = await res.json();
      setShareUrl(data.url);
      setShowShare(true);
      toast.success("Saved & published!");
    } catch { toast.error("Failed to share"); }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAs = async (format: string) => {
    await saveToDb(presentation.id, title, slides);
    if (format === "pdf") {
      window.open("/api/presentations/" + presentation.id + "/export?format=pdf", "_blank");
      toast.success("PDF opened - use Print > Save as PDF");
    } else {
      window.open("/api/presentations/" + presentation.id + "/export?format=" + format, "_blank");
      toast.success("Downloading...");
    }
  };

  const handleAiGenerated = async (newSlides: Slide[]) => {
    setSlides(newSlides);
    setCurrentIndex(0);
    setShowAi(false);
    try {
      const data = await saveToDb(presentation.id, title, newSlides);
      if (data.slides) setSlides(data.slides);
      toast.success("AI slides saved!");
    } catch { toast.error("Generated but save failed. Click Save."); }
  };

  if (presenting) return <PresentMode slides={slides} onExit={() => setPresenting(false)} />;

  return (
    <div className="h-screen flex flex-col bg-[#f3f3f3]">
      <header className="h-[54px] border-b border-neutral-200/60 bg-white flex items-center px-4 gap-3 shrink-0">
        <Link href="/dashboard" className="text-neutral-400 hover:text-neutral-700 transition-colors"><ChevronLeft size={18}/></Link>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-[14px] font-medium text-neutral-900 bg-transparent border-none outline-none tracking-tight flex-1" placeholder="Untitled Presentation"/>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setShowAi(!showAi)} className="gap-1.5 text-[12px]"><Wand2 size={14}/> AI</Button>
          <Button variant="ghost" size="sm" onClick={savePresentation} disabled={saving} className="gap-1.5 text-[12px]"><Save size={14}/> {saving ? "Saving..." : "Save"}</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowExport(true)} className="gap-1.5 text-[12px]"><Download size={14}/> Export</Button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 text-[12px]"><Share2 size={14}/> Share</Button>
          <Button size="sm" onClick={() => setPresenting(true)} className="gap-1.5 text-[12px] rounded-full"><Play size={14}/> Present</Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[220px] border-r border-neutral-200/60 bg-white overflow-y-auto p-3 space-y-2 shrink-0">
          {slides.map((slide, i) => (
            <motion.div key={slide.id || i} layout className="relative group">
              <div onClick={() => setCurrentIndex(i)} className={"rounded-lg border cursor-pointer overflow-hidden transition-all " + (i === currentIndex ? "border-neutral-900 shadow-md ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-300")}>
                <SlideThumbnail content={slide.content} index={i} />
              </div>
              <button onClick={() => deleteSlide(i)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-red-500 text-white transition-opacity shadow-sm"><Trash2 size={10}/></button>
            </motion.div>
          ))}
          <button onClick={addSlide} className="w-full aspect-[16/10] rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors"><Plus size={16}/></button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <div className="w-full max-w-4xl">{currentSlide && <SlideEditor content={currentSlide.content} layout={currentSlide.layout} onChange={updateSlideContent}/>}</div>
        </div>
        <AnimatePresence>
          {showAi && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-l border-neutral-200/60 bg-white overflow-hidden shrink-0">
              <AiPanel presentationId={presentation.id} onSlidesGenerated={handleAiGenerated} onClose={() => setShowAi(false)}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showExport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowExport(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4"><h3 className="text-[15px] font-medium text-neutral-900">Export</h3><button onClick={() => setShowExport(false)} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button></div>
              <div className="space-y-2">
                {[
                  { fmt: "pdf", icon: FileType, color: "text-red-500", label: "PDF Document", desc: "Print-ready PDF" },
                  { fmt: "html", icon: Globe, color: "text-blue-500", label: "HTML Presentation", desc: "Standalone HTML file" },
                  { fmt: "markdown", icon: FileText, color: "text-green-500", label: "Markdown", desc: "Portable text format" },
                  { fmt: "json", icon: FileJson, color: "text-amber-500", label: "JSON Data", desc: "Raw data" },
                ].map((e) => (
                  <button key={e.fmt} onClick={() => { exportAs(e.fmt); setShowExport(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-left">
                    <e.icon size={18} className={e.color}/><div><p className="text-[13px] font-medium text-neutral-900">{e.label}</p><p className="text-[11px] text-neutral-400">{e.desc}</p></div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showShare && shareUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowShare(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4"><h3 className="text-[15px] font-medium text-neutral-900">Share Presentation</h3><button onClick={() => setShowShare(false)} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button></div>
              <p className="text-[13px] text-neutral-500 mb-3">Anyone with this link can view your presentation:</p>
              <div className="flex items-center gap-2">
                <input value={shareUrl} readOnly className="flex-1 text-[13px] p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 outline-none"/>
                <Button onClick={copyShareUrl} size="sm" className="gap-1.5 rounded-lg shrink-0">{copied ? <><Check size={14}/> Copied</> : <><Copy size={14}/> Copy</>}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
