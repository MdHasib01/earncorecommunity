export interface CommunityTypes {
  _id: string;
  name: string;
  icon: string;
  lastUpdatedAt: string;
  description: string;
  category: string;
  scrapingPlatforms: {
    platform: string;
    sourceUrl: string;
    keywords: string[];
    isActive: boolean;
  }[];
  memberCount: number;
  postCount: number;
  isActive: boolean;
  lastScrapedAt?: Date;
  scrapingConfig: {
    frequency: string;
    maxPostsPerScrape: number;
    qualityThreshold: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
