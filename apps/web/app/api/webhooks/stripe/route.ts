import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@futurehuman/db";
import { getStripe } from "@/lib/stripe";
import type { Plan, BillingInterval, SubscriptionStatus } from "@futurehuman/db";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const customerId = String(session.customer);
    const subscriptionId = String(session.subscription ?? "");
    const plan = (session.metadata?.plan as Plan | undefined) ?? "PLUS";
    const interval = (session.metadata?.interval === "annual" ? "ANNUAL" : "MONTHLY") as BillingInterval;
    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan,
          interval,
          status: "TRIALING",
        },
        update: {
          stripeSubscriptionId: subscriptionId,
          plan,
          interval,
          status: "TRIALING",
        },
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const status = mapStatus(sub.status);
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: {
        status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      },
    });
  }

  return NextResponse.json({ received: true });
}

function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "unpaid":
      return "UNPAID";
    default:
      return "NONE";
  }
}
