"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const slideTypes = ["Sales proposal", "Pitch deck", "Business update", "Research report", "Product showcase", "Project plan"];

export function Hero() {
  return (
    <section className="relative pt-[120px] pb-24 overflow-hidden gradient-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-neutral-200/40 to-transparent blur-3xl"/>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-neutral-300/30 to-transparent blur-3xl"/>
      </div>
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="text-[clamp(2.8rem,4vw+1rem,5.4rem)] leading-[1.05] tracking-[-0.03em] font-normal text-neutral-950 mb-6">Create high quality,<br/><span className="text-neutral-400">AI presentations.</span></h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(1.1rem,0.5vw+1rem,1.25rem)] text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-8 tracking-[-0.02em]">
            Together is designed for teams that need to create high&#8209;quality, on&#8209;brand presentations at scale.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full text-sm px-6"><Link href="/login">Start for free</Link></Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full text-sm gap-2"><Link href="#demo"><Play size={14} className="fill-current"/>Watch video</Link></Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }} className="flex flex-wrap justify-center gap-2 mt-12">
            {slideTypes.map((type, i) => (
              <motion.span key={type} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }} className="px-4 py-2 text-[13px] text-neutral-600 bg-white/60 backdrop-blur-sm border border-neutral-200/60 rounded-full hover:bg-white hover:border-neutral-300 transition-all cursor-pointer">{type}</motion.span>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mt-16 relative">
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-white">
            <div className="aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
              <div className="text-center space-y-4 px-8">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 mx-auto flex items-center justify-center">
                  <svg width="28" height="22" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="white"/></svg>
                </div>
                <h3 className="text-2xl font-normal tracking-tight text-neutral-900">Your next great presentation starts here</h3>
                <p className="text-neutral-500 text-sm">Paste your notes, pick a template, and let AI do the rest.</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <div className="h-10 w-64 rounded-lg bg-neutral-100 border border-neutral-200"/>
                  <div className="h-10 w-24 rounded-lg bg-neutral-900"/>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-neutral-300/20 blur-3xl rounded-full"/>
        </motion.div>
      </div>
    </section>
  );
}
