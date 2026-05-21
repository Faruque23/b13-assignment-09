export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="card p-8 text-center">
      <h3 className="heading-main text-2xl font-bold mb-2">{title}</h3>
      <p className="text-[var(--muted)]">{message}</p>
    </div>
  );
}
