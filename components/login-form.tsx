"use client";

import { useActionState } from "react";
import { sendMagicLinkAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLinkAction, initialState);

  return (
    <form action={formAction} className="panel form-grid">
      {state.error ? (
        <div className="empty-state" role="alert">
          <h3>Could not send link</h3>
          <p className="muted">{state.error}</p>
        </div>
      ) : null}
      {state.success ? (
        <div className="empty-state" role="status">
          <h3>Magic link sent</h3>
          <p className="muted">{state.success}</p>
        </div>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input className="input" name="email" type="email" placeholder="seller@example.com" required />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send sign-in link"}
      </button>
    </form>
  );
}
