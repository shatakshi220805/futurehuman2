import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("replace_me")) return null;
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

export function priceIdFor(plan: string, interval: "monthly" | "annual") {
  const map: Record<string, string | undefined> = {
    PLUS_monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY,
    PLUS_annual: process.env.STRIPE_PRICE_PLUS_ANNUAL,
    POWER_monthly: process.env.STRIPE_PRICE_POWER_MONTHLY,
    POWER_annual: process.env.STRIPE_PRICE_POWER_ANNUAL,
    PRO_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    PRO_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
  };
  return map[`${plan}_${interval}`];
}
