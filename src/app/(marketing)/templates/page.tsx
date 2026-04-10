"use client";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
const templates = [
  { name: "Pitch Deck", category: "Startup", color: "from-violet-50 to-purple-50" },
  { name: "Sales Proposal", category: "Sales", color: "from-blue-50 to-indigo-50" },
  { name: "Product Roadmap", category: "Product", color: "from-green-50 to-emerald-50" },
  { name: "Market Report", category: "Research", color: "from-amber-50 to-yellow-50" },
  { name: "Brand Guidelines", category: "Branding", color: "from-pink-50 to-rose-50" },
  { name: "Quarterly Review", category: "Business", color: "from-cyan-50 to-teal-50" },
  { name: "Creative Portfolio", category: "Creative", color: "from-orange-50 to-amber-50" },
  { name: "Onboarding", category: "HR", color: "from-lime-50 to-green-50" },
  { name: "Case Study", category: "Marketing", color: "from-fuchsia-50 to-pink-50" },
  { name: "Investment Memo", category: "Finance", color: "from-sky-50 to-blue-50" },
  { name: "Agency Proposal", category: "Agency", color: "from-red-50 to-rose-50" },
  { name: "Project Plan", category: "Management", color: "from-teal-50 to-cyan-50" },
];
export default function TemplatesPage() {
  return (
    <main><Header/>
      <section className="pt-[120px] pb-28 gradient-bg"><div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-[clamp(2.4rem,3vw+1rem,4.8rem)] tracking-[-0.03em] text-neutral-950 mb-4">Presentation Templates</h1>
          <p className="text-neutral-500 text-[15px] tracking-[-0.02em] max-w-2xl mx-auto">AI-powered templates help you design faster, tell better stories, and collaborate with your team.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {templates.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
              <Link href="/login" className="block slide-card">
                <div className={"aspect-[4/3] rounded-xl bg-gradient-to-br " + t.color + " border border-neutral-200/40 flex items-center justify-center mb-3"}><span className="text-3xl font-light text-neutral-300">{t.name[0]}</span></div>
                <h4 className="text-[14px] font-medium text-neutral-900 tracking-tight">{t.name}</h4>
                <p className="text-[12px] text-neutral-400 mt-0.5">{t.category}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div></section>
    <Footer/></main>
  );
}
