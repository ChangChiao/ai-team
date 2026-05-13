export type TransactionStatus = "pending_buyer_confirmation" | "confirmed" | "expired" | "cancelled";

export function getEffectiveTransactionStatus({
  expiresAt,
  now = Date.now(),
  status
}: {
  expiresAt: string;
  now?: number;
  status: TransactionStatus;
}): TransactionStatus {
  if (status === "pending_buyer_confirmation" && new Date(expiresAt).getTime() < now) {
    return "expired";
  }

  return status;
}

export function canConfirmTransaction(status: TransactionStatus) {
  return status === "pending_buyer_confirmation";
}
