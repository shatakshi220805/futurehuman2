import type { Prisma } from "@prisma/client";

/** Every query must be scoped to the authenticated user. Never trust client-supplied user IDs. */
export function scopedUser(userId: string) {
  return {
    memoryWhere: { userId, deletedAt: null } satisfies Prisma.MemoryItemWhereInput,
    meetingWhere: { userId } satisfies Prisma.MeetingWhereInput,
    routineWhere: { userId } satisfies Prisma.RoutineWhereInput,
    chatWhere: { userId } satisfies Prisma.ChatWhereInput,
    integrationWhere: { userId } satisfies Prisma.IntegrationWhereInput,
  };
}
