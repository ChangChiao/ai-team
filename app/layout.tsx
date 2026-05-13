import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModelTrade",
  description: "A collector-grade marketplace for model cars with visible transaction history."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="ModelTrade home">
            ModelTrade
          </Link>
          <nav className="top-nav" aria-label="Primary navigation">
            <Link href="/listings">Browse</Link>
            <Link href="/dashboard/listings/new">Sell</Link>
            <Link href="/sellers/aki-models">Sellers</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
