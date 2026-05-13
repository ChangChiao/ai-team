import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <section className="page-heading">
        <p className="eyebrow">Seller access</p>
        <h1>Sign in to manage listings and transaction history.</h1>
        <p className="muted">Use a magic link first. Passwords can wait until real seller usage requires them.</p>
      </section>
      <LoginForm />
    </div>
  );
}
