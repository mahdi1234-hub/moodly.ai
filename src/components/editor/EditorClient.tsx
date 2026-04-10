"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, Download, Share2, Play, Wand2, Trash2, Save, X, Copy, Check, FileJson, FileText, Globe, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideEditor } from "./SlideEditor";
import { AiPanel } from "./AiPanel";
import { PresentMode } from "./PresentMode";
import { toast } from "sonner";

interface Slide { id: string; order: number; content: string; layout: string; background?: string | null; transition: string; notes?: string | null; }
interface Props { presentation: { id: string; title: string; isPublished?: boolean; publishedUrl?: string | null; slides: Slide[] }; user: { id?: string; name?: string | null; email?: string | null }; }

const APP_URL = "https://moodlyai.vercel.app";

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
      await fetch("/api/presentations/" + presentation.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, slides }) });
      toast.success("Saved successfully");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  }, [title, slides, presentation.id]);

  const addSlide = async () => {
    const res = await fetch("/api/presentations/" + presentation.id + "/slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: slides.length }) });
    const newSlide = await res.json();
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
    try {
      const res = await fetch("/api/presentations/" + presentation.id + "/share", { method: "POST" });
      const data = await res.json();
      setShareUrl(data.url);
      setShowShare(true);
      toast.success("Presentation published!");
    } catch { toast.error("Failed to share"); }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAs = (format: string) => {
    if (format === "pdf") {
      // Open the HTML export in a new window and trigger print-to-PDF
      const printWindow = window.open("/api/presentations/" + presentation.id + "/export?format=pdf", "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => printWindow.print(), 500);
        };
      }
      toast.success("PDF export opened - use Print > Save as PDF");
    } else {
      window.open("/api/presentations/" + presentation.id + "/export?format=" + format, "_blank");
      toast.success("Downloading " + format.toUpperCase() + "...");
    }
  };

  if (presenting) {
    return <PresentMode slides={slides} onExit={() => setPresenting(false)} />;
  }

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

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowExport(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-neutral-900">Export Presentation</h3>
                <button onClick={() => setShowExport(false)} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button>
              </div>
              <div className="space-y-2">
                <button onClick={() => { exportAs("pdf"); setShowExport(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-left">
                  <FileType size={18} className="text-red-500"/><div><p className="text-[13px] font-medium text-neutral-900">PDF Document</p><p className="text-[11px] text-neutral-400">Print-ready PDF with all slides</p></div>
                </button>
                <button onClick={() => { exportAs("html"); setShowExport(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-left">
                  <Globe size={18} className="text-blue-500"/><div><p className="text-[13px] font-medium text-neutral-900">HTML Presentation</p><p className="text-[11px] text-neutral-400">Standalone HTML file, works offline</p></div>
                </button>
                <button onClick={() => { exportAs("markdown"); setShowExport(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-left">
                  <FileText size={18} className="text-green-500"/><div><p className="text-[13px] font-medium text-neutral-900">Markdown</p><p className="text-[11px] text-neutral-400">Portable text with speaker notes</p></div>
                </button>
                <button onClick={() => { exportAs("json"); setShowExport(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-left">
                  <FileJson size={18} className="text-amber-500"/><div><p className="text-[13px] font-medium text-neutral-900">JSON Data</p><p className="text-[11px] text-neutral-400">Raw data for integration</p></div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && shareUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowShare(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-neutral-900">Share Presentation</h3>
                <button onClick={() => setShowShare(false)} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button>
              </div>
              <p className="text-[13px] text-neutral-500 mb-3">Anyone with this link can view your presentation:</p>
              <div className="flex items-center gap-2">
                <input value={shareUrl} readOnly className="flex-1 text-[13px] p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 outline-none"/>
                <Button onClick={copyShareUrl} size="sm" className="gap-1.5 rounded-lg shrink-0">
                  {copied ? <><Check size={14}/> Copied</> : <><Copy size={14}/> Copy</>}
                </Button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-3">Link: {shareUrl}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
