"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateCourseMutation } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCreateCoursePage() {
  const router = useRouter();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-2xl font-bold">Create Course</div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              disabled={isLoading || !title.trim()}
              onClick={async () => {
                try {
                  await createCourse({
                    title: title.trim(),
                    description: description.trim() || undefined,
                  }).unwrap();
                  toast.success("Course created");
                  router.push("/admin/courses");
                } catch (e: any) {
                  toast.error(e?.data?.message || "Failed to create course");
                }
              }}
            >
              Create
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/courses")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

