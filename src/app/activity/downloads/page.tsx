import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { requireAuth } from "@/lib/auth/server";
import { R2Image } from "@/components/r2-image";

export default async function DownloadsPage() {
  const session = await requireAuth();

  const downloads: any[] = [];

  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Download History
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                All your downloaded movies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Downloads ({downloads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {downloads.length === 0 ? (
              <div className="text-center py-8">
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
                      <R2Image
                        height={80}
                        width={60}
                        objectKey={download.content.posterKey}
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
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/content/${download.content.id}`}>
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
    </div>
  );
}
