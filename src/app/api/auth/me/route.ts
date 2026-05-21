import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { toSafeUser } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user: toSafeUser(user) });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}
