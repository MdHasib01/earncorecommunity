import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import TopRightMenu from "@/components/top-right-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Earn Core Communityd",
  description: "Community for Earn Core",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky z-50 top-0 flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
            <div>
              <SidebarTrigger className="-ml-1" />
            </div>
            <TopRightMenu />
          </header>

          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
