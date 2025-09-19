CREATE TYPE "public"."content_status" AS ENUM('completed', 'ongoing', 'cancelled');--> statement-breakpoint
CREATE TABLE "tv_shows" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "tv_shows_content_id_unique" UNIQUE("content_id")
);
--> statement-breakpoint
ALTER TABLE "subscription" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "watch_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "subscription" CASCADE;--> statement-breakpoint
DROP TABLE "watch_progress" CASCADE;--> statement-breakpoint
ALTER TABLE "content" RENAME COLUMN "status" TO "content_status";--> statement-breakpoint
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_content_id_content_id_fk";
--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "content_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "content_type" SET DEFAULT 'movie'::text;--> statement-breakpoint
DROP TYPE "public"."content_type";--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('movie', 'tv');--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "content_type" SET DEFAULT 'movie'::"public"."content_type";--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "content_type" SET DATA TYPE "public"."content_type" USING "content_type"::"public"."content_type";--> statement-breakpoint
ALTER TABLE "tv_shows" ADD CONSTRAINT "tv_shows_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_content_unique" ON "bookmarks" USING btree ("user_id","content_id");--> statement-breakpoint
CREATE UNIQUE INDEX "seasons_content_season_unique" ON "seasons" USING btree ("content_id","season_number");--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "total_seasons";--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "average_rating";--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "is_premium";--> statement-breakpoint
ALTER TABLE "episodes" DROP COLUMN "content_id";--> statement-breakpoint
ALTER TABLE "episodes" DROP COLUMN "quality";--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "quality";--> statement-breakpoint
ALTER TABLE "seasons" DROP COLUMN "poster_url";--> statement-breakpoint
ALTER TABLE "seasons" DROP COLUMN "total_episodes";--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_content_id_unique" UNIQUE("content_id");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "rating_check" CHECK ("reviews"."rating" BETWEEN 1 AND 5);--> statement-breakpoint
DROP TYPE "public"."quality";--> statement-breakpoint
DROP TYPE "public"."subscription_tier";