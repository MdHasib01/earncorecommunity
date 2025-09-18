// This is the Server Component (page.tsx)
import CoursePageClient from "./CoursePageClient";

// This runs on the server and can export generateStaticParams
export async function generateStaticParams() {
  // Return empty array for fully dynamic, or fetch your course IDs
  return [
    {
      courseId: "1",
    },
    {
      courseId: "2",
    },
    {
      courseId: "3",
    },
  ];

  // Or if you have course IDs:
  // const courseIds = await fetchCourseIds(); // Your API call
  // return courseIds.map((courseId) => ({
  //   courseId: courseId,
  // }));
}

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
