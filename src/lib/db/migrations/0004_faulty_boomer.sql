ALTER TABLE "content" DROP CONSTRAINT "content_uploader_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;