"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SlideRenderer } from "../viewer/SlideRenderer";

interface Slide { id: string; content: string; layout: string; order: number; }
interface Props { slides: Slide[]; onExit: () => void; }

export function PresentMode({ slides, onExit }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { document.exitFullscreen?.().catch(() => {}); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "Backspace") { e.preventDefault(); prev(); }
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, onExit]);

  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col">
      {/* Slide */}
      <div className="flex-1 flex items-center justify-center p-6 cursor-pointer" onClick={next}>
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <SlideRenderer content={slides[current]?.content || "{}"} layout={slides[current]?.layout || "content"} />
            </motion.div>
          </AnimatePresence>
        </div>

        {current > 0 && (
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm">
            <ChevronLeft size={28} />
          </button>
        )}
        {current < slides.length - 1 && (
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm">
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div className="h-12 flex items-center justify-center gap-2 shrink-0">
        {slides.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className={"h-1.5 rounded-full transition-all duration-300 " + (i === current ? "bg-white w-8" : "bg-neutral-700 w-1.5 hover:bg-neutral-500")} />
        ))}
      </div>

      {/* Exit button */}
      <button onClick={onExit} className="fixed top-5 right-5 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm">
        <X size={20} />
      </button>

      {/* Slide counter */}
      <div className="fixed bottom-5 right-5 text-[12px] text-neutral-500 font-mono">{current + 1} / {slides.length}</div>
    </div>
  );
}
