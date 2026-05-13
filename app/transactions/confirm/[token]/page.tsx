import Link from "next/link";
import { ConfirmTransactionForm } from "@/components/confirm-transaction-form";
import { getTransactionConfirmationByToken } from "@/lib/data/transactions";

export default async function ConfirmTransactionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const confirmation = await getTransactionConfirmationByToken(token);
  const isMissing = !confirmation;
  const isExpired = confirmation?.status === "expired";
  const isConfirmed = confirmation?.status === "confirmed";
  const isDisabled = isMissing || isExpired || isConfirmed;

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <section className="panel form-grid">
        <p className="eyebrow">Transaction confirmation</p>
        <h1 style={{ fontSize: 40 }}>
          {isMissing ? "This link is not valid" : isExpired ? "This confirmation link expired" : isConfirmed ? "Already confirmed" : "Confirm completed transaction"}
        </h1>
        <p className="muted">
          This confirms the transaction happened. It does not rate the seller, handle payment issues, or provide buyer protection.
        </p>
        <dl className="detail-list">
          <div className="detail-row">
            <dt>Listing</dt>
            <dd>{confirmation?.listingTitle ?? "Unknown listing"}</dd>
          </div>
          <div className="detail-row">
            <dt>Seller</dt>
            <dd>{confirmation?.sellerName ?? "Unknown seller"}</dd>
          </div>
          <div className="detail-row">
            <dt>Type</dt>
            <dd>{confirmation?.transactionType ?? "Unknown"}</dd>
          </div>
        </dl>
        {isExpired || isMissing ? (
          <Link className="button secondary" href={confirmation ? `/sellers/${confirmation.sellerSlug}` : "/listings"}>
            View seller profile
          </Link>
        ) : (
          <ConfirmTransactionForm disabled={isDisabled} token={token} />
        )}
      </section>
    </div>
  );
}
