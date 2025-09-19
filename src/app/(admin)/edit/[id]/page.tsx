import { notFound } from "next/navigation";
import { getContentWithDetails } from "@/lib/actions/content-query-action";
import { CreateMovieForm } from "@/components/forms/create-movie-form";
import { CreateTvShowForm } from "@/components/forms/create-tv-show-form";
import { requireAdmin } from "@/lib/auth/server";
import Link from "next/link";

export default async function EditContentPage(props: PageProps<"/edit/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const content = await getContentWithDetails(id);

  if (!content) {
    notFound();
  }

  return (
    <div>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Edit {content.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Update content details information
              </p>
            </div>
            <Link
              href="/dashboard"
              className="hover:underline underline-offset-1"
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
      <div className="py-8">
        {" "}
        {content.contentType === "movie" ? (
          <CreateMovieForm initialData={content} />
        ) : (
          <CreateTvShowForm initialData={content} />
        )}
      </div>
    </div>
  );
}
