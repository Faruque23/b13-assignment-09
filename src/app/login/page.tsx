"use client";

import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { isGoogleClientConfigured } from "@/lib/google-auth-config";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      router.push(next);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto card p-6 md:p-8 fade-in-up">
      <h1 className="heading-main text-3xl font-black mb-6">Login</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="field"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <p className="text-sm text-[var(--muted)]">Forget Password (disabled)</p>
        <button className="btn-main" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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
                router.push(next);
              } catch (error) {
                toast.error((error as Error).message);
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
        New here?{" "}
        <Link href="/register" className="text-[var(--primary)] font-semibold">
          Register
        </Link>
      </p>
    </section>
  );
}
