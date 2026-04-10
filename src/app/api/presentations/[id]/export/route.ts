import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const WATERMARK_HTML = '<a href="https://moodlyai.vercel.app" target="_blank" rel="noopener" style="position:fixed;bottom:16px;right:16px;z-index:9999;display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:rgba(0,0,0,0.7);color:#fff;text-decoration:none;font-size:11px;font-family:system-ui,sans-serif;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);user-select:none;-webkit-user-select:none"><svg width="14" height="11" viewBox="0 0 25 22" fill="none"><path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="white"/></svg>Made with Together</a>';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const format = req.nextUrl.searchParams.get("format") || "json";

  const presentation = await prisma.presentation.findUnique({
    where: { id, userId: session.user.id },
    include: { slides: { orderBy: { order: "asc" } } },
  });

  if (!presentation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (format === "json") {
    const exportData = {
      title: presentation.title,
      exportedAt: new Date().toISOString(),
      madeWith: "Together by Moodly AI - https://moodlyai.vercel.app",
      slides: presentation.slides.map((s) => ({
        order: s.order,
        layout: s.layout,
        content: JSON.parse(s.content),
        notes: s.notes,
      })),
    };
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: { "Content-Type": "application/json", "Content-Disposition": "attachment; filename=\"" + presentation.title.replace(/[^a-z0-9]/gi, "-") + ".json\"" },
    });
  }

  if (format === "markdown") {
    let md = "# " + presentation.title + "\n\n";
    md += "> Made with [Together](https://moodlyai.vercel.app)\n\n";
    presentation.slides.forEach((slide, i) => {
      const data = JSON.parse(slide.content);
      md += "---\n\n";
      md += "## Slide " + (i + 1) + ": " + (data.title || "Untitled") + "\n\n";
      if (data.subtitle) md += "*" + data.subtitle + "*\n\n";
      if (Array.isArray(data.bullets) && data.bullets.length) {
        data.bullets.forEach((b: string) => { md += "- " + b + "\n"; });
        md += "\n";
      }
      if (data.notes) md += "> Speaker notes: " + data.notes + "\n\n";
    });
    md += "---\n\n*Made with [Together](https://moodlyai.vercel.app)*\n";
    return new NextResponse(md, {
      headers: { "Content-Type": "text/markdown", "Content-Disposition": "attachment; filename=\"" + presentation.title.replace(/[^a-z0-9]/gi, "-") + ".md\"" },
    });
  }

  const buildHtml = (forPdf: boolean) => {
    const pageBreak = forPdf ? "page-break-after:always;" : "scroll-snap-align:start;";
    let html = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + presentation.title + "</title>";
    html += "<style>*{margin:0;padding:0;box-sizing:border-box}";
    html += "body{font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;background:#050505;color:#fff}";
    html += ".slide{width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;padding:8%;" + pageBreak + "}";
    html += ".slide h2{font-size:3rem;font-weight:400;letter-spacing:-0.03em;margin-bottom:1rem;line-height:1.1}";
    html += ".slide .subtitle{font-size:1.3rem;opacity:0.7;margin-bottom:2rem}";
    html += ".slide .emoji{font-size:3rem;margin-bottom:1rem}";
    html += ".slide ul{list-style:none;margin-top:1rem}.slide li{font-size:1.05rem;padding:0.6rem 0;padding-left:1.5rem;position:relative;line-height:1.5}";
    html += ".slide li::before{content:\"\";position:absolute;left:0;top:50%;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.4);transform:translateY(-50%)}";
    html += "html{scroll-snap-type:y mandatory;overflow-y:scroll}";
    html += ".bg-white{background:#fff;color:#050505}.bg-white li::before{background:rgba(0,0,0,0.3)}";
    html += ".bg-light{background:#f5f5f5;color:#050505}.bg-light li::before{background:rgba(0,0,0,0.3)}";
    html += ".bg-dark{background:#1a1a1a;color:#fff}";
    html += ".bg-gradient{background:linear-gradient(135deg,#1a1a1a,#333);color:#fff}";
    html += ".bg-accent{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff}";
    if (forPdf) html += "@media print{.slide{page-break-after:always;height:100vh}.watermark{position:fixed;bottom:16px;right:16px}}";
    html += "</style></head><body>";

    presentation.slides.forEach((slide) => {
      const data = JSON.parse(slide.content);
      const bgClass = "bg-" + (data.background || "dark");
      html += "<div class=\"slide " + bgClass + "\">";
      if (data.emoji) html += "<div class=\"emoji\">" + data.emoji + "</div>";
      if (data.title) html += "<h2>" + data.title + "</h2>";
      if (data.subtitle) html += "<p class=\"subtitle\">" + data.subtitle + "</p>";
      if (Array.isArray(data.bullets) && data.bullets.length) {
        html += "<ul>";
        data.bullets.forEach((b: string) => { html += "<li>" + b + "</li>"; });
        html += "</ul>";
      }
      html += "</div>";
    });

    // Add watermark to exported HTML
    html += WATERMARK_HTML;

    if (forPdf) {
      html += "<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script>";
    }
    html += "</body></html>";
    return html;
  };

  if (format === "html") {
    return new NextResponse(buildHtml(false), {
      headers: { "Content-Type": "text/html", "Content-Disposition": "attachment; filename=\"" + presentation.title.replace(/[^a-z0-9]/gi, "-") + ".html\"" },
    });
  }

  if (format === "pdf") {
    return new NextResponse(buildHtml(true), {
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
}
