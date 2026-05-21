"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";

const navLinkClass = (active: boolean) =>
  `px-3 py-2 rounded-full text-sm font-semibold ${active ? "bg-[var(--primary)] text-[var(--primary-contrast)]" : "text-[var(--text)]"}`;

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[color-mix(in_oklab,var(--surface),transparent_15%)] border-b border-[var(--border)]">
      <div className="app-container py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="heading-main text-xl font-extrabold">
          TutorNest
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            Home
          </Link>
          <Link href="/tutors" className={navLinkClass(pathname === "/tutors")}>
            Tutors
          </Link>
          {user && (
            <>
              <Link
                href="/add-tutor"
                className={navLinkClass(pathname === "/add-tutor")}
              >
                Add Tutor
              </Link>
              <Link
                href="/my-tutors"
                className={navLinkClass(pathname === "/my-tutors")}
              >
                My Tutors
              </Link>
              <Link
                href="/my-booked-sessions"
                className={navLinkClass(pathname === "/my-booked-sessions")}
              >
                My Booked Sessions
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {!user ? (
            <div className="flex gap-2">
              <Link href="/login" className="btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn-main">
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="h-11 w-11 overflow-hidden rounded-full border border-[var(--border)]"
                onClick={() => setOpen((prev) => !prev)}
              >
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </button>
              {open && (
                <div className="absolute right-0 top-12 card p-3 min-w-44">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-[var(--muted)] mb-2">{user.email}</p>
                  <Link
                    href="/profile"
                    className="block py-1 text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-[var(--danger)]"
                    onClick={() => {
                      setOpen(false);
                      void logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
