import { describe, expect, it } from "vitest";
import { chunkText } from "./chunk";

describe("chunkText", () => {
  it("returns empty for blank input", () => {
    expect(chunkText("   ")).toEqual([]);
  });

  it("keeps short text as one chunk", () => {
    expect(chunkText("hello work")).toEqual(["hello work"]);
  });

  it("splits long text with overlap", () => {
    const text = "a".repeat(50);
    const chunks = chunkText(text, 20, 5);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]?.length).toBe(20);
  });
});
