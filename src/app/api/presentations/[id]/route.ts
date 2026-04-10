import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  await prisma.presentation.update({
    where: { id, userId: session.user.id },
    data: { title: body.title || undefined, updatedAt: new Date() },
  });

  if (Array.isArray(body.slides) && body.slides.length > 0) {
    await prisma.slide.deleteMany({ where: { presentationId: id } });
    await prisma.slide.createMany({
      data: body.slides.map((slide: { content: string; layout?: string; order?: number; notes?: string; background?: string; transition?: string }, index: number) => ({
        presentationId: id,
        userId: session.user.id!,
        order: slide.order ?? index,
        content: typeof slide.content === "string" ? slide.content : JSON.stringify(slide.content),
        layout: slide.layout || "content",
        notes: slide.notes || null,
        background: slide.background || null,
        transition: slide.transition || "fade",
      })),
    });
  }

  const updated = await prisma.presentation.findUnique({
    where: { id },
    include: { slides: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.presentation.delete({ where: { id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
