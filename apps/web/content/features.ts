export const features = {
  meetings: {
    slug: "meetings",
    title: "Meeting notes without a bot",
    eyebrow: "Meetings",
    description:
      "Futurehuman captures system audio and your mic on the desktop app. No guest joins the call. After you hang up: executive summary, owners on every action, and a Gmail draft you send yourself.",
    points: [
      "Live transcript with speaker diarization",
      "Consent reminder based on jurisdiction",
      "Share, export, or hard-delete a meeting",
      "Notes do not consume chat credits",
    ],
  },
  chat: {
    slug: "chat",
    title: "Ask anything about your work",
    eyebrow: "Chat",
    description:
      "Retrieval over pgvector plus keyword search. Answers come with clickable source pills that open the originating memory item — a call, an email, a slide you had on screen.",
    points: [
      "Streaming answers",
      "Sources you can click",
      "Quick, Default, and Max modes",
      "Web, desktop, and iPhone",
    ],
  },
  routines: {
    slug: "routines",
    title: "Routines that already know the clients",
    eyebrow: "Routines",
    description:
      "Describe a routine in natural language, pick sources, and deliver to the app, email, or iMessage. The default Morning Brief runs weekdays at 7:00 AM.",
    points: [
      "Natural-language builder",
      "Cron-style runner with retries",
      "Run history you can inspect",
      "Plan limits enforced on the server",
    ],
  },
  hover: {
    slug: "hover",
    title: "Talking points for the slide you are on",
    eyebrow: "Hover",
    description:
      "Double-tap Option on Mac or Alt on Windows. Hover reads on-screen text through accessibility and OCR, discards pixels in memory, and never writes images to disk.",
    points: [
      "Global shortcut",
      "Active-app grouping",
      "Password managers masked by default",
      "User-defined blocklist",
    ],
  },
  memory: {
    slug: "memory",
    title: "Your memory stays yours",
    eyebrow: "Memory",
    description:
      "A timeline of what Futurehuman saw, heard, and read. Filter by date, app, or project. Pause capture. Delete an item, a range, or everything — hard delete, not a recycle bin.",
    points: [
      "Row-level isolation per user",
      "Embeddings for semantic search",
      "Pause capture anytime",
      "GDPR export and delete",
    ],
  },
  integrations: {
    slug: "integrations",
    title: "Connect the apps you already live in",
    eyebrow: "Integrations",
    description:
      "Gmail, Google Calendar, Slack, Notion, Google Drive, and Outlook. Incremental sync, encrypted tokens, revoke in one click, minimal scopes.",
    points: [
      "Included on every plan, including Basic",
      "Token refresh handled for you",
      "MCP server on Plus and above",
      "Never auto-sends email",
    ],
  },
  mobile: {
    slug: "mobile",
    title: "On your phone and in Messages",
    eyebrow: "Mobile",
    description:
      "iOS app for routines, chat, and notifications. Link iMessage or WhatsApp when you want Futurehuman in the thread you already use.",
    points: ["Expo iOS first", "Push for Morning Brief", "Account linking", "WhatsApp Business optional"],
  },
  security: {
    slug: "security",
    title: "Built to be trusted with work",
    eyebrow: "Security",
    description:
      "Encryption in transit and at rest, per-user keys for tokens, audit logs, rate limits, and a SOC 2 evidence checklist in the Trust Center.",
    points: ["SOC 2 Type II program", "HIPAA BAA available", "GDPR/CCPA aligned", "Admins cannot read private memory"],
  },
} as const;

export type FeatureSlug = keyof typeof features;
