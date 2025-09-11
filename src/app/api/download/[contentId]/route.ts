// import { type NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { db } from "@/lib/db";
// import { movies, downloads } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { checkDownloadLimit, canAccessQuality } from "@/lib/config";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { movieId: string } }
// ) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     // Get movie details
//     const movie = await db
//       .select()
//       .from(movies)
//       .where(eq(movies.id, params.movieId))
//       .limit(1);

//     if (movie.length === 0) {
//       return NextResponse.json({ message: "Movie not found" }, { status: 404 });
//     }

//     const movieData = movie[0];

//     const downloadCheck = await checkDownloadLimit(session.user.id);

//     if (!downloadCheck.canDownload) {
//       return NextResponse.json(
//         {
//           message:
//             "Daily download limit reached. Upgrade to Premium for unlimited downloads.",
//           remainingDownloads: downloadCheck.remainingDownloads,
//           tier: downloadCheck.tier,
//         },
//         { status: 429 }
//       );
//     }

//     // Check if user can access this quality
//     const hasQualityAccess = await canAccessQuality(
//       session.user.id,
//       movieData.quality
//     );

//     if (!hasQualityAccess) {
//       return NextResponse.json(
//         {
//           message: `${movieData.quality} quality requires Premium subscription. Please upgrade or choose a lower quality.`,
//           availableQuality:
//             downloadCheck.tier === "free" ? "720p" : movieData.quality,
//         },
//         { status: 403 }
//       );
//     }

//     // Record the download
//     await db.insert(downloads).values({
//       userId: session.user.id,
//       movieId: params.movieId,
//       ipAddress: request.ip || "unknown",
//     });

//     // Update download count
//     await db
//       .update(movies)
//       .set({
//         downloadCount: movieData.downloadCount + 1,
//       })
//       .where(eq(movies.id, params.movieId));

//     // In a real implementation, you would:
//     // 1. Generate a signed URL from Vercel Blob
//     // 2. Return the temporary download URL

//     // For now, return a placeholder response
//     return NextResponse.json({
//       downloadUrl: movieData.movieFileUrl || "#",
//       filename: `${movieData.title.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`,
//       remainingDownloads:
//         downloadCheck.remainingDownloads === -1
//           ? -1
//           : downloadCheck.remainingDownloads - 1,
//       tier: downloadCheck.tier,
//     });
//   } catch (error) {
//     console.error("Download error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/download/[contentId]">
) {
  const { contentId } = await ctx.params;
  return Response.json({ contentId });
}
