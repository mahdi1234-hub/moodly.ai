"use client";
import { motion } from "framer-motion";
import { BarChart3, Palette, FileDown, Layers, Users, Shield } from "lucide-react";
const features = [
  { icon: BarChart3, title: "Visualize with charts", desc: "Visualize data, charts, graphs, metrics and tables easily. Embed 100s of tools you use." },
  { icon: Palette, title: "Bring your brand guidelines in a click", desc: "Set up your brand fonts, colors and visual rules so every slide is consistent across teams." },
  { icon: FileDown, title: "Export to PPT", desc: "Export your presentation straight to PPT and continue editing there." },
  { icon: Layers, title: "Customizability", desc: "Full control over layouts and visuals without breaking brand rules." },
  { icon: Users, title: "Real-time collaboration", desc: "Collaborate with your team. Share templates, and manage permissions." },
  { icon: Shield, title: "Enterprise security", desc: "Your content stays private, protected by enterprise-grade security." },
];
export function Features() {
  return (
    <section className="py-28 bg-white">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-[clamp(2rem,2vw+1.5rem,3.2rem)] tracking-[-0.03em] text-neutral-950 mb-4">Built for serious business.</h2>
          <p className="text-neutral-500 text-[15px] tracking-[-0.02em] max-w-xl mx-auto">Together is designed for professional teams. Our team brings decades of experience from McKinsey, BCG, and Apple.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.08, duration: 0.6 }} className="p-6 rounded-xl border border-neutral-200/60 hover:border-neutral-300 hover:shadow-sm transition-all duration-300 bg-[#fafafa]">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4"><f.icon size={18} className="text-neutral-700"/></div>
              <h4 className="text-[15px] font-medium text-neutral-900 tracking-tight mb-2">{f.title}</h4>
              <p className="text-[13px] text-neutral-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
