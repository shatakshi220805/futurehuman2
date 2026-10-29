import { describe, expect, it } from "vitest";
import { PLAN_LIMITS } from "@futurehuman/db";

describe("server plan limits", () => {
  it("Basic cannot use MCP", () => {
    expect(PLAN_LIMITS.BASIC.mcp).toBe(false);
  });
  it("Plus meeting notes are unlimited", () => {
    expect(PLAN_LIMITS.PLUS.meetingNotes).toBeNull();
  });
});
