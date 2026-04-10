"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
const footerLinks = [
  { title: "Getting Started", links: [{ label: "AI Presentation Maker", href: "/ai-presentation-maker" },{ label: "Templates", href: "/templates" }] },
  { title: "Solutions", links: [{ label: "Integrations", href: "/integrations" },{ label: "Enterprise", href: "/enterprise" }] },
  { title: "Resources", links: [{ label: "Gallery", href: "/gallery" },{ label: "Blog", href: "/blog" },{ label: "Academy", href: "/academy" }] },
  { title: "Company", links: [{ label: "Privacy Policy", href: "/privacy" },{ label: "Terms of Service", href: "/terms" },{ label: "Contact Us", href: "/contact" }] },
];
export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="py-32"><div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-[clamp(2rem,2vw+1.5rem,3.2rem)] tracking-[-0.03em] text-neutral-950 mb-6">Create a presentation you're proud of</h2>
          <Button asChild size="lg" className="rounded-full text-sm px-8"><Link href="/login">Try Together</Link></Button>
        </motion.div>
      </div></div>
      <div className="border-t border-neutral-200/60 py-16"><div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="24" height="18" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="#050505"/></svg>
              <span className="text-sm font-medium text-neutral-900">Together</span>
            </Link>
            <p className="text-[12px] text-neutral-400">Moodly AI Inc.</p>
          </div>
          <div className="flex flex-wrap gap-12 lg:gap-20">
            {footerLinks.map((s) => (
              <div key={s.title}><p className="text-[12px] font-medium text-neutral-900 mb-3">{s.title}</p>
                <ul className="space-y-2">{s.links.map((l) => (<li key={l.label}><Link href={l.href} className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors">{l.label}</Link></li>))}</ul>
              </div>
            ))}
          </div>
        </div>
      </div></div>
    </footer>
  );
}
