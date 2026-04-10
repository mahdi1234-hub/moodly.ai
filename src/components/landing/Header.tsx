"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Product", children: [
    { label: "AI Presentation Maker", href: "/ai-presentation-maker" },
    { label: "Integrations", href: "/integrations" },
    { label: "Together Studio", href: "/studio" },
  ]},
  { label: "Solutions", children: [
    { label: "Sales", href: "/solutions/sales" },
    { label: "Product", href: "/solutions/product" },
    { label: "Marketing", href: "/solutions/marketing" },
    { label: "Agencies", href: "/solutions/agencies" },
    { label: "Startups", href: "/solutions/startups" },
  ]},
  { label: "Templates", href: "/templates" },
  { label: "Enterprise", href: "/enterprise" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f3f3f3]/80 backdrop-blur-xl border-b border-neutral-200/50">
      <div className="container">
        <div className="flex items-center justify-between h-[54px]">
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="22" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="#050505"/></svg>
            <span className="text-[15px] font-medium tracking-tight text-neutral-900">Together</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setHovered(item.label)} onMouseLeave={() => setHovered(null)}>
                {item.href ? (
                  <Link href={item.href} className="px-3 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors">{item.label}</Link>
                ) : (
                  <button className="px-3 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors">{item.label}</button>
                )}
                <AnimatePresence>
                  {item.children && hovered === item.label && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 min-w-[200px]">
                      {item.children.map((c) => (
                        <Link key={c.label} href={c.href} className="block px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">{c.label}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors">Login</Link>
            <Button asChild size="sm" className="rounded-full text-[13px] px-4"><Link href="/login">Try for free</Link></Button>
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-neutral-200 bg-[#f3f3f3]">
            <div className="container py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.href ? <Link href={item.href} className="block py-2 text-sm text-neutral-700" onClick={() => setMobileOpen(false)}>{item.label}</Link> : (
                    <><p className="py-2 text-sm font-medium text-neutral-900">{item.label}</p>
                    {item.children?.map((c) => <Link key={c.label} href={c.href} className="block py-1.5 pl-4 text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>{c.label}</Link>)}</>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
