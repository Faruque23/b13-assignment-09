"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/spinner";
import { TutorCard } from "@/components/tutor-card";
import { apiFetch } from "@/lib/client-api";
import type { Tutor } from "@/types";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) {
        query.set("search", search);
      }
      if (startDate) {
        query.set("startDate", startDate);
      }
      if (endDate) {
        query.set("endDate", endDate);
      }
      const data = await apiFetch<{ tutors: Tutor[] }>(`/api/tutors?${query}`);
      setTutors(data.tutors);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = (event: FormEvent) => {
    event.preventDefault();
    void fetchTutors();
  };

  return (
    <section className="space-y-6 fade-in-up">
      <header>
        <h1 className="heading-main text-4xl font-black">Tutors</h1>
      </header>

      <form className="card p-4 grid md:grid-cols-4 gap-3" onSubmit={onFilter}>
        <input
          className="field"
          placeholder="Search by tutor name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <input
          className="field"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <input
          className="field"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
        <button className="btn-main" type="submit">
          Search & Filter
        </button>
      </form>

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
  );
}
