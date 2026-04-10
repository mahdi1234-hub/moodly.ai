import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { prompt, type } = await req.json();
  try {
    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.CEREBRAS_API_KEY },
      body: JSON.stringify({
        model: "llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: type === "generate" ? "You are a presentation expert. Generate slide content as JSON array. Each slide has: title, subtitle, bullets (array of strings), notes, layout (title|content|two-column|image|quote|blank). Return ONLY valid JSON." : "You are a writing assistant. Rewrite the content to be more professional and engaging. Return the improved text." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || "" });
  } catch { return NextResponse.json({ error: "AI generation failed" }, { status: 500 }); }
}
