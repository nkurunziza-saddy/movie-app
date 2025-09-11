import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { bookmarks } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { movieId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ isBookmarked: false })
    }

    const bookmark = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, session.user.id), eq(bookmarks.movieId, params.movieId)))
      .limit(1)

    return NextResponse.json({ isBookmarked: bookmark.length > 0 })
  } catch (error) {
    console.error("Bookmark check error:", error)
    return NextResponse.json({ isBookmarked: false })
  }
}
