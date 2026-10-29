import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-sm leading-7 text-white/70">
      <h1 className="text-4xl font-semibold text-white">Privacy Policy</h1>
      <p className="mt-6">Last updated October 29, 2026.</p>
      <p className="mt-4">
        Futurehuman stores work memory you choose to capture: meeting transcripts, screen text (never image
        pixels on disk), and data from connected apps. We do not sell personal data. You may pause capture,
        export, or hard-delete your data at any time from Settings.
      </p>
      <p className="mt-4">
        Authentication is handled by Clerk. Payments by Stripe. Email by Resend. Object storage is encrypted.
        Tokens for third-party apps are encrypted at rest with a per-environment key.
      </p>
    </article>
  );
}
