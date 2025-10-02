"use server";

import { db } from "../db/index";
import { contentTable } from "../db/schema";
import { eq, desc, sql, and, SQL, ilike, or, asc, inArray } from "drizzle-orm";

export const getContent = async (
  searchParams: Record<string, string | string[] | undefined>
) => {
  const filters = {
    genre: Array.isArray(searchParams.genre)
      ? searchParams.genre
      : searchParams.genre
      ? [searchParams.genre]
      : [],
    dubbers: Array.isArray(searchParams.dubbers)
      ? searchParams.dubbers
      : searchParams.dubbers
      ? [searchParams.dubbers]
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
            | "downloadCount"
            | "uploadDate")
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

      if (filters?.dubbers && filters.dubbers.length > 0) {
        conditions.push(inArray(contentTable.dubberId, filters.dubbers));
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
          case "uploadDate":
            return contentTable.uploadDate;
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
