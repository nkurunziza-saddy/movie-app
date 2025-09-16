import * as z from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  releaseYear: z.coerce.number().min(1800, "Invalid year"),
  trailerUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  durationMinutes: z.coerce.number().min(1, "Duration is required"),
  poster: z
    .instanceof(File)
    .refine((file) => file && file.type.startsWith("image/"), {
      message: "Poster must be an image file",
    }),
  backdrop: z
    .instanceof(File)
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Backdrop must be an image file",
    })
    .optional(),
  movieFile: z
    .instanceof(File)
    .refine((file) => file && file.type.startsWith("video/"), {
      message: "Movie file must be a video file",
    }),
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
  videoFile: z
    .instanceof(File)
    .refine((file) => file && file.type.startsWith("video/"), {
      message: "Movie file must be a video file",
    }),
});
