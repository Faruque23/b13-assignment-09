import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function PATCH(
  req: NextRequest,
  context: RouteContext<"/api/bookings/[id]/cancel">,
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const store = await readStore();
  const booking = store.bookings.find((item) => item.id === id);

  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }
  if (booking.studentEmail !== user.email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  booking.status = "cancelled";
  await writeStore(store);
  return NextResponse.json({ booking });
}
