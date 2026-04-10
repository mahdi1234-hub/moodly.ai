"use client";
import { useState } from "react";
import { Wand2, X, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props { presentationId: string; onSlidesGenerated: (slides: Array<{ id: string; order: number; content: string; layout: string; transition: string }>) => void; onClose: () => void; }

export function AiPanel({ presentationId, onSlidesGenerated, onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [slideCount, setSlideCount] = useState("10");

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const fullPrompt = prompt + "\n\nGenerate exactly " + slideCount + " slides. Make it professional, visually varied, and compelling.";
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: fullPrompt, type: "generate" }) });
      const data = await res.json();

      if (data.error) { toast.error(data.error); setLoading(false); return; }

      let slidesData;
      try {
        let cleaned = data.result || "";
        cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const jsonStart = cleaned.indexOf("[");
        const jsonEnd = cleaned.lastIndexOf("]");
        if (jsonStart >= 0 && jsonEnd > jsonStart) cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        slidesData = JSON.parse(cleaned);
      } catch {
        toast.error("AI returned invalid format. Please try again with a simpler prompt.");
        setLoading(false);
        return;
      }

      if (Array.isArray(slidesData) && slidesData.length > 0) {
        const slides = slidesData.map((s: Record<string, unknown>, i: number) => ({
          id: "gen-" + Date.now() + "-" + i,
          order: i,
          content: JSON.stringify(s),
          layout: (s.layout as string) || "content",
          transition: "fade",
        }));
        onSlidesGenerated(slides);
        toast.success("Generated " + slides.length + " high-quality slides!");
      } else {
        toast.error("No slides generated. Try a more specific prompt.");
      }
    } catch { toast.error("Generation failed. Check your connection."); }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Sparkles size={16} className="text-neutral-900"/><h3 className="text-[14px] font-medium text-neutral-900">AI Presentation Generator</h3></div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700"><X size={16}/></button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <div>
          <label className="text-[12px] text-neutral-500 mb-1.5 block">What is your presentation about?</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A pitch deck for an AI-powered fitness app targeting millennials. Include market size, business model, team, and funding ask of $2M..." className="w-full h-36 text-[13px] p-3 rounded-lg border border-neutral-200 bg-[#fafafa] resize-none outline-none focus:border-neutral-400 transition-colors"/>
        </div>

        <div>
          <label className="text-[12px] text-neutral-500 mb-1.5 block">Number of slides</label>
          <select value={slideCount} onChange={(e) => setSlideCount(e.target.value)} className="w-full text-[13px] p-2.5 rounded-lg border border-neutral-200 bg-[#fafafa] outline-none">
            <option value="5">5 slides (Brief)</option>
            <option value="8">8 slides (Standard)</option>
            <option value="10">10 slides (Detailed)</option>
            <option value="12">12 slides (Comprehensive)</option>
            <option value="15">15 slides (Extended)</option>
          </select>
        </div>

        <Button onClick={generate} disabled={loading || !prompt.trim()} className="w-full rounded-full text-[13px] gap-2 h-11">
          {loading ? <><Loader2 size={14} className="animate-spin"/>Generating your deck...</> : <><Wand2 size={14}/>Generate Presentation</>}
        </Button>

        <div className="border-t border-neutral-100 pt-4 space-y-2">
          <p className="text-[12px] text-neutral-400 font-medium">Quick templates:</p>
          {[
            { label: "Startup Pitch Deck", prompt: "Create a startup pitch deck for a Series A fundraising. Include: problem, solution, market size ($10B+), business model, traction metrics, team background, competitive landscape, and $5M funding ask." },
            { label: "Sales Proposal", prompt: "Create a sales proposal for an enterprise SaaS product. Include: executive summary, client pain points, our solution, case studies with metrics, implementation timeline, pricing options, and next steps." },
            { label: "Quarterly Business Review", prompt: "Create a Q4 quarterly business review. Include: revenue highlights, key metrics dashboard, wins and challenges, department updates, customer success stories, and Q1 goals." },
            { label: "Product Launch", prompt: "Create a product launch presentation. Include: product vision, key features with benefits, target audience, competitive advantages, go-to-market strategy, timeline, and call to action." },
          ].map((p) => (
            <button key={p.label} onClick={() => setPrompt(p.prompt)} className="block w-full text-left px-3 py-2.5 text-[12px] text-neutral-600 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
              <span className="font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
