import { describe, expect, it } from "vitest";
import { profileSchema } from "@/lib/validation/profile";

describe("profileSchema", () => {
  it("accepts a seller profile with optional social proof", () => {
    const result = profileSchema.safeParse({
      displayName: "Aki Models",
      slug: "aki-models",
      location: "Taipei",
      facebookUrl: "https://facebook.com/aki",
      lineId: "aki-models",
      bio: "1:64 and Mini GT seller focused on clean boxes."
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsafe seller slugs", () => {
    const result = profileSchema.safeParse({
      displayName: "Aki Models",
      slug: "Aki Models!",
      facebookUrl: "",
      bio: ""
    });

    expect(result.success).toBe(false);
  });
});
