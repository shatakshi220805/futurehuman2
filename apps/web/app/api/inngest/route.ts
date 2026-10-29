import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { prisma } from "@futurehuman/db";
import { complete, MORNING_BRIEF_PROMPT } from "@futurehuman/ai";

export const inngest = new Inngest({ id: "futurehuman" });

export const runDueRoutines = inngest.createFunction(
  { id: "run-due-routines", retries: 3 },
  { cron: "TZ=UTC * * * * *" },
  async () => {
    const due = await prisma.routine.findMany({
      where: { status: "ACTIVE", nextRunAt: { lte: new Date() } },
      take: 25,
    });
    for (const routine of due) {
      const run = await prisma.routineRun.create({
        data: { routineId: routine.id, status: "running" },
      });
      try {
        const memories = await prisma.memoryItem.findMany({
          where: { userId: routine.userId, deletedAt: null },
          orderBy: { timestamp: "desc" },
          take: 20,
        });
        const output = await complete(
          MORNING_BRIEF_PROMPT,
          `${routine.prompt}\n${memories.map((m) => m.text).join("\n")}`,
        );
        await prisma.routineRun.update({
          where: { id: run.id },
          data: { status: "succeeded", output, finishedAt: new Date() },
        });
      } catch (error) {
        await prisma.routineRun.update({
          where: { id: run.id },
          data: {
            status: "failed",
            error: error instanceof Error ? error.message : "unknown",
            finishedAt: new Date(),
          },
        });
      }
    }
    return { ran: due.length };
  },
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runDueRoutines],
});
