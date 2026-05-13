import Link from "next/link";

export default async function ConfirmTransactionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const isExpired = token === "expired";
  const isConfirmed = token === "confirmed";

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <section className="panel form-grid">
        <p className="eyebrow">Transaction confirmation</p>
        <h1 style={{ fontSize: 40 }}>
          {isExpired ? "This confirmation link expired" : isConfirmed ? "Already confirmed" : "Confirm completed transaction"}
        </h1>
        <p className="muted">
          This confirms the transaction happened. It does not rate the seller, handle payment issues, or provide buyer protection.
        </p>
        <dl className="detail-list">
          <div className="detail-row">
            <dt>Listing</dt>
            <dd>Mini GT Nissan Skyline GT-R R34 Bayside Blue</dd>
          </div>
          <div className="detail-row">
            <dt>Seller</dt>
            <dd>Aki Models</dd>
          </div>
          <div className="detail-row">
            <dt>Type</dt>
            <dd>Sale</dd>
          </div>
        </dl>
        {isExpired ? (
          <Link className="button secondary" href="/sellers/aki-models">
            View seller profile
          </Link>
        ) : (
          <button className="button" type="button">
            {isConfirmed ? "Confirmed" : "Confirm transaction"}
          </button>
        )}
      </section>
    </div>
  );
}
