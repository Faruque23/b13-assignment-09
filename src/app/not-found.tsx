import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto card p-8 text-center fade-in-up">
      <p className="text-sm text-[var(--muted)] mb-2">404</p>
      <h1 className="heading-main text-4xl font-black mb-3">Page not found</h1>
      <p className="text-[var(--muted)] mb-5">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="btn-main">
        Back to Home
      </Link>
    </section>
  );
}
