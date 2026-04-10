import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const slide = await prisma.slide.create({ data: { presentationId: id, userId: session.user.id, order: body.order || 0, layout: "blank", content: JSON.stringify({ title: "", subtitle: "", bullets: [] }) } });
  return NextResponse.json(slide);
}
