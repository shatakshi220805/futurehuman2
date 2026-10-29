import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@futurehuman/db";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret || secret.includes("replace_me")) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const payload = await req.text();
  const svix = new Webhook(secret);
  let event: { type: string; data: Record<string, unknown> };
  try {
    event = svix.verify(payload, {
      "svix-id": req.headers.get("svix-id") ?? "",
      "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
      "svix-signature": req.headers.get("svix-signature") ?? "",
    }) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const id = String(event.data.id);
    const emails = event.data.email_addresses as Array<{ email_address: string }> | undefined;
    const email = emails?.[0]?.email_address;
    if (email) {
      await prisma.user.upsert({
        where: { id },
        create: {
          id,
          email,
          name: [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") || null,
        },
        update: { email },
      });
      await ensureDefaultRoutine(id);
    }
  }

  if (event.type === "user.deleted") {
    const id = String(event.data.id);
    await prisma.user.deleteMany({ where: { id } });
  }

  return NextResponse.json({ ok: true });
}

async function ensureDefaultRoutine(userId: string) {
  const existing = await prisma.routine.findFirst({ where: { userId, isDefault: true } });
  if (existing) return;
  await prisma.routine.create({
    data: {
      userId,
      name: "Morning Brief",
      prompt: "Scan overnight email, Slack, calendar, and client priorities. Write three priorities.",
      schedule: "0 7 * * 1-5",
      sources: ["EMAIL", "SLACK", "CALENDAR"],
      delivery: "IN_APP",
      isDefault: true,
    },
  });
}
