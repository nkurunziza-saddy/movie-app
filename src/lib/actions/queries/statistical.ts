"use server";

import { and, desc, eq, sql, SQL } from "drizzle-orm";
import {
  bookmarksTable,
  contentTable,
  downloadsTable,
  reviewsTable,
  usersTable,
} from "../../db/schema";
import { db } from "../../db";

export const getUserRecentDownloads = async (userId: string, limit = 5) => {
  return await db.query.downloadsTable.findMany({
    where: (downloadsTable, { eq }) => eq(downloadsTable.userId, userId),
    orderBy: (downloadsTable, { desc }) => [desc(downloadsTable.downloadDate)],
    with: {
      content: true,
      movie: true,
      episode: true,
    },
    limit,
  });
};

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

export const getPopularContent = async (
  limit = 10,
  contentType?: "movie" | "tv"
) => {
  const conditions: SQL[] = [eq(contentTable.isActive, true)];

  if (contentType) {
    conditions.push(eq(contentTable.contentType, contentType));
  }

  return await db
    .select()
    .from(contentTable)
    .where(and(...conditions))
    .orderBy(desc(contentTable.downloadCount))
    .limit(limit);
};

export const getRecentContent = async (
  limit = 10,
  contentType?: "movie" | "tv"
) => {
  const conditions: SQL[] = [eq(contentTable.isActive, true)];

  if (contentType) {
    conditions.push(eq(contentTable.contentType, contentType));
  }

  return await db
    .select()
    .from(contentTable)
    .where(and(...conditions))
    .orderBy(desc(contentTable.uploadDate))
    .limit(limit);
};

export const getPopularMovies = async (limit = 10) => {
  return await getPopularContent(limit, "movie");
};

export const getRecentMovies = async (limit = 10) => {
  return await getRecentContent(limit, "movie");
};

export const getPopularTv = async (limit = 10) => {
  return await getPopularContent(limit, "tv");
};

export const getRecentTv = async (limit = 10) => {
  return await getRecentContent(limit, "tv");
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
