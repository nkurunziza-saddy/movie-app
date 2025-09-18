import * as z from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  genre: z.string().optional(),
  releaseYear: z.coerce.number().optional(),
  trailerUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  durationMinutes: z.coerce.number().optional(),
  status: z.enum(["completed", "ongoing", "cancelled"]).default("completed"),
});

export const seasonSchema = z.object({
  contentId: z.string().min(1, "Series is required"),
  seasonNumber: z.coerce.number().min(1, "Season number is required"),
  title: z.string().min(1, "Season title is required"),
});

export const episodeSchema = z.object({
  seasonId: z.string().min(1, "Season is required"),
  episodeNumber: z.coerce.number().min(1, "Episode number is required"),
  title: z.string().min(1, "Episode title is required"),
  durationMinutes: z.coerce.number().min(1, "Duration is required"),
});
