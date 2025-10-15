"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "./post-card";
import { useGetFeedQuery } from "@/store/features/feed/feedApi";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Post } from "@/store/features/feed/types";
import { PostSkeleton } from "./post-skeleton";

interface InfiniteFeedProps {
  community?: string;
  sortBy?: string;
  sortType?: string;
  search?: string;
  minQualityScore?: number;
  authentic?: boolean;
}

export function InfiniteFeed({
  community,
  sortBy = "createdAt",
  sortType = "desc",
  search,
  minQualityScore,
  authentic = true,
}: InfiniteFeedProps) {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 10;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const { data, isLoading, isFetching, error, refetch } = useGetFeedQuery({
    cursor: page.toString(),
    limit,
    community,
    sortBy,
    sortType,
    search,
    minQualityScore,
    authentic,
  });

  const postsFromResponse = useMemo(() => {
    if (!data) return [] as Post[];
    const docs = (data as any)?.docs;
    if (Array.isArray(docs)) {
      return docs as Post[];
    }
    const nestedData = (data as any)?.data;
    if (Array.isArray(nestedData)) {
      return nestedData as Post[];
    }
    return [] as Post[];
  }, [data]);

  const derivedHasMore = useMemo(() => {
    if (typeof (data as any)?.hasNextPage === "boolean") {
      return (data as any).hasNextPage as boolean;
    }
    const meta = (data as any)?.meta;
    const pagination = meta?.pagination ?? meta;
    if (pagination) {
      if (typeof pagination.hasNextPage === "boolean") {
        return pagination.hasNextPage as boolean;
      }
      if (typeof pagination.hasNext === "boolean") {
        return pagination.hasNext as boolean;
      }
    }
    if (typeof (data as any)?.nextPage === "number") {
      return true;
    }
    return postsFromResponse.length > 0;
  }, [data, postsFromResponse]);

  // Show refresh button every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setShowRefreshButton(true);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
    setShowRefreshButton(false);
    setIsLoadingMore(false);
  }, [community, sortBy, sortType, search, minQualityScore, authentic]);

  // Handle new data
  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      setAllPosts(postsFromResponse);
    } else if (postsFromResponse.length > 0) {
      setAllPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post._id));
        const newPosts = postsFromResponse.filter(
          (post) => !existingIds.has(post._id)
        );
        return [...prev, ...newPosts];
      });
    }

    setHasMore(derivedHasMore);
    setIsLoadingMore(false);
  }, [data, postsFromResponse, page, derivedHasMore]);

  // Load more when in view
  useEffect(() => {
    if (inView && !isFetching && hasMore && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [inView, isFetching, hasMore, isLoading, isLoadingMore]);

  const handleRetry = useCallback(() => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
    refetch();
    setIsLoadingMore(false);
  }, [refetch]);

  const handleRefreshFeed = useCallback(() => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
    setShowRefreshButton(false);
    refetch();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsLoadingMore(false);
  }, [refetch]);

  const isInitialFeedLoading =
    (isLoading || isFetching) && page === 1 && allPosts.length === 0;

  // Initial loading state
  if (isInitialFeedLoading) {
    return (
      <Card className="p-8 text-center">
        <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Loading feed</h3>
        <p className="text-muted-foreground">Feed posts will load shortly.</p>
      </Card>
    );
  }

  // Error state
  if (error && allPosts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load posts</h3>
        <p className="text-muted-foreground mb-4">
          Something went wrong while loading the feed. Please try again.
        </p>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  const noPostsFetched =
    allPosts.length === 0 && postsFromResponse.length === 0;

  // Empty state
  if (!isLoading && !isFetching && noPostsFetched) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Loader className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No posts found</h3>
          <p>
            {search
              ? `No posts found matching "${search}"`
              : community
              ? "This community doesn't have any posts yet"
              : "No posts available at the moment"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      {showRefreshButton && (
        <div className="sticky top-4 z-10 flex justify-center">
          <Button onClick={handleRefreshFeed} className="shadow-lg" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Load New Posts
          </Button>
        </div>
      )}

      {allPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {/* Loading trigger and states */}
      <div ref={ref} className="h-10">
        {isFetching && hasMore && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostSkeleton key={`loading-${i}`} />
            ))}
          </div>
        )}
      </div>

      {/* End of feed indicator */}
      {!hasMore && allPosts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px bg-border flex-1 max-w-20" />
            <span className="text-sm">You've reached the end</span>
            <div className="h-px bg-border flex-1 max-w-20" />
          </div>
        </div>
      )}

      {/* Error state for pagination */}
      {error && allPosts.length > 0 && (
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Failed to load more posts
          </p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      )}
    </div>
  );
}
