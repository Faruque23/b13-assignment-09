export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 gap-3 text-[var(--muted)]">
      <span className="h-6 w-6 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
      <span>{label}</span>
    </div>
  );
}
