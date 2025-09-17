import { Suspense } from "react";
import {
  ContentCatalog,
  ContentCatalogSkeleton,
} from "@/components/content-components/content-catalog";
import { SearchAndFilters } from "@/components/content-components/search-and-filters";
import { getContent } from "@/lib/actions/content-complex-filtering-action";
import { Separator } from "@/components/ui/separator";
import {
  getPopularMovies,
  getPopularTv,
  getRecentMovies,
  getRecentTv,
} from "@/lib/actions/content-query-action";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  return (
    <main className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Home
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Browse and download your favorite movies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 space-y-8">
        <SearchAndFilters />

        <Suspense fallback={<ContentCatalogSkeleton />}>
          <HomeCatalog searchParams={searchParams} />
        </Suspense>
        {Object.keys(searchParams).length > 0 ? null : (
          <>
            <Suspense fallback={<ContentCatalogSkeleton />}>
              <PopularTvCatalog />
            </Suspense>
            <Suspense fallback={<ContentCatalogSkeleton />}>
              <PopularMovieCatalog />
            </Suspense>
            <Suspense fallback={<ContentCatalogSkeleton />}>
              <RecentTvCatalog />
            </Suspense>
            <Suspense fallback={<ContentCatalogSkeleton />}>
              <RecentMovieCatalog />
            </Suspense>
          </>
        )}
      </div>
    </main>
  );
}

async function HomeCatalog({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const content = await getContent(searchParams);
  const title = Object.keys(searchParams).length > 0 ? "Results" : "For you";
  if (content.length === 0) return null;
  return (
    <div className="space-y-6">
      <Separator />
      <h2 className="font-mono font-medium text-foreground">{title}</h2>
      <ContentCatalog contents={content} />
    </div>
  );
}

async function PopularTvCatalog() {
  const content = await getPopularTv(9);
  if (content.length === 0) return null;
  return (
    <div className="space-y-6">
      <Separator />
      <h2 className="font-mono font-medium text-foreground">
        Popular TV Shows
      </h2>
      <ContentCatalog contents={content} />
    </div>
  );
}
async function PopularMovieCatalog() {
  const content = await getPopularMovies(9);
  if (content.length === 0) return null;
  return (
    <div className="space-y-6">
      <Separator />
      <h2 className="font-mono font-medium text-foreground">Popular Movies</h2>
      <ContentCatalog contents={content} />
    </div>
  );
}
async function RecentTvCatalog() {
  const content = await getRecentTv(9);
  if (content.length === 0) return null;
  return (
    <div className="space-y-6">
      <Separator />
      <h2 className="font-mono font-medium text-foreground">Recent TV Shows</h2>
      <ContentCatalog contents={content} />
    </div>
  );
}
async function RecentMovieCatalog() {
  const content = await getRecentMovies(9);
  if (content.length === 0) return null;
  return (
    <div className="space-y-6">
      <Separator />
      <h2 className="font-mono font-medium text-foreground">Recent Movies</h2>
      <ContentCatalog contents={content} />
    </div>
  );
}
