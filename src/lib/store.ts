import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Store, Tutor, UserRecord, UserSafe } from "@/types";

const dataPath = path.join(process.cwd(), "src", "data", "store.json");

const seedTutors: Tutor[] = [
  {
    id: randomUUID(),
    tutorName: "Ayesha Rahman",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    subject: "Mathematics",
    availableDays: "Sun - Thu",
    availableTime: "5:00 PM - 8:00 PM",
    hourlyFee: 16,
    totalSlot: 8,
    sessionStartDate: "2026-06-01",
    institutionExperience: "BSc in Math, 5 years private tutoring",
    location: "Dhaka",
    teachingMode: "Both",
    createdByUserId: "seed-admin",
    createdByName: "TutorHub Team",
    createdByEmail: "seed@tutorhub.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    tutorName: "Tanvir Islam",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    subject: "Physics",
    availableDays: "Sat - Wed",
    availableTime: "6:00 PM - 9:00 PM",
    hourlyFee: 18,
    totalSlot: 10,
    sessionStartDate: "2026-05-25",
    institutionExperience: "MSc in Physics, former college lecturer",
    location: "Chattogram",
    teachingMode: "Online",
    createdByUserId: "seed-admin",
    createdByName: "TutorHub Team",
    createdByEmail: "seed@tutorhub.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    tutorName: "Nusrat Jahan",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    subject: "Chemistry",
    availableDays: "Mon - Fri",
    availableTime: "4:00 PM - 7:00 PM",
    hourlyFee: 15,
    totalSlot: 6,
    sessionStartDate: "2026-06-05",
    institutionExperience: "Chemistry olympiad coach",
    location: "Sylhet",
    teachingMode: "Offline",
    createdByUserId: "seed-admin",
    createdByName: "TutorHub Team",
    createdByEmail: "seed@tutorhub.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    tutorName: "Fahim Ahmed",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    subject: "English",
    availableDays: "Sun - Wed",
    availableTime: "7:00 PM - 10:00 PM",
    hourlyFee: 14,
    totalSlot: 7,
    sessionStartDate: "2026-05-23",
    institutionExperience: "IELTS mentor, 4 years experience",
    location: "Rajshahi",
    teachingMode: "Both",
    createdByUserId: "seed-admin",
    createdByName: "TutorHub Team",
    createdByEmail: "seed@tutorhub.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    tutorName: "Mitu Akter",
    photoUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    subject: "Biology",
    availableDays: "Tue - Sat",
    availableTime: "3:00 PM - 6:00 PM",
    hourlyFee: 17,
    totalSlot: 5,
    sessionStartDate: "2026-06-10",
    institutionExperience: "Medical admission specialist",
    location: "Khulna",
    teachingMode: "Online",
    createdByUserId: "seed-admin",
    createdByName: "TutorHub Team",
    createdByEmail: "seed@tutorhub.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    tutorName: "Rafiul Karim",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    subject: "ICT",
    availableDays: "Fri - Tue",
    availableTime: "8:00 PM - 11:00 PM",
    hourlyFee: 20,
    totalSlot: 9,
    sessionStartDate: "2026-05-30",
    institutionExperience: "Software engineer and coding mentor",
    location: "Cumilla",
    teachingMode: "Both",
    createdByUserId: "seed-admin",
    createdByName: "TutorHub Team",
    createdByEmail: "seed@tutorhub.dev",
    createdAt: new Date().toISOString(),
  },
];

const initialStore: Store = {
  users: [],
  tutors: seedTutors,
  bookings: [],
};

async function ensureStore() {
  await mkdir(path.dirname(dataPath), { recursive: true });
  try {
    await readFile(dataPath, "utf-8");
  } catch {
    await writeFile(dataPath, JSON.stringify(initialStore, null, 2), "utf-8");
  }
}

export async function readStore(): Promise<Store> {
  await ensureStore();
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw) as Store;
}

export async function writeStore(store: Store) {
  await writeFile(dataPath, JSON.stringify(store, null, 2), "utf-8");
}

export function toSafeUser(user: UserRecord): UserSafe {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}
