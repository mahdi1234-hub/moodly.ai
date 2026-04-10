"use client";
import { motion } from "framer-motion";
const categories = [
  { name: "Sales", desc: "Proposals, pitch decks, and pipeline updates.", color: "from-blue-50 to-indigo-50" },
  { name: "Marketing", desc: "Campaign plans, positioning decks, and performance reports.", color: "from-pink-50 to-rose-50" },
  { name: "Product", desc: "Roadmaps, planning decks, and stakeholder updates.", color: "from-green-50 to-emerald-50" },
  { name: "Business", desc: "Operating reviews, planning decks, and financial narratives.", color: "from-amber-50 to-yellow-50" },
  { name: "Leadership", desc: "Board decks, investor updates, and company narratives.", color: "from-purple-50 to-violet-50" },
  { name: "Consultants", desc: "Strategy decks, client proposals, and decision-ready deliverables.", color: "from-cyan-50 to-teal-50" },
];
export function Templates() {
  return (
    <section className="py-28">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-[clamp(2rem,2vw+1.5rem,3.2rem)] tracking-[-0.03em] text-neutral-950 mb-4">Hundreds of templates by<br/>the world's top designers</h2>
          <p className="text-neutral-500 text-[15px] tracking-[-0.02em] max-w-2xl mx-auto">Choose from templates from world-class storytellers at Apple, McKinsey, BCG, IDEO, and beyond.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.08, duration: 0.6 }} className="slide-card group cursor-pointer">
              <div className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${cat.color} border border-neutral-200/40 flex items-center justify-center mb-3`}><span className="text-4xl font-light text-neutral-300">{cat.name[0]}</span></div>
              <h4 className="text-[15px] font-medium text-neutral-900 tracking-tight">{cat.name}</h4>
              <p className="text-[13px] text-neutral-500 mt-1">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
