import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublicViewer } from "@/components/viewer/PublicViewer";

export default async function ViewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const presentation = await prisma.presentation.findFirst({
    where: { publishedUrl: token, isPublished: true },
    include: { slides: { orderBy: { order: "asc" } }, user: { select: { name: true, image: true } } },
  });
  if (!presentation) notFound();
  return <PublicViewer presentation={presentation} />;
}
