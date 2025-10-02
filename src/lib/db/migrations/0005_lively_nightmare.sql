CREATE TABLE "dubbers" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "dubbers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "dubber_id" text;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_dubber_id_dubbers_id_fk" FOREIGN KEY ("dubber_id") REFERENCES "public"."dubbers"("id") ON DELETE set null ON UPDATE no action;