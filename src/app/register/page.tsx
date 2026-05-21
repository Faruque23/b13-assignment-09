"use client";

import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { isGoogleClientConfigured } from "@/lib/google-auth-config";

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter.";
  }
  return null;
}

export default function RegisterPage() {
  const { register, googleLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validatePassword(form.password);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register(form);
      router.push("/login");
    } catch (err) {
      toast.error((err as Error).message);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto card p-6 md:p-8 fade-in-up">
      <h1 className="heading-main text-3xl font-black mb-6">Register</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            className="field"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            className="field"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="photoUrl" className="text-sm font-semibold">
            Photo URL
          </label>
          <input
            id="photoUrl"
            className="field"
            required
            value={form.photoUrl}
            onChange={(event) =>
              setForm({ ...form, photoUrl: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            className="field"
            type="password"
            required
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <button type="submit" className="btn-main" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {isGoogleClientConfigured ? (
        <div className="mt-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const credential = credentialResponse.credential;
                if (!credential) {
                  toast.error("Google sign-in failed.");
                  return;
                }
                await googleLogin(credential);
                router.push("/");
              } catch (err) {
                toast.error((err as Error).message);
              }
            }}
            onError={() => toast.error("Google sign-in failed.")}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--danger)]">
          Google sign-in is not configured. Add a valid OAuth Web Client ID in
          NEXT_PUBLIC_GOOGLE_CLIENT_ID.
        </p>
      )}

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--primary)] font-semibold">
          Login
        </Link>
      </p>
    </section>
  );
}
