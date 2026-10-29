import type { Metadata } from "next";
import { changelog } from "@/content/changelog";

export const metadata: Metadata = { title: "Changelog" };

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Changelog</h1>
      <ol className="mt-10 space-y-8">
        {changelog.map((item) => (
          <li key={item.date} className="glass p-5">
            <p className="text-xs text-emerald-300">{item.date}</p>
            <h2 className="mt-1 text-xl font-medium">{item.title}</h2>
            <p className="mt-2 text-sm text-white/60">{item.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
