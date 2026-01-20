"use client";

import Link from "next/link";
import { useDeleteCourseMutation, useGetCoursesQuery } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCoursesPage() {
  const { data: courses = [], isLoading, isFetching, isError } = useGetCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Courses</div>
          <div className="text-sm text-muted-foreground">Create, edit, and delete courses.</div>
        </div>
        <Link href="/admin/courses/create">
          <Button>Create Course</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isError ? (
            <div className="text-red-600">Failed to load courses.</div>
          ) : courses.length ? (
            courses.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {c.description || "No description"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/courses/edit/${c._id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={async () => {
                      const ok = window.confirm("Delete this course?");
                      if (!ok) return;
                      await deleteCourse(c._id).unwrap();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No courses found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

