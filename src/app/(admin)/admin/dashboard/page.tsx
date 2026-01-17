"use client";

import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import { useGetRealPostsQuery } from "@/store/features/feed/feedApi";

export default function AdminDashboardPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const isAdmin = auth?.user?.role === "admin";

  const shouldSkipPosts = !auth?.isAuthenticated || !isAdmin;
  const {
    data: posts = [],
    isLoading: postsLoading,
    isFetching: postsFetching,
    isError: postsIsError,
  } = useGetRealPostsQuery(undefined, {
    skip: shouldSkipPosts,
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Real User Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {postsLoading || postsFetching ? (
            <div>Loading posts...</div>
          ) : postsIsError ? (
            <div className="text-red-600">Failed to load posts.</div>
          ) : posts?.length ? (
            <div className="space-y-6">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No posts found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

