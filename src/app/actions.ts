// "use server";

// import { movieSchema, seasonSchema, episodeSchema } from "@/lib/form-schema";
// import { createMovie, createSeason, createEpisode } from "@/lib/db/actions/mutations";
// import { z } from "zod";

// export async function createMovieAction(data: z.infer<typeof movieSchema>) {
//   const validation = movieSchema.safeParse(data);
//   if (!validation.success) {
//     throw new Error("Invalid form data");
//   }

//   const { poster, backdrop, movieFile, ...rest } = validation.data;

//   const [posterBlob, backdropBlob, movieBlob] = await Promise.all([
//     put(poster.name, poster, { access: "public", addRandomSuffix: true }),
//     backdrop ? put(backdrop.name, backdrop, { access: "public", addRandomSuffix: true }) : Promise.resolve(null),
//     put(movieFile.name, movieFile, { access: "public", addRandomSuffix: true }),
//   ]);

//   await createMovie({
//     ...rest,
//     posterUrl: posterBlob.url,
//     backdropUrl: backdropBlob?.url,
//     movieFileUrl: movieBlob.url,
//     fileSizeMb: Math.round(movieFile.size / 1024 / 1024),
//   });
// }

// export async function createSeasonAction(data: z.infer<typeof seasonSchema>) {
//   const validation = seasonSchema.safeParse(data);
//   if (!validation.success) {
//     throw new Error("Invalid form data");
//   }

//   await createSeason(validation.data);
// }

// export async function createEpisodeAction(data: z.infer<typeof episodeSchema>) {
//   const validation = episodeSchema.safeParse(data);
//   if (!validation.success) {
//     throw new Error("Invalid form data");
//   }

//   const { videoFile, ...rest } = validation.data;

//   const videoBlob = await put(videoFile.name, videoFile, { access: "public", addRandomSuffix: true });

//   await createEpisode({
//     ...rest,
//     videoFileUrl: videoBlob.url,
//     fileSizeMb: Math.round(videoFile.size / 1024 / 1024),
//   });
// }
