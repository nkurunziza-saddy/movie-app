import { Suspense } from "react";
import { getPopularContent } from "@/lib/actions/queries/statistical";
import {
  ContentCatalog,
  ContentCatalogSkeleton,
} from "@/components/content-components/content-catalog";

export default async function PopularPage() {
  return (
    <main className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Popular
              </h1>
              {/* <p className="text-sm text-muted-foreground mt-1">
                Browse and download your favorite content
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Suspense fallback={<ContentCatalogSkeleton />}>
          <PopularCatalog />
        </Suspense>
      </div>
    </main>
  );
}

async function PopularCatalog() {
  const content = await getPopularContent();
  return <ContentCatalog contents={content} />;
}
