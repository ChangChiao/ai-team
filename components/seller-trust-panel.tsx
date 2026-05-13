import Link from "next/link";
import type { Seller } from "@/lib/types";

export function SellerTrustPanel({ seller }: { seller?: Seller }) {
  if (!seller) {
    return (
      <section className="panel" aria-labelledby="seller-heading">
        <h2 id="seller-heading">Seller</h2>
        <p className="muted">Seller profile is unavailable.</p>
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="seller-heading">
      <p className="eyebrow">Seller</p>
      <h2 id="seller-heading">{seller.displayName}</h2>
      <div className="seller-row">
        <span>Confirmed transactions</span>
        <strong>{seller.confirmedTransactions}</strong>
      </div>
      <div className="seller-row">
        <span>Active listings</span>
        <strong>{seller.activeListings}</strong>
      </div>
      <div className="seller-row">
        <span>Location</span>
        <strong>{seller.location}</strong>
      </div>
      <Link className="button secondary" href={`/sellers/${seller.slug}`}>
        View seller profile
      </Link>
    </section>
  );
}
