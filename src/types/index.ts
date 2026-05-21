export type TeachingMode = "Online" | "Offline" | "Both";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  passwordHash?: string;
  provider: "password" | "google";
  createdAt: string;
}

export interface UserSafe {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  provider: "password" | "google";
  createdAt: string;
}

export interface Tutor {
  id: string;
  tutorName: string;
  photoUrl: string;
  subject: string;
  availableDays: string;
  availableTime: string;
  hourlyFee: number;
  totalSlot: number;
  sessionStartDate: string;
  institutionExperience: string;
  location: string;
  teachingMode: TeachingMode;
  createdByUserId: string;
  createdByName: string;
  createdByEmail: string;
  createdAt: string;
}

export type BookingStatus = "booked" | "cancelled";

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Store {
  users: UserRecord[];
  tutors: Tutor[];
  bookings: Booking[];
}
