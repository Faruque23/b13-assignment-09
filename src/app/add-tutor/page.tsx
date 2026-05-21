"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/client-api";

const initialForm = {
  tutorName: "",
  photoUrl: "",
  subject: "Mathematics",
  availableDays: "Sun - Thu",
  availableTime: "5:00 PM - 8:00 PM",
  hourlyFee: "",
  totalSlot: "",
  sessionStartDate: "",
  institutionExperience: "",
  location: "",
  teachingMode: "Online",
};

export default function AddTutorPage() {
  const { loading } = useRequireAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return null;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch<{ message: string }>("/api/tutors", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          hourlyFee: Number(form.hourlyFee),
          totalSlot: Number(form.totalSlot),
        }),
      });
      toast.success("Tutor created successfully.");
      setForm(initialForm);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card p-6 md:p-8 max-w-4xl mx-auto fade-in-up">
      <h1 className="heading-main text-3xl font-black mb-6">Add Tutor</h1>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        <input
          className="field"
          placeholder="Tutor Name"
          value={form.tutorName}
          onChange={(event) =>
            setForm({ ...form, tutorName: event.target.value })
          }
          required
        />
        <input
          className="field"
          placeholder="Photo URL"
          value={form.photoUrl}
          onChange={(event) => setForm({ ...form, photoUrl: event.target.value })}
          required
        />
        <select
          className="field"
          value={form.subject}
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
        >
          <option>Mathematics</option>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Biology</option>
          <option>English</option>
          <option>ICT</option>
        </select>
        <input
          className="field"
          placeholder="Available Days"
          value={form.availableDays}
          onChange={(event) =>
            setForm({ ...form, availableDays: event.target.value })
          }
          required
        />
        <input
          className="field"
          placeholder="Available Time Slot"
          value={form.availableTime}
          onChange={(event) =>
            setForm({ ...form, availableTime: event.target.value })
          }
          required
        />
        <input
          className="field"
          type="number"
          placeholder="Hourly Fee"
          value={form.hourlyFee}
          onChange={(event) => setForm({ ...form, hourlyFee: event.target.value })}
          required
        />
        <input
          className="field"
          type="number"
          placeholder="Total Slot"
          value={form.totalSlot}
          onChange={(event) => setForm({ ...form, totalSlot: event.target.value })}
          required
        />
        <input
          className="field"
          type="date"
          value={form.sessionStartDate}
          onChange={(event) =>
            setForm({ ...form, sessionStartDate: event.target.value })
          }
          required
        />
        <input
          className="field md:col-span-2"
          placeholder="Institution & Experience"
          value={form.institutionExperience}
          onChange={(event) =>
            setForm({ ...form, institutionExperience: event.target.value })
          }
          required
        />
        <input
          className="field"
          placeholder="Location"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
          required
        />
        <select
          className="field"
          value={form.teachingMode}
          onChange={(event) =>
            setForm({ ...form, teachingMode: event.target.value })
          }
        >
          <option>Online</option>
          <option>Offline</option>
          <option>Both</option>
        </select>
        <div className="md:col-span-2">
          <button className="btn-main" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </section>
  );
}
