"use server";

import { requireAuth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { reviewsTable } from "@/lib/db/schema";
import { and, count, eq } from "drizzle-orm";

export async function createReview({
  data,
}: {
  data: typeof reviewsTable.$inferInsert;
}) {
  const session = await requireAuth();
  const userId = session.user.id;
  const { contentId, rating, reviewText } = data;

  const existing = await db.query.reviewsTable.findFirst({
    where: (reviewsTable, { eq }) =>
      and(
        eq(reviewsTable.userId, userId),
        eq(reviewsTable.contentId, contentId)
      ),
  });

  if (existing) {
    return { message: "Only one review is allowed" };
  } else {
    await db.insert(reviewsTable).values({
      userId,
      contentId,
      rating,
      reviewText,
    });
    return { message: "ok" };
  }
}

export async function checkReview(contentId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const existing = await db.query.reviewsTable.findFirst({
    where: (reviewsTable, { eq }) =>
      and(
        eq(reviewsTable.userId, userId),
        eq(reviewsTable.contentId, contentId)
      ),
  });

  return !!existing;
}

export async function getReviews(userId: string, limit?: number) {
  return await db.query.reviewsTable.findMany({
    where: (reviewsTable, { eq }) => eq(reviewsTable.userId, userId),
    orderBy: (reviewsTable, { desc }) => [desc(reviewsTable.createdAt)],
    limit,
    with: {
      content: true,
    },
  });
}

export async function getReviewsByContentId(contentId: string) {
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
      userId: true,
    },
  });
}

export async function getReviewCount(userId: string) {
  const [reviewCount] = await db
    .select({ count: count() })
    .from(reviewsTable)
    .where(eq(reviewsTable.userId, userId));

  return reviewCount;
}
export async function deleteReview(reviewId: string) {
  const session = await requireAuth();
  const userId = session.user.id;
  const res = await db
    .delete(reviewsTable)
    .where(and(eq(reviewsTable.userId, userId), eq(reviewsTable.id, reviewId)));

  return res.rowCount && res.rowCount > 0 ? "ok" : "Failed";
}
