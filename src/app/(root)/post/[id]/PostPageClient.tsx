"use client";
import Link from "next/link";
import {
  useGetPostByIdQuery,
  useGetFeedQuery,
  useGetPostCommentsQuery,
  useToggleCommentLikeMutation,
  useAddCommentMutation,
  useTogglePostLikeMutation,
} from "@/store/features/feed/feedApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AuthRequiredDialog } from "@/components/feed/auth-required-dialog";

function formatContent(content: string) {
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
}

export default function PostPageClient({ postId }: { postId: string }) {
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId);

  // Auth state
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const contentHtml = useMemo(
    () => formatContent(post?.content || ""),
    [post?.content]
  );

  const communityKey =
    post?.community?.slug || post?.community?._id || post?.community?.name;

  console.log("communityKey------------------->", post?.community);
  const { data: relatedFeed } = useGetFeedQuery(
    {
      cursor: "1",
      limit: 5,
      community: communityKey,
      sortBy: "createdAt",
      sortType: "desc",
    },
    { skip: !communityKey }
  );

  // Comments
  const [commentText, setCommentText] = useState("");
  const { data: commentsData, isLoading: commentsLoading } =
    useGetPostCommentsQuery(
      {
        postId: postId,
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortType: "desc",
      },
      { skip: !postId }
    );
  const [toggleCommentLike, { isLoading: likingComment }] =
    useToggleCommentLikeMutation();
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();

  const handleToggleCommentLike = async (commentId: string) => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    try {
      await toggleCommentLike(commentId).unwrap();
    } catch (e) {}
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    const content = commentText.trim();
    if (!content) return;
    try {
      await addComment({ content, postId }).unwrap();
      setCommentText("");
    } catch (e) {}
  };

  // Post like handling (similar to feed card)
  const [toggleLove, { isLoading: isLikeLoading }] =
    useTogglePostLikeMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!post) return;
    const initialLikes =
      (post.engagementMetrics?.likes || 0) + (post.localEngagement?.likes || 0);
    setLikesCount(initialLikes);
    setIsLiked(Boolean(post.isLoved));
  }, [
    post?._id,
    post?.engagementMetrics?.likes,
    post?.localEngagement?.likes,
    post?.isLoved,
  ]);

  const handleLoveClick = async () => {
    if (isLikeLoading) return;
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    try {
      const result = await toggleLove(postId).unwrap();
      setIsLiked(result.liked);
      setLikesCount((prev) =>
        result.liked ? prev + 1 : Math.max(prev - 1, 0)
      );
    } catch (error) {}
  };
  console.log("relatedFeed------------------->", relatedFeed);
  if (isLoading) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-6">
        <p className="text-destructive">Failed to load post.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-6">
      <article className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
        <div className="px-6 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post?.owner?.avatar}
                alt={post?.owner?.fullName}
              />
              <AvatarFallback>
                {post?.owner?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{post?.owner?.fullName}</span>
              <span className="text-xs text-muted-foreground">
                @{post?.owner?.username}
              </span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {post.title}
          </h1>
        </div>
        {post.image && (
          <div className="px-6 pt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt="Post image"
              className="w-full rounded-lg object-cover max-h-[500px]"
            />
          </div>
        )}
        <div className="px-6 py-6">
          <div
            className="prose prose-lg max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
        {/* Post actions */}
        <div className="flex items-center justify-between px-6 pb-6 pt-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoveClick}
              disabled={isLikeLoading}
              className={isLiked ? "text-red-600" : "text-muted-foreground"}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              {likesCount > 0 && (
                <span className="ml-1 text-sm font-medium">{likesCount}</span>
              )}
            </Button>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>
                {(post?.engagementMetrics?.comments || 0) +
                  (post?.localEngagement?.comments || 0)}
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        {/* Add Comment */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
            onFocus={() => {
              if (!isAuthenticated) setIsAuthDialogOpen(true);
            }}
          />
          <Button
            onClick={handleAddComment}
            disabled={addingComment || !commentText.trim()}
          >
            Post
          </Button>
        </div>

        {/* List Comments */}
        {commentsLoading ? (
          <div className="space-y-3">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        ) : (
          <div className="space-y-4">
            {commentsData?.docs?.length ? (
              commentsData.docs.map((c) => (
                <div key={c._id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={c?.owner?.avatar}
                      alt={c?.owner?.fullName}
                    />
                    <AvatarFallback>
                      {c?.owner?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {c?.owner?.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{c?.owner?.username}
                      </span>
                    </div>
                    <div className="text-sm mt-1">{c.content}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCommentLike(c._id)}
                        disabled={likingComment}
                        className={
                          c.isLoved ? "text-red-600" : "text-muted-foreground"
                        }
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            c.isLoved ? "fill-current" : ""
                          }`}
                        />
                        <span className="ml-1 text-xs">
                          {c.likes || c.lovesCount || 0}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </div>
        )}
      </section>

      {relatedFeed?.docs?.length ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Related posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedFeed.docs
              .filter((p) => p._id !== post._id)
              .map((p) => (
                <Link key={p._id} href={`/post/${p._id}`} className="group">
                  <div className="bg-card rounded-lg border border-border hover:border-accent transition-colors p-4 h-full">
                    <div className="flex items-start gap-3">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt="thumb"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : null}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={p?.owner?.avatar}
                              alt={p?.owner?.fullName}
                            />
                            <AvatarFallback>
                              {p?.owner?.fullName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground truncate">
                            <span className="truncate max-w-[140px]">
                              {p?.owner?.fullName}
                            </span>

                            <span className="truncate text-xs">
                              @{p?.owner?.username}
                            </span>
                          </div>
                        </div>
                        <Link href={`/post/${p._id}`}>
                          <h3 className="font-medium line-clamp-2 group-hover:text-primary">
                            {p.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {(p.content || "").slice(0, 120)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ) : null}

      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        description="Please log in to interact with posts."
      />
    </main>
  );
}
