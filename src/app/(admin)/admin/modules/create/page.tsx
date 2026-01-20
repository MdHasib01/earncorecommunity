"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateModuleMutation, useGetCoursesQuery } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminCreateModulePage() {
  const router = useRouter();
  const { data: courses = [] } = useGetCoursesQuery();
  const [createModule, { isLoading }] = useCreateModuleMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState<string>("");

  const courseOptions = useMemo(
    () => courses.map((c) => ({ id: c._id, title: c.title })),
    [courses]
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-2xl font-bold">Create Module</div>

      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Module title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module description"
            />
          </div>

          <div className="space-y-2">
            <Label>Course</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              disabled={isLoading || !title.trim() || !courseId}
              onClick={async () => {
                try {
                  await createModule({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    courseId,
                  }).unwrap();
                  toast.success("Module created");
                  router.push("/admin/modules");
                } catch (e: any) {
                  toast.error(e?.data?.message || "Failed to create module");
                }
              }}
            >
              Create
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/modules")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

