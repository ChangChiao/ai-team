import { describe, expect, it } from "vitest";
import {
  confirmationTokensMatch,
  generateConfirmationToken,
  hashConfirmationToken
} from "@/lib/transactions/token";

describe("transaction confirmation tokens", () => {
  it("generates non-trivial one-time tokens", () => {
    const token = generateConfirmationToken();

    expect(token.length).toBeGreaterThanOrEqual(32);
    expect(generateConfirmationToken()).not.toBe(token);
  });

  it("matches raw tokens against stored hashes", () => {
    const token = generateConfirmationToken();
    const hash = hashConfirmationToken(token);

    expect(hash).not.toBe(token);
    expect(confirmationTokensMatch(token, hash)).toBe(true);
    expect(confirmationTokensMatch("wrong-token", hash)).toBe(false);
  });
});
