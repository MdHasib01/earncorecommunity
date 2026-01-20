"use client";

import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import {
  useDeleteContentMutation,
  useGetContentsQuery,
  useGetModulesQuery,
} from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const getYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function AdminLessonsPage() {
  const { data: lessons = [], isLoading, isFetching, isError } = useGetContentsQuery();
  const { data: modules = [] } = useGetModulesQuery();
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
        <CardContent>
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-red-600">Failed to load lessons.</div>
          ) : lessons.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((l) => {
                const moduleTitle =
                  modules.find((m) => m._id === l.module)?.title ?? l.module;
                const videoId = getYouTubeVideoId(l.youtubeVideoLink);

                return (
                  <Card key={l._id} className="overflow-hidden">
                    <div className="relative aspect-video bg-black">
                      {videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=0&rel=0&modestbranding=1`}
                          title={l.title}
                          frameBorder="0"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          className="w-full h-full pointer-events-none"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                          No preview
                        </div>
                      )}

                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/lessons/edit/${l._id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(l._id);
                                  toast.success("Content ID copied");
                                } catch {
                                  toast.error("Failed to copy");
                                }
                              }}
                            >
                              Copy content ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    l.youtubeVideoLink
                                  );
                                  toast.success("Video link copied");
                                } catch {
                                  toast.error("Failed to copy");
                                }
                              }}
                            >
                              Copy video link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={async () => {
                                if (isDeleting) return;
                                const ok = window.confirm(
                                  "Delete this lesson?"
                                );
                                if (!ok) return;
                                try {
                                  await deleteLesson(l._id).unwrap();
                                  toast.success("Lesson deleted");
                                } catch {
                                  toast.error("Failed to delete lesson");
                                }
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="p-4 space-y-1">
                      <div className="font-semibold line-clamp-2">{l.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        Module: {moduleTitle}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground">No lessons found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
