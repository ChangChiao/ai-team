import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell dashboard-layout">
      <aside className="panel">
        <p className="eyebrow">Seller workspace</p>
        <nav className="side-nav" aria-label="Seller dashboard">
          <Link href="/dashboard" aria-current="page">
            Overview
          </Link>
          <Link href="/dashboard/listings">Listings</Link>
          <Link href="/dashboard/listings/new">Add listing</Link>
          <Link href="/dashboard/transactions">Transactions</Link>
          <Link href="/dashboard/profile">Profile</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
