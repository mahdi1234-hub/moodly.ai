"use client";
import { motion } from "framer-motion";
const testimonials = [
  { quote: "It's almost the lack of cluttered UI that makes me use it over something like Google Slides.", name: "Weber Wong", role: "CEO and Founder" },
  { quote: "Right after I stepped off stage, people kept asking what tool I'd used. Together was the first thing they noticed.", name: "Paul Klein", role: "CEO" },
  { quote: "Together turned our fragmented sales workflow into a single, reliable system that creates tailored proposals in minutes.", name: "Eric", role: "Origami Team" },
  { quote: "I wanted the audience to actually see how my workflow moves. Together felt like the only tool that could handle that.", name: "Sean Wildenfree", role: "Lyricist & Music Artist" },
  { quote: "Gave my first presentation with Together yesterday and the team were absolutely floored. Multiple pods are already using it!", name: "Karim Saleh", role: "via X" },
  { quote: "I've tried many AI presentation tools, but Together really stands out. It's fast and easy to create beautifully designed slides.", name: "Ravi Mehta", role: "Ex-CPO at Tinder" },
];
export function Testimonials() {
  return (
    <section className="py-28 bg-white">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-[clamp(2rem,2vw+1.5rem,3.2rem)] tracking-[-0.03em] text-neutral-950 mb-4">Hear it from our users</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.08, duration: 0.6 }} className="p-6 rounded-xl border border-neutral-200/60 bg-[#fafafa] hover:shadow-sm transition-all">
              <p className="text-[14px] text-neutral-700 leading-relaxed tracking-[-0.01em] mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div><p className="text-[13px] font-medium text-neutral-900">{t.name}</p><p className="text-[12px] text-neutral-400">{t.role}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
