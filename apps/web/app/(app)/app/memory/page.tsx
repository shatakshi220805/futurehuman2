import { prisma } from "@futurehuman/db";
import { requireUserId } from "@/lib/auth";
import { MemoryTimeline } from "@/components/app/memory-timeline";

export default async function MemoryPage({
  searchParams,
}: {
  searchParams: { q?: string; app?: string; project?: string };
}) {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const items = await prisma.memoryItem.findMany({
    where: {
      userId,
      deletedAt: null,
      app: searchParams.app || undefined,
      project: searchParams.project || undefined,
      text: searchParams.q ? { contains: searchParams.q, mode: "insensitive" } : undefined,
    },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Memory timeline</h1>
      <MemoryTimeline items={items} paused={user?.capturePaused ?? false} />
    </div>
  );
}
