import { PrismaClient, Plan, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const blog = [
    {
      slug: "introducing-futurehuman",
      title: "Introducing Futurehuman",
      excerpt: "A personal AI work memory that already knows the backstory.",
      content:
        "Futurehuman captures meetings without a bot, remembers what you saw on screen, and answers from your real work.",
      publishedAt: new Date("2026-09-15"),
    },
    {
      slug: "botless-meeting-notes",
      title: "Why we never send a bot to your calls",
      excerpt: "Notes from system audio, not a guest in the lobby.",
      content:
        "A meeting bot changes the room. Futurehuman listens on-device through the desktop app, then writes the summary after you hang up.",
      publishedAt: new Date("2026-10-01"),
    },
    {
      slug: "morning-brief",
      title: "How the 7:00 AM Morning Brief is built",
      excerpt: "Overnight email, Slack, calendar, and client priorities — in one note.",
      content:
        "The default routine scans what changed while you slept and writes three priorities before your first meeting.",
      publishedAt: new Date("2026-10-12"),
    },
  ];

  for (const post of blog) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: post,
      update: post,
    });
  }

  // Demo user is only created when SEED_DEMO_USER_ID is set (never in production app routes).
  const demoId = process.env.SEED_DEMO_USER_ID;
  if (demoId) {
    const user = await prisma.user.upsert({
      where: { id: demoId },
      create: {
        id: demoId,
        email: "jordan@futurehuman.dev",
        name: "Jordan Chen",
        onboardingComplete: true,
      },
      update: {},
    });

    const org = await prisma.organization.upsert({
      where: { slug: "chirp-creative" },
      create: {
        name: "Chirp Creative",
        slug: "chirp-creative",
        ownerId: user.id,
      },
      update: {},
    });

    await prisma.membership.upsert({
      where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
      create: { userId: user.id, organizationId: org.id, role: Role.OWNER },
      update: {},
    });

    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        stripeCustomerId: `cus_seed_${user.id}`,
        plan: Plan.PLUS,
        status: "ACTIVE",
      },
      update: {},
    });
  }

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
