import { notFound } from "next/navigation";
import { prisma } from "@futurehuman/db";
import { requireUserId } from "@/lib/auth";
import { MeetingDetail } from "@/components/app/meeting-detail";

export default async function MeetingDetailPage({ params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const meeting = await prisma.meeting.findFirst({
    where: { id: params.id, userId },
    include: { actionItems: true },
  });
  if (!meeting) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <MeetingDetail meeting={meeting} />
    </div>
  );
}
