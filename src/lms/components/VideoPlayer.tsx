"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setWatchedContentIds, updateProgress } from "../store/lms.slice";
import {
  useLazyGetWatchedContentIdsQuery,
  useMarkWatchedMutation,
} from "../store/lms.api";
import { Lesson, Module } from "../types/lms.types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  lesson: Lesson | null;
  module: Module | null;
  courseId: string;
}

const WATCHED_STORAGE_KEY = "watchedCourseContentIds";

export default function VideoPlayer({
  lesson,
  module,
  courseId,
}: VideoPlayerProps) {
  const dispatch = useDispatch();
  const [markWatched] = useMarkWatchedMutation();
  const [fetchWatched] = useLazyGetWatchedContentIdsQuery();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [watchedPercentage, setWatchedPercentage] = useState(0);

  useEffect(() => {
    if (lesson && watchedPercentage >= 80 && !lesson.isCompleted) {
      // Mark lesson as completed when 80% watched
      markLessonComplete();
    }
  }, [watchedPercentage, lesson]);

  const markLessonComplete = async () => {
    if (!lesson || !module) return;

    try {
      dispatch(
        updateProgress({
          courseId,
          moduleId: module.id,
          lessonId: lesson.id,
          isCompleted: true,
        }),
      );

      await markWatched({ courseContentId: lesson.id }).unwrap();
      const watchedIds = await fetchWatched().unwrap();
      dispatch(setWatchedContentIds(watchedIds));
      try {
        localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watchedIds));
      } catch {}
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!lesson) {
    return (
      <Card className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a lesson to start learning</p>
        </div>
      </Card>
    );
  }

  const videoId = getYouTubeVideoId(lesson.videoUrl);

  return (
    <div className="space-y-4">
      {/* Video Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDuration(lesson.duration)}</span>
            {lesson.isCompleted && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Completed
              </span>
            )}
          </div>
        </div>
        {module && (
          <p className="text-muted-foreground">Module: {module.title}</p>
        )}
      </div>

      {/* Video Player */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
          )}

          {videoId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&rel=0&modestbranding=1`}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p>Invalid video URL</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls (Custom overlay for demo) */}
        <div className="p-4 bg-card border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Replay
              </Button>
              {!lesson.isCompleted && (
                <Button
                  onClick={markLessonComplete}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Complete
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Progress: {Math.round(watchedPercentage)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Lesson Description */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">About this lesson</h3>
        <p className="text-muted-foreground leading-relaxed">
          In this lesson, you&apos;ll learn about {lesson.title.toLowerCase()}.
          This comprehensive guide will walk you through the concepts step by
          step, providing practical examples and best practices. By the end of
          this lesson, you&apos;ll have a solid understanding of the topic and
          be ready to apply these concepts in your own projects.
        </p>
      </Card>
    </div>
  );
}
