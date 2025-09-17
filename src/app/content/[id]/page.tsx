import { notFound } from "next/navigation";
import Image from "next/image";
import { Share, Download, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewSection } from "@/components/review-section";
import Link from "next/link";
import { format } from "date-fns";
import { BookmarkButton } from "@/components/bookmark-button";
import { checkBookmark } from "@/lib/actions/bookmarks-action";
import { getContentWithDetails } from "@/lib/actions/content-query-action";
import { ContentViewer } from "@/components/content-components/content-viewer";

export default async function ContentPage(props: PageProps<"/content/[id]">) {
  const { id } = await props.params;
  const isBookmarked = await checkBookmark(id);
  const content = await getContentWithDetails(id);
  if (!content) {
    notFound();
  }

  const { movie, tvShow, reviews } = content;

  function calculateAverageRating() {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  }

  const averageRating = calculateAverageRating();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return num.toString();
  };

  return (
    <div className="sm:max-w-[90rem] mx-auto">
      <div className="sticky top-4 z-50 flex justify-center pt-2">
        <nav className="flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-md p-1 border">
          {[
            { name: "overview" },
            { name: "download" },
            { name: "reviews" },
          ].map(({ name }) => (
            <Link
              key={name}
              href={`#${name}`}
              className="flex items-center gap-1.5 px-4 py-1 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 capitalize"
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>

      <ContentViewer
        content={{
          contentType: content.contentType,
          description: content.description || "No description available.",
          genre: content.genre ? content.genre : [],
          id: content.id,
          posterUrl: content.posterUrl || "/placeholder.svg",
          releaseYear: content.releaseYear || new Date().getFullYear(),
          title: content.title,
          trailerUrl: content.trailerUrl || undefined,
        }}
      />

      <div id="download" className="max-w-4xl md:px-8 lg:px-16 py-4 md:py-12">
        <div className="flex flex-wrap items-center gap-4">
          {content.contentType === "movie" ? (
            <Button
              size={"sm"}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              <Download className="size-4 mr-2" />
              Download Movie
            </Button>
          ) : (
            <div className="grid gap-4 w-full">
              <h3 className="text-xl font-semibold mb-4">Episodes</h3>
              <div className="grid gap-3">
                {tvShow.seasons?.map((season) =>
                  season.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="bg-card rounded-lg p-4 border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{`S${season.seasonNumber}E${episode.episodeNumber} - ${episode.title}`}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {episode.description}
                          </p>
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <Button variant="outline" size="sm">
            <Share className="size-4 mr-1" />
            Share
          </Button>
          <BookmarkButton isBookmarked={isBookmarked} contentId={content.id} />
        </div>
      </div>

      <div className="md:px-8 lg:px-16 py-4 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div id="overview" className="lg:col-span-1">
            <div className="bg-card rounded-md p-6 border">
              <h3 className="font-medium mb-6 flex items-center gap-2">
                Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Upload Date</span>
                  <span className="font-medium text-foreground">
                    {format(new Date(content.uploadDate!), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Downloads</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-foreground">
                      {formatNumber(content.downloadCount || 0)}
                    </span>
                  </div>
                </div>
                {content.contentType === "movie" && movie && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="font-medium text-foreground">
                      {movie.fileSizeMb
                        ? `${Math.round(movie.fileSizeMb / 1000)}GB`
                        : "N/A"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">
                      {averageRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="reviews" className="lg:col-span-2">
            <ReviewSection contentId={content.id} reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
