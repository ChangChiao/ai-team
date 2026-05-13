import Link from "next/link";
import { DashboardListingTable } from "@/components/dashboard-listing-table";
import { getCurrentSellerListings } from "@/lib/data/marketplace";

export default async function DashboardListingsPage() {
  const listingResults = await getCurrentSellerListings();
  const listings = listingResults.map(({ listing }) => listing);

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Listings</p>
        <h1>Manage inventory status.</h1>
        <p className="muted">Keep availability accurate so buyers do not chase sold or reserved cars.</p>
      </section>
      <div className="section-header">
        <div>
          <h2>{listings.length} seller listings</h2>
          <p className="muted">Drafts and archived listings stay visible here, but not in public browse.</p>
        </div>
        <Link className="button" href="/dashboard/listings/new">
          Add listing
        </Link>
      </div>
      <DashboardListingTable listings={listings} />
    </>
  );
}
