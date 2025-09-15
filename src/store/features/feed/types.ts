export interface User {
  id?: string;
  _id: string;
  username: string;
  name?: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  email?: string;
  followersCount?: number;
  followingCount?: number;
  subscribersCount?: number;
  channelsSubscribedToCount?: number;
  postsCount?: number;
  isVerified?: boolean;
  isSubscribed?: boolean;
  joinedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Community {
  id?: string;
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  category: string;
  icon?: string;
  membersCount?: number;
  memberCount?: number;
  postCount?: number;
  isActive?: boolean;
  lastUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EngagementMetrics {
  views: number;
  likes: number;
  comments: number;
  shares?: number;
}

export interface LocalEngagement {
  likes: number;
  comments: number;
  bookmarks: number;
}

export interface ScrapingMetadata {
  qualityScore: number;
  tags: string[];
  contentType: string;
  isAuthentic: boolean;
  originalAuthor?: string;
  originalCreatedAt?: string;
}

export interface Post {
  id?: string;
  _id: string;
  title: string;
  content: string;
  image?: string;
  sourceUrl?: string;
  platform?: string;
  owner: User;
  community: Community;
  createdAt: string;
  updatedAt?: string;
  lovesCount?: number;
  commentsCount?: number;
  engagementMetrics: EngagementMetrics;
  localEngagement?: LocalEngagement;
  totalEngagement?: number;
  scrapingMetadata?: ScrapingMetadata;
  isLoved: boolean;
  isBookmarked: boolean;
  lovedBy: User[];
}

export interface Comment {
  id?: string;
  _id: string;
  content: string;
  post?: string;
  author?: User;
  owner: User;
  parentComment?: {
    _id: string;
    content: string;
    owner: {
      _id: string;
      username: string;
      fullName: string;
    };
  };
  replies?: Comment[];
  replyCount?: number;
  createdAt: string;
  updatedAt?: string;
  lovesCount: number;
  likes: number;
  isLoved: boolean;
  isEdited?: boolean;
}

export interface FeedResponse {
  docs: Post[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface BookmarkCollection {
  collection: string;
  count: number;
  lastUpdated: string;
}

export interface FollowStats {
  followers: number;
  following: number;
}