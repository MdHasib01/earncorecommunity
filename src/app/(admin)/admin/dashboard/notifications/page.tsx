"use client";

import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetNotificationsQuery } from "@/store/features/notifications/notificationsApi";

export default function AdminNotificationsPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const isAdmin = auth?.user?.role === "admin";

  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetNotificationsQuery(undefined, {
      skip: !auth?.isAuthenticated || !isAdmin,
    });

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notificationsLoading ? (
            <div>Loading notifications...</div>
          ) : notifications?.length ? (
            <div className="space-y-4">
              {notifications.map((n: any) => (
                <div key={n._id || n.title} className="p-4 border rounded-md">
                  <div className="flex justify-between">
                    <span className="font-semibold">{n.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {n.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{n.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No notifications.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

