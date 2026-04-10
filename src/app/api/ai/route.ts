import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SYSTEM_PROMPT_GENERATE = `You are a world-class presentation designer and storytelling expert. You create professional, high-quality presentation slide decks.

When given a topic or notes, generate a complete presentation as a JSON array. Each slide object must have:
- "title": string (compelling, concise headline)
- "subtitle": string (supporting context or tagline)  
- "bullets": string[] (3-5 key points, each 1-2 sentences max)
- "notes": string (speaker notes for the presenter)
- "layout": one of "title" | "content" | "two-column" | "image" | "quote" | "stats" | "blank"
- "background": one of "white" | "light" | "dark" | "gradient" | "accent"
- "emoji": string (one relevant emoji for visual flair)

Guidelines for high-quality output:
1. Start with a strong title slide that hooks the audience
2. Follow storytelling structure: Hook > Problem > Solution > Evidence > Call to Action
3. Keep text concise - no walls of text. Use short, punchy bullet points
4. Include data/stats slides where relevant (use "stats" layout)
5. Include a memorable quote slide if appropriate
6. End with a clear call-to-action slide
7. Vary layouts across slides for visual interest
8. Write in a professional but engaging tone
9. Each bullet should be actionable or insightful
10. Generate 8-12 slides for a comprehensive deck

Return ONLY the JSON array, no markdown fences, no explanation.`;

const SYSTEM_PROMPT_REWRITE = `You are an expert copywriter. Rewrite the given content to be more professional, concise, and impactful. Return only the improved text.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, type = "generate" } = await req.json();

  try {
    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.CEREBRAS_API_KEY,
      },
      body: JSON.stringify({
        model: "qwen-3-235b-a22b-instruct-2507",
        messages: [
          { role: "system", content: type === "generate" ? SYSTEM_PROMPT_GENERATE : SYSTEM_PROMPT_REWRITE },
          { role: "user", content: prompt },
        ],
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
