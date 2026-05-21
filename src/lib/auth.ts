import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";
import { readStore } from "@/lib/store";
import type { UserRecord } from "@/types";

type JwtPayload = {
  sub: string;
  email: string;
};

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-only-secret-change-in-production",
);

export async function signToken(user: UserRecord) {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export function readBearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("token")?.value ?? null;
}

export async function requireAuth(req: NextRequest) {
  const token = readBearerToken(req);
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload?.sub || !payload.email) {
    return null;
  }

  const store = await readStore();
  return store.users.find((user) => user.id === payload.sub) ?? null;
}
