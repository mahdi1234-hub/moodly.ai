import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const query = req.nextUrl.searchParams.get("q") || "presentation";
  const page = req.nextUrl.searchParams.get("page") || "1";
  try {
    const response = await fetch("https://api.sourcesplash.com/v1/search?query=" + encodeURIComponent(query) + "&page=" + page + "&per_page=20", { headers: { "Authorization": "Bearer " + process.env.SOURCESPLASH_API_KEY } });
    const data = await response.json();
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Image search failed", results: [] }, { status: 500 }); }
}
