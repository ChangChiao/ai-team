import { EmptyState } from "@/components/empty-state";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/mock-data";

export default function ListingsPage() {
  const visibleListings = listings.filter((listing) => listing.status !== "sold");

  return (
    <div className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">Browse</p>
        <h1>Model car listings</h1>
        <p className="muted">Search by brand, scale, model, and seller signal. Sold listings stay out of the default browse view.</p>
      </section>

      <div className="layout-two-col">
        <aside className="panel" aria-label="Listing filters">
          <h2>Filters</h2>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <label className="field">
              <span>Search</span>
              <input className="input" placeholder="Nissan, Tomica, R34..." />
            </label>
            <label className="field">
              <span>Brand</span>
              <select className="select" defaultValue="">
                <option value="">All brands</option>
                <option>Mini GT</option>
                <option>Tomica Limited Vintage</option>
                <option>Hot Wheels</option>
              </select>
            </label>
            <label className="field">
              <span>Scale</span>
              <select className="select" defaultValue="">
                <option value="">All scales</option>
                <option>1:64</option>
                <option>1:43</option>
              </select>
            </label>
            <label className="field">
              <span>Mode</span>
              <select className="select" defaultValue="">
                <option value="">Sale and trade</option>
                <option>Sale</option>
                <option>Trade</option>
              </select>
            </label>
          </div>
        </aside>

        <section aria-labelledby="results-heading">
          <div className="section-header" style={{ marginTop: 0 }}>
            <div>
              <h2 id="results-heading">{visibleListings.length} listings</h2>
              <p className="muted">Newest first</p>
            </div>
            <select className="select" aria-label="Sort listings" defaultValue="newest" style={{ maxWidth: 180 }}>
              <option value="newest">Newest first</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
            </select>
          </div>
          {visibleListings.length > 0 ? (
            <div className="listing-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              {visibleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState title="No matching cars yet" body="Try fewer filters, or browse the newest listings." actionHref="/listings" actionLabel="Clear filters" />
          )}
        </section>
      </div>
    </div>
  );
}
