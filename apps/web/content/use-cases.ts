export const useCases = {
  sales: {
    slug: "sales",
    title: "Sales",
    description:
      "Walk into every call knowing the last promise, the open quote, and what finance still owes. Futurehuman drafts the follow-up from the transcript.",
  },
  founders: {
    slug: "founders",
    title: "Founders",
    description:
      "Context switches all day. Hover over the deck, ask what the customer agreed last Tuesday, and keep the Morning Brief pointed at the accounts that matter.",
  },
  consultants: {
    slug: "consultants",
    title: "Consultants",
    description:
      "Each client is a project. Filter memory by account, keep notes private from your firm unless you share them, and ship recaps without a bot on the Zoom.",
  },
  product: {
    slug: "product",
    title: "Product",
    description:
      "Discovery calls, Slack threads, and the spec you had open this morning — one chat that can tell you what is still open before standup.",
  },
  recruiting: {
    slug: "recruiting",
    title: "Recruiting",
    description:
      "Debrief from the conversation, not from memory. Action items name who owns the next loop. Nothing sends without you.",
  },
} as const;
