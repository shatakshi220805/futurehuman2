import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@futurehuman/db";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub) return NextResponse.json({ error: "No billing account" }, { status: 404 });
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${origin}/app/settings/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
