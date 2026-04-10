"use client";
import { useMemo } from "react";

interface Props {
  content: string;
  layout: string;
  showWatermark?: boolean;
}

const bgStyles: Record<string, string> = {
  white: "bg-white text-neutral-900",
  light: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-white",
  gradient: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white",
  accent: "bg-gradient-to-br from-blue-600 to-purple-700 text-white",
};

export function SlideRenderer({ content, layout, showWatermark = true }: Props) {
  const data = useMemo(() => {
    try { return JSON.parse(content); } catch { return { title: "", subtitle: "" }; }
  }, [content]);

  const bg = bgStyles[data.background as string] || bgStyles.white;

  return (
    <div className={"aspect-[16/9] rounded-xl shadow-2xl overflow-hidden relative " + bg}>
      <div className="h-full flex flex-col p-12 justify-center">
        {data.emoji && <div className="text-4xl mb-4">{data.emoji}</div>}
        {data.title && (
          <h2 className={"font-normal tracking-[-0.03em] mb-3 " + (layout === "title" ? "text-5xl" : "text-3xl")}>
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className={"tracking-[-0.02em] mb-6 opacity-70 " + (layout === "title" ? "text-xl" : "text-lg")}>
            {data.subtitle}
          </p>
        )}
        {Array.isArray(data.bullets) && data.bullets.length > 0 && (
          <ul className="space-y-3 mt-2">
            {data.bullets.map((b: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}
        {layout === "quote" && data.quote && (
          <blockquote className="text-2xl italic font-light leading-relaxed mt-4 border-l-2 border-current/20 pl-6">
            &ldquo;{data.quote}&rdquo;
            {data.author && <cite className="block text-base mt-3 not-italic opacity-60">&mdash; {data.author}</cite>}
          </blockquote>
        )}
        {layout === "stats" && Array.isArray(data.stats) && (
          <div className="grid grid-cols-3 gap-8 mt-6">
            {data.stats.map((s: { value: string; label: string }, i: number) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-light tracking-tight">{s.value}</div>
                <div className="text-sm opacity-60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watermark on each slide */}
      {showWatermark && (
        <a
          href="https://moodlyai.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all text-[9px] font-medium tracking-tight select-none"
          style={{ userSelect: "none" }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <svg width="10" height="8" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="currentColor"/></svg>
          Together
        </a>
      )}
    </div>
  );
}
