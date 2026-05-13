"use client";

import { useActionState } from "react";
import { saveProfileAction, type ProfileState } from "@/app/dashboard/profile/actions";
import type { Seller } from "@/lib/types";

const initialState: ProfileState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p style={{ color: "var(--color-danger)" }}>{errors[0]}</p>;
}

export function ProfileForm({ seller }: { seller?: Seller }) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initialState);

  return (
    <form action={formAction} className="panel form-grid">
      {state.formError ? (
        <div className="empty-state" role="alert">
          <h3>Profile not saved</h3>
          <p className="muted">{state.formError}</p>
        </div>
      ) : null}
      {state.success ? (
        <div className="empty-state" role="status">
          <h3>Profile saved</h3>
          <p className="muted">{state.success}</p>
        </div>
      ) : null}
      <div className="field-grid">
        <label className="field">
          <span>Display name</span>
          <input className="input" name="displayName" defaultValue={seller?.displayName ?? ""} placeholder="Aki Models" />
          <FieldError errors={state.fieldErrors?.displayName} />
        </label>
        <label className="field">
          <span>Seller URL</span>
          <input className="input" name="slug" defaultValue={seller?.slug ?? ""} placeholder="aki-models" />
          <FieldError errors={state.fieldErrors?.slug} />
        </label>
        <label className="field">
          <span>Location</span>
          <input className="input" name="location" defaultValue={seller?.location ?? ""} placeholder="Taipei" />
          <FieldError errors={state.fieldErrors?.location} />
        </label>
        <label className="field">
          <span>Optional Facebook URL</span>
          <input className="input" name="facebookUrl" defaultValue={seller?.facebookUrl ?? ""} placeholder="https://facebook.com/..." />
          <FieldError errors={state.fieldErrors?.facebookUrl} />
        </label>
      </div>
      <label className="field">
        <span>LINE ID</span>
        <input className="input" name="lineId" placeholder="aki-models" />
        <FieldError errors={state.fieldErrors?.lineId} />
      </label>
      <label className="field">
        <span>Bio</span>
        <textarea className="textarea" name="bio" defaultValue={seller?.bio ?? ""} placeholder="1:64 and Mini GT seller focused on clean boxes and clear photos." />
        <FieldError errors={state.fieldErrors?.bio} />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
