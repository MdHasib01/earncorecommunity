// components/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetCurrentUserQuery } from "../store/features/authentication/authApi";
import { setUser, clearUser } from "../store/features/authentication/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: user, isLoading, isFetching, isError } =
    useGetCurrentUserQuery(undefined, {
      // This will automatically refetch when the component mounts
      refetchOnMountOrArgChange: true,
      // Only run on the client to avoid SSR/client HTML mismatches
      skip: !isMounted,
    });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [user, isError, dispatch]);

  if (!isMounted) {
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
