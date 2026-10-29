import { describe, expect, it } from "vitest";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  os: z.enum(["mac", "windows"]).default("mac"),
});

describe("download payload", () => {
  it("accepts a work email", () => {
    expect(schema.parse({ email: "jordan@acme.com", os: "mac" }).os).toBe("mac");
  });
  it("rejects junk", () => {
    expect(() => schema.parse({ email: "nope" })).toThrow();
  });
});
