import { db } from "../index";
import {
  contentTable,
  episodesTable,
  seasonsTable,
  reviewsTable,
  bookmarksTable,
  downloadsTable,
  watchProgressTable,
  usersTable,
  moviesTable,
} from "../schema";
import { eq, desc, sql, and, SQL, ilike, or, asc } from "drizzle-orm";

export const getContent = async (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const filters = {
    genre: Array.isArray(searchParams.genre)
      ? searchParams.genre
      : searchParams.genre
      ? [searchParams.genre]
      : [],
    contentType: searchParams.contentType as "movie" | "series" | undefined,
    search: typeof searchParams.q === "string" ? searchParams.q : undefined,
    limit:
      typeof searchParams.limit === "string"
        ? parseInt(searchParams.limit, 10)
        : undefined,
    offset:
      typeof searchParams.offset === "string"
        ? parseInt(searchParams.offset, 10)
        : undefined,
    sortBy:
      typeof searchParams.sortBy === "string"
        ? (searchParams.sortBy as
            | "title"
            | "releaseYear"
            | "averageRating"
            | "downloadCount")
        : undefined,
    sortOrder:
      typeof searchParams.sortOrder === "string"
        ? (searchParams.sortOrder as "asc" | "desc")
        : undefined,
    isPremium:
      typeof searchParams.isPremium === "string"
        ? searchParams.isPremium === "true"
        : undefined,
    quality:
      typeof searchParams.quality === "string"
        ? (searchParams.quality as "720p" | "1080p" | "4K")
        : undefined,
  };

  const query = db
    .select()
    .from(contentTable)
    .where(() => {
      const conditions: (SQL | undefined)[] = [eq(contentTable.isActive, true)];

      if (filters?.genre && filters.genre.length > 0) {
        conditions.push(
          sql`${contentTable.genre} && ARRAY[${sql.join(
            filters.genre.map((g) => sql.raw(`'${g}'`)),
            sql.raw(",")
          )}]::varchar[]`
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
      if (filters.quality) {
        conditions.push(eq(moviesTable.quality, filters.quality));
      }

      return and(...conditions.filter((c): c is SQL => !!c));
    })
    .orderBy(() => {
      const orderByColumn = (() => {
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
      })();
      return filters?.sortOrder === "asc"
        ? asc(orderByColumn)
        : desc(orderByColumn);
    })
    .limit(filters.limit ?? 10)
    .offset(filters.offset ?? 0);

  if (filters.quality) {
    return query
      .leftJoin(moviesTable, eq(contentTable.id, moviesTable.contentId))
      .execute();
  }

  return query.execute();
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
  const searchParams: { [key: string]: string | string[] | undefined } = {
    contentType: "movie",
  };

  if (filters?.genre) searchParams.genre = filters.genre;
  if (filters?.quality) searchParams.quality = filters.quality;
  if (filters?.search) searchParams.q = filters.search;
  if (filters?.limit) searchParams.limit = String(filters.limit);
  if (filters?.offset) searchParams.offset = String(filters.offset);
  if (filters?.sortBy) searchParams.sortBy = filters.sortBy;
  if (filters?.sortOrder) searchParams.sortOrder = filters.sortOrder;
  if (filters?.isPremium) searchParams.isPremium = String(filters.isPremium);

  return await getContent(searchParams);
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
  const searchParams: { [key: string]: string | string[] | undefined } = {
    contentType: "series",
  };

  if (filters?.genre) searchParams.genre = filters.genre;
  if (filters?.search) searchParams.q = filters.search;
  if (filters?.limit) searchParams.limit = String(filters.limit);
  if (filters?.offset) searchParams.offset = String(filters.offset);
  if (filters?.sortBy) searchParams.sortBy = filters.sortBy;
  if (filters?.sortOrder) searchParams.sortOrder = filters.sortOrder;
  if (filters?.isPremium) searchParams.isPremium = String(filters.isPremium);

  return await getContent(searchParams);
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
  const searchParams: { [key: string]: string | string[] | undefined } = {
    q: searchTerm,
  };

  if (filters?.contentType) searchParams.contentType = filters.contentType;
  if (filters?.genre) searchParams.genre = filters.genre;
  if (filters?.limit) searchParams.limit = String(filters.limit);
  if (filters?.offset) searchParams.offset = String(filters.offset);

  return await getContent(searchParams);
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
