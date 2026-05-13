"use client";

import { useActionState } from "react";
import {
  confirmTransactionAction,
  type ConfirmTransactionState
} from "@/app/transactions/confirm/[token]/actions";

const initialState: ConfirmTransactionState = {};

export function ConfirmTransactionForm({ disabled, token }: { disabled?: boolean; token: string }) {
  const [state, formAction, pending] = useActionState(confirmTransactionAction, initialState);

  return (
    <form action={formAction} className="form-grid">
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <div className="empty-state" role="alert">
          <h3>Could not confirm</h3>
          <p className="muted">{state.error}</p>
        </div>
      ) : null}
      {state.success ? (
        <div className="empty-state" role="status">
          <h3>Confirmed</h3>
          <p className="muted">{state.success}</p>
        </div>
      ) : null}
      <button className="button" type="submit" disabled={disabled || pending}>
        {pending ? "Confirming..." : disabled ? "Cannot confirm" : "Confirm transaction"}
      </button>
    </form>
  );
}
