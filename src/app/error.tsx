"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="max-w-xl mx-auto card p-6 text-center fade-in-up">
      <h1 className="heading-main text-3xl font-black mb-3">Something went wrong</h1>
      <p className="text-[var(--muted)] mb-4">{error.message}</p>
      <button type="button" className="btn-main" onClick={() => reset()}>
        Try Again
      </button>
    </section>
  );
}
