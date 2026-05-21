import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--surface),white_10%)]">
      <div className="app-container py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="heading-main text-lg font-bold mb-2">TutorNest</h4>
          <p className="text-[var(--muted)]">
            Personalized tutoring for school, college and admission prep.
          </p>
        </div>
        <div>
          <h5 className="font-bold mb-2">Learning Services</h5>
          <ul className="space-y-1 text-[var(--muted)]">
            <li>One to One Sessions</li>
            <li>Online Live Lessons</li>
            <li>Exam Preparation</li>
            <li>Skill Mentorship</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-2">Contact</h5>
          <ul className="space-y-1 text-[var(--muted)]">
            <li>Email: support@tutornest.app</li>
            <li>Phone: +880 1712 000000</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-2">Social</h5>
          <div className="flex gap-3 text-[var(--muted)]">
            <Link href="#">Facebook</Link>
            <Link href="#">LinkedIn</Link>
            <Link href="#">X</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        Copyright 2026 TutorNest. All rights reserved.
      </div>
    </footer>
  );
}
