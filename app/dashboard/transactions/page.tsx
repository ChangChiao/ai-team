import { transactions } from "@/lib/mock-data";

export default function TransactionsPage() {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Transactions</p>
        <h1>Confirmed history builds seller trust.</h1>
        <p className="muted">MVP confirmation proves a transaction happened. It is not a rating or buyer protection claim.</p>
      </section>
      <section className="panel">
        {transactions.map((transaction) => (
          <div className="seller-row" key={transaction.id}>
            <div>
              <strong>{transaction.listingTitle}</strong>
              <p className="muted">{transaction.transactionType} · {transaction.status}</p>
            </div>
            <span className="status-badge available">Confirmed</span>
          </div>
        ))}
      </section>
    </>
  );
}
