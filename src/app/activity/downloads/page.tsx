import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { getUserDownloads } from "@/lib/db/actions/queries";
import Link from "next/link";
import {
  TextContainer,
  TextDescription,
  TextTitle,
} from "@/components/ui/text";
import Image from "next/image";

export default async function DownloadsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const downloads = await getUserDownloads(session.user.id);

  return (
    <div className="">
      <TextContainer>
        <TextTitle> Download History</TextTitle>
        <TextDescription>All your downloaded movies</TextDescription>
      </TextContainer>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Downloads ({downloads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {downloads.length === 0 ? (
            <div className="text-center py-8">
              <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No downloads yet</p>
              <Button asChild className="mt-4">
                <Link href="/">Browse Movies</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {downloads.map((download) => {
                if (!download.content) return null;
                return (
                  <div
                    key={download.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Image
                      height={80}
                      width={60}
                      src={
                        download.content.posterUrl ||
                        `/placeholder.svg?height=80&width=60&query=${encodeURIComponent(
                          download.content.title
                        )}`
                      }
                      alt={download.content.title}
                      className="w-12 h-18 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">
                        {download.content.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {download.downloadDate &&
                              new Date(
                                download.downloadDate
                              ).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {download.movie?.quality || download.episode?.quality}
                        </Badge>
                        <Badge variant="outline">
                          {download.movie?.fileSizeMb ||
                            download.episode?.fileSizeMb}{" "}
                          MB
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/movie/${download.content.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
