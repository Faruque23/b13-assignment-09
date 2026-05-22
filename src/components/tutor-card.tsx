import Link from "next/link";
import type { Tutor } from "@/types";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <article className="card overflow-hidden h-full flex flex-col fade-in-up">
      <img
        src={tutor.photoUrl}
        alt={tutor.tutorName}
        className="h-52 w-full object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="heading-main text-xl font-bold">{tutor.tutorName}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-[color-mix(in_oklab,var(--accent),transparent_75%)]">
            {tutor.subject}
          </span>
        </div>
        <p className="text-sm text-[var(--muted)] mb-3">
          {tutor.availableDays}, {tutor.availableTime}
        </p>
        <p className="text-sm mb-1">Mode: {tutor.teachingMode}</p>
        <p className="text-sm mb-4">Fee: BDT {tutor.hourlyFee * 100}/hour</p>
        <div className="mt-auto">
          <Link href={`/tutors/${tutor.id}`} className="btn-main inline-flex">
            Book Session
          </Link>
        </div>
      </div>
    </article>
  );
}
