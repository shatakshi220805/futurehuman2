import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@futurehuman/db";
import { requireUserId } from "@/lib/auth";

const schema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("pause"), paused: z.boolean() }),
  z.object({ op: z.literal("delete"), id: z.string().optional(), all: z.boolean().optional() }),
]);

export async function POST(req: Request) {
  const userId = await requireUserId();
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  if (parsed.data.op === "pause") {
    await prisma.user.update({ where: { id: userId }, data: { capturePaused: parsed.data.paused } });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.all) {
    await prisma.memoryItem.deleteMany({ where: { userId } });
  } else if (parsed.data.id) {
    await prisma.memoryItem.deleteMany({ where: { id: parsed.data.id, userId } });
  }
  return NextResponse.json({ ok: true });
}
