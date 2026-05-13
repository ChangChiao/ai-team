export default function ProfilePage() {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Profile</p>
        <h1>Seller identity buyers can inspect.</h1>
        <p className="muted">Keep social proof optional. Do not overclaim verification.</p>
      </section>
      <form className="panel form-grid">
        <div className="field-grid">
          <label className="field">
            <span>Display name</span>
            <input className="input" defaultValue="Aki Models" />
          </label>
          <label className="field">
            <span>Seller URL</span>
            <input className="input" defaultValue="aki-models" />
          </label>
          <label className="field">
            <span>Location</span>
            <input className="input" defaultValue="Taipei" />
          </label>
          <label className="field">
            <span>Optional Facebook URL</span>
            <input className="input" defaultValue="https://facebook.com" />
          </label>
        </div>
        <label className="field">
          <span>Bio</span>
          <textarea className="textarea" defaultValue="1:64 and Mini GT seller focused on clean boxes, clear photos, and fast status updates." />
        </label>
        <button className="button" type="button">
          Save profile
        </button>
      </form>
    </>
  );
}
