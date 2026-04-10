"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from "lucide-react";
import { SlideRenderer } from "./SlideRenderer";

interface Slide {
  id: string;
  content: string;
  layout: string;
  order: number;
}

interface Props {
  presentation: {
    title: string;
    slides: Slide[];
    user: { name: string | null; image: string | null };
  };
}

export function PublicViewer({ presentation }: Props) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const slides = presentation.slides;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "f" || e.key === "F") setFullscreen((f) => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-950 flex flex-col ${fullscreen ? "fixed inset-0 z-[9999]" : ""}`}>
      {/* Top bar */}
      {!fullscreen && (
        <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <svg width="20" height="16" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="white"/></svg>
            <span className="text-sm text-white font-medium">{presentation.title}</span>
            {presentation.user.name && <span className="text-xs text-neutral-500">by {presentation.user.name}</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">{current + 1} / {slides.length}</span>
            <button onClick={toggleFullscreen} className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center p-4 relative" onClick={next}>
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <SlideRenderer content={slides[current]?.content || "{}"} layout={slides[current]?.layout || "content"} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        {current > 0 && (
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors backdrop-blur-sm">
            <ChevronLeft size={24} />
          </button>
        )}
        {current < slides.length - 1 && (
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors backdrop-blur-sm">
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom dots */}
      <div className="h-10 flex items-center justify-center gap-1.5 shrink-0">
        {slides.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className={"w-2 h-2 rounded-full transition-all " + (i === current ? "bg-white w-6" : "bg-neutral-600 hover:bg-neutral-400")} />
        ))}
      </div>

      {/* Fullscreen exit */}
      {fullscreen && (
        <button onClick={() => { document.exitFullscreen(); setFullscreen(false); }} className="fixed top-4 right-4 z-[99999] p-2 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm">
          <X size={20} />
        </button>
      )}
    </div>
  );
}
