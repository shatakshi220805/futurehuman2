import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@futurehuman/db";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  os: z.enum(["mac", "windows"]).default("mac"),
  source: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const limited = await rateLimit(`download:${ip}`, 8, 60 * 10);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email, os, source } = parsed.data;
  const capture = await prisma.emailCapture.create({
    data: { email, os, source: source ?? "download" },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/download/${os}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && !apiKey.includes("replace_me")) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Futurehuman <hello@futurehuman.ai>",
      to: email,
      subject: `Your Futurehuman ${os === "windows" ? "Windows" : "Mac"} download`,
      text: `Install Futurehuman for ${os}: ${link}\n\nThe desktop app captures meetings without a bot. We never auto-send email.`,
    });
    await prisma.emailCapture.update({
      where: { id: capture.id },
      data: { sentAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
