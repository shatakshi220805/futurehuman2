import Link from "next/link";
import { prisma } from "@futurehuman/db";
import { requireUserId } from "@/lib/auth";
import { CreateMeeting } from "@/components/app/create-meeting";

export default async function MeetingsPage() {
  const userId = await requireUserId();
  const meetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meetings</h1>
        <CreateMeeting />
      </div>
      {meetings.length === 0 ? (
        <p className="mt-10 text-sm text-white/40">No notes yet. Capture from the desktop app — no bot joins.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {meetings.map((m) => (
            <li key={m.id} className="glass p-4">
              <Link href={`/app/meetings/${m.id}`} className="font-medium">
                {m.title}
              </Link>
              <p className="text-xs text-white/40">
                {m.status} · {m.startedAt.toISOString().slice(0, 16)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
