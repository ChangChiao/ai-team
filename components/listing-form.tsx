"use client";

import { useActionState } from "react";
import { createListingAction, type CreateListingState } from "@/app/dashboard/listings/new/actions";

const initialState: CreateListingState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p style={{ color: "var(--color-danger)" }}>{errors[0]}</p>;
}

export function ListingForm() {
  const [state, formAction, pending] = useActionState(createListingAction, initialState);

  return (
    <form action={formAction} className="panel form-grid">
      {state.formError ? (
        <div className="empty-state" role="alert">
          <h3>Listing not published</h3>
          <p className="muted">{state.formError}</p>
        </div>
      ) : null}
      {state.success ? (
        <div className="empty-state" role="status">
          <h3>Listing published</h3>
          <p className="muted">{state.success}</p>
        </div>
      ) : null}

      <section className="form-grid" aria-labelledby="photos-heading">
        <h2 id="photos-heading">Photos</h2>
        <label className="field">
          <span>Listing photos</span>
          <input className="input" name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" />
          <FieldError errors={state.fieldErrors?.photos} />
        </label>
        <p className="muted">Upload 1-8 photos. JPEG, PNG, or WebP. Each photo must be 6 MB or smaller.</p>
      </section>

      <section className="form-grid" aria-labelledby="identity-heading">
        <h2 id="identity-heading">Model identity</h2>
        <div className="field-grid">
          <label className="field">
            <span>Title</span>
            <input name="title" className="input" placeholder="Mini GT Nissan Skyline GT-R R34 Bayside Blue" />
            <FieldError errors={state.fieldErrors?.title} />
          </label>
          <label className="field">
            <span>Brand</span>
            <input name="brand" className="input" placeholder="Mini GT" />
            <FieldError errors={state.fieldErrors?.brand} />
          </label>
          <label className="field">
            <span>Model name</span>
            <input name="modelName" className="input" placeholder="Nissan Skyline GT-R R34" />
            <FieldError errors={state.fieldErrors?.modelName} />
          </label>
          <label className="field">
            <span>Scale</span>
            <select name="scale" className="select" defaultValue="1:64">
              <option>1:64</option>
              <option>1:43</option>
              <option>1:18</option>
            </select>
            <FieldError errors={state.fieldErrors?.scale} />
          </label>
        </div>
      </section>

      <section className="form-grid" aria-labelledby="condition-heading">
        <h2 id="condition-heading">Condition</h2>
        <div className="field-grid">
          <label className="field">
            <span>Car condition</span>
            <select name="carCondition" className="select" defaultValue="Excellent">
              <option>Sealed</option>
              <option>Near mint</option>
              <option>Excellent</option>
              <option>Used</option>
            </select>
            <FieldError errors={state.fieldErrors?.carCondition} />
          </label>
          <label className="field">
            <span>Box condition</span>
            <input name="boxCondition" className="input" placeholder="Good, light corner wear" />
          </label>
        </div>
        <label className="field">
          <span>Defects or missing parts</span>
          <textarea name="defects" className="textarea" placeholder="No missing parts. Small mark on outer acrylic case." />
        </label>
      </section>

      <section className="form-grid" aria-labelledby="price-heading">
        <h2 id="price-heading">Price and contact</h2>
        <div className="field-grid">
          <label className="field">
            <span>Listing mode</span>
            <select name="listingMode" className="select" defaultValue="sale_or_trade">
              <option value="sale">Sale</option>
              <option value="trade">Trade</option>
              <option value="sale_or_trade">Sale or trade</option>
            </select>
          </label>
          <label className="field">
            <span>Price</span>
            <input name="price" className="input" inputMode="numeric" placeholder="1200" />
            <FieldError errors={state.fieldErrors?.price} />
          </label>
          <label className="field">
            <span>Location</span>
            <input name="location" className="input" placeholder="Taipei" />
            <FieldError errors={state.fieldErrors?.location} />
          </label>
          <label className="field">
            <span>Contact method</span>
            <input name="contactMethod" className="input" placeholder="LINE: aki-models" />
            <FieldError errors={state.fieldErrors?.contactMethod} />
          </label>
        </div>
      </section>

      <div className="chip-row">
        <button className="button secondary" type="button">
          Save draft
        </button>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Publishing..." : "Publish listing"}
        </button>
      </div>
    </form>
  );
}
