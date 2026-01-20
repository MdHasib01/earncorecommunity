'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLesson, toggleModuleExpansion } from '../store/lms.slice';
import { Course, Lesson, Module } from '../types/lms.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RootState } from '@/store/store';

interface ModuleSidebarProps {
  course: Course;
  currentLesson: Lesson | null;
  className?: string;
}

export default function ModuleSidebar({ course: courseProp, currentLesson, className }: ModuleSidebarProps) {
  const dispatch = useDispatch();
  const currentCourse = useSelector((state: RootState) => state.lms.currentCourse);
  const course = currentCourse?.id === courseProp.id ? currentCourse : courseProp;

  const handleLessonSelect = (lesson: Lesson, module: Module) => {
    dispatch(setCurrentLesson({ lesson, module }));
  };

  const handleModuleToggle = (moduleId: string) => {
    dispatch(toggleModuleExpansion(moduleId));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getModuleProgress = (module: Module) => {
    const completedLessons = module.lessons.filter(lesson => lesson.isCompleted).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Course Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">{course.title}</h2>
            {course.description && (
              <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
            )}
          </div>

          {/* Course Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{course.currentProgress}%</span>
            </div>
            <Progress value={course.currentProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{course.completedLessons} of {course.totalLessons} lessons</span>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{course.modules.filter(m => m.isCompleted).length} modules completed</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modules List */}
      <div className="space-y-3">
        {course.modules.map((module, moduleIndex) => (
          <Card key={module.id} className="overflow-hidden">
            <Collapsible open={module.isExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto hover:bg-muted/50"
                  onClick={() => handleModuleToggle(module.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {module.isExpanded ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{module.title}</span>
                          {module.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {module.lessons.length} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(module.totalDuration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {getModuleProgress(module)}%
                      </div>
                      <Progress 
                        value={getModuleProgress(module)} 
                        className="w-16 h-1 mt-1" 
                      />
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t bg-muted/20">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Button
                      key={lesson.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start p-4 h-auto border-b border-border/50 last:border-b-0 hover:bg-muted/50",
                        currentLesson?.id === lesson.id && "bg-primary/10 border-l-4 border-l-primary"
                      )}
                      onClick={() => handleLessonSelect(lesson, module)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {lesson.isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : currentLesson?.id === lesson.id ? (
                              <Play className="w-4 h-4 text-primary fill-current" />
                            ) : (
                              <Play className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="text-left">
                            <div className="font-medium text-sm">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDuration(lesson.duration)}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {moduleIndex + 1}.{lessonIndex + 1}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
