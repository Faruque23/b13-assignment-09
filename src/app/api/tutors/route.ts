import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { TeachingMode, Tutor } from "@/types";

export async function GET(req: NextRequest) {
  const store = await readStore();
  const { searchParams } = req.nextUrl;

  const limitRaw = searchParams.get("limit");
  const search = searchParams.get("search")?.trim() ?? "";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let tutors = [...store.tutors];

  if (search) {
    const regex = new RegExp(search, "i");
    tutors = tutors.filter((tutor) => regex.test(tutor.tutorName));
  }

  if (startDate) {
    tutors = tutors.filter((tutor) => tutor.sessionStartDate >= startDate);
  }

  if (endDate) {
    tutors = tutors.filter((tutor) => tutor.sessionStartDate <= endDate);
  }

  tutors.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (limitRaw) {
    const limit = Number(limitRaw);
    if (!Number.isNaN(limit) && limit > 0) {
      tutors = tutors.slice(0, limit);
    }
  }

  return NextResponse.json({ tutors });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<Tutor>;
  const requiredFields: Array<keyof Tutor> = [
    "tutorName",
    "photoUrl",
    "subject",
    "availableDays",
    "availableTime",
    "hourlyFee",
    "totalSlot",
    "sessionStartDate",
    "institutionExperience",
    "location",
    "teachingMode",
  ];

  const missing = requiredFields.find((field) => !body[field]);
  if (missing) {
    return NextResponse.json(
      { message: `Missing field: ${missing}` },
      { status: 400 },
    );
  }

  const store = await readStore();
  const tutor: Tutor = {
    id: randomUUID(),
    tutorName: String(body.tutorName),
    photoUrl: String(body.photoUrl),
    subject: String(body.subject),
    availableDays: String(body.availableDays),
    availableTime: String(body.availableTime),
    hourlyFee: Number(body.hourlyFee),
    totalSlot: Number(body.totalSlot),
    sessionStartDate: String(body.sessionStartDate),
    institutionExperience: String(body.institutionExperience),
    location: String(body.location),
    teachingMode: body.teachingMode as TeachingMode,
    createdByUserId: user.id,
    createdByName: user.name,
    createdByEmail: user.email,
    createdAt: new Date().toISOString(),
  };

  store.tutors.push(tutor);
  await writeStore(store);

  return NextResponse.json({ tutor }, { status: 201 });
}
