"use server";
import { db } from "../db/index";
import { seasonsTable } from "../db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getSeasonsByTvShowId(tvShowId: string) {
  return await db.query.seasonsTable.findMany({
    where: (seasons, { eq }) => eq(seasons.tvShowId, tvShowId),
    orderBy: (seasons, { desc }) => [desc(seasons.seasonNumber)],
  });
}

import {
  getPopularContent,
  getRecentContent,
} from "./content-complex-filtering-action";

export const getContentWithDetails = async (id: string) => {
  return await db.query.contentTable.findFirst({
    where: (contentTable, { eq }) => eq(contentTable.id, id),
    with: {
      movie: true,
      reviews: {
        columns: {
          id: true,
          createdAt: true,
          rating: true,
          userId: true,
          reviewText: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              username: true,
            },
          },
        },
      },
      tvShow: {
        with: {
          seasons: {
            orderBy: (seasonsTable, { asc }) => [
              asc(seasonsTable.seasonNumber),
            ],
            with: {
              episodes: {
                orderBy: (episodesTable, { asc }) => [
                  asc(episodesTable.episodeNumber),
                ],
              },
            },
          },
        },
      },
    },
  });
};

export const getEpisodeById = async (id: string) => {
  return await db.query.episodesTable.findFirst({
    where: (episodesTable, { eq }) => eq(episodesTable.id, id),
    with: {
      season: {
        with: {
          tvShow: {
            with: {
              content: true,
            },
          },
        },
      },
    },
  });
};

export const getSeasons = async () => {
  const t = await db.query.seasonsTable.findMany({
    orderBy: desc(seasonsTable.createdAt),
  });
  return t;
};

export const getTvShows = async () => {
  const t = await db.query.tvShowsTable.findMany({
    with: {
      content: {
        columns: {
          title: true,
        },
      },
    },
  });
  return t;
};

export const getPopularMovies = async (limit = 10) => {
  return await getPopularContent(limit, "movie");
};

export const getRecentMovies = async (limit = 10) => {
  return await getRecentContent(limit, "movie");
};

export const getPopularTv = async (limit = 10) => {
  return await getPopularContent(limit, "tv");
};

export const getRecentTv = async (limit = 10) => {
  return await getRecentContent(limit, "tv");
};
