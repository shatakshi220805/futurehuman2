import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getStripe, priceIdFor } from "@/lib/stripe";
import { prisma } from "@futurehuman/db";
import { syncUser } from "@/lib/auth";

const schema = z.object({
  plan: z.enum(["PLUS", "POWER", "PRO"]),
  interval: z.enum(["monthly", "annual"]),
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to subscribe" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and price IDs." },
      { status: 503 },
    );
  }

  const user = await syncUser();
  if (!user) {
    return NextResponse.json({ error: "User missing" }, { status: 400 });
  }

  const price = priceIdFor(parsed.data.plan, parsed.data.interval);
  if (!price || price.startsWith("price_plus") || price.startsWith("price_power") || price.startsWith("price_pro")) {
    return NextResponse.json({ error: "Stripe price IDs are not configured" }, { status: 503 });
  }

  let customerId = (await prisma.subscription.findUnique({ where: { userId } }))?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { userId },
      create: { userId, stripeCustomerId: customerId, plan: "BASIC", status: "NONE" },
      update: { stripeCustomerId: customerId },
    });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    subscription_data: {
      trial_period_days: parsed.data.plan === "PLUS" ? 14 : undefined,
      metadata: { userId, plan: parsed.data.plan, interval: parsed.data.interval },
    },
    success_url: `${origin}/app/settings/billing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
