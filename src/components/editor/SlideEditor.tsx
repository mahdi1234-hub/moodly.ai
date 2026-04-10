"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props { content: string; layout: string; onChange: (content: string) => void; }

const bgStyles: Record<string, string> = {
  white: "bg-white text-neutral-900",
  light: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-white",
  gradient: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white",
  accent: "bg-gradient-to-br from-blue-600 to-purple-700 text-white",
};

const bgOptions = ["white", "light", "dark", "gradient", "accent"];
const layoutOptions = ["title", "content", "two-column", "quote", "stats", "blank"];

export function SlideEditor({ content, layout, onChange }: Props) {
  const [parsed, setParsed] = useState<Record<string, unknown>>({});

  useEffect(() => {
    try { setParsed(JSON.parse(content)); } catch { setParsed({ title: "", subtitle: "", bullets: [], background: "white" }); }
  }, [content]);

  const update = (field: string, value: unknown) => {
    const updated = { ...parsed, [field]: value };
    setParsed(updated);
    onChange(JSON.stringify(updated));
  };

  const bg = bgStyles[(parsed.background as string) || "white"] || bgStyles.white;
  const isLight = !parsed.background || parsed.background === "white" || parsed.background === "light";
  const placeholderColor = isLight ? "placeholder:text-neutral-300" : "placeholder:text-white/30";
  const bulletDotColor = isLight ? "bg-neutral-400" : "bg-white/40";

  const addBullet = () => {
    const bullets = Array.isArray(parsed.bullets) ? [...(parsed.bullets as string[])] : [];
    bullets.push("");
    update("bullets", bullets);
  };

  const removeBullet = (index: number) => {
    const bullets = [...(parsed.bullets as string[])];
    bullets.splice(index, 1);
    update("bullets", bullets);
  };

  return (
    <div className={"aspect-[16/9] rounded-xl shadow-2xl overflow-hidden relative " + bg}>
      {/* Background selector */}
      <div className="absolute top-3 right-3 flex gap-1 z-10 opacity-0 hover:opacity-100 transition-opacity">
        {bgOptions.map((b) => (
          <button
            key={b}
            onClick={() => update("background", b)}
            className={"w-5 h-5 rounded-full border-2 transition-all " + (parsed.background === b ? "border-blue-500 scale-110" : "border-white/30 hover:border-white/60")}
            style={{ background: b === "white" ? "#fff" : b === "light" ? "#f5f5f5" : b === "dark" ? "#1a1a1a" : b === "gradient" ? "linear-gradient(135deg,#1a1a1a,#333)" : "linear-gradient(135deg,#2563eb,#7c3aed)" }}
            title={b}
          />
        ))}
      </div>

      <div className="h-full flex flex-col justify-center p-12">
        {/* Emoji */}
        <input
          value={(parsed.emoji as string) || ""}
          onChange={(e) => update("emoji", e.target.value)}
          placeholder="+"
          className={"text-4xl bg-transparent border-none outline-none w-16 mb-3 " + placeholderColor}
          maxLength={2}
        />

        {/* Title */}
        <input
          value={(parsed.title as string) || ""}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Click to add title"
          className={"text-3xl font-normal tracking-[-0.03em] bg-transparent border-none outline-none w-full mb-3 leading-tight " + placeholderColor}
        />

        {/* Subtitle */}
        <input
          value={(parsed.subtitle as string) || ""}
          onChange={(e) => update("subtitle", e.target.value)}
          placeholder="Click to add subtitle"
          className={"text-lg opacity-70 bg-transparent border-none outline-none w-full mb-6 tracking-[-0.02em] " + placeholderColor}
        />

        {/* Bullets */}
        {(Array.isArray(parsed.bullets) && (parsed.bullets as string[]).length > 0) && (
          <ul className="space-y-2 mt-1">
            {(parsed.bullets as string[]).map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <span className={"mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 " + bulletDotColor} />
                <input
                  value={bullet}
                  onChange={(e) => {
                    const bullets = [...(parsed.bullets as string[])];
                    bullets[i] = e.target.value;
                    update("bullets", bullets);
                  }}
                  className={"flex-1 text-[15px] leading-relaxed bg-transparent border-none outline-none " + placeholderColor}
                  placeholder="Type bullet point..."
                />
                <button onClick={() => removeBullet(i)} className="opacity-0 group-hover:opacity-60 hover:opacity-100 mt-1 transition-opacity">
                  <Trash2 size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add bullet button */}
        <button onClick={addBullet} className={"mt-3 flex items-center gap-2 text-[13px] opacity-0 hover:opacity-60 transition-opacity " + (isLight ? "text-neutral-400" : "text-white/40")}>
          <Plus size={14} /> Add bullet point
        </button>

        {/* Notes */}
        {parsed.notes && (
          <div className={"mt-auto pt-4 border-t text-[12px] opacity-40 " + (isLight ? "border-neutral-200" : "border-white/10")}>
            Notes: {parsed.notes as string}
          </div>
        )}
      </div>
    </div>
  );
}
