"use client";
import { useState } from "react";
import { Wand2, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface Props { presentationId: string; onSlidesGenerated: (slides: Array<{ id: string; order: number; content: string; layout: string; transition: string }>) => void; onClose: () => void; }
export function AiPanel({ presentationId, onSlidesGenerated, onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, type: "generate" }) });
      const data = await res.json();
      let slidesData;
      try { const cleaned = data.result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim(); slidesData = JSON.parse(cleaned); } catch { toast.error("AI returned invalid format. Try again."); setLoading(false); return; }
      if (Array.isArray(slidesData)) {
        const slides = slidesData.map((s: Record<string, unknown>, i: number) => ({ id: "gen-" + Date.now() + "-" + i, order: i, content: JSON.stringify(s), layout: (s.layout as string) || "content", transition: "fade" }));
        onSlidesGenerated(slides);
        toast.success("Generated " + slides.length + " slides");
      }
    } catch { toast.error("Generation failed"); }
    setLoading(false);
  };
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Sparkles size={16} className="text-neutral-900"/><h3 className="text-[14px] font-medium text-neutral-900">AI Assistant</h3></div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button>
      </div>
      <div className="flex-1 space-y-4">
        <div><label className="text-[12px] text-neutral-500 mb-1.5 block">Describe your presentation</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Create a 10-slide pitch deck for a B2B SaaS startup..." className="w-full h-32 text-[13px] p-3 rounded-lg border border-neutral-200 bg-[#fafafa] resize-none outline-none focus:border-neutral-400 transition-colors"/>
        </div>
        <Button onClick={generate} disabled={loading || !prompt.trim()} className="w-full rounded-full text-[13px] gap-2">
          {loading ? <><Loader2 size={14} className="animate-spin"/>Generating...</> : <><Wand2 size={14}/>Generate Slides</>}
        </Button>
        <div className="space-y-2"><p className="text-[12px] text-neutral-400">Quick prompts:</p>
          {["Create a startup pitch deck","Sales proposal for enterprise client","Quarterly business review","Product roadmap presentation"].map((p) => (
            <button key={p} onClick={() => setPrompt(p)} className="block w-full text-left px-3 py-2 text-[12px] text-neutral-600 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
