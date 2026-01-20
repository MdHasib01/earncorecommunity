"use client";
import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Headset,
  MicIcon as icons,
  Megaphone,
} from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchDialouge } from "./search-dialouge";
import { isAbsolute } from "path";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Trophy, ContactRound, Layers, Play } from "lucide-react";
import { useGetAllCommunitiesQuery } from "@/store/features/community/communityApi";
import { useTheme } from "next-themes";
import { useGetCoursesQuery } from "@/lms/store/lms.api";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentLesson, toggleModuleExpansion } from "@/lms/store/lms.slice";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Courses",
      url: "#",
      items: [],
    },
    {
      title: "Contact",
      url: "#",
      items: [
        {
          title: "Contacts",
          url: "/contacts",
          icon: <Headset className="h-4 w-4" />,
        },
        {
          title: "Media Kit",
          url: "/media-kit",
          icon: <Megaphone className="h-4 w-4" />,
        },
      ],
    },
  ],
};

const makeLink = (href: string) => href.toLowerCase().replaceAll(" ", "-");

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: communities = [] } = useGetAllCommunitiesQuery();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {
    data: courses = [],
    isLoading,
    isFetching,
    isError,
  } = useGetCoursesQuery();
  const { currentCourse, currentLesson } = useSelector(
    (state: RootState) => state.lms,
  );

  const activeCourseId = React.useMemo(() => {
    const match = pathname.match(/^\/course\/([^/?#]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const activeCourse =
    currentCourse?.id === activeCourseId ? currentCourse : null;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}

        <Collapsible defaultOpen className="group/collapsible">
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
        </Collapsible>
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen
            className="group/collapsible"
          >
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
                    {item.title === "Courses" ? (
                      isLoading || isFetching ? (
                        <>
                          <SidebarMenuItem>
                            <div className="px-3 py-2 text-xs text-muted-foreground">
                              Loading courses...
                            </div>
                          </SidebarMenuItem>
                        </>
                      ) : isError ? (
                        <SidebarMenuItem>
                          <div className="px-3 py-2 text-xs text-destructive">
                            Failed to load courses.
                          </div>
                        </SidebarMenuItem>
                      ) : courses.length ? (
                        courses.map((c) => {
                          const isActiveCourse = pathname.startsWith(
                            `/course/${c._id}`,
                          );

                          return (
                            <SidebarMenuItem key={c._id}>
                              <SidebarMenuButton
                                asChild
                                isActive={isActiveCourse}
                              >
                                <Link href={`/course/${c._id}`}>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    {c.title}
                                  </div>
                                </Link>
                              </SidebarMenuButton>

                              {isActiveCourse && activeCourse ? (
                                <SidebarMenuSub>
                                  {activeCourse.modules.map(
                                    (m, moduleIndex) => (
                                      <SidebarMenuSubItem key={m.id}>
                                        <Collapsible
                                          open={!!m.isExpanded}
                                          onOpenChange={() =>
                                            dispatch(
                                              toggleModuleExpansion(m.id),
                                            )
                                          }
                                        >
                                          <CollapsibleTrigger asChild>
                                            <SidebarMenuSubButton asChild>
                                              <button className="w-full">
                                                <div className="flex w-full items-center gap-2">
                                                  {m.isExpanded ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                  ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                  )}
                                                  <Layers className="h-4 w-4" />
                                                  <span className="min-w-0 flex-1 truncate">
                                                    {moduleIndex + 1}. {m.title}
                                                  </span>
                                                </div>
                                              </button>
                                            </SidebarMenuSubButton>
                                          </CollapsibleTrigger>

                                          <CollapsibleContent>
                                            <SidebarMenuSub>
                                              {m.lessons.map(
                                                (l, lessonIndex) => (
                                                  <SidebarMenuSubItem
                                                    key={l.id}
                                                  >
                                                    <SidebarMenuSubButton
                                                      asChild
                                                      size="sm"
                                                      isActive={
                                                        currentLesson?.id ===
                                                        l.id
                                                      }
                                                    >
                                                      <button
                                                        className="w-full"
                                                        onClick={() =>
                                                          dispatch(
                                                            setCurrentLesson({
                                                              lesson: l,
                                                              module: m,
                                                            }),
                                                          )
                                                        }
                                                      >
                                                        <div className="flex w-full items-center gap-2">
                                                          <Play className="h-4 w-4" />
                                                          <span className="min-w-0 flex-1 truncate">
                                                            {moduleIndex + 1}.
                                                            {lessonIndex + 1}{" "}
                                                            {l.title}
                                                          </span>
                                                        </div>
                                                      </button>
                                                    </SidebarMenuSubButton>
                                                  </SidebarMenuSubItem>
                                                ),
                                              )}
                                            </SidebarMenuSub>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </SidebarMenuSubItem>
                                    ),
                                  )}
                                </SidebarMenuSub>
                              ) : null}
                            </SidebarMenuItem>
                          );
                        })
                      ) : (
                        <SidebarMenuItem>
                          <div className="px-3 py-2 text-xs text-muted-foreground">
                            No courses found.
                          </div>
                        </SidebarMenuItem>
                      )
                    ) : (
                      item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link href={subItem.url}>
                              <div className="flex items-center gap-2">
                                {subItem.icon}
                                {subItem.title}
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
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
