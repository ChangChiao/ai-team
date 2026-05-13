"use client";

import { useActionState } from "react";
import {
  createTransactionAction,
  type CreateTransactionState
} from "@/app/dashboard/transactions/actions";
import type { Listing } from "@/lib/types";

const initialState: CreateTransactionState = {};

export function CreateTransactionForm({ listing }: { listing: Listing }) {
  const [state, formAction, pending] = useActionState(createTransactionAction, initialState);

  if (listing.status === "sold") {
    return <span className="status-badge sold">Sold</span>;
  }

  return (
    <form action={formAction} className="form-grid" style={{ gap: 8, minWidth: 260 }}>
      <input type="hidden" name="listingId" value={listing.id} />
      <div className="chip-row" style={{ gap: 6 }}>
        <select className="select" name="transactionType" defaultValue={listing.listingMode === "trade" ? "exchange" : "sale"} aria-label={`Transaction type for ${listing.title}`}>
          <option value="sale">Sale</option>
          <option value="exchange">Exchange</option>
        </select>
        <input className="input" name="buyerEmail" type="email" placeholder="buyer email optional" aria-label={`Buyer email for ${listing.title}`} />
        <button className="button secondary" type="submit" disabled={pending}>
          {pending ? "Creating..." : "Confirm link"}
        </button>
      </div>
      {state.error ? <p style={{ color: "var(--color-danger)" }}>{state.error}</p> : null}
      {state.success ? <p className="muted">{state.success}</p> : null}
      {state.confirmationUrl ? (
        <label className="field">
          <span>Confirmation URL</span>
          <input className="input" readOnly value={state.confirmationUrl} onFocus={(event) => event.currentTarget.select()} />
        </label>
      ) : null}
    </form>
  );
}
