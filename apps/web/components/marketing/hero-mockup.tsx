"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const tabs = ["Meetings", "Chat", "Routines"] as const;

export function HeroMockup() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Meetings");
  const reduce = useReducedMotion();

  return (
    <div className="glass shadow-glow overflow-hidden">
      <div className="flex gap-1 border-b border-white/10 p-2">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              tab === item ? "bg-white text-ink" : "text-white/60 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <motion.div
        key={tab}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 text-sm"
      >
        {tab === "Meetings" ? <MeetingsPane /> : null}
        {tab === "Chat" ? <ChatPane /> : null}
        {tab === "Routines" ? <RoutinesPane /> : null}
      </motion.div>
    </div>
  );
}

function MeetingsPane() {
  return (
    <div>
      <p className="text-xs text-white/40">Call with Northwind · Today · 2:00 PM · no bot</p>
      <h3 className="mt-3 font-medium">Executive summary</h3>
      <ul className="mt-2 space-y-2 text-white/70">
        <li>Avery agreed to $38 a seat for the two-site pilot starting December 1.</li>
        <li>Revised rollout dates are due before Friday.</li>
      </ul>
      <h3 className="mt-4 font-medium">Action items</h3>
      <p className="mt-2 rounded-xl bg-white/[0.04] p-3 text-white/80">
        Jordan: Send Avery the revised pricing deck by Friday
      </p>
      <p className="mt-3 text-xs text-amber-200/90">Saved as a Gmail draft — never auto-sent.</p>
    </div>
  );
}

function ChatPane() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white/[0.04] p-3 text-white/80">What did Brook find on the export timeouts?</div>
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3">
        Timeouts only hit exports over 50,000 rows. Brook is testing a fix today.
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/60">
            Brook’s email
          </span>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/60">
            Call with Avery
          </span>
        </div>
      </div>
    </div>
  );
}

function RoutinesPane() {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-emerald-300">Morning Brief · 7:00 AM</p>
      <ol className="mt-3 list-decimal space-y-2 pl-4 text-white/80">
        <li>Send Avery the revised pricing deck with new rollout dates.</li>
        <li>Book the pricing review for next week.</li>
        <li>Brook is testing the export timeout fix — check before standup.</li>
      </ol>
    </div>
  );
}
