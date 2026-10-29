import type { Metadata } from "next";
import { PricingTable } from "@/components/marketing/pricing-table";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Basic is free. Plus is from $17 a month with a 14-day trial.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center text-4xl font-semibold">Start free and upgrade anytime</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-white/60">
        Basic is free. Plus is from $17 a month billed annually, with a 14-day trial.
      </p>
      <div className="mt-12">
        <PricingTable />
      </div>
      <Faq />
    </div>
  );
}
