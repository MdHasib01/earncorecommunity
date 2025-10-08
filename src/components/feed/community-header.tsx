"use client";

import { useGetAllCommunitiesQuery } from "@/store/features/community/communityApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "./create-post-dialog";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AuthRequiredDialog } from "./auth-required-dialog";

interface CommunityHeaderProps {
  communitySlug: string;
}

export function CommunityHeader({ communitySlug }: CommunityHeaderProps) {
  const { data: communities, isLoading } = useGetAllCommunitiesQuery();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const community = useMemo(
    () =>
      communities?.find(
        (c) =>
          c.name.toLowerCase().replace(/\s+/g, "-") ===
          communitySlug.toLowerCase()
      ),
    [communities, communitySlug]
  );

  const handleOpenCreatePost = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!community) {
    return (
      <Card className="p-6 mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold capitalize mb-2">
            {communitySlug.replace(/-/g, " ")}
          </h1>
          <p className="text-muted-foreground">
            Community information not available
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-start space-x-4 flex-wrap">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={community.icon}
            alt={community.name}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-bold">
            {community.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3 ">
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <Badge variant="secondary" className="capitalize">
                  {community.category.replace(/-/g, " ")}
                </Badge>
              </div>

              <Button onClick={handleOpenCreatePost} className="w-full md:w-auto">
                <PenSquare className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>

            {community.description && (
              <p className="text-muted-foreground leading-relaxed">
                {community.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            {/* <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>
                {community.memberCount?.toLocaleString() || 0} members
              </span>
            </div> */}

            {/* <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{community.postCount?.toLocaleString() || 0} posts</span>
            </div> */}

            {community?.lastUpdatedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated{" "}
                  {new Date(community.lastUpdatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        communityId={community._id}
        communityName={community.name}
      />

      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        description="Please log in to share a post with the community."
      />
    </Card>
  );
}
