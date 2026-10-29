import { describe, expect, it } from "vitest";
import { PLAN_LIMITS } from "./limits";

describe("PLAN_LIMITS", () => {
  it("enforces Basic caps from the product spec", () => {
    expect(PLAN_LIMITS.BASIC.meetingNotes).toBe(25);
    expect(PLAN_LIMITS.BASIC.routines).toBe(5);
    expect(PLAN_LIMITS.BASIC.mcp).toBe(false);
  });

  it("unlocks Plus extras", () => {
    expect(PLAN_LIMITS.PLUS.meetingNotes).toBeNull();
    expect(PLAN_LIMITS.PLUS.routines).toBe(100);
    expect(PLAN_LIMITS.PLUS.mcp).toBe(true);
  });
});
