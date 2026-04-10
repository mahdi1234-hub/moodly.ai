"use client";
import { useMemo } from "react";

const bgStyles: Record<string, string> = {
  white: "bg-white text-neutral-900",
  light: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-white",
  gradient: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white",
  accent: "bg-gradient-to-br from-blue-600 to-purple-700 text-white",
};

export function SlideThumbnail({ content, index }: { content: string; index: number }) {
  const data = useMemo(() => {
    try { return JSON.parse(content); } catch { return {}; }
  }, [content]);

  const bg = bgStyles[(data.background as string) || "white"] || bgStyles.white;

  return (
    <div className={"aspect-[16/10] p-2.5 overflow-hidden " + bg}>
      <div className="flex items-start gap-1">
        <span className="text-[7px] text-current opacity-30 font-mono shrink-0">{index + 1}</span>
        <div className="min-w-0 flex-1">
          {data.emoji && <span className="text-[10px]">{data.emoji}</span>}
          {data.title ? (
            <p className="text-[9px] font-medium leading-tight truncate">{data.title}</p>
          ) : (
            <p className="text-[9px] opacity-30 italic">Untitled slide</p>
          )}
          {data.subtitle && <p className="text-[7px] opacity-50 truncate mt-0.5">{data.subtitle}</p>}
          {Array.isArray(data.bullets) && data.bullets.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {(data.bullets as string[]).slice(0, 3).map((b: string, i: number) => (
                <div key={i} className="flex items-start gap-1">
                  <span className="w-0.5 h-0.5 rounded-full bg-current opacity-30 mt-1 shrink-0" />
                  <p className="text-[6px] opacity-60 truncate leading-tight">{b}</p>
                </div>
              ))}
              {(data.bullets as string[]).length > 3 && (
                <p className="text-[6px] opacity-30">+{(data.bullets as string[]).length - 3} more</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
