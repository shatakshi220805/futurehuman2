import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subprocessors" };

const rows = [
  ["Clerk", "Authentication", "USA"],
  ["Stripe", "Payments", "USA"],
  ["Anthropic", "Model inference", "USA"],
  ["Resend", "Transactional email", "USA"],
  ["Vercel", "Hosting", "USA"],
  ["Neon / Supabase", "Database", "USA"],
  ["Deepgram", "Speech-to-text", "USA"],
];

export default function SubprocessorsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Subprocessors</h1>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="text-white/50">
            <th className="py-2">Vendor</th>
            <th>Purpose</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-white/10">
              {r.map((c) => (
                <td key={c} className="py-2 text-white/70">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
