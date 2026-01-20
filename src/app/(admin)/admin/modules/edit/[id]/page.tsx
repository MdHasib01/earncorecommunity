"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetCoursesQuery,
  useGetModuleDetailsQuery,
  useUpdateModuleMutation,
} from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminEditModulePage() {
  const router = useRouter();
  const params = useParams();
  const id = String((params as any)?.id || "");

  const { data: courses = [] } = useGetCoursesQuery();
  const { data, isLoading, isFetching, isError } = useGetModuleDetailsQuery(id, {
    skip: !id,
  });
  const [updateModule, { isLoading: isSaving }] = useUpdateModuleMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState<string>("");

  const courseOptions = useMemo(
    () => courses.map((c) => ({ id: c._id, title: c.title })),
    [courses]
  );

  useEffect(() => {
    if (!data) return;
    setTitle(data.title || "");
    setDescription(data.description || "");
    setCourseId(data.course || "");
  }, [data]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-2xl font-bold">Edit Module</div>

      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isError || !data ? (
            <div className="text-red-600">Failed to load module.</div>
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
                  disabled={isSaving || !title.trim() || !courseId}
                  onClick={async () => {
                    try {
                      await updateModule({
                        id,
                        title: title.trim(),
                        description: description.trim() || undefined,
                        courseId,
                      }).unwrap();
                      toast.success("Module updated");
                      router.push("/admin/modules");
                    } catch (e: any) {
                      toast.error(e?.data?.message || "Failed to update module");
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => router.push("/admin/modules")}>
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

