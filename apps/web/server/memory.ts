import { prisma, type MemorySource } from "@futurehuman/db";
import { chunkText, embedTexts } from "@futurehuman/ai";

export async function ingestMemory(input: {
  userId: string;
  organizationId?: string | null;
  source: MemorySource;
  app?: string | null;
  project?: string | null;
  text: string;
  timestamp?: Date;
  sessionId?: string | null;
  meetingId?: string | null;
}) {
  const item = await prisma.memoryItem.create({
    data: {
      userId: input.userId,
      organizationId: input.organizationId ?? undefined,
      source: input.source,
      app: input.app,
      project: input.project,
      text: input.text,
      timestamp: input.timestamp ?? new Date(),
      sessionId: input.sessionId,
      meetingId: input.meetingId,
    },
  });

  const chunks = chunkText(input.text);
  const vectors = await embedTexts(chunks);

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!chunk) continue;
    await prisma.memoryChunk.create({
      data: { memoryItemId: item.id, ordinal: i, text: chunk },
    });
    const vector = vectors[i];
    if (vector && vector.some((n) => n !== 0)) {
      const literal = `[${vector.join(",")}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE "MemoryChunk" SET embedding = $1::vector WHERE "memoryItemId" = $2 AND ordinal = $3`,
        literal,
        item.id,
        i,
      );
    }
  }

  return item;
}

export async function searchMemory(userId: string, query: string, limit = 8) {
  const [qvec] = await embedTexts([query]);
  const keyword = await prisma.memoryItem.findMany({
    where: {
      userId,
      deletedAt: null,
      text: { contains: query, mode: "insensitive" },
    },
    take: limit,
    orderBy: { timestamp: "desc" },
  });

  if (!qvec || qvec.every((n) => n === 0)) {
    return keyword;
  }

  const literal = `[${qvec.join(",")}]`;
  const semantic = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT m.id
     FROM "MemoryChunk" c
     JOIN "MemoryItem" m ON m.id = c."memoryItemId"
     WHERE m."userId" = $1 AND m."deletedAt" IS NULL AND c.embedding IS NOT NULL
     ORDER BY c.embedding <=> $2::vector
     LIMIT $3`,
    userId,
    literal,
    limit,
  );

  const ids = [...new Set([...semantic.map((s) => s.id), ...keyword.map((k) => k.id)])];
  if (ids.length === 0) return [];
  return prisma.memoryItem.findMany({
    where: { id: { in: ids }, userId, deletedAt: null },
    orderBy: { timestamp: "desc" },
  });
}
