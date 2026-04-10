"use client";
import { motion } from "framer-motion";
const logos = ["OpenAI","Vercel","Stanford","Notion","Figma","Meta","HubSpot","Atlassian","Apple","TikTok","Adobe","Ramp"];
export function Logos() {
  return (
    <section className="py-16 border-y border-neutral-200/60">
      <div className="container">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-[13px] text-neutral-400 tracking-[-0.02em] mb-8">Trusted by 5000+ teams for high&#8209;stakes presentations</motion.p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((name, i) => (<motion.span key={name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1*i }} className="text-[13px] font-medium text-neutral-300 tracking-tight">{name}</motion.span>))}
        </motion.div>
      </div>
    </section>
  );
}
