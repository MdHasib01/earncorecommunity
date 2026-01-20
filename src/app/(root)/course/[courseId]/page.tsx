import CoursePageClient from "./CoursePageClient";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  // Await the params since it's now a Promise in Next.js 15
  const { courseId } = await params;

  // Pass the courseId to the client component
  return <CoursePageClient courseId={courseId} />;
}
