export type SubscriptionTier = "free" | "premium";

export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  PREMIUM: "premium",
} as const;

export const TIER_LIMITS: Record<
  SubscriptionTier,
  {
    dailyDownloads: number;
    maxQuality: string;
  }
> = {
  free: {
    dailyDownloads: 5,
    maxQuality: "1080p",
  },
  premium: {
    dailyDownloads: -1, // unlimited
    maxQuality: "4K",
  },
};
