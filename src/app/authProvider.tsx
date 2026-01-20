// components/AuthProvider.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { useGetCurrentUserQuery } from "../store/features/authentication/authApi";
import { setUser, clearUser } from "../store/features/authentication/authSlice";
import { getCookie } from "@/utils/cookies";
import { useGetWatchedContentIdsQuery } from "@/lms/store/lms.api";
import { setWatchedContentIds } from "@/lms/store/lms.slice";

const AUTH_FREE_ROUTES = new Set(["/login", "/signup"]);
const WATCHED_STORAGE_KEY = "watchedCourseContentIds";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const hasAccessToken = useMemo(
    () => !!getCookie("accessToken"),
    [isMounted, pathname]
  );
  const shouldSkip = !isMounted || (AUTH_FREE_ROUTES.has(pathname) && !hasAccessToken);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: user, isLoading, isFetching, isError } =
    useGetCurrentUserQuery(undefined, {
      // This will automatically refetch when the component mounts
      refetchOnMountOrArgChange: true,
      // Only run on the client to avoid SSR/client HTML mismatches
      skip: shouldSkip,
    });

  useEffect(() => {
    if (!isMounted) return;
    try {
      const stored = localStorage.getItem(WATCHED_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
          dispatch(setWatchedContentIds(parsed));
        }
      }
    } catch {}
  }, [isMounted, dispatch]);

  const shouldSkipWatched = shouldSkip || !user;
  const { data: watchedIds } = useGetWatchedContentIdsQuery(undefined, {
    skip: shouldSkipWatched,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (shouldSkipWatched) return;
    if (!watchedIds) return;
    dispatch(setWatchedContentIds(watchedIds));
    try {
      localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watchedIds));
    } catch {}
  }, [watchedIds, shouldSkipWatched, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else if (isError && !shouldSkip) {
      dispatch(clearUser());
    }
  }, [user, isError, shouldSkip, dispatch]);

  if (!isMounted) {
    return null;
  }

  // Show loading state while checking authentication
  if (!shouldSkip && (isLoading || isFetching)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
