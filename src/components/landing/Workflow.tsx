"use client";
import { motion } from "framer-motion";
import { FileText, Wand2, PenTool, Share2 } from "lucide-react";
const steps = [
  { icon: FileText, title: "Start from anywhere", desc: "Paste raw notes, outlines, meeting docs, or existing decks. Together pulls everything into a single presentation." },
  { icon: Wand2, title: "Generate impressive slides", desc: "Go from raw ideas to polished presentations in a click with professional diagrams and visuals." },
  { icon: PenTool, title: "Edit with AI", desc: "Simply instruct Together to refine and iterate. Built on a freeform canvas with full customisability." },
  { icon: Share2, title: "Share in any format", desc: "Present and guide audience attention. Export to PPT, PDF, or publish as a website." },
];
export function Workflow() {
  return (
    <section className="py-28">
      <div className="container"><div className="grid lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1, duration: 0.6, ease: [0.16,1,0.3,1] }} className="group">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300"><s.icon size={18}/></div>
            <h4 className="text-[15px] font-medium text-neutral-900 tracking-tight mb-2">{s.title}</h4>
            <p className="text-[13px] text-neutral-500 leading-relaxed tracking-[-0.01em]">{s.desc}</p>
          </motion.div>
        ))}
      </div></div>
    </section>
  );
}
