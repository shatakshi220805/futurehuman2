import { auth } from "@clerk/nextjs/server";
import { prisma } from "@futurehuman/db";
import { CHAT_SYSTEM_PROMPT, streamComplete } from "@futurehuman/ai";
import { searchMemory } from "@/server/memory";
import { consumeCredits } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { content, chatId } = (await req.json()) as { content: string; chatId?: string };
  if (!content) return new Response("Missing content", { status: 400 });

  await consumeCredits(userId, 1);

  const chat = chatId
    ? await prisma.chat.findFirst({ where: { id: chatId, userId } })
    : await prisma.chat.create({ data: { userId, title: content.slice(0, 80) } });
  if (!chat) return new Response("Not found", { status: 404 });

  await prisma.chatMessage.create({ data: { chatId: chat.id, role: "user", content } });
  const sources = await searchMemory(userId, content);
  const sourceBlock = sources
    .map((s, i) => `[${i + 1}] ${s.source} ${s.app ?? ""} (${s.id})\n${s.text}`)
    .join("\n\n");

  const encoder = new TextEncoder();
  let full = "";
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`event: meta\ndata: ${JSON.stringify({ chatId: chat.id, sources })}\n\n`),
      );
      try {
        await streamComplete(
          CHAT_SYSTEM_PROMPT,
          `Sources:\n${sourceBlock || "(none)"}\n\nQuestion: ${content}`,
          (delta) => {
            full += delta;
            controller.enqueue(encoder.encode(`event: delta\ndata: ${JSON.stringify({ delta })}\n\n`));
          },
        );
        await prisma.chatMessage.create({
          data: {
            chatId: chat.id,
            role: "assistant",
            content: full,
            sources: sources.map((s) => ({ id: s.id, source: s.source, app: s.app })),
          },
        });
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ message: error instanceof Error ? error.message : "error" })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
