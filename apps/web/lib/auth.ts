import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@futurehuman/db";

export async function requireUserId() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}

export async function syncUser() {
  const { userId } = auth();
  if (!userId) return null;
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      imageUrl: clerkUser.imageUrl,
    },
    update: {
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      imageUrl: clerkUser.imageUrl,
    },
  });
}
