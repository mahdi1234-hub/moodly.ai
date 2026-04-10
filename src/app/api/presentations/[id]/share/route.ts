import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const APP_URL = "https://moodlyai.vercel.app";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const shareToken = crypto.randomBytes(16).toString("hex");
  await prisma.presentation.update({
    where: { id, userId: session.user.id },
    data: { isPublished: true, publishedUrl: shareToken },
  });

  const url = APP_URL + "/view/" + shareToken;
  return NextResponse.json({ url, token: shareToken });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.presentation.update({ where: { id, userId: session.user.id }, data: { isPublished: false, publishedUrl: null } });
  return NextResponse.json({ success: true });
}
