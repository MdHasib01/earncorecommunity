import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LMSState,
  Course,
  Lesson,
  Module,
  UpdateProgressPayload,
} from "../types/lms.types";

const initialState: LMSState = {
  currentCourse: null,
  currentLesson: null,
  currentModule: null,
  isLoading: false,
  error: null,
};

const lmsSlice = createSlice({
  name: "lms",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
      // Set first incomplete lesson as current if no lesson is active
      if (!state.currentLesson) {
        const firstIncompleteLesson = action.payload.modules
          .flatMap((module) => module.lessons)
          .find((lesson) => !lesson.isCompleted);

        if (firstIncompleteLesson) {
          state.currentLesson = firstIncompleteLesson;
          state.currentModule =
            action.payload.modules.find((module) =>
              module.lessons.some(
                (lesson) => lesson.id === firstIncompleteLesson.id
              )
            ) || null;
        }
      }
    },
    setCurrentLesson: (
      state,
      action: PayloadAction<{ lesson: Lesson; module: Module }>
    ) => {
      state.currentLesson = action.payload.lesson;
      state.currentModule = action.payload.module;
    },
    updateProgress: (state, action: PayloadAction<UpdateProgressPayload>) => {
      if (!state.currentCourse) return;

      const { moduleId, lessonId, isCompleted } = action.payload;

      // Update lesson completion status
      const courseModule = state.currentCourse.modules.find(
        (m) => m.id === moduleId
      );
      if (courseModule) {
        const lesson = courseModule.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.isCompleted = isCompleted;

          // Update module completion status
          courseModule.isCompleted = courseModule.lessons.every(
            (l) => l.isCompleted
          );

          // Update course progress
          const totalLessons = state.currentCourse.modules.flatMap(
            (m) => m.lessons
          ).length;
          const completedLessons = state.currentCourse.modules
            .flatMap((m) => m.lessons)
            .filter((l) => l.isCompleted).length;

          state.currentCourse.currentProgress = Math.round(
            (completedLessons / totalLessons) * 100
          );
          state.currentCourse.completedLessons = completedLessons;
          state.currentCourse.totalLessons = totalLessons;
        }
      }
    },
    toggleModuleExpansion: (state, action: PayloadAction<string>) => {
      if (!state.currentCourse) return;

      const courseModule = state.currentCourse.modules.find(
        (m) => m.id === action.payload
      );
      if (courseModule) {
        courseModule.isExpanded = !courseModule.isExpanded;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCourse,
  setCurrentLesson,
  updateProgress,
  toggleModuleExpansion,
  setLoading,
  setError,
} = lmsSlice.actions;

export default lmsSlice.reducer;
