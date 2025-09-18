"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useGetCourseQuery } from "../../../../lms/store/lms.api";
import {
  setCourse,
  setLoading,
  setError,
} from "../../../../lms/store/lms.slice";
import CourseContent, {
  CourseContentSkeleton,
} from "../../../../lms/components/CourseContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
interface CoursePageClientProps {
  courseId: string;
}

export default function CoursePage({ courseId }: CoursePageClientProps) {
  const dispatch = useDispatch();

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useGetCourseQuery(courseId, {
    skip: !courseId,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError("Failed to load course data"));
    } else {
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (course) {
      dispatch(setCourse(course));
    }
  }, [course, dispatch]);

  if (isLoading) {
    return <CourseContentSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to load course</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the course data. Please try again.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return <CourseContent course={course} courseId={courseId} />;
}
