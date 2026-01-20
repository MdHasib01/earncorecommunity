"use client";

import Link from "next/link";
import { useDeleteContentMutation, useGetContentsQuery } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLessonsPage() {
  const { data: lessons = [], isLoading, isFetching, isError } = useGetContentsQuery();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteContentMutation();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Lessons</div>
          <div className="text-sm text-muted-foreground">Create, edit, and delete lessons.</div>
        </div>
        <Link href="/admin/lessons/create">
          <Button>Create Lesson</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Lessons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isError ? (
            <div className="text-red-600">Failed to load lessons.</div>
          ) : lessons.length ? (
            lessons.map((l) => (
              <div
                key={l._id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{l.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {l.description || "No description"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                    <span>Duration: {l.duration}m</span>
                    <span className="truncate">Module: {l.module}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/lessons/edit/${l._id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={async () => {
                      const ok = window.confirm("Delete this lesson?");
                      if (!ok) return;
                      await deleteLesson(l._id).unwrap();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No lessons found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

