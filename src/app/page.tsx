import { Suspense } from "react";
import { ContentCatalog } from "@/components/content-catalog";
import { SearchAndFilters } from "@/components/search-and-filters";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  return (
    <main className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Discover Movies
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
          <ContentCatalog searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

function ContentCatalogSkeleton() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-[2/3] bg-muted rounded-md animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
