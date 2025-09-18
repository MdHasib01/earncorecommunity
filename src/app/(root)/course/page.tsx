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
import { Progress } from "@/components/ui/progress";
import { Play, Clock, BookOpen, Users, Star } from "lucide-react";

export default function Home() {
  const courses = [
    {
      id: "1",
      title: "Mastering The Hiring Game",
      description: "Mastering The Hiring Game",
      thumbnail:
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
      duration: "12 hours",
      lessons: 24,
      students: 1200,
      rating: 4.8,
      progress: 15,
      instructor: "John Smith",
    },
    {
      id: "2",
      title: "Advanced TypeScript Mastery",
      description: "Deep dive into TypeScript features and best practices",
      thumbnail:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800",
      duration: "8 hours",
      lessons: 16,
      students: 890,
      rating: 4.9,
      progress: 0,
      instructor: "Sarah Johnson",
    },
    {
      id: "3",
      title: "Learn how to snatch top talent, avoid hiring mistakes, and more!",
      description:
        "Learn how to snatch top talent, avoid hiring mistakes, and more!",
      thumbnail:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
      duration: "15 hours",
      lessons: 30,
      students: 2100,
      rating: 4.7,
      progress: 65,
      instructor: "Mike Chen",
    },
  ];

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
            <Link href="/course/1">
              <Button size="lg" className="mr-4">
                <Play className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
            </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Link href={`/course/${course.id}`}>
                      <Button size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        {course.progress > 0 ? "Continue" : "Start"} Course
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons} lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      by {course.instructor}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()} students
                    </span>
                  </div>

                  <Link href={`/course/${course.id}`} className="block">
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      {course.progress > 0
                        ? "Continue Learning"
                        : "Start Course"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
