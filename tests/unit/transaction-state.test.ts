import { describe, expect, it } from "vitest";
import { canConfirmTransaction, getEffectiveTransactionStatus } from "@/lib/transactions/state";

describe("transaction state", () => {
  it("treats expired pending transactions as expired", () => {
    expect(
      getEffectiveTransactionStatus({
        expiresAt: "2026-05-01T00:00:00.000Z",
        now: new Date("2026-05-02T00:00:00.000Z").getTime(),
        status: "pending_buyer_confirmation"
      })
    ).toBe("expired");
  });

  it("does not change confirmed transactions based on expiry", () => {
    expect(
      getEffectiveTransactionStatus({
        expiresAt: "2026-05-01T00:00:00.000Z",
        now: new Date("2026-05-02T00:00:00.000Z").getTime(),
        status: "confirmed"
      })
    ).toBe("confirmed");
  });

  it("only allows pending transactions to be confirmed", () => {
    expect(canConfirmTransaction("pending_buyer_confirmation")).toBe(true);
    expect(canConfirmTransaction("confirmed")).toBe(false);
    expect(canConfirmTransaction("expired")).toBe(false);
    expect(canConfirmTransaction("cancelled")).toBe(false);
  });
});
