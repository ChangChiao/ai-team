import { getCurrentSellerTransactions } from "@/lib/data/transactions";

export default async function TransactionsPage() {
  const transactions = await getCurrentSellerTransactions();

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Transactions</p>
        <h1>Confirmed history builds seller trust.</h1>
        <p className="muted">MVP confirmation proves a transaction happened. It is not a rating or buyer protection claim.</p>
      </section>
      <section className="panel">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div className="seller-row" key={transaction.id}>
              <div>
                <strong>{transaction.listingTitle}</strong>
                <p className="muted">
                  {transaction.transactionType} · {transaction.status}
                  {transaction.confirmedAt ? ` · confirmed ${transaction.confirmedAt}` : ""}
                </p>
              </div>
              <span className={transaction.status === "confirmed" ? "status-badge available" : "status-badge reserved"}>
                {transaction.status}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No transactions yet</h2>
            <p className="muted">Create a confirmation link from a listing after a sale or exchange.</p>
          </div>
        )}
      </section>
    </>
  );
}
