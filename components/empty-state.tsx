import Link from "next/link";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel
}: {
  title: string;
  body: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      <p className="muted">{body}</p>
      <Link className="button" href={actionHref}>
        {actionLabel}
      </Link>
    </section>
  );
}
