import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { readStore, toSafeUser, writeStore } from "@/lib/store";

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    photoUrl?: string;
    password?: string;
  };

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      { message: "Name, email and password are required." },
      { status: 400 },
    );
  }

  const passwordError = validatePassword(body.password);
  if (passwordError) {
    return NextResponse.json({ message: passwordError }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const store = await readStore();
  const existing = store.users.find((user) => user.email === email);
  if (existing) {
    return NextResponse.json(
      { message: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const newUser = {
    id: randomUUID(),
    name: body.name.trim(),
    email,
    photoUrl:
      body.photoUrl?.trim() ||
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
    passwordHash: await hash(body.password, 10),
    provider: "password" as const,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  await writeStore(store);

  const token = await signToken(newUser);
  const response = NextResponse.json(
    { token, user: toSafeUser(newUser) },
    { status: 201 },
  );
  response.cookies.set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
