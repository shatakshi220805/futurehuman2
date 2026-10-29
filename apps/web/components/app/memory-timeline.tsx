"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  id: string;
  source: string;
  app: string | null;
  project: string | null;
  text: string;
  timestamp: Date;
};

export function MemoryTimeline({ items, paused }: { items: Item[]; paused: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(path: string, body: unknown) {
    setBusy(true);
    await fetch("/api/memory/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-6">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/app/memory?q=${encodeURIComponent(q)}`);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search memory"
          className="h-10 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm"
        />
        <button className="h-10 rounded-full border border-white/15 px-4 text-sm">Search</button>
        <button
          type="button"
          disabled={busy}
          onClick={() => call("pause", { op: "pause", paused: !paused })}
          className="h-10 rounded-full border border-amber-400/30 px-4 text-sm text-amber-200"
        >
          {paused ? "Resume capture" : "Pause capture"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (confirm("Hard-delete all memory?")) call("delete", { op: "delete", all: true });
          }}
          className="h-10 rounded-full border border-red-400/30 px-4 text-sm text-red-200"
        >
          Delete all
        </button>
      </form>
      {items.length === 0 ? (
        <p className="mt-10 text-sm text-white/40">No memory yet. Connect apps or take a meeting.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="glass p-4">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>
                  {item.source} {item.app ? `· ${item.app}` : ""} {item.project ? `· ${item.project}` : ""}
                </span>
                <button onClick={() => call("delete", { op: "delete", id: item.id })} className="text-red-300">
                  Delete
                </button>
              </div>
              <p className="mt-2 text-sm text-white/80">{item.text.slice(0, 400)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
