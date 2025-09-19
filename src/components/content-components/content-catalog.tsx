import { ContentCard } from "@/components/content-components/content-card";
import { type ContentInterface } from "@/lib/db/schema";

interface ContentCatalogProps {
  contents: ContentInterface[];
  isBookmark?: boolean;
}

export function ContentCatalog({
  contents,
  isBookmark = false,
}: ContentCatalogProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {contents.map((ct) => (
        <ContentCard key={ct.id} content={ct} isBookmark={isBookmark} />
      ))}
    </div>
  );
}

export function ContentCatalogSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
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
