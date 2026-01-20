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
  watchedContentIds: [],
  isLoading: false,
  error: null,
};

const applyWatchedToCourse = (course: Course, watchedContentIds: string[]) => {
  const watched = new Set(watchedContentIds);
  const modules = course.modules.map((m) => {
    const lessons = m.lessons.map((l) => ({
      ...l,
      isCompleted: watched.has(l.id),
    }));

    return {
      ...m,
      lessons,
      isCompleted: lessons.every((l) => l.isCompleted),
    };
  });

  const totalLessons = modules.flatMap((m) => m.lessons).length;
  const completedLessons = modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.isCompleted).length;

  const currentProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    ...course,
    modules,
    totalLessons,
    completedLessons,
    currentProgress,
  };
};

const syncCurrentPointers = (state: LMSState) => {
  if (!state.currentCourse) return;
  if (!state.currentLesson) return;

  for (const m of state.currentCourse.modules) {
    const lesson = m.lessons.find((l) => l.id === state.currentLesson?.id);
    if (lesson) {
      state.currentLesson = lesson;
      state.currentModule = m;
      return;
    }
  }
};

const ensureDefaultLesson = (state: LMSState) => {
  if (!state.currentCourse) return;
  if (state.currentLesson) return;

  const flat = state.currentCourse.modules.flatMap((m) =>
    m.lessons.map((l) => ({ module: m, lesson: l })),
  );

  const firstIncomplete = flat.find(({ lesson }) => !lesson.isCompleted);
  if (firstIncomplete) {
    state.currentLesson = firstIncomplete.lesson;
    state.currentModule = firstIncomplete.module;
    return;
  }

  const last = flat.at(-1);
  if (last) {
    state.currentLesson = last.lesson;
    state.currentModule = last.module;
  }
};

const lmsSlice = createSlice({
  name: "lms",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<Course>) => {
      const courseWithWatched = applyWatchedToCourse(
        action.payload,
        state.watchedContentIds,
      );
      state.currentCourse = courseWithWatched;
      syncCurrentPointers(state);
      ensureDefaultLesson(state);
    },
    setCurrentLesson: (
      state,
      action: PayloadAction<{ lesson: Lesson; module: Module }>,
    ) => {
      state.currentLesson = action.payload.lesson;
      state.currentModule = action.payload.module;
    },
    setWatchedContentIds: (state, action: PayloadAction<string[]>) => {
      state.watchedContentIds = action.payload;
      if (state.currentCourse) {
        state.currentCourse = applyWatchedToCourse(
          state.currentCourse,
          state.watchedContentIds,
        );
        syncCurrentPointers(state);
        ensureDefaultLesson(state);
      }
    },
    markWatchedContentId: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.watchedContentIds.includes(id)) {
        state.watchedContentIds.push(id);
      }
      if (state.currentCourse) {
        state.currentCourse = applyWatchedToCourse(
          state.currentCourse,
          state.watchedContentIds,
        );
        syncCurrentPointers(state);
        ensureDefaultLesson(state);
      }
    },
    updateProgress: (state, action: PayloadAction<UpdateProgressPayload>) => {
      if (!state.currentCourse) return;

      const { moduleId, lessonId, isCompleted } = action.payload;

      // Update lesson completion status
      const courseModule = state.currentCourse.modules.find(
        (m) => m.id === moduleId,
      );
      if (courseModule) {
        const lesson = courseModule.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.isCompleted = isCompleted;

          // Update module completion status
          courseModule.isCompleted = courseModule.lessons.every(
            (l) => l.isCompleted,
          );

          // Update course progress
          const totalLessons = state.currentCourse.modules.flatMap(
            (m) => m.lessons,
          ).length;
          const completedLessons = state.currentCourse.modules
            .flatMap((m) => m.lessons)
            .filter((l) => l.isCompleted).length;

          state.currentCourse.currentProgress = Math.round(
            (completedLessons / totalLessons) * 100,
          );
          state.currentCourse.completedLessons = completedLessons;
          state.currentCourse.totalLessons = totalLessons;
        }
      }
    },
    toggleModuleExpansion: (state, action: PayloadAction<string>) => {
      if (!state.currentCourse) return;

      const courseModule = state.currentCourse.modules.find(
        (m) => m.id === action.payload,
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
  setWatchedContentIds,
  markWatchedContentId,
  updateProgress,
  toggleModuleExpansion,
  setLoading,
  setError,
} = lmsSlice.actions;

export default lmsSlice.reducer;
