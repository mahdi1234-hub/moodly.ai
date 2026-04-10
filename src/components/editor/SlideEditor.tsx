"use client";
import { useState, useEffect } from "react";
interface Props { content: string; layout: string; onChange: (content: string) => void; }
export function SlideEditor({ content, layout, onChange }: Props) {
  const [parsed, setParsed] = useState<Record<string, unknown>>({});
  useEffect(() => { try { setParsed(JSON.parse(content)); } catch { setParsed({ title: "", subtitle: "", bullets: [] }); } }, [content]);
  const update = (field: string, value: unknown) => { const updated = { ...parsed, [field]: value }; setParsed(updated); onChange(JSON.stringify(updated)); };
  return (
    <div className="aspect-[16/9] bg-white rounded-xl shadow-lg border border-neutral-200/80 overflow-hidden">
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <input value={(parsed.title as string) || ""} onChange={(e) => update("title", e.target.value)} placeholder="Click to add title" className="text-3xl font-normal tracking-[-0.03em] text-neutral-950 bg-transparent border-none outline-none text-center w-full mb-4"/>
        <input value={(parsed.subtitle as string) || ""} onChange={(e) => update("subtitle", e.target.value)} placeholder="Click to add subtitle" className="text-lg text-neutral-500 bg-transparent border-none outline-none text-center w-full mb-6 tracking-[-0.02em]"/>
        {Array.isArray(parsed.bullets) && (
          <div className="space-y-2 w-full max-w-md">
            {(parsed.bullets as string[]).map((bullet, i) => (
              <input key={i} value={bullet} onChange={(e) => { const bullets = [...(parsed.bullets as string[])]; bullets[i] = e.target.value; update("bullets", bullets); }} className="text-sm text-neutral-600 bg-transparent border-none outline-none w-full text-left" placeholder="Bullet point"/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
