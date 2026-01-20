"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import { useGetCoursesQuery } from "@/lms/store/lms.api";

export default function Home() {
  const {
    data: courses = [],
    isLoading,
    isFetching,
    isError,
  } = useGetCoursesQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">LMS Platform</h1>
              <p className="text-muted-foreground mt-1">
                Learn at your own pace
              </p>
            </div>
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Browse All Courses
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Welcome to Your Learning Journey
            </h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Access world-class courses, track your progress, and master new
              skills at your own pace.
            </p>
            {courses[0]?._id ? (
              <Link href={`/course/${courses[0]._id}`}>
                <Button size="lg" className="mr-4">
                  <Play className="w-5 h-5 mr-2" />
                  Continue Learning
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="mr-4" disabled>
                <Play className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
            )}
            <Button variant="outline" size="lg">
              Explore Courses
            </Button>
          </div>
        </section>

        {/* Courses Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Your Courses</h2>
            <Button variant="outline">View All</Button>
          </div>

          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading courses...</div>
          ) : isError ? (
            <div className="text-red-600">Failed to load courses.</div>
          ) : courses.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-r from-primary/15 to-secondary/15 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="text-lg font-semibold line-clamp-2">
                        {course.title}
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description || "No description"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <Link href={`/course/${course._id}`} className="block">
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Open Course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No courses found.</div>
          )}
        </section>
      </main>
    </div>
  );
}
