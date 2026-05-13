import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { getSellerProfile } from "@/lib/data/marketplace";

export default async function SellerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getSellerProfile(slug);

  if (!result) notFound();

  const { seller, listings: sellerListings, transactions: sellerTransactions } = result;

  return (
    <div className="page-shell">
      <section className="panel">
        <p className="eyebrow">Seller profile</p>
        <div className="section-header" style={{ marginTop: 0 }}>
          <div>
            <h1>{seller.displayName}</h1>
            <p className="muted">{seller.bio}</p>
          </div>
          <button className="button secondary" type="button">
            Share profile
          </button>
        </div>
        <div className="chip-row">
          <span className="chip">{seller.confirmedTransactions} confirmed transactions</span>
          <span className="chip">{seller.activeListings} active listings</span>
          <span className="chip">{seller.location}</span>
          <span className="chip">Joined {seller.joinedAt}</span>
        </div>
      </section>

      <section aria-labelledby="active-listings">
        <div className="section-header">
          <h2 id="active-listings">Active listings</h2>
          <Link className="button secondary" href="/listings">
            Browse marketplace
          </Link>
        </div>
        <div className="listing-grid">
          {sellerListings.map(({ listing, seller: listingSeller }) => (
            <ListingCard key={listing.id} listing={listing} seller={listingSeller} />
          ))}
        </div>
      </section>

      <section className="panel" aria-labelledby="transaction-history">
        <h2 id="transaction-history">Confirmed transaction history</h2>
        {sellerTransactions.length > 0 ? (
          sellerTransactions.map((transaction) => (
            <div className="seller-row" key={transaction.id}>
              <div>
                <strong>{transaction.listingTitle}</strong>
                <p className="muted">{transaction.transactionType} · confirmed {transaction.confirmedAt}</p>
              </div>
              <span className="status-badge available">Confirmed</span>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ marginTop: 16 }}>
            <h3>No confirmed transactions yet</h3>
            <p className="muted">This seller can build history when buyers confirm completed transactions.</p>
          </div>
        )}
      </section>
    </div>
  );
}
