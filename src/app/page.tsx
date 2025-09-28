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
import {
  FeaturedCarousel,
  FeaturedCarouselSkeleton,
} from "@/components/content-components/featured-carousel";
import { InstallPrompt } from "@/lib/install-prompt";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  return (
    <main className="">
      <div className="py-8 space-y-8">
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeatureCatalogServer />
        </Suspense>

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
      <InstallPrompt />
    </main>
  );
}

async function FeatureCatalogServer() {
  const featuredContent = await getPopularMovies(3);

  if (featuredContent.length === 0) return null;
  return <FeaturedCarousel featuredContent={featuredContent} />;
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
      <h2 className=" font-medium text-foreground">{title}</h2>
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
      <h2 className=" font-medium text-foreground">Popular TV Shows</h2>
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
      <h2 className=" font-medium text-foreground">Popular Movies</h2>
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
      <h2 className=" font-medium text-foreground">Recent TV Shows</h2>
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
      <h2 className=" font-medium text-foreground">Recent Movies</h2>
      <ContentCatalog contents={content} />
    </div>
  );
}
