import { PLAN_LIMITS, prisma, type Plan } from "@futurehuman/db";

export async function getActivePlan(userId: string): Promise<Plan> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub) return "BASIC";
  if (sub.status === "ACTIVE" || sub.status === "TRIALING") return sub.plan;
  return "BASIC";
}

export async function assertMeetingQuota(userId: string) {
  const plan = await getActivePlan(userId);
  const limit = PLAN_LIMITS[plan].meetingNotes;
  if (limit === null) return;
  const count = await prisma.meeting.count({ where: { userId, status: "READY" } });
  if (count >= limit) {
    throw new Error("PLAN_LIMIT_MEETINGS");
  }
}

export async function assertRoutineQuota(userId: string) {
  const plan = await getActivePlan(userId);
  const limit = PLAN_LIMITS[plan].routines;
  if (limit === null) return;
  const count = await prisma.routine.count({ where: { userId } });
  if (count >= limit) {
    throw new Error("PLAN_LIMIT_ROUTINES");
  }
}

export async function assertMcpAllowed(userId: string) {
  const plan = await getActivePlan(userId);
  if (!PLAN_LIMITS[plan].mcp) {
    throw new Error("PLAN_LIMIT_MCP");
  }
}

export async function consumeCredits(userId: string, amount: number) {
  const plan = await getActivePlan(userId);
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const limits = PLAN_LIMITS[plan];

  const period = await prisma.usagePeriod.upsert({
    where: { userId_periodStart: { userId, periodStart } },
    create: {
      userId,
      periodStart,
      periodEnd,
      creditsLimit: plan === "BASIC" ? 40 : limits.monthlyCredits,
    },
    update: {},
  });

  const remaining = period.creditsLimit + period.extraCredits - period.creditsUsed;
  if (remaining < amount && !limits.lighterModeOnExhaust) {
    throw new Error("CREDITS_EXHAUSTED");
  }

  await prisma.usagePeriod.update({
    where: { id: period.id },
    data: { creditsUsed: { increment: amount } },
  });

  return { lighter: remaining < amount };
}
