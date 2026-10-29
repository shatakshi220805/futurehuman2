"use client";

import { useState } from "react";
import { pricingTiers } from "@/content/pricing";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function PricingTable() {
  const [annual, setAnnual] = useState(true);

  async function checkout(plan: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval: annual ? "annual" : "monthly" }),
    });
    const json = (await res.json()) as { url?: string; error?: string };
    if (json.url) {
      window.location.href = json.url;
      return;
    }
    alert(json.error ?? "Unable to start checkout");
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3 text-sm">
        <span className={!annual ? "text-white" : "text-white/40"}>Monthly</span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((v) => !v)}
          className="relative h-7 w-12 rounded-full bg-white/10"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-emerald-400 transition ${
              annual ? "left-6" : "left-1"
            }`}
          />
        </button>
        <span className={annual ? "text-white" : "text-white/40"}>Annual</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {pricingTiers.map((tier) => {
          const price = annual ? tier.annual : tier.monthly;
          return (
            <div
              key={tier.id}
              className={`glass p-6 ${tier.id === "plus" ? "ring-1 ring-emerald-400/40" : ""}`}
            >
              <p className="text-xs uppercase tracking-wide text-emerald-300">{tier.name}</p>
              <p className="mt-3 text-4xl font-semibold">
                ${price}
                <span className="text-base font-normal text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/50">{tier.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {tier.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <SignedOut>
                <a
                  href={tier.plan === "BASIC" ? "/sign-up" : "/sign-up?plan=" + tier.plan}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-sm font-medium text-ink"
                >
                  {tier.cta}
                </a>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => (tier.plan === "BASIC" ? (window.location.href = "/app") : checkout(tier.plan))}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-sm font-medium text-ink"
                >
                  {tier.cta}
                </button>
              </SignedIn>
            </div>
          );
        })}
      </div>
    </div>
  );
}
