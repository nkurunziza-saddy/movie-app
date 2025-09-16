import { Suspense } from "react";
import { ContentCard } from "@/components/content-card";
import { getPopularContent } from "@/lib/db/actions/queries/statistical";

export default async function PopularPage() {
  return (
    <main className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Popular Content
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Browse and download your favorite content
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Suspense fallback={<ContentCatalogSkeleton />}>
          <ContentCatalog />
        </Suspense>
      </div>
    </main>
  );
}

async function ContentCatalog() {
  const content = await getPopularContent();
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {content.map((ct) => (
        <ContentCard key={ct.id} content={ct} />
      ))}
    </div>
  );
}

function ContentCatalogSkeleton() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6">
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
