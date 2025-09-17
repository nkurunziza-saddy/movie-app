import { Suspense } from "react";
import {
  ContentCatalog,
  ContentCatalogSkeleton,
} from "@/components/content-components/content-catalog";
import { SearchAndFilters } from "@/components/content-components/search-and-filters";
import { getContent } from "@/lib/actions/queries/basic";
import { Separator } from "@/components/ui/separator";

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
          <HomeCatalog searchParams={searchParams} />
        </Suspense>
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
  return (
    <div className="space-y-6">
      <Separator />
      <ContentCatalog contents={content} />
    </div>
  );
}
