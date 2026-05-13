import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { getCurrentSellerListings } from "@/lib/data/marketplace";

export default async function DashboardPage() {
  const listingResults = await getCurrentSellerListings();
  const activeListings = listingResults.filter(({ listing }) => listing.status === "available");
  const reservedListings = listingResults.filter(({ listing }) => listing.status === "reserved");

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Today</p>
        <h1>Keep inventory current.</h1>
        <p className="muted">Update status, add listings, and send confirmation links after completed deals.</p>
      </section>

      <section className="panel">
        <div className="chip-row">
          <span className="chip">{activeListings.length} active</span>
          <span className="chip">{reservedListings.length} reserved</span>
          <span className="chip">2 confirmed this month</span>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>Listings needing action</h2>
            <p className="muted">Reserved items should be marked sold or returned to available.</p>
          </div>
          <Link className="button" href="/dashboard/listings/new">
            Add listing
          </Link>
        </div>
        <div className="listing-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          {reservedListings.concat(activeListings).slice(0, 2).map(({ listing, seller }) => (
            <ListingCard key={listing.id} listing={listing} seller={seller} />
          ))}
        </div>
      </section>
    </>
  );
}
