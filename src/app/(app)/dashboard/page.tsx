import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const presentations = await prisma.presentation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      slides: {
        orderBy: { order: "asc" },
        select: { id: true, content: true, layout: true, order: true },
      },
    },
  });

  return <DashboardClient user={session.user} presentations={presentations} />;
}
