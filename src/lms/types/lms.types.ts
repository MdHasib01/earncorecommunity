export interface Course {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
  currentProgress: number;
  totalLessons: number;
  completedLessons: number;
  totalDuration?: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isCompleted: boolean;
  isExpanded?: boolean;
  totalDuration: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number;
  thumbnail?: string;
  isCompleted: boolean;
  isActive?: boolean;
}

export interface LMSState {
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  currentModule: Module | null;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateProgressPayload {
  courseId: string;
  moduleId: string;
  lessonId: string;
  isCompleted: boolean;
}
