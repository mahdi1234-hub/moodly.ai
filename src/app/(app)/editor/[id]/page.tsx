import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditorClient } from "@/components/editor/EditorClient";
export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;
  const presentation = await prisma.presentation.findUnique({ where: { id, userId: session.user.id }, include: { slides: { orderBy: { order: "asc" } } } });
  if (!presentation) redirect("/dashboard");
  return <EditorClient presentation={presentation} user={session.user} />;
}
