"use server";

import { eq, sql } from "drizzle-orm";
import {
  bookmarksTable,
  contentTable,
  downloadsTable,
  reviewsTable,
  usersTable,
} from "../db/schema";
import { db } from "../db";

export const getUserStats = async (userId: string) => {
  const [downloadCount, bookmarkCount, reviewCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(downloadsTable)
      .where(eq(downloadsTable.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookmarksTable)
      .where(eq(bookmarksTable.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(reviewsTable)
      .where(eq(reviewsTable.userId, userId)),
  ]);

  return {
    totalDownloads: downloadCount[0]?.count || 0,
    totalBookmarks: bookmarkCount[0]?.count || 0,
    totalReviews: reviewCount[0]?.count || 0,
  };
};

export const getDashboardStats = async () => {
  const [totalMovies, totalTvShows, totalUsers, totalDownloads] =
    await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(contentTable)
        .where(eq(contentTable.contentType, "movie")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(contentTable)
        .where(eq(contentTable.contentType, "tv")),
      db.select({ count: sql<number>`count(*)` }).from(usersTable),
      db.select({ count: sql<number>`count(*)` }).from(downloadsTable),
    ]);

  return {
    totalMovies: totalMovies[0]?.count || 0,
    totalTvShows: totalTvShows[0]?.count || 0,
    totalUsers: totalUsers[0]?.count || 0,
    totalDownloads: totalDownloads[0]?.count || 0,
  };
};
