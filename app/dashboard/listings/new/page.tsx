export default function NewListingPage() {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Add listing</p>
        <h1>Publish a model car listing buyers can inspect fast.</h1>
        <p className="muted">Photos first, then model identity, condition, price, and contact method.</p>
      </section>

      <form className="panel form-grid">
        <section className="form-grid" aria-labelledby="photos-heading">
          <h2 id="photos-heading">Photos</h2>
          <label className="field">
            <span>Listing photos</span>
            <input className="input" type="file" multiple accept="image/*" />
          </label>
          <p className="muted">Upload up to 8 photos. Use daylight photos and include box corners if condition matters.</p>
        </section>

        <section className="form-grid" aria-labelledby="identity-heading">
          <h2 id="identity-heading">Model identity</h2>
          <div className="field-grid">
            <label className="field">
              <span>Title</span>
              <input className="input" placeholder="Mini GT Nissan Skyline GT-R R34 Bayside Blue" />
            </label>
            <label className="field">
              <span>Brand</span>
              <input className="input" placeholder="Mini GT" />
            </label>
            <label className="field">
              <span>Model name</span>
              <input className="input" placeholder="Nissan Skyline GT-R R34" />
            </label>
            <label className="field">
              <span>Scale</span>
              <select className="select" defaultValue="1:64">
                <option>1:64</option>
                <option>1:43</option>
                <option>1:18</option>
              </select>
            </label>
          </div>
        </section>

        <section className="form-grid" aria-labelledby="condition-heading">
          <h2 id="condition-heading">Condition</h2>
          <div className="field-grid">
            <label className="field">
              <span>Car condition</span>
              <select className="select" defaultValue="Excellent">
                <option>Sealed</option>
                <option>Near mint</option>
                <option>Excellent</option>
                <option>Used</option>
              </select>
            </label>
            <label className="field">
              <span>Box condition</span>
              <input className="input" placeholder="Good, light corner wear" />
            </label>
          </div>
          <label className="field">
            <span>Defects or missing parts</span>
            <textarea className="textarea" placeholder="No missing parts. Small mark on outer acrylic case." />
          </label>
        </section>

        <section className="form-grid" aria-labelledby="price-heading">
          <h2 id="price-heading">Price and contact</h2>
          <div className="field-grid">
            <label className="field">
              <span>Listing mode</span>
              <select className="select" defaultValue="sale_or_trade">
                <option value="sale">Sale</option>
                <option value="trade">Trade</option>
                <option value="sale_or_trade">Sale or trade</option>
              </select>
            </label>
            <label className="field">
              <span>Price</span>
              <input className="input" inputMode="numeric" placeholder="1200" />
            </label>
            <label className="field">
              <span>Location</span>
              <input className="input" placeholder="Taipei" />
            </label>
            <label className="field">
              <span>Contact method</span>
              <input className="input" placeholder="LINE: aki-models" />
            </label>
          </div>
        </section>

        <div className="chip-row">
          <button className="button secondary" type="button">
            Save draft
          </button>
          <button className="button" type="button">
            Publish listing
          </button>
        </div>
      </form>
    </>
  );
}
