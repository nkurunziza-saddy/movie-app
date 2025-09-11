import { ContentCard } from "@/components/content-card";
import { TextContainer, TextTitle } from "./ui/text";
import { getContent } from "@/lib/db/actions/queries";

export async function MovieCatalog() {
  const content = await getContent();
  return (
    <div className="space-y-6">
      <TextContainer>
        <TextTitle>All content</TextTitle>
      </TextContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {content.map((ct) => (
          <ContentCard key={ct.id} content={ct} />
        ))}
      </div>
    </div>
  );
}
