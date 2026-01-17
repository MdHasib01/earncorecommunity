"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { AdminSidebar } from "@/components/admin-sidebar";
import TopRightMenu from "@/components/top-right-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const isAdmin = auth?.user?.role === "admin";

  useEffect(() => {
    if (!auth?.isAuthenticated || !isAdmin) {
      router.replace("/");
    }
  }, [auth?.isAuthenticated, isAdmin, router]);

  if (!auth?.isAuthenticated || !isAdmin) return null;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="bg-background sticky z-50 top-0 flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="text-sm font-semibold">Admin Dashboard</div>
          </div>
          <TopRightMenu />
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

