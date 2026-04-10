import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const presentation = await prisma.presentation.create({
    data: { userId: session.user.id, title: "Untitled Presentation", slides: { create: [{ userId: session.user.id, order: 0, layout: "title", content: JSON.stringify({ title: "Welcome to Together", subtitle: "Start creating your presentation" }) }] } },
  });
  return NextResponse.json(presentation);
}
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const presentations = await prisma.presentation.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" }, include: { slides: { select: { id: true } } } });
  return NextResponse.json(presentations);
}
