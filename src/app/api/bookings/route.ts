import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { Booking } from "@/types";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  const bookings = store.bookings.filter(
    (booking) => booking.studentEmail === user.email,
  );
  bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    tutorId?: string;
    tutorName?: string;
    studentName?: string;
    studentEmail?: string;
    phone?: string;
  };

  if (!body.tutorId || !body.studentName || !body.phone) {
    return NextResponse.json(
      { message: "Tutor, student name and phone are required." },
      { status: 400 },
    );
  }

  const store = await readStore();
  const tutor = store.tutors.find((item) => item.id === body.tutorId);

  if (!tutor) {
    return NextResponse.json({ message: "Tutor not found." }, { status: 404 });
  }

  if (tutor.totalSlot <= 0) {
    return NextResponse.json(
      { message: "No available slots left." },
      { status: 400 },
    );
  }

  const now = new Date();
  const sessionDate = new Date(tutor.sessionStartDate);
  if (now < sessionDate) {
    return NextResponse.json(
      { message: "Booking is not available yet for this tutor." },
      { status: 400 },
    );
  }

  const existing = store.bookings.find(
    (booking) =>
      booking.tutorId === tutor.id &&
      booking.studentEmail === user.email &&
      booking.status === "booked",
  );
  if (existing) {
    return NextResponse.json(
      { message: "You already have an active booking for this tutor." },
      { status: 409 },
    );
  }

  const booking: Booking = {
    id: randomUUID(),
    tutorId: tutor.id,
    tutorName: tutor.tutorName,
    studentName: body.studentName,
    studentEmail: user.email,
    phone: body.phone,
    status: "booked",
    createdAt: new Date().toISOString(),
  };

  tutor.totalSlot -= 1;
  store.bookings.push(booking);
  await writeStore(store);

  return NextResponse.json({ booking }, { status: 201 });
}
