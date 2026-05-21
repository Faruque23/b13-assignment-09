"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TitleSync } from "@/components/title-sync";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TitleSync />
      <Navbar />
      <main className="flex-1 py-8">
        <div className="app-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
