export const pricingTiers = [
  {
    id: "basic",
    name: "Basic",
    monthly: 0,
    annual: 0,
    blurb: "For trying it on your real work",
    cta: "Start free",
    plan: "BASIC" as const,
    features: [
      "Daily usage credits for chats and routines",
      "25 meeting notes in total",
      "5 routines",
      "2 Max mode messages a day",
      "Gmail, Calendar, Drive, Outlook, Slack, Notion",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 20,
    annual: 17,
    blurb: "For your everyday work",
    cta: "Start 14-day trial",
    plan: "PLUS" as const,
    highlighted: true,
    features: [
      "Unlimited meeting notes",
      "Up to 100 routines",
      "Monthly usage credits + packs that never expire",
      "Max mode on your credits",
      "Futurehuman MCP for other AI apps",
    ],
  },
  {
    id: "power",
    name: "Power",
    monthly: 50,
    annual: 42.5,
    blurb: "More usage for daily routines",
    cta: "Start Power",
    plan: "POWER" as const,
    features: [
      "Everything in Plus",
      "Twice the monthly credits",
      "Lighter mode when credits run out",
      "Priority for long chats",
    ],
  },
] as const;

export const faqs = [
  {
    q: "What does Futurehuman learn from?",
    a: "The Mac and Windows app learns from what is on your screen (text only), takes notes in meetings without a bot, and reads the apps you connect. You can pause, block apps, or hard-delete memory at any time.",
  },
  {
    q: "Does a bot join my meetings?",
    a: "No. Capture is local through the desktop app. By default it asks before taking notes and reminds you to get consent from people on the call.",
  },
  {
    q: "Does Futurehuman send email for me?",
    a: "No. It writes drafts. Send to attendees saves a recap as a Gmail draft. It never sends on its own.",
  },
  {
    q: "Can my team see my notes?",
    a: "No. Admins manage seats and billing. They cannot open anyone’s chats, meeting notes, or memory. Teammates see only what you add to a shared project.",
  },
  {
    q: "Is there a free trial?",
    a: "Plus includes a 14-day trial. Basic is free with no card. When the trial ends, Plus continues unless you cancel in Settings → Subscription.",
  },
  {
    q: "Which plans include MCP?",
    a: "Plus, Power, Pro, and Enterprise. External clients query your memory with per-token permissions. Each search uses credits.",
  },
];
