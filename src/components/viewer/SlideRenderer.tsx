"use client";
import { useMemo } from "react";

interface Props {
  content: string;
  layout: string;
}

const bgStyles: Record<string, string> = {
  white: "bg-white text-neutral-900",
  light: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-white",
  gradient: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white",
  accent: "bg-gradient-to-br from-blue-600 to-purple-700 text-white",
};

export function SlideRenderer({ content, layout }: Props) {
  const data = useMemo(() => {
    try { return JSON.parse(content); } catch { return { title: "", subtitle: "" }; }
  }, [content]);

  const bg = bgStyles[data.background as string] || bgStyles.white;

  return (
    <div className={"aspect-[16/9] rounded-xl shadow-2xl overflow-hidden " + bg}>
      <div className="h-full flex flex-col p-12 justify-center">
        {/* Emoji */}
        {data.emoji && <div className="text-4xl mb-4">{data.emoji}</div>}

        {/* Title */}
        {data.title && (
          <h2 className={"font-normal tracking-[-0.03em] mb-3 " + (layout === "title" ? "text-5xl" : "text-3xl")}>
            {data.title}
          </h2>
        )}

        {/* Subtitle */}
        {data.subtitle && (
          <p className={"tracking-[-0.02em] mb-6 opacity-70 " + (layout === "title" ? "text-xl" : "text-lg")}>
            {data.subtitle}
          </p>
        )}

        {/* Bullets */}
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

        {/* Quote layout */}
        {layout === "quote" && data.quote && (
          <blockquote className="text-2xl italic font-light leading-relaxed mt-4 border-l-2 border-current/20 pl-6">
            &ldquo;{data.quote}&rdquo;
            {data.author && <cite className="block text-base mt-3 not-italic opacity-60">&mdash; {data.author}</cite>}
          </blockquote>
        )}

        {/* Stats layout */}
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
    </div>
  );
}
