"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EmptyState } from "@/components/empty-state";
import { Spinner } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/client-api";
import type { Tutor } from "@/types";

export default function MyTutorsPage() {
  const { loading: guardLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [editing, setEditing] = useState<Tutor | null>(null);
  const [deleting, setDeleting] = useState<Tutor | null>(null);

  const fetchMine = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ tutors: Tutor[] }>("/api/tutors/mine");
      setTutors(data.tutors);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!guardLoading) {
      void fetchMine();
    }
  }, [guardLoading]);

  const rows = useMemo(
    () =>
      tutors.map((tutor) => (
        <tr key={tutor.id} className="border-b border-[var(--border)]">
          <td className="py-3">{tutor.tutorName}</td>
          <td className="py-3">{tutor.subject}</td>
          <td className="py-3">{tutor.totalSlot}</td>
          <td className="py-3">${tutor.hourlyFee}</td>
          <td className="py-3 flex gap-2">
            <button className="btn-ghost" onClick={() => setEditing(tutor)}>
              Update
            </button>
            <button className="btn-ghost" onClick={() => setDeleting(tutor)}>
              Delete
            </button>
          </td>
        </tr>
      )),
    [tutors],
  );

  if (guardLoading || loading) {
    return <Spinner label="Loading your tutors" />;
  }

  return (
    <section className="space-y-6 fade-in-up">
      <h1 className="heading-main text-4xl font-black">My Tutors</h1>

      {tutors.length === 0 ? (
        <EmptyState
          title="No tutors yet"
          message="Create your first tutor profile from Add Tutor page."
        />
      ) : (
        <div className="card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="py-2">Tutor Name</th>
                <th className="py-2">Subject</th>
                <th className="py-2">Slots</th>
                <th className="py-2">Fee</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditModal
          tutor={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void fetchMine();
          }}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Delete tutor"
          message="Are you sure you want to delete this tutor entry?"
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await apiFetch<{ ok: boolean }>(`/api/tutors/${deleting.id}`, {
                method: "DELETE",
              });
              toast.success("Tutor deleted.");
              setDeleting(null);
              void fetchMine();
            } catch (error) {
              toast.error((error as Error).message);
            }
          }}
        />
      )}
    </section>
  );
}

function EditModal({
  tutor,
  onClose,
  onSaved,
}: {
  tutor: Tutor;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(tutor);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch<{ tutor: Tutor }>(`/api/tutors/${tutor.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      toast.success("Tutor updated.");
      onSaved();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
      <form className="card w-full max-w-xl p-5 space-y-3" onSubmit={onSubmit}>
        <h3 className="heading-main text-2xl font-black">Update Tutor</h3>
        <input
          className="field"
          value={form.tutorName}
          onChange={(event) => setForm({ ...form, tutorName: event.target.value })}
        />
        <input
          className="field"
          value={form.subject}
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
        />
        <input
          className="field"
          type="number"
          value={form.hourlyFee}
          onChange={(event) =>
            setForm({ ...form, hourlyFee: Number(event.target.value) })
          }
        />
        <input
          className="field"
          type="number"
          value={form.totalSlot}
          onChange={(event) =>
            setForm({ ...form, totalSlot: Number(event.target.value) })
          }
        />
        <input
          className="field"
          value={form.availableDays}
          onChange={(event) =>
            setForm({ ...form, availableDays: event.target.value })
          }
        />
        <input
          className="field"
          value={form.availableTime}
          onChange={(event) =>
            setForm({ ...form, availableTime: event.target.value })
          }
        />
        <input
          className="field"
          type="date"
          value={form.sessionStartDate}
          onChange={(event) =>
            setForm({ ...form, sessionStartDate: event.target.value })
          }
        />
        <input
          className="field"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
        />
        <input
          className="field"
          value={form.institutionExperience}
          onChange={(event) =>
            setForm({ ...form, institutionExperience: event.target.value })
          }
        />
        <select
          className="field"
          value={form.teachingMode}
          onChange={(event) =>
            setForm({
              ...form,
              teachingMode: event.target.value as Tutor["teachingMode"],
            })
          }
        >
          <option>Online</option>
          <option>Offline</option>
          <option>Both</option>
        </select>
        <div className="flex gap-3">
          <button className="btn-main" type="submit">
            Save Changes
          </button>
          <button className="btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
      <div className="card w-full max-w-md p-5 space-y-4">
        <h3 className="heading-main text-2xl font-black">{title}</h3>
        <p className="text-[var(--muted)]">{message}</p>
        <div className="flex gap-3">
          <button className="btn-main" type="button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn-ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
