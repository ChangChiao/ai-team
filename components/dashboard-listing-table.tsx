"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CreateTransactionForm } from "@/components/create-transaction-form";
import {
  updateListingStatusAction,
  updateListingVisibilityAction,
  type ListingManagementState
} from "@/app/dashboard/listings/actions";
import { formatPrice, formatStatus } from "@/lib/format";
import type { Listing } from "@/lib/types";

const initialState: ListingManagementState = {};

function StatusForm({ listing }: { listing: Listing }) {
  const [state, formAction, pending] = useActionState(updateListingStatusAction, initialState);

  return (
    <form action={formAction} className="chip-row" style={{ gap: 6 }}>
      <input type="hidden" name="listingId" value={listing.id} />
      <select className="select" name="status" defaultValue={listing.status} aria-label={`Status for ${listing.title}`}>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
      </select>
      <button className="button secondary" type="submit" disabled={pending}>
        Save
      </button>
      {state.error ? <p style={{ color: "var(--color-danger)" }}>{state.error}</p> : null}
      {state.success ? <p className="muted">{state.success}</p> : null}
    </form>
  );
}

function VisibilityForm({ listing }: { listing: Listing }) {
  const [state, formAction, pending] = useActionState(updateListingVisibilityAction, initialState);

  return (
    <form action={formAction} className="chip-row" style={{ gap: 6 }}>
      <input type="hidden" name="listingId" value={listing.id} />
      <input type="hidden" name="visibility" value={listing.visibility === "archived" ? "public" : "archived"} />
      <button className="button secondary" type="submit" disabled={pending}>
        {listing.visibility === "archived" ? "Restore" : "Archive"}
      </button>
      {state.error ? <p style={{ color: "var(--color-danger)" }}>{state.error}</p> : null}
      {state.success ? <p className="muted">{state.success}</p> : null}
    </form>
  );
}

export function DashboardListingTable({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <section className="empty-state">
        <h2>No listings yet</h2>
        <p className="muted">Create your first listing with photos, model details, condition, and contact method.</p>
        <Link className="button" href="/dashboard/listings/new">
          Add listing
        </Link>
      </section>
    );
  }

  return (
    <section className="panel" aria-label="Seller listings">
      {listings.map((listing) => (
        <article className="seller-row" key={listing.id}>
          <div style={{ minWidth: 0 }}>
            <strong>{listing.title}</strong>
            <p className="muted">
              {formatPrice(listing.price, listing.currency)} · {formatStatus(listing.status)} · {listing.visibility}
            </p>
          </div>
          <div className="chip-row" style={{ justifyContent: "flex-end" }}>
            <Link className="button secondary" href={`/listings/${listing.id}`}>
              View
            </Link>
            <StatusForm listing={listing} />
            <VisibilityForm listing={listing} />
            <CreateTransactionForm listing={listing} />
          </div>
        </article>
      ))}
    </section>
  );
}
