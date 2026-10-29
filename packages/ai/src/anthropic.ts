import Anthropic from "@anthropic-ai/sdk";

function client() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey: key });
}

export async function complete(system: string, user: string): Promise<string> {
  const result = await client().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = result.content[0];
  return block && block.type === "text" ? block.text : "";
}

export async function streamComplete(
  system: string,
  user: string,
  onDelta: (text: string) => void,
): Promise<string> {
  const stream = client().messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: user }],
  });

  let full = "";
  stream.on("text", (delta) => {
    full += delta;
    onDelta(delta);
  });
  await stream.finalMessage();
  return full;
}
