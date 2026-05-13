import { ListingForm } from "@/components/listing-form";

export default function NewListingPage() {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Add listing</p>
        <h1>Publish a model car listing buyers can inspect fast.</h1>
        <p className="muted">Photos first, then model identity, condition, price, and contact method.</p>
      </section>

      <ListingForm />
    </>
  );
}
