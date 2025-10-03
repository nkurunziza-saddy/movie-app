"use server";
import { db } from "../db";
import {
  contentTable,
  moviesTable,
  seasonsTable,
  episodesTable,
  tvShowsTable,
} from "../db/schema";
import { requireAdmin } from "../auth/server";
import { R2 } from "../r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { findOrCreateDubber } from "./dubber-actions";

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
  dubberName?: string;
}) {
  const session = await requireAdmin();

  return await db.transaction(async (tx) => {
    let dubberId: string | null = null;
    if (data.dubberName) {
      const dubber = await findOrCreateDubber(data.dubberName);
      if (dubber) {
        dubberId = dubber.id;
      }
    }

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
        dubberId,
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
  posterKey?: string;
  backdropKey?: string;
  dubberName?: string;
  seasons: {
    seasonNumber: number;
    title?: string;
    episodes: {
      episodeNumber: number;
      title: string;
      videoFileKey?: string;
    }[];
  }[];
}) {
  const session = await requireAdmin();

  return await db.transaction(async (tx) => {
    let dubberId: string | null = null;
    if (data.dubberName) {
      const dubber = await findOrCreateDubber(data.dubberName);
      if (dubber) {
        dubberId = dubber.id;
      }
    }

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
        dubberId,
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
  await requireAdmin();

  return await db.insert(seasonsTable).values(data).returning();
}

export async function createEpisode(data: {
  seasonId: string;
  episodeNumber: number;
  title: string;
  durationMinutes: number;
  videoFileKey: string;
}) {
  await requireAdmin();

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

export async function deleteContent(contentId: string) {
  await requireAdmin();

  const content = await db.query.contentTable.findFirst({
    where: eq(contentTable.id, contentId),
    with: {
      movie: true,
      tvShow: {
        with: {
          seasons: {
            with: {
              episodes: true,
            },
          },
        },
      },
    },
  });

  if (!content) {
    throw new Error("Content not found");
  }

  const keysToDelete: string[] = [];
  if (content.posterKey) keysToDelete.push(content.posterKey);
  if (content.backdropKey) keysToDelete.push(content.backdropKey);
  if (content.trailerKey) keysToDelete.push(content.trailerKey);

  if (content.contentType === "movie" && content.movie?.movieFileKey) {
    keysToDelete.push(content.movie.movieFileKey);
  } else if (content.contentType === "tv" && content.tvShow) {
    for (const season of content.tvShow.seasons) {
      for (const episode of season.episodes) {
        if (episode.videoFileKey) {
          keysToDelete.push(episode.videoFileKey);
        }
        if (episode.stillKey) {
          keysToDelete.push(episode.stillKey);
        }
      }
    }
  }

  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
  if (!R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not set in .env file");
  }

  if (keysToDelete.length > 0) {
    const deletePromises = keysToDelete.map((key) =>
      R2.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        })
      )
    );
    await Promise.all(deletePromises);
  }

  await db.delete(contentTable).where(eq(contentTable.id, contentId));

  revalidatePath("/");
  revalidatePath(`/content/${contentId}`);

  return { success: true };
}

export async function updateMovie(
  contentId: string,
  data: {
    title: string;
    description?: string;
    genre?: string;
    releaseYear?: number;
    trailerUrl?: string;
    durationMinutes?: number;
    dubberName?: string;
  }
) {
  await requireAdmin();

  await db.transaction(async (tx) => {
    let dubberId: string | null = null;
    if (data.dubberName === "") {
      dubberId = null;
    } else if (data.dubberName) {
      const dubber = await findOrCreateDubber(data.dubberName);
      if (dubber) {
        dubberId = dubber.id;
      }
    }

    await tx
      .update(contentTable)
      .set({
        title: data.title,
        description: data.description,
        genre: data.genre?.split(",").map((g) => g.trim()),
        releaseYear: data.releaseYear,
        trailerKey: data.trailerUrl,
        dubberId,
      })
      .where(eq(contentTable.id, contentId));

    await tx
      .update(moviesTable)
      .set({
        durationMinutes: data.durationMinutes,
      })
      .where(eq(moviesTable.contentId, contentId));
  });

  revalidatePath(`/content/${contentId}`);
  revalidatePath(`/edit/${contentId}`);

  return { success: true };
}

export async function updateTvShow(
  contentId: string,
  data: {
    title: string;
    description?: string;
    genre?: string;
    releaseYear?: number;
    trailerUrl?: string;
    status: "completed" | "ongoing" | "cancelled";
    posterKey?: string;
    backdropKey?: string;
    dubberName?: string;
    seasons: {
      seasonNumber: number;
      title?: string;
      episodes: {
        episodeNumber: number;
        title: string;
        videoFileKey?: string;
      }[];
    }[];
  }
) {
  await requireAdmin();

  return await db.transaction(async (tx) => {
    let dubberId: string | null = null;
    if (data.dubberName === "") {
      dubberId = null;
    } else if (data.dubberName) {
      const dubber = await findOrCreateDubber(data.dubberName);
      if (dubber) {
        dubberId = dubber.id;
      }
    }

    await tx
      .update(contentTable)
      .set({
        title: data.title,
        description: data.description,
        genre: data.genre?.split(",").map((g) => g.trim()),
        releaseYear: data.releaseYear,
        trailerKey: data.trailerUrl,
        status: data.status,
        posterKey: data.posterKey,
        backdropKey: data.backdropKey,
        dubberId,
      })
      .where(eq(contentTable.id, contentId));

    const tvShow = await tx.query.tvShowsTable.findFirst({
      where: eq(tvShowsTable.contentId, contentId),
      with: {
        seasons: {
          with: {
            episodes: true,
          },
        },
      },
    });

    if (!tvShow) {
      throw new Error("TV Show not found");
    }

    const existingSeasons = tvShow.seasons;
    const incomingSeasons = data.seasons;

    for (const seasonData of incomingSeasons) {
      const existingSeason = existingSeasons.find(
        (s) => s.seasonNumber === seasonData.seasonNumber
      );

      if (existingSeason) {
        await tx
          .update(seasonsTable)
          .set({ title: seasonData.title })
          .where(eq(seasonsTable.id, existingSeason.id));

        const existingEpisodes = existingSeason.episodes;
        const incomingEpisodes = seasonData.episodes;

        for (const episodeData of incomingEpisodes) {
          const existingEpisode = existingEpisodes.find(
            (e) => e.episodeNumber === episodeData.episodeNumber
          );

          if (existingEpisode) {
            await tx
              .update(episodesTable)
              .set({
                title: episodeData.title,
                videoFileKey: episodeData.videoFileKey,
              })
              .where(eq(episodesTable.id, existingEpisode.id));
          } else {
            await tx.insert(episodesTable).values({
              seasonId: existingSeason.id,
              episodeNumber: episodeData.episodeNumber,
              title: episodeData.title,
              videoFileKey: episodeData.videoFileKey,
            });
          }
        }

        const episodesToDelete = existingEpisodes.filter(
          (e) =>
            !incomingEpisodes.some((ie) => ie.episodeNumber === e.episodeNumber)
        );
        if (episodesToDelete.length > 0) {
          const idsToDelete = episodesToDelete.map((e) => e.id);
          await tx
            .delete(episodesTable)
            .where(inArray(episodesTable.id, idsToDelete));
        }
      } else {
        const [newSeason] = await tx
          .insert(seasonsTable)
          .values({
            tvShowId: tvShow.id,
            seasonNumber: seasonData.seasonNumber,
            title: seasonData.title,
          })
          .returning();

        if (seasonData.episodes.length > 0) {
          await tx.insert(episodesTable).values(
            seasonData.episodes.map((ep) => ({
              seasonId: newSeason.id,
              episodeNumber: ep.episodeNumber,
              title: ep.title,
              videoFileKey: ep.videoFileKey,
            }))
          );
        }
      }
    }

    const seasonsToDelete = existingSeasons.filter(
      (s) => !incomingSeasons.some((is) => is.seasonNumber === s.seasonNumber)
    );
    if (seasonsToDelete.length > 0) {
      const idsToDelete = seasonsToDelete.map((s) => s.id);
      await tx
        .delete(seasonsTable)
        .where(inArray(seasonsTable.id, idsToDelete));
    }

    revalidatePath(`/content/${contentId}`);
    revalidatePath(`/dashboard/edit/${contentId}`);

    return { success: true };
  });
}
