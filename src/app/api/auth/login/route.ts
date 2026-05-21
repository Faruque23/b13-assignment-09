import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { readStore, toSafeUser } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  const email = body.email.trim().toLowerCase();
  const store = await readStore();
  const user = store.users.find((item) => item.email === email);

  if (!user?.passwordHash) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  const matched = await compare(body.password, user.passwordHash);
  if (!matched) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  const token = await signToken(user);
  const response = NextResponse.json({ token, user: toSafeUser(user) });
  response.cookies.set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
