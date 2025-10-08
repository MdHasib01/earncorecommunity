"use client";
import * as React from "react";
import { ChevronRight, MicIcon as icons } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchDialouge } from "./search-dialouge";
import { isAbsolute } from "path";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Trophy } from "lucide-react";
import { useGetAllCommunitiesQuery } from "@/store/features/community/communityApi";
import { useTheme } from "next-themes";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Courses",
      url: "#",
      items: [
        {
          title: "Master The Hiring Game",
          url: "/course/1",
          icon: "trophy",
        },
      ],
    },
  ],
};

const makeLink = (href: string) => href.toLowerCase().replaceAll(" ", "-");

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: communities = [] } = useGetAllCommunitiesQuery();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger className="font-bold!">
                  <Link href="/">Communities</Link>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {communities.map((item) => (
                      <SidebarMenuItem key={item?._id}>
                        <SidebarMenuButton asChild>
                          <Link href={`/feed/${makeLink(item?.name)}`}>
                            <div className="flex items-center gap-2">
                              {item?.icon && (
                                <img
                                  width={20}
                                  src={
                                    item?.icon ||
                                    "http://res.cloudinary.com/mdhasib/image/upload/v1757133279/jhjgy8r5uuellcbqmts7.png"
                                  }
                                  alt="logo"
                                ></img>
                              )}
                              {item?.name}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {/* All Communities Link */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-5 h-5 rounded border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                              <span className="text-xs">+</span>
                            </div>
                            View All Communities
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger className="font-bold!">
                  {item.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <Link href={subItem.url}>
                            <div className="flex items-center gap-2">
                              {subItem.icon === "trophy" && <Trophy className="w-5 h-5" />}
                              {subItem.icon === "book" && <BookOpen className="w-5 h-5" />}
                              {subItem.title}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
