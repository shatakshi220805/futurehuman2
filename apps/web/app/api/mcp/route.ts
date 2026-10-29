import { NextResponse } from "next/server";
import { prisma } from "@futurehuman/db";
import { PLAN_LIMITS } from "@futurehuman/db";
import { searchMemory } from "@/server/memory";
import { getActivePlan } from "@/lib/billing";

async function hashToken(raw: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Buffer.from(digest).toString("hex");
}

export async function POST(req: Request) {
  const header = req.headers.get("authorization");
  const token = header?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const hashed = await hashToken(token);
  const record = await prisma.mcpToken.findUnique({ where: { hashedToken: hashed } });
  if (!record || record.revokedAt) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const plan = await getActivePlan(record.userId);
  if (!PLAN_LIMITS[plan].mcp) {
    return NextResponse.json({ error: "MCP requires Plus or higher" }, { status: 403 });
  }

  const body = (await req.json()) as { query?: string };
  if (!body.query) return NextResponse.json({ error: "query required" }, { status: 400 });

  await prisma.mcpToken.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } });
  const items = await searchMemory(record.userId, body.query);
  return NextResponse.json({
    results: items.map((item) => ({
      id: item.id,
      source: item.source,
      app: item.app,
      text: item.text,
      timestamp: item.timestamp,
    })),
  });
}
