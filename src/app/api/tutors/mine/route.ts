import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  const tutors = store.tutors.filter((item) => item.createdByUserId === user.id);
  tutors.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ tutors });
}
