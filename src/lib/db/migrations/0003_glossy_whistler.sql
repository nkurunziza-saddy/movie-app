ALTER TABLE "content" RENAME COLUMN "poster_url" TO "poster_key";--> statement-breakpoint
ALTER TABLE "content" RENAME COLUMN "backdrop_url" TO "backdrop_key";--> statement-breakpoint
ALTER TABLE "content" RENAME COLUMN "trailer_url" TO "trailer_key";--> statement-breakpoint
ALTER TABLE "episodes" RENAME COLUMN "still_url" TO "still_key";--> statement-breakpoint
ALTER TABLE "episodes" RENAME COLUMN "video_file_url" TO "video_file_key";--> statement-breakpoint
ALTER TABLE "movies" RENAME COLUMN "movie_file_url" TO "movie_file_key";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_season_id_seasons_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_episode_id_episodes_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "season_id";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "episode_id";