"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TutorCard } from "@/components/tutor-card";
import { Spinner } from "@/components/spinner";
import { apiFetch } from "@/lib/client-api";
import type { Tutor } from "@/types";

const slides = [
  {
    title: "Build Confidence With Expert Tutors",
    text: "One-to-one sessions that adapt to your learning speed and goals.",
  },
  {
    title: "Trackable Learning Plans",
    text: "Weekly focus, clear milestones, and tutor feedback after every class.",
  },
  {
    title: "Book Instantly, Learn Consistently",
    text: "Choose your tutor, pick a slot, and start your momentum this week.",
  },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    apiFetch<{ tutors: Tutor[] }>("/api/tutors?limit=6")
      .then((data) => setTutors(data.tutors))
      .finally(() => setLoading(false));
  }, []);

  const activeSlide = useMemo(() => slides[index], [index]);

  return (
    <div className="space-y-12">
      <section className="card p-8 md:p-12 relative overflow-hidden fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-[color-mix(in_oklab,var(--accent),transparent_82%)] to-transparent" />
        <div className="relative max-w-2xl space-y-4">
          <p className="text-sm font-semibold text-[var(--primary)]">Slide {index + 1}/3</p>
          <h1 className="heading-main text-4xl md:text-5xl font-black">{activeSlide.title}</h1>
          <p className="text-[var(--muted)] text-lg">{activeSlide.text}</p>
          <div className="flex items-center gap-3">
            <Link href="/tutors" className="btn-main">
              Explore Tutors
            </Link>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setIndex((index + 1) % slides.length)}
            >
              Next Slide
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="heading-main text-3xl font-extrabold">Available Tutors</h2>
        <p className="text-[var(--muted)]">Showing top 6 tutors from our data.</p>
        {loading ? (
          <Spinner label="Loading tutors" />
        ) : (
          <div className="grid-cards">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </section>

      <section className="card p-6 md:p-8 fade-in-up">
        <h2 className="heading-main text-3xl font-extrabold mb-5">How TutorNest Works</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <article className="card p-4">
            <h3 className="font-bold mb-2">1. Find the right tutor</h3>
            <p className="text-[var(--muted)]">
              Search by name, subject, and session dates to shortlist fast.
            </p>
          </article>
          <article className="card p-4">
            <h3 className="font-bold mb-2">2. Book a session</h3>
            <p className="text-[var(--muted)]">
              Secure your seat instantly and get confirmation immediately.
            </p>
          </article>
          <article className="card p-4">
            <h3 className="font-bold mb-2">3. Learn and improve</h3>
            <p className="text-[var(--muted)]">
              Follow practical guidance with measurable weekly growth.
            </p>
          </article>
        </div>
      </section>

      <section className="card p-6 md:p-8 fade-in-up">
        <h2 className="heading-main text-3xl font-extrabold mb-5">Learning Impact</h2>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <article className="card p-4">
            <p className="heading-main text-3xl font-black">1.5K+</p>
            <p className="text-[var(--muted)]">Sessions Booked</p>
          </article>
          <article className="card p-4">
            <p className="heading-main text-3xl font-black">320+</p>
            <p className="text-[var(--muted)]">Active Learners</p>
          </article>
          <article className="card p-4">
            <p className="heading-main text-3xl font-black">96%</p>
            <p className="text-[var(--muted)]">Positive Feedback</p>
          </article>
          <article className="card p-4">
            <p className="heading-main text-3xl font-black">24/7</p>
            <p className="text-[var(--muted)]">Online Support</p>
          </article>
        </div>
      </section>
    </div>
  );
}
