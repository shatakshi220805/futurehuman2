import { ChatPanel } from "@/components/app/chat-panel";

export default function AppHome() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Ask anything about your work</h1>
      <p className="mt-1 text-sm text-white/50">Answers cite the meeting, email, or screen they came from.</p>
      <ChatPanel />
    </div>
  );
}
