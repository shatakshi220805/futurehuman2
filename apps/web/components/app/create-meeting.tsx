"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateMeeting() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New meeting" }),
    });
    const json = (await res.json()) as { id?: string; error?: string };
    setBusy(false);
    if (json.id) router.push(`/app/meetings/${json.id}`);
    else alert(json.error ?? "Could not create meeting");
  }

  return (
    <button onClick={create} disabled={busy} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">
      {busy ? "Creating…" : "New meeting"}
    </button>
  );
}
