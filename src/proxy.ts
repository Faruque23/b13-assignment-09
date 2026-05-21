import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/add-tutor", "/my-tutors", "/my-booked-sessions", "/profile"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasTutorDetailsPath = pathname.startsWith("/tutors/") && pathname !== "/tutors";
  const protectedRoute =
    hasTutorDetailsPath ||
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-tutor/:path*", "/my-tutors/:path*", "/my-booked-sessions/:path*", "/profile/:path*", "/tutors/:path*"],
};
