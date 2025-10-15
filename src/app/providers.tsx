"use client";

import React, { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "../store/store";
import { useGetCurrentUserQuery } from "@/store/features/authentication/authApi";
import { useLazyGetUserLikedPostsQuery } from "@/store/features/feed/feedApi";
import {
  resetLikesState,
  setLikedPosts,
} from "@/store/features/feed/likesSlice";
import { UserLikedPost } from "@/store/features/feed/types";
import { getCookie } from "@/utils/cookies";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      <LikesHydrator />
      {children}
    </Provider>
  );
}

function AuthHydrator() {
  const hasToken = typeof window !== "undefined" && !!getCookie("accessToken");
  useGetCurrentUserQuery(undefined, { skip: !hasToken });
  return null;
}

function LikesHydrator() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isInitialized = useSelector(
    (state: RootState) => state.likes.isInitialized
  );
  const likedPostCount = useSelector(
    (state: RootState) => Object.keys(state.likes.likedPostIds).length
  );
  const [fetchLikedPosts, { reset }] = useLazyGetUserLikedPostsQuery();
  const isFetchingRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    if (isAuthenticated && !isInitialized && !isFetchingRef.current) {
      isFetchingRef.current = true;

      (async () => {
        try {
          const response = await fetchLikedPosts({
            page: 1,
            limit: 100,
          }).unwrap();

          if (isCancelled) {
            return;
          }

          const entries = Array.isArray(response)
            ? (response.filter(
                (item) => item?.post?._id
              ) as UserLikedPost[])
            : [];

          dispatch(setLikedPosts(entries));
          reset();
        } catch (error) {
          if (!isCancelled) {
            console.error("Failed to load liked posts:", error);
          }
        } finally {
          if (!isCancelled) {
            isFetchingRef.current = false;
          }
        }
      })();
    }

    if (!isAuthenticated && (isInitialized || likedPostCount > 0)) {
      dispatch(resetLikesState());
      reset();
      isFetchingRef.current = false;
    }

    return () => {
      isCancelled = true;
    };
  }, [
    dispatch,
    fetchLikedPosts,
    isAuthenticated,
    isInitialized,
    likedPostCount,
    reset,
  ]);

  return null;
}
