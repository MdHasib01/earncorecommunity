"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/store/features/feed/types";
import { CommentsDrawer } from "./comments-drawer";
import { PostContentDialog } from "./post-content-dialog";
import {
  useDeletePostMutation,
} from "@/store/features/feed/feedApi";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface MyPostCardProps {
  post: Post;
  isAuthenticated: boolean;
}

export function MyPostCard({ post, isAuthenticated }: MyPostCardProps) {
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleCommentsClick = () => {
    setIsCommentsDrawerOpen(true);
  };

  const handleContentClick = () => {
    setIsContentDialogOpen(true);
  };

  const formatContent = (content: string) => {
    if (!content) return "";

    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>")
      .replace(/^(\s*)\* (.+)/gm, "$1• $2")
      .replace(
        /^>\s*(.+)/gm,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>'
      );
  };

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const shouldShowReadMore = post.content && post.content.length > 300;

  const likesCount =
    (post.engagementMetrics?.likes || 0) + (post.localEngagement?.likes || 0);

  return (
    <>
      <article className="bg-card rounded-lg border border-border hover:border-accent transition-colors duration-200">
        <div className="flex items-center justify-between p-4 pb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                className="object-cover"
                src={post?.owner?.avatar}
                alt={post?.owner?.fullName}
              />
              <AvatarFallback>
                {post?.owner?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">
                  {post?.owner?.fullName}
                </span>
              </div>
              <div className="flex flex-col gap-1 space-x-2 text-sm text-muted-foreground">
                <span className="text-xs font-semibold">
                  @{post?.owner?.username}
                </span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-4 pb-4">
          <h2 className="text-xl font-bold text-foreground mb-3 leading-tight">
            {post.title}
          </h2>
          <div className="prose wrap-break-word leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: formatContent(truncateContent(post.content)),
              }}
            />
            {shouldShowReadMore && (
              <button
                onClick={handleContentClick}
                className="text-primary hover:text-primary/80 font-medium mt-2 inline-block"
              >
                Read more
              </button>
            )}
          </div>
        </div>

        {post.image && (
          <div className="px-4 pb-4">
            <img
              src={post.image}
              alt="Post image"
              className="w-full rounded-lg object-cover max-h-96 cursor-pointer"
              onClick={handleContentClick}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-2 pt-4 border-t border-border">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Heart className={cn("h-5 w-5")} />
              {likesCount > 0 && (
                <span className="text-sm font-medium">{likesCount}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentsClick}
              className="flex items-center space-x-1 text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <MessageCircle className="h-5 w-5" />
              {post.engagementMetrics?.comments +
                post.localEngagement.comments >
                0 && (
                <span className="text-sm font-medium">
                  {post.engagementMetrics.comments +
                    post.localEngagement.comments}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>{likesCount} loves</span>
              {post.engagementMetrics?.comments +
                post.localEngagement?.comments >
                0 && (
                <>
                  <span>•</span>
                  <span>
                    {post.engagementMetrics.comments +
                      post.localEngagement.comments}{" "}
                    comments
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>

      <CommentsDrawer
        postId={post?._id}
        open={isCommentsDrawerOpen}
        onOpenChange={setIsCommentsDrawerOpen}
        onRequireAuth={() => {}}
        isAuthenticated={isAuthenticated}
      />

      <PostContentDialog
        post={post}
        open={isContentDialogOpen}
        onOpenChange={setIsContentDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
