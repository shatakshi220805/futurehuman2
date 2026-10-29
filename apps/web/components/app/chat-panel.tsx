"use client";

import Link from "next/link";
import { useState } from "react";

type Source = { id: string; source: string; app?: string | null };

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setAnswer("");
    setError("");
    const res = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });
    if (!res.ok || !res.body) {
      setStatus("error");
      setError(res.status === 401 ? "Sign in required" : "Could not stream an answer");
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const type = /event: (\w+)/.exec(event)?.[1];
        const dataLine = event.split("data: ")[1];
        if (!type || !dataLine) continue;
        const data = JSON.parse(dataLine) as { delta?: string; sources?: Source[]; message?: string };
        if (type === "meta" && data.sources) setSources(data.sources);
        if (type === "delta" && data.delta) setAnswer((prev) => prev + data.delta);
        if (type === "error") {
          setStatus("error");
          setError(data.message ?? "Model error");
        }
      }
    }
    setStatus("idle");
  }

  return (
    <div className="mt-8">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What did Avery ask for on today's call?"
          className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm"
        />
        <button className="h-12 rounded-full bg-white px-5 text-sm font-medium text-ink" disabled={status === "loading"}>
          {status === "loading" ? "Thinking" : "Ask"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {!answer && status === "idle" && !error ? (
        <p className="mt-8 text-sm text-white/40">No conversation yet. Ask about a client, a call, or a project.</p>
      ) : null}
      {answer ? (
        <div className="glass mt-6 p-5">
          <p className="whitespace-pre-wrap text-sm text-white/80">{answer}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sources.map((s) => (
              <Link
                key={s.id}
                href={`/app/memory?item=${s.id}`}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/5"
              >
                {s.source}
                {s.app ? ` · ${s.app}` : ""}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
