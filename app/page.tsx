import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { ListingCard } from "@/components/listing-card";
import { getFeaturedSellers, getLatestListings } from "@/lib/data/marketplace";

export default async function HomePage() {
  const latestListings = await getLatestListings(4);
  const sellers = await getFeaturedSellers();

  return (
    <div className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">Collector marketplace</p>
        <h1>Find model cars from sellers with visible transaction history.</h1>
        <p className="muted">
          Browse structured listings, inspect condition details, and check confirmed seller transactions before you contact.
        </p>
      </section>

      <section className="search-panel" aria-label="Search listings">
        <div className="search-row">
          <label className="field">
            <span className="eyebrow">Search</span>
            <input className="input" placeholder="Brand, model, scale..." />
          </label>
          <Link className="button" href="/listings">
            Search
          </Link>
        </div>
        <div className="chip-row" aria-label="Quick filters">
          <Link className="chip" href="/listings?brand=Mini%20GT">
            Mini GT
          </Link>
          <Link className="chip" href="/listings?brand=Tomica">
            Tomica
          </Link>
          <Link className="chip" href="/listings?scale=1%3A64">
            1:64
          </Link>
          <Link className="chip" href="/listings?mode=trade">
            Trade
          </Link>
        </div>
      </section>

      <section aria-labelledby="latest-heading">
        <div className="section-header">
          <div>
            <h2 id="latest-heading">Latest listings</h2>
            <p className="muted">Photo-led listings with condition and seller transaction counts.</p>
          </div>
          <Link className="button secondary" href="/listings">
            View all
          </Link>
        </div>
        {latestListings.length > 0 ? (
          <div className="listing-grid">
            {latestListings.map(({ listing, seller }) => (
              <ListingCard key={listing.id} listing={listing} seller={seller} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Be the first seller with a public model car inventory"
            body="List 5 cars, share your seller page, and start building confirmed transaction history."
            actionHref="/dashboard/listings/new"
            actionLabel="Create seller profile"
          />
        )}
      </section>

      <section aria-labelledby="seller-heading">
        <div className="section-header">
          <div>
            <h2 id="seller-heading">Sellers with confirmed transactions</h2>
            <p className="muted">Raw transaction counts only. No overclaimed trust badges.</p>
          </div>
        </div>
        <div className="panel">
          {sellers.map((seller) => (
            <div className="seller-row" key={seller.slug}>
              <div>
                <strong>{seller.displayName}</strong>
                <p className="muted">{seller.location} · joined {seller.joinedAt}</p>
              </div>
              <Link className="button secondary" href={`/sellers/${seller.slug}`}>
                {seller.confirmedTransactions} confirmed tx
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
