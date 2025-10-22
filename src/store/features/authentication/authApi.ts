// store/api/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials, logout, setError } from "./authSlice";
import type { RootState } from "../../store";
import {
  AuthResponse,
  LoginCredentials,
  PasswordChangeData,
  RegisterData,
  ResetPasswordData,
} from "@/store/types";
import { User } from "../feed/types";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include" as const,
  prepareHeaders: (headers) => {
    headers.set("content-type", "application/json");
    return headers;
  },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle token refresh on 401
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/users/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { user } = refreshResult.data as AuthResponse;

      api.dispatch(setCredentials({ user }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation<{ user: User }, LoginCredentials>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: AuthResponse }) => {
        const { user } = response.data;
        return { user };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error: any) {
          dispatch(setError(error.error?.data?.message || "Login failed"));
        }
      },
    }),
    verifyOtp: builder.mutation({
      query: (credentials) => ({
        url: "/users/verify-otp",
        method: "POST",
        body: credentials,
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error: any) {
          dispatch(
            setError(error.error?.data?.message || "Verification failed")
          );
        }
      },
    }),
    // Register mutation
    register: builder.mutation<{ user: User }, RegisterData>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: AuthResponse) => {
        const { user } = response;
        return { user };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error: any) {
          dispatch(
            setError(error.error?.data?.message || "Registration failed")
          );
        }
      },
    }),

    // Logout mutation
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.error("Logout error:", error);
        } finally {
          dispatch(logout());
        }
      },
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: "users/checkUser", method: "GET" }),
      providesTags: ["User"],
      transformResponse: (response: { user: User }) => {
        return response.user;
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch (error: any) {
          if (error.error?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),

    // Refresh token
    refreshToken: builder.mutation<{ user: User }, void>({
      query: () => ({
        url: "/users/refresh",
        method: "POST",
      }),
      transformResponse: (response: AuthResponse) => {
        const { user } = response;
        return { user };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          dispatch(logout());
        }
      },
    }),

    // Change password
    changePassword: builder.mutation<{ message: string }, PasswordChangeData>({
      query: (passwordData) => ({
        url: "/change-password",
        method: "PUT",
        body: passwordData,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: ({ email }) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordData>({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: "/reset-password",
        method: "POST",
        body: { token, newPassword, confirmPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} = authApi;
