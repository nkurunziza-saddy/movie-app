import { db } from "../index";
import {
  contentTable,
  moviesTable,
  seasonsTable,
  episodesTable,
} from "../schema";
import { getServerSession } from "./session";

export async function createMovie(data: {
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  trailerUrl?: string;
  durationMinutes: number;
  quality: "720p" | "1080p" | "4K";
  posterUrl: string;
  backdropUrl?: string;
  movieFileUrl: string;
  fileSizeMb: number;
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
        genre: data.genre.split(",").map((g) => g.trim()),
        releaseYear: data.releaseYear,
        posterUrl: data.posterUrl,
        backdropUrl: data.backdropUrl,
        trailerUrl: data.trailerUrl,
        contentType: "movie",
        uploaderId: session.user.id,
      })
      .returning();

    const [newMovie] = await tx
      .insert(moviesTable)
      .values({
        contentId: newContent.id,
        durationMinutes: data.durationMinutes,
        movieFileUrl: data.movieFileUrl,
        fileSizeMb: data.fileSizeMb,
      })
      .returning();

    return { ...newContent, movie: newMovie };
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
  quality: "720p" | "1080p" | "4K";
  videoFileUrl: string;
  fileSizeMb: number;
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

  return await db
    .insert(episodesTable)
    .values({ ...data, seasonId: season.id })
    .returning();
}
