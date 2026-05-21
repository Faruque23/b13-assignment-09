import { randomUUID } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { readStore, toSafeUser, writeStore } from "@/lib/store";

const googleIssuer = ["accounts.google.com", "https://accounts.google.com"];
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

type GooglePayload = {
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

function normalizeClientId(value?: string) {
  return (value ?? "").trim().replace(/^"|"$/g, "");
}

function isValidClientId(value: string) {
  return (
    value.endsWith(".apps.googleusercontent.com") &&
    !value.includes("your_google_oauth_client_id")
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { credential?: string };
  const serverClientId = normalizeClientId(process.env.GOOGLE_CLIENT_ID);
  const publicClientId = normalizeClientId(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  );
  const clientId = isValidClientId(serverClientId)
    ? serverClientId
    : publicClientId;
  const hasValidClientId = isValidClientId(clientId);

  if (!hasValidClientId) {
    return NextResponse.json(
      { message: "Google sign-in is not configured on the server." },
      { status: 500 },
    );
  }

  if (!body.credential) {
    return NextResponse.json(
      { message: "Google credential token is required." },
      { status: 400 },
    );
  }

  let payload: GooglePayload;
  try {
    const verified = await jwtVerify(body.credential, jwks, {
      issuer: googleIssuer,
      audience: clientId,
    });
    payload = verified.payload as GooglePayload;
  } catch {
    return NextResponse.json(
      { message: "Invalid Google credential." },
      { status: 401 },
    );
  }

  if (!payload.email || !payload.name || !payload.email_verified) {
    return NextResponse.json(
      { message: "Google account data is incomplete or not verified." },
      { status: 401 },
    );
  }

  const email = payload.email.trim().toLowerCase();
  const store = await readStore();
  let user = store.users.find((item) => item.email === email);

  if (!user) {
    user = {
      id: randomUUID(),
      name: payload.name.trim(),
      email,
      photoUrl:
        payload.picture?.trim() ||
        "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=200&q=80",
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    await writeStore(store);
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
