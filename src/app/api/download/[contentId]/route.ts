import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { moviesTable, contentTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = params.contentId;

    const movieData = await db.query.moviesTable.findFirst({
      where: eq(moviesTable.contentId, contentId),
      with: {
        content: true,
      },
    });

    if (!movieData || !movieData.blobUrl) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    const blobUrl = movieData.blobUrl;

    const response = await fetch(blobUrl);

    if (!response.body) {
      return NextResponse.json(
        { message: "Could not fetch movie file" },
        { status: 500 }
      );
    }

    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${movieData.content.title.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.mp4"`
    );
    headers.set("Content-Type", "video/mp4");

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}