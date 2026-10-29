import type { Metadata } from "next";

export const metadata: Metadata = { title: "Data Processing Addendum" };

export default function DpaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-sm leading-7 text-white/70">
      <h1 className="text-4xl font-semibold text-white">Data Processing Addendum</h1>
      <p className="mt-6">
        This DPA governs processing of customer personal data. Futurehuman acts as processor; you act as
        controller. Subprocessors are listed at /legal/subprocessors. Standard contractual clauses apply for
        international transfers.
      </p>
    </article>
  );
}
