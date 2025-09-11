import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { reviews, movies } from "@/lib/db/schema"
import { eq, avg } from "drizzle-orm"

export async function POST(request: NextRequest, { params }: { params: { movieId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const { rating, reviewText } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid rating" }, { status: 400 })
    }

    // Insert or update review
    await db
      .insert(reviews)
      .values({
        userId: session.user.id,
        movieId: params.movieId,
        rating,
        reviewText,
      })
      .onConflictDoUpdate({
        target: [reviews.userId, reviews.movieId],
        set: {
          rating,
          reviewText,
          createdAt: new Date(),
        },
      })

    // Update movie average rating
    const avgRating = await db
      .select({ avg: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.movieId, params.movieId))

    if (avgRating[0]?.avg) {
      await db
        .update(movies)
        .set({ averageRating: Number(avgRating[0].avg) })
        .where(eq(movies.id, params.movieId))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
