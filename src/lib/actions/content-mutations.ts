"use server";
import { db } from "../db";
import {
  contentTable,
  moviesTable,
  seasonsTable,
  episodesTable,
  tvShowsTable,
} from "../db/schema";
import { getServerSession } from "../auth/server";

export async function createMovie(data: {
  title: string;
  description?: string;
  genre?: string;
  releaseYear?: number;
  trailerUrl?: string;
  durationMinutes?: number;
  posterKey: string;
  backdropKey?: string;
  movieFileKey: string;
}) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await db.transaction(async (tx) => {
    const [newContent] = await tx
      .insert(contentTable)
      .values({
        title: data.title,
        description: data.description,
        genre: data.genre?.split(",").map((g) => g.trim()),
        releaseYear: data.releaseYear,
        posterKey: data.posterKey,
        backdropKey: data.backdropKey,
        trailerKey: data.trailerUrl,
        contentType: "movie",
        uploaderId: session.user.id,
      })
      .returning();

    const [newMovie] = await tx
      .insert(moviesTable)
      .values({
        contentId: newContent.id,
        durationMinutes: data.durationMinutes,
        movieFileKey: data.movieFileKey,
      })
      .returning();

    return { ...newContent, movie: newMovie };
  });
}

export async function createTvShow(data: {
  title: string;
  description?: string;
  genre?: string;
  releaseYear?: number;
  trailerUrl?: string;
  status: "completed" | "ongoing" | "cancelled";
  posterKey: string;
  backdropKey?: string;
  seasons: {
    seasonNumber: number;
    title?: string;
    episodes: {
      episodeNumber: number;
      title: string;
      videoFileKey: string;
    }[];
  }[];
}) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await db.transaction(async (tx) => {
    const [newContent] = await tx
      .insert(contentTable)
      .values({
        title: data.title,
        description: data.description,
        genre: data.genre?.split(",").map((g) => g.trim()),
        releaseYear: data.releaseYear,
        posterKey: data.posterKey,
        backdropKey: data.backdropKey,
        trailerKey: data.trailerUrl,
        contentType: "tv",
        status: data.status,
        uploaderId: session.user.id,
      })
      .returning();

    const [newTvShow] = await tx
      .insert(tvShowsTable)
      .values({
        contentId: newContent.id,
      })
      .returning();

    for (const seasonData of data.seasons) {
      const [newSeason] = await tx
        .insert(seasonsTable)
        .values({
          tvShowId: newTvShow.id,
          seasonNumber: seasonData.seasonNumber,
          title: seasonData.title,
        })
        .returning();

      const episodeValues = seasonData.episodes.map((ep) => ({
        seasonId: newSeason.id,
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        videoFileKey: ep.videoFileKey,
      }));

      if (episodeValues.length > 0) {
        await tx.insert(episodesTable).values(episodeValues);
      }
    }

    return { contentId: newContent.id };
  });
}

export async function createSeason(data: {
  tvShowId: string;
  seasonNumber: number;
  title: string;
}) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await db.insert(seasonsTable).values(data).returning();
}

export async function createEpisode(data: {
  seasonId: string;
  episodeNumber: number;
  title: string;
  durationMinutes: number;
  videoFileKey: string;
}) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const season = await db.query.seasonsTable.findFirst({
    where: (seasonsTable, { eq }) => eq(seasonsTable.id, data.seasonId),
  });

  if (!season) {
    throw new Error("Season not found");
  }

  const newEpisodeData = {
    seasonId: season.id,
    episodeNumber: data.episodeNumber,
    title: data.title,
    durationMinutes: data.durationMinutes,
    videoFileKey: data.videoFileKey,
  };

  return await db.insert(episodesTable).values(newEpisodeData).returning();
}
