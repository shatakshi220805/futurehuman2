import { NextResponse } from "next/server";
import { prisma } from "@futurehuman/db";
import { requireUserId } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  await prisma.meeting.deleteMany({ where: { id: params.id, userId } });
  return NextResponse.json({ ok: true });
}
