"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/spinner";
import { useAuth } from "@/contexts/auth-context";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/client-api";
import type { Tutor } from "@/types";

export function TutorDetailsClient({ tutorId }: { tutorId: string }) {
  const { user } = useAuth();
  const { loading: guardLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setStudentName(user.name);
    }
  }, [user]);

  useEffect(() => {
    apiFetch<{ tutor: Tutor }>(`/api/tutors/${tutorId}`)
      .then((data) => setTutor(data.tutor))
      .catch((error) => toast.error((error as Error).message))
      .finally(() => setLoading(false));
  }, [tutorId]);

  if (guardLoading || loading) {
    return <Spinner label="Loading tutor details" />;
  }

  if (!tutor || !user) {
    return null;
  }

  const noSlots = tutor.totalSlot <= 0;

  const onBook = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch<{ message: string }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          tutorId: tutor.id,
          tutorName: tutor.tutorName,
          studentName,
          studentEmail: user.email,
          phone,
        }),
      });
      toast.success("Session booked successfully.");
      setTutor({ ...tutor, totalSlot: tutor.totalSlot - 1 });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <section className="grid lg:grid-cols-2 gap-6 fade-in-up">
      <article className="card overflow-hidden">
        <img
          src={tutor.photoUrl}
          alt={tutor.tutorName}
          className="w-full h-72 object-cover"
        />
        <div className="p-5 space-y-2">
          <h1 className="heading-main text-3xl font-black">{tutor.tutorName}</h1>
          <p className="text-[var(--muted)]">{tutor.subject}</p>
          <p>Availability: {tutor.availableDays}</p>
          <p>Time: {tutor.availableTime}</p>
          <p>Session starts: {tutor.sessionStartDate}</p>
          <p>Location: {tutor.location}</p>
          <p>Mode: {tutor.teachingMode}</p>
          <p>Fee: ${tutor.hourlyFee}/hour</p>
          <p className={noSlots ? "text-[var(--danger)]" : ""}>
            Total Slot Availability: {tutor.totalSlot}
          </p>
          {noSlots && (
            <p className="text-sm text-[var(--danger)]">
              This session is fully booked. You can&apos;t join at the moment.
            </p>
          )}
        </div>
      </article>

      <article className="card p-5">
        <h2 className="heading-main text-2xl font-black mb-4">Book Session</h2>
        <form className="space-y-3" onSubmit={onBook}>
          <div>
            <label className="text-sm font-semibold">Student Name</label>
            <input
              className="field"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Phone</label>
            <input
              className="field"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Tutor ID</label>
            <input className="field" value={tutor.id} disabled />
          </div>
          <div>
            <label className="text-sm font-semibold">Tutor Name</label>
            <input className="field" value={tutor.tutorName} disabled />
          </div>
          <div>
            <label className="text-sm font-semibold">Student Email</label>
            <input className="field" value={user.email} disabled />
          </div>
          <div>
            <label className="text-sm font-semibold">Book Status</label>
            <input className="field" value="booked" disabled />
          </div>
          <button className="btn-main" disabled={noSlots} type="submit">
            Book Session
          </button>
        </form>
      </article>
    </section>
  );
}
