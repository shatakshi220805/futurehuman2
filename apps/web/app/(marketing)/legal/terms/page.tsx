import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-sm leading-7 text-white/70">
      <h1 className="text-4xl font-semibold text-white">Terms of Service</h1>
      <p className="mt-6">
        Futurehuman is provided as a subscription product. Basic is free. Paid plans renew until canceled in the
        Stripe Customer Portal. You must obtain consent before recording meetings in your jurisdiction. Do not
        upload data you are not authorized to process.
      </p>
    </article>
  );
}
