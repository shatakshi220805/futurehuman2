import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trust Center" };

export default function SecurityPage() {
  const items = [
    ["Encryption", "TLS in transit. AES-256 at rest. Integration tokens encrypted with TOKEN_ENCRYPTION_KEY."],
    ["Access control", "Clerk session + server-side user scoping. RLS policies on tenant tables."],
    ["SOC 2", "Evidence checklist lives in /docs/compliance. Type II in progress."],
    ["HIPAA", "BAA available; disable training-style logging in the workspace."],
    ["GDPR", "Export and hard-delete in Settings. 30-day completion target."],
    ["Capture", "Screen pixels discarded in memory. Images never written to disk."],
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Trust Center</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(([title, body]) => (
          <div key={title} className="glass p-5">
            <h2 className="font-medium">{title}</h2>
            <p className="mt-2 text-sm text-white/60">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
