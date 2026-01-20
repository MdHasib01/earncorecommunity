"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateContentMutation, useGetModulesQuery } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminCreateLessonPage() {
  const router = useRouter();
  const { data: modules = [] } = useGetModulesQuery();
  const [createLesson, { isLoading }] = useCreateContentMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<string>("0");
  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");
  const [moduleId, setModuleId] = useState<string>("");

  const moduleOptions = useMemo(
    () => modules.map((m) => ({ id: m._id, title: m.title })),
    [modules]
  );

  const parsedDuration = Number(duration);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-2xl font-bold">Create Lesson</div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lesson description"
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
              placeholder="https://youtu.be/abcd"
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
                isLoading ||
                !title.trim() ||
                !moduleId ||
                !youtubeVideoLink.trim() ||
                !Number.isFinite(parsedDuration) ||
                parsedDuration <= 0
              }
              onClick={async () => {
                try {
                  await createLesson({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    duration: parsedDuration,
                    youtubeVideoLink: youtubeVideoLink.trim(),
                    moduleId,
                  }).unwrap();
                  toast.success("Lesson created");
                  router.push("/admin/lessons");
                } catch (e: any) {
                  toast.error(e?.data?.message || "Failed to create lesson");
                }
              }}
            >
              Create
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/lessons")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

