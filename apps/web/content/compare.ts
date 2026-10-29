export const comparisons = {
  otter: {
    slug: "otter",
    competitor: "Otter",
    title: "Futurehuman vs Otter",
    summary:
      "Otter is a meeting notetaker. Futurehuman is work memory: meetings without a bot, screen context, and chat that already knows the backstory.",
    rows: [
      ["Bot in the call", "No", "Yes, typically"],
      ["Screen context", "Yes, on desktop", "No"],
      ["Chat over email + Slack + notes", "Yes", "Limited"],
      ["Morning Brief", "Yes", "No"],
      ["MCP for other AI apps", "Plus and above", "No"],
    ],
  },
  fathom: {
    slug: "fathom",
    competitor: "Fathom",
    title: "Futurehuman vs Fathom",
    summary:
      "Fathom records Zoom/Meet/Teams with a bot and makes clips. Futurehuman stays out of the lobby and keeps working after the call — drafts, routines, and memory.",
    rows: [
      ["Bot joins", "Never", "Yes"],
      ["Action items with owners", "Yes", "Yes"],
      ["Gmail draft, never auto-send", "Yes", "Manual"],
      ["Works from screen + apps", "Yes", "Meetings only"],
      ["Hover overlay", "Mac + Windows", "No"],
    ],
  },
  fireflies: {
    slug: "fireflies",
    competitor: "Fireflies",
    title: "Futurehuman vs Fireflies",
    summary:
      "Fireflies is a meeting bot for teams. Futurehuman is personal by default: teammates never see your chats or notes unless you put them in a shared project.",
    rows: [
      ["Team admins read your notes", "No", "Often yes"],
      ["Botless capture", "Yes", "No"],
      ["Personal memory timeline", "Yes", "Conversation-centric"],
      ["Hard delete by range", "Yes", "Varies"],
    ],
  },
  chatgpt: {
    slug: "chatgpt",
    competitor: "ChatGPT",
    title: "Futurehuman vs ChatGPT",
    summary:
      "ChatGPT is a general assistant. Futurehuman already has your meetings, screen, and connected apps, so you do not paste the backstory.",
    rows: [
      ["Knows yesterday's call", "Yes", "Only if you paste it"],
      ["Botless meeting notes", "Yes", "No"],
      ["Routines over your inbox", "Yes", "GPTs / scheduled tasks, generic"],
      ["Your data is the product", "Never sold", "Used to train unless opted out"],
    ],
  },
} as const;
