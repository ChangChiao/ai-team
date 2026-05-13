import Link from "next/link";
import { notFound } from "next/navigation";
import { SellerTrustPanel } from "@/components/seller-trust-panel";
import { formatListingMode, formatPrice, formatStatus, statusClass } from "@/lib/format";
import { getListing } from "@/lib/mock-data";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) notFound();

  return (
    <div className="page-shell">
      <p className="muted" style={{ marginBottom: 16 }}>
        <Link href="/listings">Listings</Link> / {listing.brand} / {listing.modelName}
      </p>
      <div className="layout-two-col">
        <section aria-label="Listing details">
          <div className="photo-frame" style={{ border: "1px solid var(--color-border)", borderRadius: 8 }}>
            <img src={listing.imageUrl} alt={`${listing.title} model car`} />
            <span className={statusClass(listing.status)}>{formatStatus(listing.status)}</span>
          </div>
          <section className="panel">
            <h2>Model details</h2>
            <dl className="detail-list">
              <div className="detail-row">
                <dt>Brand</dt>
                <dd>{listing.brand}</dd>
              </div>
              <div className="detail-row">
                <dt>Model</dt>
                <dd>{listing.modelName}</dd>
              </div>
              <div className="detail-row">
                <dt>Scale</dt>
                <dd>{listing.scale}</dd>
              </div>
              <div className="detail-row">
                <dt>Car condition</dt>
                <dd>{listing.carCondition}</dd>
              </div>
              <div className="detail-row">
                <dt>Box condition</dt>
                <dd>{listing.boxCondition}</dd>
              </div>
              <div className="detail-row">
                <dt>Defects</dt>
                <dd>{listing.defects}</dd>
              </div>
              <div className="detail-row">
                <dt>Delivery</dt>
                <dd>{listing.deliveryPreference}</dd>
              </div>
            </dl>
          </section>
        </section>

        <aside>
          <section className="panel">
            <p className="eyebrow">{formatListingMode(listing.listingMode)}</p>
            <h1 style={{ fontSize: 36 }}>{listing.title}</h1>
            <p className="card-price" style={{ fontSize: 28, marginTop: 16 }}>
              {formatPrice(listing.price, listing.currency)}
            </p>
            <p className="muted" style={{ margin: "8px 0 18px" }}>
              {listing.location} · {formatStatus(listing.status)}
            </p>
            <div className="form-grid">
              <a className="button" href={`mailto:${listing.contactMethod.includes("@") ? listing.contactMethod.replace("Email: ", "") : "seller@example.com"}`}>
                Contact seller
              </a>
              <button className="button secondary" type="button">
                Copy listing link
              </button>
            </div>
          </section>
          <SellerTrustPanel sellerSlug={listing.sellerSlug} />
        </aside>
      </div>
    </div>
  );
}
