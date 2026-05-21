"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const routeTitles: Record<string, string> = {
  "/": "TutorNest | Home",
  "/tutors": "TutorNest | Tutors",
  "/add-tutor": "TutorNest | Add Tutor",
  "/my-tutors": "TutorNest | My Tutors",
  "/my-booked-sessions": "TutorNest | My Booked Sessions",
  "/login": "TutorNest | Login",
  "/register": "TutorNest | Register",
  "/profile": "TutorNest | Profile",
};

export function TitleSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/tutors/")) {
      document.title = "TutorNest | Tutor Details";
      return;
    }
    document.title = routeTitles[pathname] ?? "TutorNest";
  }, [pathname]);

  return null;
}
