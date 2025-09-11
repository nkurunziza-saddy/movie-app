import { db } from "../index";
import {
  contentTable,
  moviesTable,
  episodesTable,
  seasonsTable,
  reviewsTable,
  bookmarksTable,
  downloadsTable,
  watchProgressTable,
  usersTable,
} from "../schema";
import { eq, desc, asc, or, ilike, sql, and, SQL } from "drizzle-orm";

export const getContent = async (filters?: {
  genre?: string[];
  contentType?: "movie" | "series";
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "title" | "releaseYear" | "averageRating" | "downloadCount";
  sortOrder?: "asc" | "desc";
  isPremium?: boolean;
}) => {
  return await db.query.contentTable.findMany({
    where: (contentTable, { and, eq, or, ilike, sql }) => {
      const conditions: any[] = [eq(contentTable.isActive, true)];

      if (filters?.genre && filters.genre.length > 0) {
        conditions.push(
          sql`${contentTable.genre} && ${sql.raw(
            `ARRAY[${filters.genre
              .map((g, i) => `$${i + 1}`)
              .join(", ")}]::varchar[]`
          )}`
        );
      }

      if (filters?.contentType) {
        conditions.push(eq(contentTable.contentType, filters.contentType));
      }

      if (filters?.isPremium !== undefined) {
        conditions.push(eq(contentTable.isPremium, filters.isPremium));
      }

      if (filters?.search) {
        const searchConditions = [
          ilike(contentTable.title, `%${filters.search}%`),
          ilike(contentTable.description, `%${filters.search}%`),
        ];
        conditions.push(or(...searchConditions));
      }

      return and(...conditions);
    },
    orderBy: (contentTable, { asc, desc }) => [
      (filters?.sortOrder === "asc" ? asc : desc)(
        (() => {
          switch (filters?.sortBy) {
            case "title":
              return contentTable.title;
            case "releaseYear":
              return contentTable.releaseYear;
            case "averageRating":
              return contentTable.averageRating;
            case "downloadCount":
              return contentTable.downloadCount;
            default:
              return contentTable.uploadDate;
          }
        })()
      ),
    ],
    limit: filters?.limit,
    offset: filters?.offset,
  });
};

export const getMovies = async (filters?: {
  genre?: string[];
  quality?: "720p" | "1080p" | "4K";
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "title" | "releaseYear" | "averageRating" | "downloadCount";
  sortOrder?: "asc" | "desc";
  isPremium?: boolean;
}) => {
  return await getContent({
    ...filters,
    contentType: "movie",
  });
};

export const getContentWithDetails = async (id: string) => {
  return await db.query.contentTable.findFirst({
    where: (contentTable, { eq }) => eq(contentTable.id, id),
    with: {
      movie: true,
      seasons: {
        orderBy: (seasonsTable, { asc }) => [asc(seasonsTable.seasonNumber)],
        with: {
          episodes: {
            orderBy: (episodesTable, { asc }) => [
              asc(episodesTable.episodeNumber),
            ],
          },
        },
      },
    },
  });
};

export const getSeries = async (filters?: {
  genre?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "title" | "releaseYear" | "averageRating" | "downloadCount";
  sortOrder?: "asc" | "desc";
  isPremium?: boolean;
}) => {
  return await getContent({
    ...filters,
    contentType: "series",
  });
};

export const getEpisodeById = async (id: string) => {
  return await db.query.episodesTable.findFirst({
    where: (episodesTable, { eq }) => eq(episodesTable.id, id),
    with: {
      season: true,
      content: true,
    },
  });
};

export const getContentReviews = async (contentId: string) => {
  return await db.query.reviewsTable.findMany({
    where: (reviewsTable, { eq }) => eq(reviewsTable.contentId, contentId),
    orderBy: (reviewsTable, { desc }) => [desc(reviewsTable.createdAt)],
    with: {
      user: {
        columns: {
          username: true,
          name: true,
        },
      },
    },
    columns: {
      id: true,
      rating: true,
      reviewText: true,
      createdAt: true,
    },
  });
};

export const getEpisodeReviews = async (episodeId: string) => {
  return await db
    .select({
      id: reviewsTable.id,
      rating: reviewsTable.rating,
      reviewText: reviewsTable.reviewText,
      createdAt: reviewsTable.createdAt,
      user: {
        username: usersTable.username,
        name: usersTable.name,
      },
    })
    .from(reviewsTable)
    .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
    .where(eq(reviewsTable.episodeId, episodeId))
    .orderBy(desc(reviewsTable.createdAt));
};

export const getUserBookmarks = async (userId: string, limit?: number) => {
  return await db.query.bookmarksTable.findMany({
    where: (bookmarksTable, { eq }) => eq(bookmarksTable.userId, userId),
    orderBy: (bookmarksTable, { desc }) => [desc(bookmarksTable.createdAt)],
    with: {
      content: true,
    },
    limit,
    columns: {
      id: true,
      createdAt: true,
    },
  });
};

export const getUserDownloads = async (userId: string) => {
  return await db.query.downloadsTable.findMany({
    where: (downloadsTable, { eq }) => eq(downloadsTable.userId, userId),
    orderBy: (downloadsTable, { desc }) => [desc(downloadsTable.downloadDate)],
    with: {
      content: true,
      movie: true,
      episode: true,
    },
  });
};

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

export const getUserWatchProgress = async (userId: string) => {
  return await db
    .select({
      id: watchProgressTable.id,
      progressSeconds: watchProgressTable.progressSeconds,
      totalSeconds: watchProgressTable.totalSeconds,
      completed: watchProgressTable.completed,
      lastWatched: watchProgressTable.lastWatched,
      content: {
        id: contentTable.id,
        title: contentTable.title,
        posterUrl: contentTable.posterUrl,
        contentType: contentTable.contentType,
      },
      season: {
        id: seasonsTable.id,
        seasonNumber: seasonsTable.seasonNumber,
        title: seasonsTable.title,
      },
      episode: {
        id: episodesTable.id,
        title: episodesTable.title,
        episodeNumber: episodesTable.episodeNumber,
      },
    })
    .from(watchProgressTable)
    .leftJoin(contentTable, eq(watchProgressTable.contentId, contentTable.id))
    .leftJoin(seasonsTable, eq(watchProgressTable.seasonId, seasonsTable.id))
    .leftJoin(episodesTable, eq(watchProgressTable.episodeId, episodesTable.id))
    .where(eq(watchProgressTable.userId, userId))
    .orderBy(desc(watchProgressTable.lastWatched));
};

export const getContentWatchProgress = async (
  userId: string,
  contentId: string
) => {
  const result = await db
    .select()
    .from(watchProgressTable)
    .where(
      and(
        eq(watchProgressTable.userId, userId),
        eq(watchProgressTable.contentId, contentId)
      )
    )
    .limit(1);

  return result[0] || null;
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
  contentType?: "movie" | "series"
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
  contentType?: "movie" | "series"
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

export const getPopularSeries = async (limit = 10) => {
  return await getPopularContent(limit, "series");
};

export const getRecentSeries = async (limit = 10) => {
  return await getRecentContent(limit, "series");
};

export const searchContent = async (
  searchTerm: string,
  filters?: {
    contentType?: "movie" | "series";
    genre?: string[];
    limit?: number;
    offset?: number;
  }
) => {
  return await getContent({
    search: searchTerm,
    ...filters,
  });
};

export const incrementDownloadCount = async (contentId: string) => {
  await db
    .update(contentTable)
    .set({
      downloadCount: sql`${contentTable.downloadCount} + 1`,
    })
    .where(eq(contentTable.id, contentId));
};

export const updateAverageRating = async (contentId: string) => {
  const result = await db
    .select({
      avgRating: sql<number>`AVG(${reviewsTable.rating})`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.contentId, contentId));

  const avgRating = result[0]?.avgRating || 0;

  await db
    .update(contentTable)
    .set({
      averageRating: avgRating.toString(),
    })
    .where(eq(contentTable.id, contentId));
};
