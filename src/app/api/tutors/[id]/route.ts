import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  context: RouteContext<"/api/tutors/[id]">,
) {
  const { id } = await context.params;
  const store = await readStore();
  const tutor = store.tutors.find((item) => item.id === id);

  if (!tutor) {
    return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
  }

  return NextResponse.json({ tutor });
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext<"/api/tutors/[id]">,
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const store = await readStore();
  const index = store.tutors.findIndex((item) => item.id === id);

  if (index < 0) {
    return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
  }
  if (store.tutors[index].createdByUserId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  store.tutors[index] = {
    ...store.tutors[index],
    ...body,
    hourlyFee: Number(body.hourlyFee ?? store.tutors[index].hourlyFee),
    totalSlot: Number(body.totalSlot ?? store.tutors[index].totalSlot),
  };
  await writeStore(store);

  return NextResponse.json({ tutor: store.tutors[index] });
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext<"/api/tutors/[id]">,
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const store = await readStore();
  const tutor = store.tutors.find((item) => item.id === id);

  if (!tutor) {
    return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
  }
  if (tutor.createdByUserId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  store.tutors = store.tutors.filter((item) => item.id !== id);
  store.bookings = store.bookings.filter((booking) => booking.tutorId !== id);
  await writeStore(store);

  return NextResponse.json({ ok: true });
}
