import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { bookmarks } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(request: NextRequest, { params }: { params: { movieId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Add bookmark
    await db.insert(bookmarks).values({
      userId: session.user.id,
      movieId: params.movieId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bookmark error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { movieId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Remove bookmark
    await db.delete(bookmarks).where(and(eq(bookmarks.userId, session.user.id), eq(bookmarks.movieId, params.movieId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bookmark error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
