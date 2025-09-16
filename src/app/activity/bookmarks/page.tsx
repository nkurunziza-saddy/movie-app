import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { getUserBookmarks } from "@/lib/db/actions/queries/basic";
import Link from "next/link";
import Image from "next/image";

export default async function BookmarksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const bookmarks = await getUserBookmarks(session.user.id);

  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Bookmarked Movies
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your saved movies for later
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        {bookmarks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground mb-4">
                Start bookmarking movies you want to watch later
              </p>
              <Button asChild>
                <Link href="/">Browse Movies</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {bookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <Link href={`/content/${bookmark.content.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        width={200}
                        height={300}
                        src={
                          bookmark.content.posterUrl ||
                          `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(
                            bookmark.content.title
                          )}`
                        }
                        alt={bookmark.content.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="bg-background/70 rounded-full p-1">
                          <Bookmark className="h-4 w-4 text-foreground fill-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {bookmark.content.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{bookmark.content.releaseYear}</span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}