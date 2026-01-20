import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "@/utils/cookies";
import { Course } from "../types/lms.types";

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

type CourseSummaryDto = {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CourseWithStatsDto = {
  _id: string;
  title: string;
  description?: string;
  totalDuration?: number;
  lessonsCount?: number;
};

type ModuleSummaryDto = {
  _id: string;
  title: string;
  description?: string;
  course: string;
  createdAt?: string;
  updatedAt?: string;
};

type ModuleWithStatsDto = ModuleSummaryDto & {
  totalDuration?: number;
  lessonsCount?: number;
};

type ContentDto = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  youtubeVideoLink: string;
  thumbnail?: string;
  module: string;
};

type DeleteResultDto = { deleted: true };

const extractData = <T>(result: unknown): T => {
  const res = result as { data?: unknown };
  const payload = res?.data as ApiResponse<T> | T | undefined;
  if (payload && typeof payload === "object" && "data" in (payload as any)) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

const paramsSerializer = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const lmsApi = createApi({
  reducerPath: "lmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("content-type", "application/json");
      const token = getCookie("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    paramsSerializer,
  }),
  tagTypes: [
    "Course",
    "Courses",
    "Module",
    "Modules",
    "Content",
    "Contents",
    "Watched",
  ],
  endpoints: (builder) => ({
    getCourse: builder.query<Course, string>({
      queryFn: async (courseId, api, extraOptions, baseQuery) => {
        const courseResult = await baseQuery({
          url: `courses/${courseId}`,
          method: "GET",
        });
        if (courseResult.error) return { error: courseResult.error as any };

        const courseDto = extractData<CourseWithStatsDto>(courseResult);

        const modulesResult = await baseQuery({
          url: "modules",
          method: "GET",
          params: { course: courseId },
        });
        if (modulesResult.error) return { error: modulesResult.error as any };

        const moduleDtos = extractData<ModuleSummaryDto[]>(modulesResult) ?? [];

        const modules = await Promise.all(
          moduleDtos.map(async (m, index) => {
            const contentsResult = await baseQuery({
              url: "contents",
              method: "GET",
              params: { module: m._id },
            });
            if (contentsResult.error) {
              return {
                id: m._id,
                title: m.title,
                description: m.description,
                isCompleted: false,
                isExpanded: index === 0,
                totalDuration: 0,
                lessons: [],
              };
            }

            const contents = extractData<ContentDto[]>(contentsResult) ?? [];
            const lessons = contents.map((c) => ({
              id: c._id,
              title: c.title,
              description: c.description,
              videoUrl: c.youtubeVideoLink,
              duration: c.duration,
              thumbnail: c.thumbnail,
              isCompleted: false,
            }));

            const totalDuration = lessons.reduce(
              (sum, l) => sum + (l.duration || 0),
              0
            );

            return {
              id: m._id,
              title: m.title,
              description: m.description,
              isCompleted: false,
              isExpanded: index === 0,
              totalDuration,
              lessons,
            };
          })
        );

        const totalLessons =
          courseDto.lessonsCount ?? modules.flatMap((m) => m.lessons).length;
        const completedLessons = 0;
        const currentProgress = 0;

        return {
          data: {
            id: courseDto._id,
            title: courseDto.title,
            description: courseDto.description,
            modules,
            currentProgress,
            totalLessons,
            completedLessons,
            totalDuration: courseDto.totalDuration,
          },
        };
      },
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
      ],
    }),

    getCourses: builder.query<CourseSummaryDto[], void>({
      query: () => ({ url: "courses", method: "GET" }),
      transformResponse: (response: ApiResponse<CourseSummaryDto[]>) =>
        response?.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Course" as const, id: c._id })),
              { type: "Courses" as const, id: "LIST" },
            ]
          : [{ type: "Courses" as const, id: "LIST" }],
    }),

    getCourseDetails: builder.query<CourseWithStatsDto, string>({
      query: (id) => ({ url: `courses/${id}`, method: "GET" }),
      transformResponse: (response: ApiResponse<CourseWithStatsDto>) =>
        response.data,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<
      CourseSummaryDto,
      { title: string; description?: string }
    >({
      query: (body) => ({ url: "courses", method: "POST", body }),
      transformResponse: (response: ApiResponse<CourseSummaryDto>) =>
        response.data,
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),

    updateCourse: builder.mutation<
      CourseSummaryDto,
      { id: string; title?: string; description?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `courses/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<CourseSummaryDto>) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Course", id },
        { type: "Courses", id: "LIST" },
      ],
    }),

    deleteCourse: builder.mutation<DeleteResultDto, string>({
      query: (id) => ({ url: `courses/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<DeleteResultDto>) =>
        response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Course", id },
        { type: "Courses", id: "LIST" },
      ],
    }),

    getModules: builder.query<ModuleSummaryDto[], { course?: string } | void>({
      query: (arg) => ({
        url: "modules",
        method: "GET",
        params: arg && "course" in arg ? { course: arg.course } : undefined,
      }),
      transformResponse: (response: ApiResponse<ModuleSummaryDto[]>) =>
        response?.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((m) => ({ type: "Module" as const, id: m._id })),
              { type: "Modules" as const, id: "LIST" },
            ]
          : [{ type: "Modules" as const, id: "LIST" }],
    }),

    getModuleDetails: builder.query<ModuleWithStatsDto, string>({
      query: (id) => ({ url: `modules/${id}`, method: "GET" }),
      transformResponse: (response: ApiResponse<ModuleWithStatsDto>) =>
        response.data,
      providesTags: (result, error, id) => [{ type: "Module", id }],
    }),

    createModule: builder.mutation<
      ModuleSummaryDto,
      { title: string; description?: string; courseId: string }
    >({
      query: ({ courseId, ...body }) => ({
        url: "modules",
        method: "POST",
        body: { ...body, courseId },
      }),
      transformResponse: (response: ApiResponse<ModuleSummaryDto>) =>
        response.data,
      invalidatesTags: [{ type: "Modules", id: "LIST" }],
    }),

    updateModule: builder.mutation<
      ModuleSummaryDto,
      { id: string; title?: string; description?: string; courseId?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `modules/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<ModuleSummaryDto>) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Module", id },
        { type: "Modules", id: "LIST" },
      ],
    }),

    deleteModule: builder.mutation<DeleteResultDto, string>({
      query: (id) => ({ url: `modules/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<DeleteResultDto>) =>
        response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Module", id },
        { type: "Modules", id: "LIST" },
      ],
    }),

    getContents: builder.query<ContentDto[], { module?: string } | void>({
      query: (arg) => ({
        url: "contents",
        method: "GET",
        params: arg && "module" in arg ? { module: arg.module } : undefined,
      }),
      transformResponse: (response: ApiResponse<ContentDto[]>) =>
        response?.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Content" as const, id: c._id })),
              { type: "Contents" as const, id: "LIST" },
            ]
          : [{ type: "Contents" as const, id: "LIST" }],
    }),

    getContentDetails: builder.query<ContentDto, string>({
      query: (id) => ({ url: `contents/${id}`, method: "GET" }),
      transformResponse: (response: ApiResponse<ContentDto>) => response.data,
      providesTags: (result, error, id) => [{ type: "Content", id }],
    }),

    createContent: builder.mutation<
      ContentDto,
      {
        title: string;
        description?: string;
        duration: number;
        youtubeVideoLink: string;
        moduleId: string;
      }
    >({
      query: ({ moduleId, ...body }) => ({
        url: "contents",
        method: "POST",
        body: { ...body, moduleId },
      }),
      transformResponse: (response: ApiResponse<ContentDto>) => response.data,
      invalidatesTags: [{ type: "Contents", id: "LIST" }],
    }),

    updateContent: builder.mutation<
      ContentDto,
      {
        id: string;
        title?: string;
        description?: string;
        duration?: number;
        youtubeVideoLink?: string;
        moduleId?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `contents/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<ContentDto>) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Content", id },
        { type: "Contents", id: "LIST" },
      ],
    }),

    deleteContent: builder.mutation<DeleteResultDto, string>({
      query: (id) => ({ url: `contents/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<DeleteResultDto>) =>
        response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Content", id },
        { type: "Contents", id: "LIST" },
      ],
    }),

    markWatched: builder.mutation<void, { courseContentId: string }>({
      query: (body) => ({ url: "watched", method: "POST", body }),
      transformResponse: () => undefined,
      invalidatesTags: (result, error, body) => [
        { type: "Content", id: body.courseContentId },
        { type: "Watched", id: "LIST" },
      ],
    }),

    getWatchedContentIds: builder.query<string[], void>({
      query: () => ({ url: "watched", method: "GET" }),
      transformResponse: (
        response: ApiResponse<{ courseContentIds: string[] }>
      ) => response?.data?.courseContentIds ?? [],
      providesTags: [{ type: "Watched", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCourseQuery,
  useGetCoursesQuery,
  useGetCourseDetailsQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetModulesQuery,
  useGetModuleDetailsQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useGetContentsQuery,
  useGetContentDetailsQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useMarkWatchedMutation,
  useGetWatchedContentIdsQuery,
  useLazyGetWatchedContentIdsQuery,
} = lmsApi;
