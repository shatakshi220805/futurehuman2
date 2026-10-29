import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { MemorySource } from "@futurehuman/db";
import { ingestMemory, searchMemory } from "@/server/memory";
import { assertMcpAllowed, assertMeetingQuota, assertRoutineQuota, consumeCredits, getActivePlan } from "@/lib/billing";
import { complete, MEETING_SUMMARY_PROMPT, MORNING_BRIEF_PROMPT } from "@futurehuman/ai";
import { protectedProcedure, publicProcedure, router } from "./init";

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true })),
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      include: { memberships: { include: { organization: true } } },
    });
    const plan = await getActivePlan(ctx.userId);
    return { user, plan };
  }),
  memory: router({
    list: protectedProcedure
      .input(
        z.object({
          query: z.string().optional(),
          app: z.string().optional(),
          project: z.string().optional(),
          from: z.date().optional(),
          to: z.date().optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        return ctx.prisma.memoryItem.findMany({
          where: {
            userId: ctx.userId,
            deletedAt: null,
            app: input.app,
            project: input.project,
            timestamp: {
              gte: input.from,
              lte: input.to,
            },
            text: input.query ? { contains: input.query, mode: "insensitive" } : undefined,
          },
          orderBy: { timestamp: "desc" },
          take: 100,
        });
      }),
    ingest: protectedProcedure
      .input(
        z.object({
          source: z.nativeEnum(MemorySource),
          text: z.string().min(1),
          app: z.string().optional(),
          project: z.string().optional(),
          sessionId: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return ingestMemory({ userId: ctx.userId, ...input });
      }),
    pause: protectedProcedure
      .input(z.object({ paused: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.user.update({
          where: { id: ctx.userId },
          data: { capturePaused: input.paused },
        });
      }),
    delete: protectedProcedure
      .input(
        z.object({
          id: z.string().optional(),
          from: z.date().optional(),
          to: z.date().optional(),
          all: z.boolean().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (input.all) {
          await ctx.prisma.memoryItem.deleteMany({ where: { userId: ctx.userId } });
          return { deleted: "all" };
        }
        if (input.id) {
          await ctx.prisma.memoryItem.deleteMany({ where: { id: input.id, userId: ctx.userId } });
          return { deleted: input.id };
        }
        if (input.from && input.to) {
          await ctx.prisma.memoryItem.deleteMany({
            where: { userId: ctx.userId, timestamp: { gte: input.from, lte: input.to } },
          });
          return { deleted: "range" };
        }
        throw new TRPCError({ code: "BAD_REQUEST" });
      }),
  }),
  chat: router({
    list: protectedProcedure.query(({ ctx }) =>
      ctx.prisma.chat.findMany({ where: { userId: ctx.userId }, orderBy: { updatedAt: "desc" } }),
    ),
    messages: protectedProcedure.input(z.object({ chatId: z.string() })).query(({ ctx, input }) =>
      ctx.prisma.chatMessage.findMany({
        where: { chat: { id: input.chatId, userId: ctx.userId } },
        orderBy: { createdAt: "asc" },
      }),
    ),
    send: protectedProcedure
      .input(z.object({ chatId: z.string().optional(), content: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await consumeCredits(ctx.userId, 1);
        const chat = input.chatId
          ? await ctx.prisma.chat.findFirst({ where: { id: input.chatId, userId: ctx.userId } })
          : await ctx.prisma.chat.create({
              data: { userId: ctx.userId, title: input.content.slice(0, 80) },
            });
        if (!chat) throw new TRPCError({ code: "NOT_FOUND" });

        await ctx.prisma.chatMessage.create({
          data: { chatId: chat.id, role: "user", content: input.content },
        });
        const sources = await searchMemory(ctx.userId, input.content);
        const sourceBlock = sources
          .map((s, i) => `[${i + 1}] (${s.source} ${s.app ?? ""} ${s.timestamp.toISOString()})\n${s.text}`)
          .join("\n\n");
        const answer = await complete(
          "You are Futurehuman. Cite sources as [n]. If unknown, say so.",
          `Sources:\n${sourceBlock || "(none)"}\n\nQuestion: ${input.content}`,
        );
        const message = await ctx.prisma.chatMessage.create({
          data: {
            chatId: chat.id,
            role: "assistant",
            content: answer,
            sources: sources.map((s) => ({ id: s.id, source: s.source, app: s.app })),
          },
        });
        return { chatId: chat.id, message, sources };
      }),
  }),
  meetings: router({
    list: protectedProcedure.query(({ ctx }) =>
      ctx.prisma.meeting.findMany({ where: { userId: ctx.userId }, orderBy: { startedAt: "desc" } }),
    ),
    get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      const meeting = await ctx.prisma.meeting.findFirst({
        where: { id: input.id, userId: ctx.userId },
        include: { actionItems: true, speakers: true },
      });
      if (!meeting) throw new TRPCError({ code: "NOT_FOUND" });
      return meeting;
    }),
    create: protectedProcedure
      .input(z.object({ title: z.string(), jurisdiction: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await assertMeetingQuota(ctx.userId);
        return ctx.prisma.meeting.create({
          data: {
            userId: ctx.userId,
            title: input.title,
            jurisdiction: input.jurisdiction,
            consentShown: true,
          },
        });
      }),
    finalize: protectedProcedure
      .input(z.object({ id: z.string(), transcript: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const meeting = await ctx.prisma.meeting.findFirst({
          where: { id: input.id, userId: ctx.userId },
        });
        if (!meeting) throw new TRPCError({ code: "NOT_FOUND" });
        const raw = await complete(MEETING_SUMMARY_PROMPT, input.transcript);
        let parsed: { summary?: string[]; actionItems?: { owner: string | null; text: string }[] } = {};
        try {
          parsed = JSON.parse(raw) as typeof parsed;
        } catch {
          parsed = { summary: [raw], actionItems: [] };
        }
        const summary = (parsed.summary ?? []).join("\n");
        await ctx.prisma.actionItem.createMany({
          data: (parsed.actionItems ?? []).map((item) => ({
            meetingId: meeting.id,
            text: item.text,
            owner: item.owner,
          })),
        });
        await ingestMemory({
          userId: ctx.userId,
          source: "MEETING",
          text: `${meeting.title}\n${summary}\n${input.transcript}`,
          meetingId: meeting.id,
          app: "meetings",
        });
        return ctx.prisma.meeting.update({
          where: { id: meeting.id },
          data: {
            transcript: input.transcript,
            summary,
            status: "READY",
            endedAt: new Date(),
          },
        });
      }),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) =>
      ctx.prisma.meeting.deleteMany({ where: { id: input.id, userId: ctx.userId } }),
    ),
  }),
  routines: router({
    list: protectedProcedure.query(({ ctx }) =>
      ctx.prisma.routine.findMany({
        where: { userId: ctx.userId },
        include: { runs: { take: 5, orderBy: { startedAt: "desc" } } },
      }),
    ),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          prompt: z.string(),
          schedule: z.string(),
          sources: z.array(z.string()),
          delivery: z.enum(["IN_APP", "EMAIL", "IMESSAGE"]).default("IN_APP"),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await assertRoutineQuota(ctx.userId);
        return ctx.prisma.routine.create({
          data: { userId: ctx.userId, ...input },
        });
      }),
    run: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      const routine = await ctx.prisma.routine.findFirst({
        where: { id: input.id, userId: ctx.userId },
      });
      if (!routine) throw new TRPCError({ code: "NOT_FOUND" });
      await consumeCredits(ctx.userId, 2);
      const run = await ctx.prisma.routineRun.create({
        data: { routineId: routine.id, status: "running" },
      });
      try {
        const memories = await ctx.prisma.memoryItem.findMany({
          where: { userId: ctx.userId, deletedAt: null },
          orderBy: { timestamp: "desc" },
          take: 20,
        });
        const output = await complete(
          MORNING_BRIEF_PROMPT,
          `${routine.prompt}\n\n${memories.map((m) => m.text).join("\n---\n")}`,
        );
        return ctx.prisma.routineRun.update({
          where: { id: run.id },
          data: { status: "succeeded", output, finishedAt: new Date() },
        });
      } catch (error) {
        return ctx.prisma.routineRun.update({
          where: { id: run.id },
          data: {
            status: "failed",
            error: error instanceof Error ? error.message : "unknown",
            finishedAt: new Date(),
          },
        });
      }
    }),
  }),
  workspace: router({
    create: protectedProcedure
      .input(z.object({ name: z.string().min(2) }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const org = await ctx.prisma.organization.create({
          data: { name: input.name, slug, ownerId: ctx.userId },
        });
        await ctx.prisma.membership.create({
          data: { userId: ctx.userId, organizationId: org.id, role: "OWNER" },
        });
        return org;
      }),
    invite: protectedProcedure
      .input(z.object({ organizationId: z.string(), email: z.string().email(), role: z.enum(["ADMIN", "MEMBER"]) }))
      .mutation(async ({ ctx, input }) => {
        const membership = await ctx.prisma.membership.findFirst({
          where: { organizationId: input.organizationId, userId: ctx.userId, role: { in: ["OWNER", "ADMIN"] } },
        });
        if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
        const invitee = await ctx.prisma.user.findUnique({ where: { email: input.email } });
        if (!invitee) throw new TRPCError({ code: "NOT_FOUND", message: "User must sign up first" });
        return ctx.prisma.membership.create({
          data: { userId: invitee.id, organizationId: input.organizationId, role: input.role },
        });
      }),
  }),
  mcp: router({
    createToken: protectedProcedure.input(z.object({ name: z.string() })).mutation(async ({ ctx, input }) => {
      await assertMcpAllowed(ctx.userId);
      const raw = `fh_${crypto.randomUUID()}`;
      const hashed = await hashToken(raw);
      await ctx.prisma.mcpToken.create({
        data: { userId: ctx.userId, name: input.name, hashedToken: hashed, scopes: ["memory.read"] },
      });
      return { token: raw };
    }),
  }),
  settings: router({
    completeOnboarding: protectedProcedure
      .input(z.object({ osPreference: z.string() }))
      .mutation(({ ctx, input }) =>
        ctx.prisma.user.update({
          where: { id: ctx.userId },
          data: { osPreference: input.osPreference, onboardingComplete: true },
        }),
      ),
  }),
});

async function hashToken(raw: string) {
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("hex");
}

export type AppRouter = typeof appRouter;
