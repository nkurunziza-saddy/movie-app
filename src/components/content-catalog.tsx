import { ContentCard } from "@/components/content-card";
import { getContent } from "@/lib/db/actions/queries/basic";
import { Separator } from "./ui/separator";

interface ContentCatalogProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function ContentCatalog({ searchParams }: ContentCatalogProps) {
  const content = await getContent(searchParams);
  return (
    <div className="space-y-6">
      <Separator />

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
        {content.map((ct) => (
          <ContentCard key={ct.id} content={ct} />
        ))}
      </div>
    </div>
  );
}
