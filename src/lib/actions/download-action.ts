"use server";

import { db } from "@/lib/db";
import { downloadsTable, moviesTable, episodesTable } from "@/lib/db/schema";
import { getServerSession, requireAuth } from "@/lib/auth/server";
import { getPresignedUrl } from "./r2-actions";
import { eq } from "drizzle-orm";

interface DownloadActionProps {
  movieId?: string;
  episodeId?: string;
}

export async function downloadContentAction({
  movieId,
  episodeId,
}: DownloadActionProps) {
  const session = await getServerSession();

  if (!movieId && !episodeId) {
    throw new Error("A movie ID or episode ID must be provided.");
  }

  let fileKey: string | null | undefined;
  let contentId: string | undefined;
  let filename: string | undefined;

  if (movieId) {
    const movie = await db.query.moviesTable.findFirst({
      where: eq(moviesTable.id, movieId),
      with: {
        content: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!movie) throw new Error("Movie not found.");
    fileKey = movie.movieFileKey;
    contentId = movie.contentId;
    filename = `${movie.content.title}.mp4`;
  } else if (episodeId) {
    const episode = await db.query.episodesTable.findFirst({
      where: eq(episodesTable.id, episodeId),
      with: {
        season: {
          with: {
            tvShow: {
              with: {
                content: {
                  columns: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!episode) throw new Error("Episode not found.");
    fileKey = episode.videoFileKey;
    contentId = episode.season.tvShow.contentId;
    filename = `${episode.season.tvShow.content.title} - S${episode.season.seasonNumber}E${episode.episodeNumber} - ${episode.title}.mp4`;
  }

  if (!fileKey) {
    throw new Error("No downloadable file found for this content.");
  }

  if (!contentId) {
    throw new Error("Could not determine content ID for download tracking.");
  }

  const downloadUrl = await getPresignedUrl(fileKey, filename);

  db.insert(downloadsTable)
    .values({
      userId: session?.user.id ?? "unregistered",
      contentId: contentId,
      movieId: movieId,
      episodeId: episodeId,
    })
    .catch(console.error);

  return { downloadUrl, filename };
}

export async function getDownloadHistory() {
  const session = await requireAuth();
  const downloads = await db.query.downloadsTable.findMany({
    where: eq(downloadsTable.userId, session.user.id),
    with: {
      content: true,
    },
    orderBy: (downloads, { desc }) => [desc(downloads.downloadDate)],
    limit: 5,
  });
  return downloads;
}
