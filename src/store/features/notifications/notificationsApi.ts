import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NotificationItem } from "./types";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationItem[], void>({
      query: () => ({ url: "notifications/getNotification", method: "GET" }),
      transformResponse: (response: any) => {
        // Support both raw array or { data: [] }
        if (Array.isArray(response)) return response as NotificationItem[];
        if (response?.data && Array.isArray(response.data)) {
          return response.data as NotificationItem[];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((n) => ({ type: "Notifications" as const, id: n._id || n.title })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    markAllRead: builder.mutation<{ success?: boolean }, void>({
      query: () => ({ url: "notifications/markAllRead", method: "POST" }),
      transformResponse: (response: any) => response?.data ?? response ?? {},
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAllReadMutation } = notificationsApi;