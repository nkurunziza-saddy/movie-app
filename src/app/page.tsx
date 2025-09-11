import { Suspense } from "react";
import { MovieCatalog } from "@/components/content-catalog";
import { SearchAndFilters } from "@/components/search-and-filters";
import {
  TextContainer,
  TextDescription,
  TextTitle,
} from "@/components/ui/text";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  return (
    <main className="">
      <TextContainer>
        <TextTitle>Discover Movies</TextTitle>
        <TextDescription>
          Browse and download your favorite movies
        </TextDescription>
      </TextContainer>

      <SearchAndFilters />

      <Suspense fallback={<MovieCatalogSkeleton />}>
        <MovieCatalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

function MovieCatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
