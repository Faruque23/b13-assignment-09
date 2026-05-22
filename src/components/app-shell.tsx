"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TitleSync } from "@/components/title-sync";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <TitleSync />
      <Navbar />
      <main className={`flex-1 py-8 ${pathname === "/" ? "bg-white" : ""}`}>
        <div className="app-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
