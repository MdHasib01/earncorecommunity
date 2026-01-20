"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetCourseDetailsQuery, useUpdateCourseMutation } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminEditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = String((params as any)?.id || "");

  const { data, isLoading, isFetching, isError } = useGetCourseDetailsQuery(id, {
    skip: !id,
  });
  const [updateCourse, { isLoading: isSaving }] = useUpdateCourseMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!data) return;
    setTitle(data.title || "");
    setDescription(data.description || "");
  }, [data]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-2xl font-bold">Edit Course</div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isError || !data ? (
            <div className="text-red-600">Failed to load course.</div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  disabled={isSaving || !title.trim()}
                  onClick={async () => {
                    try {
                      await updateCourse({
                        id,
                        title: title.trim(),
                        description: description.trim() || undefined,
                      }).unwrap();
                      toast.success("Course updated");
                      router.push("/admin/courses");
                    } catch (e: any) {
                      toast.error(e?.data?.message || "Failed to update course");
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => router.push("/admin/courses")}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

