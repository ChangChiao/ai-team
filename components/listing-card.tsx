import Link from "next/link";
import { formatListingMode, formatPrice, formatStatus, statusClass } from "@/lib/format";
import type { Listing, Seller } from "@/lib/types";

export function ListingCard({ listing, seller }: { listing: Listing; seller?: Seller }) {
  return (
    <article className="listing-card">
      <Link href={`/listings/${listing.id}`} aria-label={`View ${listing.title}`}>
        <div className="photo-frame">
          <img src={listing.imageUrl} alt={`${listing.title} model car`} />
          <span className={statusClass(listing.status)}>{formatStatus(listing.status)}</span>
        </div>
        <div className="card-body">
          <h3 className="card-title">{listing.title}</h3>
          <p className="card-price">
            {formatPrice(listing.price, listing.currency)} · {formatListingMode(listing.listingMode)}
          </p>
          <p className="meta-row">
            <span>{listing.brand}</span>
            <span>·</span>
            <span>{listing.scale}</span>
            <span>·</span>
            <span>Box: {listing.boxCondition}</span>
          </p>
          <p className="meta-row">
            <span>{seller?.displayName ?? "Unknown seller"}</span>
            <span>·</span>
            <span>{seller?.confirmedTransactions ?? 0} confirmed tx</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
