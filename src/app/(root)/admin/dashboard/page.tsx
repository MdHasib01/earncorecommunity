"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import { useGetRealPostsQuery } from "@/store/features/feed/feedApi";
import { useGetNotificationsQuery } from "@/store/features/notifications/notificationsApi";

export default function AdminDashboardPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const isAdmin = auth?.user?.role === "admin";

  const shouldSkipPosts = !auth?.isAuthenticated || !isAdmin;
  const {
    data: posts = [],
    isLoading: postsLoading,
    isFetching: postsFetching,
    isError: postsIsError,
    error: postsError,
  } = useGetRealPostsQuery(undefined, {
    skip: shouldSkipPosts,
    refetchOnMountOrArgChange: true,
  });
  console.log("posts-----", posts);
  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetNotificationsQuery(undefined, {
      skip: !isAdmin,
    });

  const [tab, setTab] = useState("real-posts");

  useEffect(() => {
    if (!auth?.isAuthenticated || !isAdmin) {
      router.replace("/");
    }
  }, [auth?.isAuthenticated, isAdmin, router]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="real-posts">Real User Posts</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="real-posts" className="mt-6">
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
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                {notificationsLoading ? (
                  <div>Loading notifications...</div>
                ) : notifications?.length ? (
                  <div className="space-y-4">
                    {notifications.map((n: any) => (
                      <div
                        key={n._id || n.title}
                        className="p-4 border rounded-md"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{n.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {n.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {n.title}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No notifications.</div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
