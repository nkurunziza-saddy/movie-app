"use server";

import { requireAuth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import { and, count, eq } from "drizzle-orm";

export async function toggleBookmark(contentId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const existing = await db.query.bookmarksTable.findFirst({
    where: (bookmarksTable, { eq }) =>
      and(
        eq(bookmarksTable.userId, userId),
        eq(bookmarksTable.contentId, contentId)
      ),
  });

  if (existing) {
    await db
      .delete(bookmarksTable)
      .where(
        and(
          eq(bookmarksTable.userId, session.user.id),
          eq(bookmarksTable.contentId, contentId)
        )
      );
    return { added: false };
  } else {
    await db.insert(bookmarksTable).values({
      userId,
      contentId,
    });
    return { added: true };
  }
}

export async function checkBookmark(contentId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const existing = await db.query.bookmarksTable.findFirst({
    where: (bookmarksTable, { eq }) =>
      and(
        eq(bookmarksTable.userId, userId),
        eq(bookmarksTable.contentId, contentId)
      ),
  });

  return !!existing;
}

export async function getBookmarks(userId: string, limit?: number) {
  return await db.query.bookmarksTable.findMany({
    where: (bookmarksTable, { eq }) => eq(bookmarksTable.userId, userId),
    orderBy: (bookmarksTable, { desc }) => [desc(bookmarksTable.createdAt)],
    limit,
    with: {
      content: true,
    },
  });
}

export async function getBookmarkByContentId(
  userId: string,
  contentId: string
) {
  return await db.query.bookmarksTable.findFirst({
    where: (bookmarksTable, { and, eq }) =>
      and(
        eq(bookmarksTable.userId, userId),
        eq(bookmarksTable.contentId, contentId)
      ),
    with: {
      content: true,
    },
  });
}

export async function getBookmarkCount(userId: string) {
  const [bookmarkCount] = await db
    .select({ count: count() })
    .from(bookmarksTable)
    .where(eq(bookmarksTable.userId, userId));

  return bookmarkCount;
}
