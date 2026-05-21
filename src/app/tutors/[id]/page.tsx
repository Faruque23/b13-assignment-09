import { TutorDetailsClient } from "@/app/tutors/[id]/tutor-details-client";

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TutorDetailsClient tutorId={id} />;
}
