"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Meeting = {
  id: string;
  title: string;
  status: string;
  summary: string | null;
  transcript: string | null;
  jurisdiction: string | null;
  actionItems: Array<{ id: string; text: string; owner: string | null }>;
};

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const router = useRouter();
  const [transcript, setTranscript] = useState(meeting.transcript ?? "");
  const [busy, setBusy] = useState(false);

  async function finalize() {
    setBusy(true);
    await fetch(`/api/meetings/${meeting.id}/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Hard-delete this meeting?")) return;
    await fetch(`/api/meetings/${meeting.id}`, { method: "DELETE" });
    router.push("/app/meetings");
  }

  return (
    <div>
      <p className="text-xs text-amber-200">
        Consent reminder{meeting.jurisdiction ? ` (${meeting.jurisdiction})` : ""}: tell people on the call that notes
        are being taken. No bot has joined.
      </p>
      <h1 className="mt-3 text-2xl font-semibold">{meeting.title}</h1>
      {meeting.summary ? (
        <section className="glass mt-6 p-5">
          <h2 className="font-medium">Executive summary</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-white/75">{meeting.summary}</p>
        </section>
      ) : null}
      {meeting.actionItems.length > 0 ? (
        <section className="mt-4 space-y-2">
          {meeting.actionItems.map((item) => (
            <div key={item.id} className="glass p-3 text-sm">
              {item.owner ? `${item.owner}: ` : ""}
              {item.text}
            </div>
          ))}
        </section>
      ) : null}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste or stream the transcript from the desktop app"
        className="mt-6 h-40 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm"
      />
      <div className="mt-4 flex gap-3">
        <button onClick={finalize} disabled={busy} className="rounded-full bg-white px-4 py-2 text-sm text-ink">
          {busy ? "Summarizing…" : "Generate summary"}
        </button>
        <button onClick={remove} className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200">
          Delete meeting
        </button>
      </div>
    </div>
  );
}
