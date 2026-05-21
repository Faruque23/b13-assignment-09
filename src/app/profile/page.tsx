"use client";

import { Spinner } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function ProfilePage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <Spinner label="Loading profile" />;
  }

  return (
    <section className="max-w-xl mx-auto card p-6 fade-in-up">
      <h1 className="heading-main text-3xl font-black mb-5">Profile</h1>
      <img
        src={user.photoUrl}
        alt={user.name}
        className="h-24 w-24 rounded-full object-cover border border-[var(--border)] mb-3"
      />
      <p className="font-semibold">{user.name}</p>
      <p className="text-[var(--muted)]">{user.email}</p>
      <p className="text-sm mt-2">Provider: {user.provider}</p>
    </section>
  );
}
