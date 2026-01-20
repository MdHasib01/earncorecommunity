"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetContentDetailsQuery,
  useGetModulesQuery,
  useUpdateContentMutation,
} from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminEditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const id = String((params as any)?.id || "");

  const { data: modules = [] } = useGetModulesQuery();
  const { data, isLoading, isFetching, isError } = useGetContentDetailsQuery(id, {
    skip: !id,
  });
  const [updateLesson, { isLoading: isSaving }] = useUpdateContentMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<string>("0");
  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");
  const [moduleId, setModuleId] = useState<string>("");

  const moduleOptions = useMemo(
    () => modules.map((m) => ({ id: m._id, title: m.title })),
    [modules]
  );

  useEffect(() => {
    if (!data) return;
    setTitle(data.title || "");
    setDescription(data.description || "");
    setDuration(String(data.duration ?? 0));
    setYoutubeVideoLink(data.youtubeVideoLink || "");
    setModuleId(data.module || "");
  }, [data]);

  const parsedDuration = Number(duration);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-2xl font-bold">Edit Lesson</div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isError || !data ? (
            <div className="text-red-600">Failed to load lesson.</div>
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
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeVideoLink">YouTube Link</Label>
                <Input
                  id="youtubeVideoLink"
                  value={youtubeVideoLink}
                  onChange={(e) => setYoutubeVideoLink(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Module</Label>
                <Select value={moduleId} onValueChange={setModuleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleOptions.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  disabled={
                    isSaving ||
                    !title.trim() ||
                    !moduleId ||
                    !youtubeVideoLink.trim() ||
                    !Number.isFinite(parsedDuration) ||
                    parsedDuration <= 0
                  }
                  onClick={async () => {
                    try {
                      await updateLesson({
                        id,
                        title: title.trim(),
                        description: description.trim() || undefined,
                        duration: parsedDuration,
                        youtubeVideoLink: youtubeVideoLink.trim(),
                        moduleId,
                      }).unwrap();
                      toast.success("Lesson updated");
                      router.push("/admin/lessons");
                    } catch (e: any) {
                      toast.error(e?.data?.message || "Failed to update lesson");
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => router.push("/admin/lessons")}>
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

