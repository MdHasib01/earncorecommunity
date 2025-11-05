"use client";

import { BadgeCheck, User, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SearchDialouge } from "@/components/search-dialouge";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLogoutMutation } from "@/store/features/authentication/authApi";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
} from "@/store/features/notifications/notificationsApi";
import { RootState } from "@/store/store";
const UserAvatar = ({ user, onClick }: { user: any; onClick?: () => void }) => {
  return (
    <div
      className="flex items-center space-x-3 hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          className="object-cover"
          src={user?.avatar}
          alt={user?.fullName}
        />
        <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-left">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col ">
            <span className="font-semibold text-sm text-foreground">
              {user?.fullName}
            </span>
            <span className="text-xs text-foreground-muted">
              @{user?.username}
            </span>
          </div>

          {/* {user?.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />} */}
        </div>
      </div>
    </div>
  );
};

const TopRightMenu = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const isAdmin = auth?.user?.role === "admin";
  const { data: notifications = [], refetch } = useGetNotificationsQuery(
    undefined,
    {
      skip: !auth?.isAuthenticated || !isAdmin,
    }
  );
  const [markAllRead] = useMarkAllReadMutation();

  const handleProfileClick = () => {
    router.push("/my-profile");
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, redirect to login
      router.push("/login");
    }
  };
  return (
    <div className="flex items-center gap-4">
      <SearchDialouge />
      {auth.isAuthenticated && isAdmin && (
        <>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="rounded-3xl">
              Dashboard
            </Button>
          </Link>
          <DropdownMenu
            onOpenChange={async (open) => {
              if (!open) {
                try {
                  await markAllRead().unwrap();
                } catch (error) {
                  // ignore errors
                } finally {
                  refetch();
                }
              }
            }}
          >
            <DropdownMenuTrigger className="relative">
              <Bell />
              {notifications?.length ? (
                <span className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full px-1">
                  {notifications.length}
                </span>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Unread Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications?.filter((n: any) => n.status === "unread")
                .length ? (
                notifications
                  .filter((n: any) => n.status === "unread")
                  .map((n: any) => (
                    <DropdownMenuItem
                      key={(n as any)._id || n.title}
                      className="flex-col items-start"
                    >
                      <div className="text-sm font-bold">{n.username}</div>
                      <Link href={`/post/${n?.post}`}>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {n.title}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))
              ) : (
                <DropdownMenuItem className="text-sm text-muted-foreground">
                  No unread notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {isDesktop ? (
        auth.isAuthenticated ? (
          <UserAvatar user={auth?.user} onClick={handleProfileClick} />
        ) : (
          <div className="flex items-center gap-2 border-l pl-4">
            <Link href="/login">
              <Button variant="outline" className="rounded-3xl">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-3xl">Join</Button>
            </Link>
          </div>
        )
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            {auth.isAuthenticated ? <UserAvatar user={auth?.user} /> : <User />}
          </DropdownMenuTrigger>
          {auth.isAuthenticated ? (
            <DropdownMenuContent>
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
                </Link>
              )}
              <Link href="/my-profile">
                <DropdownMenuItem>My Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent>
              <Link href="/login">
                <DropdownMenuItem>Login</DropdownMenuItem>
              </Link>
              <Link href="/signup">
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      )}
    </div>
  );
};

export default TopRightMenu;
