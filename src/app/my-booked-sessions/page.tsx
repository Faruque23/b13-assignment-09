"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EmptyState } from "@/components/empty-state";
import { Spinner } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/client-api";
import type { Booking } from "@/types";

export default function MyBookedSessionsPage() {
  const { loading: guardLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ bookings: Booking[] }>("/api/bookings");
      setBookings(data.bookings);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!guardLoading) {
      void fetchBookings();
    }
  }, [guardLoading]);

  if (guardLoading || loading) {
    return <Spinner label="Loading bookings" />;
  }

  return (
    <section className="space-y-6 fade-in-up">
      <h1 className="heading-main text-4xl font-black">My Booked Sessions</h1>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          message="Book a tutor session to see your records here."
        />
      ) : (
        <div className="card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="py-2">Tutor Name</th>
                <th className="py-2">Student Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[var(--border)]">
                  <td className="py-3">{booking.tutorName}</td>
                  <td className="py-3">{booking.studentName}</td>
                  <td className="py-3">{booking.studentEmail}</td>
                  <td className="py-3 capitalize">{booking.status}</td>
                  <td className="py-3">
                    <button
                      className="btn-ghost"
                      disabled={booking.status === "cancelled"}
                      onClick={() => setCancelId(booking.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cancelId && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
          <div className="card w-full max-w-md p-5 space-y-4">
            <h3 className="heading-main text-2xl font-black">Cancel Booking</h3>
            <p className="text-[var(--muted)]">
              Do you want to mark this booking as cancelled?
            </p>
            <div className="flex gap-3">
              <button
                className="btn-main"
                onClick={async () => {
                  try {
                    await apiFetch<{ booking: Booking }>(
                      `/api/bookings/${cancelId}/cancel`,
                      {
                        method: "PATCH",
                      },
                    );
                    toast.success("Booking status updated to cancelled.");
                    setCancelId(null);
                    void fetchBookings();
                  } catch (error) {
                    toast.error((error as Error).message);
                  }
                }}
              >
                Confirm
              </button>
              <button className="btn-ghost" onClick={() => setCancelId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
