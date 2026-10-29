import { NextResponse } from "next/server";
import { prisma } from "@futurehuman/db";
import { requireUserId } from "@/lib/auth";
import { assertMeetingQuota } from "@/lib/billing";

export async function POST(req: Request) {
  const userId = await requireUserId();
  try {
    await assertMeetingQuota(userId);
  } catch {
    return NextResponse.json(
      { error: "Basic includes 25 meeting notes. Upgrade to Plus for unlimited notes." },
      { status: 402 },
    );
  }
  const body = (await req.json()) as { title?: string; jurisdiction?: string };
  const meeting = await prisma.meeting.create({
    data: {
      userId,
      title: body.title ?? "Untitled meeting",
      jurisdiction: body.jurisdiction,
      consentShown: true,
    },
  });
  return NextResponse.json({ id: meeting.id });
}
