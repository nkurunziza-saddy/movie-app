"use server";

import { db } from "../../index";
import {
  contentTable,
  reviewsTable,
  usersTable,
  moviesTable,
  seasonsTable,
  tvShowsTable,
} from "../../schema";
import { eq, desc, sql, and, SQL, ilike, or, asc } from "drizzle-orm";

export const getContent = async (
  searchParams: Record<string, string | string[] | undefined>
) => {
  const filters = {
    genre: Array.isArray(searchParams.genre)
      ? searchParams.genre
      : searchParams.genre
      ? [searchParams.genre]
      : [],
    contentType: searchParams.contentType as "movie" | "tv" | undefined,
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

      if (filters?.search) {
        const searchConditions = [
          ilike(contentTable.title, `%${filters.search}%`),
          ilike(contentTable.description, `%${filters.search}%`),
        ];
        conditions.push(or(...searchConditions));
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

  return query.execute();
};

export const getContentWithDetails = async (id: string) => {
  return await db.query.contentTable.findFirst({
    where: (contentTable, { eq }) => eq(contentTable.id, id),
    with: {
      movie: true,
      reviews: {
        columns: {
          id: true,
          createdAt: true,
          rating: true,
          reviewText: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              username: true,
            },
          },
        },
      },
      tvShow: {
        with: {
          seasons: {
            orderBy: (seasonsTable, { asc }) => [
              asc(seasonsTable.seasonNumber),
            ],
            with: {
              episodes: {
                orderBy: (episodesTable, { asc }) => [
                  asc(episodesTable.episodeNumber),
                ],
              },
            },
          },
        },
      },
    },
  });
};

export const getEpisodeById = async (id: string) => {
  return await db.query.episodesTable.findFirst({
    where: (episodesTable, { eq }) => eq(episodesTable.id, id),
    with: {
      season: {
        with: {
          tvShow: {
            with: {
              content: true,
            },
          },
        },
      },
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

export const incrementDownloadCount = async (contentId: string) => {
  await db
    .update(contentTable)
    .set({
      downloadCount: sql`${contentTable.downloadCount} + 1`,
    })
    .where(eq(contentTable.id, contentId));
};

export const getSeasons = async () => {
  const t = await db.query.seasonsTable.findMany({
    orderBy: desc(seasonsTable.createdAt),
  });
  return t;
};
export const getTvShows = async () => {
  const t = await db.query.tvShowsTable.findMany({
    with: {
      content: {
        columns: {
          title: true,
        },
      },
    },
  });
  return t;
};
