"use client";

import { useEffect, useState } from "react";

function detectOs() {
  if (typeof navigator === "undefined") return "mac";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("windows")) return "windows";
  if (ua.includes("mac")) return "mac";
  return "mac";
}

export function DownloadForm({ source = "hero" }: { source?: string }) {
  const [os, setOs] = useState<"mac" | "windows">("mac");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOs(detectOs());
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, os, source }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setStatus("error");
      setMessage(json.error ?? "Something went wrong");
      return;
    }
    setStatus("done");
    setMessage("Check your inbox for the download link.");
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={`email-${source}`}>
        Email
      </label>
      <input
        id={`email-${source}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Work email"
        className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm outline-none ring-emerald-400/0 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-full bg-white px-5 text-sm font-medium text-ink disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : `Get ${os === "windows" ? "Windows" : "Mac"} link`}
      </button>
      {message ? (
        <p className={`text-sm sm:col-span-2 ${status === "error" ? "text-red-300" : "text-emerald-300"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
