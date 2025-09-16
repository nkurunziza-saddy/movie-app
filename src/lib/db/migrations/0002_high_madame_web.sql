ALTER TABLE "seasons" RENAME COLUMN "content_id" TO "tv_show_id";--> statement-breakpoint
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_content_id_content_id_fk";
--> statement-breakpoint
DROP INDEX "seasons_content_season_unique";--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_tv_show_id_tv_shows_id_fk" FOREIGN KEY ("tv_show_id") REFERENCES "public"."tv_shows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "season_number_show_unique" ON "seasons" USING btree ("tv_show_id","season_number");